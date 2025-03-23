import { useState, useEffect, useRef } from 'react'
import { getImageUrl, getViewportType } from '@/lib/image-utils'
import type { GalleryImage } from '@/content/gallery/types'

interface Props {
  image: GalleryImage
  viewportSize: number
  fullSize: boolean
  loadingBehaviour?: 'crossfade' | 'fadein'
  isLCP?: boolean
}

const Picture = ({ image, viewportSize, fullSize, loadingBehaviour = 'crossfade', isLCP = false }: Props) => {
  const [isLoaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const thumbnailUrl = getImageUrl(image.src, 'tinyThumbnail', viewportSize)
  const srcUrl = getImageUrl(image.src, fullSize ? 'full' : 'thumbnail', viewportSize)

  useEffect(() => {
    // NOTE: Check if the image is already loaded from cache
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true)
    }
  }, [image.src])

  if (!thumbnailUrl) {
    return null
  }

  const getImageClasses = (isFullSize: boolean) => {
    if (!isFullSize) {
      return 'w-full h-auto rounded-sm'
    }

    // NOTE: using hardcoded values instead of getImageWidth & the viewportMappings
    // in image-utils due to tailwind JIT
    return [
      'w-[800px]',
      'lg:w-[1280px]',
      'xl:w-[1800px]',
      'max-w-full',
      'max-h-[80vh]',
      'h-auto',
      'object-contain',
      'rounded-sm'
    ].join(' ')
  }

  const imageClasses = getImageClasses(fullSize)

  const fetchPrio = (): 'lazy' | 'eager' => {
    const viewport = getViewportType(viewportSize)

    if (viewport === 'mobile' && image.prioLoad?.sm) {
      return 'eager'
    } else if (viewport === 'tablet' && image.prioLoad?.md) {
      return 'eager'
    } else if (viewport === 'desktop' && image.prioLoad?.lg) {
      return 'eager'
    } else if (viewport === 'xlDesktop' && image.prioLoad?.lg) {
      return 'eager'
    }
    return 'lazy'
  }

  if (isLCP) {
    return (
      <img
        src={srcUrl}
        alt={image.alt}
        className={imageClasses}
        height={image.metadata.height}
        width={image.metadata.width}
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
    )
  }

  if (loadingBehaviour === 'crossfade') {
    return (
      <div className="relative w-full h-auto">
        <img
          src={thumbnailUrl}
          ref={imgRef}
          alt={image.alt}
          className={`${imageClasses} absolute inset-0 transition-opacity  ${isLoaded ? 'opacity-0 duration-300' : 'opacity-100 animate-pulse'}`}
          height={image.metadata.height}
          width={image.metadata.width}
        />

        <img
          src={srcUrl}
          ref={imgRef}
          alt={image.alt}
          className={`${imageClasses} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          height={image.metadata.height}
          width={image.metadata.width}
          loading={fetchPrio()}
          fetchPriority={fetchPrio() === 'eager' ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </div>
    )
  } else {
    return (
      <div className="relative w-full h-auto">
        <img
          src={isLoaded ? srcUrl : thumbnailUrl}
          ref={imgRef}
          alt={image.alt}
          className={`${imageClasses} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} `}
          height={image.metadata.height}
          width={image.metadata.width}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </div>
    )
  }
}

export default Picture

