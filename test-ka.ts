import * as cheerio from 'cheerio';

async function run() {
    const res = await fetch('https://www.kleinanzeigen.de/s-wohnung-mieten/stuttgart/c203l9280');
    const html = await res.text();
    const $ = cheerio.load(html);
    let i = 0;
    $('article.aditem').each((_, el) => {
        i++;
        if(i > 2) return; // just 2
        console.log("Ad ID:", $(el).attr('data-adid'));
        console.log("Text:", $(el).text().replace(/\s+/g, ' ').substring(0, 150));
        console.log("Tags:", $(el).find('.simpletag').length);
    });
}
run();
