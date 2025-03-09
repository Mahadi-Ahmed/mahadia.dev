const IMAGE_DOMAIN = import.meta.env.PUBLIC_R2_URL

type ImageSize = 'tinyThumbnail' | 'thumbnail' | 'full';
type ViewportType = 'mobile' | 'tablet' | 'desktop' | 'xlDesktop';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  blur?: number;
  'cf-cache-ttl'?: number
}

const ViewportMappings: Record<ViewportType, { preview: number; full: number }> = {
  mobile: {
    preview: 400,
    full: 400
  },
  tablet: {
    preview: 450,
    full: 750
  },
  desktop: {
    preview: 470,
    full: 1000
  },
  xlDesktop: {
    preview: 470,
    full: 1200
  }
}

export const getViewportType = (width: number): ViewportType => {
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
      width: 40,
      quality: 20,
      //NOTE: format:auto = 'avif > webp > jpeg',
      format: 'auto',
      blur: 20,
      'cf-cache-ttl': CACHE_TTL
    },
    thumbnail: {
      width: getImageWidth('preview', viewportSize),
      quality: 70,
      format: 'auto',
      fit: 'cover',
      'cf-cache-ttl': CACHE_TTL
    },
    full: {
      // For full size, we use different widths based on screen size
      width: getImageWidth('full', viewportSize),
      quality: 80,
      format: 'auto',
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
