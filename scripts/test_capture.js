import dotenv from 'dotenv';
dotenv.config();
import puppeteer from 'puppeteer-core';
import { encode } from 'next-auth/jwt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve(__dirname, '..', 'canva-bunting-assets', '08_real_project_screenshots');
fs.mkdirSync(outputDir, { recursive: true });

async function main() {
  console.log('Generating JWT session token...');
  const token = await encode({
    token: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Superadmin',
      email: 'admin@sentinel.azmiproductions.com',
      role: 'Superadmin',
    },
    secret: process.env.AUTH_SECRET,
    salt: 'authjs.session-token',
  });

  console.log('Launching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  // Set Auth Cookie
  await page.setCookie({
    name: 'authjs.session-token',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
  });

  console.log('Navigating to http://localhost:3000/dashboard ...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // Wait for polling / animation to settle

  const testFile = path.join(outputDir, 'test-dashboard.png');
  await page.screenshot({ path: testFile });
  console.log(`Saved test screenshot: ${testFile} (${fs.statSync(testFile).size} bytes)`);

  await browser.close();
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
