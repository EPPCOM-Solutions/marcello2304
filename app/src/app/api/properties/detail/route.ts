import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL with status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const imageUrls: string[] = [];

    // Aggressive Bildersuche nach der alten Logik
    $('img').each((_, element) => {
      let src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy');
      if (src && src.startsWith('http')) {
        if (!src.includes('avatar') && !src.includes('logo') && !src.includes('icon') && !src.includes('svg')) {
           if (!imageUrls.includes(src)) imageUrls.push(src);
        }
      }
    });
    
    // Aggressive JSON / Skript RegEx Suche (Fallbacks)
    if (imageUrls.length < 2) {
      const regexMatches = html.match(/https:\/\/[^"'\s<>]+?\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s<>]*)?/gi);
      if (regexMatches) {
        regexMatches.forEach(url => {
          if (!url.includes('avatar') && !url.includes('logo') && !url.includes('icon') && !url.includes('/svg/')) {
            const cleanUrl = url.replace(/\\u002F/g, '/'); // fix JSON escaped slashes
            if (!imageUrls.includes(cleanUrl)) imageUrls.push(cleanUrl);
          }
        });
      }
    }

    // Limit to 15 images to avoid crashing the browser memory
    const limitedImages = imageUrls.slice(0, 15);

    return NextResponse.json({ imageUrls: limitedImages });
  } catch (error: any) {
    console.error("Detail Scraper Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
