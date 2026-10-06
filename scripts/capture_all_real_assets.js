import dotenv from 'dotenv';
dotenv.config();
import puppeteer from 'puppeteer-core';
import { encode } from 'next-auth/jwt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const assetsDir = path.resolve(__dirname, '..', 'canva-bunting-assets');
const realScreenshotsDir = path.join(assetsDir, '08_real_project_screenshots');
const isolatedCompsDir = path.join(assetsDir, '09_real_project_components');
const desktopDashDir = path.join(assetsDir, '08_desktop_dashboards');
const rollupBannerDir = path.join(assetsDir, '07_rollup_banner');

const publicBuntingDir = path.resolve(__dirname, '..', 'public', 'branding', 'bunting');
const pubRealScreenshotsDir = path.join(publicBuntingDir, '08_real_project_screenshots');
const pubIsolatedCompsDir = path.join(publicBuntingDir, '09_real_project_components');

fs.mkdirSync(realScreenshotsDir, { recursive: true });
fs.mkdirSync(isolatedCompsDir, { recursive: true });
fs.mkdirSync(pubRealScreenshotsDir, { recursive: true });
fs.mkdirSync(pubIsolatedCompsDir, { recursive: true });

async function main() {
  console.log('1. Generating JWT authentication token...');
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

  console.log('2. Launching Chrome...');
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

  await page.setCookie({
    name: 'authjs.session-token',
    value: token,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
  });

  // --- CAPTURE 1: Real Desktop Dashboard ---
  console.log('Capturing real Desktop Dashboard (/dashboard)...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500)); // wait for Recharts animation & telemetry polling

  const dashFullPng = path.join(realScreenshotsDir, 'sentinel-real-dashboard-desktop.png');
  await page.screenshot({ path: dashFullPng });
  fs.copyFileSync(dashFullPng, path.join(pubRealScreenshotsDir, 'sentinel-real-dashboard-desktop.png'));

  // Capture isolated DOM elements on Dashboard:
  console.log('Extracting isolated dashboard components...');
  // Find Bento cards grid
  const bentoCards = await page.$$('.grid > div');
  if (bentoCards.length >= 3) {
    // Card 1: CO2 / Gas
    const gasCardPng = path.join(isolatedCompsDir, 'real-comp-co2-gas-card.png');
    await bentoCards[0].screenshot({ path: gasCardPng });
    fs.copyFileSync(gasCardPng, path.join(pubIsolatedCompsDir, 'real-comp-co2-gas-card.png'));

    // Card 2: Temperature
    const tempCardPng = path.join(isolatedCompsDir, 'real-comp-temperature-card.png');
    await bentoCards[1].screenshot({ path: tempCardPng });
    fs.copyFileSync(tempCardPng, path.join(pubIsolatedCompsDir, 'real-comp-temperature-card.png'));

    // Card 3: Humidity
    const humCardPng = path.join(isolatedCompsDir, 'real-comp-humidity-card.png');
    await bentoCards[2].screenshot({ path: humCardPng });
    fs.copyFileSync(humCardPng, path.join(pubIsolatedCompsDir, 'real-comp-humidity-card.png'));
  }

  // Find Charts and Alerts in the lower grid
  const lowerCards = await page.$$('.grid:nth-of-type(2) > div');
  if (lowerCards.length >= 3) {
    // Chart 1: CO2 Trend
    const co2ChartPng = path.join(isolatedCompsDir, 'real-comp-co2-trend-chart.png');
    await lowerCards[0].screenshot({ path: co2ChartPng });
    fs.copyFileSync(co2ChartPng, path.join(pubIsolatedCompsDir, 'real-comp-co2-trend-chart.png'));

    // Chart 2: Temp & Humidity Chart
    const envChartPng = path.join(isolatedCompsDir, 'real-comp-temp-humidity-chart.png');
    await lowerCards[1].screenshot({ path: envChartPng });
    fs.copyFileSync(envChartPng, path.join(pubIsolatedCompsDir, 'real-comp-temp-humidity-chart.png'));

    // Card 3: Recent Alerts
    const alertsCardPng = path.join(isolatedCompsDir, 'real-comp-recent-alerts-card.png');
    await lowerCards[2].screenshot({ path: alertsCardPng });
    fs.copyFileSync(alertsCardPng, path.join(pubIsolatedCompsDir, 'real-comp-recent-alerts-card.png'));
  }

  // Sidebar navigation
  const sidebar = await page.$('aside');
  if (sidebar) {
    const sidebarPng = path.join(isolatedCompsDir, 'real-comp-sidebar-navigation.png');
    await sidebar.screenshot({ path: sidebarPng });
    fs.copyFileSync(sidebarPng, path.join(pubIsolatedCompsDir, 'real-comp-sidebar-navigation.png'));
  }

  // --- CAPTURE 2: Real Data History / Analytics Screen ---
  console.log('Capturing real Data History (/analytics)...');
  await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const analyticsPng = path.join(realScreenshotsDir, 'sentinel-real-analytics-desktop.png');
  await page.screenshot({ path: analyticsPng });
  fs.copyFileSync(analyticsPng, path.join(pubRealScreenshotsDir, 'sentinel-real-analytics-desktop.png'));

  // --- CAPTURE 3: Real Device Management Screen ---
  console.log('Capturing real Device Management (/devices)...');
  await page.goto('http://localhost:3000/devices', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const devicesPng = path.join(realScreenshotsDir, 'sentinel-real-devices-desktop.png');
  await page.screenshot({ path: devicesPng });
  fs.copyFileSync(devicesPng, path.join(pubRealScreenshotsDir, 'sentinel-real-devices-desktop.png'));

  // --- CAPTURE 4: Real User Management Screen ---
  console.log('Capturing real User Access (/users)...');
  await page.goto('http://localhost:3000/users', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const usersPng = path.join(realScreenshotsDir, 'sentinel-real-users-desktop.png');
  await page.screenshot({ path: usersPng });
  fs.copyFileSync(usersPng, path.join(pubRealScreenshotsDir, 'sentinel-real-users-desktop.png'));

  // --- CAPTURE 5: Real Mobile Phone Viewport ---
  console.log('Capturing real Mobile Dashboard (390x844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  const mobileDashPng = path.join(realScreenshotsDir, 'sentinel-real-dashboard-mobile.png');
  await page.screenshot({ path: mobileDashPng });
  fs.copyFileSync(mobileDashPng, path.join(pubRealScreenshotsDir, 'sentinel-real-dashboard-mobile.png'));

  // Mobile Devices page
  await page.goto('http://localhost:3000/devices', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const mobileDevicesPng = path.join(realScreenshotsDir, 'sentinel-real-devices-mobile.png');
  await page.screenshot({ path: mobileDevicesPng });
  fs.copyFileSync(mobileDevicesPng, path.join(pubRealScreenshotsDir, 'sentinel-real-devices-mobile.png'));

  await browser.close();
  console.log('All real project screenshots captured successfully!');

  // --- EMBED REAL SCREENSHOTS INTO BROWSER & LAPTOP MOCKUPS ---
  console.log('Composing real screenshots into high-fidelity Window and Laptop Mockups...');
  await composeMockups(dashFullPng, mobileDashPng);
}

async function composeMockups(desktopPngPath, mobilePngPath) {
  // 1. Dark Browser Window Frame with Real Dashboard
  const deskBase64 = fs.readFileSync(desktopPngPath).toString('base64');
  const mobileBase64 = fs.readFileSync(mobilePngPath).toString('base64');

  const w = 1920;
  const h = 1080;
  const titleBarH = 44;
  const totalW = w + 120;
  const totalH = h + titleBarH + 120;

  const browserWindowSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
    <defs>
      <filter id="browserShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="36" stdDeviation="40" flood-color="#0f172a" flood-opacity="0.22" />
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.12" />
      </filter>
      <clipPath id="browserClip">
        <rect width="${w}" height="${h + titleBarH}" rx="14" />
      </clipPath>
    </defs>

    <g transform="translate(60, 40)" filter="url(#browserShadow)">
      <g clip-path="url(#browserClip)">
        <!-- Browser Window Titlebar -->
        <rect width="${w}" height="${titleBarH}" fill="#1e293b" />
        
        <!-- Traffic Light Buttons -->
        <g transform="translate(20, 16)">
          <circle cx="0" cy="6" r="6" fill="#ef4444" />
          <circle cx="20" cy="6" r="6" fill="#f59e0b" />
          <circle cx="40" cy="6" r="6" fill="#10b981" />
        </g>

        <!-- Browser Address Bar -->
        <g transform="translate(${w / 2 - 240}, 8)">
          <rect width="480" height="28" rx="6" fill="#0f172a" />
          <g transform="translate(18, 7) scale(0.7)">
            <rect x="2" y="6" width="14" height="10" rx="2" fill="none" stroke="#94a3b8" stroke-width="1.8" />
            <path d="M5 6 V4 A4 4 0 0 1 13 4 V6" fill="none" stroke="#94a3b8" stroke-width="1.8" />
          </g>
          <text x="38" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#cbd5e1">https://app.sentinel.io/dashboard</text>
        </g>

        <!-- REAL PROJECT SCREENSHOT EMBEDDED -->
        <image href="data:image/png;base64,${deskBase64}" x="0" y="${titleBarH}" width="${w}" height="${h}" />
      </g>
    </g>
  </svg>`;

  const realBrowserSvgPath = path.join(desktopDashDir, 'desktop-dashboard-browser-frame.svg');
  const realBrowserPngPath = path.join(desktopDashDir, 'desktop-dashboard-browser-frame.png');
  fs.writeFileSync(realBrowserSvgPath, browserWindowSvg, 'utf8');
  await sharp(Buffer.from(browserWindowSvg)).png().toFile(realBrowserPngPath);
  fs.copyFileSync(realBrowserPngPath, path.join(publicBuntingDir, '08_desktop_dashboards', 'desktop-dashboard-browser-frame.png'));
  fs.copyFileSync(realBrowserSvgPath, path.join(publicBuntingDir, '08_desktop_dashboards', 'desktop-dashboard-browser-frame.svg'));

  // 2. Realistic MacBook Laptop Mockup with Real Screenshot
  const screenW = 1536;
  const screenH = 960;
  const bezel = 28;
  const topBezel = 36;
  const lidW = screenW + bezel * 2;
  const lidH = screenH + bezel + topBezel;
  const baseW = lidW + 180;
  const baseH = 28;
  const notchW = 160;
  const totalMacW = baseW + 100;
  const totalMacH = lidH + baseH + 120;

  const macbookSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalMacW} ${totalMacH}" width="${totalMacW}" height="${totalMacH}">
    <defs>
      <filter id="macShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="40" stdDeviation="45" flood-color="#0f172a" flood-opacity="0.25" />
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#0f172a" flood-opacity="0.15" />
      </filter>
      <clipPath id="screenClip">
        <rect width="${screenW}" height="${screenH}" rx="4" />
      </clipPath>
    </defs>

    <g transform="translate(50, 40)" filter="url(#macShadow)">
      <!-- Lid / Bezel -->
      <g transform="translate(${(baseW - lidW) / 2}, 0)">
        <rect width="${lidW}" height="${lidH}" rx="20" fill="#0f172a" stroke="#334155" stroke-width="2" />
        <circle cx="${lidW / 2}" cy="18" r="4" fill="#020617" />
        <circle cx="${lidW / 2}" cy="18" r="1.5" fill="#1e293b" />

        <!-- Real Screenshot on screen -->
        <g transform="translate(${bezel}, ${topBezel})" clip-path="url(#screenClip)">
          <image href="data:image/png;base64,${deskBase64}" x="0" y="0" width="${screenW}" height="${screenH}" preserveAspectRatio="xMidYMid slice" />
        </g>
      </g>

      <!-- Laptop Aluminum Base -->
      <g transform="translate(0, ${lidH})">
        <rect x="${(baseW - 240) / 2}" y="-4" width="240" height="8" rx="3" fill="#1e293b" />
        <path d="M40 0 L${baseW - 40} 0 L${baseW} ${baseH} L0 ${baseH} Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
        <path d="M${(baseW - notchW) / 2} 0 H${(baseW + notchW) / 2} Q${baseW / 2} 12 ${(baseW - notchW) / 2} 0 Z" fill="#94a3b8" />
        <rect x="0" y="${baseH}" width="${baseW}" height="6" rx="2" fill="#94a3b8" />
        <rect x="80" y="${baseH + 2}" width="60" height="4" rx="2" fill="#334155" />
        <rect x="${baseW - 140}" y="${baseH + 2}" width="60" height="4" rx="2" fill="#334155" />
      </g>
    </g>
  </svg>`;

  const realMacSvgPath = path.join(desktopDashDir, 'desktop-dashboard-macbook-mockup.svg');
  const realMacPngPath = path.join(desktopDashDir, 'desktop-dashboard-macbook-mockup.png');
  fs.writeFileSync(realMacSvgPath, macbookSvg, 'utf8');
  await sharp(Buffer.from(macbookSvg)).png().toFile(realMacPngPath);
  fs.copyFileSync(realMacPngPath, path.join(publicBuntingDir, '08_desktop_dashboards', 'desktop-dashboard-macbook-mockup.png'));
  fs.copyFileSync(realMacSvgPath, path.join(publicBuntingDir, '08_desktop_dashboards', 'desktop-dashboard-macbook-mockup.svg'));

  // 3. Real Mobile Smartphone Mockup
  const phoneW = 390;
  const phoneH = 844;
  const phoneFrameW = 440;
  const phoneFrameH = 920;

  const phoneMockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 1020" width="1080" height="2040">
    <defs>
      <filter id="phoneRealShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="28" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.25" />
      </filter>
      <clipPath id="phoneRealClip">
        <rect width="${phoneW}" height="${phoneH}" rx="42" />
      </clipPath>
    </defs>
    <g transform="translate(50, 40)" filter="url(#phoneRealShadow)">
      <!-- Phone Bezel -->
      <rect x="-16" y="-16" width="${phoneW + 32}" height="${phoneH + 32}" rx="54" fill="#0f172a" stroke="#334155" stroke-width="4" />
      <!-- Real Mobile UI Screenshot -->
      <g clip-path="url(#phoneRealClip)">
        <image href="data:image/png;base64,${mobileBase64}" x="0" y="0" width="${phoneW}" height="${phoneH}" />
      </g>
      <!-- Dynamic Island / Speaker Notch -->
      <rect x="${(phoneW - 120) / 2}" y="12" width="120" height="30" rx="15" fill="#000000" />
      <circle cx="${(phoneW - 120) / 2 + 95}" cy="27" r="4.5" fill="#1e293b" />
    </g>
  </svg>`;

  fs.writeFileSync(path.join(rollupBannerDir, 'mockup-phone-dashboard.svg'), phoneMockupSvg, 'utf8');
  await sharp(Buffer.from(phoneMockupSvg)).png().toFile(path.join(rollupBannerDir, 'mockup-phone-dashboard.png'));
  fs.copyFileSync(path.join(rollupBannerDir, 'mockup-phone-dashboard.png'), path.join(publicBuntingDir, '07_rollup_banner', 'mockup-phone-dashboard.png'));
  fs.copyFileSync(path.join(rollupBannerDir, 'mockup-phone-dashboard.svg'), path.join(publicBuntingDir, '07_rollup_banner', 'mockup-phone-dashboard.svg'));

  // 4. Update BOTH Rollup Banners with Real Screenshots!
  await updateRollupBannersWithRealScreenshots(deskBase64, mobileBase64);
}

async function updateRollupBannersWithRealScreenshots(deskBase64, mobileBase64) {
  console.log('Rebuilding Rollup Standing Banners with real project screenshots...');
  const glyphData = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_glyphs.json'), 'utf8'));
  const { wordmark } = glyphData;

  const COLORS = {
    blue: '#2f6fed',
    lightBlue: '#f0f5ff',
    dark: '#18181b',
    slateDark: '#0f172a',
    white: '#ffffff',
    grayText: '#71717a'
  };

  // BANNER 1: Mobile Focus with Dual Real Mockups
  const bannerMobileSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 2800" width="1200" height="2800">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="18%" stop-color="#f0f5ff" />
        <stop offset="50%" stop-color="#ffffff" />
        <stop offset="82%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>

      <filter id="phoneShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="28" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.25" />
      </filter>
      <clipPath id="phoneRealClip1">
        <rect width="390" height="844" rx="42" />
      </clipPath>
    </defs>

    <rect width="1200" height="2800" fill="url(#bgGrad)" />

    <!-- Sensor Waves -->
    <g opacity="0.35">
      <circle cx="600" cy="1000" r="450" fill="none" stroke="${COLORS.blue}" stroke-width="1.2" stroke-dasharray="6 8" />
      <circle cx="600" cy="1000" r="640" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="10 12" opacity="0.6" />
      <circle cx="600" cy="1000" r="850" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="12 16" opacity="0.3" />
    </g>

    <!-- Top Logo Header -->
    <g transform="translate(0, 110)">
      <g transform="translate(600, 0)">
        <g transform="translate(-80, 0) scale(2.0)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="${COLORS.blue}" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
          <path d="M40 47 V56" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <g transform="translate(-235, 175) scale(0.092)">
          <path d="${wordmark.d}" fill="${COLORS.dark}" />
        </g>
      </g>
      <g transform="translate(420, 275)">
        <rect width="360" height="42" rx="21" fill="${COLORS.lightBlue}" stroke="#c7d9fc" stroke-width="1.5" />
        <circle cx="24" cy="21" r="5" fill="${COLORS.blue}" />
        <text x="40" y="27" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="${COLORS.blue}" letter-spacing="2">REAL-TIME IOT TELEMETRY</text>
      </g>
    </g>

    <!-- CENTERPIECE: Real Phone Mockup with Actual App Telemetry -->
    <g transform="translate(370, 520) scale(1.18)" filter="url(#phoneShadow)">
      <rect x="-16" y="-16" width="422" height="876" rx="54" fill="#0f172a" stroke="#334155" stroke-width="4" />
      <g clip-path="url(#phoneRealClip1)">
        <image href="data:image/png;base64,${mobileBase64}" x="0" y="0" width="390" height="844" />
      </g>
      <rect x="${(390 - 120) / 2}" y="12" width="120" height="30" rx="15" fill="#000000" />
      <circle cx="${(390 - 120) / 2 + 95}" cy="27" r="4.5" fill="#1e293b" />
    </g>

    <!-- SECTION 3: BOLD HEADLINE & VALUE PROPOSITION -->
    <g transform="translate(0, 1640)">
      <g transform="translate(600, 0)">
        <g transform="translate(-220, 0)">
          <rect width="440" height="48" rx="24" fill="${COLORS.dark}" />
          <circle cx="24" cy="24" r="6" fill="${COLORS.blue}" />
          <text x="44" y="31" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#ffffff" letter-spacing="2">PRODUCTION APP TELEMETRY</text>
        </g>
      </g>

      <g transform="translate(600, 140)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="82" fill="${COLORS.dark}" text-anchor="middle" letter-spacing="-1">MONITORING</text>
        <text x="0" y="86" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="82" fill="${COLORS.blue}" text-anchor="middle" letter-spacing="-1">FOR ALL</text>
      </g>

      <g transform="translate(600, 275)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="22" fill="${COLORS.grayText}" text-anchor="middle">
          Live CO2 &amp; Gas monitoring, sub-second threshold alerts,
        </text>
        <text x="0" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="22" fill="${COLORS.grayText}" text-anchor="middle">
          and decentralized ESP32 hardware encryption across your facility.
        </text>
      </g>

      <!-- Checklist -->
      <g transform="translate(140, 360)">
        <g transform="translate(0, 0)">
          <rect width="920" height="64" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
          <circle cx="36" cy="32" r="14" fill="${COLORS.blue}" />
          <path d="M30 32 L34 36 L42 28" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="66" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="19" fill="${COLORS.dark}">Real-Time CO2, Temperature &amp; Humidity Telemetry</text>
        </g>
        <g transform="translate(0, 80)">
          <rect width="920" height="64" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
          <circle cx="36" cy="32" r="14" fill="${COLORS.blue}" />
          <path d="M30 32 L34 36 L42 28" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="66" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="19" fill="${COLORS.dark}">Instant Dangerous Spike &amp; Threshold Incident Alerts</text>
        </g>
        <g transform="translate(0, 160)">
          <rect width="920" height="64" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
          <circle cx="36" cy="32" r="14" fill="${COLORS.blue}" />
          <path d="M30 32 L34 36 L42 28" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="66" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="19" fill="${COLORS.dark}">Hardware-Encrypted ESP32 Mesh Gateway</text>
        </g>
      </g>
    </g>

    <!-- SECTION 4: FOOTER -->
    <g transform="translate(0, 2380)">
      <rect width="1200" height="420" fill="${COLORS.slateDark}" />
      <rect width="1200" height="6" fill="${COLORS.blue}" />

      <g transform="translate(100, 60)">
        <g transform="scale(0.8)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="rgba(255,255,255,0.15)" stroke="#ffffff" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="#ffffff" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="#ffffff" />
          <path d="M40 47 V56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <g transform="translate(75, 14) scale(0.042)">
          <path d="${wordmark.d}" fill="#ffffff" />
        </g>
        <text x="0" y="85" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#94a3b8">
          Next-Generation IoT Environmental Monitoring &amp; Telemetry.
        </text>
      </g>

      <g transform="translate(100, 185)">
        <g transform="translate(0, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M12 20 A8 8 0 1 0 28 20 A8 8 0 1 0 12 20 M12 20 H28 M20 12 A12 8 0 0 0 20 28 M20 12 A12 8 0 0 1 20 28" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">MAIN WEBSITE</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">sentinel.io</text>
        </g>
        <g transform="translate(540, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M16 12 L24 20 L16 28 M22 20 H12" fill="none" stroke="${COLORS.blue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">FLEET CLOUD PORTAL</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">app.sentinel.io</text>
        </g>
        <g transform="translate(0, 75)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M14 24 V21 A3 3 0 0 1 17 18 H23 A3 3 0 0 1 26 21 V24 M17 15 A3 3 0 1 0 23 15 A3 3 0 1 0 17 15" fill="none" stroke="${COLORS.blue}" stroke-width="1.6" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">OPEN SOURCE CORE</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">github.com/sentinel/core</text>
        </g>
        <g transform="translate(540, 75)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M14 14 H24 M14 18 H24 M14 22 H20 M12 11 H26 A2 2 0 0 1 28 13 V25 A2 2 0 0 1 26 27 H12 A2 2 0 0 1 10 25 V13 A2 2 0 0 1 12 11 Z" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">DEVELOPER &amp; API DOCS</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">docs.sentinel.io</text>
        </g>
      </g>
    </g>
  </svg>`;

  const bannerMobPath = path.join(rollupBannerDir, 'sentinel-rollup-banner.svg');
  const bannerMobPng = path.join(rollupBannerDir, 'sentinel-rollup-banner.png');
  fs.writeFileSync(bannerMobPath, bannerMobileSvg, 'utf8');
  await sharp(Buffer.from(bannerMobileSvg)).resize(1200, 2800).png().toFile(bannerMobPng);
  fs.copyFileSync(bannerMobPath, path.join(publicBuntingDir, '07_rollup_banner', 'sentinel-rollup-banner.svg'));
  fs.copyFileSync(bannerMobPng, path.join(publicBuntingDir, '07_rollup_banner', 'sentinel-rollup-banner.png'));

  // BANNER 2: Desktop Edition with REAL Captured Desktop Dashboard Window
  const bannerDeskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 2800" width="1200" height="2800">
    <defs>
      <linearGradient id="bgGradD" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="18%" stop-color="#f0f5ff" />
        <stop offset="50%" stop-color="#ffffff" />
        <stop offset="82%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <filter id="deskShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="32" stdDeviation="36" flood-color="#0f172a" flood-opacity="0.25" />
      </filter>
      <clipPath id="deskWindowClip">
        <rect width="1920" height="1124" rx="20" />
      </clipPath>
      <filter id="phoneShadow2" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#0f172a" flood-opacity="0.25" />
      </filter>
      <clipPath id="phoneRealClip2">
        <rect width="390" height="844" rx="42" />
      </clipPath>
    </defs>

    <rect width="1200" height="2800" fill="url(#bgGradD)" />

    <g opacity="0.35">
      <circle cx="600" cy="980" r="450" fill="none" stroke="${COLORS.blue}" stroke-width="1.2" stroke-dasharray="6 8" />
      <circle cx="600" cy="980" r="620" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="10 12" opacity="0.6" />
      <circle cx="600" cy="980" r="820" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="12 16" opacity="0.3" />
    </g>

    <!-- Top Header -->
    <g transform="translate(0, 110)">
      <g transform="translate(600, 0)">
        <g transform="translate(-80, 0) scale(2.0)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="${COLORS.blue}" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
          <path d="M40 47 V56" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <g transform="translate(-235, 175) scale(0.092)">
          <path d="${wordmark.d}" fill="${COLORS.dark}" />
        </g>
      </g>
      <g transform="translate(420, 275)">
        <rect width="360" height="42" rx="21" fill="${COLORS.lightBlue}" stroke="#c7d9fc" stroke-width="1.5" />
        <circle cx="24" cy="21" r="5" fill="${COLORS.blue}" />
        <text x="40" y="27" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="${COLORS.blue}" letter-spacing="2">ENTERPRISE DESKTOP &amp; MOBILE</text>
      </g>
    </g>

    <!-- CENTERPIECE: REAL DESKTOP WINDOW SCREENSHOT + OVERLAPPING REAL PHONE -->
    <g transform="translate(0, 520)">
      <!-- Desktop Window -->
      <g transform="translate(50, 0) scale(0.55)" filter="url(#deskShadow)">
        <g clip-path="url(#deskWindowClip)">
          <rect width="1920" height="44" fill="#1e293b" />
          <g transform="translate(24, 16)">
            <circle cx="0" cy="6" r="6" fill="#ef4444" />
            <circle cx="20" cy="6" r="6" fill="#f59e0b" />
            <circle cx="40" cy="6" r="6" fill="#10b981" />
          </g>
          <rect x="${1920 / 2 - 240}" y="8" width="480" height="28" rx="6" fill="#0f172a" />
          <text x="${1920 / 2}" y="27" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#cbd5e1" text-anchor="middle">https://app.sentinel.io/dashboard</text>
          
          <!-- REAL CAPTURED DESKTOP APP SCREENSHOT -->
          <image href="data:image/png;base64,${deskBase64}" x="0" y="44" width="1920" height="1080" />
        </g>
      </g>

      <!-- Overlapping Floating Real Mobile Phone -->
      <g transform="translate(740, 360) scale(0.92)" filter="url(#phoneShadow2)">
        <rect x="-14" y="-14" width="418" height="872" rx="52" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <g clip-path="url(#phoneRealClip2)">
          <image href="data:image/png;base64,${mobileBase64}" x="0" y="0" width="390" height="844" />
        </g>
        <rect x="${(390 - 120) / 2}" y="12" width="120" height="30" rx="15" fill="#000000" />
        <circle cx="${(390 - 120) / 2 + 95}" cy="27" r="4.5" fill="#1e293b" />
      </g>
    </g>

    <!-- SECTION 3: HEADLINE -->
    <g transform="translate(0, 1620)">
      <g transform="translate(600, 0)">
        <g transform="translate(-240, 0)">
          <rect width="480" height="48" rx="24" fill="${COLORS.dark}" />
          <circle cx="24" cy="24" r="6" fill="${COLORS.blue}" />
          <text x="44" y="31" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#ffffff" letter-spacing="2">REAL-TIME PRODUCTION METRICS</text>
        </g>
      </g>

      <g transform="translate(600, 140)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="82" fill="${COLORS.dark}" text-anchor="middle" letter-spacing="-1">MONITORING</text>
        <text x="0" y="86" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="82" fill="${COLORS.blue}" text-anchor="middle" letter-spacing="-1">FOR ALL</text>
      </g>

      <g transform="translate(600, 275)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="22" fill="${COLORS.grayText}" text-anchor="middle">
          Full desktop command center &amp; instant mobile field alerts.
        </text>
        <text x="0" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="22" fill="${COLORS.grayText}" text-anchor="middle">
          Tamper-evident audit logs &amp; decentralized ESP32 telemetry mesh.
        </text>
      </g>

      <g transform="translate(140, 360)">
        <g transform="translate(0, 0)">
          <rect width="920" height="64" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
          <circle cx="36" cy="32" r="14" fill="${COLORS.blue}" />
          <path d="M30 32 L34 36 L42 28" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="66" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="19" fill="${COLORS.dark}">Enterprise Desktop Console &amp; Real-Time Analytics</text>
        </g>
        <g transform="translate(0, 80)">
          <rect width="920" height="64" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
          <circle cx="36" cy="32" r="14" fill="${COLORS.blue}" />
          <path d="M30 32 L34 36 L42 28" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="66" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="19" fill="${COLORS.dark}">Sub-Second CO2, Toxic Gas &amp; Hazardous Spike Detection</text>
        </g>
        <g transform="translate(0, 160)">
          <rect width="920" height="64" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
          <circle cx="36" cy="32" r="14" fill="${COLORS.blue}" />
          <path d="M30 32 L34 36 L42 28" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="66" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="19" fill="${COLORS.dark}">Zero Cloud Lock-in &#8226; Edge-First Offline Mesh Architecture</text>
        </g>
      </g>
    </g>

    <!-- FOOTER -->
    <g transform="translate(0, 2380)">
      <rect width="1200" height="420" fill="${COLORS.slateDark}" />
      <rect width="1200" height="6" fill="${COLORS.blue}" />

      <g transform="translate(100, 60)">
        <g transform="scale(0.8)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="rgba(255,255,255,0.15)" stroke="#ffffff" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="#ffffff" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="#ffffff" />
          <path d="M40 47 V56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <g transform="translate(75, 14) scale(0.042)">
          <path d="${wordmark.d}" fill="#ffffff" />
        </g>
        <text x="0" y="85" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#94a3b8">
          Next-Generation IoT Environmental Monitoring &amp; Telemetry.
        </text>
      </g>

      <g transform="translate(100, 185)">
        <g transform="translate(0, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M12 20 A8 8 0 1 0 28 20 A8 8 0 1 0 12 20 M12 20 H28 M20 12 A12 8 0 0 0 20 28 M20 12 A12 8 0 0 1 20 28" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">MAIN WEBSITE</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">sentinel.io</text>
        </g>
        <g transform="translate(540, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M16 12 L24 20 L16 28 M22 20 H12" fill="none" stroke="${COLORS.blue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">FLEET CLOUD PORTAL</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">app.sentinel.io</text>
        </g>
        <g transform="translate(0, 75)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M14 24 V21 A3 3 0 0 1 17 18 H23 A3 3 0 0 1 26 21 V24 M17 15 A3 3 0 1 0 23 15 A3 3 0 1 0 17 15" fill="none" stroke="${COLORS.blue}" stroke-width="1.6" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">OPEN SOURCE CORE</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">github.com/sentinel/core</text>
        </g>
        <g transform="translate(540, 75)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M14 14 H24 M14 18 H24 M14 22 H20 M12 11 H26 A2 2 0 0 1 28 13 V25 A2 2 0 0 1 26 27 H12 A2 2 0 0 1 10 25 V13 A2 2 0 0 1 12 11 Z" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">DEVELOPER &amp; API DOCS</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">docs.sentinel.io</text>
        </g>
      </g>
    </g>
  </svg>`;

  const bannerDeskPath = path.join(rollupBannerDir, 'sentinel-rollup-banner-desktop.svg');
  const bannerDeskPng = path.join(rollupBannerDir, 'sentinel-rollup-banner-desktop.png');
  fs.writeFileSync(bannerDeskPath, bannerDeskSvg, 'utf8');
  await sharp(Buffer.from(bannerDeskSvg)).resize(1200, 2800).png().toFile(bannerDeskPng);
  fs.copyFileSync(bannerDeskPath, path.join(publicBuntingDir, '07_rollup_banner', 'sentinel-rollup-banner-desktop.svg'));
  fs.copyFileSync(bannerDeskPng, path.join(publicBuntingDir, '07_rollup_banner', 'sentinel-rollup-banner-desktop.png'));

  console.log('Both Rollup Banners updated with real project screenshots!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
