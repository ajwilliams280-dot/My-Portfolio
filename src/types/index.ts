export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'video' | 'photo' | 'music' | 'software';
  subcategory?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  uploadDate: Date;
  tags?: string[];
  featured: boolean;
  // Media Categories
  photoCategories?: string[];   // slugs
  videoCategories?: string[];   // slugs
  musicCategories?: string[];   // slugs
  autoTags?: string[];          // AI/keyword-generated descriptive tags
}

export interface PhotoCategory {
  id: string;           // slug: 'coastal', 'landscape', etc.
  label: string;        // 'Coastal Photography'
  description: string;
  icon: string;         // emoji
  gradient: string;     // tailwind gradient classes
  accentColor: string;  // hex or tailwind color
  keywords: string[];   // for auto-classification
  image?: string;       // Unsplash URL for the category background
}

export interface VideoCategory {
  id: string;           
  label: string;        
  description: string;
  icon?: string;         
  image?: string;       
}

export interface MusicCategory {
  id: string;           
  label: string;        
  description: string;
  icon?: string;         
  image?: string;       
}

export interface ClassificationResult {
  categories: string[];   // category slugs
  tags: string[];
  confidence: number;     // 0–1
}

export interface AdminUser {
  email: string;
  uid: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  timestamp: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export type ExperienceReaction = 
  | 'Memorable' 
  | 'Exceptional' 
  | 'Outstanding' 
  | 'Cinematic' 
  | 'Amazing' 
  | 'Beautifully Captured';

export interface ClientStory {
  id: string;
  clientName: string;
  clientImage?: string;
  serviceType: 'Photography' | 'Videography' | 'Music Production';
  projectName?: string;
  story: string;
  rating: number; // 1-5
  reactions: ExperienceReaction[];
  isVideo: boolean;
  mediaUrl?: string; // For video testimonials or project image
  date: Date;
  verified: boolean;
}
