const API_BASE = 'http://localhost:5001/api';

const api = {
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`);
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  },
  async put(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  },
  async patch(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  },
  async delete(path) {
    const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE' });
    return res.json();
  }
};

// Toast notification utility
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const colors = { 
    success: 'var(--accent)', 
    error: 'var(--danger)', 
    warn: 'var(--warn)', 
    info: 'var(--info)' 
  };
  toast.style.cssText = `
    position: fixed; bottom: 32px; right: 32px; z-index: 9999;
    background: ${colors[type]}; color: #fff;
    padding: 14px 24px; border-radius: 12px;
    font-size: 14px; font-weight: 600;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: slideInUp 0.3s cubic-bezier(0, 0, 0.2, 1);
    font-family: var(--font-body);
    display: flex; align-items: center; gap: 12px;
  `;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warn' ? '⚠' : 'ℹ';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Format date utility
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - Date.now()) / (1000 * 60 * 60 * 24));
}

function timeSince(dateStr) {
  if (!dateStr) return 'never';
  const secs = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function statusBadge(status) {
  const map = {
    free: 'badge-green', 'in-use': 'badge-info',
    maintenance: 'badge-warn', offline: 'badge-gray',
    active: 'badge-green', expired: 'badge-danger',
    warn: 'badge-warn', critical: 'badge-danger',
    open: 'badge-warn', 'in-progress': 'badge-info',
    resolved: 'badge-green', closed: 'badge-gray',
    high: 'badge-danger', medium: 'badge-warn', low: 'badge-info'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

// Modal helpers
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Live clock
function startClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const tick = () => el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  tick(); setInterval(tick, 1000);
}

// Confirm dialog
function confirmAction(msg, onConfirm) {
  if (confirm(msg)) onConfirm();
}

// Update sidebar maintenance badge
async function updateSidebarBadge() {
  const el = document.getElementById('sidebarTickets');
  if (!el) return;
  try {
    const res = await api.get('/maintenance/stats/summary');
    const mx = res.data;
    el.textContent = mx.open + mx.inProgress;
  } catch (e) { console.error('Failed to update sidebar badge'); }
}

// Add animation to CSS
if (!document.getElementById('api-animations')) {
  const style = document.createElement('style');
  style.id = 'api-animations';
  style.textContent = `
    @keyframes slideInUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
