// js/components.js

const base = window.location.pathname.includes('/pages/') ? '../' : '';

async function injectComponent(html, position) {
  // Fix all href/src paths relative to current page depth
  const adjusted = html
    .replaceAll('href="index.html"',          `href="${base}index.html"`)
    .replaceAll('href="pages/',               `href="${base}pages/`)
    .replaceAll('src=""',                     `src="${base}assets/logo.png"`);

  document.body.insertAdjacentHTML(position, adjusted);
}

async function loadComponents() {
  const [navRes, footerRes] = await Promise.all([
    fetch(`${base}components/navbar.html`),
    fetch(`${base}components/footer.html`),
  ]);

  const [navHTML, footerHTML] = await Promise.all([
    navRes.text(),
    footerRes.text(),
  ]);

  await injectComponent(navHTML, 'afterbegin');
  await injectComponent(footerHTML, 'beforeend');

  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href').endsWith(currentPage)) {
      link.classList.add('active');
    }
  });

  // Hamburger toggle
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });
}

loadComponents();