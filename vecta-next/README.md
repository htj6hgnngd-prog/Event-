# VECTA 2.0 / initial architecture

Independent Astro 5 prototype. Old files are retained at repository root only as reference. Develop in `vecta-next/`.

## Start

```bash
cd vecta-next
npm install
npm run dev
npm run build
```

## Scope
- Original conversion-oriented Russian copy, not an automatic rewrite of legacy copy.
- Home and six generated SEO service pages with unique titles, descriptions and canonical links.
- No invented metrics, clients, case studies, prices, testimonials or guarantees.
- Static pages first; contact uses an explicit Telegram link (no false claim of a submitted lead).
- Existing event photo used as a provisional placeholder; replace only with cleared owned imagery.
- Do not point Vercel production root to this directory before full acceptance tests.

## Release checklist
- Confirm intended canonical production domain; change `astro.config.mjs` and `robots.txt` together.
- Confirm current Telegram handle and media rights.
- Video CDN, verified case content, lead API and automated browser tests remain next steps.
- Run `npm install && npm run build`, inspect mobile navigation and page rendering before deployment.
