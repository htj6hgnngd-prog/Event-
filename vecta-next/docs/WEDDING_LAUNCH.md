# VECTA / Wedding 2027

## Product direction
VECTA 2.0 is a wedding-only website. The main goal is to attract couples planning weddings in Moscow/Moscow region in 2027 and convert suitable visitors into enquiries about available dates. Corporate-event services and portfolio are **not** part of the new website's navigation, landing pages or sitemap. The legacy project at repository root is untouched.

## Media policy
- The owner will provide new, approved wedding photographs and videos.
- No legacy event photos, third-party stock photos, sample wedding couples or unverified case studies are used on the new pages.
- Current graphic/photo area is a temporary non-image layout slot, NOT a final release asset.
- After receipt, choose imagery by intent: hero (couple/feeling), full weddings (trust), portraits (style), ceremony / parents / guests (story), motion highlights (video).
- Obtain explicit permission for publishing identifiable guests and couples, especially for advertising use.
- Add responsive sizes, AVIF/WebP fallbacks, descriptive alt, mobile crop and video poster. Prefer static poster on slow connections; respect reduced motion.

## Core landing pages
- `/` — wedding 2027 homepage, seasonal CTA.
- `/svadebnyy-fotograf/` — wedding photography, Moscow.
- `/svadebnaya-videosemka/` — wedding films, Moscow.
- `/foto-i-video-na-svadbu/` — wedding photo + video combined.
No generic event-production SEO pages appear in the new build.

## Search and ads
- Priority market: Moscow & Moscow region, Yandex Search and Yandex Direct.
- Use Yandex Wordstat for validated geo-segmented demand before writing final campaigns.
- Separate ad groups/landing pages by wedding photo vs wedding video vs combined coverage.
- Yandex Metrika goal names planned: `wedding_date_cta` (contact-section click), `telegram_click` (external contact click). Neither equals a booked wedding.
- Qualified lead, consultation and confirmed booking require a CRM and verified source tracking, not only a click.
- Keep `PUBLIC_YANDEX_METRIKA_ID` blank until a real counter and consent/legal setup are available.

## Conversion / launch gates
- Verify contact channel and booking-date mechanism; currently Telegram opens an external chat, it does not send a form or check actual availability.
- Approve final wedding photos and videos.
- Confirm wedding offer, responsible shooter, wedding package structure and prices as of 2027 (historical 2026 quotes are not automatically valid).
- Set final domain in Astro config, robots and sitemap; configure 301 redirects and verify with Yandex Webmaster.
- Confirm required privacy disclosures, analytics consent, and handling of personal data.
- Test every route, CTA, mobile menu, videos, forms, performance and indexing; no release without these checks.
