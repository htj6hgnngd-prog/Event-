/** Media entries can be photo or a silent short video loop. */
export type MediaTile = {
  id: string;
  kind: 'photo' | 'loop';
  src?: string;
  poster?: string;
  alt?: string;
};
export type EditorialLayout = 'feature-left' | 'feature-right';
export type FiveTileGrid = [MediaTile, MediaTile, MediaTile, MediaTile, MediaTile];
