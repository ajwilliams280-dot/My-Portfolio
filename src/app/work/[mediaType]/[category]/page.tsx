"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getLocalProjects } from "@/data/localDatabase";
import { Project } from "@/types";
import MediaModal from "@/components/portfolio/MediaModal";

import { PHOTO_CATEGORIES } from "@/data/photoCategories";
import { VIDEO_CATEGORIES } from "@/data/videoCategories";
import { MUSIC_CATEGORIES } from "@/data/musicCategories";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  
  const mediaType = params.mediaType as string; // 'photo', 'video', 'music'
  const categoryId = params.category as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<Project | null>(null);

  const openModal = (post: Project) => {
    setActiveMedia(post);
    setModalOpen(true);
  };

  useEffect(() => {
    let categories;
    if (mediaType === "photo") categories = PHOTO_CATEGORIES;
    else if (mediaType === "video") categories = VIDEO_CATEGORIES;
    else if (mediaType === "music") categories = MUSIC_CATEGORIES;
    else {
      router.push("/work");
      return;
    }

    const currentCat = categories.find(c => c.id === categoryId);
    if (!currentCat) {
      router.push("/work");
      return;
    }

    setCategoryData(currentCat);

    // Get filtered projects
    const allProjects = getLocalProjects();
    const filtered = allProjects.filter(p => {
      if (p.category !== mediaType) return false;
      // Strictly enforce manual category assignment
      if (mediaType === "photo" && p.photoCategories && p.photoCategories.includes(categoryId)) return true;
      if (mediaType === "video" && p.videoCategories && p.videoCategories.includes(categoryId)) return true;
      if (mediaType === "music" && p.musicCategories && p.musicCategories.includes(categoryId)) return true;
      
      return false;
    });

    setProjects(filtered);
    setLoading(false);
  }, [mediaType, categoryId, router]);

  if (loading || !categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] flex flex-col justify-end overflow-hidden">
        {categoryData.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={categoryData.image}
              alt={categoryData.label}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-12 pb-16">
          <Link 
            href="/work"
            className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent transition-colors uppercase tracking-widest text-xs font-bold mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Work
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase text-white">
              {categoryData.label}
            </h1>
          </div>
          <div className="mt-6">
            <span className="px-4 py-2 bg-accent/20 border border-accent rounded-full text-sm font-bold text-accent">
              {projects.length} Uploads
            </span>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        {/* We reuse MediaGrid, but instead of letting it fetch firebase, we'll map the projects to it, 
            or better yet, since MediaGrid expects to fetch its own data, we can just map them here. 
            Wait, MediaGrid has local state for `posts`. It might be easier to just render the MediaRow or a new Masonry component here. 
            Let's just use MediaRow for now.
         */}
        {projects.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-border rounded-[24px]">
            <p className="text-foreground/50 uppercase tracking-widest">No content found in this category.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {projects.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-[24px] overflow-hidden bg-card border border-border hover:border-accent/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] flex flex-col cursor-pointer break-inside-avoid w-full mb-6"
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
                        <svg className="w-6 h-6 fill-accent text-accent ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
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
                            <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
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
    </div>
  );
}
