# Personal Portfolio

This is the repository for my personal portfolio website. I built this to be fully responsive and easy to manage; instead of hardcoding my projects and stats, I use a **Supabase** backend to keep everything dynamic and up-to-date.

### Live Site
[jenna-personal-website.netlify.app](https://jenna-personal-website.netlify.app)

---

### Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript |
| **Database** | Supabase (PostgreSQL) |
| **Hosting** | Netlify |
| **Email** | Netlify Functions + Resend API |
| **Icons** | Devicon & Lucide Icons |

---

### Project Structure

I organized the project to keep the logic separate from the styling, making it easier to scale as I add more features:

* **`/index.html`**: The main entry point featuring the Hero section, live Stats, and Expertise cards.
* **`/pages`**: Dedicated pages for my Bio (About), Project Gallery, Blog, and Contact form.
* **`/components`**: Shared HTML components — `navbar.html` and `footer.html` — injected into every page via `js/components.js`, so there's a single source of truth for both.
* **`/css`**: Modular stylesheets, including `base.css` which handles global design tokens, the navbar (including the mobile hamburger menu), and the footer.
* **`/js`**: Scripts for fetching data from the Supabase API and handling UI interactions. `components.js` handles loading the shared navbar and footer on every page.
* **`/assets`**: Project media, including my custom 3D character avatar.
* **`/netlify/functions`**: Serverless backend logic to securely handle email sent via the contact form.

---

### Shared Components

The navbar and footer are defined once in `/components` and loaded dynamically on every page using the Fetch API. To update either globally, edit only the relevant file:

* **`/components/navbar.html`**: Navigation links, logo, Contact CTA, and mobile hamburger button.
* **`/components/footer.html`**: Footer text and copyright line.
* **`/js/components.js`**: Fetches and injects both components, resolves paths based on page depth, sets the active nav link, and handles the hamburger toggle.

> **Note:** Because components are loaded via `fetch`, the site must be served over HTTP (not opened directly as a `file://` URL).

---

### Mobile Navigation

The navbar is fully responsive. On screens wider than 560px the standard nav links and Contact button are shown. On smaller screens those are replaced by a hamburger button that opens a dropdown menu, including the Contact link.

---

### Database Management (Supabase)

All content that changes—like my GPA, project status, or new skills—is managed directly through Supabase. This "engine room" approach means the site updates automatically whenever I modify the database tables.

**Current Tables:**
* **`projects`**: The main table for my active builds (titles, categories, and links).
* **`about_content`**: Stores my bio and the narrative of my journey in CS.
* **`skills`**: Manages the technical icons and categories displayed in my expertise section.
* **`home_stats`**: Tracks live metrics like project counts and my current university progress.
* **`home_expertise`**: Defines the expertise cards on the landing page.
* **`education` & `experience`**: Powers the timeline on my About page.
* **`contact_links`**: Stores external URLs for GitHub, LinkedIn, and email.
* **`blog_posts`**: Stores my blog posts that I publish on the website.
