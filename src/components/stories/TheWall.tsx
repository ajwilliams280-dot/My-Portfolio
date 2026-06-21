"use client";

import { motion } from "framer-motion";
import { ClientStory } from "@/types";
import StoryCard from "./StoryCard";

interface TheWallProps {
  stories: ClientStory[];
}

export default function TheWall({ stories }: TheWallProps) {
  // Duplicate stories to create a seamless infinite scroll effect
  const duplicatedStories = [...stories, ...stories, ...stories];

  return (
    <div className="w-full overflow-hidden py-12 relative flex items-center">
      
      {/* Left/Right Fade Overlays for seamless loop */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee Animation Container */}
      <motion.div
        className="flex gap-8 px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30, // Adjust speed here
        }}
      >
        {duplicatedStories.map((story, i) => (
          <div key={`${story.id}-${i}`} className="w-[300px] md:w-[450px] shrink-0">
            <StoryCard story={story} featured={true} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
