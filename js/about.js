/* ============================================================
   js/about.js — Fetches data from Supabase and renders
                 all four sections on the About Me page.
   ============================================================ */

/* ── Helpers ────────────────────────────────────────────────── */
const el = (id) => document.getElementById(id);

function showSkeletons() {
  // Bio skeletons
  el('bio-content').innerHTML = [1,2,3].map(() => `
    <div class="bio-block">
      <div class="skeleton skeleton-line short" style="height:12px;width:38%;margin-bottom:10px"></div>
      <div class="skeleton skeleton-line wide"></div>
      <div class="skeleton skeleton-line wide"></div>
      <div class="skeleton skeleton-line mid"></div>
    </div>`).join('');

  // Education skeletons
  el('edu-list').innerHTML = [1,2,3].map(() =>
    `<div class="skeleton skeleton-edu-card"></div>`).join('');

  // Experience skeletons
  el('exp-list').innerHTML = [1,2].map(() =>
    `<div class="skeleton skeleton-exp-item"></div>`).join('');

  // Skills skeletons
  el('skills-content').innerHTML = [1,2,3].map(() => `
    <div class="skill-category">
      <div class="skeleton skeleton-line short" style="height:10px;width:55%;margin-bottom:12px"></div>
      <div class="skill-icons">
        ${[1,2,3].map(() => `<div class="skeleton skeleton-skill-icon"></div>`).join('')}
      </div>
    </div>`).join('');
}

function errorHTML(msg) {
  return `<div class="error-state"><span>⚠️</span><p>${msg}</p></div>`;
}

/* ── Bio ─────────────────────────────────────────────────────── */
async function loadBio() {
  const { data, error } = await db
    .from('about_content')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    el('bio-content').innerHTML = errorHTML('Could not load bio. Please try again later.');
    return;
  }

  el('bio-content').innerHTML = data.map(item => `
    <div class="bio-block">
      <h3>${item.heading}</h3>
      <p>${item.body}</p>
    </div>`).join('');
}

/* ── Education ──────────────────────────────────────────────── */
async function loadEducation() {
  const { data, error } = await db
    .from('education')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    el('edu-list').innerHTML = errorHTML('Could not load education data.');
    return;
  }

  el('edu-list').innerHTML = data.map(item => {
    const subjectsHTML = item.subjects
      ? `<div class="edu-subjects">
           ${item.subjects.split('·').map(s =>
             `<span class="edu-subject-tag">${s.trim()}</span>`).join('')}
         </div>`
      : '';
    const detailsHTML = item.details
      ? `<div class="edu-details">${item.details}</div>`
      : '';
    return `
      <div class="edu-card">
        <div class="edu-period">${item.period}</div>
        <div class="edu-degree">${item.degree}</div>
        <div class="edu-institution">${item.institution}</div>
        ${detailsHTML}
        ${subjectsHTML}
      </div>`;
  }).join('');
}

/* ── Experience ─────────────────────────────────────────────── */
async function loadExperience() {
  const { data, error } = await db
    .from('experience')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    el('exp-list').innerHTML = errorHTML('Could not load experience data.');
    return;
  }

  el('exp-list').innerHTML = data.map(item => `
    <div class="exp-item">
      <div class="exp-dot"></div>
      <div class="exp-period">${item.period}</div>
      <div class="exp-role">${item.role}</div>
      <div class="exp-company">${item.company}</div>
      <ul class="exp-bullets">
        ${item.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>`).join('');
}

/* ── Skills ─────────────────────────────────────────────────── */
async function loadSkills() {
  const { data, error } = await db
    .from('skills')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    el('skills-content').innerHTML = errorHTML('Could not load skills.');
    return;
  }

  // Group by category preserving insertion order
  const categories = {};
  data.forEach(skill => {
    if (!categories[skill.category]) categories[skill.category] = [];
    categories[skill.category].push(skill);
  });

  el('skills-content').innerHTML = Object.entries(categories).map(([cat, skills]) => `
    <div class="skill-category">
      <div class="skill-category-title">${cat}</div>
      <div class="skill-icons">
        ${skills.map(skill => `
          <div class="skill-icon-wrap">
            <div class="skill-icon">
              <img src="${skill.icon_url}" alt="${skill.name}" loading="lazy"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
              <span style="display:none;font-size:.7rem;font-weight:600;color:var(--gray-600)">${skill.name.slice(0,3)}</span>
            </div>
            <div class="skill-tooltip">${skill.tooltip || skill.name}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showSkeletons();

  // Run all fetches in parallel
  Promise.all([
    loadBio(),
    loadEducation(),
    loadExperience(),
    loadSkills(),
  ]);

  // Mark active nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === 'about.html') {
      link.classList.add('active');
    }
  });
});