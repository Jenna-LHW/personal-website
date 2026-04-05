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
| **Fonts** | DM Serif Display, DM Sans |

---

### Project Structure

I organized the project to keep the logic separate from the styling, making it easier to scale as I add more features:

* **`/index.html`**: The main entry point featuring the Hero section, live Stats, and Expertise cards.
* **`/pages`**: Dedicated pages for my Bio (About), Project Gallery, and Contact form.
* **`/css`**: Modular stylesheets, including `base.css` which handles my custom brown/tan design tokens.
* **`/js`**: Scripts for fetching data from the Supabase API and handling UI interactions.
* **`/assets`**: Project media, including my custom 3D character avatar.
* **`/netlify/functions`**: Serverless backend logic to securely handle email sent via the contact form.

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

---

### Color Theme
I chose a "Classic Light Brown" aesthetic to create a professional yet warm environment that stands out from typical dark-mode portfolios:

* **Primary Background (Cream):** `#FEEBCF`
* **Secondary Neutral (Off-White):** `#F7F6F2`
* **Text & Accents:** `#0d0d0d`

