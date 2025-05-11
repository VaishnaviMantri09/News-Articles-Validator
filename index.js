const fs = require("fs");
const { chromium } = require("playwright");

function parseTimeAgo(text) {
  const [value, unit] = text.split(" ");
  const num = parseInt(value, 10);
  const now = new Date();

  let msAgo = 0;
  if (unit.startsWith("second")) msAgo = num * 1000;
  else if (unit.startsWith("minute")) msAgo = num * 60 * 1000;
  else if (unit.startsWith("hour")) msAgo = num * 60 * 60 * 1000;
  else if (unit.startsWith("day")) msAgo = num * 24 * 60 * 60 * 1000;
  else msAgo = Number.MAX_SAFE_INTEGER;

  return new Date(now.getTime() - msAgo);
}

async function scrapeHackerNewsNewest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const articles = [];

  await page.goto("https://news.ycombinator.com/newest");

  while (articles.length < 100) {
    const pageArticles = await page.$$eval("tr.athing", rows => {
      return rows.map(row => {
        const titleElem = row.querySelector("a.storylink") || row.querySelector("span.titleline > a");
        const title = titleElem ? titleElem.innerText.trim() : "";
        const link = titleElem ? titleElem.href : "";

        const nextRow = row.nextElementSibling;
        const ageSpan = nextRow?.querySelector("span.age");
        const time = ageSpan?.innerText.trim() || "";

        return { title, link, time };
      });
    });

    articles.push(...pageArticles);

    if (articles.length >= 100) break;

    const moreLink = await page.$("a.morelink");
    if (!moreLink) break;

    await Promise.all([
      page.waitForSelector("tr.athing", { timeout: 100000 }),
      moreLink.click({ timeout: 100000, force: true }),
    ]);
  }

  await browser.close();

  const original = articles.slice(0, 100).map(article => ({
    ...article,
    timestamp: parseTimeAgo(article.time).toISOString(),
  }));

  const sorted = [...original].sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  );


  const isSorted = original.every((a, i, arr) =>
    i === 0 || new Date(arr[i - 1].timestamp) >= new Date(a.timestamp)
  );

  if (isSorted) {
    console.log("✅ The first 100 articles are sorted from newest to oldest.");
  } else {
    console.log("❌ The first 100 articles are NOT sorted from newest to oldest.");
  }


  fs.writeFileSync("original_articles.json", JSON.stringify(original, null, 2));
  fs.writeFileSync("sorted_articles.json", JSON.stringify(sorted, null, 2));

  console.log("📁 Saved original to original_articles.json");
  console.log("📁 Saved sorted to sorted_articles.json");
}

scrapeHackerNewsNewest();
