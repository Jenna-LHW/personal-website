/* ============================================================
   js/projects.js — Loads projects from Supabase, handles
                    filtering by search, category, and status.
   ============================================================ */

const el = (id) => document.getElementById(id);

let allProjects = [];

/* ── Skeletons ──────────────────────────────────────────────── */
function showSkeletons() {
  el('projects-grid').innerHTML = [1,2,3,4,5,6].map(() =>
    `<div class="skeleton skeleton-project-card"></div>`).join('');
}

/* ── Status class helper ────────────────────────────────────── */
function statusClass(status) {
  if (status === 'In Progress') return 'status-inprogress';
  if (status === 'Archived')    return 'status-archived';
  return 'status-completed';
}

/* ── Render cards ───────────────────────────────────────────── */
function renderProjects(projects) {
  const grid = el('projects-grid');
  const count = el('results-count');

  count.textContent = `${projects.length} project${projects.length !== 1 ? 's' : ''} found`;

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
      <div class="project-thumb">
        <img src="${p.screenshot || 'https://placehold.co/560x320/EEF0F6/7B82A0?text=No+Preview'}"
             alt="${p.title}" loading="lazy"
             onerror="this.src='https://placehold.co/560x320/EEF0F6/7B82A0?text=No+Preview'">
      </div>
      <div class="project-body">
        <div class="project-header">
          <div class="project-title">${p.title}</div>
          <span class="project-status ${statusClass(p.status)}">${p.status}</span>
        </div>
        <div class="project-desc">${p.description}</div>
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          <span class="project-link">
            View Project
            <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
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
      (p.tags || []).some(t => t.toLowerCase().includes(search));
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
      <div class="error-state">
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

  el('filter-search').addEventListener('input', applyFilters);
  el('filter-category').addEventListener('change', applyFilters);
  el('filter-status').addEventListener('change', applyFilters);
});
