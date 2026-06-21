"use client";

import { ClientStory } from "@/types";
import { motion } from "framer-motion";
import { Star, CheckCircle, PlayCircle, Quote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import MediaModal from "../portfolio/MediaModal";

interface StoryCardProps {
  story: ClientStory;
  featured?: boolean;
}

export default function StoryCard({ story, featured = false }: StoryCardProps) {
  const [isMediaOpen, setIsMediaOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        className={`relative flex flex-col bg-card border border-border rounded-[24px] overflow-hidden shadow-xl transition-all duration-500 hover:border-accent/50 hover:shadow-[0_16px_48px_rgba(229,9,20,0.15)] ${
          featured ? "p-8 md:p-10" : "p-6 md:p-8"
        }`}
      >
        <Quote className="absolute top-6 right-6 w-12 h-12 text-border/30 rotate-180" />
        
        {/* Header: User Info */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          {story.clientImage ? (
            <div className={`relative rounded-full overflow-hidden border border-border bg-background ${featured ? "w-16 h-16" : "w-12 h-12"}`}>
              <Image src={story.clientImage} alt={story.clientName} fill className="object-cover" />
            </div>
          ) : (
            <div className={`flex items-center justify-center rounded-full bg-background border border-border text-foreground/50 font-bold ${featured ? "w-16 h-16 text-xl" : "w-12 h-12 text-lg"}`}>
              {story.clientName.charAt(0)}
            </div>
          )}
          
          <div className="flex flex-col">
            <h3 className={`font-bold text-foreground flex items-center gap-2 ${featured ? "text-xl" : "text-lg"}`}>
              {story.clientName}
              {story.verified && (
                <span title="Verified Client" className="text-accent">
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </h3>
            <span className="text-xs tracking-widest uppercase text-foreground/50">
              {story.serviceType} {story.projectName && `• ${story.projectName}`}
            </span>
          </div>
        </div>

        {/* Rating & Reactions */}
        <div className="mb-6 space-y-3 relative z-10">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < story.rating ? "text-accent fill-accent" : "text-border"}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {story.reactions.map((reaction, i) => (
              <span key={i} className="px-3 py-1 bg-background border border-border rounded-full text-xs text-foreground/80">
                {reaction}
              </span>
            ))}
          </div>
        </div>

        {/* Story Content */}
        <div className="flex-1 relative z-10">
          <p className={`text-foreground/80 leading-relaxed font-light ${featured ? "text-lg" : "text-base"}`}>
            "{story.story}"
          </p>
        </div>

        {/* Footer / Media Button */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/50 relative z-10">
          <span className="text-xs text-foreground/40 font-mono">
            {story.date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          
          {story.isVideo && story.mediaUrl && (
            <button
              onClick={() => setIsMediaOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
            >
              <PlayCircle className="w-5 h-5 text-accent" />
              Watch Video
            </button>
          )}
        </div>
      </motion.div>

      {/* Media Modal for Video Testimonials */}
      {story.isVideo && story.mediaUrl && (
        <MediaModal
          isOpen={isMediaOpen}
          onClose={() => setIsMediaOpen(false)}
          mediaUrl={story.mediaUrl}
          type="video"
          title={`${story.clientName}'s Story`}
          description={story.story}
          date={{ seconds: story.date.getTime() / 1000 }} // Adapt to MediaModal props
        />
      )}
    </>
  );
}
