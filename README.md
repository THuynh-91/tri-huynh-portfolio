# Tri Huynh — Portfolio

An editorial, interactive personal portfolio built with Next.js 15, React 19, Tailwind CSS, and Framer Motion. Light, airy design with an electric indigo/violet accent, an interactive particle field, bento layouts, and tactile micro-interactions.

**Live:** https://thuynh-91.github.io/tri-huynh-portfolio/

## Design

- **Light-first theme** with a full dark mode (CSS-variable token system, no `!important` hacks)
- **Indigo → violet accent** with gradient accent words and mono labels
- **Animated particle field** that links particles to each other and to your cursor, over soft ambient glows
- **Bento layouts** for About and Skills
- **Tactile interactions:** custom pointer-tracking cursor, magnetic buttons, 3D tilt project cards with cursor-following glow, infinite tech marquee, spring-physics scroll reveals, animated counters
- **Easter eggs:** a hidden 3-spark egg hunt, an in-browser terminal (`help` to start), and the Konami code

## Tech Stack

| Layer       | Tools                                   |
| ----------- | --------------------------------------- |
| Framework   | Next.js 15 (static export)              |
| UI          | React 19                                |
| Styling     | Tailwind CSS 3.4 + CSS variables        |
| Animation   | Framer Motion 11                        |
| Fonts       | Space Grotesk · Inter · JetBrains Mono  |
| Deployment  | GitHub Pages                            |

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Editing Content

All content is data-driven:

- **Projects** — `data/projects.json` (title, tagline, tech, impact, links, `tag`, `year`, `featured`)
- **Skills** — `data/skills.json`
- **Experience** — `data/experience.json`
- **Resume** — `public/Resume_Tri_Huynh.pdf`
- **Now-playing songs** — `public/songs.md`

## Theming

Design tokens live in `styles/globals.css` (`:root` is the default light theme; `.dark` overrides it). Change `--accent` / `--accent-2` to reskin the whole site, including the particle colour (`--particle`). Tailwind maps these to semantic colors (`bg-ink`, `bg-surface`, `text-fg`, `text-muted`, `text-accent`, `border-line`) in `tailwind.config.js`.

## Project Structure

```
components/      # sections + interaction primitives (CustomCursor, Magnetic, Marquee, Reveal, ...)
pages/           # _app, _document, index
data/            # projects / skills / experience JSON
public/          # images, resume, favicon, songs.md
styles/          # globals.css (design tokens + utilities)
```

## Author

**Tri Huynh** — CS @ Northeastern (Khoury), AI & Backend Engineer, AWS Certified Cloud Practitioner
[GitHub](https://github.com/THuynh-91) · [LinkedIn](https://www.linkedin.com/in/tri-huynh-81735326a) · triqhuynh91@gmail.com
