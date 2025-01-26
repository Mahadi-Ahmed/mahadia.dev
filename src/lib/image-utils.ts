const IMAGE_DOMAIN = import.meta.env.PUBLIC_R2_URL

type ImageSize = 'thumbnail' | 'preview' | 'full';
type ImageFormat = 'webp' | 'jpeg';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  blur?: number;
}

export const getImageUrl = (path: string, size: ImageSize): string => {
  const defaults: Record<ImageSize, ImageOptions> = {
    thumbnail: {
      width: 20,
      quality: 30,
      format: 'webp',
      blur: 10
    },
    preview: {
      width: 800,
      quality: 75,
      format: 'webp',
      fit: 'cover'
    },
    full: {
      // For full size, we use different widths based on screen size
      width: 1920,
      quality: 85,
      format: 'webp',
      fit: 'scale-down'
    }
  }

  const options = defaults[size]

  const optionsString = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')

  // Format: https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
  const sourceImage = `${IMAGE_DOMAIN}/${path}`
  return `${IMAGE_DOMAIN}/cdn-cgi/image/${optionsString}/${sourceImage}`
}
