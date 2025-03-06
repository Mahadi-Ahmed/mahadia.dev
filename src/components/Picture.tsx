import { useState, useEffect, useRef } from 'react'
import { getImageUrl } from '@/lib/image-utils'

interface Props {
  src: string
  alt: string
  height?: number
  width?: number
  viewportSize: number
  fullSize: boolean
}

const Picture = ({ src, alt, height, width, viewportSize, fullSize }: Props) => {
  const [isLoaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const thumbnailUrl = getImageUrl(src, 'tinyThumbnail', viewportSize)
  const srcUrl = getImageUrl(src, fullSize ? 'full' : 'thumbnail', viewportSize)

  useEffect(() => {
    // NOTE: Check if the image is already loaded from cache
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true)
    }
  }, [src])

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
      'object-contain'
    ].join(' ')
  }

  const imageClasses = getImageClasses(fullSize)

  return (
    <div className="relative w-full h-auto">
      <img
        src={thumbnailUrl}
        ref={imgRef}
        alt={alt}
        className={`${imageClasses} rounded-sm absolute inset-0 transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        height={height}
        width={width}
      />

      <img
        src={srcUrl}
        ref={imgRef}
        alt={alt}
        className={`${imageClasses} rounded-sm transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        height={height}
        width={width}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

export default Picture

