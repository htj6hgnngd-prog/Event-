# VECTA Visual Admin — architecture

## Goal
Sign in as an administrator and visually edit wedding texts, photos,
video loops, page sections, crop, ratios, sizes, ordering, and placement.

## Selected direction: Sanity Studio + Presentation / Visual Editing
With the Astro 7 frontend and a controlled layout model.
Official references:
https://www.sanity.io/docs/visual-editing/introduction-to-visual-editing
https://www.sanity.io/docs/visual-editing/enabling-drag-and-drop
https://www.sanity.io/docs/visual-editing

Sanity provides click-to-edit, preview, draft/publish and drag-to-reorder
for configured page sections. Freehand pixel dragging and resizing
like Figma is not automatic. We will add controlled tile size and
placement presets in custom content schemas / Studio components.

## Editorial Mosaic schema
- layout: feature-left or feature-right; can be extended with presets.
- items: five stable-id tiles, ordered; each tile photo or muted video loop.
- media fields: asset, poster for loops, crop/focal point and alt text.
- tile order is editable; the same layout renders public and preview modes.
- existing renderer: src/components/EditorialMosaic.astro
- existing empty data adapter: src/data/weddingGallery.ts
- CSS: public/site.css / EDITORIAL MOSAIC

## Desired editor
- Proper authenticated admin and MFA when possible.
- Navigation: Pages / Stories / Media / Layout / SEO / Publish.
- Preview actual site in desktop and mobile modes.
- Click a headline to change its copy.
- Replace each media slot with an uploaded photo or video loop.
- Drag tile order, choose featured position and approved size ratios.
- Preview before publishing, revision history and rollback.
- No visual editor controls or editable public endpoints for visitors.

## Implementation gates
1. Owner provides or connects a Sanity project/account.
2. Define page, gallery, media and SEO schemas.
3. Add secure preview endpoints and frontend content queries.
4. Configure access control, secrets and publication permissions.
5. Verify responsive previews, media storage and performance.
6. Review any applicable Russian privacy/data localization requirements.

Alternative for fully self-hosted operation: Payload CMS + Puck-style
visual block editor, persistent database, object storage and Railway.
This requires more development and operational maintenance.

No real CMS/admin login has yet been provisioned; do not present a mock
authentication screen as functional.
