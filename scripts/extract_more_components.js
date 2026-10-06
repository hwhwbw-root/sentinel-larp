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
const isolatedCompsDir = path.resolve(__dirname, '..', 'canva-bunting-assets', '09_real_project_components');
const pubIsolatedCompsDir = path.resolve(__dirname, '..', 'public', 'branding', 'bunting', '09_real_project_components');
const realScreenshotsDir = path.resolve(__dirname, '..', 'canva-bunting-assets', '08_real_project_screenshots');
const pubRealScreenshotsDir = path.resolve(__dirname, '..', 'public', 'branding', 'bunting', '08_real_project_screenshots');

async function main() {
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

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1920,1080'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.setCookie({
    name: 'authjs.session-token',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
  });

  // 1. Dashboard components
  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Extract Header / Controls
  const headerElem = await page.$('.flex.flex-col.sm\\:flex-row.justify-between');
  if (headerElem) {
    const p = path.join(isolatedCompsDir, 'real-comp-dashboard-header-controls.png');
    await headerElem.screenshot({ path: p });
    fs.copyFileSync(p, path.join(pubIsolatedCompsDir, 'real-comp-dashboard-header-controls.png'));
  }

  // Find all cards containing H3
  const h3Handles = await page.$$('h3');
  for (const h3 of h3Handles) {
    const text = await (await h3.getProperty('innerText')).jsonValue();
    const cardHandle = await page.evaluateHandle(el => el.closest('.bg-white, div[class*="rounded"]'), h3);
    if (cardHandle && cardHandle.asElement()) {
      if (text.includes('CO2 Trend')) {
        const p = path.join(isolatedCompsDir, 'real-comp-co2-trend-chart.png');
        await cardHandle.asElement().screenshot({ path: p });
        fs.copyFileSync(p, path.join(pubIsolatedCompsDir, 'real-comp-co2-trend-chart.png'));
        console.log('Saved real-comp-co2-trend-chart.png');
      } else if (text.includes('Temp & Humidity')) {
        const p = path.join(isolatedCompsDir, 'real-comp-temp-humidity-chart.png');
        await cardHandle.asElement().screenshot({ path: p });
        fs.copyFileSync(p, path.join(pubIsolatedCompsDir, 'real-comp-temp-humidity-chart.png'));
        console.log('Saved real-comp-temp-humidity-chart.png');
      } else if (text.includes('Recent Alerts')) {
        const p = path.join(isolatedCompsDir, 'real-comp-recent-alerts-card.png');
        await cardHandle.asElement().screenshot({ path: p });
        fs.copyFileSync(p, path.join(pubIsolatedCompsDir, 'real-comp-recent-alerts-card.png'));
        console.log('Saved real-comp-recent-alerts-card.png');
      }
    }
  }

  // 2. Devices page table
  console.log('Navigating to devices...');
  await page.goto('http://localhost:3000/devices', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const tableElem = await page.$('.overflow-x-auto, table, .border.border-zinc-200\\/60');
  if (tableElem) {
    const p = path.join(isolatedCompsDir, 'real-comp-device-fleet-table.png');
    await tableElem.screenshot({ path: p });
    fs.copyFileSync(p, path.join(pubIsolatedCompsDir, 'real-comp-device-fleet-table.png'));
    console.log('Saved real-comp-device-fleet-table.png');
  }

  // 3. Login page (logged out view)
  console.log('Navigating to login...');
  const loginPage = await browser.newPage();
  await loginPage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await loginPage.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const loginFullPng = path.join(realScreenshotsDir, 'sentinel-real-login-desktop.png');
  await loginPage.screenshot({ path: loginFullPng });
  fs.copyFileSync(loginFullPng, path.join(pubRealScreenshotsDir, 'sentinel-real-login-desktop.png'));

  const loginCard = await loginPage.$('.bg-white, form, div[class*="rounded"]');
  if (loginCard) {
    const p = path.join(isolatedCompsDir, 'real-comp-login-card.png');
    await loginCard.screenshot({ path: p });
    fs.copyFileSync(p, path.join(pubIsolatedCompsDir, 'real-comp-login-card.png'));
    console.log('Saved real-comp-login-card.png');
  }

  await browser.close();
  console.log('Done extracting all real components!');
}

main().catch(console.error);
