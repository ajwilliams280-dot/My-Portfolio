import { PHOTO_CATEGORIES } from '@/data/photoCategories';
import { ClassificationResult } from '@/types';

/**
 * Classifies an image into photography categories using a layered approach:
 * 1. Keyword matching on filename, title, and description
 * 2. (Optional) Google Cloud Vision API via /api/classify-image if env is set
 */
export async function classifyImage(
  file: File,
  title: string,
  description: string
): Promise<ClassificationResult> {
  const combinedText = [
    file.name.replace(/[_\-\.]/g, ' '),
    title,
    description,
  ]
    .join(' ')
    .toLowerCase();

  // --- Client-side keyword classifier (always runs as baseline) ---
  const keywordScores = keywordClassify(combinedText);

  // --- Try Vision API if available ---
  try {
    const apiResult = await callVisionAPI(file, title, description);
    if (apiResult) {
      // Merge API result with keyword scores
      const mergedCategories = new Set([...apiResult.categories, ...keywordScores.categories]);
      const mergedTags = Array.from(new Set([...apiResult.tags, ...keywordScores.tags]));
      return {
        categories: Array.from(mergedCategories),
        tags: mergedTags.slice(0, 15),
        confidence: Math.max(apiResult.confidence, keywordScores.confidence),
      };
    }
  } catch {
    // Vision API unavailable — fall through to keyword result
  }

  return keywordScores;
}

/**
 * Pure keyword-based classification using category keyword arrays.
 * Works offline, no API key required.
 */
export function keywordClassify(text: string): ClassificationResult {
  const lower = text.toLowerCase();
  const categoryScores: { id: string; score: number }[] = [];
  const allMatchedTags: string[] = [];

  for (const cat of PHOTO_CATEGORIES) {
    let score = 0;
    const matched: string[] = [];

    for (const kw of cat.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.split(' ').length > 1 ? 2 : 1; // multi-word keywords worth more
        matched.push(kw);
      }
    }

    if (score > 0) {
      categoryScores.push({ id: cat.id, score });
      matched.forEach(m => {
        if (!allMatchedTags.includes(m)) allMatchedTags.push(m);
      });
    }
  }

  // Sort by score descending
  categoryScores.sort((a, b) => b.score - a.score);

  // Determine max score for normalization
  const maxScore = categoryScores[0]?.score ?? 0;

  // Only include categories with at least 30% of max score
  const threshold = Math.max(1, maxScore * 0.3);
  const matchedCategories = categoryScores
    .filter(c => c.score >= threshold)
    .map(c => c.id);

  // If nothing matched, attempt a final broad fallback
  if (matchedCategories.length === 0) {
    return {
      categories: [],
      tags: [],
      confidence: 0,
    };
  }

  const confidence = Math.min(1, maxScore / 5);

  return {
    categories: matchedCategories,
    tags: allMatchedTags.slice(0, 15),
    confidence,
  };
}

/**
 * Calls the /api/classify-image Next.js API route.
 * Returns null if the API is unavailable or not configured.
 */
async function callVisionAPI(
  file: File,
  title: string,
  description: string
): Promise<ClassificationResult | null> {
  try {
    const base64 = await fileToBase64(file);
    const res = await fetch('/api/classify-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64, title, description }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.categories) return null;
    return data as ClassificationResult;
  } catch {
    return null;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip data URL prefix
      resolve(result.split(',')[1] ?? result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generate descriptive tags from text (title + description + filename)
 */
export function generateTagsFromText(title: string, description: string, filename: string): string[] {
  const text = [title, description, filename.replace(/[_\-\.]/g, ' ')].join(' ').toLowerCase();
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'this', 'that', 'these', 'those', 'i', 'my', 'me', 'we', 'our']);

  const words = text
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  // Deduplicate and return top tags
  return Array.from(new Set(words)).slice(0, 12);
}
