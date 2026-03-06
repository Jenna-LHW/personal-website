# Personal Portfolio

A fully responsive personal portfolio website built with HTML, CSS, and JavaScript, showcasing my projects, skills, and experience as a Computer Science student.

**Live Site:** [jenna-personal-website.netlify.app](https://jenna-personal-website.netlify.app)


## Features

- Custom client-side routing — seamless navigation without page reloads
- Dynamic DOM rendering driven by a centralized data object
- Project filtering by category with real-time UI updates
- Scroll-triggered animations using the Intersection Observer API
- Typed text animation in the hero section
- Contact form with serverless email delivery via Resend
- Responsive layout for desktop and mobile
- Projects loaded dynamically from a Supabase database

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend (email) | Netlify Functions + Resend API |
| Database | Supabase (PostgreSQL) |
| Hosting | Netlify |


## Project Structure

```
├── index.html
├── styles.css
├── script.js
└── netlify/
    └── functions/
        └── send-email.js
```


## How It Works

### Dynamic Project Loading
Projects are stored in a Supabase PostgreSQL database and fetched at runtime via the Supabase REST API. Adding a new project requires no code changes — just insert a new row in the database and it appears on the site automatically.

### Contact Form
Form submissions are handled by a Netlify serverless function (`send-email.js`) which calls the Resend API to forward messages directly to my inbox. The API key is stored securely as a Netlify environment variable and is never exposed to the frontend.


## Version History
- **v1.0** — Original version available at [jennalhw-portfolio.netlify.app](https://jennalhw-portfolio.netlify.app)