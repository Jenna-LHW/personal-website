/* ============================================================
   js/project-detail.js — Loads a single project from Supabase.
   Layout: LEFT = photo + info sidebar | RIGHT = content card
   ============================================================ */

const el = (id) => document.getElementById(id);

/* ── Skeletons ──────────────────────────────────────────────── */
function showSkeletons() {
  el('detail-sidebar').innerHTML = `
    <div class="skeleton skeleton-screenshot"></div>
    <div class="skeleton skeleton-sidebar-card"></div>
    <div class="skeleton skeleton-sidebar-card"></div>`;

  el('detail-main').innerHTML = `
    <div class="skeleton skeleton-main"></div>`;
}

/* ── Status pill ────────────────────────────────────────────── */
function statusPill(status) {
  const cls = status === 'In Progress' ? 'pill-inprogress'
            : status === 'Archived'    ? 'pill-archived'
            : 'pill-completed';
  return `<span class="status-pill ${cls}">${status}</span>`;
}

/* ── Render ─────────────────────────────────────────────────── */
function renderProject(p) {
  document.title = `${p.title} · Jenna Li Hoi Wah`;

  // ── LEFT SIDEBAR ────────────────────────────────────────────
  el('detail-sidebar').innerHTML = `
    <!-- Screenshot -->
    <div class="detail-screenshot">
      <img src="${p.screenshot || 'https://placehold.co/600x450/f0e8dc/999?text=No+Preview'}"
           alt="${p.title}"
           onerror="this.src='https://placehold.co/600x450/f0e8dc/999?text=No+Preview'">
    </div>

    <!-- Project Info -->
    <div class="sidebar-card">
      <div class="sidebar-card-title">Project Info</div>
      <div class="sidebar-status-row">
        <span class="sidebar-status-key">Status</span>
        ${statusPill(p.status)}
      </div>
      <div class="sidebar-status-row">
        <span class="sidebar-status-key">Category</span>
        <span class="sidebar-status-val">${p.category}</span>
      </div>
      <div class="sidebar-status-row">
        <span class="sidebar-status-key">Year</span>
        <span class="sidebar-status-val">${new Date(p.created_at).getFullYear()}</span>
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="sidebar-card">
      <div class="sidebar-card-title">Tech Stack</div>
      <div class="sidebar-tags">
        ${p.tags.map(t => `<span class="sidebar-tag">${t}</span>`).join('')}
      </div>
    </div>`;

  // ── RIGHT MAIN CONTENT ───────────────────────────────────────
  const featuresHTML = p.features?.length
    ? `<ul class="features-list">
         ${p.features.map(f => `<li>${f}</li>`).join('')}
       </ul>`
    : '';

  const githubBtn = p.github_url
    ? `<a href="${p.github_url}" target="_blank" rel="noopener" class="link-btn">
         <svg viewBox="0 0 24 24"><path fill="var(--cream)" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
         View GitHub
       </a>`
    : '';

  const liveBtn = p.live_url
    ? `<a href="${p.live_url}" target="_blank" rel="noopener" class="link-btn">
         <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
         View Demo
       </a>`
    : '';

  const linksHTML = githubBtn || liveBtn
    ? `<div class="detail-divider"></div>
       <div class="detail-links">${githubBtn}${liveBtn}</div>`
    : '';

  el('detail-main').innerHTML = `
    <!-- Title -->
    <div>
      <div class="detail-category-label">${p.category} Project</div>
      <h1 class="detail-title">${p.title}</h1>
    </div>

    <div class="detail-divider"></div>

    <!-- Description -->
    <div>
      <div class="detail-section-label">Description</div>
      <div class="detail-description">
        ${(p.long_description || p.description)
          .split('\n\n')
          .map(para => `<p>${para.trim()}</p>`)
          .join('')}
      </div>
    </div>

    ${featuresHTML ? `
    <div class="detail-divider"></div>
    <div>
      <div class="detail-section-label">Key Features</div>
      ${featuresHTML}
    </div>` : ''}

    ${linksHTML}`;
}

/* ── Not found ──────────────────────────────────────────────── */
function renderNotFound() {
  document.querySelector('.detail-wrapper').innerHTML = `
    <div class="not-found">
      <h2>Project not found</h2>
      <p>The project you're looking for doesn't exist or has been removed.</p>
      <a href="projects.html">← Back to Projects</a>
    </div>`;
}

/* ── Load ───────────────────────────────────────────────────── */
async function loadProject() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { renderNotFound(); return; }

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) { renderNotFound(); return; }
  renderProject(data);
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showSkeletons();
  loadProject();

  el('back-btn').addEventListener('click', () => {
    if (document.referrer.includes('projects.html')) {
      history.back();
    } else {
      window.location.href = 'projects.html';
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === 'projects.html') link.classList.add('active');
  });
});