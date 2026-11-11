# VECTA Weddings — Agent Handoff

This directory contains a **non-production Astro prototype branch**. Before work, verify which source matches the latest ChatGPT Work implementation. The public site https://vecta-weddings.vercel.app can be older than Work's unpublished changes.

## Read first
- [Approved visual and plugin workflow](docs/PLUGIN_STACK_STANDARD.md)
- [Latest plugin research and verification](docs/PLUGIN_STACK_BENCHMARK_ROUND2_2026-11-11.md)
- [Editorial Mosaic component](src/components/EditorialMosaic.astro)
- [CMS plan, deferred](docs/VISUAL_EDITOR.md)

## Required conventions
- Preserve approved five-slot Editorial Mosaic and equal treatment for photo or short silent loop.
- Never add stock or Pinterest wedding imagery to represent client work.
- Verify Cyrillic text, Russian locale and Yandex-oriented copy.
- No fake forms, missing media, fake lead deliveries or made-up SEO performance figures.
- Changes in PR/preview before production; browser QA at narrow mobile and desktop widths.
- Test actual video behavior separately when an approved MP4 and poster are available.
- Use **Taste -> MagicPath -> Firecrawl -> Impeccable** for visual experimentation as warranted,
  and **Agent Skills TDD -> Context7 -> GitHub CI -> Vercel preview** for implementation.
- Retire a plugin if it adds complexity without measurable benefit.

## LUXURY audience + brand voice — mandatory update (2026-11-11)

Read [Luxury brand direction](docs/BRAND_VOICE_LUXURY.md) **before drafting any
texts or visuals**. The owner explicitly rejected teenage-romantic copy.
Avoid "навсегда", "любовь", sentimental quotes, and wedding salon clichés.
Speak through portfolio, art direction, quality of production and service.
Latest working prototype: https://designs.magicpath.ai/v1/eagerly-summer-3171
Do not confuse this with published production code.

## REFERENCE-LED ARCHITECTURE — OWNER'S CURRENT DIRECTION (2026-11-11)

**Read this FIRST before any VECTA architecture/design work:**
[Four owner-selected reference systems and architecture v0.1](docs/SELECTED_REFERENCES_ARCHITECTURE_V0.1.md).
Selected: **BOTTEGA53 (#1), Danilo & Sharon (#2), KT Merry (#5), Greg Finck (#8)**.
The owner selected the **underlying visual/page-construction system**, NOT
colors/fonts/sentimental text and NOT a specific no-code product.
The generic SaaS-shaped landing architecture in previous MagicPath prototypes
is REJECTED, including Director's Cut and Editorial 03 Luxury.
Do **not** iterate by recoloring or modifying hero/benefits/service cards.
Start with structural spatial portfolio index and deeply authored project pages.
Do not implement the v0.1 outline as if already approved; use it as a researched
architectural candidate for wireframes and review, then implement in the real
latest Work source. Preserve production and approved media slot specifications.
