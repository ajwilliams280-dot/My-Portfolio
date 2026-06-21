'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { PHOTO_CATEGORIES } from '@/data/photoCategories';
import { getCategoryStats, CategoryStat, getPhotos } from '@/data/supabaseDatabase';
import CategoryCard from '@/components/photography/CategoryCard';
import PhotoGallery from '@/components/photography/PhotoGallery';
import { Project } from '@/types';

export default function PhotographyPage() {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [allPhotos, setAllPhotos] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, photosData] = await Promise.all([
          getCategoryStats(),
          getPhotos()
        ]);
        setStats(statsData);
        setAllPhotos(photosData);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    }
    loadData();
  }, []);

  // Merge stats into categories
  const categoriesWithStats = useMemo(() => {
    return PHOTO_CATEGORIES.map(cat => {
      const stat = stats.find(s => s.id === cat.id);
      return {
        ...cat,
        photoCount: stat?.photoCount ?? 0,
        coverImage: stat?.coverImage,
      };
    });
  }, [stats]);

  const totalPhotos = categoriesWithStats.reduce((sum, c) => sum + c.photoCount, 0);

  // Filter photos based on active category
  const galleryPhotos = useMemo(() => {
    if (!activeCategory) return allPhotos;
    return allPhotos.filter(p => p.photoCategories?.includes(activeCategory));
  }, [allPhotos, activeCategory]);

  const activeCategoryObj = useMemo(() => {
    return PHOTO_CATEGORIES.find(c => c.id === activeCategory);
  }, [activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    
    // Smooth scroll down to gallery
    setTimeout(() => {
      if (galleryRef.current) {
        const y = galleryRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6 lg:px-12">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-950/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium mb-6">
              <Camera size={14} />
              <span>Photography Portfolio</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none mb-6">
              Through the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-pink-400 to-purple-400">
                Lens
              </span>
            </h1>

            <p className="text-white/60 text-lg max-w-2xl leading-relaxed mb-8">
              Explore a curated collection of photography across {PHOTO_CATEGORIES.length} stories. 
              Click a collection below to immerse yourself in its dedicated exhibition.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              <div>
                <div className="text-3xl font-bold text-white">{totalPhotos}</div>
                <div className="text-sm text-white/40 uppercase tracking-widest">Photos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{PHOTO_CATEGORIES.length}</div>
                <div className="text-sm text-white/40 uppercase tracking-widest">Stories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">Curated</div>
                <div className="text-sm text-white/40 uppercase tracking-widest">Collections</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visual Story Categories */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <div className="w-12 h-1 bg-accent mb-6 rounded-full" />
          <h2 className="text-4xl md:text-6xl font-bold tracking-widest uppercase mb-4">
            Visual <span className="text-white/50">Stories</span>
          </h2>
          <p className="text-lg text-white/40 tracking-wide max-w-2xl">
            Select a collection below to filter the gallery and enter a focused visual experience.
          </p>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {categoriesWithStats.map((cat, i) => (
            <div key={cat.id}>
              <CategoryCard
                category={cat}
                photoCount={cat.photoCount}
                coverImage={cat.coverImage}
                index={i}
                isActive={activeCategory === cat.id}
                onClick={() => handleCategoryClick(cat.id)}
              />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Dynamic Gallery Section */}
      <section ref={galleryRef} className="max-w-7xl mx-auto px-6 lg:px-12 pb-32 pt-8 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12">
          <div>
            <AnimatePresence mode="popLayout">
              {activeCategoryObj ? (
                <motion.div
                  key={activeCategoryObj.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color: activeCategoryObj.accentColor }}>
                    Viewing Collection
                  </span>
                  <h2 className="text-4xl font-bold">{activeCategoryObj.label}</h2>
                </motion.div>
              ) : (
                <motion.div
                  key="all-stories"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-sm font-bold tracking-widest uppercase text-accent mb-2 block">
                    Complete Archive
                  </span>
                  <h2 className="text-4xl font-bold text-white">All Stories</h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {activeCategory && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setActiveCategory(null)}
                className="mt-6 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold tracking-wider uppercase text-white/70 hover:text-white"
              >
                <X size={16} />
                Clear Filter
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <PhotoGallery 
          photos={galleryPhotos} 
          category={activeCategoryObj} 
        />
      </section>
    </div>
  );
}
