"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Image as ImageIcon, Music } from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import MediaModal from "./MediaModal";
import Image from "next/image";
import { getLocalProjects } from "@/data/localDatabase";

type Category = "all" | "videography" | "photography" | "music";

interface Post {
  id: string;
  title: string;
  description: string;
  category: Category;
  mediaUrl: string;
  thumbnailUrl?: string; // Optional thumbnail
  subcategory?: string;
  createdAt?: any;
}

export default function MediaGrid() {
  const [filter, setFilter] = useState<Category>("all");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<Post | null>(null);

  useEffect(() => {
    try {
      const allProjects = getLocalProjects();
      const fetchedPosts = allProjects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        category: p.category as Category,
        mediaUrl: p.mediaUrl,
        thumbnailUrl: p.thumbnailUrl,
        subcategory: p.subcategory,
        createdAt: p.uploadDate,
      }));
      setPosts(fetchedPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  let filteredPosts = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  if (subFilter !== "all") {
    filteredPosts = filteredPosts.filter((p) => p.subcategory === subFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      (p.subcategory && p.subcategory.toLowerCase().includes(q))
    );
  }

  if (sortOrder === "oldest") {
    filteredPosts = [...filteredPosts].reverse();
  }

  // If no DB connection, use dummy data. Else use actual posts.
  const displayPosts = loading ? [] : (!db ? getDummyPosts(filter) : filteredPosts);

  const activeSubcategories = Array.from(new Set(
    filter === "all" ? posts.map(p => p.subcategory).filter(Boolean) : posts.filter(p => p.category === filter).map(p => p.subcategory).filter(Boolean)
  )) as string[];

  const openModal = (post: Post) => {
    setActiveMedia(post);
    setModalOpen(true);
  };

  const getIcon = (cat: Category) => {
    switch (cat) {
      case "videography": return <Play size={16} />;
      case "photography": return <ImageIcon size={16} />;
      case "music": return <Music size={16} />;
      default: return null;
    }
  };

  const getBgStyle = (cat: Category) => {
    if (cat === 'music') return 'bg-gradient-to-br from-black to-accent/40';
    return 'bg-black/50';
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input 
          type="text" 
          placeholder="Search projects..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 bg-background border border-border rounded-xl p-3 focus:outline-none focus:border-accent text-foreground transition-colors"
        />
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")} 
          className="w-full md:w-auto bg-background border border-border rounded-xl p-3 focus:outline-none focus:border-accent text-foreground transition-colors"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {/* Primary Filters */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          {(["all", "videography", "photography", "music"] as Category[]).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setSubFilter("all"); }}
              className={`px-6 py-2 rounded-full border transition-all duration-300 capitalize text-sm tracking-wider font-semibold ${
                filter === cat
                  ? "border-accent bg-accent/20 text-foreground shadow-md"
                  : "border-border bg-card text-foreground/50 hover:border-accent/50 hover:text-foreground hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {cat}
            </button>
          )
        )}
        </div>

        {/* Secondary Filters */}
        {activeSubcategories.length > 0 && (
          <motion.div 
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2"
          >
            <button
              onClick={() => setSubFilter("all")}
              className={`px-4 py-1.5 rounded-full border transition-all duration-300 text-xs tracking-wider capitalize ${
                subFilter === "all" ? "border-accent bg-accent/20 text-foreground shadow-sm" : "border-border bg-card text-foreground/50 hover:border-accent/50 hover:shadow-sm hover:-translate-y-0.5"
              }`}
            >
              All
            </button>
            {activeSubcategories.map(sub => (
              <button
                 key={sub}
                 onClick={() => setSubFilter(sub)}
                 className={`px-4 py-1.5 rounded-full border transition-all duration-300 text-xs tracking-wider capitalize ${
                   subFilter === sub ? "border-accent bg-accent/20 text-foreground shadow-sm" : "border-border bg-card text-foreground/50 hover:border-accent/50 hover:shadow-sm hover:-translate-y-0.5"
                 }`}
              >
                 {sub}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {!loading && displayPosts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 flex items-center justify-center text-foreground/50 tracking-widest uppercase border border-dashed border-border rounded-2xl bg-card"
            >
              No work uploaded yet.
            </motion.div>
          )}

          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={`skeleton-${i}`} className="h-64 rounded-2xl bg-card animate-pulse border border-border" />
            ))
          ) : displayPosts.map((post) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={post.id}
              className="break-inside-avoid mb-8 group relative cursor-pointer rounded-[24px] overflow-hidden bg-card border border-border hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] flex flex-col"
              onClick={() => openModal(post)}
            >
              {post.category !== "music" || post.thumbnailUrl ? (
                <Image
                  src={post.thumbnailUrl || (post.category === "photography" ? post.mediaUrl : "https://picsum.photos/id/15/800/600")}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 blur-0 group-hover:blur-sm"
                  unoptimized
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${getBgStyle(post.category)} group-hover:rotate-3 transition-transform duration-700`}>
                  <Music className="w-16 h-16 text-accent/50 group-hover:text-accent transition-colors" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  {getIcon(post.category)}
                </div>
                <p className="text-[10px] tracking-widest text-accent uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform mb-2">
                  {post.category} {post.subcategory && <span className="opacity-70 text-white px-2">• {post.subcategory}</span>}
                </p>
                <h3 className="text-xl font-bold tracking-widest uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75 text-white">
                  {post.title}
                </h3>
                <p className="mt-4 text-xs tracking-widest text-white/50 uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform delay-100 flex items-center gap-2">
                  View Project
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
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
    </div>
  );
}

function getDummyPosts(filter: Category): Post[] {
  const dummies: Post[] = [
    { id: "1", title: "Cinematic Film 1", description: "", category: "videography", mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: "2", title: "Neon City", description: "", category: "photography", mediaUrl: "https://picsum.photos/id/15/800/600" },
    { id: "3", title: "Night Drive Beat", description: "", category: "music", mediaUrl: "no-url" },
    { id: "4", title: "Wedding Highlights", description: "", category: "videography", mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: "5", title: "Portraits in Rain", description: "", category: "photography", mediaUrl: "https://picsum.photos/id/15/800/600" },
  ];
  return filter === "all" ? dummies : dummies.filter(d => d.category === filter);
}
