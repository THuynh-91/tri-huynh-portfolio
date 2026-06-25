# Adding & maintaining projects

The portfolio is **data-driven**: every project card is one object in
[`data/projects.json`](data/projects.json). To add a project you add one entry —
no component changes required. Optionally you drop in an embedded demo, a
preview screenshot, or point at a hosted demo.

The cards render in [`components/ProjectCard.jsx`](components/ProjectCard.jsx)
and the preview lightbox in [`components/ProjectModal.jsx`](components/ProjectModal.jsx).

---

## Schema (`data/projects.json`)

Each entry is a JSON object. Only `id`, `title`, `tagline`, `tech`, `impact`,
and `tag` are required; everything else is optional.

| Field          | Type        | Required | Purpose |
| -------------- | ----------- | :------: | ------- |
| `id`           | number      | yes      | Unique, stable key. Use the next free integer. |
| `title`        | string      | yes      | Card heading. |
| `tagline`      | string      | yes      | One-line hook under the title. |
| `description`  | string      | no       | Longer blurb shown in the preview modal. |
| `tech`         | string[]    | yes      | Tech badges (first 5 shown, rest collapse to `+N`). |
| `impact`       | string[]    | yes      | Bullet highlights (first 2 shown on the card). |
| `tag`          | string      | yes      | Filter category. Existing: `Agentic AI`, `ML`, `Full-Stack`, `Tools`. A new value automatically creates a new filter pill. |
| `year`         | string      | no       | Shown as a pill on the cover. |
| `featured`     | boolean     | no       | `true` shows it in the default top-3 "featured" view. |
| `demoUrl`      | string/null | no       | A **public** hosted demo (e.g. a Vercel URL). Highest-priority action. |
| `embedUrl`     | string/null | no       | Path to a self-contained static demo bundled under `public/` (e.g. `/demos/casino/index.html`). Opens in a new tab. Works on GitHub Pages with no backend. |
| `previewImage` | string/null | no       | Path to a screenshot under `public/` (e.g. `/images/previews/foo.png`). Opens the in-page lightbox. Used only when there's no live/embedded demo. |
| `imageUrl`     | string/null | no       | Card cover image under `public/`. Falls back to initials if omitted. |
| `githubUrl`    | string/null | no       | Source link. |
| `localUrl`     | string/null | no       | A `http://localhost:PORT` link to the app running on the author's machine. **Only rendered in local dev** — it is hidden in the published GitHub Pages build (dead links never ship). |
| `runLocally`   | string/null | no       | Short "how to run it" note shown in the preview modal. |

### How the card chooses its primary action (publish-safe)

In the **published / production** build a card shows, in priority order:

1. `demoUrl` — a real public live demo, **or**
2. `embedUrl` — the bundled client-only interactive demo, **or**
3. `previewImage` — the screenshot lightbox, **or**
4. just the cover image.

A `localUrl` is **never** shown on the published site — only when the site is
served locally in development. (See `showLocalLinks()` in `ProjectCard.jsx`,
which gates on `process.env.NODE_ENV` plus a runtime hostname check.) This
guarantees no dead `localhost` links for public visitors.

---

## Add a new project (minimum)

Append one object to `data/projects.json`:

```json
{
  "id": 15,
  "title": "My New Thing",
  "tagline": "A one-line hook",
  "tech": ["TypeScript", "React"],
  "impact": ["What it does well", "Another highlight"],
  "tag": "Full-Stack",
  "year": "2026",
  "featured": false,
  "githubUrl": "https://github.com/THuynh-91/my-new-thing"
}
```

That's it — the card appears automatically.

### …with a hosted public demo

Add `"demoUrl": "https://my-thing.vercel.app"`.

### …with a screenshot preview (no live demo)

1. Drop a screenshot at `public/images/previews/my-thing.png`.
2. Add `"previewImage": "/images/previews/my-thing.png"` and a `"runLocally"` note.

### …with an embedded, client-only interactive demo

This is the best option for GitHub Pages — it plays with **no backend**.

1. Create `public/demos/<name>/` containing a self-contained `index.html` plus
   any JS/CSS/assets it needs. **Use relative asset paths** (`lib/foo.js`, not
   `/lib/foo.js`) so it works under the GitHub Pages base path
   (`/tri-huynh-portfolio/...`).
2. Add `"embedUrl": "/demos/<name>/index.html"` to the project entry.

Existing embedded demos to copy the pattern from:

- `public/demos/pendulum/` — physics sandbox (canvas + JS).
- `public/demos/roulette/` — single-player roulette table.
- `public/demos/casino/` — **client-only** port of the Maison casino's solo
  games (roulette, blackjack, slots, plinko). It reuses the multiplayer repo's
  game *engines* verbatim and runs them in the browser via a small CommonJS shim
  (`engine/_wrap.js`) + a fake single-player room/socket
  (`engine/local-room.js`, `engine/local-socket.js`). See that folder for how to
  bundle a server-backed app's logic to run standalone.

---

## Deploy

GitHub Pages builds from `main` via `.github/workflows/deploy.yml`
(`npm run build` → static export in `out/` → `deploy-pages`). `next.config.js`
sets `output: 'export'` and `basePath: '/tri-huynh-portfolio'` in production.
Just merge to `main`; the action publishes. Anything under `public/` (including
`public/demos/`) is copied into the export as-is.
