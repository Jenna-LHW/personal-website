/* ============================================================
   js/characters.js — Loads the secret cast from Supabase and
                      renders a roster strip + single detail panel
                      (click a thumbnail, or use ←/→, to switch).

   Assumed schema — adjust field names below if yours differ:

   characters(
     id uuid/int pk,
     name text,
     tagline text,
     bio text,
     avatar_url text,     -- optional; falls back to first initial
     accent_color text,   -- optional hex, e.g. '#4ce6ff'; falls back to cyan
     sort_order int
   )
   ============================================================ */

const el = (id) => document.getElementById(id);

let cast = [];
let activeIndex = 0;

function slugId(i) {
  return 'unit_' + String(i + 1).padStart(2, '0');
}

function avatarHTML(c, sizeClass) {
  if (c.avatar_url) {
    return `<img src="${c.avatar_url}" alt="${c.name}">`;
  }
  const initial = (c.name || '?').trim().charAt(0).toUpperCase();
  return `<span class="${sizeClass}">${initial}</span>`;
}

/* ── Roster strip ───────────────────────────────────────────── */
function renderRoster() {
  const roster = el('cast-roster');
  roster.innerHTML = cast.map((c, i) => `
    <button class="cast-thumb ${i === activeIndex ? 'is-active' : ''}"
            style="--char-accent:${c.accent_color || 'var(--cyan)'}"
            data-index="${i}" aria-label="${c.name}">
      <span class="cast-thumb-avatar">${avatarHTML(c, 'cast-thumb-fallback')}</span>
    </button>
  `).join('');

  roster.querySelectorAll('.cast-thumb').forEach(btn => {
    btn.addEventListener('click', () => selectCharacter(Number(btn.dataset.index)));
  });
}

/* ── Detail panel ───────────────────────────────────────────── */
function renderPanel(animate) {
  const body = el('cast-panel-body');
  const path = el('cast-panel-path');
  const c = cast[activeIndex];
  if (!c) return;

  path.textContent = `~/cast/${slugId(activeIndex)}`;

  body.innerHTML = `
    <div class="cast-inner">
      <div class="cast-avatar" style="--char-accent:${c.accent_color || 'var(--cyan)'}">
        ${avatarHTML(c, 'cast-avatar-fallback')}
      </div>
      <div class="cast-text">
        <p class="cast-id"><b>${slugId(activeIndex).toUpperCase()}</b> · ${activeIndex + 1} of ${cast.length}</p>
        <h2 class="cast-name">${c.name}</h2>
        ${c.tagline ? `<p class="cast-tagline">${c.tagline}</p>` : ''}
        <div class="cast-divider"></div>
        <p class="cast-bio">${c.bio || ''}</p>
      </div>
    </div>`;

  if (animate) {
    body.classList.remove('is-swapping');
    void body.offsetWidth; // restart animation
    body.classList.add('is-swapping');
  }
}

function selectCharacter(i) {
  if (i === activeIndex || !cast[i]) return;
  activeIndex = i;
  renderRoster();
  renderPanel(true);
}

/* ── Keyboard navigation ────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (!cast.length) return;
  if (e.key === 'ArrowRight') selectCharacter((activeIndex + 1) % cast.length);
  if (e.key === 'ArrowLeft')  selectCharacter((activeIndex - 1 + cast.length) % cast.length);
});

/* ── Load from Supabase ─────────────────────────────────────── */
async function loadCast() {
  const { data, error } = await db
    .from('characters')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    el('cast-select').innerHTML = `
      <div class="error-state" style="text-align:center;padding:40px;color:var(--slate-dim);font-family:var(--font-mono);font-size:13px;">
        <span style="font-size:26px;display:block;margin-bottom:10px;">⚠️</span>
        could not load the cast.
      </div>`;
    return;
  }

  cast = data;
  renderRoster();
  renderPanel(false);
}

document.addEventListener('DOMContentLoaded', loadCast);