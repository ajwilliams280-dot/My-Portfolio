'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Layers, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Project, PhotoCategory } from '@/types';
import { updatePhotoCategories } from '@/data/supabaseDatabase';

interface PhotoLightboxProps {
  photo: Project;
  index: number;
  total: number;
  otherCategories?: PhotoCategory[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onCategoryChange?: () => void;
}

export default function PhotoLightbox({
  photo,
  index,
  total,
  otherCategories,
  onClose,
  onNext,
  onPrev,
  onCategoryChange,
}: PhotoLightboxProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(photo.photoCategories || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const handleSaveCategories = async () => {
    setSaving(true);
    await updatePhotoCategories(photo.id, selectedCategories);
    await new Promise(r => setTimeout(r, 400)); // animate
    setSaving(false);
    setSaved(true);
    onCategoryChange?.();
    setTimeout(() => setShowCategoryDropdown(false), 600);
  };

  const allTags = Array.from(new Set([...(photo.autoTags || []), ...(photo.tags || [])]));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Image area */}
        <div className="relative flex-1 min-h-[300px] lg:min-h-0 bg-black flex items-center justify-center overflow-hidden">
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerZoomedOut={true}
            centerOnInit={true}
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ step: 1, mode: "zoomIn" }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                  <button onClick={() => zoomIn()} className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                    <ZoomIn size={18} />
                  </button>
                  <button onClick={() => zoomOut()} className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                    <ZoomOut size={18} />
                  </button>
                  <button onClick={() => resetTransform()} className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                    <RotateCcw size={18} />
                  </button>
                </div>
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="w-max h-max">
                  <img
                    src={photo.mediaUrl || photo.thumbnailUrl}
                    alt={photo.title}
                    className="max-w-full max-h-[90vh] object-contain cursor-grab active:cursor-grabbing select-none"
                    draggable={false}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>

          {/* Navigation arrows */}
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs text-white/50">
            {index + 1} / {total}
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-white/10">
            <div className="flex-1 pr-4">
              <h2 className="text-lg font-bold text-white leading-tight">{photo.title}</h2>
              {photo.subcategory && (
                <span className="text-xs text-accent/80 mt-1 block">{photo.subcategory}</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-5 space-y-5">
            {/* Description */}
            {photo.description && (
              <p className="text-white/60 text-sm leading-relaxed">{photo.description}</p>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Calendar size={12} />
              <span>{new Date(photo.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-widest mb-2">
                  <Tag size={11} />
                  Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-widest">
                  <Layers size={11} />
                  Categories
                </div>
                <button
                  onClick={() => { setShowCategoryDropdown(s => !s); setSaved(false); }}
                  className="text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  {showCategoryDropdown ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {/* Current categories */}
              {!showCategoryDropdown && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategories.length > 0 ? selectedCategories.map(id => {
                    const found = [...otherCategories].find(c => c.id === id);
                    return found ? (
                      <span key={id} className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/60">
                        {found.icon} {found.label}
                      </span>
                    ) : null;
                  }) : (
                    <span className="text-xs text-white/30">No categories assigned</span>
                  )}
                </div>
              )}

              {/* Category editor */}
              {showCategoryDropdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {otherCategories.map(cat => {
                      const isSelected = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left transition-all ${isSelected ? 'bg-accent/15 border border-accent/30 text-white' : 'bg-white/3 border border-white/8 text-white/50 hover:bg-white/8'}`}
                        >
                          <span>{cat.icon}</span>
                          <span className="flex-1">{cat.label}</span>
                          {isSelected && <Check size={11} className="text-accent flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleSaveCategories}
                    disabled={saving}
                    className="w-full mt-3 py-2 rounded-lg text-xs font-semibold bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : saved ? (
                      <><Check size={12} /> Saved!</>
                    ) : 'Save Categories'}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
