"use client";

import { useEffect, useState } from "react";
import { getLocalProjects } from "@/data/localDatabase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Image as ImageIcon, Music } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MediaModal from "./MediaModal";

interface Post {
  id: string;
  title: string;
  category: string;
  mediaUrl: string;
  description?: string;
  thumbnailUrl?: string; // Optional thumbnail
  subcategory?: string;
  createdAt?: any;
}

export default function FeaturedWork() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<Post | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const allProjects = getLocalProjects();
        // Get up to 3 featured projects, sorting by newest uploadDate
        const featuredProjects = allProjects
          .filter(p => p.featured)
          .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
          .slice(0, 3);
        
        // Map Project to Post interface
        const fetchedPosts = featuredProjects.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          mediaUrl: p.mediaUrl,
          description: p.description,
          thumbnailUrl: p.thumbnailUrl,
          subcategory: p.subcategory,
          createdAt: p.uploadDate,
        }));
        
        setPosts(fetchedPosts.length ? fetchedPosts : getDummyPosts());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const openModal = (post: Post) => {
    setActiveMedia(post);
    setModalOpen(true);
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case "videography": return <Play size={16} />;
      case "photography": return <ImageIcon size={16} />;
      case "music": return <Music size={16} />;
      default: return null;
    }
  };

  const getBgStyle = (cat: string) => {
    if (cat === 'music') return 'bg-gradient-to-br from-black to-accent/40';
    return 'bg-black/50';
  };

  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-widest uppercase">
              Featured <span className="text-accent">Work</span>
            </h2>
            <p className="mt-4 text-foreground/60 tracking-wider">A glimpse into the latest creations.</p>
          </motion.div>

          <Link href="/work" className="group flex items-center gap-2 text-sm uppercase tracking-widest font-semibold hover:text-accent transition-colors">
            View All Work <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div key={`feat-skel-${i}`} className="aspect-[4/3] rounded-xl bg-white/5 animate-pulse border border-white/10" />
              ))
            ) : posts.map((post, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={post.id}
                className="group relative rounded-[24px] overflow-hidden bg-card border border-border hover:border-accent/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] flex flex-col cursor-pointer w-full"
                onClick={() => openModal(post)}
              >
                {post.category === "photography" && (
                  <img
                    src={post.thumbnailUrl || post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700 blur-0 group-hover:blur-sm"
                    loading="lazy"
                  />
                )}
                {post.category === "videography" && (
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
          </AnimatePresence>
        </div>

      </div>

      {activeMedia && (
        <MediaModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={activeMedia.title}
          type={activeMedia.category as any}
          mediaUrl={activeMedia.mediaUrl}
          date={activeMedia.createdAt}
          description={activeMedia.description}
          thumbnailUrl={activeMedia.thumbnailUrl}
        />
      )}
    </section>
  );
}

function getDummyPosts(): Post[] {
  return [
    { id: "1", title: "Cinematic Film 1", category: "videography", mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: "2", title: "Neon City", category: "photography", mediaUrl: "/images/main_bg.jpg" },
    { id: "3", title: "Night Drive Beat", category: "music", mediaUrl: "no-url" },
  ];
}
