"use client";

import { motion } from "framer-motion";
import { Project } from "@/types";
import Image from "next/image";
import { Play, Image as ImageIcon, Music } from "lucide-react";
import { useState } from "react";
import MediaModal from "./MediaModal";

interface MediaRowProps {
  projects: Project[];
}

export default function MediaRow({ projects }: MediaRowProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<Project | null>(null);

  if (!projects || projects.length === 0) {
    return (
      <div className="w-full h-72 border border-dashed border-border rounded-[24px] flex flex-col items-center justify-center text-foreground/40 bg-foreground/5">
        <p className="text-lg tracking-widest uppercase">Coming Soon</p>
        <p className="text-sm mt-2">Projects will be showcased here.</p>
      </div>
    );
  }

  const openModal = (post: Project) => {
    setActiveMedia(post);
    setModalOpen(true);
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case "video": return <Play size={16} />;
      case "photo": return <ImageIcon size={16} />;
      case "music": return <Music size={16} />;
      default: return null;
    }
  };

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
        {projects.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative cursor-pointer rounded-[24px] overflow-hidden bg-card border border-border hover:border-accent/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-500 hover:-translate-y-2 break-inside-avoid w-full mb-6"
            onClick={() => openModal(post)}
          >
            {post.category === "photo" && (
              <img
                src={post.thumbnailUrl || post.mediaUrl}
                alt={post.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 blur-0 group-hover:blur-sm"
                loading="lazy"
              />
            )}

            {post.category === "video" && (
              <div className="relative w-full h-full aspect-[4/3] bg-black rounded-xl overflow-hidden border-2 border-[#111] shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-accent/50 transition-colors duration-500">
                {/* Film strip borders */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-black flex flex-col justify-evenly py-2 z-20">
                  {Array.from({length: 8}).map((_, j) => <div key={j} className="w-2 h-3 bg-white/20 rounded-sm mx-auto"></div>)}
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-black flex flex-col justify-evenly py-2 z-20">
                  {Array.from({length: 8}).map((_, j) => <div key={j} className="w-2 h-3 bg-white/20 rounded-sm mx-auto"></div>)}
                </div>
                
                <div className="absolute inset-0 px-4 z-10">
                  <video
                    src={post.mediaUrl}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    muted loop playsInline
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => {
                      const v = e.target as HTMLVideoElement;
                      v.pause(); v.currentTime = 0;
                    }}
                  />
                </div>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <Play size={24} className="fill-accent text-accent ml-1" />
                  </div>
                </div>
              </div>
            )}

            {post.category === "music" && (
              <div className="relative w-full aspect-square bg-transparent flex items-center justify-center perspective-[1000px] overflow-visible">
                {/* The Vinyl Record (slides out to the right and spins on hover) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full bg-gradient-to-br from-[#050505] to-[#111] border-[2px] border-[#222] shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-700 group-hover:translate-x-[25%] group-hover:rotate-180 z-0">
                  {/* Vinyl Grooves */}
                  <div className="absolute inset-0 rounded-full border border-white/5 m-2 pointer-events-none"></div>
                  <div className="absolute inset-0 rounded-full border border-white/10 m-5 pointer-events-none mix-blend-overlay"></div>
                  <div className="absolute inset-0 rounded-full border border-white/5 m-8 pointer-events-none"></div>
                  <div className="absolute inset-0 rounded-full border border-white/10 m-12 pointer-events-none mix-blend-overlay"></div>
                  {/* Center Label */}
                  <div className="w-1/3 h-1/3 rounded-full overflow-hidden border-2 border-accent relative shadow-[0_0_10px_rgba(229,9,20,0.5)]">
                     <img src={post.thumbnailUrl || "/images/default_audio_cover.jpg"} alt="label" className="w-full h-full object-cover opacity-90" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border border-white/20 shadow-inner"></div>
                  </div>
                </div>
                
                {/* The Sleeve (Cover Art) */}
                <div className="relative w-full h-full z-10 rounded-lg overflow-hidden shadow-[-15px_0_30px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:-translate-x-[15%] group-hover:scale-[0.98] border border-white/10 group-hover:border-accent/40 bg-card">
                  <img
                    src={post.thumbnailUrl || "/images/default_audio_cover.jpg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h4 className="text-white font-bold tracking-widest uppercase mb-1">{post.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-accent text-xs uppercase tracking-widest">{post.subcategory || "Beat"}</p>
                      <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center pl-1 shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                        <Play size={16} className="fill-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        ))}
      </div>

      {activeMedia && (
        <MediaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={activeMedia.title}
          type={activeMedia.category as any}
          mediaUrl={activeMedia.mediaUrl}
          date={{ seconds: activeMedia.uploadDate.getTime() / 1000 } as any}
          description={activeMedia.description}
          thumbnailUrl={activeMedia.thumbnailUrl}
        />
      )}
    </>
  );
}
