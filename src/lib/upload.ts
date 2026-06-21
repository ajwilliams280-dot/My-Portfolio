import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    // Create a reference to the file location
    const storageRef = ref(storage, path)
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file)
    
    // Get the download URL using the original reference
    const downloadURL = await getDownloadURL(storageRef)
    
    console.log('✅ Image uploaded successfully:', downloadURL)
    return downloadURL
  } catch (error) {
    console.error('🔥 Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

export function generateImagePath(userId: string, fileName: string): string {
  const timestamp = Date.now()
  const extension = fileName.split('.').pop()
  const baseName = fileName.split('.').slice(0, -1).join('.')
  return `images/${userId}/${timestamp}-${baseName}.${extension}`
}
