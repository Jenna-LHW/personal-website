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
        <img src="${p.screenshot || 'https://placehold.co/560x350/f0e8dc/999?text=Project'}"
             alt="${p.title}" loading="lazy"
             onerror="this.src='https://placehold.co/560x350/f0e8dc/999?text=Project'">
      </div>
      <div class="home-project-body">
        <div class="home-project-title">${p.title}</div>
        <div class="home-project-desc">${p.description}</div>
      </div>
    </a>`).join('');

  // Disable/enable arrows
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

/* ── Hero canvas: pixel train scene ────────────────────────── */
function startHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const BLOCK = 22;
  const COLS = Math.floor(canvas.width / BLOCK);
  const ROWS = Math.floor(canvas.height / BLOCK);

  let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  // Tetris colors
const COLORS = {
  I: '#FEEBCF',  // main cream
  O: '#FADADD',  // soft pink
  T: '#E6D3F3',  // pastel lavender
  L: '#F7D6BF',  // peach
  J: '#D6E6F2',  // pastel blue
  S: '#DFF5E1',  // pastel green
  Z: '#FFE4D6'   // light coral/peach
};

  const SHAPES = [
    { shape: [[1,1,1,1]], type: 'I' },
    { shape: [[1,1],[1,1]], type: 'O' },
    { shape: [[0,1,0],[1,1,1]], type: 'T' },
    { shape: [[1,0,0],[1,1,1]], type: 'L' },
    { shape: [[0,0,1],[1,1,1]], type: 'J' },
    { shape: [[1,1,0],[0,1,1]], type: 'S' },
    { shape: [[0,1,1],[1,1,0]], type: 'Z' }
  ];

  function createPiece() {
    const p = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    let piece = {
      shape: p.shape,
      type: p.type,
      color: COLORS[p.type],
      x: 0,
      y: -p.shape.length
    };

    piece.x = findBestX(piece);

    return piece;
  }

  let piece = createPiece();

  function collide(p) {
    for (let y = 0; y < p.shape.length; y++) {
      for (let x = 0; x < p.shape[y].length; x++) {
        if (!p.shape[y][x]) continue;

        const nx = p.x + x;
        const ny = p.y + y;

        if (
          nx < 0 ||
          nx >= COLS ||
          ny >= ROWS ||
          (ny >= 0 && grid[ny][nx])
        ) return true;
      }
    }
    return false;
  }

  function merge(p) {
    p.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val && p.y + y >= 0) {
          grid[p.y + y][p.x + x] = p.color;
        }
      });
    });
  }

  function drawBlock(x, y, color) {
    ctx.fillStyle = color;

    // soft glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    ctx.fillRect(x * BLOCK, y * BLOCK, BLOCK - 3, BLOCK - 3);

    // subtle border for definition
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.strokeRect(x * BLOCK, y * BLOCK, BLOCK - 3, BLOCK - 3);

    ctx.shadowBlur = 0;
  }

  function drawGrid() {
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) drawBlock(x, y, cell);
      });
    });
  }

  function drawPiece(p) {
    p.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val) drawBlock(p.x + x, p.y + y, p.color);
      });
    });
  }

  function findBestX(piece) {
    let bestX = piece.x;
    let minHoles = Infinity;

    for (let testX = 0; testX < COLS - piece.shape[0].length + 1; testX++) {
      let testPiece = { ...piece, x: testX, y: piece.y };

      // drop it to bottom
      while (!collide(testPiece)) {
        testPiece.y++;
      }
      testPiece.y--;

      // simulate grid
      let tempGrid = grid.map(row => [...row]);

      testPiece.shape.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val && testPiece.y + y >= 0) {
            tempGrid[testPiece.y + y][testX + x] = 1;
          }
        });
      });

      // count holes (bad spaces)
      let holes = 0;
      for (let x = 0; x < COLS; x++) {
        let blockFound = false;
        for (let y = 0; y < ROWS; y++) {
          if (tempGrid[y][x]) blockFound = true;
          else if (blockFound) holes++;
        }
      }

      if (holes < minHoles) {
        minHoles = holes;
        bestX = testX;
      }
    }

    return bestX;
  }

  function clearLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
      if (grid[y].every(c => c)) {
        grid.splice(y, 1);
        grid.unshift(Array(COLS).fill(null));
        y++;
      }
    }
  }

  let dropCounter = 0;

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dropCounter++;

    if (dropCounter > 30) {
      piece.y++;

      if (collide(piece)) {
        piece.y--;
        merge(piece);
        clearLines();
        piece = createPiece();

        // reset if overflow (keeps it clean)
        if (collide(piece)) {
          grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        }
      }

      dropCounter = 0;
    }

    drawGrid();
    drawPiece(piece);

    requestAnimationFrame(loop);
  }

  loop();
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  showSkeletons();
  startHeroCanvas();
  Promise.all([loadStats(), loadExpertise(), loadProjects()]);

  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === './') {
      link.classList.add('active');
    }
  });
});