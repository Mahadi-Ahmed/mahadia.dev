import type { GalleryPost } from './types'

export const post: GalleryPost = {
  id: 'bali-2',
  images: [
    {
      src: 'bali-2/DSCF2230.jpg',
      alt: 'street photo',
      metadata: {
        width: 6240,
        height: 4160,
      },
      prioLoad: {
        sm: true,
        md: true,
        lg: false // NOTE: Could possibly set them to true
      }
    },
  ]
}
