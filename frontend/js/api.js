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
  const colors = { success: '#1D9E75', error: '#A32D2D', warn: '#BA7517', info: '#185FA5' };
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: ${colors[type]}; color: #fff;
    padding: 12px 20px; border-radius: 10px;
    font-size: 13px; font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
    font-family: 'DM Sans', sans-serif;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
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
