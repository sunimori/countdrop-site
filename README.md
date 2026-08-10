# countdrop.com

The product site for Countdrop. Three static pages, no build step, no
dependencies — plain HTML with inline CSS.

```
index.html          landing page  → countdrop.com          (App Store marketing URL)
support/index.html  support + FAQ → countdrop.com/support/ (App Store support URL, required)
privacy/index.html  privacy policy→ countdrop.com/privacy/ (App Store privacy URL, required)
CNAME               the custom domain GitHub Pages serves this repo at
hero.png shot-*.png screenshots, regenerated from the game — see below
```

## Deploying

This folder **is** the git repo. Edit, commit, push — GitHub Pages rebuilds in
about a minute.

```bash
git add -A && git commit -m "..." && git push
```

Screenshots come from the game itself, so regenerate them rather than editing by
hand: capture raws on the `Countdrop-Shots` simulator, then re-run the resize
step in the parent project.

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
