# VECTA Weddings — Plugin Stack Benchmark / Round 2

Date: 2026-11-11
Status: **verified capabilities and one interactive isolated prototype**; not a real-traffic A/B test.

## Compared combinations

| Pipeline | Actual test | Evidence | Verdict |
| --- | --- | --- | --- |
| Taste guidance + MagicPath + Firecrawl | Built real interactive VECTA gallery prototype; opened preview; clicked 2 settings; checked desktop/mobile CSS and tile count | MagicPath: https://designs.magicpath.ai/v1/wondrously-mountain-5550 ; component revision 471285733508931585. Desktop browser: 5 tiles, aria-pressed toggles, hero grid-column 3, gap 3px, no horizontal overflow. Mobile browser: iframe clientWidth 375, CSS 2 columns of 165px, hero spans 1/-1, 5 tiles, no horizontal overflow | **Passed targeted UI interaction tests**. Only placeholders, no real video playback, no polished custom calligraphy. Taste was a read skill, not an independently benchmarked external generator |
| Firecrawl + TinyFish | Independently extracted existing public homepage metadata/content/links; TinyFish fetched all 3 service pages | Homepage HTTP 200, Russian title/description/canonical and 3 service links. Service pages have distinct title/H1/description/self-canonical. URLs: /svadebnyy-fotograf/, /svadebnaya-videosemka/, /foto-i-video-na-svadbu/ | **Passed source agreement and technical SEO spot check**. No evidence of rankings, live conversion or search volume |
| Adobe Fonts + editorial design guidance | Recommendations filtered for Cyrillic; lookup verified a real family | Adobe Fonts Playfair Display Black: language_support includes ru, library full/trial available | **Passed Cyrillic font availability**. Did not activate, install, or visually compare typeface on real VECTA. Tattoo-style red letterform remains custom lettering |
| GitHub + Context7 + Vercel | Fetched existing Astro mosaic component; resolved high-reputation official Astro docs (processed script deduplication); verified Vercel VECTA project latest READY | Astro component has client-side observer script, Context7 /withastro/docs, Vercel project vecta-weddings READY | **Passed access and documentation checks**. Did not deploy an update or run a new E2E of unpublished Work source |
| Ahrefs + Russian SEO | Called keyword explorer for 3 Moscow wedding queries after loading tool's official schema | Ahrefs returned `Insufficient plan` | **Blocked by plan**. Do not pay or infer keyword volume |
| Supermetrics + Yandex | Discovered Yandex.Direct (YAD) and Yandex.metrica (YAM) | Both `NOT_AUTHENTICATED` | **Connector recognizes Yandex, not ready for live data analysis**. No campaigns or leads were read |
| Graphify + GitHub | Attempted to discover authorized indexed repositories | Graphify: no repositories enabled for agents | **Blocked until repo is enabled/indexed**. Native GitHub works |
| Figma / MagicPath / Lovable availability | Read account capabilities/projects | Figma connected, starter View seat; MagicPath existing sample project empty prior to this benchmark; Lovable no projects | **Figma and Lovable untested for actual VECTA design output**; MagicPath tested by prototype above |

## Experimental artifact

[MagicPath VECTA Editorial Mosaic interactive prototype](https://designs.magicpath.ai/v1/wondrously-mountain-5550)

Design specs:
- Dark near-black, restrained burgundy, editorial serif/sans.
- EXACTLY FIVE empty media slots: one feature + 4 smaller.
- A still and a loop have the same slot geometry.
- Left/right feature and loose/tight spacing as accessible buttons.
- Mobile 2-column layout; full-width leading tile.
- This is an **isolated test**, not merged to the website or deployed on Vercel.
- There is NO actual video, autoplay, image upload, conversion form, full brand lettering, or site-wide page builder in this prototype.

## What learned

1. Most reliable short path for **design experiments**:
   **Taste design discipline -> MagicPath interactive component -> Firecrawl browser QA -> review/approve -> GitHub/Vercel implementation**.
2. For **production quality**, add **Impeccable** as design/UX review, **Agent Skills TDD** for new behavior, **Context7** for official Astro docs, then GitHub CI and Vercel preview.
3. For **Russia SEO**, Firecrawl+TinyFish can inspect public pages today. Ahrefs cannot return paid volumes under current plan. Supermetrics Yandex data requires source authentication; do not assume Yandex SEO/Ads metrics.
4. For **type**, Adobe Fonts is useful for checking actual Cyrillic availability, but typography choice still needs design approval and license/activation before shipping.
5. Do not add all plugins to every task. Prefer short pipelines and minimize paid calls. PostHog, Supabase, Railway are future needs, not prerequisites for a 5-slot static gallery.
6. Current published VECTA remains separate from unpublished Work sources. Never overwrite Work with an older captured website or an isolated MagicPath test.

## Selection status

**Provisional leader, based on observed execution, not revenue:**
Taste + MagicPath + Firecrawl for editorial prototyping.
Impeccable + Context7 + GitHub + Vercel for production QA/shipping.

What is still missing before calling any creative approach a permanent winner:
- Pixel/visual QA on the *latest* Work source at 320/390/768/1440.
- Actual uploaded approved photo and short MP4 loop with poster; autoplay/reduced-motion verification.
- Accessibility audit including keyboard and screenreader of final components.
- Measured lead flow from selecting photo/video package to date enquiry.
- Design approval from the owner and real conversion data after launch.

## Memory and repeatability

Record this result in `PLUGIN_STACK_STANDARD.md` and `AGENTS.md` in the VECTA branch.
These are project-level durable records, **not a claim that ChatGPT's account-wide Memory has been modified**.

## Costs / prerequisites

No paid Ahrefs upgrade, Supermetrics/Yandex sign-in, or external campaigns were started. One new private MagicPath test project and component were created. Public VECTA deployment and `main` branch remained unchanged.
