'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Volume2, Calendar, Tag, Camera } from 'lucide-react'
import Image from 'next/image'
import { Project } from '@/types'

interface PortfolioGalleryProps {
  projects: Project[]
  filter?: string
  showFeaturedOnly?: boolean
}

export default function PortfolioGallery({ projects, filter = 'all', showFeaturedOnly = false }: PortfolioGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  // Filter projects based on props
  const filteredProjects = projects.filter(project => {
    const categoryMatch = filter === 'all' || project.category === filter
    const featuredMatch = !showFeaturedOnly || project.featured
    return categoryMatch && featuredMatch
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video':
        return <Play size={16} />
      case 'music':
        return <Volume2 size={16} />
      default:
        return null
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'video':
        return 'text-blue-400'
      case 'music':
        return 'text-green-400'
      case 'photo':
        return 'text-purple-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            onClick={() => setSelectedProject(project)}
            className="break-inside-avoid glass-dark rounded-2xl overflow-hidden cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-auto bg-dark overflow-hidden rounded-t-2xl">
              {project.thumbnailUrl && !failedImages.has(project.thumbnailUrl) ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-auto block object-cover group-hover:scale-105 transition-transform duration-500 bg-black/50"
                  onError={() => {
                    // Mark image as failed without DOM manipulation
                    setFailedImages(prev => new Set([...prev, project.thumbnailUrl ?? '']));
                  }}
                />
              ) : (
                <div className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                  <div className="text-center">
                    <div className={`flex justify-center mb-2 ${getCategoryColor(project.category)}`}>
                      {project.category === 'photo' ? <Camera size={32} /> : getCategoryIcon(project.category)}
                    </div>
                    <div className="text-xs text-text-muted mt-2">
                      {failedImages.has(project.thumbnailUrl ?? '') ? 'Image Failed' : 'Thumbnail'}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold glass ${getCategoryColor(project.category)}`}>
                  {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                </span>
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-noir">
                    Featured
                  </span>
                </div>
              )}

              {/* Play Icon Overlay */}
              {project.category === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                    <Play size={24} className="text-noir ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              {/* Subcategory */}
              {project.subcategory && (
                <div className="mb-3">
                  <span className="text-xs px-2 py-1 rounded glass text-text-muted">
                    {project.subcategory}
                  </span>
                </div>
              )}
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 rounded glass text-text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded glass text-text-muted">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-text-muted text-xs">
                <Calendar size={12} />
                {new Date(project.uploadDate).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-text-secondary">
            {showFeaturedOnly 
              ? 'No featured projects found.' 
              : filter === 'all' 
                ? 'No projects found.' 
                : filter === 'photo'
                  ? 'No photo projects found.'
                  : `No ${filter} projects found.`
            }
          </p>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-dark rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-glass-border">
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold glass ${getCategoryColor(selectedProject.category)}`}>
                      {selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1)}
                    </span>
                    {selectedProject.subcategory && (
                      <span className="text-text-secondary text-sm">
                        {selectedProject.subcategory}
                      </span>
                    )}
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                      <Calendar size={14} />
                      {new Date(selectedProject.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-text-secondary hover:text-accent transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Media Display */}
                <div className="mb-6">
                  {selectedProject.category === 'video' ? (
                    <div className="aspect-video bg-dark rounded-2xl flex items-center justify-center">
                      <video
                        src={selectedProject.mediaUrl}
                        controls
                        className="w-full h-full rounded-2xl"
                      />
                    </div>
                  ) : selectedProject.category === 'photo' ? (
                    <div className="bg-black/50 rounded-2xl overflow-hidden flex justify-center items-center min-h-[50vh]">
                      {selectedProject.mediaUrl && !failedImages.has(selectedProject.mediaUrl) ? (
                        <img
                          src={selectedProject.mediaUrl}
                          alt={selectedProject.title}
                          className="max-w-full max-h-[75vh] object-contain"
                          onError={() => {
                            // Mark image as failed without DOM manipulation
                            setFailedImages(prev => new Set([...prev, selectedProject.mediaUrl ?? '']));
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
                          <div className="text-center">
                            <div className="flex justify-center mb-4 text-white/50">
                              <Camera size={48} />
                            </div>
                            <div className="text-white/70">
                              {failedImages.has(selectedProject.mediaUrl ?? '') ? 'Image Failed to Load' : 'Photo Preview'}
                            </div>
                            <div className="text-white/50 text-sm mt-2">URL: {selectedProject.mediaUrl}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="glass rounded-2xl p-8 text-center">
                      <Volume2 size={48} className="text-accent mx-auto mb-4" />
                      <audio
                        src={selectedProject.mediaUrl}
                        controls
                        className="w-full max-w-md mx-auto"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Description</h3>
                    <p className="text-text-secondary">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                        <Tag size={18} />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 rounded-full text-sm glass text-text-secondary"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
