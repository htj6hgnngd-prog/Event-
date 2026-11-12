# VECTA / pointed-pen evening editorial — v9

## Current authority
The user explicitly rejected v8 ornament and font, requested independent visual research beyond web design, and asked for Cyrillic lettering inspired by the supplied thechiattattoo references. This supersedes v8's rounded Great Vibes treatment. Existing repository, wedding-only factual copy, desktop-only scope, no photos/video and no backend lead delivery remain.

## Research actually inspected
Web research used both search engines, Pinterest image results and Firecrawl image extraction from Behance. Downloaded reference images were viewed locally only and are not published.

- User's three thechiattattoo screenshots: primary authority. Long oblique strokes, compressed lowercase, extreme stroke contrast, expansive capitals, lettering itself as composition.
- Pinterest / Boni, Maritza: https://www.pinterest.com/pin/boni-on-instagram-maritza-for-a-good-friend-and-awesome-artist-maritzadelgado1811-sketch-letras-letters-lettering-letteringtattoo-tattoostyle-ta--7036943159136700/ . Viewed the actual artwork. Extracted long pen lifts and letter-connected flourishes, not copied contours.
- Roberlan Paresqui, Spencerian Letterings: https://www.behance.net/gallery/38264351/Spencerian-Letterings-May-June-2016 . Viewed actual black-and-white lettering. Thin returns, tapered downstrokes, asymmetry, controlled loops.
- Brando Corradini, Brand identity in Fashion–Editorial: https://www.behance.net/gallery/54427545/Brand-identity-in-the-Fashion-Editorial . Viewed three actual spreads. Large variation in typographic scale, one dominant object, print-style margins and cropping; no adoption of its green palette.
- Roman Gruzdkov, identity for my wedding: https://www.behance.net/gallery/157407135/identity-for-my-wedding . Viewed a project detail. Custom lettering as a unifying device; no marbling copied.
- Cyrillic collections by Marina Marjina and Dima Lamonov were viewed and rejected as visual directions: too close to vyaz, ecclesiastical/blackletter or broad-nib work for this brief.
- Pinterest Royalty/rose artwork was viewed and rejected: blackletter and literal tattoo motifs are outside the intended fashion direction.

No claim of exhaustive browsing of all platforms or of permanent model training. No external reference imagery in the site payload.

## Spatial and visual decisions
Black #08090b, neutral ivory #edece6, concentrated deep red #610710–#780815, old gold confined to small functional hairlines. Removed every floral engraving instance. The oversized original Векта drawing crosses one red plane; the offering is readable below. Latin VECTA remains in the header. Studio, Approach and Request each use related bespoke drawings, with separate space below for factual copy.

The homepage archive becomes four differently scaled placements, not five thumbnail tiles. Removed only one redundant dummy frame from the homepage; all six archive layouts and their navigation remain. Main scenes alternate sides and density. Factual text and commercial formats retain legibility. Media areas remain declared empty.

## Original lettering implementation
scripts/build-vecta-lettering.py contains original cubic centerlines and a pressure-based pointed-pen outline model. No outlines from Great Vibes, Cormorant or other fonts were imported. Five fixed word drawings (Векта, Студия, Подход, Запрос, Избранное) and a companion display font are reproducible from source. The first four drawings are used in the site; the selected drawing is retained as a design study.

The companion TTF/WOFF2 contains Russian Unicode coverage and bespoke word ligatures. It is a display study v0.1, not a finished general-purpose font family: some uppercase forms are scaled script forms, spacing and language coverage beyond Russian are not production type-foundry work. Large primary drawings use SVG outlines for stable composition and have equivalent text in the heading accessibility tree. Decorative SVG is aria-hidden and noninteractive. The earlier rejected font/assets remain in Git history, but have no active ornamental instances.

## Motion
One short signature reveal with an already visible initial state and reduced-motion fallback. Removed drift animation from the large chapter lettering and adjacent media planes; native scrolling remains. No animation gates access to content.

## QA actually performed
Static: generator rebuilt 11 pages; one H1 each, no duplicate IDs, internal page targets resolve, no img/video/iframe content, no rejected ornament instances. Original font cmap checked for all Russian uppercase/lowercase characters. JS syntax passed; functional JS unchanged.

First staged visual inspection found a long photo-heading fallback/wrap and too little reserve below some pen descenders. Replaced that heading with the factual roman face and separated the chapter copy. Final staged build dpl_CaMAUY4Z6dAH3xNNdfk6qq1MqEaj was inspected at actual CSS widths 1514 and 2044 (browser zoom, not exact 1440/1920 emulation). All ten inner pages opened at 1514 without document overflow. Photo heading correction confirmed visually. At 2044, Studio/Approach/Request title-to-copy bounding gaps were approximately 63/67/34 px.

Format selection navigated to request.html?format=highlight and prepared a Telegram message containing that format and a test venue. No message was sent. Archive film filter showed four matching layouts. Original forms, keyboard focus outlines and reduced-motion styles retained. No claim of end-to-end backend delivery, mobile QA or conversion uplift.

Publication uses the same source payload as the final inspected staged build. Domain aliases must be checked against the final deployment. The previous cloud-browser connection issue is now resolved. The new build was opened directly at https://vectawedding.ru/ in Work at 1514×1040; fonts settled to loaded, four lettering drawings present, no horizontal document overflow. Navigation to /request.html and back was verified on the custom domain. The domain tab was kept open for review.

Final production deployment: dpl_FadFWTqi3s4TU2kiYpQHxmwg8KeY.
