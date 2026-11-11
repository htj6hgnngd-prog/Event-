# VECTA — Architecture from Selected Reference Systems (v0.1)

**Owner selection, 2026-11-11:** The *structural/visual foundation* of references
**1 BOTTEGA53, 2 Danilo & Sharon, 5 KT Merry, 8 Greg Finck** is the direction.
This selection concerns the **construction of layouts, composition and interaction**,
not brand colors, fonts, wedding copy or the underlying no-code site-builder.

This is an **architecture research brief**, NOT an approved finished design.
No current Director's Cut / Editorial 03 component is the starting template.

## Directly observed reference mechanics (source evidence)

### 1. BOTTEGA53 — portfolio as navigable spatial canvas
- https://www.bottega53.com/ and https://www.bottega53.com/contact
- Designer's case study: https://thefirstthelast.agency/work/bottega-53
- Agency explicitly describes a **strict photographic grid**, large photographs,
  a project canvas that **changes on reload**, filtering and search, and an
  unusually minimal navigation system.
- CONTACT is a separate meaningful destination with qualified event data.
- Transfer: navigation **through images and project discovery**, not a
  hero -> benefits -> services -> FAQ section sequence.
- Caveat: don't pretend the actual frontend stack is known solely from the
  agency portfolio; this is a behavioral/layout reference.

### 2. Danilo & Sharon — projects are long-form primary content
- https://www.daniloandsharon.com/real-weddings
- https://www.daniloandsharon.com/works/a-timeless-destination-wedding-at-villa-pizzo-lake-como
- https://www.daniloandsharon.com/contact
- Real Weddings is an **index of individually named events with venue and year**;
  a click opens a full project. The homepage also exposes this index.
- A narrative-style inquiry form captures wedding context, date, guests,
  location, planner/Instagram/email, etc. Note live markup may contain more
  than one form variant: this is not an approved field specification.
- Transfer: an information-rich **project index -> project reader** path,
  and a personal inquiry based on real event details.

### 5. KT Merry — a layered editorial publishing system
- https://ktmerry.com/portfolio and https://ktmerry.com/weddings
- https://ktmerry.com/contact
- Portfolio has **category switches** (editorial, weddings & engagements,
  travel/lifestyle), very large image sequences, named galleries, select
  featured galleries and behind-the-scenes films.
- The home/portfolio can reveal different depths of work, rather than relying
  on three service cards and a shallow landing page.
- Transfer: differentiated **content collections**, authored image sequences,
  and pathways for photographic vs film vs editorial depth. Only use content
  categories that VECTA genuinely has assets for.

### 8. Greg Finck — home as project navigation
- https://www.gregfinck.com/
- https://www.gregfinck.com/portfolio
- https://www.gregfinck.com/portfolio/mondo-and-desire
- https://www.gregfinck.com/contact
- The homepage itself enumerates named projects + locations with direct links
  to complete project pages, with minimal explanatory sales copy.
- CONTACT is a separate bespoke quote path.
- Transfer: immediate **project choice from first screen**, then quiet navigation
  between real complete works. No giant VECTA wordmark as filler.

## Derivative: new VECTA experience and page families

This is a **first architectural proposal** synthesized from selected examples;
the owner selected the references, not this specific route hierarchy.

### Primary experience: a project-led portfolio, not a sales landing page
- Root `/` opens on actual VECTA media as a **curated visual project index**.
  Intro exists only as necessary for recognition; no empty opening billboard.
- Each visible item is a way into a project or collection, with optional film
  loop in a photo-shaped cell. The site's project order and grouping can be
  authored, not auto-generated from standard three-column cards.
- The strict **1-large + 4-small Editorial Mosaic** approved earlier is
  available as one spread in this wider composition system, not a universal
  grid forced onto every page.
- Visitors can switch between `All / Photography / Films` if the actual
  inventory warrants it. Avoid fake filters that all show the same 5 empty
  placeholders.

### Project index: a living archive
- `/projects` (name provisional): curated projects and projects by year/genre,
  each with project name and true location/date context where authorized.
- Media-first entry, fast filters/search if enough projects; editorial
  alternation in crop, size, and pacing.
- No fabricated named couples/cases. Empty state must be designed deliberately.

### Project reader: editorial sequence, not a gallery plugin
- `/projects/:slug`: independently art-directed long-form photographic stories.
- Page assembled from **spreads**, selected by visual pacing:
  full-bleed still, pair/diptych, portrait next to landscape, photo/loop
  cohabitation, interstitial context strip, closing work + next project.
- Real facts only: venue/year/format if verified and permitted.
- Design navigation to **next/previous project** and return to index without
  burying visitors in sliders or modal pop-ups.
- Important: no borrowing or showing competitor images as VECTA work.

### Editorial collections and business context
- `/photography` and `/films` are content libraries first, supported by
  relevant evidence and only then modest service information.
- `/studio`: actual team, process, planner collaboration and production
  discipline, with proof rather than unverified authority claims.
- `/journal` when VECTA has real projects/articles and an editorial plan:
  optional search entry point, not a content-farm SEO wrapper.

### Project enquiry: quiet, high-intent route
- `/enquiry`: reachable from global nav, project endings and service context,
  not a white SaaS CTA banner repeated on every scroll.
- Carry optional selected project and photography/film preference.
- Date/location, contact, planner and brief; ask only decision-useful fields.
- Avoid hiding a lead behind Telegram-only navigation: support actual
  confirmation of delivery before claiming a successful submission.
- Moscow/Russia legal and operations requirements need separate review before
  live storage/processing.

## Layout and navigation grammar

**Not allowed:** hero headline + 3 service cards + 4 benefit cards + gallery +
FAQ + contact strip; scroll animation of generic rectangles; framed stock
photos; oversized brand lettering on empty canvas; "luxury" by recoloring.

**Required structural qualities:**
- Every page has a **distinct composition** but shares a compact navigation
  grammar (index, project, enquiry, context).
- Large real photographs determine geometry; the grid is a field for curated
  compositions, not a uniform component collection.
- Strong negative space when it isolates photographic work, not as filler.
- Motion is editorial and functional: short silent video loops within still
  grids, transitions preserving visitor place, no fake cinema effects.
- Desktop can use a spatial index; mobile must **recompose** the content into
  a readable sequence, not scale the desktop canvas down.
- Content density is deliberate. Project pages may have many images and video
  rather than a handful of generic sections.
- Brand remains discernible without giant VECTA text covering the work.

## Two visitor journeys (to test, not assert as already converting)

**Visual discovery:**
`/` -> select an image -> `/projects/:slug` -> next project or related
photo/film -> `/enquiry?project=...`

**Qualified professional inquiry:**
`/studio` or service-specific landing from Yandex -> proof/project examples ->
`/enquiry?format=...` -> validated lead.

The Russian SEO layer must still route visitors to actual Moscow wedding
photography / video service content; it is not allowed to force every entry
into a fake one-page slideshow.

## Next design deliverable (NO implementation until reviewed)
1. **Structural wireframes** of four page families: image-first landing,
   projects index, long-form project reader, enquiry, plus mobile transitions.
   No palette/font selection in this phase.
2. Annotated screenshots/video observation of four references mapping
   evidence to page composition and nav behaviors, not visual imitation.
3. Prototype only the **core index -> project -> index/enquiry transitions**
   against realistic empty/filled content states.
4. Review against the forbidden generic landing skeleton.
5. Implement on latest real Work source once the architecture is accepted;
   protect all production and unpublished work.

## Decision / status

- **Confirmed by owner:** 1, 2, 5, 8 are the selected visual construction
  references. Begin from architecture zero, do NOT repaint the current SaaS
  scaffold.
- **Not yet confirmed:** a particular homepage layout or project page
  composition, final CMS / technical website builder, UI animations, typography.
- **Do not confuse** the physical tools used by reference sites
  (agency-built/Webflow/Showit/Squarespace evidence varies) with the
  underlying visual architecture. Same-level presentation can be built with
  custom components; copying their platform would not copy their UX.
