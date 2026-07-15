/* ============================================================
   js/projects.js — Loads projects from Supabase.

   Default view (no filters active): grouped into three tiers
   ("Banger" / "Middle" / "Random") driven by a `tier` column
   on the projects table — each presented by Glitch, alternating
   left/right.

   Filtered view (search / category / status applied): a single
   flat results grid, no tiers.
   ============================================================ */

const el = (id) => document.getElementById(id);

let allProjects = [];

/* ── Glitch's own made-up tiers (default view only) ────────────
   Driven by a `tier` column on `projects` (text: 'Banger' | 'Middle' | 'Random').
   Anything null/unrecognized falls into "random stuff jenna made". ──── */
const GLITCH_TIERS = [
  {
    title: "certified bangers",
    mascot: 'glitch-mascot-2.png',
    line: "These ones? Genuinely a banger. No notes.",
    test: (p) => p.tier === 'Banger'
  },
  {
    title: "solid middle ground",
    mascot: 'glitch-mascot-2.png',
    line: "Still cooking, but already pretty decent.",
    test: (p) => p.tier === 'Middle'
  },
  {
    title: "random stuff jenna made",
    mascot: 'glitch-mascot-2.png',
    line: "No idea what category this is. Neither does she.",
    test: (p) => p.tier !== 'Banger' && p.tier !== 'Middle'
  }
];

/* ── Skeletons ──────────────────────────────────────────────── */
function showSkeletons() {
  el('projects-sections').innerHTML = `
    <div class="proj-grid">
      ${[1,2,3,4,5,6].map(() => `<div class="skeleton skeleton-project-card"></div>`).join('')}
    </div>`;
}

/* ── Status class helper ────────────────────────────────────── */
function statusClass(status) {
  if (status === 'In Progress') return 'status-inprogress';
  if (status === 'Archived')    return 'status-archived';
  return 'status-completed';
}

/* ── Card template ──────────────────────────────────────────── */
function cardHTML(p) {
  return `
    <a class="project-card" href="project_detail.html?id=${p.id}" aria-label="${p.title}">
      <img class="project-thumb-img"
           src="${p.screenshot || 'https://placehold.co/560x420/0a0f2b/4ce6ff?text=The+Glitch'}"
           alt="${p.title}" loading="lazy"
           onerror="this.src='https://placehold.co/560x420/0a0f2b/4ce6ff?text=The+Glitch'">
      <div class="project-overlay">
        <div class="project-title-row">
          <div class="project-title">${p.title}</div>
          <span class="project-arrow">
            <svg viewBox="0 0 24 24"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="8 5 19 5 19 16"/></svg>
          </span>
        </div>
      </div>
    </a>`;
}

/* ── Populate the category filter dropdown from live data ────── */
function populateCategoryFilter() {
  const select = el('filter-category');
  if (!select || select.dataset.populated) return;

  const categories = [...new Set(allProjects.map(p => p.category).filter(Boolean))].sort();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.toLowerCase();
    select.appendChild(opt);
  });
  select.dataset.populated = '1';
}

/* ── Render: default Glitch-tier view ─────────────────────────── */
function renderTiers(projects) {
  const container = el('projects-sections');

  const sections = GLITCH_TIERS
    .map((tier, i) => ({ tier, items: projects.filter(tier.test) }))
    .filter(({ items }) => items.length);

  if (!sections.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>🔍</span>
        <p>No projects to show yet.</p>
      </div>`;
    return;
  }

  container.innerHTML = sections.map(({ tier, items }, i) => {
    const side = i % 2 === 0 ? '' : 'intro-right';
    return `
      <div class="proj-section">
        <div class="glitch-intro ${side} reveal">
          <img src="assets/${tier.mascot}" alt="The Glitch">
          <div class="bubble">${tier.line}</div>
        </div>
        <h2 class="proj-section-title">${tier.title}</h2>
        <div class="proj-grid">
          ${items.map(cardHTML).join('')}
        </div>
      </div>`;
  }).join('');

  window.GlitchUI.refresh(container);
}

/* ── Render: flat filtered results (any filter active) ───────── */
function renderFiltered(projects) {
  const container = el('projects-sections');

  if (!projects.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>🔍</span>
        <p>No projects match your filters.</p>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="proj-grid">${projects.map(cardHTML).join('')}</div>`;
  window.GlitchUI.refresh(container);
}

/* ── Filter logic ───────────────────────────────────────────── */
function applyFilters() {
  const search   = el('filter-search').value.toLowerCase().trim();
  const category = el('filter-category').value;
  const status   = el('filter-status').value;
  const count    = el('results-count');

  const filtersActive = !!(search || category || status);

  const filtered = allProjects.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      (p.tags || []).some(t => t.toLowerCase().includes(search));
    const matchCategory = !category || p.category === category;
    const matchStatus   = !status   || p.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  count.textContent = filtersActive
    ? `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`
    : `${allProjects.length} project${allProjects.length !== 1 ? 's' : ''} total`;

  if (filtersActive) {
    renderFiltered(filtered);
  } else {
    renderTiers(allProjects);
  }
}

/* ── Load from Supabase ─────────────────────────────────────── */
async function loadProjects() {
  const { data, error } = await db
    .from('projects')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    el('projects-sections').innerHTML = `
      <div class="error-state">
        <span>⚠️</span>
        <p>Could not load projects. Please try again later.</p>
      </div>`;
    el('results-count').textContent = '';
    return;
  }

  allProjects = data;
  populateCategoryFilter();
  el('results-count').textContent = `${allProjects.length} project${allProjects.length !== 1 ? 's' : ''} total`;
  renderTiers(allProjects);
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showSkeletons();
  loadProjects();

  el('filter-search').addEventListener('input', applyFilters);
  el('filter-category').addEventListener('change', applyFilters);
  el('filter-status').addEventListener('change', applyFilters);
});