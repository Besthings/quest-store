// ─── Quest Store – Main Application JS ──────────────────────────────────────

// ─── Dropdown Helpers ───────────────────────────────────────────────────────
function toggleDropdown(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // Close all other dropdowns first
  document.querySelectorAll('[id$="-menu"]').forEach(m => {
    if (m.id !== id) m.classList.add('hidden');
  });
  el.classList.toggle('hidden');
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('#browse-dropdown')) {
    const m = document.getElementById('browse-menu');
    if (m) m.classList.add('hidden');
  }
  if (!e.target.closest('#profile-dropdown')) {
    const m = document.getElementById('profile-menu');
    if (m) m.classList.add('hidden');
  }
});

// ─── Mobile Menu ────────────────────────────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

// ─── Categories ─────────────────────────────────────────────────────────────
async function loadHeaderCategories() {
  const desktopCtn = document.getElementById('header-categories-desktop');
  const mobileCtn = document.getElementById('header-categories-mobile');
  if (!desktopCtn && !mobileCtn) return;

  try {
    const res = await axios.get('/api/categories');
    const categories = res.data;

    let desktopHtml = '';
    let mobileHtml = '';

    categories.forEach(cat => {
      desktopHtml += `
        <a href="/?category=${cat.slug}" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-blue-600/10 hover:text-blue-300 transition-colors">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          ${cat.category_name}
        </a>`;
      
      mobileHtml += `
        <a href="/?category=${cat.slug}" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          ${cat.category_name}
        </a>`;
    });

    if (desktopCtn) desktopCtn.innerHTML = desktopHtml;
    if (mobileCtn) mobileCtn.innerHTML = mobileHtml;
  } catch (err) {
    console.error('Failed to load header categories:', err);
  }
}

// ─── Favorites ──────────────────────────────────────────────────────────────
let userFavorites = [];
async function fetchUserFavorites() {
  try {
    const res = await axios.get('/api/favorites');
    userFavorites = res.data.filter(g => g !== null).map(g => g.id);
  } catch (err) {
    userFavorites = [];
  }
}

async function toggleFavorite(gameId, btnEl) {
  const numericId = parseInt(gameId);
  const icon = btnEl?.querySelector('i, svg');
  const wasFavorited = userFavorites.includes(numericId);
  
  // Optimistic UI update
  if (icon) {
    if (!wasFavorited) {
      icon.classList.add('fill-red-500', 'text-red-500');
    } else {
      icon.classList.remove('fill-red-500', 'text-red-500');
    }
  }

  try {
    const res = await axios.post('/api/favorites/toggle', { game_id: numericId });
    const isFavoritedFromServer = res.data.isFavorited;
    
    // Sync with server state
    if (isFavoritedFromServer) {
      if (!userFavorites.includes(numericId)) userFavorites.push(numericId);
      Toast.success('Added to favorites');
    } else {
      userFavorites = userFavorites.filter(id => id !== numericId);
      Toast.info('Removed from favorites');
    }

    // Double check UI matches server response
    if (icon) {
      if (isFavoritedFromServer) {
        icon.classList.add('fill-red-500', 'text-red-500');
      } else {
        icon.classList.remove('fill-red-500', 'text-red-500');
      }
    }
    return res.data;
  } catch (err) {
    // Revert optimistic update on error
    if (icon) {
      if (wasFavorited) {
        icon.classList.add('fill-red-500', 'text-red-500');
      } else {
        icon.classList.remove('fill-red-500', 'text-red-500');
      }
    }

    if (err.response?.status === 401) {
      Toast.error('Please login to favorite games');
    } else {
      Toast.error('Failed to update favorite');
    }
    throw err;
  }
}

// ─── Re-initialize Lucide icons after dynamic content ───────────────────────
function refreshIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ─── Initialize ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadHeaderCategories();
  fetchUserFavorites();
});

// ─── Auth ───────────────────────────────────────────────────────────────────
async function handleLogin(email, password) {
  try {
    const res = await axios.post('/api/users/login', { email, password });
    if (res.data.token) {
      // Store token in cookie for page routes
      document.cookie = `token=${res.data.token}; path=/; max-age=86400`;
      Toast.success('Welcome back!');
      setTimeout(() => window.location.href = '/', 600);
    }
  } catch (err) {
    Toast.error(err.response?.data?.error || 'Login failed');
  }
}

async function handleLogout() {
  try {
    // Clear token cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    Toast.info('Logged out successfully');
    setTimeout(() => window.location.href = '/', 600);
  } catch { window.location.href = '/'; }
}

// ─── Cart ───────────────────────────────────────────────────────────────────
async function addToCart(gameId) {
  try {
    await axios.post('/api/cart', { gameId });
    Toast.success('Added to cart!');
    // Update cart badge without reload
    try {
      const cartRes = await axios.get('/api/cart');
      const count = cartRes.data ? cartRes.data.length : 0;
      let badge = document.querySelector('[data-cart-badge]');
      if (count > 0) {
        if (!badge) {
          // Create badge if it doesn't exist
          const cartBtn = document.querySelector('button[onclick="toggleCartDrawer()"]');
          if (cartBtn) {
            badge = document.createElement('span');
            badge.setAttribute('data-cart-badge', '');
            badge.className = 'absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold flex items-center justify-center shadow-lg shadow-blue-500/50';
            badge.style.color = 'white';
            cartBtn.appendChild(badge);
          }
        }
        if (badge) {
          badge.textContent = count;
          badge.classList.remove('hidden');
          badge.style.color = 'white';
        }
      } else {
        if (badge) badge.classList.add('hidden');
      }
    } catch (_) {}
    // Refresh drawer if open
    const drawerOverlay = document.getElementById('cart-drawer-overlay');
    if (drawerOverlay && !drawerOverlay.classList.contains('hidden')) {
      loadCartDrawer();
    }
  } catch (err) {
    if (err.response?.status === 401) {
      Toast.error('Please login to add items to cart');
      setTimeout(() => window.location.href = '/login', 1000);
    } else {
      Toast.error('Failed to add to cart');
    }
  }
}

async function removeFromCart(gameId) {
  try {
    await axios.delete(`/api/cart/${gameId}`);
    Toast.success('Removed from cart');
    location.reload();
  } catch { Toast.error('Failed to remove item'); }
}

async function clearCart() {
  try {
    await axios.delete('/api/cart');
    Toast.info('Cart cleared');
    location.reload();
  } catch { Toast.error('Failed to clear cart'); }
}

async function handleCheckout() {
  const btn = document.getElementById('pay-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader-2" class="h-5 w-5 animate-spin"></i> Processing...';
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
  }
  try {
    await axios.post('/api/cart/checkout');
    // Show success
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="min-h-[70vh] flex items-center justify-center">
          <div class="text-center space-y-4">
            <div class="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto animate-bounce">
              <i data-lucide="check-circle" class="h-10 w-10 text-green-400"></i>
            </div>
            <h2 class="text-2xl font-black text-white">Payment Successful!</h2>
            <p class="text-gray-400">Your keys are ready. Redirecting to your profile...</p>
          </div>
        </div>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    setTimeout(() => window.location.href = '/profile?tab=keys', 2500);
  } catch (err) {
    Toast.error(err.response?.data?.error || 'Checkout failed');
    if (btn) { 
      btn.disabled = false; 
      btn.innerHTML = '<i data-lucide="lock" class="h-4 w-4"></i> Pay Now <i data-lucide="chevron-right" class="h-4 w-4"></i>'; 
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [btn] });
    }
  }
}

// ─── Cart Drawer ────────────────────────────────────────────────────────────
async function toggleCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!overlay) return;
  if (!overlay.classList.contains('hidden')) { closeCartDrawer(); return; }
  overlay.classList.remove('hidden');
  overlay.classList.remove('cart-drawer-closing');
  loadCartDrawer();
}

function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!overlay) return;
  overlay.classList.add('cart-drawer-closing');
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.classList.remove('cart-drawer-closing');
  }, 250);
}

async function loadCartDrawer() {
  const body = document.getElementById('cart-drawer-body');
  const subtotalEl = document.getElementById('cart-drawer-subtotal');
  if (!body) return;

  body.innerHTML = '<div class="flex items-center justify-center py-16"><i data-lucide="loader-2" class="h-6 w-6 animate-spin text-blue-400"></i></div>';
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [body] });

  try {
    const res = await axios.get('/api/cart');
    const cartItems = res.data; // [{gameId, quantity, game}]

    if (!cartItems || cartItems.length === 0) {
      body.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <i data-lucide="shopping-cart" class="h-12 w-12 text-gray-600 mb-3"></i>
          <p class="text-gray-400 text-sm">Your cart is empty</p>
          <p class="text-gray-500 text-xs mt-1">Browse games and add them to your cart</p>
        </div>`;
      if (subtotalEl) subtotalEl.textContent = '฿0';
      if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [body] });
      return;
    }

    let subtotal = 0;
    let html = '';
    cartItems.forEach((item) => {
      const g = item.game;
      if (!g) return;
      const dp = g.discount ? Math.round(g.price * (1 - g.discount / 100)) : g.price;
      const lineTotal = dp * item.quantity;
      subtotal += lineTotal;
      const imageUrl = g.image_url || '/images/arcraider.jpg';
      html += `
        <div class="flex gap-3 p-3 rounded-xl border" style="background:var(--bg-card);border-color:var(--border-card)">
          <img src="${imageUrl}" alt="${g.title}" class="w-16 h-20 rounded-lg object-cover flex-shrink-0 border border-white/10" />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-body truncate">${g.title}</h4>
            <p class="text-xs text-gray-400 mt-0.5">Qty: ${item.quantity}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">฿${dp.toLocaleString()}</span>
              ${g.discount ? `<span class="text-[10px] text-gray-500 line-through">฿${g.price.toLocaleString()}</span>` : ''}
            </div>
          </div>
          <button onclick="removeFromCartDrawer('${item.game_id || item.gameId}')" class="self-start p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0" title="Remove">
            <i data-lucide="trash-2" class="h-4 w-4"></i>
          </button>
        </div>`;
    });
    body.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = '฿' + subtotal.toLocaleString();
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [body] });
  } catch (err) {
    body.innerHTML = '<p class="text-center text-gray-400 text-sm py-10">Please login to view cart</p>';
  }
}

async function removeFromCartDrawer(gameId) {
  try {
    await axios.delete(`/api/cart/${gameId}`);
    // Update badge
    const badge = document.querySelector('[data-cart-badge]');
    if (badge) {
      const count = parseInt(badge.textContent || '1') - 1;
      if (count <= 0) badge.classList.add('hidden');
      else badge.textContent = count;
    }
    loadCartDrawer();
  } catch { Toast.error('Failed to remove item'); }
}

// ─── Theme Toggle ───────────────────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  html.classList.remove('dark', 'light');
  const next = isDark ? 'light' : 'dark';
  html.classList.add(next);
  localStorage.setItem('qs-theme', next);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ─── Quick View Modal ───────────────────────────────────────────────────────
async function openQuickView(gameId) {
  const modal = document.getElementById('quick-view-modal');
  const body  = document.getElementById('quick-view-body');
  if (!modal || !body) return;

  // Show modal with loading spinner
  body.innerHTML = `<div class="flex items-center justify-center py-20"><i data-lucide="loader-2" class="h-8 w-8 animate-spin text-blue-400"></i></div>`;
  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [body] });

  try {
    const res = await axios.get(`/api/games/${gameId}`);
    const g = res.data.game || res.data; // Handle both direct game and {game, related} response
    const stock = g.stock_quantity || 0;

    const inStock = stock > 0;
    const stockColor = inStock ? 'text-green-400' : 'text-red-400';
    const stockText  = inStock ? `In Stock (${stock})` : 'Out of Stock';

    const dp = g.discount ? Math.round(g.price * (1 - g.discount / 100)) : g.price;
    const imageUrl = g.image_url || '/images/arcraider.jpg';

    body.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Image -->
        <div class="md:w-1/2 flex-shrink-0">
          <img src="${imageUrl}" alt="${g.title}" class="w-full rounded-xl object-cover aspect-[3/4] border border-white/10" />
        </div>
        <!-- Info -->
        <div class="md:w-1/2 flex flex-col gap-4">
          <div>
            <h2 class="text-2xl font-black text-body">${g.title}</h2>
            ${g.rating ? `<div class="flex items-center gap-1 mt-1"><i data-lucide="star" class="h-4 w-4 text-yellow-400 fill-yellow-400"></i><span class="text-sm text-gray-400">${g.rating}</span></div>` : ''}
          </div>
          <p class="text-sm text-gray-300 leading-relaxed">${g.description || 'No description available.'}</p>
          <div class="flex items-baseline gap-2 mt-auto">
            <span class="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">฿${dp.toLocaleString()}</span>
            ${g.discount ? `<span class="text-sm text-gray-500 line-through">฿${g.price.toLocaleString()}</span>` : ''}
          </div>
          <p class="text-xs font-medium ${stockColor}"><i data-lucide="${inStock ? 'check-circle' : 'x-circle'}" class="inline h-3.5 w-3.5 mr-1"></i>${stockText}</p>
          <div class="flex gap-3 mt-2">
            ${inStock ? `<button onclick="addToCart('${g.id}');closeQuickView()" class="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all flex items-center justify-center gap-2"><i data-lucide="shopping-cart" class="h-4 w-4"></i> Add to Cart</button>` : ''}
            <a href="/cart" class="flex-1 py-3 rounded-xl font-bold text-sm border border-white/10 hover:bg-white/5 text-center transition-all flex items-center justify-center gap-2 text-body"><i data-lucide="arrow-right" class="h-4 w-4"></i> Go to Cart</a>
          </div>
        </div>
      </div>`;
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [body] });
  } catch (err) {
    body.innerHTML = `<p class="text-center text-red-400 py-10">Failed to load game details.</p>`;
  }
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.add('hidden');
}

// ─── Re-initialize Lucide icons after dynamic content ───────────────────────
function refreshIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}
