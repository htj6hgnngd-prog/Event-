import type { MediaTile } from '../components/EditorialMosaic.astro';

/**
 * Temporary data adapter for the editorial gallery.
 * The same typed shape will be supplied by the visual CMS later.
 * Do not add reference images or stock content here.
 */
export const weddingGallery = {
  layout: 'feature-left' as const,
  items: [
    { id: 'wedding-01', kind: 'photo' },
    { id: 'wedding-02', kind: 'photo' },
    { id: 'wedding-03', kind: 'loop' },
    { id: 'wedding-04', kind: 'photo' },
    { id: 'wedding-05', kind: 'photo' },
  ] satisfies [MediaTile, MediaTile, MediaTile, MediaTile, MediaTile],
};
