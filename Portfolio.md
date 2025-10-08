# Portfolio Website Specification & Guide

> **Goal:** Front‑load the essentials so a recruiter immediately understands your value. Then layer in proof, depth, and personality for those who keep exploring.

---

## 🎯 Top Priorities (Above the Fold & First Scroll)

These elements must be obvious within the first 5–15 seconds.

1. **Hero / Identity Block**  
   - Your **name** + concise **title / specialization**  
     e.g. `Tri Huynh — AI & Full‑Stack Developer`  
   - A **mission / tagline** (1 sentence)  
     e.g. “I build systems that make data more human.”  
   - Primary **Call to Action** buttons:  
     - `View Projects`  
     - `Download Résumé (PDF)`  
     - `Contact Me`  
   - Optional: small **portrait / avatar** or minimal illustration  
   - Clean background (e.g. gradient, subtle texture, or solid color)

2. **Featured Projects (Top 3)**  
   - Card layout (grid or horizontal)  
   - Each card includes:  
     - Title + short tagline  
     - Tech stack tags (e.g. `FastAPI • Next.js • Docker`)  
     - 2–3 impact bullets (focus on outcomes, not just features)  
     - Buttons: `Demo` | `GitHub`  
     - Optional: screenshot / GIF  

3. **Skills Summary + Résumé CTA**  
   - Badges or icons divided by category:  
     - **Languages:** Python, Java, JavaScript  
     - **Frameworks / Libraries:** Next.js, FastAPI, TensorFlow  
     - **Tools / Infrastructure:** Docker, GitHub Actions, AWS  
     - **Concepts / Areas:** ML, API Design, Data Structures  
   - Always-visible **Download Résumé** button or link  
   - Ideally in a compact layout (e.g. 2–3 columns)

4. **Experience Snapshot**  
   - 2–3 roles or engagements max  
   - Format:  
     ```
     Role — Company / Institution  
     Start — End  
     • Achievement bullet  
     • Achievement bullet  
     • (Optional) Technical detail or metric  
     ```  
   - Emphasize *impact* and *responsibility*, not just tasks

---

## 🧩 Secondary Sections (Deeper Dive / Personality)

These come *after* the essentials. They reward curious visitors.

5. **About / Who You Are**  
   - 2–3 paragraphs:  
     - Your background (education, origin, trajectory)  
     - What you enjoy building, problems you love solving  
     - Personal or soft side (hobbies, philosophy, values)  
   - Optional: portrait or styled image  
   - Optional mini “fun facts” (e.g. “I brew my own coffee,” “I build side‑project games”)

6. **Full Project Gallery / Portfolio**  
   - Expand beyond the top 3 into full list  
   - Optionally allow filtering by tags (e.g. “AI”, “Web”, “Data”)  
   - For highlighted ones, include deeper case studies: architecture diagrams, lessons learned, performance results  

7. **Contact**  
   - Clear lines:  
     - 📧 Email (clickable)  
     - 🔗 LinkedIn  
     - 💻 GitHub  
   - Optional contact form (via Formspree, EmailJS, or backend)  
   - CTA: “Let’s build something together” or similar friendly prompt

8. **Résumé (PDF version)**  
   - Button or link: `Download Résumé (PDF)`  
   - Store it in `/public` or `static`, and ensure it matches site content  

9. **Blog / Dev Journal / Extras** *(optional but differentiating)*  
   - Posts in Markdown or MDX  
   - Topics: reflections, deep dives, tech writeups  
   - Sidebar or tag filtering  
   - Could tie into “latest posts” preview on homepage  

10. **Fun / Branding / Easter Eggs** *(pure polish)*  
    - Dark / Light mode toggle  
    - Typing animation in hero tagline  
    - Subtle scroll reveals or fade‑ins (Framer Motion, AOS, etc.)  
    - Custom 404 page with personality  
    - Live stats or widgets (GitHub stats, contribution graph, Spotify now-playing)

---

## 🎨 Design & Visual Guidelines

- **Color palette:** 1 primary + 1 accent + neutrals  
- **Typography:** Clean, modern sans-serif (e.g. Inter, Poppins, Satoshi)  
- **Spacing & layout:** generous padding / margins (e.g. `p-6`, `gap-8`)  
- **Navigation:** sticky header with quick links to sections  
- **Scroll behavior:** `scroll-behavior: smooth`  
- **Motion:** subtle transitions (e.g. fade-up, slide-in)  
- **Responsive:** mobile-first and check on small / medium devices  
- **Accessibility:**  
  - Alt text for images  
  - Sufficient color contrast  
  - Keyboard navigation  
  - Semantic tags (`<main>`, `<section>`, `<nav>`, etc.)

---

## ⚙️ Technical Structure & Scripts

### Folder / File Structure

```
portfolio/
├── components/
│   ├── Hero.jsx
│   ├── ProjectCard.jsx
│   ├── Projects.jsx
│   ├── Skills.jsx
│   ├── Experience.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── pages/
│   ├── index.jsx
│   ├── _app.jsx
│   └── _document.jsx
├── public/
│   ├── images/
│   └── resume.pdf
├── styles/
│   └── globals.css
├── data/
│   ├── projects.json
│   ├── experience.json
│   └── skills.json
├── package.json
└── README.md
```

---

## ✅ Recruiter-First Checklist

- [ ] Hero clearly states who you are + what you build  
- [ ] Primary CTAs visible immediately  
- [ ] Top 3 projects shown above the fold  
- [ ] Skills summarized in a scannable layout  
- [ ] Résumé link always accessible  
- [ ] Experience entries emphasize impact and metrics  
- [ ] Mobile & desktop responsive  
- [ ] Fast initial load (optimize images, code split)  
- [ ] Optional personality / branding comes after essentials  

---

## 📦 Usage / Next Steps

1. Save this file as `Portfolio.md` in your project’s specification folder.  
2. Use Codex / Claude / your LLM of choice to translate into code (Next.js, Astro, SvelteKit, etc.)  
3. Populate `data/projects.json` / `experience.json` with your real content  
4. Style components per the design guidance above  
5. Deploy (Vercel / Netlify / GitHub Pages)  
6. Continuously update as you complete new projects and roles  

---

**Author:** Tri Huynh  
**Version:** v3.0 — Recruiter‑Optimized Portfolio Guide  
