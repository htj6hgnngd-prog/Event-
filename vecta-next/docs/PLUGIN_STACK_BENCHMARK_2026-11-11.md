# VECTA Weddings — Plugin Stack Benchmarks, round 1
Date: 2026-11-11
Status: **provisional**; production unchanged

## Source / safety boundary
We used the actual public VECTA Work deployment's HTML and CSS captured by
GitHub Actions in the already verified browser audit:
- Live URL: https://vecta-weddings.vercel.app
- Browser snapshot / QA run: https://github.com/htj6hgnngd-prog/Event-/actions/runs/43035255209
- Source screenshot / DOM archive: https://github.com/htj6hgnngd-prog/Event-/actions/runs/43035255209/artifacts/13862443006

The four benchmark variants were **local in-memory copies** of this snapshot.
No experiment changed Vercel, its production deployment, the Work source code,
the GitHub `main` branch, or any actual customer's data.

The custom experimental code was authored by the assistant **using installed
skill guidance** — it was not a direct automated head-to-head invocation of the
external products or an A/B test with real visitor traffic. Do not misrepresent
these results as proven revenue or conversion improvements.

## Variant table

| Variant | Combination / brief | What changed | Browser result |
|---|---|---|---|
| baseline | Published Work page | No changes | Baseline |
| taste_awesome | Taste + Awesome DESIGN.md | Conservative editorial typography and mobile headline sizing | No overflow / JS errors |
| impeccable_vercel | Impeccable + Vercel Verification principles | Add direct format-selection CTA to all three service cards while retaining the links to SEO service pages; preselect enquiry format and focus date | 9/9 selection checks, 9/9 keyboard Enter checks |
| taste_impeccable | Taste + Impeccable + GitHub/Vercel validation | Combine typography and guided format selection | 9/9 selection checks, 9/9 keyboard Enter checks; no overflow / JS errors |

Browser: headless Chromium, local copies rendered with `page.set_content()`
and injected CSS due to local HTTP being blocked in the execution environment.
Same captured HTML + CSS, same 320 / 390 / 1440 px widths for all four.
Each copy preserved all five editorial mosaic media slots and all three links
to SEO service pages.

Measured functional checks:
- 4 variants × 3 widths = 12 loaded-page checks.
- Horizontal overflow: 0/12.
- Runtime JS errors: 0/12.
- Updated variants each selected 3 formats on 3 widths = 9/9 selections.
- Updated variants passed direct keyboard Enter selection on 3 formats ×
  3 widths = 9/9.
- Following format selection, the correct value was present in the enquiry
  form and its date field focused.
- Vercel deploy logs, submitted leads, and real conversion outcomes were
  **not tested** in this synthetic exercise.
- Mobile H1 font-size changed from baseline 26 px to 29 px in typography
  variants. This is a measurable change, **not proof** of improved taste.

## Provisional winner — not yet a production approval

**Taste + Impeccable + GitHub/Vercel** is the most promising workflow:
1. Use Taste to design the distinctive VECTA editorial language while honoring
   the approved large-feature Editorial Mosaic and still media/loop tile sizing.
2. Use Impeccable to evaluate composition, readability, mobile behavior,
   accessibility and especially the enquiry path from chosen format to date.
3. Commit changes to an isolated GitHub branch and verify build, tests,
   keyboard controls, and screenshots before any deployment.
4. Publish Vercel preview and compare mobile/desktop in-browser.
5. Promote to production only after visual approval and successful end-to-end
   testing. Never claim a conversion lift without live performance evidence.

**Product Design** remains useful for brainstorming alternatives and audit in
**ChatGPT Work mode**; this environment did not expose its full Work browser
and Sites prerequisites, so it was not scored as a tested implementation
variant. **Railway** is unnecessary for a purely static UI comparison; retain
it for backend, media storage and workflow needs.

## User's invariant brief
- Brand: VECTA Weddings, Moscow, 2027 wedding bookings.
- Avoid default SaaS cards and cheap theater/velvet/curtain/gold decoration.
- Build around imagery and sophisticated typography.
- Large red lettering starts on the page background and partially crosses the
  photo/video edge rather than sitting fully in the center of a media tile.
- Approved mosaic: 5 tiles, one large and four equal-sized small ones.
- Videos are short silent loops in the **same-sized** tiles as photographs.
- Media slots remain blank until real user assets are provided.
- Sales funnel matters alongside strong aesthetics.
- Do not replace unpublished Work code with the older publicly captured HTML.

## What is NOT concluded
- No proof which style is most emotionally compelling for actual brides/grooms.
- No measured uplift in enquiry conversions or booking quality.
- No confirmed final font design or fully approved finished art direction.
- No evidence that any newly installed plugin is available beyond the tools
  and skills enumerated during this session.

## Next experiment
Compare a more substantial redesign on **the latest Work source**, if accessible:
Taste-led creative, Product Design ideation/audit in Work, and an
Impeccable-led refinement. Hold content, media and conversion goals constant.
Assess desktop/mobile screenshots blind, accessibility, loading, lead-flow
completion and actual task success. Adopt a winning stack only after
independent evidence, and re-check across tasks rather than relying on one
small benchmark.
