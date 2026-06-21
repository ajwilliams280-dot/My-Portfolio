'use client'

import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ onImageSelect, currentImage, className = '' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || '')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        onImageSelect(file, result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleFileSelect(imageFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    setPreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              onClick={handleClick}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Upload size={16} className="text-white" />
            </button>
            <button
              onClick={clearImage}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-accent bg-accent/10' 
              : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }`}
        >
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-300 mb-2">
            {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-gray-500">
            Supports: JPG, PNG, JPEG, WebP
          </p>
        </div>
      )}
    </div>
  )
}
