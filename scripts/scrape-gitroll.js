// eslint-disable-next-line @typescript-eslint/no-require-imports
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const URL = 'https://gitroll.io/result/repo/Apd5G4f6aQhW111hVa2E';
const OUT_DIR = path.join(__dirname, 'gitroll-capture');

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const captured = [];

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  );

  page.on('response', async (response) => {
    try {
      const req = response.request();
      const type = req.resourceType();
      if (type !== 'xhr' && type !== 'fetch') return;
      const url = response.url();
      const text = await response.text().catch(() => null);
      if (!text) return;
      captured.push({ url, status: response.status(), body: text });
      console.log(`[captured] ${response.status()} ${url} (${text.length} bytes)`);
    } catch {
      // ignore read failures
    }
  });

  console.log('Opening', URL);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait for the issues table to render rows
  try {
    await page.waitForFunction(
      () => document.body.innerText.includes('Unexpected') || document.body.innerText.match(/Page\s+1\s+of\s+\d+/),
      { timeout: 30000 }
    );
  } catch {
    console.log('Table wait timed out, dumping what we have.');
  }
  await new Promise((r) => setTimeout(r, 3000));

  fs.writeFileSync(
    path.join(OUT_DIR, 'captured.json'),
    JSON.stringify(captured, null, 2)
  );
  console.log(`\nSaved ${captured.length} responses to ${OUT_DIR}/captured.json`);

  // Also dump visible page text for reference
  const bodyText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(path.join(OUT_DIR, 'page-text.txt'), bodyText);

  await browser.close();
})();
