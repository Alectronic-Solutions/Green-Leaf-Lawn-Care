# Green Leaf Lawn Care: website template

A fast, multi-page website for a residential lawn care company. It is fully static, so it hosts free on GitHub Pages or any static host, and every business detail lives in one config file.

Built with Next.js 16, React 19, Tailwind CSS 4, and Framer Motion.

## What's included

**Pages (40 at build time)**

| Page | Notes |
| --- | --- |
| Home | Video hero, services, why us, how it works, before/after slider, mowing game, instant quote, reviews, service areas, FAQ |
| `/services` + one page per service | Pricing, what's included, process, FAQs, related services, Service and FAQ schema |
| `/service-areas` + one page per city | Local copy, an illustrated map, nearby cities, city-level schema |
| `/quote` + `/quote/thank-you` | Live price estimate, URL prefill (`?service=…&promo=…`), spam honeypot |
| `/about`, `/reviews`, `/gallery`, `/faq`, `/contact`, `/careers` | Standard company pages |
| `/blog` + posts | Markdown posts with Article schema |
| `/privacy`, `/terms`, branded 404 | |

**SEO:** per-page titles, descriptions, and canonicals, plus LocalBusiness, Service, FAQPage, BreadcrumbList, and BlogPosting structured data. The sitemap, robots.txt, and `llms.txt` are generated from content, and there is a 1200×630 social share image, a favicon, and a web manifest.

**Design system:** one earthy color palette (tokens in `src/app/globals.css`), 3D icons with no background chips, balanced headings and orphan-free paragraphs, one shared motion curve, and a leaf trail that follows the cursor. Every animation respects "reduce motion".

**The mowing game:** 12 levels across three neighborhoods, with obstacles, a dog, stripe patterns that depend on mowing direction, stars, sound, and keyboard controls. Clearing lawn 3 unlocks a promo code that carries into the quote form.

## Rebrand it for a new company

1. **Business details:** edit `src/config/site.ts` (name, phone, email, address, hours, license, social links, rating, offers, promo code).
2. **Content:** edit the files in `src/content/`:
   - `services.ts`: services, prices, what's included, FAQs, the seasonal calendar
   - `cities.ts`: service-area cities and their local copy and coordinates
   - `reviews.ts`: paste real Google reviews (first name and last initial only)
   - `faqs.ts`, `company.ts`: FAQs, feature list, team, values, gallery projects
   - `blog/*.md`: blog posts (drop in a new `.md` file to publish one)
3. **Photos:** replace the files in `public/images/` (keep the names, or update the paths in the content files). PNG, JPG, or WebP all work; responsive sizes are generated at build time. Real crew and customer photos convert far better than stock images.
4. **Colors:** change the palette tokens at the top of `src/app/globals.css`.
5. **Logo:** `src/components/site/logo-mark.tsx` and `src/app/icon.svg`.

Once you change `site.ts`, every page, schema block, sitemap entry, and legal page updates with it.

## Connect the forms

The site has no server, so the quote, contact, and careers forms post to a form service. Until one is connected they run in **demo mode** (nothing is sent, and the thank-you page says so).

1. Create a free form at [Web3Forms](https://web3forms.com) (or Formspree).
2. Set these at build time (in GitHub: *Settings → Secrets and variables → Actions*):
   - `NEXT_PUBLIC_FORM_ENDPOINT` (variable), for example `https://api.web3forms.com/submit`
   - `NEXT_PUBLIC_FORM_ACCESS_KEY` (secret), your Web3Forms access key

## Analytics (optional)

Set `NEXT_PUBLIC_GA4_ID` or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. The site tracks `call_click`, `sms_click`, `quote_submit`, `contact_submit`, `intro_rate_locked`, `game_level_complete`, `game_promo_unlocked`, and `game_promo_claimed`.

## Deploy

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`, which runs lint, typecheck, and build first.

- **Project site** (`username.github.io/repo-name`): set the repository variable `NEXT_PUBLIC_BASE_PATH` to `/repo-name`.
- **Custom domain:** add `public/CNAME` containing your domain, set `NEXT_PUBLIC_BASE_PATH` to an empty value, and set `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com`.

Any static host works: upload the `out/` folder after `npm run build`.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build        # static site in out/
npm run fetch-icons  # re-download the 3D icon set (see scripts/fetch-3d-icons.mjs)
```

Build steps that run automatically:

- `scripts/optimize-images.mjs` renders responsive widths of every photo.
- `scripts/flatten-segments.mjs` fixes Next 16's static-export prefetch files so client navigation works on static hosts.

## Launch checklist

- [ ] Real business details in `src/config/site.ts`
- [ ] Real photos, reviews, and team members
- [ ] Form endpoint connected and a test submission received
- [ ] `rating.showInSchema` turned on only once the numbers match the Google Business Profile
- [ ] Google Search Console: verify the domain and submit `/sitemap.xml`
- [ ] Google Business Profile links to the site and uses the same name, address, and phone

## Credits

3D icons: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT). Some icons are hue-shifted to match the palette.
