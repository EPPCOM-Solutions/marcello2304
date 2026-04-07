const fs = require('fs');
const cheerio = require('cheerio');

async function test() {
  const url = 'https://www.kleinanzeigen.de/s-wohnung-mieten/c203l9280';
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const items = [];
  $('article.aditem').each((_, element) => {
    const el = $(element);
    items.push(el.find('.text-module-begin a').text().trim());
  });
  console.log("Found " + items.length + " items");
  console.log(items.slice(0, 3));
}
test();
