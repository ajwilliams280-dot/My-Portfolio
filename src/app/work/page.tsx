"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getLocalProjects } from "@/data/localDatabase";
import { Project } from "@/types";
import { Camera, Play, Music, Code } from "lucide-react";

import CategoryGrid from "@/components/portfolio/CategoryGrid";
import MediaRow from "@/components/portfolio/MediaRow";
import PhotographyShowcase from "@/components/portfolio/PhotographyShowcase";

// Data
import { PHOTO_CATEGORIES } from "@/data/photoCategories";
import { VIDEO_CATEGORIES } from "@/data/videoCategories";
import { MUSIC_CATEGORIES } from "@/data/musicCategories";
import { SOFTWARE_CATEGORIES } from "@/data/softwareCategories";

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local database content
    const localProjects = getLocalProjects();
    setProjects(localProjects.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Partition data
  const photos = projects.filter(p => p.category === "photo");
  const videos = projects.filter(p => p.category === "video");
  const music = projects.filter(p => p.category === "music");
  const software = projects.filter(p => p.category === "software");

  const photoCategoriesWithCount = PHOTO_CATEGORIES.map(cat => ({
    ...cat,
    count: photos.filter(p => p.photoCategories?.includes(cat.id)).length
  }));

  const SectionHeader = ({ title, icon, subtitle }: { title: string; icon?: React.ReactNode; subtitle: string }) => (
    <div className="mb-12 border-b border-border/50 pb-8">
      <div className="flex items-center gap-4 mb-4">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            {icon}
          </div>
        )}
        <h2 className="text-4xl font-bold tracking-widest uppercase">{title}</h2>
      </div>
      <p className="text-foreground/60 text-lg">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      
      {/* Page Title */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6"
        >
          Creative <span className="text-accent">Portfolio</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-foreground/70 max-w-2xl mx-auto font-light tracking-wide"
        >
          Explore visual stories, cinematic motion, and auditory experiences.
        </motion.p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 space-y-32">
        
        {/* PHOTOGRAPHY SECTION */}
        <section>
          <SectionHeader 
            title="Photography" 
            subtitle="Moments captured in time. Browse by collection or view recent highlights." 
          />
          
          <div className="mb-16">
            <h3 className="text-xl font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" /> Featured Collections
            </h3>
            <PhotographyShowcase categories={photoCategoriesWithCount} mediaType="photo" />
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" /> Recent Uploads
            </h3>
            <MediaRow projects={photos.slice(0, 8)} />
          </div>
        </section>


        {/* VIDEOGRAPHY SECTION */}
        <section>
          <SectionHeader 
            title="Videography" 
            subtitle="Cinematic storytelling, event coverage, and visual motion." 
            icon={<Play size={24} />} 
          />
          
          <div className="mb-16">
            <h3 className="text-xl font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" /> Uploaded Videos
            </h3>
            <MediaRow projects={videos} />
          </div>
        </section>


        {/* MUSIC SECTION */}
        <section>
          <SectionHeader 
            title="Music" 
            subtitle="Original beats, sound design, and audio production." 
            icon={<Music size={24} />} 
          />
          
          <div className="mb-16">
            <h3 className="text-xl font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" /> Browse Audio by Category
            </h3>
            <CategoryGrid categories={MUSIC_CATEGORIES} mediaType="music" />
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" /> Recent Uploads
            </h3>
            <MediaRow projects={music.slice(0, 8)} />
          </div>
        </section>

        {/* SOFTWARE DEVELOPMENT SECTION */}
        <section>
          <SectionHeader 
            title="Software Development" 
            subtitle="Web applications, UI/UX, and coding projects." 
            icon={<Code size={24} />} 
          />
          
          <div className="mb-16">
            <h3 className="text-xl font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" /> Browse Software by Category
            </h3>
            <CategoryGrid categories={SOFTWARE_CATEGORIES} mediaType="software" />
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" /> Recent Projects
            </h3>
            <MediaRow projects={software.slice(0, 8)} />
          </div>
        </section>

      </div>
    </div>
  );
}
