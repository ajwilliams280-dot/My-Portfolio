'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Project } from '@/types'
import MediaModal from './portfolio/MediaModal'

interface FeaturedWorkProps {
  projects: Project[]
}



export default function FeaturedWork({ projects }: FeaturedWorkProps) {
  const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'music'>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [failedProjects, setFailedProjects] = useState<Set<string>>(new Set())

  const handleMediaError = (projectId: string) => {
    setFailedProjects(prev => {
      const newSet = new Set(prev);
      newSet.add(projectId);
      return newSet;
    });
  };

  const featuredProjects = projects
    .filter(project => project.featured)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

  const filteredProjects = featuredProjects.filter(project => {
    // Exclude if media failed to load
    if (failedProjects.has(project.id)) return false;
    
    // Exclude if no media is present at all
    if (!project.mediaUrl && !project.thumbnailUrl) return false;

    if (filter === 'all') return true;
    return project.category === filter;
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'photo', label: 'Photography' },
    { id: 'video', label: 'Videography' },
    { id: 'music', label: 'Music Production' },
    { id: 'software', label: 'Software Development' }
  ];

  if (featuredProjects.length === 0) {
    return (
      <section className="py-20 px-6 bg-background">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-6">
            Featured Work
          </h2>
          <p className="text-xl text-foreground/70">
            A curated selection of my best work in photography, videography, filmmaking, and music production.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6 bg-transparent relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-foreground mb-6">
            Featured Work
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            A curated selection of my best work in photography, videography, filmmaking, and music production.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                filter === cat.id 
                  ? 'bg-accent/20 border-accent text-foreground shadow-md' 
                  : 'bg-card border-border text-foreground/70 hover:text-foreground hover:border-accent/50 hover:shadow-md'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative cursor-pointer rounded-[24px] overflow-hidden bg-card border border-border hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] flex flex-col"
              >
                <div className="p-3">
                  {project.category === 'video' ? (
                    <video
                      src={project.mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      onError={() => handleMediaError(project.id)}
                      className="w-full h-auto object-cover rounded-[16px] bg-foreground/5"
                    />
                  ) : (
                    <img
                      src={project.thumbnailUrl || project.mediaUrl}
                      alt={project.title}
                      loading="lazy"
                      onError={() => handleMediaError(project.id)}
                      className="w-full h-auto object-cover rounded-[16px] bg-foreground/5"
                    />
                  )}
                </div>
                
                <div className="p-6 pt-2 flex-grow flex flex-col">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent mb-3 uppercase tracking-wider">
                      {project.category} {project.subcategory && `• ${project.subcategory}`}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="group flex items-center gap-3 px-8 py-4 bg-background border border-border rounded-full hover:bg-card hover:border-accent/50 hover:shadow-[0_0_20px_rgba(229,9,20,0.2)] transition-all duration-300"
                    >
                      View Project
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <MediaModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          type={selectedProject.category as any}
          mediaUrl={selectedProject.mediaUrl}
          date={{ seconds: selectedProject.uploadDate.getTime() / 1000 } as any}
          description={selectedProject.description}
          thumbnailUrl={selectedProject.thumbnailUrl}
        />
      )}
    </section>
  )
}
