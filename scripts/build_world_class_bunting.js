const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const qrcode = require('qrcode');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'canva-bunting-assets');
const rollupDir = path.join(assetsDir, '07_rollup_banner');
const screensDir = path.join(assetsDir, '08_real_project_screenshots');
const compsDir = path.join(assetsDir, '09_real_project_components');
const pubRollupDir = path.join(rootDir, 'public', 'branding', 'bunting', '07_rollup_banner');

// Ensure output dirs
if (!fs.existsSync(rollupDir)) fs.mkdirSync(rollupDir, { recursive: true });
if (!fs.existsSync(pubRollupDir)) fs.mkdirSync(pubRollupDir, { recursive: true });

// Load real assets as base64
function toBase64(filePath) {
  return fs.readFileSync(filePath).toString('base64');
}

const desktopDashB64 = toBase64(path.join(screensDir, 'sentinel-real-dashboard-desktop.png'));
const mobileDashB64 = toBase64(path.join(screensDir, 'sentinel-real-dashboard-mobile.png'));
const co2CardB64 = toBase64(path.join(compsDir, 'real-comp-co2-gas-card.png'));
const co2ChartB64 = toBase64(path.join(compsDir, 'real-comp-co2-trend-chart.png'));
const tempCardB64 = toBase64(path.join(compsDir, 'real-comp-temperature-card.png'));
const alertsCardB64 = toBase64(path.join(compsDir, 'real-comp-recent-alerts-card.png'));
const fleetTableB64 = toBase64(path.join(compsDir, 'real-comp-device-fleet-table.png'));

// Extract official SVG wordmark path from extracted_glyphs.json
let wordmarkD = '';
try {
  const glyphs = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_glyphs.json'), 'utf8'));
  wordmarkD = glyphs.wordmark.d;
  console.log('Loaded official vector wordmark path!');
} catch (e) {
  console.log('Error loading wordmark path:', e.message);
}

async function getQrCodeSvg(url) {
  const svg = await qrcode.toString(url, {
    type: 'svg',
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  // Extract path content from SVG
  const pathMatch = svg.match(/<path[^>]+d="([^"]+)"[^>]*\/>/g);
  return { fullSvg: svg, paths: pathMatch || [] };
}

/* =========================================================================
   1. ENTERPRISE DARK EDITION (Verkada / Samsara / Linear Conference Style)
   Dimensions: 1200 x 3600 (1:3 ratio, renders to 2400 x 7200 px @ 300 DPI)
   ========================================================================= */
async function buildDarkProBanner() {
  const qr = await getQrCodeSvg('https://sentinel.io');
  const qrInner = qr.fullSvg.replace(/<\?xml.*?\?>/, '').replace(/<svg[^>]*>/, '').replace('</svg>', '');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 3600" width="1200" height="3600">
  <defs>
    <!-- Background Radial Gradients -->
    <radialGradient id="darkBgGlow1" cx="50%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#0f172a" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#050811" stop-opacity="1" />
    </radialGradient>

    <radialGradient id="heroGlow" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.32" />
      <stop offset="60%" stop-color="#0284c7" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#050811" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="cyberBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>

    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>

    <!-- Deep Ambient 3D Shadow -->
    <filter id="heroShadow" x="-20%" y="-10%" width="150%" height="130%">
      <feDropShadow dx="0" dy="48" stdDeviation="56" flood-color="#000000" flood-opacity="0.65" />
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0284c7" flood-opacity="0.15" />
    </filter>

    <filter id="floatShadow" x="-30%" y="-20%" width="160%" height="150%">
      <feDropShadow dx="0" dy="32" stdDeviation="36" flood-color="#000000" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#38bdf8" flood-opacity="0.25" />
    </filter>

    <filter id="dangerGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#ef4444" flood-opacity="0.35" />
      <feDropShadow dx="0" dy="36" stdDeviation="40" flood-color="#000000" flood-opacity="0.7" />
    </filter>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.45" />
    </filter>

    <clipPath id="desktopClip">
      <rect width="980" height="570" rx="0" />
    </clipPath>

    <clipPath id="phoneClip">
      <rect width="270" height="580" rx="36" />
    </clipPath>

    <!-- Tech Grid Pattern -->
    <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.75" stroke-opacity="0.4" />
      <circle cx="40" cy="0" r="1" fill="#38bdf8" fill-opacity="0.25" />
    </pattern>
  </defs>

  <!-- 1. BASE BACKGROUND -->
  <rect width="1200" height="3600" fill="#050811" />
  <rect width="1200" height="3600" fill="url(#darkBgGlow1)" />
  <rect width="1200" height="2400" fill="url(#heroGlow)" />
  <rect width="1200" height="3600" fill="url(#techGrid)" opacity="0.8" />

  <!-- Subtle Concentric Telemetry Radar Rings -->
  <g opacity="0.35" transform="translate(600, 1420)">
    <circle r="420" fill="none" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="6 8" />
    <circle r="680" fill="none" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="12 16" />
    <circle r="940" fill="none" stroke="#1e293b" stroke-width="1.5" />
  </g>

  <!-- =======================================================================
       ZONE 1: HEADER & HIGH-IMPACT VALUE HOOK (0 - 640 px) - Eye-Level Entrance
       ======================================================================= -->
  <g transform="translate(100, 110)">
    <!-- Top Identity Bar -->
    <g transform="translate(0, 0)">
      <!-- Brand Logo Shield (Scaled & Glowing) -->
      <g transform="translate(0, 0) scale(1.15)">
        <path d="M40 8 L68 18 V36 C68 54 54 66 40 71 C26 66 12 54 12 36 V18 Z"
              fill="url(#cyberBlue)" />
        <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
              fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="2" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#ffffff" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#ffffff" />
        <path d="M40 47 V56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
      </g>

      <!-- SENTINEL Typography Wordmark -->
      <g transform="translate(105, 14) scale(0.068)">
        <path d="${wordmarkD}" fill="#ffffff" />
      </g>

      <!-- Category Pill Badge -->
      <g transform="translate(620, 18)">
        <rect width="380" height="42" rx="21" fill="rgba(37,99,235,0.15)" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="24" cy="21" r="5" fill="#38bdf8">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="42" y="27" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#38bdf8" letter-spacing="2">PHYSICAL AI &#8226; INDUSTRIAL IOT</text>
      </g>
    </g>

    <!-- Punchy Expo Headline (The 3-Second Hook) -->
    <g transform="translate(0, 135)">
      <text x="0" y="48" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="58" fill="#ffffff" letter-spacing="-1">
        Real-Time Environmental
      </text>
      <text x="0" y="116" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="58" fill="url(#accentGradient)" letter-spacing="-1">
        Intelligence Platform.
      </text>
      <text x="0" y="174" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="23" fill="#94a3b8" letter-spacing="0.2">
        Sub-second hazardous gas telemetry, automated siren dispatch,
      </text>
      <text x="0" y="206" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="23" fill="#94a3b8" letter-spacing="0.2">
        and decentralized ESP32 hardware mesh for critical facilities.
      </text>

      <!-- Micro Metrics Ticker Bar -->
      <g transform="translate(0, 245)">
        <rect width="1000" height="52" rx="12" fill="rgba(15,23,42,0.85)" stroke="#334155" stroke-width="1.2" />
        
        <g transform="translate(24, 32)">
          <circle cx="8" cy="-5" r="4.5" fill="#10b981" />
          <text x="22" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#f1f5f9">&lt; 2.0s <tspan font-weight="500" font-size="13" fill="#94a3b8">Stream Latency</tspan></text>
        </g>

        <line x1="280" y1="12" x2="280" y2="40" stroke="#334155" stroke-width="1.5" />

        <g transform="translate(310, 32)">
          <circle cx="8" cy="-5" r="4.5" fill="#38bdf8" />
          <text x="22" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#f1f5f9">100% Edge <tspan font-weight="500" font-size="13" fill="#94a3b8">Offline Resilient</tspan></text>
        </g>

        <line x1="620" y1="12" x2="620" y2="40" stroke="#334155" stroke-width="1.5" />

        <g transform="translate(650, 32)">
          <circle cx="8" cy="-5" r="4.5" fill="#a855f7" />
          <text x="22" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#f1f5f9">AES-256 <tspan font-weight="500" font-size="13" fill="#94a3b8">Hardware Encrypted</tspan></text>
        </g>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 2: HERO PRODUCT STAGE (720 - 2120 px) - Prime 5-6ft Eye Level
       Dynamic Layered Showcase: Authentic Desktop Screen + Floating 3D Widgets
       ======================================================================= -->
  <g id="hero-stage" transform="translate(100, 750)">
    <!-- Base Glow Behind Screen -->
    <ellipse cx="500" cy="380" rx="460" ry="240" fill="#1e40af" opacity="0.28" filter="blur(50px)" />

    <!-- 1. MAIN DESKTOP BROWSER FRAME -->
    <g filter="url(#heroShadow)">
      <!-- Outer Frame (1000 x 620) -->
      <rect width="1000" height="630" rx="18" fill="#0f172a" stroke="#334155" stroke-width="2.5" />
      
      <!-- macOS Style Dark Titlebar -->
      <path d="M0 18 Q0 0 18 0 H982 Q1000 0 1000 18 V50 H0 Z" fill="#1e293b" />
      
      <!-- Traffic Light Dots -->
      <circle cx="28" cy="25" r="7" fill="#ef4444" />
      <circle cx="50" cy="25" r="7" fill="#f59e0b" />
      <circle cx="72" cy="25" r="7" fill="#10b981" />

      <!-- Centered URL Bar -->
      <g transform="translate(260, 10)">
        <rect width="480" height="30" rx="7" fill="#090d16" stroke="#334155" stroke-width="1" />
        <g transform="translate(16, 8) scale(0.75)">
          <rect x="2" y="6" width="14" height="10" rx="2" fill="none" stroke="#38bdf8" stroke-width="2" />
          <path d="M5 6 V4 A4 4 0 0 1 13 4 V6" fill="none" stroke="#38bdf8" stroke-width="2" />
        </g>
        <text x="38" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8">
          https://<tspan fill="#f1f5f9">app.sentinel.io</tspan>/dashboard
        </text>
        <rect x="420" y="6" width="48" height="18" rx="4" fill="rgba(16,185,129,0.2)" />
        <text x="444" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="10" fill="#34d399" text-anchor="middle">LIVE</text>
      </g>

      <!-- Real Desktop Dashboard Screenshot Insert -->
      <g transform="translate(10, 50)" clip-path="url(#desktopClip)">
        <image href="data:image/png;base64,${desktopDashB64}" x="0" y="0" width="980" height="570" preserveAspectRatio="xMidYMid slice" />
      </g>
    </g>

    <!-- 2. FLOATING REAL CO2 GAS CARD (Pops out in Top-Right 3D with Danger Glow) -->
    <g transform="translate(620, -70)" filter="url(#dangerGlow)">
      <rect width="400" height="240" rx="18" fill="#0f172a" stroke="#ef4444" stroke-width="2.5" />
      
      <!-- Top Alert Ribbon -->
      <path d="M0 18 Q0 0 18 0 H382 Q400 0 400 18 V36 H0 Z" fill="#ef4444" />
      <g transform="translate(16, 24)">
        <circle cx="4" cy="-4" r="5" fill="#ffffff" />
        <text x="18" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="13" fill="#ffffff" letter-spacing="1.5">
          CRITICAL THRESHOLD ALERT
        </text>
      </g>
      <rect x="300" y="7" width="88" height="22" rx="11" fill="rgba(0,0,0,0.3)" />
      <text x="344" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="11" fill="#ffffff" text-anchor="middle">1639 ppm</text>

      <!-- Real Component Cutout Embedded Inside -->
      <g transform="translate(10, 42)">
        <image href="data:image/png;base64,${co2CardB64}" width="380" height="190" preserveAspectRatio="xMidYMid contain" />
      </g>
    </g>

    <!-- 3. FLOATING REAL RECHARTS SPIKE CURVE (Bottom-Right Floating Anchor) -->
    <g transform="translate(420, 510)" filter="url(#floatShadow)">
      <rect width="600" height="240" rx="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
      
      <g transform="translate(20, 26)">
        <circle cx="4" cy="0" r="5" fill="#38bdf8" />
        <text x="18" y="4" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="#38bdf8" letter-spacing="1">
          LIVE RECHARTS TELEMETRY STREAM
        </text>
        <text x="430" y="4" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#94a3b8">
          Sub-Second Spikes
        </text>
      </g>

      <!-- Real Historical Recharts Chart Cutout -->
      <g transform="translate(10, 40)">
        <image href="data:image/png;base64,${co2ChartB64}" width="580" height="190" preserveAspectRatio="xMidYMid contain" />
      </g>
    </g>

    <!-- 4. FLOATING SMARTPHONE DEVICE (Bottom-Left: Dual Platform Proof) -->
    <g transform="translate(-40, 280)" filter="url(#floatShadow)">
      <!-- Sleek Titanium Phone Chassis -->
      <rect x="-12" y="-12" width="294" height="604" rx="46" fill="#020617" stroke="#475569" stroke-width="3" />
      <g clip-path="url(#phoneClip)">
        <image href="data:image/png;base64,${mobileDashB64}" width="270" height="580" preserveAspectRatio="xMidYMid slice" />
      </g>
      <!-- Dynamic Island Capsule -->
      <rect x="85" y="10" width="100" height="22" rx="11" fill="#000000" />
      <circle cx="160" cy="21" r="3.5" fill="#1e293b" />

      <!-- Float Badge on Phone -->
      <g transform="translate(20, 520)">
        <rect width="230" height="38" rx="10" fill="rgba(15,23,42,0.95)" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="18" cy="19" r="4.5" fill="#10b981" />
        <text x="32" y="24" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#ffffff">Mobile Field Telemetry</text>
      </g>
    </g>

    <!-- Luminous Feature Callout Badges with Pointer Lines -->
    <!-- Pointer 1: Real ESP32 Fleet Table -->
    <g transform="translate(70, 780)">
      <circle cx="0" cy="0" r="5" fill="#38bdf8" />
      <line x1="0" y1="0" x2="60" y2="40" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3" />
      <rect x="60" y="20" width="310" height="42" rx="10" fill="rgba(15,23,42,0.92)" stroke="#38bdf8" stroke-width="1.2" />
      <text x="76" y="46" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#ffffff">
        📡 ESP32 Decentralized Mesh Fleet
      </text>
    </g>

    <!-- Pointer 2: Automated Siren Alert -->
    <g transform="translate(860, 200)">
      <circle cx="0" cy="0" r="5" fill="#ef4444" />
      <line x1="0" y1="0" x2="50" y2="-30" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="3 3" />
      <rect x="50" y="-55" width="220" height="38" rx="10" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1.2" />
      <text x="64" y="-31" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#fca5a5">
        🚨 Automated Siren Trigger
      </text>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 3: VALUE PILLARS & PLATFORM CAPABILITIES (2220 - 2800 px)
       3 Sleek Horizontal Cards (Samsara / Datadog Style)
       ======================================================================= -->
  <g id="pillars-section" transform="translate(100, 2220)">
    <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="-0.5">
      ENGINEERED FOR EXTREME LABS &amp; HAZARDOUS SITES
    </text>
    <text x="0" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="18" fill="#94a3b8">
      Architected for zero latency, zero downtime, and complete hardware sovereignty.
    </text>

    <g transform="translate(0, 65)">
      <!-- Pillar 1: Real-time Telemetry -->
      <g transform="translate(0, 0)" filter="url(#cardShadow)">
        <rect width="1000" height="110" rx="16" fill="rgba(15,23,42,0.85)" stroke="#1e293b" stroke-width="1.5" />
        <g transform="translate(24, 25)">
          <rect width="60" height="60" rx="14" fill="rgba(37,99,235,0.2)" stroke="#38bdf8" stroke-width="1.5" />
          <!-- Lightning / Pulse Icon -->
          <path d="M32 16 L22 34 H32 L28 46 L40 28 H30 Z" fill="#38bdf8" />
        </g>
        <g transform="translate(106, 38)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="#ffffff">
            Sub-Second Streaming over MQTT &amp; SSE
          </text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#94a3b8">
            Continuous bidirectional data synchronization with sub-second spike detection and live Recharts curves.
          </text>
        </g>
      </g>

      <!-- Pillar 2: Edge Hardware Mesh -->
      <g transform="translate(0, 135)" filter="url(#cardShadow)">
        <rect width="1000" height="110" rx="16" fill="rgba(15,23,42,0.85)" stroke="#1e293b" stroke-width="1.5" />
        <g transform="translate(24, 25)">
          <rect width="60" height="60" rx="14" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5" />
          <!-- Shield Check Icon -->
          <path d="M30 18 L42 24 V34 C42 42 36 48 30 50 C24 48 18 42 18 34 V24 Z" fill="none" stroke="#10b981" stroke-width="2.5" />
          <path d="M26 34 L29 37 L35 31" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />
        </g>
        <g transform="translate(106, 38)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="#ffffff">
            Decentralized ESP32 Hardware Mesh
          </text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#94a3b8">
            Hardware AES-256 encrypted peer nodes. Operates 100% offline with local circular buffers during outages.
          </text>
        </g>
      </g>

      <!-- Pillar 3: Multi-Gas Automated Incident Dispatch -->
      <g transform="translate(0, 270)" filter="url(#cardShadow)">
        <rect width="1000" height="110" rx="16" fill="rgba(15,23,42,0.85)" stroke="#1e293b" stroke-width="1.5" />
        <g transform="translate(24, 25)">
          <rect width="60" height="60" rx="14" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1.5" />
          <!-- Siren / Bell Icon -->
          <path d="M30 18 A10 10 0 0 1 40 28 V38 L44 42 H16 L20 38 V28 A10 10 0 0 1 30 18 Z M27 45 A3 3 0 0 0 33 45" fill="none" stroke="#ef4444" stroke-width="2.5" />
        </g>
        <g transform="translate(106, 38)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="#ffffff">
            Automated Physical Siren &amp; Evacuation Alarms
          </text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#94a3b8">
            Programmable multi-gas ppm thresholds with immediate relay-triggered physical sirens and incident logs.
          </text>
        </g>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 4: CALL TO ACTION & CONTACT FOOTER (2900 - 3480 px)
       High-Contrast Scannable QR Code + Official Domain & Docs
       ======================================================================= -->
  <g id="footer-cta" transform="translate(0, 2890)">
    <!-- Dark Container Box -->
    <rect width="1200" height="710" fill="#04060c" />
    <rect width="1200" height="4" fill="url(#cyberBlue)" />

    <!-- 1. Left Showcase: Scannable Vector QR Code -->
    <g transform="translate(100, 70)">
      <!-- Pure White QR Card with Heavy Contrast for Any Camera -->
      <g filter="url(#cardShadow)">
        <rect width="260" height="340" rx="20" fill="#ffffff" />
        
        <!-- Embedded Real QR Code (180x180) -->
        <g transform="translate(40, 35) scale(6.666)">
          ${qrInner}
        </g>

        <!-- QR Scan Label -->
        <g transform="translate(130, 255)">
          <rect x="-95" y="0" width="190" height="30" rx="15" fill="#eff6ff" stroke="#2563eb" stroke-width="1.2" />
          <text x="0" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#1d4ed8" text-anchor="middle">
            SCAN FOR LIVE DEMO
          </text>
        </g>
        <text x="130" y="315" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#64748b" text-anchor="middle">
          Interactive Fleet Sandbox
        </text>
      </g>
    </g>

    <!-- 2. Right Showcase: Bold Direct URLs & Expo Action -->
    <g transform="translate(410, 70)">
      <!-- Primary Big URL -->
      <text x="0" y="44" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="52" fill="#ffffff" letter-spacing="-1">
        sentinel.io
      </text>
      <text x="0" y="86" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="20" fill="#94a3b8">
        The Open Physical AI Environmental Telemetry Standard
      </text>

      <!-- 4-Grid Contact / Portal Details -->
      <g transform="translate(0, 125)">
        <!-- Item 1: Cloud Fleet Console -->
        <g transform="translate(0, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5" />
          <path d="M14 20 L18 24 L26 16" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
          <text x="50" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">CLOUD CONSOLE</text>
          <text x="50" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">app.sentinel.io</text>
        </g>

        <!-- Item 2: Open Source Core -->
        <g transform="translate(360, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(168,85,247,0.15)" stroke="#a855f7" stroke-width="1.5" />
          <path d="M15 15 H25 V25 H15 Z" fill="none" stroke="#a855f7" stroke-width="2" />
          <text x="50" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">GITHUB OPEN SOURCE</text>
          <text x="50" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">github.com/sentinel</text>
        </g>

        <!-- Item 3: API & Hardware Docs -->
        <g transform="translate(0, 85)">
          <circle cx="20" cy="20" r="18" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5" />
          <path d="M14 14 H26 V26 H14 Z" fill="none" stroke="#10b981" stroke-width="2" />
          <text x="50" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">DOCUMENTATION</text>
          <text x="50" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">docs.sentinel.io</text>
        </g>

        <!-- Item 4: Direct Inquiries -->
        <g transform="translate(360, 85)">
          <circle cx="20" cy="20" r="18" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.5" />
          <rect x="12" y="14" width="16" height="12" rx="2" fill="none" stroke="#f59e0b" stroke-width="2" />
          <path d="M12 16 L20 22 L28 16" fill="none" stroke="#f59e0b" stroke-width="2" />
          <text x="50" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">ENTERPRISE INQUIRIES</text>
          <text x="50" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">sales@sentinel.io</text>
        </g>
      </g>
    </g>

    <!-- Bottom Safety Buffer (Avoids mechanical rollup stand base clips) -->
    <g transform="translate(100, 520)">
      <rect width="1000" height="38" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <text x="500" y="24" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#64748b" letter-spacing="2" text-anchor="middle">
        SPECIFICATION: 2 FT &#215; 6 FT (24&#8243; &#215; 72&#8243; &#8226; 60.96 CM &#215; 182.88 CM) &#8226; 1:3 ASPECT RATIO ROLLUP BANNER
      </text>
    </g>
  </g>
</svg>`;
}

/* =========================================================================
   2. CLINICAL LAB LIGHT EDITION (Stripe / Apple / Datadog Style)
   ========================================================================= */
async function buildLightProBanner() {
  const qr = await getQrCodeSvg('https://sentinel.io');
  const qrInner = qr.fullSvg.replace(/<\?xml.*?\?>/, '').replace(/<svg[^>]*>/, '').replace('</svg>', '');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 3600" width="1200" height="3600">
  <defs>
    <!-- Crisp Light Gradients -->
    <linearGradient id="lightBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#f8fafc" />
      <stop offset="70%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>

    <linearGradient id="primaryBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>

    <!-- Clean Soft Shadows -->
    <filter id="lightHeroShadow" x="-20%" y="-10%" width="150%" height="130%">
      <feDropShadow dx="0" dy="36" stdDeviation="40" flood-color="#0f172a" flood-opacity="0.16" />
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>

    <filter id="lightFloatShadow" x="-30%" y="-20%" width="160%" height="150%">
      <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.22" />
    </filter>

    <filter id="lightCardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.06" />
    </filter>

    <clipPath id="lightDeskClip">
      <rect width="980" height="570" rx="0" />
    </clipPath>

    <clipPath id="lightPhoneClip">
      <rect width="270" height="580" rx="36" />
    </clipPath>

    <!-- Clean Dot Grid Pattern -->
    <pattern id="dotGrid" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="1.2" fill="#cbd5e1" opacity="0.6" />
    </pattern>
  </defs>

  <!-- 1. BASE BACKGROUND -->
  <rect width="1200" height="3600" fill="url(#lightBg)" />
  <rect width="1200" height="3600" fill="url(#dotGrid)" />

  <!-- Subtle Top Atmospheric Wave -->
  <path d="M0 0 L1200 0 L1200 380 Q600 480 0 380 Z" fill="#eff6ff" opacity="0.7" />

  <!-- =======================================================================
       ZONE 1: HEADER & IDENTITY (0 - 640 px)
       ======================================================================= -->
  <g transform="translate(100, 110)">
    <!-- Top Identity Bar -->
    <g transform="translate(0, 0)">
      <!-- Brand Logo Shield -->
      <g transform="translate(0, 0) scale(1.15)">
        <path d="M40 8 L68 18 V36 C68 54 54 66 40 71 C26 66 12 54 12 36 V18 Z"
              fill="url(#primaryBlueGrad)" />
        <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
              fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="2" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#ffffff" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#ffffff" />
        <path d="M40 47 V56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
      </g>

      <!-- SENTINEL Typography Wordmark -->
      <g transform="translate(105, 14) scale(0.068)">
        <path d="${wordmarkD}" fill="#0f172a" />
      </g>

      <!-- Category Pill Badge -->
      <g transform="translate(620, 18)">
        <rect width="380" height="42" rx="21" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
        <circle cx="24" cy="21" r="5" fill="#2563eb" />
        <text x="42" y="27" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="#1d4ed8" letter-spacing="2">PHYSICAL AI &#8226; INDUSTRIAL IOT</text>
      </g>
    </g>

    <!-- Punchy Expo Headline -->
    <g transform="translate(0, 135)">
      <text x="0" y="48" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="58" fill="#0f172a" letter-spacing="-1">
        Industrial Environmental
      </text>
      <text x="0" y="116" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="58" fill="#2563eb" letter-spacing="-1">
        Safety &amp; Telemetry.
      </text>
      <text x="0" y="174" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="23" fill="#475569" letter-spacing="0.2">
        Sub-second hazardous gas telemetry, automated siren dispatch,
      </text>
      <text x="0" y="206" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="23" fill="#475569" letter-spacing="0.2">
        and decentralized ESP32 hardware mesh for laboratory &amp; factory safety.
      </text>

      <!-- Micro Metrics Ticker Bar -->
      <g transform="translate(0, 245)">
        <rect width="1000" height="52" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#lightCardShadow)" />
        
        <g transform="translate(24, 32)">
          <circle cx="8" cy="-5" r="4.5" fill="#16a34a" />
          <text x="22" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#0f172a">&lt; 2.0s <tspan font-weight="500" font-size="13" fill="#64748b">Stream Latency</tspan></text>
        </g>

        <line x1="280" y1="12" x2="280" y2="40" stroke="#e2e8f0" stroke-width="1.5" />

        <g transform="translate(310, 32)">
          <circle cx="8" cy="-5" r="4.5" fill="#2563eb" />
          <text x="22" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#0f172a">100% Edge <tspan font-weight="500" font-size="13" fill="#64748b">Offline Resilient</tspan></text>
        </g>

        <line x1="620" y1="12" x2="620" y2="40" stroke="#e2e8f0" stroke-width="1.5" />

        <g transform="translate(650, 32)">
          <circle cx="8" cy="-5" r="4.5" fill="#9333ea" />
          <text x="22" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#0f172a">AES-256 <tspan font-weight="500" font-size="13" fill="#64748b">Hardware Encrypted</tspan></text>
        </g>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 2: HERO PRODUCT STAGE (720 - 2120 px)
       ======================================================================= -->
  <g id="hero-stage" transform="translate(100, 750)">
    <!-- 1. MAIN DESKTOP BROWSER FRAME -->
    <g filter="url(#lightHeroShadow)">
      <rect width="1000" height="630" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
      
      <!-- Titlebar -->
      <path d="M0 18 Q0 0 18 0 H982 Q1000 0 1000 18 V50 H0 Z" fill="#f1f5f9" />
      <circle cx="28" cy="25" r="7" fill="#ef4444" />
      <circle cx="50" cy="25" r="7" fill="#f59e0b" />
      <circle cx="72" cy="25" r="7" fill="#10b981" />

      <!-- Centered URL Bar -->
      <g transform="translate(260, 10)">
        <rect width="480" height="30" rx="7" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
        <g transform="translate(16, 8) scale(0.75)">
          <rect x="2" y="6" width="14" height="10" rx="2" fill="none" stroke="#2563eb" stroke-width="2" />
          <path d="M5 6 V4 A4 4 0 0 1 13 4 V6" fill="none" stroke="#2563eb" stroke-width="2" />
        </g>
        <text x="38" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#64748b">
          https://<tspan fill="#0f172a">app.sentinel.io</tspan>/dashboard
        </text>
        <rect x="420" y="6" width="48" height="18" rx="4" fill="#dcfce7" />
        <text x="444" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="10" fill="#16a34a" text-anchor="middle">LIVE</text>
      </g>

      <!-- Real Desktop Screenshot -->
      <g transform="translate(10, 50)" clip-path="url(#lightDeskClip)">
        <image href="data:image/png;base64,${desktopDashB64}" x="0" y="0" width="980" height="570" preserveAspectRatio="xMidYMid slice" />
      </g>
    </g>

    <!-- 2. FLOATING REAL CO2 GAS CARD (Pops out in Top-Right 3D) -->
    <g transform="translate(620, -70)" filter="url(#lightFloatShadow)">
      <rect width="400" height="240" rx="18" fill="#ffffff" stroke="#ef4444" stroke-width="2.5" />
      <path d="M0 18 Q0 0 18 0 H382 Q400 0 400 18 V36 H0 Z" fill="#ef4444" />
      <g transform="translate(16, 24)">
        <circle cx="4" cy="-4" r="5" fill="#ffffff" />
        <text x="18" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="13" fill="#ffffff" letter-spacing="1.5">
          CRITICAL THRESHOLD ALERT
        </text>
      </g>
      <rect x="300" y="7" width="88" height="22" rx="11" fill="rgba(0,0,0,0.3)" />
      <text x="344" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="11" fill="#ffffff" text-anchor="middle">1639 ppm</text>

      <g transform="translate(10, 42)">
        <image href="data:image/png;base64,${co2CardB64}" width="380" height="190" preserveAspectRatio="xMidYMid contain" />
      </g>
    </g>

    <!-- 3. FLOATING REAL RECHARTS SPIKE CURVE (Bottom-Right) -->
    <g transform="translate(420, 510)" filter="url(#lightFloatShadow)">
      <rect width="600" height="240" rx="18" fill="#ffffff" stroke="#2563eb" stroke-width="2" />
      <g transform="translate(20, 26)">
        <circle cx="4" cy="0" r="5" fill="#2563eb" />
        <text x="18" y="4" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="#2563eb" letter-spacing="1">
          LIVE RECHARTS TELEMETRY STREAM
        </text>
        <text x="430" y="4" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#64748b">
          Sub-Second Spikes
        </text>
      </g>
      <g transform="translate(10, 40)">
        <image href="data:image/png;base64,${co2ChartB64}" width="580" height="190" preserveAspectRatio="xMidYMid contain" />
      </g>
    </g>

    <!-- 4. FLOATING SMARTPHONE DEVICE (Bottom-Left) -->
    <g transform="translate(-40, 280)" filter="url(#lightFloatShadow)">
      <rect x="-12" y="-12" width="294" height="604" rx="46" fill="#0f172a" stroke="#94a3b8" stroke-width="2" />
      <g clip-path="url(#lightPhoneClip)">
        <image href="data:image/png;base64,${mobileDashB64}" width="270" height="580" preserveAspectRatio="xMidYMid slice" />
      </g>
      <rect x="85" y="10" width="100" height="22" rx="11" fill="#000000" />
      <circle cx="160" cy="21" r="3.5" fill="#334155" />

      <g transform="translate(20, 520)">
        <rect width="230" height="38" rx="10" fill="#ffffff" stroke="#2563eb" stroke-width="1.5" />
        <circle cx="18" cy="19" r="4.5" fill="#16a34a" />
        <text x="32" y="24" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#0f172a">Mobile Field Telemetry</text>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 3: VALUE PILLARS & PLATFORM CAPABILITIES (2220 - 2800 px)
       ======================================================================= -->
  <g id="pillars-section" transform="translate(100, 2220)">
    <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="34" fill="#0f172a" letter-spacing="-0.5">
      ENGINEERED FOR EXTREME LABS &amp; HAZARDOUS SITES
    </text>
    <text x="0" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="18" fill="#64748b">
      Architected for zero latency, zero downtime, and complete hardware sovereignty.
    </text>

    <g transform="translate(0, 65)">
      <!-- Pillar 1 -->
      <g transform="translate(0, 0)" filter="url(#lightCardShadow)">
        <rect width="1000" height="110" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
        <g transform="translate(24, 25)">
          <rect width="60" height="60" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5" />
          <path d="M32 16 L22 34 H32 L28 46 L40 28 H30 Z" fill="#2563eb" />
        </g>
        <g transform="translate(106, 38)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="#0f172a">
            Sub-Second Streaming over MQTT &amp; SSE
          </text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#64748b">
            Continuous bidirectional data synchronization with sub-second spike detection and live Recharts curves.
          </text>
        </g>
      </g>

      <!-- Pillar 2 -->
      <g transform="translate(0, 135)" filter="url(#lightCardShadow)">
        <rect width="1000" height="110" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
        <g transform="translate(24, 25)">
          <rect width="60" height="60" rx="14" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5" />
          <path d="M30 18 L42 24 V34 C42 42 36 48 30 50 C24 48 18 42 18 34 V24 Z" fill="none" stroke="#16a34a" stroke-width="2.5" />
          <path d="M26 34 L29 37 L35 31" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" />
        </g>
        <g transform="translate(106, 38)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="#0f172a">
            Decentralized ESP32 Hardware Mesh
          </text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#64748b">
            Hardware AES-256 encrypted peer nodes. Operates 100% offline with local circular buffers during outages.
          </text>
        </g>
      </g>

      <!-- Pillar 3 -->
      <g transform="translate(0, 270)" filter="url(#lightCardShadow)">
        <rect width="1000" height="110" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
        <g transform="translate(24, 25)">
          <rect width="60" height="60" rx="14" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
          <path d="M30 18 A10 10 0 0 1 40 28 V38 L44 42 H16 L20 38 V28 A10 10 0 0 1 30 18 Z M27 45 A3 3 0 0 0 33 45" fill="none" stroke="#ef4444" stroke-width="2.5" />
        </g>
        <g transform="translate(106, 38)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="#0f172a">
            Automated Physical Siren &amp; Evacuation Alarms
          </text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#64748b">
            Programmable multi-gas ppm thresholds with immediate relay-triggered physical sirens and incident logs.
          </text>
        </g>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 4: CALL TO ACTION & CONTACT FOOTER (2900 - 3480 px)
       ======================================================================= -->
  <g id="footer-cta" transform="translate(0, 2890)">
    <!-- Dark Blue Contrast Footer -->
    <rect width="1200" height="710" fill="#090d16" />
    <rect width="1200" height="4" fill="url(#primaryBlueGrad)" />

    <!-- 1. Left Showcase: Scannable Vector QR Code -->
    <g transform="translate(100, 70)">
      <g filter="url(#lightHeroShadow)">
        <rect width="260" height="340" rx="20" fill="#ffffff" />
        <g transform="translate(40, 35) scale(6.666)">
          ${qrInner}
        </g>
        <g transform="translate(130, 255)">
          <rect x="-95" y="0" width="190" height="30" rx="15" fill="#eff6ff" stroke="#2563eb" stroke-width="1.2" />
          <text x="0" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="#1d4ed8" text-anchor="middle">
            SCAN FOR LIVE DEMO
          </text>
        </g>
        <text x="130" y="315" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#64748b" text-anchor="middle">
          Interactive Fleet Sandbox
        </text>
      </g>
    </g>

    <!-- 2. Right Showcase: Bold Direct URLs & Expo Action -->
    <g transform="translate(410, 70)">
      <text x="0" y="44" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="52" fill="#ffffff" letter-spacing="-1">
        sentinel.io
      </text>
      <text x="0" y="86" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="20" fill="#94a3b8">
        The Open Physical AI Environmental Telemetry Standard
      </text>

      <g transform="translate(0, 125)">
        <g transform="translate(0, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5" />
          <path d="M14 20 L18 24 L26 16" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" />
          <text x="50" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">CLOUD CONSOLE</text>
          <text x="50" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">app.sentinel.io</text>
        </g>

        <g transform="translate(360, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(168,85,247,0.15)" stroke="#a855f7" stroke-width="1.5" />
          <path d="M15 15 H25 V25 H15 Z" fill="none" stroke="#a855f7" stroke-width="2" />
          <text x="50" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">GITHUB OPEN SOURCE</text>
          <text x="50" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">github.com/sentinel</text>
        </g>

        <g transform="translate(0, 85)">
          <circle cx="20" cy="20" r="18" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5" />
          <path d="M14 14 H26 V26 H14 Z" fill="none" stroke="#10b981" stroke-width="2" />
          <text x="50" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">DOCUMENTATION</text>
          <text x="50" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">docs.sentinel.io</text>
        </g>

        <g transform="translate(360, 85)">
          <circle cx="20" cy="20" r="18" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.5" />
          <rect x="12" y="14" width="16" height="12" rx="2" fill="none" stroke="#f59e0b" stroke-width="2" />
          <path d="M12 16 L20 22 L28 16" fill="none" stroke="#f59e0b" stroke-width="2" />
          <text x="50" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">ENTERPRISE INQUIRIES</text>
          <text x="50" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="#ffffff">sales@sentinel.io</text>
        </g>
      </g>
    </g>

    <!-- Bottom Safety Buffer -->
    <g transform="translate(100, 520)">
      <rect width="1000" height="38" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <text x="500" y="24" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#64748b" letter-spacing="2" text-anchor="middle">
        SPECIFICATION: 2 FT &#215; 6 FT (24&#8243; &#215; 72&#8243; &#8226; 60.96 CM &#215; 182.88 CM) &#8226; 1:3 ASPECT RATIO ROLLUP BANNER
      </text>
    </g>
  </g>
</svg>`;
}

async function main() {
  console.log('Generating World-Class 2ft x 6ft SaaS Buntings...');

  // 1. Dark Pro Edition
  console.log('Building Dark Pro Banner...');
  const darkSvg = await buildDarkProBanner();
  const darkSvgPath = path.join(rollupDir, 'sentinel-banner-2x6ft-dark-pro.svg');
  const darkPngPath = path.join(rollupDir, 'sentinel-banner-2x6ft-dark-pro.png');
  fs.writeFileSync(darkSvgPath, darkSvg, 'utf8');

  // Also write as sentinel-banner-2x6ft-desktop for default compatibility
  fs.writeFileSync(path.join(rollupDir, 'sentinel-banner-2x6ft-desktop.svg'), darkSvg, 'utf8');

  console.log('Rendering 2400 x 7200 Print PNG for Dark Pro...');
  await sharp(Buffer.from(darkSvg))
    .resize(2400, 7200)
    .png({ quality: 95 })
    .toFile(darkPngPath);

  // Copy to default name
  fs.copyFileSync(darkPngPath, path.join(rollupDir, 'sentinel-banner-2x6ft-desktop.png'));

  // 2. Light Pro Edition
  console.log('Building Light Pro Banner...');
  const lightSvg = await buildLightProBanner();
  const lightSvgPath = path.join(rollupDir, 'sentinel-banner-2x6ft-light-pro.svg');
  const lightPngPath = path.join(rollupDir, 'sentinel-banner-2x6ft-light-pro.png');
  fs.writeFileSync(lightSvgPath, lightSvg, 'utf8');

  console.log('Rendering 2400 x 7200 Print PNG for Light Pro...');
  await sharp(Buffer.from(lightSvg))
    .resize(2400, 7200)
    .png({ quality: 95 })
    .toFile(lightPngPath);

  console.log('Syncing to public/branding/bunting/07_rollup_banner...');
  const filesToSync = [
    'sentinel-banner-2x6ft-dark-pro.svg',
    'sentinel-banner-2x6ft-dark-pro.png',
    'sentinel-banner-2x6ft-light-pro.svg',
    'sentinel-banner-2x6ft-light-pro.png',
    'sentinel-banner-2x6ft-desktop.svg',
    'sentinel-banner-2x6ft-desktop.png'
  ];

  for (const f of filesToSync) {
    fs.copyFileSync(path.join(rollupDir, f), path.join(pubRollupDir, f));
  }

  console.log('All World-Class 2ft x 6ft SaaS Buntings built successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
