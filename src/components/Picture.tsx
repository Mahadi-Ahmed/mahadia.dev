import { useState, useEffect, useRef } from 'react'
import { getImageUrl } from '@/lib/image-utils'

interface Props {
  src: string
  alt: string
  height: number
  width: number
}

const Picture = ({ src, alt, height, width }: Props) => {
  const [isLoaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const [bigPic, setBigPic] = useState('')

  console.log(imgRef)

  useEffect(() => {
    // Check if the image is already loaded from cache
    if (imgRef.current && imgRef.current.complete) {
      // console.log('loaded', src)
      setLoaded(true)
      const fullSize = src.split('-tiny')
      const bigPicUrl = fullSize[0] + fullSize[1]
      setBigPic(bigPicUrl)
      console.log(bigPicUrl)
    }
  }, [])



  return (
    <div className="relative w-full h-auto">
      {/* {!isLoaded && ( */}
      {/*   <div */}
      {/*     className="w-full h-full bg-gray-200 animate-pulse rounded-md" */}
      {/*     style={{ aspectRatio: `${width}/${height}` }} */}
      {/*   /> */}
      {/* )} */}

      <img
        // src={getImageUrl(src, 'tinyThumbnail', 500)}
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-auto rounded-md transition-opacity duration-300 inset-0
          ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        height={height}
        width={width}
        loading="lazy"
        fetchPriority="high"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

export default Picture
