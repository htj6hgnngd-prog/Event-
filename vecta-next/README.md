# VECTA / Weddings 2027 (development)

**Status:** wedding-only Astro prototype in `vecta-next/`. Legacy event-production site is retained at repository root and has not been replaced in production.

## Work locally

```bash
cd vecta-next
npm install
npm run dev
npm run build
```

## Pages
- `/` Wedding home, date enquiries for season 2027
- `/svadebnyy-fotograf/` Wedding photography
- `/svadebnaya-videosemka/` Wedding videography
- `/foto-i-video-na-svadbu/` Wedding photo + video

## Media
**Owner will supply entirely new wedding photos and videos.** No legacy event photos or stock wedding images have been reused. Temporary artwork and reserved layout slots must be replaced with cleared real media before release.

## SEO + leads
Focus: Yandex search and ads for Moscow + Moscow region. See `docs/YANDEX_SEO.md` and `docs/WEDDING_LAUNCH.md`.
Yandex Metrika currently requires an actual `PUBLIC_YANDEX_METRIKA_ID` before measurements work. Telegram CTA opens the actual contact but does **not** submit a lead form or confirm availability.

## Release blockers
1. Confirm final public domain and update Astro canonical, sitemap, and robots.
2. Add new owner-supplied photos/videos and review rights and mobile crops.
3. Confirm contact and date-availability process; implement reliable lead delivery if a form is needed.
4. Configure Yandex Metrika / Webmaster and required data handling disclosures.
5. Run production build, browser QA, video/network checks, and mobile tests.

The old domain and public deployment remain untouched until explicitly ready.
