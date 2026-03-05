// ─── Toast Notification System ──────────────────────────────────────────────

window.Toast = {
  show(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
      success: 'bg-green-600 border-green-500',
      error:   'bg-red-600 border-red-500',
      info:    'bg-blue-600 border-blue-500',
      warning: 'bg-yellow-600 border-yellow-500',
    };

    const icons = {
      success: 'check-circle',
      error:   'x-circle',
      info:    'info',
      warning: 'alert-triangle',
    };

    const el = document.createElement('div');
    el.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium toast-enter ${colors[type] || colors.info}`;
    el.style.color = '#ffffff';
    el.innerHTML = `
      <i data-lucide="${icons[type] || icons.info}" class="h-4 w-4 shrink-0" style="color:white"></i>
      <span class="flex-1" style="color:white">${message}</span>
      <button onclick="this.closest('div').remove()" class="shrink-0 opacity-60 hover:opacity-100" style="color:white">
        <i data-lucide="x" class="h-3.5 w-3.5" style="color:white"></i>
      </button>
    `;
    container.appendChild(el);
    lucide.createIcons({ nodes: [el] });

    setTimeout(() => {
      el.classList.remove('toast-enter');
      el.classList.add('toast-exit');
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg)   { this.show(msg, 'error'); },
  info(msg)    { this.show(msg, 'info'); },
  warning(msg) { this.show(msg, 'warning'); },
};
