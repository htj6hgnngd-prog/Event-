# VECTA Plugin Workflow — Candidate Standard

Status: **PROVISIONAL (round 1 benchmark)**. Follow until a better
experiment is measured; do not present it as a proven final winner.

## Candidate workflow

**Taste -> Impeccable -> GitHub CI / browser QA -> Vercel preview.**

- Taste: create/refine the VECTA editorial composition. Avoid generic SaaS,
  unnecessary ornaments, centered giant type inside photos and motion overload.
- Impeccable: review visual hierarchy, readability, responsive interaction,
  motion limits, booking-date enquiry path, copy and keyboard accessibility.
- GitHub: preserve the latest source, commit in reviewable branch and verify CI.
- Vercel: deliver accessible preview. Compare live desktop/mobile renders and
  test the actual enquiry route. Production remains protected until approval.

Special-purpose enhancements:
- Product Design **in Work**: concept generation, visual flow audit, and
  prototype comparison when browser+Sites tools are available.
- Awesome DESIGN.md: design reference studies, not production UI source code.
- Railway: only when backend, persistent data, upload, media storage or
  workflows require it. Do not introduce it for static styling changes.

## Objective evidence

The first controlled test on VECTA public HTML/CSS showed:
- 12/12 page render checks (320, 390, 1440; four variants) with no horizontal
  overflow or runtime JS errors.
- The two conversion variants passed 9/9 format choices and 9/9 keyboard
  Enter choices, preserving SEO links and the 5-tile editorial gallery.
- No real traffic A/B or booking conversion data; no final visual approval.

Details: [Plugin Stack Benchmarks](./PLUGIN_STACK_BENCHMARK_2026-11-11.md).

## Memory mechanism

This file is the **persistent project-level record** for future agents and
conversations working with the repository. Always read it before changing
the VECTA workflow. No claim is made that ChatGPT's account-wide memory
or Product Design plugin local user-context storage has been updated.

## Revision rule

Revisit after a second test on the latest Work implementation or if newly
connected tools become available. Prefer the stack with both verified
creative quality and lead-flow performance, not whichever has more plugins.
