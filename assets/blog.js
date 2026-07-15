/* ============================================================
   js/blog.js — Loads blog posts from Supabase, handles
                filtering by search and tag.
   ============================================================ */

const el = (id) => document.getElementById(id);

let allPosts = [];

/* ── Helpers ────────────────────────────────────────────────── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function dateParts(iso) {
  const d = new Date(iso);
  return {
    mon: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.toLocaleDateString('en-US', { day: '2-digit' }),
    year: d.getFullYear()
  };
}

function readingTime(markdown) {
  if (!markdown) return '1 min read';
  const words = markdown.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

/* ── Skeletons ──────────────────────────────────────────────── */
function showSkeletons() {
  el('blog-grid').innerHTML = [1,2,3,4,5].map(() =>
    `<div class="skeleton skeleton-post-row"></div>`).join('');
}

/* ── Populate tag filter ────────────────────────────────────── */
function populateTags(posts) {
  const tagSet = new Set();
  posts.forEach(p => (p.tags || []).forEach(t => tagSet.add(t)));
  const select = el('filter-tag');
  [...tagSet].sort().forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    select.appendChild(opt);
  });
}

/* ── Render cards ───────────────────────────────────────────── */
function renderPosts(posts) {
  const grid  = el('blog-grid');
  const count = el('results-count');

  count.textContent = `${posts.length} post${posts.length !== 1 ? 's' : ''}`;

  if (!posts.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <span>🔍</span>
        <p>No posts match your filters.</p>
      </div>`;
    return;
  }

  grid.innerHTML = posts.map(p => {
    const dp = dateParts(p.published_at || p.created_at);
    const tag = (p.tags || [])[0];

    return `
      <a class="post-row" href="blog_post.html?id=${p.id}" aria-label="${p.title}">
        <div class="post-date"><span>${dp.mon}</span><b>${dp.day}</b><span>${dp.year}</span></div>
        <div class="post-body">
          <h3>${p.title}</h3>
          <p>${p.excerpt || ''}</p>
          <div class="post-meta">${readingTime(p.content)}${tag ? ' · ' + tag : ''}</div>
        </div>
        <span class="post-arrow">→</span>
      </a>`;
  }).join('');
}

/* ── Filter logic ───────────────────────────────────────────── */
function applyFilters() {
  const search = el('filter-search').value.toLowerCase().trim();
  const tag    = el('filter-tag').value;

  const filtered = allPosts.filter(p => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search) ||
      (p.excerpt || '').toLowerCase().includes(search) ||
      (p.tags || []).some(t => t.toLowerCase().includes(search));
    const matchTag = !tag || (p.tags || []).includes(tag);
    return matchSearch && matchTag;
  });

  renderPosts(filtered);
}

/* ── Load from Supabase ─────────────────────────────────────── */
async function loadPosts() {
  const { data, error } = await db
    .from('blog_posts')
    .select('id, title, excerpt, cover_url, tags, published_at, created_at, content')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error || !data?.length) {
    el('blog-grid').innerHTML = `
      <div class="error-state">
        <span>⚠️</span>
        <p>${error ? 'Could not load posts. Please try again later.' : 'No posts yet — check back soon!'}</p>
      </div>`;
    el('results-count').textContent = '';
    return;
  }

  allPosts = data;
  populateTags(allPosts);
  renderPosts(allPosts);
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showSkeletons();
  loadPosts();

  el('filter-search').addEventListener('input', applyFilters);
  el('filter-tag').addEventListener('change', applyFilters);
});
