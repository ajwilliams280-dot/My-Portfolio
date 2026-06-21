"use client";

import { motion } from "framer-motion";
import { FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa6";
import { useState } from "react";

import { TECH_TIPS } from "@/data/techTips";

export default function TechTipsPage() {
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredTips = filter === "all" 
    ? TECH_TIPS 
    : TECH_TIPS.filter(tip => tip.platform === filter);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setVisibleCount(9);
  };

  const displayedTips = filteredTips.slice(0, visibleCount);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube": return <FaYoutube className="text-[#FF0000]" size={20} />;
      case "tiktok": return <FaTiktok className="text-white drop-shadow-md" size={18} />;
      case "instagram": return <FaInstagram className="text-[#E1306C]" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      {/* Page Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6"
        >
          Tips & <span className="text-accent">Tutorials</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-foreground/70 max-w-2xl mx-auto font-light tracking-wide mb-8"
        >
          Tech hacks, videography tips, and photography tutorials.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a 
            href="https://youtube.com/@altonsworld20?si=YNIUIG6OfC6aSCXn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-foreground/5 hover:bg-[#FF0000]/20 text-foreground hover:text-[#FF0000] border border-border px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105"
          >
            <FaYoutube size={18} /> YouTube
          </a>
          <a 
            href="https://www.tiktok.com/@altons_tech_tips?_r=1&_t=ZS-961gVV6iaqD" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-foreground/5 hover:bg-white/20 text-foreground hover:text-white border border-border px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105"
          >
            <FaTiktok size={16} /> TikTok
          </a>
          <a 
            href="https://www.instagram.com/altons_world?igsh=MTFmeG8zZDl5ZndvcQ==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-foreground/5 hover:bg-[#E1306C]/20 text-foreground hover:text-[#E1306C] border border-border px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105"
          >
            <FaInstagram size={18} /> Instagram
          </a>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["all", "youtube", "tiktok", "instagram"].map((plat) => (
            <button
              key={plat}
              onClick={() => handleFilterChange(plat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border capitalize flex items-center gap-2 ${
                filter === plat 
                  ? 'bg-accent/20 border-accent text-foreground shadow-md' 
                  : 'bg-transparent border-foreground/20 text-foreground/70 hover:border-accent/50 hover:text-foreground'
              }`}
            >
              {plat !== "all" && getPlatformIcon(plat)}
              {plat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className={`relative w-full ${tip.isVertical ? 'aspect-[9/16] max-h-[500px]' : 'aspect-video'} bg-black`}>
                <iframe
                  src={tip.embedUrl}
                  title={tip.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {tip.category}
                  </span>
                  {getPlatformIcon(tip.platform)}
                </div>
                <h3 className="text-lg font-bold mb-4 leading-snug">{tip.title}</h3>
                
                <div className="mt-auto flex flex-col gap-4">
                  <a 
                    href={tip.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full text-center py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Watch on {tip.platform}
                  </a>
                  <p className="text-xs text-foreground/50 border-t border-border/50 pt-3 text-center">
                    Posted on {tip.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTips.length > visibleCount && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setVisibleCount(prev => prev + 9)}
              className="bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-accent/20"
            >
              Load More Videos
            </button>
          </div>
        )}

        {filteredTips.length === 0 && (
          <div className="text-center py-20 text-foreground/50">
            <p className="text-xl">No videos found for this platform.</p>
          </div>
        )}
      </div>
    </div>
  );
}
