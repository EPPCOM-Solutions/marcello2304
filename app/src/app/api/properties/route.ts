import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { Property, SearchIntent } from '../../../types/property';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || '';
  const intent = searchParams.get('intent') as SearchIntent || 'rent';
  
  if (!location) {
    return NextResponse.json({ error: 'Location parameter is required' }, { status: 400 });
  }

  // Map intents to Kleinanzeigen categories
  let categoryPath = 'wohnung-mieten';
  let categoryId = 'c203';
  if (intent === 'buy' || intent === 'investment') {
    categoryPath = 'haus-kaufen';
    categoryId = 'c208';
  }

  // Construct search URL (example: https://www.kleinanzeigen.de/s-wohnung-mieten/reutlingen/c203)
  const safeLocation = location.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const url = `https://www.kleinanzeigen.de/s-${categoryPath}/${safeLocation}/${categoryId}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
        'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) {
      if (response.status === 403) {
         return NextResponse.json({ error: 'Blocked by Cloudflare', url }, { status: 403 });
      }
      return NextResponse.json({ error: `Failed to fetch: ${response.status}`, url }, { status: response.status });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const properties: Property[] = [];

    // Parse Kleinanzeigen Ads List
    // Selector for Ad list item: 'article.aditem'
    $('article.aditem').each((_, element) => {
      const el = $(element);
      
      const id = el.attr('data-adid') || String(Math.random());
      const title = el.find('.text-module-begin a').text().trim();
      const rawPrice = el.find('.aditem-main--middle--price-shipping--price').text().trim();
      
      // Extract numbers from price string (e.g., "1.250 €" -> 1250)
      const priceVal = parseInt(rawPrice.replace(/\./g, '').replace(/[^\d]/g, ''), 10);
      const price = isNaN(priceVal) ? 0 : priceVal;

      const address = el.find('.aditem-main--top--left').text().trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
      
      // Description often contains space and room info
      const rawDesc = el.find('.aditem-main--middle--description').text();
      const tags = el.find('.simpletag').map((i, tag) => $(tag).text().trim()).get();
      
      // Very rough estimation for MVP, Kleinanzeigen tags usually have "3 Zimmer", "80 m²"
      let rooms = 2; // Default fallback
      let livingSpace = 50; // Default fallback

      tags.forEach(tag => {
        if (tag.includes('Zimmer')) {
          const m = tag.match(/(\d+(?:,\d+)?)/);
          if(m) rooms = parseFloat(m[1].replace(',', '.'));
        }
        if (tag.includes('m²')) {
          const m = tag.match(/(\d+(?:,\d+)?)/);
          if(m) livingSpace = parseFloat(m[1].replace(',', '.'));
        }
      });

      let imageUrl = el.find('.imagebox.srpimagebox img').attr('src');
      if (imageUrl && !imageUrl.startsWith('http')) imageUrl = imageUrl;

      // Only add meaningful entries (exclude top ads without price if wanted, etc.)
      if (title && price > 0) {
        properties.push({
          id: `ka-${id}`,
          title,
          address,
          price,
          rooms,
          livingSpace,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop', // Fallback
          source: 'Kleinanzeigen',
          estimatedRent: intent === 'investment' ? (price * 0.04) : undefined // Dummy 4% yield estimation for investment showcase
        });
      }
    });

    return NextResponse.json({ properties, meta: { location: safeLocation, total: properties.length } });

  } catch (error: any) {
    console.error("Scraper Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
