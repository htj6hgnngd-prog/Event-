# VECTA / FASHION EVENING — DESIGN LOCK v1

Status: working direction for review, not final visual sign-off.
Date: 2026-11-11.
Branch: `design/fashion-evening-v1`.
Production branch: `main` remains unchanged until visual and conversion QA.

## Intent
A premium, image-led fashion editorial website for VECTA event photography and film production.
The visitor should feel a single cinematic space, not a vertical stack of repeated SaaS cards.
Conversion still takes priority: showing real output, explaining scope, and getting a qualified brief.

## Accepted direction to explore
- Evening fashion / art-directed editorial. **Not** gothic, baroque, antique, wedding invitation or luxury-hotel pastiche.
- Almost-black and warm charcoal atmosphere; off-white editorial type; very restrained wine-red accent.
- High-contrast Cyrillic serif for expressive titles: Cormorant Garamond. Contemporary compact sans for utilities: Manrope.
- Strong deliberate typographic scale, asymmetric visual mosaic, meaningful empty space, understated motion.
- Real VECTA event photographs and film from the current codebase. No fake clients or case metrics.
- Composed photo transitions rather than enclosed feature cards, pills, gradients or fake dashboards.
- Phone layout must be independently designed; not desktop columns squeezed to fit.

## Information and conversion
1. A clear commercial category in the intro: PHOTO / FILM / EVENTS.
2. Immediate access to selected work.
3. Why photo/video are planned as one media result, not separate technical deliverables.
4. Visible film sample; no autoplay with sound.
5. Three commercial routes: Photo, Film, Photo + Video; prices only from existing verified site copy.
6. Operating process in three visible phases.
7. Short qualified inquiry with date, place, type, media needs and contact.
8. Never claim a form was delivered unless the backend webhook confirmed success.

## Hard exclusions
- No standard hero + cards + feature badges + testimonials + generic CTA component library.
- No dark UI chrome or decorative gothic ornaments.
- No marble busts, wax seals, antique calligraphy flourish; these were styling exploration, not VECTA brand assets.
- No invented case studies, testimonials, clients, awards, deadlines or performance KPIs.
- Do not rebuild or delete original project files or legacy service pages.

## QA release checklist
- Copy lint and tests passing.
- Stable layouts at 390, 768, 1440px; no horizontal overflow.
- Main nav, film control, photo lightbox, all anchors and form states operational.
- Keyboard navigation / Esc / focus-visible / reduced-motion support.
- Images and video verified with actual network requests on deployed preview.
- Form delivery verified end-to-end with a configured destination; before that, show an honest fallback.
- Matching visual treatment for service pages before production replacement.
- Publish only after screenshot comparison and review.

## Known gaps in the first candidate
- Service-page design is still legacy and needs conversion to the new system.
- The lead destination is not configured in the selected Vercel project. Treat submission as unavailable until actual integration.
- Remote project media must be checked in a browser, especially portrait crops and mobile load.
