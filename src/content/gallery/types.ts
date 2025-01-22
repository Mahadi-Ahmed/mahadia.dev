export type GalleryImage = {
  src: string;
  alt: string;
}

export type GalleryPost = {
  id: string;
  images: GalleryImage[];
}
