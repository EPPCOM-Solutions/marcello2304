const cheerio = require('cheerio');

async function fetchRegional(location, propertyType) {
    const slug = location.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    let typeParam = 'wohnungen';
    if (propertyType === 'haus') typeParam = 'haeuser';
    else if (propertyType === 'grundstueck') typeParam = 'grundstuecke';
    const rentBuy = 'mieten';
    
    // Scrape real local ads from ohne-makler.net
    const url = `https://www.ohne-makler.net/immobilie/${rentBuy}/${typeParam}/${slug}/`;
    console.log("Fetching URL:", url);
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log("Status:", response.status);
    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];
    $('.objekt, .estate, .property, article, tr.item, div.listing, a.expose-link, .card').each((_, el) => {
        results.push({
           html: $(el).html()?.substring(0,100)
        });
    });
    console.log("Found containers:", results.length);
}

fetchRegional("Stuttgart", "wohnung").catch(console.error);
