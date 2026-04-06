const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('test.html', 'utf-8');
const $ = cheerio.load(html);

const properties = [];

$('article.aditem').each((_, element) => {
  const el = $(element);
  
  const id = el.attr('data-adid') || String(Math.random());
  const title = el.find('.text-module-begin a').text().trim();
  const rawPrice = el.find('.aditem-main--middle--price-shipping--price').text().trim();
  
  const priceVal = parseInt(rawPrice.replace(/\./g, '').replace(/[^\d]/g, ''), 10);
  const price = isNaN(priceVal) ? 0 : priceVal;

  const address = el.find('.aditem-main--top--left').text().trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
  
  const tags = el.find('.simpletag').map((i, tag) => $(tag).text().trim()).get();
  
  let imageUrl = el.find('.imagebox.srpimagebox img').attr('src');
  
  if (title && price > 0) {
    properties.push({
      id, title, price, rawPrice, address, tags, imageUrl
    });
  }
});

console.log(JSON.stringify(properties, null, 2));
