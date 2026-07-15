# Personal Portfolio

My personal portfolio site. Most content (projects, skills, blog posts, etc.) is stored in Supabase instead of hardcoded, so I can update it without touching the code.

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

---

### Structure

* **`*.html`** — one file per page (`index`, `about`, `projects`, `project_detail`, `blog`, `blog_post`, `contact`)
* **`/assets`** — CSS, per-page JS, images, and `supabase-client.js` (Supabase connection)
* **`/netlify/functions`** — `send-email.js`, the serverless function that sends contact form emails

---

### Contact Form

Submitting the form on `contact.html` calls the `send-email` Netlify function, which emails the message via Resend.

To make it work:
1. Set `RESEND_API_KEY` in Netlify's environment variables.
2. The `from` address is Resend's sandbox (`onboarding@resend.dev`), which only delivers to the Resend account owner. Verify a domain in Resend to send to others.
3. Functions only run on Netlify (or `netlify dev` locally) — opening the HTML directly won't work.