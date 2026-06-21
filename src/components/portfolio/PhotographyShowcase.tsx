"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  label: string;
  description: string;
  icon: string;
  image?: string;
  count?: number;
}

interface PhotographyShowcaseProps {
  categories: Category[];
  mediaType: "photo" | "video" | "music";
}

export default function PhotographyShowcase({ categories, mediaType }: PhotographyShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!categories || categories.length === 0) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // scroll-fast multiplier
    if (Math.abs(walk) > 10) setHasDragged(true); // User actually dragged
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handlePointerUpOrLeave = () => {
    setIsDragging(false);
    // Don't reset hasDragged immediately here, let onClick read it
    setTimeout(() => setHasDragged(false), 50);
  };

  return (
    <div className="relative w-full">
      {/* Swipe Indicator (Visible on all devices) */}
      <div className="flex items-center justify-end gap-2 text-foreground/50 hover:text-accent transition-colors text-[10px] sm:text-sm tracking-widest uppercase mb-4 px-4 font-bold">
        <span className="animate-pulse">Swipe to the right</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce-x">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Right Edge Fade to indicate more content */}
        <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
        
        <div 
          ref={scrollRef}
          className={`flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory cursor-grab px-4 md:px-0 ${isDragging ? 'cursor-grabbing select-none' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrLeave}
        onPointerLeave={handlePointerUpOrLeave}
        onPointerCancel={handlePointerUpOrLeave}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {categories.map((category, index) => {
          const isFeatured = index === 0;
          return (
            <Link 
              key={category.id} 
              href={`/work/${mediaType}/${category.id}`}
              className="shrink-0 snap-start outline-none"
              onClick={(e) => {
                if (hasDragged) e.preventDefault(); // Prevent click if dragging
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className={`group relative flex flex-col justify-end bg-black overflow-hidden rounded-2xl md:rounded-3xl transition-transform duration-500 hover:-translate-y-2
                  ${isFeatured ? 'w-[85vw] md:w-[60vw] lg:w-[50vw] h-[60vh] md:h-[500px]' : 'w-[75vw] md:w-[45vw] lg:w-[35vw] h-[60vh] md:h-[500px]'}
                `}
              >
                {/* Background Image */}
                {category.image && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={category.image}
                      alt={category.label}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    {/* Cinematic dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-700" />
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end transform transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  {isFeatured && (
                    <span className="text-accent text-xs md:text-sm font-bold tracking-widest uppercase mb-3 drop-shadow-md">
                      Featured Collection
                    </span>
                  )}
                  <h3 className="text-2xl md:text-4xl font-bold tracking-wider text-white mb-2 drop-shadow-lg">
                    {category.label}
                  </h3>
                  {category.count !== undefined && (
                    <p className="text-sm md:text-base text-white/70 font-light tracking-wide">
                      {category.count} Photos
                    </p>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
        </div>
      </div>
    </div>
  );
}
