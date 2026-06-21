'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Wand2, Check, Plus, Minus, Loader2, ImageIcon } from 'lucide-react';
import { PHOTO_CATEGORIES } from '@/data/photoCategories';
import { generateTagsFromText } from '@/lib/imageClassifier';
import { addLocalProject } from '@/data/localDatabase';
import { hasSupabaseConfig } from '@/lib/supabaseClient';
import { uploadPhotoFile, addPhotoRecord } from '@/data/supabaseDatabase';

interface PhotoUploadProps {
  defaultCategory?: string;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface PhotoFile {
  file: File;
  preview: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
}

export default function PhotoUpload({ defaultCategory, onClose, onUploadComplete }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newPhotos: PhotoFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      description: '',
      categories: defaultCategory ? [defaultCategory] : [],
      tags: [],
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  }, [defaultCategory]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const updatePhoto = (index: number, updates: Partial<PhotoFile>) => {
    setPhotos(prev => prev.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };



  const toggleCategory = (photoIndex: number, categoryId: string) => {
    const photo = photos[photoIndex];
    const newCats = photo.categories.includes(categoryId)
      ? photo.categories.filter(c => c !== categoryId)
      : [...photo.categories, categoryId];
    updatePhoto(photoIndex, { categories: newCats });
  };

  const handleSubmit = async () => {
    if (photos.length === 0) { setError('Please add at least one photo'); return; }
    const uncategorized = photos.filter(p => p.categories.length === 0);
    if (uncategorized.length > 0) { setError('Please assign at least one category to each photo'); return; }
    if (photos.some(p => !p.title.trim())) { setError('Please give each photo a title'); return; }

    setUploading(true);
    setError('');

    try {
      for (const photo of photos) {
        const autoTags = generateTagsFromText(photo.title, photo.description, photo.file.name);

        if (hasSupabaseConfig) {
          // Upload actual file to Supabase Storage
          const publicUrl = await uploadPhotoFile(photo.file);
          
          // Save record to Supabase Database
          await addPhotoRecord({
            title: photo.title.trim(),
            description: photo.description.trim(),
            category: 'photo',
            subcategory: PHOTO_CATEGORIES.find(c => c.id === photo.categories[0])?.label,
            mediaUrl: publicUrl,
            thumbnailUrl: publicUrl,
            uploadDate: new Date(),
            tags: photo.tags,
            featured: false,
            photoCategories: photo.categories,
            autoTags: autoTags,
          });
        } else {
          // Local fallback (in-memory)
          addLocalProject({
            title: photo.title.trim(),
            description: photo.description.trim(),
            category: 'photo',
            subcategory: PHOTO_CATEGORIES.find(c => c.id === photo.categories[0])?.label,
            mediaUrl: photo.preview,
            thumbnailUrl: photo.preview,
            uploadDate: new Date(),
            tags: photo.tags,
            featured: false,
            photoCategories: photo.categories,
            autoTags: autoTags,
          });
        }
      }
      await new Promise(r => setTimeout(r, 500));
      onUploadComplete();
    } catch (err: any) {
      console.error('Upload error details:', err);
      setError(err?.message || 'Upload failed. Please check your Supabase connection and bucket policies.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0d0d0d] border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0d0d0d] z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Upload Photos</h2>
            <p className="text-sm text-white/40 mt-0.5">Please manually select a category for your images</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${dragging ? 'border-accent/70 bg-accent/5 scale-[1.01]' : 'border-white/10 hover:border-white/25 hover:bg-white/3'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => processFiles(e.target.files)}
            />
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-accent/20' : 'bg-white/5'}`}>
                <ImageIcon size={24} className={dragging ? 'text-accent' : 'text-white/30'} />
              </div>
              <div>
                <p className="text-white/70 font-medium">Drop photos here or click to browse</p>
                <p className="text-white/30 text-sm mt-1">Supports JPEG, PNG, WebP, HEIC</p>
              </div>
            </div>
          </div>

          {/* Photo list */}
          <AnimatePresence>
            {photos.map((photo, i) => (
              <motion.div
                key={photo.preview}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                {/* Photo header */}
                <div className="flex gap-4 p-4 border-b border-white/5">
                  <img src={photo.preview} alt={photo.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={photo.title}
                      onChange={e => updatePhoto(i, { title: e.target.value })}
                      placeholder="Photo title"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50"
                    />
                    <textarea
                      value={photo.description}
                      onChange={e => updatePhoto(i, { description: e.target.value })}
                      placeholder="Description (optional)"
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => removePhoto(i)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                </div>



                {/* Category selector */}
                <div className="p-4">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Assign Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {PHOTO_CATEGORIES.map(cat => {
                      const selected = photo.categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(i, cat.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all border ${selected ? 'bg-accent/15 border-accent/40 text-white' : 'bg-white/3 border-white/8 text-white/40 hover:border-white/20 hover:text-white/70'}`}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label.replace(' Photography', '').replace(' & Experimental', '')}</span>
                          {selected && <Check size={10} className="text-accent" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          {photos.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading...</>
              ) : (
                <><Upload size={16} /> Upload {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}</>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
