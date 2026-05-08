# akshaegolekar.com

A free, self-owned blog. Built with **Astro + Decap CMS + Vercel + GitHub**. Total cost: $0/month (you already own the domain).

- Lightning-fast static site (Astro)
- Write/edit posts from a `/admin` dashboard in your browser (Decap CMS)
- Deploys automatically on every push (Vercel)
- SEO out of the box — sitemap, RSS, Open Graph, schema-friendly metadata
- Content lives as plain Markdown files in your GitHub repo

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:4321.

## Project layout

```
src/
  consts.ts            # ★ EDIT ME — all customization (theme, fonts, links, features)
  content/blog/        # blog posts (markdown)
  content/config.ts    # post schema
  pages/               # routes
  layouts/             # page + post layouts
  components/          # head, header, footer, share, newsletter, comments, ...
  styles/global.css    # CSS that reads variables from consts.ts via ThemeStyles
public/
  admin/               # Decap CMS admin panel (loads at /admin)
  robots.txt
  favicon.svg
```

## Customizing the blog

**Open [`src/consts.ts`](src/consts.ts) — almost everything you can change lives there.** Save and the dev server hot-reloads instantly.

| What to change | Where in `consts.ts` |
|---|---|
| Site title, description, your name, email, domain | `SITE` |
| Logo / avatar in the header | `SITE.logo` (drop file in `public/`) |
| Default Open Graph share image | `SITE.defaultOgImage` (1200×630 in `public/`) |
| Header navigation links | `NAV` |
| Footer social icons (Twitter, GitHub, LinkedIn, Instagram, YouTube, Mastodon, email) | `SOCIAL` |
| Heading / body / mono font | `FONTS` (any Google Font — paste the import URL) |
| Light + dark mode colors | `THEME.light`, `THEME.dark` |
| Force light/dark or follow system | `THEME.defaultMode` |
| Reading width, base font size, border radius | `THEME.maxWidth`, `bodyFontSize`, `radius` |
| Link style (`hover`, `underline`, `highlight`) | `THEME.linkStyle` |
| Text-selection colors | `THEME.{light,dark}.selectionBg` / `selectionText` |
| Code-block syntax highlighting theme | `CODE.themeLight` / `themeDark` ([browse](https://shiki.style/themes)) |
| Toggle reading time, share buttons, tags, back-to-top, newsletter, comments | `FEATURES` |
| Newsletter provider (Buttondown / Substack) | `NEWSLETTER` |
| Comments via giscus (GitHub Discussions) | `GISCUS` (set up at [giscus.app](https://giscus.app)) |
| Analytics (Plausible / Umami / Vercel) | `ANALYTICS` |

### Examples

**Switch to a cool blue theme**
```ts
THEME.light.accent = "#2563eb";
THEME.dark.accent  = "#60a5fa";
```

**Use system fonts only (no Google Fonts request)**
```ts
FONTS.googleFontsUrl = null;
FONTS.heading = "ui-serif, Georgia, serif";
FONTS.body = "system-ui, sans-serif";
```

**Turn on comments**
1. Go to https://giscus.app, fill out the form for your repo.
2. Copy the `data-repo-id` and `data-category-id` it gives you into `GISCUS` in `consts.ts`.
3. Set `FEATURES.comments = true`.

**Turn on a newsletter**
1. Sign up at https://buttondown.email (free for first 100 subs).
2. Set `NEWSLETTER.identifier = "your-buttondown-username"`.
3. Set `FEATURES.newsletter = true`. Form appears under each post + on home page.

**Add a logo**
1. Drop `logo.png` (or `.svg`) into `public/`.
2. Set `SITE.logo = "/logo.png"`. It shows next to your site title.

## Writing a post (two ways)

**Option A — from the admin dashboard (`/admin`)**
1. Go to `https://akshaegolekar.com/admin/`
2. Log in (see auth setup below)
3. Click "New Blog Posts", write, and publish — Decap commits to GitHub for you.

**Option B — from your editor**
1. Add a markdown file to `src/content/blog/my-post.md`:
   ```md
   ---
   title: "My post"
   description: "One-liner for SEO."
   pubDate: 2026-05-10
   tags: ["ideas"]
   draft: false
   ---

   Body in markdown.
   ```
2. Commit + push. Vercel rebuilds in ~30 seconds.

## Deploying for free

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial blog"
gh repo create akshae-golekar-blog --public --source=. --push
```

### 2. Connect Vercel
- Go to https://vercel.com → "Add New Project" → import the repo.
- Framework: Astro (auto-detected). Click Deploy.
- After deploy, go to **Settings → Domains** → add `akshaegolekar.com` and `www.akshaegolekar.com`.
- Update your domain's DNS (at your registrar) to point at Vercel:
  - `A` record `@` → `76.76.21.21`
  - `CNAME` record `www` → `cname.vercel-dns.com`

### 3. Set up the admin panel auth (Decap CMS)

The admin dashboard at `/admin` needs auth so only you can publish. Two free options:

**Easiest: GitHub OAuth via a free proxy**
1. In GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://akshaegolekar.com`
   - Authorization callback URL: use the proxy below.
2. Deploy a free OAuth proxy (one-time, takes 5 min):
   - Fork https://github.com/vencax/netlify-cms-github-oauth-provider
   - Deploy on Vercel/Render/Fly free tier with env vars:
     - `OAUTH_CLIENT_ID` = your GitHub OAuth client ID
     - `OAUTH_CLIENT_SECRET` = your GitHub OAuth secret
     - `REDIRECT_URL` = `https://<your-proxy>.vercel.app/callback`
   - Set the callback URL in your GitHub OAuth app to the same.
3. Update `public/admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: <your-username>/akshae-golekar-blog
     branch: main
     base_url: https://<your-proxy>.vercel.app
   ```

**Alternative: Netlify Identity (also free)**
- Easier to set up, but requires a free Netlify account in addition to Vercel.
- Keep `backend.name: git-gateway` (current default) and follow https://decapcms.org/docs/git-gateway-backend/.

### 4. Submit to search engines (5 min, big traffic win)
- Google Search Console: https://search.google.com/search-console → add `akshaegolekar.com` → submit `https://akshaegolekar.com/sitemap-index.xml`
- Bing Webmaster Tools: https://www.bing.com/webmasters → same.

## Free traffic + engagement playbook

1. **Cross-post** every article to Dev.to / Medium / LinkedIn / Hacker News with a `canonical` link back to your domain. (Decap can paste the same markdown.)
2. **OG images** — drop a `og-default.png` (1200×630) into `public/`. Or auto-generate per-post with `@vercel/og` later.
3. **Newsletter** — add a free Buttondown / Substack signup form to `Footer.astro` once you have 3+ posts.
4. **Internal linking** — link new posts to older relevant posts. Compounds SEO over time.
5. **One cornerstone post per topic** — long, exhaustive, the post you'd want others to link to.
6. **Free analytics** — drop in [Plausible Community Edition](https://plausible.io/docs/self-hosting) self-host or use [Vercel Analytics](https://vercel.com/docs/analytics) (free tier).

## What's next?

Optional upgrades you can add later:
- `@vercel/og` for auto-generated OG images per post
- View transitions (`<ViewTransitions />` from Astro)
- Comments via [giscus](https://giscus.app/) (free, GitHub-discussion-backed)
- Search with [Pagefind](https://pagefind.app/) (free, static, ~10kb)

## License

Your content is yours. The scaffolding is MIT-licensed — do whatever you want with it.
