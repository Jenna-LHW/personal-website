/* ============================================================
   js/contact.js — Loads contact links from Supabase,
                   handles form submission via Netlify function.
   ============================================================ */

const el = (id) => document.getElementById(id);

/* ── SVG icons map ──────────────────────────────────────────── */
const ICONS = {
  email: `<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>`,
  github: `<svg class="filled" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="8" y1="11" x2="8" y2="17"/><line x1="8" y1="7" x2="8" y2="8"/><path d="M12 11v6M12 11a3 3 0 016 0v6"/></svg>`,
  location: `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
};

/* ── Skeletons ──────────────────────────────────────────────── */
function showLinkSkeletons() {
  el('contact-links').innerHTML = [1,2,3,4].map(() =>
    `<div class="skeleton skeleton-link-card"></div>`).join('');
}

/* ── Load contact links ─────────────────────────────────────── */
async function loadContactLinks() {
  const { data, error } = await db
    .from('contact_links')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    el('contact-links').innerHTML = `<p style="color:var(--gray-400);font-size:.875rem">Could not load contact info.</p>`;
    return;
  }

  el('contact-links').innerHTML = data.map(item => {
    const isLink = !!item.href;
    const tag = isLink ? 'a' : 'div';
    const attrs = isLink
      ? `href="${item.href}" target="_blank" rel="noopener noreferrer"`
      : '';

    return `
      <${tag} ${attrs} class="contact-link-card ${!isLink ? 'no-link' : ''}">
        <div class="link-icon">${ICONS[item.icon] || ICONS.email}</div>
        <div>
          <div class="link-text-label">${item.label}</div>
          <div class="link-text-value">${item.value}</div>
        </div>
      </${tag}>`;
  }).join('');
}

/* ── Toast helper ───────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const toast = el('toast');
  toast.textContent = type === 'success' ? `✓  ${msg}` : `✕  ${msg}`;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast'; }, 4000);
}

/* ── Form submission ────────────────────────────────────────── */
function initForm() {
  const form    = el('contact-form');
  const btn     = el('submit-btn');
  const btnText = el('btn-text');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = el('f-name').value.trim();
    const email   = el('f-email').value.trim();
    const subject = el('f-subject').value.trim();
    const message = el('f-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // Loading state
    btn.disabled = true;
    btnText.textContent = 'Sending…';

    try {
      const res = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send.');

      showToast('Message sent! I\'ll get back to you soon.');
      form.reset();
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Send Message →';
    }
  });
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showLinkSkeletons();
  loadContactLinks();
  initForm();

  // Mark active nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === 'contact.html') {
      link.classList.add('active');
    }
  });
});