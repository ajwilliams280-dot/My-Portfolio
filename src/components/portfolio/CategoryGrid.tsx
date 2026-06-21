"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  label: string;
  description: string;
  icon?: string;
  image?: string;
  count?: number;
}

interface CategoryGridProps {
  categories: Category[];
  mediaType: "photo" | "video" | "music" | "software";
}

export default function CategoryGrid({ categories, mediaType }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category, index) => (
        <Link key={category.id} href={`/work/${mediaType}/${category.id}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col h-64 bg-card border border-border rounded-[24px] overflow-hidden cursor-pointer"
          >
            {/* Background Image */}
            {category.image && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-6 transition-transform duration-500 group-hover:translate-y-[-8px]">
              <div className="flex items-center justify-between mb-2">
                {category.icon ? (
                  category.icon.startsWith('/') ? (
                    <div className="relative w-12 h-12">
                      <Image src={category.icon} alt={category.label} fill className="object-contain filter drop-shadow-lg" />
                    </div>
                  ) : (
                    <span className="text-3xl filter drop-shadow-md">{category.icon}</span>
                  )
                ) : null}
                {category.count !== undefined && (
                  <span className="px-3 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-full text-xs font-mono font-bold text-accent">
                    {category.count} Items
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold tracking-wider text-foreground mb-1">
                {category.label}
              </h3>
              <p className="text-sm text-foreground/70 font-light line-clamp-2">
                {category.description}
              </p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
