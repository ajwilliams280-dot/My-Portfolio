import { supabase, hasSupabaseConfig } from '@/lib/supabaseClient';
import { Project } from '@/types';
import { getLocalProjects, getPhotosByCategory as getPhotosByCategoryLocal } from './localDatabase';
import { PHOTO_CATEGORIES } from './photoCategories';

// Map database row to Project type
function mapSupabaseToProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category,
    subcategory: row.subcategory || undefined,
    mediaUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url,
    uploadDate: new Date(row.upload_date),
    tags: row.tags || [],
    featured: row.featured,
    photoCategories: row.photo_categories || [],
    autoTags: row.auto_tags || [],
  };
}

// Fetch all photos
export async function getPhotos(): Promise<Project[]> {
  if (!hasSupabaseConfig) {
    // Fall back to local real projects when Supabase isn't configured yet
    return getLocalProjects();
  }

  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('upload_date', { ascending: false });

    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      // Fall back to local projects on error
      return getLocalProjects();
    }

    // If Supabase table exists but is empty, still show local projects
    if (!data || data.length === 0) {
      return getLocalProjects();
    }

    const supabaseProjects = data.map(mapSupabaseToProject);
    const localProjects = getLocalProjects();
    const supabaseIds = new Set(supabaseProjects.map(p => p.id));
    const localToAdd = localProjects.filter(p => !supabaseIds.has(p.id));

    const finalResult = [...supabaseProjects, ...localToAdd];
    console.log(`[getPhotos debug] Total: ${finalResult.length}, Videos: ${finalResult.filter(p => p.category === 'video').length}`);
    return finalResult;
  } catch (err) {
    console.error('Failed to query Supabase projects:', err);
    return getLocalProjects();
  }
}

// Fetch photos by category
export async function getPhotosByCategory(categorySlug: string): Promise<Project[]> {
  if (!hasSupabaseConfig) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .contains('photo_categories', [categorySlug])
      .order('upload_date', { ascending: false });

    if (error) {
      console.error(`Error fetching photos for category ${categorySlug}:`, error);
      return [];
    }

    const supabaseProjects = (data || []).map(mapSupabaseToProject);
    const localProjects = getPhotosByCategoryLocal(categorySlug);
    const supabaseIds = new Set(supabaseProjects.map(p => p.id));
    const localToAdd = localProjects.filter(p => !supabaseIds.has(p.id));

    return [...supabaseProjects, ...localToAdd];
  } catch (err) {
    console.error('Failed to query Supabase category photos:', err);
    return [];
  }
}

export interface CategoryStat {
  id: string;
  photoCount: number;
  coverImage: string | undefined;
}

// Get stats for all categories
export async function getCategoryStats(): Promise<CategoryStat[]> {
  if (!hasSupabaseConfig) {
    return PHOTO_CATEGORIES.map(cat => ({ id: cat.id, photoCount: 0, coverImage: undefined }));
  }

  try {
    const { data, error } = await supabase
      .from('photos')
      .select('photo_categories, media_url, thumbnailUrl:media_url, upload_date, featured')
      .order('upload_date', { ascending: false });

    if (error) {
      // Suppress console error if the table doesn't exist yet, just fallback gracefully
      return PHOTO_CATEGORIES.map(cat => ({ id: cat.id, photoCount: 0, coverImage: undefined }));
    }

    return PHOTO_CATEGORIES.map(cat => {
      const inCategory = (data || []).filter(row =>
        Array.isArray(row.photo_categories) && row.photo_categories.includes(cat.id)
      );
      
      // Select strongest image: featured first, fallback to most recent
      const featuredImage = inCategory.find(row => row.featured === true);
      const selectedImageRow = featuredImage || inCategory[0];
      
      return {
        id: cat.id,
        photoCount: inCategory.length,
        coverImage: selectedImageRow?.thumbnailUrl || selectedImageRow?.media_url,
      };
    });
  } catch (err) {
    console.error('Failed to fetch category stats:', err);
    return PHOTO_CATEGORIES.map(cat => ({ id: cat.id, photoCount: 0, coverImage: undefined }));
  }
}

// Upload file to storage
export async function uploadPhotoFile(file: File): Promise<string> {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase is not configured. Cannot upload file.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from('portfolio-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('portfolio-photos')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// Insert photo record
export async function addPhotoRecord(photo: Omit<Project, 'id'>): Promise<Project> {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase is not configured. Cannot save photo metadata.');
  }

  const record = {
    title: photo.title,
    description: photo.description,
    category: photo.category,
    subcategory: photo.subcategory || null,
    media_url: photo.mediaUrl,
    thumbnail_url: photo.thumbnailUrl,
    upload_date: photo.uploadDate.toISOString(),
    tags: photo.tags,
    featured: photo.featured,
    photo_categories: photo.photoCategories,
    auto_tags: photo.autoTags,
  };

  const { data, error } = await supabase
    .from('photos')
    .insert([record])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseToProject(data);
}

// Update photo categories
export async function updatePhotoCategories(photoId: string, categories: string[]): Promise<boolean> {
  if (!hasSupabaseConfig) {
    // Local fallback
    const local = getLocalProjects();
    const idx = local.findIndex(p => p.id === photoId);
    if (idx === -1) return false;
    local[idx] = { ...local[idx], photoCategories: categories };
    return true;
  }

  try {
    const { error } = await supabase
      .from('photos')
      .update({ photo_categories: categories })
      .eq('id', photoId);

    return !error;
  } catch {
    return false;
  }
}
