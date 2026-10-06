const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseDir = path.resolve(__dirname, '..', 'canva-bunting-assets', '07_rollup_banner');
fs.mkdirSync(baseDir, { recursive: true });

const publicBuntingDir = path.resolve(__dirname, '..', 'public', 'branding', 'bunting');
fs.mkdirSync(publicBuntingDir, { recursive: true });

// Load Satoshi glyphs
const glyphData = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_glyphs.json'), 'utf8'));
const { wordmark, letters } = glyphData;

const COLORS = {
  blue: '#2f6fed',
  lightBlue: '#f0f5ff',
  dark: '#18181b',
  slateDark: '#0f172a',
  white: '#ffffff',
  offWhite: '#fafafa',
  grayText: '#71717a',
  lightGray: '#f4f4f5',
  border: '#e4e4e7',
  green: '#16a34a',
  greenBg: '#dcfce7',
  amber: '#f59e0b',
  red: '#ef4444'
};

// Phone Screen 1: Dashboard
function getPhoneDashboardContent(w = 375, h = 812) {
  return `
  <!-- Status bar -->
  <g transform="translate(24, 18)">
    <text x="0" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="#000000">10:38</text>
    <!-- Battery & WiFi -->
    <g transform="translate(${w - 80}, 2)">
      <!-- WiFi -->
      <path d="M0 12 A10 10 0 0 1 14 12 M2 9 A7 7 0 0 1 12 9 M5 6 A3 3 0 0 1 9 6 M7 3 A1 1 0 0 1 7 3.5" fill="none" stroke="#000000" stroke-width="1.6" stroke-linecap="round" />
      <!-- Battery -->
      <rect x="22" y="2" width="22" height="11" rx="3" fill="none" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="4" width="15" height="7" rx="1.5" fill="#000000" />
      <path d="M45 5.5 V9.5" stroke="#000000" stroke-width="1.6" stroke-linecap="round" />
    </g>
  </g>

  <!-- App Header -->
  <g transform="translate(24, 56)">
    <!-- Mini Logo -->
    <g transform="translate(0, 0) scale(0.35)">
      <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="${COLORS.blue}" stroke-width="4" />
      <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z" fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
      <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
      <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
    </g>
    <g transform="translate(36, 6) scale(0.024)">
      <path d="${wordmark.d}" fill="${COLORS.dark}" />
    </g>
    <!-- Live Badge -->
    <g transform="translate(${w - 110}, 2)">
      <rect width="62" height="24" rx="12" fill="${COLORS.greenBg}" />
      <circle cx="12" cy="12" r="4" fill="${COLORS.green}" />
      <text x="22" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.green}" letter-spacing="0.5">LIVE</text>
    </g>
  </g>

  <!-- Title & Location -->
  <g transform="translate(24, 110)">
    <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Environmental Health</text>
    <text x="0" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">ESP32-Node 1A2B &#8226; Primary Lab</text>
  </g>

  <!-- Primary Stat Card (Gas / Air Quality) -->
  <g transform="translate(24, 150)">
    <rect width="${w - 48}" height="145" rx="18" fill="${COLORS.lightBlue}" stroke="#c7d9fc" stroke-width="1" />
    <g transform="translate(18, 18)">
      <text x="0" y="12" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}" letter-spacing="1">AIR / GAS METRICS</text>
      <text x="0" y="52" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="40" fill="${COLORS.dark}">524 <tspan font-size="18" font-weight="600" fill="${COLORS.grayText}">ppm</tspan></text>
      
      <!-- Safe pill -->
      <g transform="translate(0, 68)">
        <rect width="78" height="22" rx="11" fill="#dcfce7" />
        <text x="10" y="15" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#16a34a">✓ NORMAL</text>
      </g>
      <text x="90" y="83" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">MQ-2 Sensor &#8226; Safe Atmosphere</text>
    </g>
  </g>

  <!-- Two Column Stats (Temp & Humidity) -->
  <g transform="translate(24, 310)">
    <!-- Temp Card -->
    <rect x="0" y="0" width="${(w - 60)/2}" height="100" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.2" />
    <g transform="translate(16, 18)">
      <text x="0" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.grayText}">TEMPERATURE</text>
      <text x="0" y="42" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="26" fill="${COLORS.dark}">24.4°C</text>
      <text x="0" y="64" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.green}">Optimal Comfort</text>
    </g>

    <!-- Humidity Card -->
    <rect x="${(w - 60)/2 + 12}" y="0" width="${(w - 60)/2}" height="100" rx="16" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.2" />
    <g transform="translate(${(w - 60)/2 + 28}, 18)">
      <text x="0" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.grayText}">HUMIDITY</text>
      <text x="0" y="42" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="26" fill="${COLORS.dark}">48.1%</text>
      <text x="0" y="64" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.blue}">Stable Baseline</text>
    </g>
  </g>

  <!-- Telemetry Chart Card -->
  <g transform="translate(24, 425)">
    <rect width="${w - 48}" height="195" rx="18" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.2" />
    <g transform="translate(18, 18)">
      <text x="0" y="12" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.dark}">Real-Time Telemetry Stream</text>
      <text x="0" y="28" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="11" fill="${COLORS.grayText}">10-minute live rolling window</text>

      <!-- Chart Graph Area -->
      <g transform="translate(0, 40)">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${COLORS.blue}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="${COLORS.blue}" stop-opacity="0.0" />
          </linearGradient>
        </defs>
        <!-- Horizontal gridlines -->
        <line x1="0" y1="20" x2="${w - 84}" y2="20" stroke="#f4f4f5" stroke-width="1" />
        <line x1="0" y1="50" x2="${w - 84}" y2="50" stroke="#f4f4f5" stroke-width="1" />
        <line x1="0" y1="80" x2="${w - 84}" y2="80" stroke="#f4f4f5" stroke-width="1" />

        <!-- Shaded Area -->
        <path d="M 0 65 Q 40 45 80 52 T 160 38 T 240 25 T ${w - 84} 15 L ${w - 84} 95 L 0 95 Z" fill="url(#chartGrad)" />
        <!-- Trend Curve -->
        <path d="M 0 65 Q 40 45 80 52 T 160 38 T 240 25 T ${w - 84} 15" fill="none" stroke="${COLORS.blue}" stroke-width="3" stroke-linecap="round" />

        <!-- Current point pulse -->
        <circle cx="${w - 84}" cy="15" r="5" fill="${COLORS.blue}" />
        <circle cx="${w - 84}" cy="15" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" opacity="0.5" />

        <!-- X Axis labels -->
        <text x="0" y="112" font-family="-apple-system, sans-serif" font-size="10" fill="#a1a1aa">10:28</text>
        <text x="${(w - 84)/2}" y="112" font-family="-apple-system, sans-serif" font-size="10" fill="#a1a1aa" text-anchor="middle">10:33</text>
        <text x="${w - 84}" y="112" font-family="-apple-system, sans-serif" font-size="10" fill="${COLORS.blue}" font-weight="700" text-anchor="end">Now</text>
      </g>
    </g>
  </g>

  <!-- Bottom Navigation Bar -->
  <g transform="translate(0, ${h - 84})">
    <rect width="${w}" height="84" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1" />
    <!-- 4 Nav Icons -->
    <g transform="translate(40, 20)">
      <circle cx="12" cy="12" r="10" fill="${COLORS.lightBlue}" />
      <circle cx="12" cy="12" r="4" fill="${COLORS.blue}" />
      <text x="12" y="32" font-family="Arial, sans-serif" font-size="10" font-weight="700" fill="${COLORS.blue}" text-anchor="middle">Overview</text>
    </g>
    <g transform="translate(125, 20)">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="${COLORS.grayText}" stroke-width="2" />
      <text x="12" y="32" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="${COLORS.grayText}" text-anchor="middle">Devices</text>
    </g>
    <g transform="translate(210, 20)">
      <path d="M4 16 L10 8 L16 13 L22 4" fill="none" stroke="${COLORS.grayText}" stroke-width="2" stroke-linecap="round" />
      <text x="12" y="32" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="${COLORS.grayText}" text-anchor="middle">History</text>
    </g>
    <g transform="translate(295, 20)">
      <circle cx="12" cy="10" r="6" fill="none" stroke="${COLORS.grayText}" stroke-width="2" />
      <path d="M4 22 C4 18 8 16 12 16 C16 16 20 18 20 22" fill="none" stroke="${COLORS.grayText}" stroke-width="2" />
      <text x="12" y="32" font-family="Arial, sans-serif" font-size="10" font-weight="500" fill="${COLORS.grayText}" text-anchor="middle">Settings</text>
    </g>
    <!-- Home indicator line -->
    <rect x="${(w - 134)/2}" y="70" width="134" height="5" rx="2.5" fill="#000000" />
  </g>
  `;
}

// Phone Screen 2: Fleet & Device Management
function getPhoneDevicesContent(w = 375, h = 812) {
  return `
  <!-- Status bar -->
  <g transform="translate(24, 18)">
    <text x="0" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#000000">10:38</text>
    <g transform="translate(${w - 80}, 2)">
      <path d="M0 12 A10 10 0 0 1 14 12 M2 9 A7 7 0 0 1 12 9 M5 6 A3 3 0 0 1 9 6 M7 3 A1 1 0 0 1 7 3.5" fill="none" stroke="#000000" stroke-width="1.6" stroke-linecap="round" />
      <rect x="22" y="2" width="22" height="11" rx="3" fill="none" stroke="#000000" stroke-width="1.6" />
      <rect x="24" y="4" width="15" height="7" rx="1.5" fill="#000000" />
      <path d="M45 5.5 V9.5" stroke="#000000" stroke-width="1.6" stroke-linecap="round" />
    </g>
  </g>

  <!-- App Header -->
  <g transform="translate(24, 56)">
    <text x="0" y="22" font-family="-apple-system, sans-serif" font-weight="800" font-size="24" fill="${COLORS.dark}">Device Fleet</text>
    <g transform="translate(${w - 110}, 4)">
      <rect width="62" height="24" rx="12" fill="${COLORS.lightBlue}" />
      <text x="31" y="16" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}" text-anchor="middle">3 ACTIVE</text>
    </g>
  </g>

  <!-- Device 1 Card -->
  <g transform="translate(24, 105)">
    <rect width="${w - 48}" height="100" rx="18" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.2" />
    <g transform="translate(16, 18)">
      <circle cx="16" cy="16" r="16" fill="${COLORS.lightBlue}" />
      <g transform="translate(6, 6) scale(0.25)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="${COLORS.blue}" stroke-width="4" />
        <circle cx="40" cy="36" r="8" fill="${COLORS.blue}" />
      </g>
      <text x="44" y="14" font-family="-apple-system, sans-serif" font-weight="700" font-size="14" fill="${COLORS.dark}">Sentinel Node #1</text>
      <text x="44" y="30" font-family="-apple-system, sans-serif" font-weight="500" font-size="12" fill="${COLORS.grayText}">ESP32 &#8226; Chemistry Laboratory</text>
      
      <g transform="translate(0, 52)">
        <circle cx="6" cy="6" r="4" fill="${COLORS.green}" />
        <text x="16" y="10" font-family="-apple-system, sans-serif" font-weight="600" font-size="11" fill="${COLORS.green}">Online &#8226; 98% WiFi &#8226; 0 Alerts</text>
      </g>
    </g>
  </g>

  <!-- Device 2 Card -->
  <g transform="translate(24, 220)">
    <rect width="${w - 48}" height="100" rx="18" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.2" />
    <g transform="translate(16, 18)">
      <circle cx="16" cy="16" r="16" fill="${COLORS.lightBlue}" />
      <g transform="translate(6, 6) scale(0.25)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="${COLORS.blue}" stroke-width="4" />
        <circle cx="40" cy="36" r="8" fill="${COLORS.blue}" />
      </g>
      <text x="44" y="14" font-family="-apple-system, sans-serif" font-weight="700" font-size="14" fill="${COLORS.dark}">Sentinel Node #2</text>
      <text x="44" y="30" font-family="-apple-system, sans-serif" font-weight="500" font-size="12" fill="${COLORS.grayText}">ESP32 &#8226; Server Equipment Room</text>
      
      <g transform="translate(0, 52)">
        <circle cx="6" cy="6" r="4" fill="${COLORS.green}" />
        <text x="16" y="10" font-family="-apple-system, sans-serif" font-weight="600" font-size="11" fill="${COLORS.green}">Online &#8226; 100% WiFi &#8226; Normal</text>
      </g>
    </g>
  </g>

  <!-- Device 3 Card -->
  <g transform="translate(24, 335)">
    <rect width="${w - 48}" height="100" rx="18" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1.2" />
    <g transform="translate(16, 18)">
      <circle cx="16" cy="16" r="16" fill="${COLORS.lightBlue}" />
      <g transform="translate(6, 6) scale(0.25)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="${COLORS.blue}" stroke-width="4" />
        <circle cx="40" cy="36" r="8" fill="${COLORS.blue}" />
      </g>
      <text x="44" y="14" font-family="-apple-system, sans-serif" font-weight="700" font-size="14" fill="${COLORS.dark}">Sentinel Node #3</text>
      <text x="44" y="30" font-family="-apple-system, sans-serif" font-weight="500" font-size="12" fill="${COLORS.grayText}">ESP32 &#8226; Manufacturing Floor</text>
      
      <g transform="translate(0, 52)">
        <circle cx="6" cy="6" r="4" fill="${COLORS.green}" />
        <text x="16" y="10" font-family="-apple-system, sans-serif" font-weight="600" font-size="11" fill="${COLORS.green}">Online &#8226; 94% WiFi &#8226; Normal</text>
      </g>
    </g>
  </g>

  <!-- Security / Audit Banner -->
  <g transform="translate(24, 455)">
    <rect width="${w - 48}" height="140" rx="18" fill="${COLORS.slateDark}" />
    <g transform="translate(20, 24)">
      <text x="0" y="14" font-family="-apple-system, sans-serif" font-weight="700" font-size="13" fill="${COLORS.blue}">ENTERPRISE HARDWARE ENCRYPTION</text>
      <text x="0" y="44" font-family="-apple-system, sans-serif" font-weight="800" font-size="16" fill="#ffffff">Automated Safety Cutoff &amp; Buzzer</text>
      <text x="0" y="68" font-family="-apple-system, sans-serif" font-weight="400" font-size="12" fill="#94a3b8">Instant audio-visual alarms on threshold breach</text>
      <g transform="translate(0, 84)">
        <circle cx="6" cy="6" r="4" fill="${COLORS.green}" />
        <text x="16" y="10" font-family="-apple-system, sans-serif" font-weight="600" font-size="11" fill="${COLORS.green}">All 3 Relays Armed &amp; Ready</text>
      </g>
    </g>
  </g>

  <!-- Bottom Nav -->
  <g transform="translate(0, ${h - 84})">
    <rect width="${w}" height="84" fill="#ffffff" stroke="${COLORS.border}" stroke-width="1" />
    <rect x="${(w - 134)/2}" y="70" width="134" height="5" rx="2.5" fill="#000000" />
  </g>
  `;
}

// Render Smartphone Chassis
function getPhoneMockupSvg(contentFn, scale = 1) {
  const phoneW = 385;
  const phoneH = 820;
  return `
  <g filter="url(#phoneShadow)">
    <!-- Outer Titanium Chassis -->
    <rect width="${phoneW}" height="${phoneH}" rx="52" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
    <!-- Metallic Rim Highlight -->
    <rect x="3" y="3" width="${phoneW - 6}" height="${phoneH - 6}" rx="49" fill="none" stroke="#475569" stroke-width="1.5" />
    <!-- Screen Bezel -->
    <rect x="7" y="7" width="${phoneW - 14}" height="${phoneH - 14}" rx="46" fill="#000000" />
    
    <!-- Screen Surface (White canvas) -->
    <g transform="translate(10, 10)">
      <clipPath id="screenClip">
        <rect width="${phoneW - 20}" height="${phoneH - 20}" rx="42" />
      </clipPath>
      <g clip-path="url(#screenClip)">
        <rect width="${phoneW - 20}" height="${phoneH - 20}" fill="#fafafa" />
        ${contentFn(phoneW - 20, phoneH - 20)}

        <!-- Dynamic Island Pill -->
        <rect x="${(phoneW - 20 - 110)/2}" y="11" width="110" height="30" rx="15" fill="#000000" />
        <!-- Camera sensor dots -->
        <circle cx="${(phoneW - 20 - 110)/2 + 88}" cy="26" r="4.5" fill="#111827" stroke="#1f2937" stroke-width="1" />
        <circle cx="${(phoneW - 20 - 110)/2 + 25}" cy="26" r="3.5" fill="#0f172a" />
      </g>
    </g>
  </g>`;
}

// Complete Rollup Banner
function getRollupBannerSvg(w = 1200, h = 2800) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <!-- Heavy 3D Drop Shadow for Phones -->
    <filter id="phoneShadow" x="-20%" y="-10%" width="150%" height="130%">
      <feDropShadow dx="0" dy="30" stdDeviation="35" flood-color="#0f172a" flood-opacity="0.22" />
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#0f172a" flood-opacity="0.15" />
    </filter>
    <filter id="cardGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="${COLORS.blue}" flood-opacity="0.12" />
    </filter>
    <!-- Background subtle gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#f8faff" />
      <stop offset="70%" stop-color="#f0f4fd" />
      <stop offset="100%" stop-color="#e8effc" />
    </linearGradient>
  </defs>

  <!-- Banner Background -->
  <rect width="${w}" height="${h}" fill="url(#bgGrad)" />

  <!-- Subtle Studio Grid pattern at top -->
  <g opacity="0.04" stroke="#18181b" stroke-width="1">
    ${Array.from({ length: 20 }).map((_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="1000" />`).join('')}
    ${Array.from({ length: 18 }).map((_, i) => `<line x1="0" y1="${i * 60}" x2="${w}" y2="${i * 60}" />`).join('')}
  </g>

  <!-- Sensor Mesh Ambient Graphic (Upper right background) -->
  <g transform="translate(680, 80) scale(1.1)" opacity="0.45">
    <line x1="90" y1="80" x2="260" y2="60" stroke="${COLORS.blue}" stroke-width="2" />
    <line x1="90" y1="80" x2="190" y2="190" stroke="${COLORS.blue}" stroke-width="2" />
    <line x1="260" y1="60" x2="340" y2="170" stroke="${COLORS.blue}" stroke-width="2" />
    <line x1="190" y1="190" x2="340" y2="170" stroke="${COLORS.blue}" stroke-width="2" />
    <line x1="190" y1="190" x2="120" y2="280" stroke="${COLORS.blue}" stroke-width="2" />
    <line x1="340" y1="170" x2="300" y2="300" stroke="${COLORS.blue}" stroke-width="2" />
    <line x1="120" y1="280" x2="300" y2="300" stroke="${COLORS.blue}" stroke-width="2" />
    <circle cx="90" cy="80" r="7" fill="${COLORS.blue}" />
    <circle cx="260" cy="60" r="7" fill="${COLORS.blue}" />
    <circle cx="190" cy="190" r="16" fill="none" stroke="${COLORS.blue}" stroke-width="2" />
    <circle cx="190" cy="190" r="8" fill="${COLORS.blue}" />
    <circle cx="340" cy="170" r="7" fill="${COLORS.blue}" />
    <circle cx="120" cy="280" r="7" fill="${COLORS.blue}" />
    <circle cx="300" cy="300" r="7" fill="${COLORS.blue}" />
  </g>

  <!-- ================= TOP HERO: LOGO & BRAND ================= -->
  <g transform="translate(600, 160)">
    <!-- Shield Logo Emblem (Large, Centered) -->
    <g transform="translate(-110, 0) scale(2.75)">
      <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
            fill="none" stroke="${COLORS.blue}" stroke-width="4" stroke-linejoin="round" />
      <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
            fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
      <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
      <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
      <path d="M40 47 V56" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />
    </g>

    <!-- "SENTINEL" Wordmark in Satoshi Bold vector curves -->
    <g transform="translate(-380, 270) scale(0.148)">
      <path d="${wordmark.d}" fill="${COLORS.dark}" />
    </g>

    <!-- Subtitle descriptor -->
    <text x="0" y="440" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="24" fill="${COLORS.blue}" letter-spacing="4" text-anchor="middle">REAL-TIME ENVIRONMENTAL &amp; SAFETY MONITORING</text>
  </g>

  <!-- ================= MIDDLE HERO: OVERLAPPING SMARTPHONES ================= -->
  <!-- Exactly matching the reference composition:
       - Phone 2 (Fleet / Devices screen) in the background, shifted slightly to the right
       - Phone 1 (Live telemetry dashboard) in the foreground, angled / shifted left
  -->
  <g transform="translate(100, 680)">
    <!-- Background Phone: Fleet & Hardware Health -->
    <g transform="translate(420, 100) scale(1.45)">
      ${getPhoneMockupSvg(getPhoneDevicesContent)}
    </g>

    <!-- Foreground Phone: Live Real-time Dashboard -->
    <g transform="translate(60, 220) scale(1.5)">
      ${getPhoneMockupSvg(getPhoneDashboardContent)}
    </g>
  </g>

  <!-- ================= LOWER SECTION: BOLD HEADLINE ================= -->
  <!-- Exactly matching "Fishing For All" from the reference banner! -->
  <g transform="translate(600, 2240)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="78" fill="${COLORS.dark}" letter-spacing="-1" text-anchor="middle">Monitoring For All</text>
    <text x="0" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="28" fill="${COLORS.blue}" letter-spacing="0.5" text-anchor="middle">Smart Gas, Temperature &amp; Humidity Protection</text>
  </g>

  <!-- ================= FOOTER BAR: CONTACT & SOCIAL CHANNELS ================= -->
  <!-- Solid deep brand background matching reference footer -->
  <g transform="translate(0, 2380)">
    <!-- Dark Slate Footer Base -->
    <rect width="${w}" height="420" fill="${COLORS.slateDark}" />
    
    <!-- Subtle top accent line -->
    <line x1="0" y1="0" x2="${w}" y2="0" stroke="${COLORS.blue}" stroke-width="4" />

    <!-- 4 Social & Web Handles (2x2 Grid exactly like reference) -->
    <!-- Column 1: Website -->
    <g transform="translate(140, 110)">
      <!-- Globe Icon -->
      <circle cx="36" cy="36" r="32" fill="rgba(47, 111, 237, 0.2)" stroke="${COLORS.blue}" stroke-width="2" />
      <g transform="translate(20, 20)">
        <circle cx="16" cy="16" r="12" fill="none" stroke="#ffffff" stroke-width="2" />
        <line x1="4" y1="16" x2="28" y2="16" stroke="#ffffff" stroke-width="2" />
        <ellipse cx="16" cy="16" rx="6" ry="12" fill="none" stroke="#ffffff" stroke-width="2" />
      </g>
      <text x="88" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="34" fill="#ffffff">sentinel-iot.com</text>
    </g>

    <!-- Column 2: TikTok / Video -->
    <g transform="translate(680, 110)">
      <circle cx="36" cy="36" r="32" fill="rgba(47, 111, 237, 0.2)" stroke="${COLORS.blue}" stroke-width="2" />
      <g transform="translate(20, 20)">
        <path d="M18 6 V20 A6 6 0 1 1 12 14" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M18 10 C21 13 25 13 25 13" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
      </g>
      <text x="88" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="34" fill="#ffffff">@sentinel_iot</text>
    </g>

    <!-- Column 1, Row 2: Threads / Social -->
    <g transform="translate(140, 240)">
      <circle cx="36" cy="36" r="32" fill="rgba(47, 111, 237, 0.2)" stroke="${COLORS.blue}" stroke-width="2" />
      <g transform="translate(20, 20)">
        <path d="M16 8 C11 8 8 11 8 16 C8 21 11 24 16 24 C20 24 23 22 23 18 C23 15 20 13 16 13 C13 13 11 15 11 17 C11 19 13 20 16 20 C18 20 20 19 20 17" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
      </g>
      <text x="88" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="34" fill="#ffffff">@sentinel_iot</text>
    </g>

    <!-- Column 2, Row 2: Instagram / GitHub -->
    <g transform="translate(680, 240)">
      <circle cx="36" cy="36" r="32" fill="rgba(47, 111, 237, 0.2)" stroke="${COLORS.blue}" stroke-width="2" />
      <g transform="translate(20, 20)">
        <rect x="6" y="6" width="20" height="20" rx="6" fill="none" stroke="#ffffff" stroke-width="2.2" />
        <circle cx="16" cy="16" r="5" fill="none" stroke="#ffffff" stroke-width="2.2" />
        <circle cx="21.5" cy="10.5" r="1.2" fill="#ffffff" />
      </g>
      <text x="88" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="34" fill="#ffffff">@sentinel_iot</text>
    </g>
  </g>
</svg>`;
}

// Build Banner and Isolated Assets
async function buildBanner() {
  console.log('Building Sentinel Rollup Banner (reference-matched)...');

  const bannerSvg = getRollupBannerSvg(1200, 2800);
  const bannerSvgPath = path.join(baseDir, 'sentinel-rollup-banner.svg');
  const bannerPngPath = path.join(baseDir, 'sentinel-rollup-banner.png');

  fs.writeFileSync(bannerSvgPath, bannerSvg, 'utf8');
  fs.writeFileSync(path.join(publicBuntingDir, 'sentinel-rollup-banner.svg'), bannerSvg, 'utf8');

  console.log('Rendering 300-DPI high-res banner PNG...');
  await sharp(Buffer.from(bannerSvg))
    .resize({ width: 1200, height: 2800 })
    .png()
    .toFile(bannerPngPath);
  
  fs.copyFileSync(bannerPngPath, path.join(publicBuntingDir, 'sentinel-rollup-banner.png'));

  // Also build isolated phone mockups so the user can easily rearrange them in Canva!
  console.log('Generating isolated phone mockup assets...');
  
  // Isolated Phone 1 (Dashboard)
  const phone1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 950" width="1000" height="1900">
    <defs>
      <filter id="phoneShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.25" />
      </filter>
    </defs>
    <g transform="translate(50, 40)">
      ${getPhoneMockupSvg(getPhoneDashboardContent)}
    </g>
  </svg>`;
  fs.writeFileSync(path.join(baseDir, 'mockup-phone-dashboard.svg'), phone1Svg, 'utf8');
  await sharp(Buffer.from(phone1Svg)).resize(1000, 1900).png().toFile(path.join(baseDir, 'mockup-phone-dashboard.png'));

  // Isolated Phone 2 (Fleet Devices)
  const phone2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 950" width="1000" height="1900">
    <defs>
      <filter id="phoneShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.25" />
      </filter>
    </defs>
    <g transform="translate(50, 40)">
      ${getPhoneMockupSvg(getPhoneDevicesContent)}
    </g>
  </svg>`;
  fs.writeFileSync(path.join(baseDir, 'mockup-phone-devices.svg'), phone2Svg, 'utf8');
  await sharp(Buffer.from(phone2Svg)).resize(1000, 1900).png().toFile(path.join(baseDir, 'mockup-phone-devices.png'));

  // Both Phones Together (Transparent Background)
  const bothPhonesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1300" width="1500" height="1950">
    <defs>
      <filter id="phoneShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="30" stdDeviation="35" flood-color="#0f172a" flood-opacity="0.22" />
        <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#0f172a" flood-opacity="0.15" />
      </filter>
    </defs>
    <g transform="translate(0, 0)">
      <g transform="translate(380, 50) scale(1.35)">
        ${getPhoneMockupSvg(getPhoneDevicesContent)}
      </g>
      <g transform="translate(50, 160) scale(1.4)">
        ${getPhoneMockupSvg(getPhoneDashboardContent)}
      </g>
    </g>
  </svg>`;
  fs.writeFileSync(path.join(baseDir, 'mockup-dual-phones-transparent.svg'), bothPhonesSvg, 'utf8');
  await sharp(Buffer.from(bothPhonesSvg)).resize(1500, 1950).png().toFile(path.join(baseDir, 'mockup-dual-phones-transparent.png'));

  // Copy all assets to public/branding/bunting/07_rollup_banner
  const publicBannerDir = path.join(publicBuntingDir, '07_rollup_banner');
  fs.mkdirSync(publicBannerDir, { recursive: true });
  const bannerFiles = [
    'sentinel-rollup-banner.svg',
    'sentinel-rollup-banner.png',
    'mockup-phone-dashboard.svg',
    'mockup-phone-dashboard.png',
    'mockup-phone-devices.svg',
    'mockup-phone-devices.png',
    'mockup-dual-phones-transparent.svg',
    'mockup-dual-phones-transparent.png'
  ];
  for (const f of bannerFiles) {
    fs.copyFileSync(path.join(baseDir, f), path.join(publicBannerDir, f));
  }

  // Update CANVA_BUNTING_ASSET_HUB.html
  console.log('Updating CANVA_BUNTING_ASSET_HUB.html with Rollup Banner & Mockups...');
  const hubPath = path.resolve(__dirname, '..', 'canva-bunting-assets', 'CANVA_BUNTING_ASSET_HUB.html');
  const pubHubPath = path.resolve(__dirname, '..', 'public', 'branding', 'bunting', 'CANVA_BUNTING_ASSET_HUB.html');

  if (fs.existsSync(hubPath)) {
    let hubHtml = fs.readFileSync(hubPath, 'utf8');

    // Remove any previous 07_rollup_banner section if already added
    const bannerSectionMarker = '<!-- SECTION_07_BANNER_START -->';
    const bannerSectionEnd = '<!-- SECTION_07_BANNER_END -->';
    if (hubHtml.includes(bannerSectionMarker)) {
      const p1 = hubHtml.indexOf(bannerSectionMarker);
      const p2 = hubHtml.indexOf(bannerSectionEnd) + bannerSectionEnd.length;
      hubHtml = hubHtml.substring(0, p1) + hubHtml.substring(p2);
    }

    const bannerItemsHtml = `
    ${bannerSectionMarker}
    <div class="section-title" id="rollup-banner-section" style="margin-top: 48px; border-top: 2px solid var(--border); padding-top: 36px;">
      <div>
        <span style="display: flex; align-items: center; gap: 8px;">
          <span class="badge" style="margin-bottom: 0;">NEW</span>
          07 Rollup Standing Banner &amp; Phone Mockups
        </span>
        <p style="font-size: 14px; color: var(--gray); font-weight: normal; margin-top: 4px;">
          Inspired by event pull-up displays: Top Sentinel branding, floating dual smartphone mockups showing live gas &amp; telemetry data, bold headline, and contact footer. Standard 80&times;200cm (1200&times;2800px) ready for print or Canva editing.
        </p>
      </div>
      <span style="font-size: 14px; color: var(--gray); font-weight: 500;">4 banner assets</span>
    </div>

    <!-- Featured Banner Showcase -->
    <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 32px; box-shadow: 0 6px 20px rgba(0,0,0,0.04);">
      <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: center;">
        <div style="flex: 0 0 280px; max-width: 320px; background: #f4f4f5; border-radius: 12px; padding: 12px; border: 1px solid var(--border); box-shadow: 0 10px 25px rgba(0,0,0,0.08); text-align: center;">
          <div style="max-height: 520px; overflow: hidden; border-radius: 8px;">
            ${bannerSvg}
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: var(--gray); font-weight: 600;">1200 &times; 2800 px &bull; 80 &times; 200 cm Standee</div>
        </div>
        <div style="flex: 1; min-width: 300px;">
          <div class="badge">PRINT &amp; CANVA READY</div>
          <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 12px; color: var(--dark);">Sentinel Event Rollup Standing Banner</h2>
          <p style="font-size: 15px; color: var(--gray); margin-bottom: 20px; line-height: 1.6;">
            A complete, balanced rollup banner matching your event display requirements. It features:
          </p>
          <ul style="font-size: 14px; color: var(--dark); margin-bottom: 24px; padding-left: 20px; line-height: 1.8;">
            <li><strong>Top Brand Header:</strong> Electric Blue Shield + pure Satoshi vector outline wordmark on clean white/ice-blue gradient.</li>
            <li><strong>Dual Smartphone Mockups:</strong> Front phone with live 524 ppm gas &amp; sensor telemetry; angled back phone showing 3 active ESP32 encrypted nodes.</li>
            <li><strong>High-Impact Punchline:</strong> "MONITORING FOR ALL" in bold Satoshi typography with high-contrast badge &amp; feature checklist.</li>
            <li><strong>Deep Slate Footer:</strong> 4-point contact grid with clean SVG icons (Website, Fleet Portal, GitHub, Docs).</li>
          </ul>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <button class="btn btn-primary" style="padding: 12px 24px; font-size: 14px;" onclick="copySvg('sentinel-rollup-banner')">📋 Copy Banner SVG (Canva)</button>
            <a href="07_rollup_banner/sentinel-rollup-banner.png" download="sentinel-rollup-banner.png" class="btn btn-secondary" style="padding: 12px 24px; font-size: 14px;">⬇ Download High-Res PNG (300 DPI)</a>
            <button class="btn btn-secondary" style="padding: 12px 20px; font-size: 14px;" onclick="downloadSvgDirect('sentinel-rollup-banner', 'sentinel-rollup-banner.svg')">⬇ Download Vector SVG</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid of Isolated Mockups for Canvas Customization -->
    <div class="grid">
      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${bothPhonesSvg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Floating Dual Smartphone Mockup</div>
            <div class="card-desc">mockup-dual-phones-transparent.svg &bull; Transparent 3D drop shadow</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('mockup-dual-phones-transparent')">Copy SVG (Canva)</button>
            <a href="07_rollup_banner/mockup-dual-phones-transparent.png" download="mockup-dual-phones-transparent.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('mockup-dual-phones-transparent', 'mockup-dual-phones-transparent.svg')">Download SVG</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${phone1Svg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Phone Mockup: Live Dashboard &amp; Telemetry</div>
            <div class="card-desc">mockup-phone-dashboard.svg &bull; 524 ppm gas, temp &amp; humidity</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('mockup-phone-dashboard')">Copy SVG (Canva)</button>
            <a href="07_rollup_banner/mockup-phone-dashboard.png" download="mockup-phone-dashboard.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('mockup-phone-dashboard', 'mockup-phone-dashboard.svg')">Download SVG</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${phone2Svg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Phone Mockup: Fleet &amp; Hardware Encryption</div>
            <div class="card-desc">mockup-phone-devices.svg &bull; 3 ESP32 nodes &amp; signal strength</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('mockup-phone-devices')">Copy SVG (Canva)</button>
            <a href="07_rollup_banner/mockup-phone-devices.png" download="mockup-phone-devices.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('mockup-phone-devices', 'mockup-phone-devices.svg')">Download SVG</button>
          </div>
        </div>
      </div>
    </div>
    ${bannerSectionEnd}
`;

    // Insert before closing of container
    const insertPoint = hubHtml.indexOf('</div>\n\n  <div id="toast"');
    if (insertPoint !== -1) {
      hubHtml = hubHtml.substring(0, insertPoint) + bannerItemsHtml + '\n' + hubHtml.substring(insertPoint);
    } else {
      const altInsert = hubHtml.lastIndexOf('</div>');
      hubHtml = hubHtml.substring(0, altInsert) + bannerItemsHtml + '\n' + hubHtml.substring(altInsert);
    }

    // Update svgDatabase inside script
    const bannerSvgEntries = {
      'sentinel-rollup-banner': bannerSvg,
      'mockup-dual-phones-transparent': bothPhonesSvg,
      'mockup-phone-dashboard': phone1Svg,
      'mockup-phone-devices': phone2Svg
    };

    const extraScriptMarker = '/* BANNER_SVGS_INJECTED */';
    if (!hubHtml.includes(extraScriptMarker)) {
      const scriptIndex = hubHtml.indexOf('<script>');
      if (scriptIndex !== -1) {
        const injectScript = `\n    ${extraScriptMarker}\n    Object.assign(svgDatabase, ${JSON.stringify(bannerSvgEntries)});\n`;
        hubHtml = hubHtml.replace('<script>', '<script>' + injectScript);
      }
    } else {
      // Replace existing injection
      const reg = new RegExp('/\\* BANNER_SVGS_INJECTED \\*/[\\s\\S]*?Object\\.assign\\(svgDatabase, [\\s\\S]*?\\);');
      hubHtml = hubHtml.replace(reg, `${extraScriptMarker}\n    Object.assign(svgDatabase, ${JSON.stringify(bannerSvgEntries)});`);
    }

    fs.writeFileSync(hubPath, hubHtml, 'utf8');
    fs.writeFileSync(pubHubPath, hubHtml, 'utf8');
    console.log('HTML Hub updated successfully with SVG database entries!');
  }

  // Package zip
  console.log('Packaging updated canva-bunting-assets.zip...');
  const pythonScript = `
import os, zipfile
base_dir = r"c:\\Users\\User\\OneDrive\\Documents\\sentinel\\canva-bunting-assets"
out_zip = r"c:\\Users\\User\\OneDrive\\Documents\\sentinel\\canva-bunting-assets.zip"
pub_zip = r"c:\\Users\\User\\OneDrive\\Documents\\sentinel\\public\\branding\\bunting\\canva-bunting-assets.zip"

with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_dir)
            z.write(full_path, rel_path)

import shutil
shutil.copyfile(out_zip, pub_zip)
print(f"Zip created: {os.path.getsize(out_zip) / (1024*1024):.2f} MB")
`;
  fs.writeFileSync(path.join(__dirname, 'zip_pack.py'), pythonScript, 'utf8');

  console.log('All banner assets built successfully!');
}

buildBanner().catch(console.error);

