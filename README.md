# Personal Website — Philip Wojcicki

A simple, single-page personal website built with plain HTML, CSS, and JavaScript.
No build step, no framework — just open `index.html` in a browser, or push to GitHub Pages.

## Repository structure

```
personal_website/
├── index.html              # The page itself (all content lives here)
├── README.md               # You are here
├── CNAME                   # Custom domain for GitHub Pages (filipwojcicki.com)
├── .nojekyll               # Tells GitHub Pages to skip Jekyll preprocessing
├── assets/
│   ├── photo.svg           # Placeholder portrait (replace with your photo)
│   ├── favicon.svg         # Browser tab icon
│   └── CV_Philip_Wojcicki.pdf
├── css/
│   └── styles.css          # All styling
└── js/
    └── main.js             # Theme toggle, active-section highlighting, footer year
```

## Local preview

Just open `index.html` in your browser — it works as a static file.

If you'd prefer a real local server (recommended, since some browsers block
`file://` resources):

```bash
# Python 3
python3 -m http.server 8000

# or, if you have Node.js
npx serve .
```

Then visit <http://localhost:8000>.

## Deploy to GitHub Pages

The repo is already set up to be served as a GitHub Pages **user site** for
`fiwo735` and as the custom domain `filipwojcicki.com`. The two relevant
files are:

| File        | Purpose                                                              |
| ----------- | -------------------------------------------------------------------- |
| `CNAME`     | One line containing `filipwojcicki.com` — tells Pages the custom domain. |
| `.nojekyll` | Empty file — tells Pages to serve files as-is (skip Jekyll).         |

### Step 1 — Create the GitHub repository

For a **user site**, the repository name *must* be exactly
`fiwo735.github.io` (it has to match `<username>.github.io`).

```bash
# from inside this project folder
git init                                   # if not already a git repo
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/fiwo735/fiwo735.github.io.git
git push -u origin main
```

### Step 2 — Enable Pages

1. Open `https://github.com/fiwo735/fiwo735.github.io` → **Settings → Pages**.
2. Under **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` and `/ (root)`
3. Click **Save**.
4. After ~1 minute, `https://fiwo735.github.io` will be live.

### Step 3 — Wire up `filipwojcicki.com`

The `CNAME` file is already in the repo, so GitHub already knows which
custom domain to serve. You just need to point DNS at GitHub.

At your domain registrar's DNS panel for `filipwojcicki.com`, add:

**Apex (`filipwojcicki.com`)** — four `A` records:

| Type | Host / Name | Value             |
| ---- | ----------- | ----------------- |
| A    | `@`         | `185.199.108.153` |
| A    | `@`         | `185.199.109.153` |
| A    | `@`         | `185.199.110.153` |
| A    | `@`         | `185.199.111.153` |

If your registrar supports IPv6, also add the matching `AAAA` records:
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`,
`2606:50c0:8003::153` (same `@` host).

**`www` subdomain** — one `CNAME` record:

| Type  | Host / Name | Value                 |
| ----- | ----------- | --------------------- |
| CNAME | `www`       | `fiwo735.github.io.`  |

Note the trailing dot in `fiwo735.github.io.` — some registrars require it,
others add it automatically.

### Step 4 — Tell GitHub about the custom domain

1. Back in **Settings → Pages**, under **Custom domain**, enter
   `filipwojcicki.com` and click **Save**. (GitHub will read the `CNAME`
   file automatically; this step is mostly to trigger the DNS check.)
2. Wait for the "DNS check successful" green tick. DNS propagation can take
   a few minutes to ~24 hours.
3. Tick **Enforce HTTPS**. GitHub will provision a free Let's Encrypt
   certificate within an hour or so.

### Step 5 — Verify both URLs work

Once DNS has propagated and the cert is issued:

- `https://filipwojcicki.com` → serves the site directly.
- `https://www.filipwojcicki.com` → automatically redirects to the apex.
- `https://fiwo735.github.io` → automatically redirects to
  `https://filipwojcicki.com`.

This is the standard GitHub Pages behavior: once a custom domain is
configured, the `*.github.io` URL is treated as the canonical fallback
and 301-redirects to your custom domain, so visitors typing either
address end up on the same page. (If you ever want to break the
redirect, delete the `CNAME` file and clear the **Custom domain** field
in Pages settings.)

### Future deploys

After the initial setup, every `git push` to `main` re-deploys the site:

```bash
git add .
git commit -m "Update bio / new project / etc."
git push
```

Pages typically rebuilds in <30 seconds. You can watch the deploy under
**Actions** or **Settings → Pages**.

## Customising the site

All content lives in **`index.html`**. The most common edits:

### Replace the placeholder portrait

Drop a square image (e.g. 600×600 px JPG or PNG) into `assets/` and update
the avatar `<img>` in `index.html`:

```html
<img class="avatar" src="assets/photo.jpg" alt="Portrait of Philip Wojcicki" />
```

You can then delete `assets/photo.svg` if you'd like.

### Update social profile links

Inside the sidebar's `<ul class="contact">`, replace the placeholder URLs
with your actual profiles:

| Icon            | Edit the `href` of                                    |
| --------------- | ----------------------------------------------------- |
| Email           | `mailto:filip.wojcicki18@imperial.ac.uk`              |
| LinkedIn        | `https://www.linkedin.com/in/filip-wojcicki/`         |
| GitHub          | `https://github.com/...`  *(currently a placeholder)* |
| Google Scholar  | `https://scholar.google.com/...` *(placeholder)*      |
| ORCID           | `https://orcid.org/...` *(placeholder)*               |

### Add real paper / code links to research projects

In the **Research Projects** section, each entry has a header like
`Paper [VENUE] · Code`. The venue links (e.g. `[FCCM]`, `[ICCD]`) are
already wired to the conference / journal websites. The `Paper` and
`Code` links currently point to `href="#"` — replace each `#` with the
real PDF / repo URL once available. For pending submissions the
`Paper pending` text deliberately has no link.

### Edit text content

Each section is clearly marked with HTML comments
(`<!-- ============== EDUCATION ============== -->`, etc.).
Inside, entries follow the same `<article class="entry">` pattern, so
adding/removing items is straightforward — copy an existing block and
edit the text.

### Tweak colours

The colour palette is controlled by CSS variables at the top of
`css/styles.css`:

```css
:root {
  --color-primary: #1d3a8a;   /* Imperial-ish blue */
  --color-accent:  #0a66c2;
  /* ... */
}
```

Change those two values to re-skin the whole site.

## What's already wired up

- Responsive two-column layout (sidebar collapses to top on mobile).
- Sticky left sidebar on desktop, sticky section-nav on the right.
- Smooth-scrolling anchor links.
- Active-section highlighting in the nav (via `IntersectionObserver`).
- Print-friendly stylesheet (the nav and CV button are hidden when printing).
- Reduced-motion support.
- Skip-to-content link for keyboard users.

## License

Content (text, CV) © Philip Wojcicki. The site scaffolding (HTML/CSS/JS)
is yours to reuse however you like.
