/* ============================================================
   js/characters.js — Loads the cast for the secret /characters page.

   Expected schema:
   characters(id uuid pk, name text, tagline text, bio text,
              avatar_url text, accent_hex text default '#4ce6ff',
              sort_order int default 0)
   ============================================================ */

const el = (id) => document.getElementById(id);

function emptyState(msg) {
  return `<p style="font-family:var(--font-mono);font-size:13px;color:var(--slate-dim);">${msg}</p>`;
}

async function loadCharacters() {
  const container = el('char-grid');
  const { data, error } = await db
    .from('characters')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    container.innerHTML = emptyState(error ? 'could not load the cast. try again later.' : 'no one has moved in yet.');
    return;
  }

  container.innerHTML = data.map((c, i) => {
    const accent = c.accent_hex || '#4ce6ff';
    const avatar = c.avatar_url
      ? `<img src="${c.avatar_url}" alt="${c.name}">`
      : `<span class="char-avatar-fallback">?</span>`;
    return `
      <article class="char-card reveal" style="--char-accent:${accent}; transition-delay:${i * 60}ms;">
        <div class="char-id">#${String(i + 1).padStart(2, '0')}</div>
        <div class="char-avatar">${avatar}</div>
        <h3 class="char-name glitch" data-text="${c.name}">${c.name}</h3>
        <p class="char-tagline">${c.tagline || ''}</p>
        <p class="char-bio">${c.bio || ''}</p>
      </article>
    `;
  }).join('');

  window.GlitchUI?.refresh(container);
}

document.addEventListener('DOMContentLoaded', loadCharacters);