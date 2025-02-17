import { useState, useEffect } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import type { GalleryPost } from '@/content/gallery/types'
import { getImageUrl } from '@/lib/image-utils'

interface Props {
  posts: GalleryPost[];
}

const GalleryGrid = ({ posts }: Props) => {
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [viewportSize, setViewportSize] = useState(0)


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportSize(window.innerWidth)
    }
  }, [])

  useEffect(() => {
    if (!api) return
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Reset current index when modal opens/closes
  useEffect(() => {
    setCurrent(0)
    if (api) {
      api.scrollTo(0)
    }
  }, [selectedPost, api])

  return (
    <>
      <div className='columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4'>
        {posts.map((post) => (
          <div
            key={post.id}
            className='break-inside-avoid rounded-lg bg-card hover:shadow-lg transition-shadow cursor-pointer'
            onClick={() => setSelectedPost(post)}
          >
            <div className='p-2'>
              <img
                src={getImageUrl(post.images[0].src, 'thumbnail', viewportSize)}
                alt={post.images[0].alt}
                className='w-full h-auto rounded-md'
                height={post.images[0].metadata.height}
                width={post.images[0].metadata.width}
                loading='lazy'
                fetchPriority='high'
                decoding='async'
              />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={selectedPost !== null} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className='max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-background/90'>
          {selectedPost && (
            <div className='w-full h-full flex flex-col items-center justify-center'>
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {selectedPost.images.map((image, index) => (
                    <CarouselItem key={index} className="flex items-center justify-center">
                      <DialogTitle className='sr-only'>{image.alt}</DialogTitle>
                      <DialogDescription className='sr-only'>{image.alt}</DialogDescription>
                      <div className='w-full h-full flex items-center justify-center p-4'>
                        <img
                          src={getImageUrl(image.src, 'full', viewportSize)}
                          alt={image.alt}
                          className='max-w-full max-h-[80vh] w-auto h-auto object-contain'
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <div className='flex justify-center gap-2 pb-4'>
                {selectedPost.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === current ? 'bg-white' : 'bg-white/50'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GalleryGrid
