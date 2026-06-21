import { NextRequest, NextResponse } from 'next/server';
import { PHOTO_CATEGORIES } from '@/data/photoCategories';
import { keywordClassify } from '@/lib/imageClassifier';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, title, description } = await req.json();

    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

    // If no Vision API key, do server-side keyword classification
    if (!apiKey) {
      const text = [title, description].join(' ');
      const result = keywordClassify(text);
      return NextResponse.json(result);
    }

    // Call Google Cloud Vision API
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageBase64 },
              features: [
                { type: 'LABEL_DETECTION', maxResults: 30 },
                { type: 'SAFE_SEARCH_DETECTION' },
              ],
            },
          ],
        }),
      }
    );

    if (!visionRes.ok) {
      // Fall back to keyword matching
      const text = [title, description].join(' ');
      return NextResponse.json(keywordClassify(text));
    }

    const visionData = await visionRes.json();
    const labels: string[] =
      visionData?.responses?.[0]?.labelAnnotations?.map(
        (l: { description: string }) => l.description.toLowerCase()
      ) ?? [];

    // Map Vision labels to categories
    const labelText = [...labels, title, description].join(' ').toLowerCase();
    const result = keywordClassify(labelText);

    // Also use raw Vision labels as tags
    const visionTags = labels.slice(0, 10);
    const mergedTags = Array.from(new Set([...result.tags, ...visionTags])).slice(0, 15);

    return NextResponse.json({
      categories: result.categories,
      tags: mergedTags,
      confidence: Math.min(1, result.confidence + (labels.length > 5 ? 0.2 : 0)),
    });
  } catch (err) {
    console.error('Classification API error:', err);
    return NextResponse.json({ categories: [], tags: [], confidence: 0 }, { status: 500 });
  }
}
