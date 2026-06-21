"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { ClientStory } from "@/types";
import StoryCard from "./StoryCard";

interface FeaturedStoriesProps {
  stories: ClientStory[];
}

export default function FeaturedStories({ stories }: FeaturedStoriesProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-background relative z-10 border-t border-border/50">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-6 uppercase"
          >
            What People Say About <span className="text-accent">AltonsWorld</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
          >
            Real stories from real clients. The impact behind the visuals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <StoryCard story={story} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <Link
            href="/stories"
            className="group flex items-center gap-3 px-8 py-4 bg-card border border-border rounded-full hover:border-accent/50 hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] transition-all duration-300"
          >
            <span className="uppercase tracking-widest text-sm font-semibold text-foreground">
              Explore More Stories
            </span>
            <MoveRight className="w-5 h-5 text-foreground group-hover:translate-x-1 group-hover:text-accent transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
