# countdrop.com

The product site for Countdrop. Static HTML, CSS, and a tiny progressive-
enhancement script; there is no build step or runtime dependency.

```
index.html             landing page  → countdrop.com          (App Store marketing URL)
support/index.html     support + FAQ → countdrop.com/support/ (App Store support URL, required)
privacy/index.html     privacy policy→ countdrop.com/privacy/ (App Store privacy URL, required)
race/index.html        Universal Link fallback for shared Daily Challenge races
assets/site.css        shared visual system and responsive layout
assets/site.js         reveal motion and the interactive theme showcase
assets/screens/        current English in-game captures, resized for the web
assets/video/          compressed, muted web version of the App Store preview
assets/og-countdrop.jpg 1200×630 social sharing card built from current gameplay
CNAME                  the custom domain GitHub Pages serves this repo at
```

## Deploying

This folder **is** the git repo. Edit, commit, push — GitHub Pages rebuilds in
about a minute.

```bash
git add -A && git commit -m "..." && git push
```

Screenshots and the preview come from the game itself, so regenerate them rather
than editing by hand. Capture English raws on the `Countdrop-Shots` simulator,
then create web-sized exports from the files in the parent game's
`AppStorePreview/` directory. Keep stills around 720 px wide and the muted web
preview around 2–4 MB so the landing page remains fast on mobile connections.

**Done at launch (2026-09-01):** `robots.txt` and the `noindex` meta tag in
`index.html` are gone, so the landing page is open to search. `support/`,
`privacy/` and `race/` keep their `noindex` permanently: they are utility pages
people arrive at by link, and indexing them only competes with the landing page.

**This site is half of the app's race links.** `.well-known/
apple-app-site-association` is what lets iOS open `countdrop.com/race#…`
straight into Countdrop, and `race/index.html` is what everyone without the
app sees instead. `.nojekyll` is not clutter: without it GitHub Pages runs the
site through Jekyll, which silently drops dot-directories — the AASA file
would simply not be published, and every race link would fall back to Safari.
After deploying, confirm Apple's CDN can see it:

```bash
curl -s https://app-site-association.cdn-apple.com/a/v1/countdrop.com
```

**The pages make factual claims about the app** — what is synced, what deleting
the app removes, what we can and cannot read. When save or sync behaviour
changes in the game, these change with it. Both pages were wrong for one release
because that did not happen.

## Why this shape

Apple requires a support URL and a privacy policy URL, and a review will click
both. They have to be live before submission and stay live for as long as the
app is on the store — which is why this is a static site on infrastructure with
no billing attached to it rather than a hosted CMS.

---

# Adding the next product's site

GitHub Pages serves **one custom domain per repository** — the `CNAME` file
holds exactly one hostname. So each product with its own domain needs its own
repo. The pattern:

| Repo | Domain | Lives in |
|---|---|---|
| `countdrop-site` | countdrop.com | `CasualGame4/StoreAssets/website/` |
| `<product>-site` | `<product>.com` | `<that project>/StoreAssets/website/` |
| `sunimori-site` | sunimori.com | a standalone folder (company site, no game) |

Each site's source lives inside its own game project, next to the screenshots
that feed it, and that folder is its own git repo. Nothing is shared at build
time — copy these three pages as the starting template and swap the copy,
colours and images. For a three-page site that is less work than maintaining a
shared toolchain across repos.

**Setting up the next one:**

```bash
cd <new project>/StoreAssets/website
echo "<product>.com" > CNAME
gh repo create <product>-site --public
git init -b main && git add -A && git commit -m "..." 
git remote add origin https://github.com/<user>/<product>-site.git
git push -u origin main
gh api -X POST repos/<user>/<product>-site/pages -f 'source[branch]=main' -f 'source[path]=/'
```

Then point the domain at GitHub with the same DNS records as countdrop.com
(four apex `A` records plus a `www` `CNAME`), and enable HTTPS once the
certificate is issued.

**Company site:** sunimori.com should eventually list every product and link
out to each product site. Each product site already links back to it from the
footer, so the brand accumulates across releases.
