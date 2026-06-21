'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight, Waves, Mountain, User, Building2, PawPrint, Leaf, Building, Compass, Camera } from 'lucide-react';
import { PhotoCategory } from '@/types';

// Map icon strings to Lucide components to keep bundle size small
const iconMap: Record<string, React.ElementType> = {
  Waves,
  Mountain,
  User,
  Building2,
  PawPrint,
  Leaf,
  Building,
  Compass,
};

interface CategoryCardProps {
  category: PhotoCategory;
  photoCount?: number;
  coverImage?: string;
  index?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({ category, photoCount = 0, coverImage, index = 0, isActive = false, onClick }: CategoryCardProps) {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Prioritize the user uploaded coverImage (which is now dynamically the strongest image) if available
  const displayImage = coverImage || category.image;
  
  // Resolve the Lucide icon
  const IconComponent = iconMap[category.icon] || Camera;

  return (
    <motion.div variants={cardVariants} className="h-full">
      <button 
        onClick={onClick} 
        className="block h-full w-full text-left group transition-transform duration-500 hover:-translate-y-2"
      >
        <div
          className={`relative h-[24rem] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 border-2 ${
            isActive ? 'border-white/50' : 'border-transparent'
          }`}
          style={{ cursor: 'pointer' }}
        >
          {displayImage && (
            <img
              src={displayImage}
              alt={category.label}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
                isActive ? 'scale-105 brightness-110' : 'scale-100 group-hover:scale-105 group-hover:brightness-90'
              }`}
              loading="lazy"
            />
          )}

          {/* Dark cinematic gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-700 ${
            isActive 
              ? 'from-black/90 via-black/40 to-transparent'
              : 'from-black/80 via-black/30 to-black/10 group-hover:from-black/95 group-hover:via-black/50 group-hover:to-black/20'
          }`} />
          
          {/* Subtle accent color glow overlay */}
          <div 
            className={`absolute inset-0 transition-opacity duration-700 mix-blend-overlay ${
              isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-30'
            }`}
            style={{ backgroundColor: category.accentColor }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
            {/* Top Section: Icon */}
            <div className={`transform transition-all duration-500 ${
              isActive ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100'
            }`}>
              <div 
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
                style={{ color: isActive ? category.accentColor : 'white' }}
              >
                <IconComponent size={24} strokeWidth={1.5} className="group-hover:text-white transition-colors duration-300" />
              </div>
            </div>

            {/* Bottom Section: Text */}
            <div className={`transform transition-all duration-500 ${
              isActive ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'
            }`}>
              <h3 className={`text-2xl md:text-3xl font-bold text-white tracking-wide leading-tight mb-2 transition-opacity duration-300 drop-shadow-lg ${
                isActive ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
              }`}>
                {category.label}
              </h3>
              
              <p className={`text-sm text-white/70 mb-4 line-clamp-2 transition-opacity duration-500 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                {category.description}
              </p>
              
              <div className="flex items-center justify-between mt-2 overflow-hidden">
                <p className={`text-xs font-semibold tracking-widest uppercase transition-all duration-500 ${
                  isActive ? 'text-white/90 translate-y-0 opacity-100' : 'text-white/60 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                }`}>
                  {photoCount > 0 ? `${photoCount} Photos` : 'Explore Story'}
                </p>

                {/* View gallery CTA arrow */}
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md transition-all duration-500 ${
                    isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                  style={{ color: category.accentColor, boxShadow: isActive ? `0 0 20px ${category.accentColor}60` : 'none' }}
                >
                  <ArrowRight size={14} strokeWidth={3} className="text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Accent border bottom on hover/active */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1.5 origin-left transition-transform duration-700 ease-out ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}
            style={{ backgroundColor: category.accentColor }}
          />
        </div>
      </button>
    </motion.div>
  );
}
