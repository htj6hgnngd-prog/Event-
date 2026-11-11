# Work handoff: VECTA Weddings live QA — 2026-11-11

## Exact publication tested

- URL: https://vecta-weddings.vercel.app/
- Vercel project: `vecta-weddings`
- Deployment observed: `dpl_3dDZTGwMKAk2uZxTTF8oFmpxMjDD` (READY)
- Browser: real Google Chrome via GitHub Actions (Ubuntu 24.04)
- Browser QA run: https://github.com/htj6hgnngd-prog/Event-/actions/runs/43035255209
- Screenshots, desktop/mobile and copied public DOM/CSS: https://github.com/htj6hgnngd-prog/Event-/actions/runs/43035255209/artifacts/13862443006

## Verified live behavior

| Viewport | HTTP | Document horizontal overflow | JS errors | Details controls |
| --- | --- | --- | --- | --- |
| 320 × 780 | 200 | None | None | Pass |
| 360 × 780 | 200 | None | None | Pass |
| 390 × 844 | 200 | None | None | Pass |
| 768 × 1024 | 200 | None | None | Pass |
| 1440 × 900 | 200 | None | None | Pass |

Mobile menu and public FAQ details expand in-browser.
No browser console errors observed in the tested flows.

## IMPORTANT: live publication is older than the last reported Work edits

The last Work-mode progress stated that a Cyrillic-supporting font pair and expandable format selection were implemented, and that a narrow-mobile QA remained.

The currently deployed HTML/CSS **does not** reflect those latest changes:
1. The computed h1 font is `Iowan Old Style, Baskerville, Times New Roman, serif` with zero registered FontFace entries in `document.fonts`, indicating no custom font pair is active on this deployment. Mobile h1 is 26px at 320–390 widths.
2. The three service cards are plain links to `/svadebnyy-fotograf/`, `/svadebnaya-videosemka/` and `/foto-i-video-na-svadbu/`. They do not expand inline or directly preselect the enquiry format.
3. The enquiry form itself contains a separate format `<select data-brief-format>` with four options. Clicking the three homepage service cards does not preselect it in the live DOM.
4. The enquiry form uses a GET navigation to `https://t.me/denisovphotos` with a hidden `text` field. This was NOT submitted or verified as delivered by the QA — do not assume submissions reach the business.
5. The published visual palette is light/ivory with burgundy type. Reconcile with the user's earlier dark editorial design requirements before any redesign.

Therefore **do not overwrite the unpublished Work implementation** with this published snapshot. The GitHub `vecta-next/` feature branch is a separate older prototype, not the Work session's exact last edited source.

## Exact next Work steps

1. Recover the **most recent unpublished Work files** containing the Cyrillic fonts, updated format choice and enquiry integration.
2. Test those files in a **preview environment** (not the older live version) on widths 320, 360, 390, 768, 1440.
3. Check that fonts actually load with Cyrillic text and fallback does not occur.
4. Click each format card and assert that correct form option is selected and accessible by keyboard. Test both mobile and desktop. Do NOT send test leads to Telegram.
5. Review screenshot crops, typography hierarchy, media placeholder sizing and preserved editorial mosaic.
6. Promote only a verified preview; keep the main production and legacy event site unchanged until ready.

This report is an audit only; it does not publish or replace any website code.
