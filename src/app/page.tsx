"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getPhotos } from "@/data/supabaseDatabase";
import FeaturedWork from "@/components/FeaturedWork";
import { Project } from "@/types";
import PortalTransition from "@/components/PortalTransition";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showPortal, setShowPortal] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getPhotos();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load featured work:", err);
      }
    }
    loadProjects();
  }, []);

  return (
    <>
      <div className="relative w-full h-[calc(100vh-80px)] flex flex-col justify-center items-center overflow-hidden">
        {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-background transition-colors duration-700">
        <Image
          src="/images/main_bg.jpg"
          alt="Cinematic background"
          fill
          className="object-cover opacity-50"
          priority
        />
        {/* Dark gradient overlay for depth and text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 lg:px-12 mt-[-5vh] max-w-4xl mx-auto w-full gap-8">
        
        {/* Text Section */}
        <div className="flex flex-col flex-1 items-center text-center p-8 md:p-12 rounded-[24px]">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter uppercase text-foreground drop-shadow-2xl leading-none"
          >
            Welcome to
            <br />
            <span className="text-accent inline-block mt-2">Altonsworld</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            className="mt-6 text-lg md:text-xl text-foreground/70 max-w-lg font-light tracking-wide"
          >
            Stories through visuals and sound. Experience the creative universe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10"
          >
            <button
              onClick={() => setShowPortal(true)}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-background border border-border rounded-full hover:bg-card hover:border-accent/50 hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] transition-all duration-300 pointer-events-auto"
            >
              <span className="uppercase tracking-widest text-sm font-semibold text-foreground">
                Enter the World
              </span>
              <MoveRight className="w-5 h-5 text-foreground group-hover:translate-x-1 group-hover:text-accent transition-all duration-300" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Cinematic Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
      >
        <span className="text-[10px] tracking-widest uppercase mb-2 text-foreground/40">Discover</span>
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-accent to-transparent" />
        </motion.div>
      </motion.div>

    </div>
    
    <FeaturedWork projects={projects} />
    
    {/* Cinematic Portal Overlay */}
    <AnimatePresence>
      {showPortal && <PortalTransition onComplete={() => setShowPortal(false)} targetUrl="/work" />}
    </AnimatePresence>
    </>
  );
}
