import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { GalleryPost } from '@/content/gallery/types';

interface Props {
  posts: GalleryPost[];
}

const GalleryGrid = ({ posts }: Props) => {
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);

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
        <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-background/85">
          {selectedPost && (
            <div className="flex items-center justify-center h-full">
              <img
                src={selectedPost.images[0].src}
                alt={selectedPost.images[0].alt}
                className="max-h-[85vh] max-w-[90vw] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryGrid;
