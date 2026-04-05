/* ============================================================
   js/projects.js — Loads projects from Supabase, handles
                    filtering by search, category, and status.
   ============================================================ */

const el = (id) => document.getElementById(id);

let allProjects = [];

/* ── Skeletons ──────────────────────────────────────────────── */
function showSkeletons() {
  el('projects-grid').innerHTML = [1,2,3,4,5,6].map(() => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-screenshot"></div>
      <div class="skeleton-card-body">
        <div class="skeleton skeleton-line" style="height:10px;width:55%;border-radius:4px"></div>
        <div class="skeleton skeleton-line" style="height:16px;width:85%;border-radius:4px"></div>
        <div class="skeleton skeleton-line" style="height:12px;width:100%;border-radius:4px"></div>
        <div class="skeleton skeleton-line" style="height:12px;width:75%;border-radius:4px"></div>
      </div>
    </div>`).join('');
}

/* ── Badge helper ───────────────────────────────────────────── */
function badgeClass(status) {
  if (status === 'In Progress') return 'badge-inprogress';
  if (status === 'Archived')    return 'badge-archived';
  return 'badge-completed';
}

/* ── Render cards ───────────────────────────────────────────── */
function renderProjects(projects) {
  const grid = el('projects-grid');

  if (!projects.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <span>🔍</span>
        <p>No projects match your filters.</p>
      </div>`;
    return;
  }

  grid.innerHTML = projects.map(p => `
    <a class="project-card" href="project_detail.html?id=${p.id}" aria-label="${p.title}">
      <div class="card-screenshot">
        <img src="${p.screenshot || 'https://placehold.co/560x320/f0e8dc/999?text=No+Preview'}"
             alt="${p.title}" loading="lazy"
             onerror="this.src='https://placehold.co/560x320/f0e8dc/999?text=No+Preview'">
        <span class="card-status-badge ${badgeClass(p.status)}">${p.status}</span>
      </div>
      <div class="card-body">
        <div class="card-tags">
          ${p.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
        </div>
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.description}</div>
        <div class="card-footer">
          <span class="card-category">${p.category}</span>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </div>
      </div>
    </a>`).join('');
}

/* ── Filter logic ───────────────────────────────────────────── */
function applyFilters() {
  const search   = el('filter-search').value.toLowerCase().trim();
  const category = el('filter-category').value;
  const status   = el('filter-status').value;

  const filtered = allProjects.filter(p => {
    const matchSearch   = !search ||
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.tags.some(t => t.toLowerCase().includes(search));
    const matchCategory = !category || p.category === category;
    const matchStatus   = !status   || p.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  renderProjects(filtered);
}

/* ── Load from Supabase ─────────────────────────────────────── */
async function loadProjects() {
  const { data, error } = await db
    .from('projects')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    el('projects-grid').innerHTML = `
      <div class="empty-state">
        <span>⚠️</span>
        <p>Could not load projects. Please try again later.</p>
      </div>`;
    el('results-count').textContent = '';
    return;
  }

  allProjects = data;
  renderProjects(allProjects);
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showSkeletons();
  loadProjects();

  // Filter listeners
  el('filter-search').addEventListener('input', applyFilters);
  el('filter-category').addEventListener('change', applyFilters);
  el('filter-status').addEventListener('change', applyFilters);

  // Mark active nav
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === 'projects.html') link.classList.add('active');
  });
});