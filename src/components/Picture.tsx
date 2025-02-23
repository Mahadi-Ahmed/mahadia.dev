import { useState, useEffect, useRef } from 'react'
import { getImageUrl, getImageWidth } from '@/lib/image-utils'

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
    // Check if the image is already loaded from cache
    if (imgRef.current && imgRef.current.complete) {
      console.log('loaded from cache')
      setLoaded(true)
    }
  }, [src])

  if (!thumbnailUrl) {
    return null
  }

  const imageClasses = fullSize ? `w-[${getImageWidth('full', viewportSize)}px] max-w-full max-h-[80vh] h-auto object-contain` : 'w-full h-auto rounded-md'

  return (
    <div className="relative w-full h-auto">
      {
        !isLoaded ? (
          <img
            ref={imgRef}
            src={thumbnailUrl}
            alt={alt}
            className={`${imageClasses} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} `}
            height={height}
            width={width}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        )
          : (
            <img
              ref={imgRef}
              src={srcUrl}
              alt={alt}
              className={`${imageClasses} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              height={height}
              width={width}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
            />
          )
      }
    </div>
  )
}

export default Picture

