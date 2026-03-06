// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://zujdvrlxiocnotwekhmw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1amR2cmx4aW9jbm90d2VraG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODI5ODUsImV4cCI6MjA4ODM1ODk4NX0.dVpi7fKPuLV25yuX9465o_3tGt1m0dA4ENebUNScm7c";

async function loadProjectsFromSupabase() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/projects?select=*&order=id`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!res.ok) throw new Error("Failed to fetch projects");

    const projects = await res.json();

    // Map snake_case DB columns to camelCase used in the app
    DATA.projects = projects.map(p => ({
      id:         p.id,
      title:      p.title,
      desc:       p.desc,
      tags:       p.tags       || [],
      category:   p.category,
      emoji:      p.emoji,
      image:      p.image,
      thumbColor: p.thumb_color || [],
      github:     p.github,
      live:       p.live,
      fullDesc:   p.full_desc,
      year:       p.year,
      role:       p.role,
      Context:    p.context,
      features:   p.features   || [],
      techStack:  p.tech_stack  || [],
      links:      p.links       || {},
    }));

  } catch (err) {
    console.error("Supabase error:", err);
    DATA.projects = [];
  }
}

// ===== DATA =====
const DATA = {
  name: "Jenna Li Hoi Wah",
  initials: "JL",
  role: "Computer Science Student",
  university: "University of Mauritius",
  year: "2nd Year",
  bio: `I'm a second-year BSc (Hons) Computer Science student at the University of Mauritius with a strong interest in building practical, meaningful software. 

My experience spans full-stack web development, Java GUI applications, and database systems. Through academic projects and internships, I've worked with data analytics, SQL scripting, backend development, and enterprise system customization. With every project, I focus on writing clean, efficient code and designing solutions that are both functional and scalable.

I see every challenge as an opportunity to grow. Whether I'm exploring new frameworks, refining system logic, or understanding how larger applications operate, I'm continuously expanding my technical toolkit and strengthening my analytical thinking.

Looking ahead, I'm eager to contribute to impactful projects, collaborate with experienced professionals, and continue developing into a well-rounded software engineer.`,
  email: "staceyjenna.lhw@gmail.com",
  github: "github.com/Jenna-LHW",
  linkedin: "linkedin.com/in/staceyjennalhw",
  location: "Mauritius",

  skills: {
    "Programming Languages": ["Python", "Java", "C", "JavaScript"],
    "Web & Frameworks": ["Django", "HTML5", "CSS3"],
    "Databases": ["SQL Server", "MySQL"],
    "Tools & Platforms": ["GitHub", "Linux", "HCL Notes"],
    "Core Concepts": ["Data Structures", "Algorithms", "Database Design"]
  },

  featuredSkills: [
    {
      icon: '<i class="fi fi-rr-globe"></i>',
      name: "Full-Stack Web Development",
      desc: "Building responsive web applications using HTML, CSS, JavaScript, and Django, with backend logic, form handling, and admin customization."
    },
    {
      icon: '<i class="fi fi-brands-java"></i>',
      name: "Java & Desktop Applications",
      desc: "Designing and developing GUI-based desktop applications using Java Swing."
    },
    {
      icon: '<i class="fi fi-rr-database"></i>',
      name: "Database & SQL",
      desc: "Writing SQL queries for data migration, validation, and relational database management, with experience integrating databases into applications."
    },
  ],

  experience: [
    {
      date: "Oct 2025 – Jan 2026",
      title: "Intern (Projects Team)",
      company: "BDO IT Consulting",
      desc: [
        "Contributed to enterprise data migration through SQL scripting and validation tasks",
        "Developed automation agents in Java within HCL Notes to streamline business workflows",
        "Implemented form and view logic using LotusScript and Formula language",
        "Enhanced system functionality and data handling efficiency across internal applications"
      ],
    },
    {
      date: "Nov 2024 – Dec 2024",
      title: "Trainee Internal Audit",
      company: "IBL Together",
      desc: [
        "Designed 15+ data analytics test cases to improve audit procedures and testing efficiency",
        "Analysed 500+ financial records to extract key performance metrics and trends",
        "Created visual reports in Microsoft Excel to simplify complex findings for senior management"
      ],
    },
  ],

  education: [
    {
      year: "2024 – 2027 (Expected)",
      degree: "BSc (Hons) Computer Science",
      school: "University of Mauritius",
      note: "GPA: 3.67 | CPA: 71.9",
    },
    {
      year: "Nov 2023",
      degree: "Higher School Certificate (HSC) – A Level",
      school: "AHGM Issac SSS",
      note: "Computer Science · Physics · Mathematics · English GP · French",
    },
    {
      year: "Jun 2021",
      degree: "School Certificate (SC) – O Level",
      school: "AHGM Issac SSS",
      note: "Computer Science · Mathematics · Add Mathematics · Chemistry · Physics · English",
    },
  ],

  // Projects are loaded from Supabase — do not edit here
  projects: [],
};

// ===== ROUTER =====
const pages = ["home", "about", "projects", "contact", "project-detail"];

function navigate(target, projectId) {
  pages.forEach(p => {
    const el = document.getElementById(p + "-page");
    if (el) el.classList.remove("active");
  });

  document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));
  const activeNav = document.querySelector(`.nav-links a[data-page="${target}"]`);
  if (activeNav) activeNav.classList.add("active");

  const targetEl = document.getElementById(target + "-page");
  if (targetEl) targetEl.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector(".nav-links").classList.remove("open");

  if (target === "project-detail" && projectId) {
    renderProjectDetail(projectId);
  }

  setTimeout(() => {
    initScrollAnimations();
    if (target === "home" || target === "about") initTimeline();
  }, 60);
}

// ===== RENDER =====

function projectCard(p) {
  return `
    <div class="project-card fade-in" onclick="navigate('project-detail', '${p.id}')">
      <div class="project-thumb">
        <img src="${p.image}" alt="${p.title} Screenshot">
        <div class="project-thumb-overlay">
            <span>View Project</span>
        </div>
      </div>
      <div class="project-body">
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.desc}</div>
      </div>
    </div>`;
}

function timelineHTML(items) {
  return items.map((e, i) => `
    <div class="timeline-item" style="transition-delay:${i * 0.12}s">
      <div class="timeline-dot"></div>
      <div class="timeline-date">${e.date}</div>
      <div class="timeline-title">${e.title}</div>
      <div class="timeline-company">${e.company}</div>
      <div class="timeline-desc">
        <ul>
          ${e.desc.map(point => `<li>${point}</li>`).join("")}
        </ul>
      </div>
    </div>`).join("");
}

function renderHome() {
  document.querySelector(".hero-title .name").textContent = DATA.name;

  document.querySelector(".skills-grid").innerHTML = DATA.featuredSkills.map(s => `
    <div class="skill-card fade-in">
      <div class="skill-icon">${s.icon}</div>
      <div class="skill-name">${s.name}</div>
      <div class="skill-desc">${s.desc}</div>
    </div>`).join("");

  document.getElementById("home-projects-grid").innerHTML = DATA.projects.slice(0, 3).map(projectCard).join("");

  document.getElementById("home-timeline").innerHTML = timelineHTML(DATA.experience);
}

function renderAbout() {
  document.querySelector(".about-bio").innerHTML =
    DATA.bio.split("\n\n").map(p => `<p>${p}</p>`).join("");

  document.getElementById("about-timeline").innerHTML = timelineHTML(DATA.experience);

  document.getElementById("edu-list").innerHTML = DATA.education.map(e => `
    <div class="education-card fade-in">
      <div class="edu-year">${e.year}</div>
      <div class="edu-degree">${e.degree}</div>
      <div class="edu-school">${e.school}</div>
      <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem;font-family:var(--font-mono)">${e.note}</div>
    </div>`).join("");
}

function renderProjects() {
  const grid = document.getElementById("all-projects-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");

  function renderFiltered(cat) {
    const filtered = cat === "all" ? DATA.projects : DATA.projects.filter(p => p.category === cat);
    grid.innerHTML = filtered.map(projectCard).join("");
    setTimeout(initScrollAnimations, 50);
  }

  renderFiltered("all");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFiltered(btn.dataset.filter);
    });
  });
}

function renderProjectDetail(id) {
  const p = DATA.projects.find(x => x.id === id);
  if (!p) return;

  document.getElementById("detail-container").innerHTML = `
    <button class="detail-back fade-in" onclick="navigate('projects')">← Back to Projects</button>

    <div class="detail-hero fade-in">
      <div class="detail-thumb">
        <img src="${p.image}" alt="${p.title} Screenshot">
      </div>
      <div class="detail-meta">
        <div class="project-tags" style="margin-bottom:0.75rem">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        <h1 class="detail-title">${p.title}</h1>
        <p class="detail-summary">${p.fullDesc}</p>
        <div class="detail-info-row">
          <div><div class="detail-info-label">Year</div><div class="detail-info-val">${p.year}</div></div>
          <div><div class="detail-info-label">My Role</div><div class="detail-info-val">${p.role}</div></div>
          <div><div class="detail-info-label">Context</div><div class="detail-info-val">${p.Context}</div></div>
        </div>
      </div>
    </div>

    <div class="detail-body">
      <div class="detail-section fade-in">
        <h3>Key Features</h3>
        <ul>${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
      </div>
      <div>
        <div class="detail-sidebar-card fade-in">
          <h4>Tech Stack</h4>
          <div class="card-skills">${p.techStack.map(t => `<span class="skill-chip">${t}</span>`).join("")}</div>
        </div>
        ${(!p.links.github && !p.links.live)
          ? `<div class="detail-sidebar-card fade-in">
              <h4>Links</h4>
              <span style="font-size:0.8rem;color:var(--text-muted);text-align:center;display:block;padding:0.5rem">Still in progress</span>
            </div>`
          : `<div class="detail-sidebar-card fade-in">
              <h4>Links</h4>
              <div style="display:flex;flex-direction:column;gap:0.6rem">
                ${p.links.github
                  ? `<a href="${p.links.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="width:100%;justify-content:center">⚙ View on GitHub</a>`
                  : ''}
                ${p.links.live
                  ? `<a href="${p.links.live}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="width:100%;justify-content:center">↗ Live Demo</a>`
                  : `<span style="font-size:0.8rem;color:var(--text-muted);text-align:center;display:block;padding:0.5rem">No live demo available</span>`}
              </div>
            </div>`
        }
      </div>
    </div>`;
}

function renderContact() {
  document.querySelector(".contact-email").textContent = DATA.email;
  document.querySelector(".contact-github").textContent = DATA.github;
  document.querySelector(".contact-linkedin").textContent = DATA.linkedin;
  document.querySelector(".contact-location").textContent = DATA.location;
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".fade-in:not(.visible)").forEach(el => observer.observe(el));
}

// ===== SKILL BARS =====
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.pct + "%";
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll(".skill-bar-fill").forEach(b => observer.observe(b));
}

// ===== TIMELINE =====
function initTimeline() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.1 });
  document.querySelectorAll(".timeline-item").forEach(i => observer.observe(i));
}

// ===== TYPED EFFECT =====
function initTyped() {
  const el = document.querySelector(".hero-typed");
  if (!el) return;
  const words = ["Software Engineer.", "Web Developer.", "Problem Solver.", "CS Student."];
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(tick, 1600); return; }
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, deleting ? 55 : 95);
  }
  tick();
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", async () => {

  // Render everything that doesn't need Supabase first
  renderAbout();
  renderContact();

  // Fetch projects from Supabase, then render anything that depends on them
  await loadProjectsFromSupabase();
  renderHome();
  renderProjects();

  // Nav events
  document.querySelectorAll(".nav-links a[data-page]").forEach(link => {
    link.addEventListener("click", () => navigate(link.dataset.page));
  });
  document.querySelector(".nav-logo").addEventListener("click", () => navigate("home"));
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("open");
  });

  // Contact form
  document.getElementById("contact-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = document.getElementById("contact-form");
    const submitBtn = form.querySelector("button[type='submit']");
    const successEl = document.querySelector(".form-success");

    const name    = document.getElementById("cf-name").value.trim();
    const email   = document.getElementById("cf-email").value.trim();
    const subject = document.getElementById("cf-subject").value.trim();
    const message = document.getElementById("cf-msg").value.trim();

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      form.style.display = "none";
      successEl.style.display = "block";

    } catch (err) {
      let errEl = document.getElementById("form-error-msg");
      if (!errEl) {
        errEl = document.createElement("p");
        errEl.id = "form-error-msg";
        errEl.style.cssText = "color:#dc2626;font-size:0.85rem;margin-top:0.75rem;text-align:center;";
        submitBtn.insertAdjacentElement("afterend", errEl);
      }
      errEl.textContent = `⚠ ${err.message}`;
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  navigate("home");
  initTyped();
  setTimeout(initScrollAnimations, 100);
  setTimeout(initTimeline, 100);
});