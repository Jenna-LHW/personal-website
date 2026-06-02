/* ============================================================
   js/home.js — Home page data loading & carousel
   ============================================================ */

const el = (id) => document.getElementById(id);

/* ── Skeletons ──────────────────────────────────────────────── */
function showSkeletons() {
  el('stats-bar').innerHTML = [1,2,3].map(() =>
    `<div class="skeleton skeleton-stat"></div>`).join('');

  el('expertise-grid').innerHTML = [1,2,3].map(() =>
    `<div class="skeleton skeleton-expertise"></div>`).join('');

  el('projects-carousel').innerHTML = [1,2,3].map(() =>
    `<div class="skeleton skeleton-project-card"></div>`).join('');
}

/* ── Stats ──────────────────────────────────────────────────── */
async function loadStats() {
  const { data, error } = await db
    .from('home_stats')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) return;

  el('stats-bar').innerHTML = data.map(s => `
    <div class="stat-item">
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');
}

/* ── Expertise ──────────────────────────────────────────────── */
async function loadExpertise() {
  const { data, error } = await db
    .from('home_expertise')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) return;

  el('expertise-grid').innerHTML = data.map(e => `
    <div class="expertise-card">
      <div class="expertise-icon"><i data-lucide="${e.icon}"></i></div>
      <div class="expertise-title">${e.title}</div>
      <div class="expertise-desc">${e.description}</div>
    </div>`).join('');

  lucide.createIcons();
}

/* ── Projects carousel ──────────────────────────────────────── */
let allProjects = [];
let carouselIndex = 0;
const VISIBLE = 3;

function renderCarousel() {
  const visible = allProjects.slice(carouselIndex, carouselIndex + VISIBLE);
  el('projects-carousel').innerHTML = visible.map(p => `
    <a class="home-project-card" href="pages/project_detail.html?id=${p.id}">
      <div class="home-project-thumb">
        <img src="${p.screenshot || 'https://placehold.co/560x350/EEF0F6/7B82A0?text=Project'}"
             alt="${p.title}" loading="lazy"
             onerror="this.src='https://placehold.co/560x350/EEF0F6/7B82A0?text=Project'">
      </div>
      <div class="home-project-body">
        <div class="home-project-title">${p.title}</div>
        <div class="home-project-desc">${p.description}</div>
        <span class="home-project-link">View Project →</span>
      </div>
    </a>`).join('');

  el('carousel-prev').style.opacity = carouselIndex === 0 ? '.35' : '1';
  el('carousel-prev').disabled = carouselIndex === 0;
  el('carousel-next').style.opacity = carouselIndex + VISIBLE >= allProjects.length ? '.35' : '1';
  el('carousel-next').disabled = carouselIndex + VISIBLE >= allProjects.length;
}

async function loadProjects() {
  const { data, error } = await db
    .from('projects')
    .select('id, title, description, screenshot')
    .order('sort_order');

  if (error || !data?.length) return;

  allProjects = data;
  renderCarousel();

  el('carousel-prev').addEventListener('click', () => {
    if (carouselIndex > 0) { carouselIndex--; renderCarousel(); }
  });
  el('carousel-next').addEventListener('click', () => {
    if (carouselIndex + VISIBLE < allProjects.length) { carouselIndex++; renderCarousel(); }
  });
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showSkeletons();
  Promise.all([loadStats(), loadExpertise(), loadProjects()]);
});