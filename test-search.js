const cheerio = require('cheerio');
async function run() {
  const url = 'https://www.immowelt.de/suche/stuttgart/haeuser/mieten';
  console.log("Fetching", url);
  const res = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
  const html = await res.text();
  const $ = cheerio.load(html);
  $('h2').each((i, el) => {
    if(i < 5) console.log($(el).text().trim());
  });
}
run();
