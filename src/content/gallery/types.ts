export interface ImageMetadata {
  width: number;
  height: number;
  aspectRatio?: number;
  blurHash?: string; // Optional: for generating blur placeholders
}

export type GalleryImage = {
  src: string;
  alt: string;
  metadata: ImageMetadata;
}

export type GalleryPost = {
  id: string;
  images: GalleryImage[];
}
