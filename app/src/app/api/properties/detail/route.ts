import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Valid URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch: ${response.status}`, url }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const imageUrls: string[] = [];

    // Kleinanzeigen Detail Page Slide Images
    // Usually in #viewad-slider img or .galleryimage-element img
    $('#viewad-slider img, .galleryimage-element img').each((_, element) => {
      let src = $(element).attr('src') || $(element).attr('data-imgsrc');
      if (src && src.startsWith('http')) {
        // Remove miniature rules to get full res if possible
        src = src.replace('$_14.JPG', '$_59.JPG').replace('$_1.JPG', '$_59.JPG');
        if (!imageUrls.includes(src)) {
          imageUrls.push(src);
        }
      }
    });

    // Fallback if slider wasn't found - just get main image
    if (imageUrls.length === 0) {
      const mainImg = $('#viewad-image').attr('src');
      if (mainImg) imageUrls.push(mainImg);
    }

    return NextResponse.json({ imageUrls });

  } catch (error: any) {
    console.error("Detail Scraper Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
