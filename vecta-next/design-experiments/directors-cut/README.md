# VECTA Weddings — Director's Cut / Flagship 2027
Prototype: https://designs.magicpath.ai/v1/zealously-bridge-2536

## What is created
- Complete interactive editorial wedding landing page in isolated MagicPath:
  giant Cyrillic typographic hero; crimson "навсегда" crossing media edge;
  modern contrast cream panel; approved 5-tile asymmetric Editorial Mosaic;
  formats/photo/cinema/both; short enquiry with a Telegram chat handoff;
  FAQ and mobile navigation.
- The layout is owner-approved *in principle* (Editorial Mosaic). The final
  typography, calligraphic signature and full homepage version are not yet
  visually approved.
- All gallery and hero slots are intentionally placeholders; no borrowed
  wedding photographs or imaginary real video. Loop slot is tagged but does not
  play an MP4 until approved media are supplied.
- The enquiry is client-only; it assembles a Telegram text URL. It does not
  submit or persist data, does not book a date, and does not claim delivery.

## Tested
- MagicPath React/TypeScript build completed (revision 471298265594343424).
- Desktop 1920 browser: no horizontal overflow or console errors, 5 gallery
  tiles, choosing Cinema or Photography correctly updates selected radio and
  focuses date. First FAQ opens and closes.
- Mobile 320 first pass: correct five-tile grid and working menu; it found
  cramped radio label and headline line-height; fixed those in the revision
  above. A follow-up validation is pending.
- No SEO claims/conversion uplift. No production changes.

## Source of truth / safety
This folder archives the MagicPath React component plus CSS for transfer to
the *latest unpublished Work implementation*. It is not integrated into the
Astro frontend yet. The public https://vecta-weddings.vercel.app and GitHub
main stay unchanged. Do NOT overwrite unpublished Work content using older
GitHub pages.

Before production: integrate and recheck layout at 320/390/768/1440; use
real owner-supplied photo/video assets; verify MP4/poster/autoplay and reduced
motion; check Telegram handoff on real devices; host Cyrillic fonts reliably
for Russian visitors; verify legally appropriate consent/data handling.
