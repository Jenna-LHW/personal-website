/* ============================================================
   js/about.js — Loads the changeable parts of the About page
                 from Supabase: about_content, education, skills, experience.

   Actual schema in use:

   about_content(id, heading, body, sort_order)
   education(id, period, degree, institution, details, subjects, sort_order)
   experience(id, period, role, company, bullets text[], sort_order)
   skills(id, name, category, icon_url, tooltip, sort_order)
   ============================================================ */

const el = (id) => document.getElementById(id);

const CATEGORY_ORDER = [
  'Tools & Cloud', 'Languages', 'Backend & Databases', 'Design & UI', 'Web & Frameworks'
];

function emptyState(msg) {
  return `<p style="font-family:var(--font-mono);font-size:13px;color:var(--slate-dim);">${msg}</p>`;
}

/* ── Bio ────────────────────────────────────────────────────── */
async function loadBio() {
  const container = el('bio-content');
  const { data, error } = await db
    .from('about_content')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    container.innerHTML = emptyState(error ? 'Could not load bio.' : 'Nothing here yet.');
    return;
  }

  container.innerHTML = data.map(c => `
    ${c.heading ? `<h3 class="bio-subheading">${c.heading}</h3>` : ''}
    <p>${c.body}</p>
  `).join('');
}

/* ── Education ──────────────────────────────────────────────── */
async function loadEducation() {
  const container = el('education-list');
  const { data, error } = await db
    .from('education')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    container.innerHTML = emptyState(error ? 'Could not load education.' : 'Nothing here yet.');
    return;
  }

  container.innerHTML = data.map(e => {
    const subjects = (e.subjects || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    return `
      <div class="tl-item reveal">
        <div class="tl-date">${e.period || ''}</div>
        <div class="tl-body module">
          <h3>${e.degree}</h3>
          <p class="tl-org">${e.institution || ''}</p>
          ${e.details ? `<p class="tl-desc">${e.details}</p>` : ''}
          ${subjects.length ? `
            <div class="edu-subjects">
              ${subjects.map(s => `<span class="edu-subject-tag">${s}</span>`).join('')}
            </div>` : ''}
        </div>
      </div>`;
  }).join('');

  window.GlitchUI.refresh(container);
}

/* ── Experience ─────────────────────────────────────────────── */
async function loadExperience() {
  const container = el('experience-list');
  const { data, error } = await db
    .from('experience')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    container.innerHTML = emptyState(error ? 'Could not load experience.' : 'Nothing here yet.');
    return;
  }

  container.innerHTML = data.map(x => `
    <div class="tl-item reveal">
      <div class="tl-date">${x.period || ''}</div>
      <div class="tl-body module">
        <h3>${x.role}</h3>
        <p class="tl-org">${x.company || ''}</p>
        ${(x.bullets && x.bullets.length) ? `
          <ul class="tl-bullets">
            ${x.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>` : ''}
      </div>
    </div>`).join('');

  window.GlitchUI.refresh(container);
}

/* ── Skills ─────────────────────────────────────────────────── */
async function loadSkills() {
  const container = el('skills-columns');
  const { data, error } = await db
    .from('skills')
    .select('*')
    .order('sort_order');

  if (error || !data?.length) {
    container.innerHTML = emptyState(error ? 'Could not load skills.' : 'Nothing here yet.');
    return;
  }

  const groups = {};
  data.forEach(s => {
    const cat = s.category || 'Other';
    (groups[cat] = groups[cat] || []).push(s);
  });

  const cats = [
    ...CATEGORY_ORDER.filter(c => groups[c]),
    ...Object.keys(groups).filter(c => !CATEGORY_ORDER.includes(c))
  ];

  container.innerHTML = cats.map(cat => `
    <div class="skill-col">
      <p class="skills-col-label">${cat}</p>
      <div class="skills-col-icons">
        ${groups[cat].map(s => `
          <span class="skill-chip">
            <img src="${s.icon_url}" alt="${s.name}" loading="lazy">
            <span class="skill-tip">${s.tooltip || s.name}</span>
          </span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadBio();
  loadEducation();
  loadSkills();
  loadExperience();
});