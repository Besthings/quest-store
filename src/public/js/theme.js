// Theme toggle logic extracted to its own file

// ** Run immediately on load (before DOM ready) to prevent flash **
(function () {
  // Check system preference first, then localStorage
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const stored = localStorage.getItem('theme');
  const theme = stored || (prefersDark ? 'dark' : 'light');

  console.log('[Theme] Initial:', { stored, prefersDark, resolved: theme });

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

// ** Setup toggle button when DOM is ready **
document.addEventListener("DOMContentLoaded", function () {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  const updateIcon = () => {
    if (themeIcon) {
      themeIcon.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    }
  };

  const applyTheme = theme => {
    console.log('[Theme] Applying:', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
    
    console.log('[Theme] Class contains dark?', document.documentElement.classList.contains('dark'));
    updateIcon();
  };

  // Update icon on load
  updateIcon();

  // Toggle theme on button click
  if (themeBtn) {
    themeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const currentlyDark = document.documentElement.classList.contains('dark');
      const newTheme = currentlyDark ? 'light' : 'dark';
      console.log('[Theme] Toggling from', currentlyDark ? 'dark' : 'light', 'to', newTheme);
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  }
});