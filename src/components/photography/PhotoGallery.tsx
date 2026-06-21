'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, PhotoCategory } from '@/types';
import PhotoLightbox from './PhotoLightbox';

interface PhotoGalleryProps {
  photos: Project[];
  category?: PhotoCategory;
}

export default function PhotoGallery({ photos, category }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Infinite scroll via Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < photos.length) {
          setVisibleCount(c => Math.min(c + 8, photos.length));
        }
      },
      { rootMargin: '200px' }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [visibleCount, photos.length]);

  const visiblePhotos = photos.slice(0, visibleCount);

  const goNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, photos.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedIndex, goNext, goPrev]);

  if (photos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="text-7xl mb-6">{category ? category.icon : '📷'}</div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No photos yet</h3>
        <p className="text-foreground/40 max-w-sm">
          {category 
            ? `Be the first to add a photo to ${category.label}. Upload a photo and it'll appear here automatically.`
            : 'No photos have been found.'}
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Masonry grid using CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <AnimatePresence>
          {visiblePhotos.map((photo, i) => (
            <GalleryItem
              key={photo.id}
              photo={photo}
              index={i}
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Lazy-load sentinel */}
      <div ref={loaderRef} className="h-8" />

      {/* Loading spinner for more items */}
      {visibleCount < photos.length && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <PhotoLightbox
            photo={photos[selectedIndex]}
            index={selectedIndex}
            total={photos.length}
            onClose={() => setSelectedIndex(null)}
            onNext={selectedIndex < photos.length - 1 ? goNext : undefined}
            onPrev={selectedIndex > 0 ? goPrev : undefined}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function GalleryItem({
  photo,
  index,
  onClick,
}: {
  photo: Project;
  index: number;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="break-inside-avoid mb-4 rounded-[20px] overflow-hidden cursor-pointer group relative bg-card border border-border transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
      onClick={onClick}
    >
      {!failed ? (
        <div className="relative w-full rounded-[20px] overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 bg-card animate-pulse" />
          )}
          <img
            src={photo.thumbnailUrl || photo.mediaUrl}
            alt={photo.title}
            className={`w-full block h-auto object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <div className="w-full aspect-square bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center">
          <span className="text-4xl opacity-40">📷</span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col justify-end p-4">
        <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
          <p className="text-white font-semibold text-sm truncate">{photo.title}</p>
          {photo.autoTags && photo.autoTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {photo.autoTags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] text-white/80 bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
