const cheerio = require('cheerio');

const html = `
<article class="aditem">
  <div class="aditem-main--middle--description">3,5 Zimmer Wohnung in Bestlage</div>
  <h2 class="text-module-begin"><a href="/test">Wunderschöne 3Zi Wohnung</a></h2>
  <span class="simpletag">3 Zimmer</span>
</article>
`;

const $ = cheerio.load(html);
$('article.aditem').each((_, element) => {
  const el = $(element);
  const title = el.find('.text-module-begin a').text().trim();
  const rawDesc = el.find('.aditem-main--middle--description').text().trim();
  const tags = el.find('.simpletag').map((i, tag) => $(tag).text().trim()).get();
  
  let rooms = null;
  tags.forEach(tag => {
    if (tag.toLowerCase().includes('zimmer')) {
      const m = tag.match(/(\d+(?:[.,]\d+)?)/);
      if(m) rooms = parseFloat(m[1].replace(',', '.'));
    }
  });
  if (rooms === null) {
    const roomMatch = rawDesc.match(/(\d+(?:[.,]\d+)?)\s*Zimmer/i);
    if (roomMatch) rooms = parseFloat(roomMatch[1].replace(',', '.'));
  }
  if (rooms === null) {
    const titleRoomMatch = title.match(/(\d+(?:[.,]\d+)?)\s*Zi/i) || title.match(/(\d+(?:[.,]\d+)?)\s*Zimmer/i);
    if (titleRoomMatch) rooms = parseFloat(titleRoomMatch[1].replace(',', '.'));
  }
  console.log("Rooms found:", rooms);
});
