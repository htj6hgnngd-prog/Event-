# VECTA Weddings — Director's Cut / Flagship 2027

**Published interactive visual prototype:**
https://designs.magicpath.ai/v1/zealously-bridge-2536

**Selected source revision:** MagicPath `471300727969579008`.
**GitHub baseline:** the archived React component and CSS in this folder.

## What is built

A complete responsive editorial wedding homepage, including:
- Large two-line Cyrillic fashion serif with dramatic red italic lettering
  crossing the portrait media frame.
- Bold off-white/near-black contrast and directional storytelling.
- Owner-approved 5-tile asymmetric Editorial Mosaic: one large frame and four
  smaller frames; one video-loop-designated cell has the same geometry as a photo.
- Three clearly differentiated formats (photos, cinema, photos+cinema).
- Selecting a format opens the date conversation section with the correct
  radio preselected and date input focused.
- Direct links to the three existing wedding service pages.
- Date, city and freeform enquiry fields; Telegram handoff composes a draft
  URL, not a submitted lead. Browser/Telegram compatibility still needs
  end-device confirmation.
- Mobile navigation, accessible form labels and native FAQ accordions.
- The form does not book a date, send an auto-submission or store visitor data.
- ALL hero and gallery media are intentional empty placeholders, not real
  wedding work or simulated video playback.

## Automated browser QA: PASSED

**GitHub Actions:** https://github.com/htj6hgnngd-prog/Event-/actions/runs/43056277537

**Screenshots and machine-readable report:**
https://github.com/htj6hgnngd-prog/Event-/actions/runs/43056277537/artifacts/13872200680

Chrome tests run against the **public MagicPath interactive prototype**, not
the archived source-only component. Four viewport widths were verified:
320px, 390px, 768px and 1440px.

All four tests PASS:
- No horizontal overflow; exact documentWidth === viewportWidth.
- All 5 mosaic cells retained; smaller cells share identical geometry.
- Format choices have no clipped labels at any tested width.
- Oversized headline metrics have no clipped text.
- Choosing the Cinema format updates the right radio button and focuses date.
- Native FAQ opens as expected.
- Mobile menu toggles open and closed on mobile sizes.
- No runtime JavaScript page errors.

The pre-fix failures were reproduced by automated test and corrected in two
revisions (mobile radio labels and typographic linebox). Test suite is stored in
`.github/scripts/vecta-directors-cut-qa.cjs` and is repeatable.

## Architectural / production boundaries

- The MagicPath prototype is **NOT** the Vercel production website.
- No production deployment, public customer data, backend, or other Work
  sources were changed. The GitHub `main` branch is untouched.
- This folder stores React and CSS for integration. The Astro project in
  `vecta-next/` and the latest unpublished Work implementation may differ.
  Recover latest Work files first; don't overwrite with older snapshots.
- Real media must come from the owner: photo, poster and silent short MP4.
  Verify loading, viewport autoplay/pause, reduced-motion and mobile bandwidth.
- Google Fonts were used for the prototype. Check self-hosting and licensing /
  accessibility / availability in Russia before production.
- The red italic signature is a *typographic exploration*, not finalized
  custom designed wedding calligraphy.
- The follow-up deployment should preserve Russian SEO landing pages and add
  actual analytics after appropriate legal review.
- Do not promise conversion uplift without measuring enquiries and bookings.

## Preferred tool workflow

Taste + MagicPath for prototype -> Impeccable for deliberate UX critique ->
GitHub Chrome E2E + Context7 for verification -> Vercel isolated preview ->
production only when reviewed.

This is a **reproducible project record**, not a claim to modify ChatGPT
account-wide memory.
