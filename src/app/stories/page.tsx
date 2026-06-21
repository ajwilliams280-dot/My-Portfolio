"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PenTool } from "lucide-react";
import { getStories, addStory } from "@/data/storiesDatabase";
import { ClientStory } from "@/types";
import TheWall from "@/components/stories/TheWall";
import CommunityStats from "@/components/stories/CommunityStats";
import ShareStoryModal from "@/components/stories/ShareStoryModal";
import StoryCard from "@/components/stories/StoryCard";

const FLOATING_TESTIMONIALS = [
  "Absolutely worth it.",
  "The photos captured everything perfectly.",
  "My music sounded professional.",
  "One of the best creative experiences I've had.",
  "The final video exceeded expectations.",
  "A transformative experience.",
  "Incredible energy on set!",
];

export default function StoriesPage() {
  const [stories, setStories] = useState<ClientStory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setStories(getStories());
  }, []);

  const handleStorySubmit = (data: any) => {
    // In a real app, upload media to Supabase here first
    const newStory = addStory(data);
    setStories((prev) => [newStory, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      {/* Hero Experience */}
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center items-center overflow-hidden px-6">
        
        {/* Animated Background Testimonials */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
          {FLOATING_TESTIMONIALS.map((text, i) => (
            <motion.div
              key={i}
              initial={{ x: "100vw" }}
              animate={{ x: "-100vw" }}
              transition={{
                repeat: Infinity,
                duration: 20 + Math.random() * 20,
                delay: i * 2,
                ease: "linear",
              }}
              className="absolute whitespace-nowrap text-3xl md:text-5xl font-bold tracking-tighter text-foreground/20"
              style={{ top: `${10 + i * 12}%` }}
            >
              {text}
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6"
          >
            Voices From <span className="text-accent">AltonsWorld</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-foreground/70 font-light tracking-wide mb-12"
          >
            "Every project leaves a story. Every client leaves a memory."
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full hover:bg-accent/90 hover:shadow-[0_0_30px_rgba(229,9,20,0.3)] transition-all duration-300"
          >
            <PenTool className="w-5 h-5" />
            <span className="uppercase tracking-widest text-sm font-bold">
              Share Your Experience
            </span>
          </motion.button>
        </div>
      </section>

      {/* The AltonsWorld Wall (Featured Auto-scrolling) */}
      <section className="border-t border-b border-border/50 bg-background relative z-10">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold tracking-widest uppercase text-foreground/50">
            The AltonsWorld Wall
          </h2>
        </div>
        <TheWall stories={stories.filter(s => s.rating >= 4)} />
      </section>

      {/* Community Statistics */}
      <div className="relative z-10 bg-background">
        <CommunityStats />
      </div>

      {/* All Stories Grid */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto w-full relative z-10">
        <h2 className="text-3xl font-bold tracking-widest uppercase mb-12">
          All Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* Modal */}
      <ShareStoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleStorySubmit}
      />
    </div>
  );
}
