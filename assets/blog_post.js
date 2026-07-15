const STORAGE_BUCKET = 'blog-images';
const el = (id) => document.getElementById(id);

/* ── Resolve image paths ────────────────────────────────────── */
// Rewrites bare filenames in Markdown image tags to public Supabase Storage URLs.
// Full http(s) URLs are left untouched.
function resolveImageUrls(markdown) {
  const { storageUrl } = db;
  // db is the Supabase client from supabase-client.js
  // We build the public URL manually using the Supabase project URL.
  const baseUrl = `${db.supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`;

  return markdown.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, src) => {
      // Leave external / data URLs alone
      if (/^https?:\/\//i.test(src) || src.startsWith('data:')) return match;
      return `![${alt}](${baseUrl}${src})`;
    }
  );
}

/* ── Helpers ────────────────────────────────────────────────── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function readingTime(markdown) {
  if (!markdown) return '1 min read';
  const words = markdown.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

/* ── Configure marked ───────────────────────────────────────── */
// marked is loaded via CDN in blog_post.html
function setupMarked() {
  marked.setOptions({
    breaks: true,      // single newline → <br>
    gfm: true,         // GitHub-flavoured Markdown
  });
}

/* ── Skeletons ──────────────────────────────────────────────── */
function showSkeletons() {
  el('post-layout').innerHTML = `
    <div class="skeleton post-skeleton-header"></div>
    <div class="skeleton post-skeleton-body"></div>`;
}

/* ── Render ─────────────────────────────────────────────────── */
function renderPost(p) {
  document.title = `${p.title} · Jenna Li Hoi Wah`;

  // Optional cover image
  const coverHTML = p.cover_url
    ? `<div class="post-cover">
         <img src="${p.cover_url}" alt="${p.title}"
              onerror="this.parentElement.style.display='none'">
       </div>`
    : '';

  // Tags
  const tagsHTML = (p.tags || []).length
    ? `<div class="post-tags">
         ${p.tags.map(t => `<span class="post-tag">${t}</span>`).join('')}
       </div>`
    : '';

  // Markdown → HTML (with image URLs resolved)
  const resolvedMd  = resolveImageUrls(p.content || '');
  const contentHTML = marked.parse(resolvedMd);

  el('post-layout').innerHTML = `
    <article>
      <header class="post-header">
        ${tagsHTML}
        <h1 class="post-title">${p.title}</h1>
        <div class="post-meta">
          <span>${formatDate(p.published_at || p.created_at)}</span>
          <span class="post-meta-dot"></span>
          <span>${readingTime(p.content)}</span>
        </div>
      </header>

      ${coverHTML}

      <div class="post-divider"></div>

      <div class="post-body">${contentHTML}</div>
    </article>`;
}

/* ── Not found ──────────────────────────────────────────────── */
function renderNotFound() {
  el('post-layout').innerHTML = `
    <div class="not-found">
      <h2>Post not found</h2>
      <p>The post you're looking for doesn't exist or has been removed.</p>
      <a href="blog.html">← Back to Blog</a>
    </div>`;
}

/* ── Load ───────────────────────────────────────────────────── */
async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  if (!id) { renderNotFound(); return; }

  const { data, error } = await db
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error || !data) { renderNotFound(); return; }
  renderPost(data);
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setupMarked();
  showSkeletons();
  loadPost();

  el('back-btn').addEventListener('click', () => {
    if (document.referrer.includes('blog')) {
      history.back();
    } else {
      window.location.href = 'blog.html';
    }
  });
});
