# Json utility

A local, **client-side only** JSON and JWT tool built with Nuxt. Format and explore JSON with a collapsible tree, and encode or decode tokens (HS256 / RS256), edit claims in a form, and verify signatures — all in your browser.

**Live app:** [https://jsonutility.bijaybhandari.com/](https://jsonutility.bijaybhandari.com/)

## Features

### Three workspaces

| Tab | Purpose |
|-----|---------|
| **Decode JWT** | Paste a token, inspect header and payload, edit and rebuild the JWT |
| **Encode JWT** | Build header and payload, sign with a secret or private key |
| **Format JSON** | Pretty-print, minify, sort keys, and explore JSON in a collapsible tree |

### Decode JWT

- **Paste JWT** — Colored token input (header, payload, signature segments)
- **Auto-decode** — Debounced decode when you paste or edit the token
- **Status** — Valid JWT / Invalid JWT and Signature Verified / Signature Not Verified
- **Header & payload (JSON)** — Editable header JSON and read-only payload preview in one panel
- **Payload** — Form-based claim editor (string, number, boolean, null, JSON types) with add/remove rows
- **Verify signature** — HS256 shared secret or RS256 public key (plain text, Base64, PEM, file upload)
- **Smart updates** — Editing header or payload rebuilds the token; changing the key only re-verifies (does not re-sign)
- **Toolbar** — Load sample (jwt.io demo token + secret), Clear, algorithm selector

### Encode JWT

- **Signed JWT** — Live colored output at the top; regenerates when header or payload change
- **Header & payload (JSON)** — Same split layout as decode (editable header + read-only JSON preview)
- **Payload** — Same claim form editor as decode
- **Signing key** — HS256 secret or RS256 private key (PEM upload supported)
- **Generate JWT** — Manual sign button; key changes re-verify only
- **Layout** — Full-width sections on large screens (token → editors → key)

### Format JSON

- **JSON input** — Paste any valid JSON; output updates as you type
- **Format styles** (dropdown) — Each style controls preview text, copy output, tree indent, and default collapse:

  | Style | What you get |
  |-------|----------------|
  | Pretty (2 spaces) | 2-space indented preview + expanded tree |
  | Tab | Tab-indented preview + tree (4-space indent) |
  | Pretty (collapsed) | 2-space JSON; tree starts collapsed |
  | Tab (collapsed) | Tab-indented JSON; tree starts collapsed |
  | Sorted keys (pretty) | Keys sorted A–Z, 2-space preview + tree |
  | Sorted keys (collapsed) | Sorted keys, collapsed tree |
  | Minify | Minified one-line preview + expanded tree |
  | Sorted keys (minify) | Sorted + minified preview + tree |
  | Sorted minify (collapsed) | Sorted, minified, collapsed tree |

- **Collapsible tree** — Parent/child view; click ▶/▼ on objects and arrays
- **Expand all / Collapse all** — Quick tree controls
- **Copy** — Copies the formatted text for the active style (not just the tree view)
- **Layout** — 50/50 input and output on wide screens; tall editors on desktop

### Shared across JWT tabs

- **Algorithms** — HS256 (HMAC) and RS256 (RSA)
- **Header editor** — JSON with Format button and copy
- **Claims helpers** — `iat` now, `exp` +1h, `exp` +24h, clear `exp`, Add claim, Copy JSON
- **Copy buttons** — Token, header, payload JSON, and more
- **Dark / light theme** — System preference or manual toggle (top right)
- **Responsive layout** — Stacked on mobile; side-by-side panels (40/60 or 50/50) on large screens

## Tech stack

- [Nuxt 4](https://nuxt.com) (SPA, `ssr: false`)
- [Vue 3](https://vuejs.org)
- [jose](https://github.com/panva/jose) — JWT sign, verify, decode
- [@nuxtjs/color-mode](https://color-mode.nuxtjs.org) — Theme switching
- [@vueuse/nuxt](https://vueuse.org) — Debounce and utilities

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Cloudflare Pages (GitHub Actions)

Pushes to `main` and pull requests against `main` build the static site (`npm run generate`) and deploy `.output/public` to [Cloudflare Pages](https://developers.cloudflare.com/pages/) via [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

| Trigger | Environment |
|---------|-------------|
| Push to `main` | **production** ([jsonutility.bijaybhandari.com](https://jsonutility.bijaybhandari.com/)) |
| Pull request | **preview** (`pr-<number>.json-utility.pages.dev`) |
| Manual run (**Actions → Run workflow**) | Choose **preview** or **production** |

### One-time setup

1. **Create a Cloudflare API token**  
   [Dashboard → API Tokens](https://dash.cloudflare.com/?to=/:account/api-tokens) → Create Token → Custom token with **Account → Cloudflare Pages → Edit**.

2. **Get your Account ID**  
   [Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) → Overview → copy **Account ID** from the right sidebar.

3. **Add GitHub repository secrets**  
   Repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - `CLOUDFLARE_API_TOKEN` — token from step 1
   - `CLOUDFLARE_ACCOUNT_ID` — account ID from step 2

4. **Push to GitHub**  
   Connect this repo to GitHub and push `main`. The workflow [`.github/workflows/deploy-cloudflare-pages.yml`](.github/workflows/deploy-cloudflare-pages.yml) runs automatically.

On the first deploy, the workflow runs `wrangler pages project create json-utility` (then deploys). Production URL: [https://jsonutility.bijaybhandari.com/](https://jsonutility.bijaybhandari.com/)

You can also create the project once in the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers-and-pages) → **Workers & Pages** → **Create** → **Pages** → **Upload assets** → project name `json-utility`.

Pull requests get **preview deployments** (Wrangler uses `GITHUB_TOKEN` to comment on the PR).

### Manual deploy (optional)

```bash
npm ci
npm run generate
npx wrangler pages deploy .output/public --project-name=json-utility
```

Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your environment, or `wrangler login`.

## Docker

Requires [Docker](https://docs.docker.com/get-docker/) (Docker Desktop or Docker Engine).

**Docker Compose** (recommended):

```bash
docker compose up --build -d
```

Open [http://localhost:3000](http://localhost:3000).

```bash
docker compose logs -f    # follow logs
docker compose down       # stop and remove container
```

**Docker CLI**:

```bash
docker build -t json-utility:latest .
docker run -d -p 3000:3000 --name json-utility json-utility:latest
```

To use a different host port, change the mapping in `docker-compose.yml` (e.g. `"8080:3000"`) or pass `-p 8080:3000` to `docker run`.

## Security

All cryptography and formatting run **entirely in your browser**. Nothing is sent to a server. Do not use production secrets or private keys on shared or untrusted machines.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run generate` | Static site generation |

## Project structure

```
app/
├── components/       # UI (workspaces, panels, JSON tree, token input)
├── composables/      # JWT workbench state, crypto helpers
├── utils/            # JSON format, JWT segments, helpers
├── constants/        # Sample JWT and JSON
├── assets/css/       # Global styles and layout
└── pages/            # Single-page app (index)
```

## License

Copyright 2026 Bijay Bhandari

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full text.
