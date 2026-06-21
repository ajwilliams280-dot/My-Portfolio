'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { uploadImage, generateImagePath } from '@/lib/upload'
import ImageUpload from './ImageUpload'
import { Upload, X } from 'lucide-react'

interface ProjectUploadProps {
  onUploadComplete?: () => void
}

export default function ProjectUpload({ onUploadComplete }: ProjectUploadProps) {
  const [formData, setFormData] = useState<{
    title: string
    description: string
    category: 'photo' | 'video' | 'music'
    subcategory: string
  }>({
    title: '',
    description: '',
    category: 'photo',
    subcategory: 'Portrait'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedFile(file)
    setPreview(preview)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setError('Please select an image')
      return
    }

    if (!formData.title.trim()) {
      setError('Please enter a title')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      // Upload image to Firebase Storage
      const imagePath = generateImagePath('user', selectedFile.name)
      const downloadURL = await uploadImage(selectedFile, imagePath)

      // Save project data to Firestore
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subcategory: formData.subcategory,
        mediaUrl: downloadURL,
        thumbnailUrl: downloadURL, // Use same URL for thumbnail
        createdAt: serverTimestamp(),
        uploadDate: serverTimestamp(),
        tags: [formData.category, formData.subcategory.toLowerCase()],
        featured: false
      }

      await addDoc(collection(db, 'projects'), projectData)

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'photo',
        subcategory: 'Portrait'
      })
      setSelectedFile(null)
      setPreview('')

      onUploadComplete?.()
      console.log('✅ Project uploaded successfully')
    } catch (err) {
      console.error('🔥 Upload error:', err)
      setError('Failed to upload project. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const categories = [
    { value: 'photo', label: 'Photography' },
    { value: 'video', label: 'Videography' },
    { value: 'music', label: 'Music' }
  ]

  const subcategories = {
    photo: ['Portrait', 'Landscape', 'Urban', 'Fashion', 'Creative'],
    video: ['Short Film', 'Documentary', 'Music Video', 'Commercial'],
    music: ['Original', 'Cover', 'Remix', 'Collaboration']
  }

  return (
    <div className="glass-dark rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Upload New Project</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Image *
          </label>
          <ImageUpload
            onImageSelect={handleImageSelect}
            currentImage={preview}
            className="aspect-video"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            placeholder="Enter project title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent resize-none"
            rows={3}
            placeholder="Describe your project"
          />
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                const newCategory = e.target.value as 'photo' | 'video' | 'music'
                setFormData({
                  ...formData,
                  category: newCategory,
                  subcategory: subcategories[newCategory][0]
                })
              }}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subcategory
            </label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              {subcategories[formData.category].map(sub => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 bg-accent text-noir px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-noir border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
