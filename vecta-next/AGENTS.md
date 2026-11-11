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
