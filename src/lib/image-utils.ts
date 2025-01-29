const IMAGE_DOMAIN = import.meta.env.PUBLIC_R2_URL

type ImageSize = 'tinyThumbnail' | 'thumbnail' | 'full';
type ImageFormat = 'webp' | 'jpeg';
type ViewportType = 'mobile' | 'tablet' | 'desktop' | 'xlDesktop';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  blur?: number;
  'cf-cache-ttl'?: number
}

const ViewportMappings: Record<ViewportType, { preview: number; full: number }> = {
  mobile: {
    preview: 430,
    full: 800
  },
  tablet: {
    preview: 500,
    full: 800
  },
  desktop: {
    preview: 800,
    full: 1280
  },
  xlDesktop: {
    preview: 800,
    full: 1800
  }
}

const getViewportType = (width: number): ViewportType => {
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  if (width < 1280) return 'desktop'
  return 'xlDesktop'
}

const getImageWidth = (size: 'preview' | 'full', viewportWidth: number): number => {
  const viewport = getViewportType(viewportWidth)
  return ViewportMappings[viewport][size]
}

export const getImageUrl = (path: string, size: ImageSize, viewportSize: number): string => {
  const CACHE_TTL = 2592000

  const defaults: Record<ImageSize, ImageOptions> = {
    tinyThumbnail: {
      width: 20,
      quality: 30,
      format: 'webp',
      blur: 10,
      'cf-cache-ttl': CACHE_TTL
    },
    thumbnail: {
      width: getImageWidth('preview', viewportSize),
      quality: 80,
      format: 'webp',
      fit: 'cover',
      'cf-cache-ttl': CACHE_TTL
    },
    full: {
      // For full size, we use different widths based on screen size
      width: getImageWidth('full', viewportSize),
      quality: 85,
      format: 'webp',
      fit: 'scale-down',
      'cf-cache-ttl': CACHE_TTL
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
