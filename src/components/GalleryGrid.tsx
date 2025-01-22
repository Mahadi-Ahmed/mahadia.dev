import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useEmblaCarousel from 'embla-carousel-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { GalleryPost } from '@/content/gallery/types';

interface Props {
  posts: GalleryPost[];
}

const GalleryGrid = ({ posts }: Props) => {
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [selectedPost]);

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="break-inside-avoid rounded-lg bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="p-2">
              <img
                src={post.images[0].src}
                alt={post.images[0].alt}
                className="w-full h-auto rounded-md"
              />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={selectedPost !== null} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-background/90">
          {selectedPost && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Carousel
                ref={emblaRef}
                className="w-full"
              >
                <CarouselContent>
                  {selectedPost.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="flex items-center justify-center p-4">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              <div className="flex justify-center gap-2 pb-4">
                {selectedPost.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? 'bg-white' : 'bg-white/50'
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
  );
};

export default GalleryGrid;
