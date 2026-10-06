const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rollupDir = path.resolve(__dirname, '..', 'canva-bunting-assets', '07_rollup_banner');
const publicRollupDir = path.resolve(__dirname, '..', 'public', 'branding', 'bunting', '07_rollup_banner');
const screenshotsDir = path.resolve(__dirname, '..', 'canva-bunting-assets', '08_real_project_screenshots');

fs.mkdirSync(rollupDir, { recursive: true });
fs.mkdirSync(publicRollupDir, { recursive: true });

// Load Satoshi wordmark glyph
const glyphData = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_glyphs.json'), 'utf8'));
const { wordmark } = glyphData;

// Load real project screenshots
const deskPngPath = path.join(screenshotsDir, 'sentinel-real-dashboard-desktop.png');
const mobilePngPath = path.join(screenshotsDir, 'sentinel-real-dashboard-mobile.png');
const mobileDevicesPngPath = path.join(screenshotsDir, 'sentinel-real-devices-mobile.png');

const deskBase64 = fs.readFileSync(deskPngPath).toString('base64');
const mobileBase64 = fs.readFileSync(mobilePngPath).toString('base64');
const mobileDevicesBase64 = fs.readFileSync(mobileDevicesPngPath).toString('base64');

const COLORS = {
  blue: '#2f6fed',
  lightBlue: '#f0f5ff',
  dark: '#18181b',
  slateDark: '#0f172a',
  white: '#ffffff',
  grayText: '#71717a',
  border: '#e4e4e7'
};

// 2ft x 6ft: 1200 x 3600 (Exact 1:3 ratio / 24" x 72" / 60cm x 180cm)
const W = 1200;
const H = 3600;

// BANNER 1: 2ft x 6ft Desktop Command Center + Mobile Field App
function getBanner2x6ftDesktopSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg2x6" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="14%" stop-color="#f0f5ff" />
        <stop offset="45%" stop-color="#ffffff" />
        <stop offset="82%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>

      <filter id="shadowDesk" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="36" stdDeviation="40" flood-color="#0f172a" flood-opacity="0.25" />
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.12" />
      </filter>

      <filter id="shadowPhone" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="32" stdDeviation="34" flood-color="#0f172a" flood-opacity="0.28" />
      </filter>

      <clipPath id="deskWindowClip">
        <rect width="1920" height="1124" rx="20" />
      </clipPath>

      <clipPath id="phoneClip">
        <rect width="390" height="844" rx="42" />
      </clipPath>
    </defs>

    <!-- Canvas Background -->
    <rect width="${W}" height="${H}" fill="url(#bg2x6)" />

    <!-- Ambient Radar Waves -->
    <g opacity="0.32">
      <circle cx="600" cy="1150" r="500" fill="none" stroke="${COLORS.blue}" stroke-width="1.2" stroke-dasharray="8 10" />
      <circle cx="600" cy="1150" r="720" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="10 14" opacity="0.6" />
      <circle cx="600" cy="1150" r="950" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="12 18" opacity="0.3" />
    </g>

    <!-- SECTION 1: TOP BRAND HEADER -->
    <g transform="translate(0, 130)">
      <g transform="translate(600, 0)">
        <!-- Shield Icon -->
        <g transform="translate(-88, 0) scale(2.2)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="${COLORS.blue}" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
          <path d="M40 47 V56" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />
        </g>

        <!-- Satoshi Typography Wordmark -->
        <g transform="translate(-270, 195) scale(0.105)">
          <path d="${wordmark.d}" fill="${COLORS.dark}" />
        </g>
      </g>

      <!-- Category Pill -->
      <g transform="translate(390, 310)">
        <rect width="420" height="46" rx="23" fill="${COLORS.lightBlue}" stroke="#c7d9fc" stroke-width="1.5" />
        <circle cx="26" cy="23" r="5.5" fill="${COLORS.blue}" />
        <text x="44" y="30" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.blue}" letter-spacing="2">INDUSTRIAL IOT &#8226; 2FT &#215; 6FT</text>
      </g>
    </g>

    <!-- SECTION 2: CENTERPIECE - REAL DESKTOP DASHBOARD WINDOW + REAL PHONE -->
    <g transform="translate(0, 580)">
      <!-- Desktop Window Mockup with Real App Screenshot -->
      <g transform="translate(65, 0) scale(0.557)" filter="url(#shadowDesk)">
        <g clip-path="url(#deskWindowClip)">
          <!-- Window Header Bar -->
          <rect width="1920" height="44" fill="#1e293b" />
          <g transform="translate(24, 16)">
            <circle cx="0" cy="6" r="6" fill="#ef4444" />
            <circle cx="20" cy="6" r="6" fill="#f59e0b" />
            <circle cx="40" cy="6" r="6" fill="#10b981" />
          </g>
          <rect x="${1920 / 2 - 250}" y="8" width="500" height="28" rx="6" fill="#0f172a" />
          <text x="${1920 / 2}" y="27" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#cbd5e1" text-anchor="middle">https://app.sentinel.io/dashboard</text>
          
          <!-- Real Desktop Dashboard Screenshot -->
          <image href="data:image/png;base64,${deskBase64}" x="0" y="44" width="1920" height="1080" />
        </g>
      </g>

      <!-- Overlapping Floating Phone with Real Mobile Screenshot -->
      <g transform="translate(730, 420) scale(0.98)" filter="url(#shadowPhone)">
        <!-- Outer Chassis -->
        <rect x="-16" y="-16" width="422" height="876" rx="54" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <g clip-path="url(#phoneClip)">
          <!-- Real Mobile App Screenshot -->
          <image href="data:image/png;base64,${mobileBase64}" x="0" y="0" width="390" height="844" />
        </g>
        <!-- Dynamic Island -->
        <rect x="${(390 - 120) / 2}" y="12" width="120" height="30" rx="15" fill="#000000" />
        <circle cx="${(390 - 120) / 2 + 95}" cy="27" r="4.5" fill="#1e293b" />
      </g>
    </g>

    <!-- SECTION 3: BOLD HEADLINE & VALUE PROPOSITION -->
    <g transform="translate(0, 1960)">
      <!-- Feature Pill -->
      <g transform="translate(600, 0)">
        <g transform="translate(-250, 0)">
          <rect width="500" height="50" rx="25" fill="${COLORS.dark}" />
          <circle cx="26" cy="25" r="6.5" fill="${COLORS.blue}" />
          <text x="46" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#ffffff" letter-spacing="2">REAL-TIME PRODUCTION TELEMETRY</text>
        </g>
      </g>

      <!-- Massive Punchline: "MONITORING FOR ALL" -->
      <g transform="translate(600, 150)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="90" fill="${COLORS.dark}" text-anchor="middle" letter-spacing="-1.5">MONITORING</text>
        <text x="0" y="96" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="90" fill="${COLORS.blue}" text-anchor="middle" letter-spacing="-1.5">FOR ALL</text>
      </g>

      <!-- Description -->
      <g transform="translate(600, 310)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="24" fill="${COLORS.grayText}" text-anchor="middle">
          Full desktop command center &amp; instant mobile field telemetry.
        </text>
        <text x="0" y="36" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="24" fill="${COLORS.grayText}" text-anchor="middle">
          Tamper-evident audit logs &amp; decentralized ESP32 sensor mesh.
        </text>
      </g>

      <!-- 4-Item Feature Checklist (2ft x 6ft optimized spacing) -->
      <g transform="translate(130, 420)">
        <g transform="translate(0, 0)">
          <rect width="940" height="72" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.5" />
          <circle cx="40" cy="36" r="16" fill="${COLORS.blue}" />
          <path d="M33 36 L38 41 L47 31" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
          <text x="74" y="43" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Enterprise Desktop Console &amp; Real-Time Analytics</text>
        </g>

        <g transform="translate(0, 92)">
          <rect width="940" height="72" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.5" />
          <circle cx="40" cy="36" r="16" fill="${COLORS.blue}" />
          <path d="M33 36 L38 41 L47 31" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
          <text x="74" y="43" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Sub-Second CO2, Toxic Gas &amp; Hazardous Spike Alerts</text>
        </g>

        <g transform="translate(0, 184)">
          <rect width="940" height="72" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.5" />
          <circle cx="40" cy="36" r="16" fill="${COLORS.blue}" />
          <path d="M33 36 L38 41 L47 31" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
          <text x="74" y="43" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Hardware-Encrypted ESP32 Decentralized Mesh Nodes</text>
        </g>

        <g transform="translate(0, 276)">
          <rect width="940" height="72" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.5" />
          <circle cx="40" cy="36" r="16" fill="${COLORS.blue}" />
          <path d="M33 36 L38 41 L47 31" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
          <text x="74" y="43" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Zero Cloud Lock-in &#8226; Edge-First Offline Resilient Storage</text>
        </g>
      </g>
    </g>

    <!-- SECTION 4: HIGH-CONTRAST 2X6FT FOOTER -->
    <g transform="translate(0, 3080)">
      <rect width="${W}" height="520" fill="${COLORS.slateDark}" />
      <rect width="${W}" height="8" fill="${COLORS.blue}" />

      <!-- Footer Brand Info -->
      <g transform="translate(100, 70)">
        <g transform="scale(0.85)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="rgba(255,255,255,0.15)" stroke="#ffffff" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="#ffffff" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="#ffffff" />
          <path d="M40 47 V56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <g transform="translate(80, 16) scale(0.046)">
          <path d="${wordmark.d}" fill="#ffffff" />
        </g>
        <text x="0" y="96" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="16" fill="#94a3b8">
          Next-Generation IoT Environmental Monitoring &amp; Telemetry Infrastructure.
        </text>
      </g>

      <!-- 4-Item Contact Grid -->
      <g transform="translate(100, 215)">
        <!-- Grid Item 1: Web -->
        <g transform="translate(0, 0)">
          <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M14 24 A10 10 0 1 0 34 24 A10 10 0 1 0 14 24 M14 24 H34 M24 14 A14 10 0 0 0 24 34 M24 14 A14 10 0 0 1 24 34" fill="none" stroke="${COLORS.blue}" stroke-width="1.8" />
          <text x="60" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" letter-spacing="1">MAIN WEBSITE</text>
          <text x="60" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">sentinel.io</text>
        </g>

        <!-- Grid Item 2: Cloud Portal -->
        <g transform="translate(540, 0)">
          <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M19 14 L29 24 L19 34 M27 24 H14" fill="none" stroke="${COLORS.blue}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="60" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" letter-spacing="1">FLEET CLOUD PORTAL</text>
          <text x="60" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">app.sentinel.io</text>
        </g>

        <!-- Grid Item 3: GitHub Core -->
        <g transform="translate(0, 95)">
          <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M17 29 V25 A4 4 0 0 1 21 21 H27 A4 4 0 0 1 31 25 V29 M21 17 A3 3 0 1 0 27 17 A3 3 0 1 0 21 17" fill="none" stroke="${COLORS.blue}" stroke-width="1.8" />
          <text x="60" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" letter-spacing="1">OPEN SOURCE CORE</text>
          <text x="60" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">github.com/sentinel/core</text>
        </g>

        <!-- Grid Item 4: Technical Docs -->
        <g transform="translate(540, 95)">
          <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M17 17 H29 M17 22 H29 M17 27 H24 M15 13 H31 A2 2 0 0 1 33 15 V31 A2 2 0 0 1 31 33 H15 A2 2 0 0 1 13 31 V15 A2 2 0 0 1 15 13 Z" fill="none" stroke="${COLORS.blue}" stroke-width="1.8" />
          <text x="60" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" letter-spacing="1">DEVELOPER &amp; API DOCS</text>
          <text x="60" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">docs.sentinel.io</text>
        </g>
      </g>

      <!-- Bottom Dimension Pill -->
      <g transform="translate(100, 455)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="#64748b" letter-spacing="1">
          DIMENSIONS: 2 FT &#215; 6 FT (24&#8243; &#215; 72&#8243; &#8226; 60.96 CM &#215; 182.88 CM) &#8226; 1:3 ASPECT RATIO ROLLUP STANDEE
        </text>
      </g>
    </g>
  </svg>`;
}

// BANNER 2: 2ft x 6ft Dual Floating Smartphones (Mobile App & Fleet Devices)
function getBanner2x6ftMobileSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bg2x6Mob" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="14%" stop-color="#f0f5ff" />
        <stop offset="45%" stop-color="#ffffff" />
        <stop offset="82%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>

      <filter id="shadowDual" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="36" stdDeviation="38" flood-color="#0f172a" flood-opacity="0.25" />
      </filter>

      <clipPath id="phoneClip1">
        <rect width="390" height="844" rx="42" />
      </clipPath>
      <clipPath id="phoneClip2">
        <rect width="390" height="844" rx="42" />
      </clipPath>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#bg2x6Mob)" />

    <!-- Sensor Waves -->
    <g opacity="0.32">
      <circle cx="600" cy="1200" r="500" fill="none" stroke="${COLORS.blue}" stroke-width="1.2" stroke-dasharray="8 10" />
      <circle cx="600" cy="1200" r="720" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="10 14" opacity="0.6" />
      <circle cx="600" cy="1200" r="950" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="12 18" opacity="0.3" />
    </g>

    <!-- TOP BRAND HEADER -->
    <g transform="translate(0, 130)">
      <g transform="translate(600, 0)">
        <g transform="translate(-88, 0) scale(2.2)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="${COLORS.blue}" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
          <path d="M40 47 V56" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <g transform="translate(-270, 195) scale(0.105)">
          <path d="${wordmark.d}" fill="${COLORS.dark}" />
        </g>
      </g>
      <g transform="translate(390, 310)">
        <rect width="420" height="46" rx="23" fill="${COLORS.lightBlue}" stroke="#c7d9fc" stroke-width="1.5" />
        <circle cx="26" cy="23" r="5.5" fill="${COLORS.blue}" />
        <text x="44" y="30" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.blue}" letter-spacing="2">MOBILE TELEMETRY &#8226; 2FT &#215; 6FT</text>
      </g>
    </g>

    <!-- CENTERPIECE: DUAL REAL SMARTPHONES (Angled Fleet Devices + Foreground Live Dashboard) -->
    <g transform="translate(0, 560)">
      <!-- Background Angled Phone: Device Fleet -->
      <g transform="translate(560, 60) scale(1.18)" filter="url(#shadowDual)">
        <rect x="-16" y="-16" width="422" height="876" rx="54" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <g clip-path="url(#phoneClip1)">
          <image href="data:image/png;base64,${mobileDevicesBase64}" x="0" y="0" width="390" height="844" />
        </g>
        <rect x="${(390 - 120) / 2}" y="12" width="120" height="30" rx="15" fill="#000000" />
      </g>

      <!-- Foreground Phone: Live Dashboard Telemetry -->
      <g transform="translate(180, 220) scale(1.24)" filter="url(#shadowDual)">
        <rect x="-16" y="-16" width="422" height="876" rx="54" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <g clip-path="url(#phoneClip2)">
          <image href="data:image/png;base64,${mobileBase64}" x="0" y="0" width="390" height="844" />
        </g>
        <rect x="${(390 - 120) / 2}" y="12" width="120" height="30" rx="15" fill="#000000" />
        <circle cx="${(390 - 120) / 2 + 95}" cy="27" r="4.5" fill="#1e293b" />
      </g>
    </g>

    <!-- SECTION 3: BOLD HEADLINE & VALUE PROPOSITION -->
    <g transform="translate(0, 1960)">
      <g transform="translate(600, 0)">
        <g transform="translate(-230, 0)">
          <rect width="460" height="50" rx="25" fill="${COLORS.dark}" />
          <circle cx="26" cy="25" r="6.5" fill="${COLORS.blue}" />
          <text x="46" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#ffffff" letter-spacing="2">REAL-TIME FIELD TELEMETRY</text>
        </g>
      </g>

      <g transform="translate(600, 150)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="90" fill="${COLORS.dark}" text-anchor="middle" letter-spacing="-1.5">MONITORING</text>
        <text x="0" y="96" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="90" fill="${COLORS.blue}" text-anchor="middle" letter-spacing="-1.5">FOR ALL</text>
      </g>

      <g transform="translate(600, 310)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="24" fill="${COLORS.grayText}" text-anchor="middle">
          Live environmental monitoring &amp; instant field anomaly alerts.
        </text>
        <text x="0" y="36" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="24" fill="${COLORS.grayText}" text-anchor="middle">
          Tamper-evident audit logs &amp; decentralized ESP32 telemetry mesh.
        </text>
      </g>

      <!-- Checklist -->
      <g transform="translate(130, 420)">
        <g transform="translate(0, 0)">
          <rect width="940" height="72" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.5" />
          <circle cx="40" cy="36" r="16" fill="${COLORS.blue}" />
          <path d="M33 36 L38 41 L47 31" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
          <text x="74" y="43" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Real-Time CO2, Temperature &amp; Humidity Telemetry</text>
        </g>

        <g transform="translate(0, 92)">
          <rect width="940" height="72" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.5" />
          <circle cx="40" cy="36" r="16" fill="${COLORS.blue}" />
          <path d="M33 36 L38 41 L47 31" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
          <text x="74" y="43" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Instant Dangerous Spike &amp; Threshold Incident Alerts</text>
        </g>

        <g transform="translate(0, 184)">
          <rect width="940" height="72" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.5" />
          <circle cx="40" cy="36" r="16" fill="${COLORS.blue}" />
          <path d="M33 36 L38 41 L47 31" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
          <text x="74" y="43" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Decentralized ESP32 Hardware-Encrypted Mesh Nodes</text>
        </g>

        <g transform="translate(0, 276)">
          <rect width="940" height="72" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.5" />
          <circle cx="40" cy="36" r="16" fill="${COLORS.blue}" />
          <path d="M33 36 L38 41 L47 31" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
          <text x="74" y="43" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Zero Cloud Lock-in &#8226; Edge-First Offline Resilient Storage</text>
        </g>
      </g>
    </g>

    <!-- SECTION 4: FOOTER -->
    <g transform="translate(0, 3080)">
      <rect width="${W}" height="520" fill="${COLORS.slateDark}" />
      <rect width="${W}" height="8" fill="${COLORS.blue}" />

      <g transform="translate(100, 70)">
        <g transform="scale(0.85)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="rgba(255,255,255,0.15)" stroke="#ffffff" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="#ffffff" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="#ffffff" />
          <path d="M40 47 V56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <g transform="translate(80, 16) scale(0.046)">
          <path d="${wordmark.d}" fill="#ffffff" />
        </g>
        <text x="0" y="96" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="16" fill="#94a3b8">
          Next-Generation IoT Environmental Monitoring &amp; Telemetry Infrastructure.
        </text>
      </g>

      <g transform="translate(100, 215)">
        <g transform="translate(0, 0)">
          <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M14 24 A10 10 0 1 0 34 24 A10 10 0 1 0 14 24 M14 24 H34 M24 14 A14 10 0 0 0 24 34 M24 14 A14 10 0 0 1 24 34" fill="none" stroke="${COLORS.blue}" stroke-width="1.8" />
          <text x="60" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" letter-spacing="1">MAIN WEBSITE</text>
          <text x="60" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">sentinel.io</text>
        </g>
        <g transform="translate(540, 0)">
          <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M19 14 L29 24 L19 34 M27 24 H14" fill="none" stroke="${COLORS.blue}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="60" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" letter-spacing="1">FLEET CLOUD PORTAL</text>
          <text x="60" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">app.sentinel.io</text>
        </g>
        <g transform="translate(0, 95)">
          <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M17 29 V25 A4 4 0 0 1 21 21 H27 A4 4 0 0 1 31 25 V29 M21 17 A3 3 0 1 0 27 17 A3 3 0 1 0 21 17" fill="none" stroke="${COLORS.blue}" stroke-width="1.8" />
          <text x="60" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" letter-spacing="1">OPEN SOURCE CORE</text>
          <text x="60" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">github.com/sentinel/core</text>
        </g>
        <g transform="translate(540, 95)">
          <circle cx="24" cy="24" r="22" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M17 17 H29 M17 22 H29 M17 27 H24 M15 13 H31 A2 2 0 0 1 33 15 V31 A2 2 0 0 1 31 33 H15 A2 2 0 0 1 13 31 V15 A2 2 0 0 1 15 13 Z" fill="none" stroke="${COLORS.blue}" stroke-width="1.8" />
          <text x="60" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#94a3b8" letter-spacing="1">DEVELOPER &amp; API DOCS</text>
          <text x="60" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">docs.sentinel.io</text>
        </g>
      </g>

      <g transform="translate(100, 455)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="#64748b" letter-spacing="1">
          DIMENSIONS: 2 FT &#215; 6 FT (24&#8243; &#215; 72&#8243; &#8226; 60.96 CM &#215; 182.88 CM) &#8226; 1:3 ASPECT RATIO ROLLUP STANDEE
        </text>
      </g>
    </g>
  </svg>`;
}

async function main() {
  console.log('Building 2ft x 6ft (24" x 72" / 1:3 ratio) Banners...');

  // 1. Desktop Edition (1200 x 3600 vector, 2400 x 7200 high-res PNG)
  const deskSvg = getBanner2x6ftDesktopSvg();
  const deskSvgPath = path.join(rollupDir, 'sentinel-banner-2x6ft-desktop.svg');
  const deskPngPath = path.join(rollupDir, 'sentinel-banner-2x6ft-desktop.png');
  fs.writeFileSync(deskSvgPath, deskSvg, 'utf8');
  console.log('Rendering 2ft x 6ft Desktop Banner PNG (2400 x 7200)...');
  await sharp(Buffer.from(deskSvg)).resize(2400, 7200).png().toFile(deskPngPath);
  fs.copyFileSync(deskSvgPath, path.join(publicRollupDir, 'sentinel-banner-2x6ft-desktop.svg'));
  fs.copyFileSync(deskPngPath, path.join(publicRollupDir, 'sentinel-banner-2x6ft-desktop.png'));

  // 2. Mobile Edition (1200 x 3600 vector, 2400 x 7200 high-res PNG)
  const mobSvg = getBanner2x6ftMobileSvg();
  const mobSvgPath = path.join(rollupDir, 'sentinel-banner-2x6ft-mobile.svg');
  const mobPngPath = path.join(rollupDir, 'sentinel-banner-2x6ft-mobile.png');
  fs.writeFileSync(mobSvgPath, mobSvg, 'utf8');
  console.log('Rendering 2ft x 6ft Mobile Banner PNG (2400 x 7200)...');
  await sharp(Buffer.from(mobSvg)).resize(2400, 7200).png().toFile(mobPngPath);
  fs.copyFileSync(mobSvgPath, path.join(publicRollupDir, 'sentinel-banner-2x6ft-mobile.svg'));
  fs.copyFileSync(mobPngPath, path.join(publicRollupDir, 'sentinel-banner-2x6ft-mobile.png'));

  console.log('Both 2ft x 6ft banners generated successfully!');
}

main().catch(console.error);
