# VECTA Weddings — Preferred Plugin Workflows

Updated: 2026-11-11, benchmark round 2.
Status: **PROVISIONAL**, evidence-backed engineering preference; no proven conversion lift or final aesthetic winner.

## Track A: premium editorial design

1. **Taste**: design direction, reject generic SaaS patterns, preserve user's approved editorial look and media rules.
2. **MagicPath**: isolated interactive prototypes **only when testing a real component or layout**. First successful test: [five-slot Editorial Mosaic](https://designs.magicpath.ai/v1/wondrously-mountain-5550).
3. **Adobe Fonts**: optional Cyrillic support/licensing checks. Do not use supplied font files from other users or assume a custom calligraphy font exists.
4. **Firecrawl** browser interact: verify the preview on desktop and mobile.
5. **Impeccable**: design/UX critique before implementation approval.
6. **GitHub + Vercel**: port selected changes to latest Work source, run tests, stage a preview, verify, then publish after approval.

## Track B: software implementation / regression control

**Agent Skills TDD -> Context7 official docs -> GitHub branch+CI -> Vercel preview -> browser QA**.
Ponytail can review complexity at the end, but must not delete requirements, SEO, accessibility or the video-loop feature.

Never assume an older GitHub prototype is the newest unpublished Work source.
Never call a successful build a visual approval.

## Track C: SEO and conversion for Russia

- **Firecrawl + TinyFish** for public on-page audits, links, titles, canonicals and sitemap coverage.
- **Supermetrics** after the user connects **Yandex.Direct** and **Yandex.metrica** to audit paid funnel data; these sources were NOT_AUTHENTICATED on the benchmark date.
- **Ahrefs** would be supplemental only if existing plan includes it; a Russia keyword request returned `Insufficient plan`. No upgrade was authorized.
- Do not claim increased conversion rate without lead and visit measurements.

## Unproven / conditional

- **Figma**: connected but no Figma source frame supplied, starter View seat; no end-to-end design creation test yet.
- **Lovable**: account works, zero projects; using it just to rebuild existing Astro stack would add unnecessary fragmentation.
- **Graphify**: installed but no indexed repositories enabled; GitHub directly is safer today.
- **Supabase / Railway**: reserve for admin/media storage/backend once planned.
- **fal / Adobe media generation**: only with approved assets/use case. Never invent wedding portfolio photos.

## Invariant VECTA brief

- Wedding-only VECTA, Russia/Moscow, 2027 enquiry funnel.
- Elegant original fashion-editorial (NOT SaaS, generic wedding, heavy gilding, cheap curtains/velvet).
- One large + four equal small editorial mosaic slots; silent 2–4s video loops occupy photo-size cells.
- Red expressive lettering belongs to the background and may partially overlap a media edge.
- Empty media placeholders until owner supplies assets; don't use reference photos as portfolio.
- Prioritize both emotional impact AND enquiry completion.
- Protect production and unpublished Work versions.

## Results and memory

[Round 1](./PLUGIN_STACK_BENCHMARK_2026-11-11.md) · [Round 2](./PLUGIN_STACK_BENCHMARK_ROUND2_2026-11-11.md).

This document is a durable **repository memory for future coding agents**. It does NOT mean ChatGPT account Memory was updated.
