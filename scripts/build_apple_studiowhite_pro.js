const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const PDFDocument = require('pdfkit');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'canva-bunting-assets');
const rollupDir = path.join(assetsDir, '07_rollup_banner');
const screensDir = path.join(assetsDir, '08_real_project_screenshots');
const compsDir = path.join(assetsDir, '09_real_project_components');
const fontsDir = path.join(assetsDir, 'fonts');
const pubRollupDir = path.join(rootDir, 'public', 'branding', 'bunting', '07_rollup_banner');

// Ensure dirs
if (!fs.existsSync(rollupDir)) fs.mkdirSync(rollupDir, { recursive: true });
if (!fs.existsSync(pubRollupDir)) fs.mkdirSync(pubRollupDir, { recursive: true });

function toBase64(filePath) {
  return fs.readFileSync(filePath).toString('base64');
}

const desktopDashB64 = toBase64(path.join(screensDir, 'sentinel-real-dashboard-desktop.png'));
const mobileDashB64 = toBase64(path.join(screensDir, 'sentinel-real-dashboard-mobile.png'));

// Load official Apple SF Pro fonts as base64
console.log('Loading official Apple SF Pro font family...');
const sfDisplayBoldB64 = toBase64(path.join(fontsDir, 'SF-Pro-Display-Bold.otf'));
const sfDisplaySemiboldB64 = toBase64(path.join(fontsDir, 'SF-Pro-Display-Semibold.otf'));
const sfTextRegularB64 = toBase64(path.join(fontsDir, 'SF-Pro-Text-Regular.otf'));
const sfTextSemiboldB64 = toBase64(path.join(fontsDir, 'SF-Pro-Text-Semibold.otf'));

// Extract official SVG wordmark path
let wordmarkD = '';
try {
  const glyphs = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_glyphs.json'), 'utf8'));
  wordmarkD = glyphs.wordmark.d;
} catch (e) {
  console.log('Error loading wordmark:', e.message);
}

async function buildStudioWhiteSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 3600" width="1200" height="3600">
  <defs>
    <style>
      @font-face {
        font-family: 'SF Pro Display';
        src: url('data:font/opentype;base64,${sfDisplayBoldB64}') format('opentype');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'SF Pro Display';
        src: url('data:font/opentype;base64,${sfDisplaySemiboldB64}') format('opentype');
        font-weight: 600;
        font-style: normal;
      }
      @font-face {
        font-family: 'SF Pro Text';
        src: url('data:font/opentype;base64,${sfTextRegularB64}') format('opentype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'SF Pro Text';
        src: url('data:font/opentype;base64,${sfTextSemiboldB64}') format('opentype');
        font-weight: 600;
        font-style: normal;
      }

      .sf-display-bold {
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 700;
      }
      .sf-display-semibold {
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 600;
      }
      .sf-text-regular {
        font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 400;
      }
      .sf-text-semibold {
        font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 600;
      }
    </style>

    <!-- Apple Studio Multi-Stop Light Atmospheric Gradient -->
    <linearGradient id="appleStudioBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="18%" stop-color="#f8fafc" />
      <stop offset="42%" stop-color="#f1f5f9" />
      <stop offset="68%" stop-color="#e8ecf4" />
      <stop offset="100%" stop-color="#dfe5f0" />
    </linearGradient>

    <!-- Hero Hardware Atmospheric Spotlight Aura -->
    <radialGradient id="heroLaptopSpotlight" cx="50%" cy="36%" r="48%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.12" />
      <stop offset="40%" stop-color="#818cf8" stop-opacity="0.06" />
      <stop offset="80%" stop-color="#f1f5f9" stop-opacity="0" />
      <stop offset="100%" stop-color="#f1f5f9" stop-opacity="0" />
    </radialGradient>

    <!-- Top Brand Ethereal Glow -->
    <radialGradient id="brandAura" cx="50%" cy="8%" r="30%">
      <stop offset="0%" stop-color="#0071e3" stop-opacity="0.07" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>

    <!-- MacBook Pro Display Clipping Path (Screen viewport with rounded top corners) -->
    <clipPath id="macbookScreenClip">
      <rect width="896" height="558" rx="8" />
    </clipPath>

    <!-- iPhone Screen Clipping Path -->
    <clipPath id="iphoneScreenClip">
      <rect width="254" height="520" rx="38" />
    </clipPath>

    <!-- Precision Drop Shadows -->
    <filter id="macbookLidShadow" x="-20%" y="-10%" width="150%" height="135%">
      <feDropShadow dx="0" dy="28" stdDeviation="34" flood-color="#0f172a" flood-opacity="0.16" />
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>

    <filter id="macbookBaseShadow" x="-15%" y="-30%" width="130%" height="220%">
      <feDropShadow dx="0" dy="32" stdDeviation="36" flood-color="#0f172a" flood-opacity="0.22" />
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>

    <filter id="iphoneShadow" x="-25%" y="-15%" width="160%" height="145%">
      <feDropShadow dx="-8" dy="28" stdDeviation="28" flood-color="#0f172a" flood-opacity="0.24" />
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0f172a" flood-opacity="0.10" />
    </filter>

    <filter id="goldenCardShadow" x="-15%" y="-15%" width="130%" height="135%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.07" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.03" />
    </filter>

    <!-- MacBook Aluminum Gradients -->
    <linearGradient id="macbookLidBevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9" />
      <stop offset="50%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>

    <linearGradient id="macbookBaseDeck" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#f1f5f9" />
      <stop offset="85%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>

    <linearGradient id="screenGloss" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.07" />
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.02" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- 1. STUDIO LIGHT GRADIENT BACKGROUND & AMBIENT AURAS -->
  <rect width="1200" height="3600" fill="url(#appleStudioBg)" />
  <circle cx="600" cy="300" r="500" fill="url(#brandAura)" />
  <ellipse cx="600" cy="1200" rx="580" ry="460" fill="url(#heroLaptopSpotlight)" />

  <!-- Subtle Studio Registration & Golden Ratio Calibration Crosshairs -->
  <g stroke="#94a3b8" stroke-width="1" stroke-opacity="0.25">
    <!-- Top-Left Calibration -->
    <line x1="80" y1="90" x2="100" y2="90" />
    <line x1="90" y1="80" x2="90" y2="100" />
    <text x="110" y="94" class="sf-text-semibold" font-size="10" fill="#94a3b8" letter-spacing="1.5">SCALE 1:3 &#8226; 2FT &#215; 6FT</text>

    <!-- Top-Right Calibration -->
    <line x1="1100" y1="90" x2="1120" y2="90" />
    <line x1="1110" y1="80" x2="1110" y2="100" />
    <text x="1090" y="94" class="sf-text-semibold" font-size="10" fill="#94a3b8" letter-spacing="1.5" text-anchor="end">GOLDEN RATIO &#934; 1.618</text>
  </g>

  <!-- =======================================================================
       ZONE 1: MONUMENTAL APPLE HERO STATEMENT & BRAND (Y: 90 - 640)
       Typographic Golden Ratio Progression · Authentic SF Pro · Radical Clarity
       ======================================================================= -->
  <g transform="translate(600, 105)">
    <!-- Minimalist Vector Shield Icon -->
    <g transform="translate(0, 0)">
      <g transform="translate(-16, 0) scale(0.92)">
        <path d="M18 3 L33 8 V16 C33 25 26.5 31.5 18 34 C9.5 31.5 3 25 3 16 V8 Z"
              fill="none" stroke="#0071e3" stroke-width="2.6" stroke-linejoin="round" />
        <circle cx="18" cy="15" r="4.2" fill="none" stroke="#0071e3" stroke-width="2" />
        <path d="M18 20 V25" stroke="#0071e3" stroke-width="2" stroke-linecap="round" />
      </g>
    </g>

    <!-- Apple Eyebrow Pill -->
    <g transform="translate(0, 75)">
      <rect x="-140" y="-16" width="280" height="32" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" filter="url(#goldenCardShadow)" />
      <circle cx="-116" cy="0" r="4" fill="#0071e3" />
      <text x="-102" y="4" class="sf-text-semibold" font-size="11" fill="#0f172a" letter-spacing="2">
        SENTINEL TELEMETRY
      </text>
    </g>

    <!-- Monumental Apple Headline (Golden Scaled, Zero Collision) -->
    <text x="0" y="175" class="sf-display-bold" font-size="62" fill="#0f172a" letter-spacing="-1.8" text-anchor="middle">
      Environmental intelligence.
    </text>
    <text x="0" y="248" class="sf-display-bold" font-size="62" fill="#0071e3" letter-spacing="-1.8" text-anchor="middle">
      Down to the molecule.
    </text>

    <!-- Truthful Sub-Headline (Comfortable line heights, zero overflow) -->
    <g transform="translate(0, 320)">
      <text x="0" y="0" class="sf-text-regular" font-size="22" fill="#475569" letter-spacing="-0.3" text-anchor="middle">
        Continuous optical CO2, temperature, and humidity sensing.
      </text>
      <text x="0" y="34" class="sf-text-regular" font-size="22" fill="#475569" letter-spacing="-0.3" text-anchor="middle">
        Custom ESP32 edge telemetry streaming directly to your live console.
      </text>
    </g>

    <!-- Architectural Spec Pill Row -->
    <g transform="translate(0, 410)">
      <rect x="-310" y="-18" width="620" height="36" rx="18" fill="rgba(255,255,255,0.75)" stroke="#cbd5e1" stroke-width="1" />
      <text x="0" y="5" class="sf-text-semibold" font-size="12" fill="#334155" letter-spacing="1.2" text-anchor="middle">
        ESP32 HARDWARE NODES &#8226; NEXT.JS 16 APP ROUTER &#8226; POSTGRESQL ENGINE
      </text>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 2: HERO PRODUCT STAGING — MACBOOK PRO 16″ & MOBILE (Y: 660 - 2160)
       Authentic Laptop Model · Aluminum Unibody · Real Dashboard Components
       ======================================================================= -->
  <g id="hero-laptop-stage" transform="translate(0, 680)">
    
    <!-- 1. MACBOOK PRO 16-INCH UNIBODY MODEL -->
    <g transform="translate(135, 120)">
      
      <!-- MacBook Display Lid (Total Lid: 930 x 580, Screen: 896 x 558) -->
      <g filter="url(#macbookLidShadow)">
        <!-- Outer CNC Milled Aluminum Enclosure -->
        <rect width="930" height="580" rx="16" fill="url(#macbookLidBevel)" stroke="#94a3b8" stroke-width="1.2" />
        
        <!-- Dark Bezel Frame -->
        <rect x="17" y="11" width="896" height="558" rx="8" fill="#050505" />

        <!-- Authentic Real Next.js Desktop Dashboard Screen -->
        <g transform="translate(17, 11)" clip-path="url(#macbookScreenClip)">
          <image href="data:image/png;base64,${desktopDashB64}" x="0" y="0" width="896" height="558" preserveAspectRatio="xMidYMid slice" />
          
          <!-- Gloss Reflection Gradient across Display -->
          <rect width="896" height="558" fill="url(#screenGloss)" />
        </g>

        <!-- Signature Apple Camera Notch at Top Center -->
        <g transform="translate(425, 11)">
          <path d="M 0 0 L 80 0 L 80 14 Q 80 18 76 18 L 4 18 Q 0 18 0 14 Z" fill="#050505" />
          <!-- FaceTime HD Camera Lens & Green Indicator Sensor -->
          <circle cx="40" cy="8" r="3.2" fill="#1e293b" />
          <circle cx="40" cy="8" r="1.4" fill="#0284c7" />
          <circle cx="56" cy="8" r="1.2" fill="#22c55e" opacity="0.85" />
        </g>
      </g>

      <!-- MacBook Lower Aluminum Base / Keyboard Chassis Deck -->
      <!-- Positioned right below the screen lid to create the open laptop perspective -->
      <g transform="translate(-35, 574)" filter="url(#macbookBaseShadow)">
        <!-- Aluminum Base Deck (Wider than lid: 1000px wide, 24px high) -->
        <path d="M 12 0 L 988 0 Q 1000 0 1000 8 L 994 18 Q 990 24 980 24 L 20 24 Q 10 24 6 18 L 0 8 Q 0 0 12 0 Z" 
              fill="url(#macbookBaseDeck)" stroke="#94a3b8" stroke-width="1" />
        
        <!-- Milled Thumb Opening Recess Notch (Centered on front edge) -->
        <rect x="450" y="0" width="100" height="7" rx="3.5" fill="#64748b" />

        <!-- Specular Highlight Line on Front Aluminum Bevel -->
        <line x1="20" y1="1" x2="980" y2="1" stroke="#ffffff" stroke-width="1" opacity="0.8" />

        <!-- Dark Hinge Channel Behind Lid -->
        <rect x="250" y="-3" width="500" height="4" rx="2" fill="#0f172a" />
      </g>
    </g>

    <!-- 2. FLOATING IPHONE 16 PRO COMPANION (Foreground Right) -->
    <g transform="translate(790, 360)" filter="url(#iphoneShadow)">
      <!-- Dark Titanium Outer Band -->
      <rect x="-6" y="-6" width="266" height="532" rx="44" fill="#1e293b" stroke="#64748b" stroke-width="1.8" />
      
      <!-- Screen Glass Area -->
      <g clip-path="url(#iphoneScreenClip)">
        <image href="data:image/png;base64,${mobileDashB64}" width="254" height="520" preserveAspectRatio="xMidYMid slice" />
        <rect width="254" height="520" fill="url(#screenGloss)" />
      </g>

      <!-- Apple Dynamic Island Notch -->
      <rect x="85" y="14" width="84" height="22" rx="11" fill="#000000" />
      <circle cx="150" cy="25" r="3.5" fill="#0369a1" />
    </g>

    <!-- 3. FLOATING REAL THRESHOLD ALERT CARD (Upper Left - Golden Ratio 1.618 Proportion) -->
    <!-- Width: 340, Height: 210 -> 340 / 210 = 1.619 (Exact Golden Ratio) -->
    <g transform="translate(70, 70)" filter="url(#goldenCardShadow)">
      <rect width="340" height="210" rx="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
      
      <!-- Top Alert Ribbon -->
      <g transform="translate(24, 26)">
        <rect width="136" height="26" rx="13" fill="#fef2f2" stroke="#fca5a5" stroke-width="1" />
        <circle cx="13" cy="13" r="4" fill="#ef4444" />
        <text x="26" y="17" class="sf-display-bold" font-size="11" fill="#dc2626" letter-spacing="1">
          THRESHOLD ALERT
        </text>
      </g>
      <text x="316" y="44" class="sf-text-semibold" font-size="12" fill="#64748b" text-anchor="end">
        Zone 01 &#8226; Lab
      </text>

      <!-- Real Metric Reading with Golden Visual Weight -->
      <g transform="translate(24, 98)">
        <text x="0" y="0" class="sf-display-bold" font-size="50" fill="#0f172a" letter-spacing="-1.5">
          1,639 <tspan font-size="20" class="sf-display-semibold" fill="#64748b">ppm</tspan>
        </text>
        <text x="0" y="24" class="sf-text-regular" font-size="13" fill="#475569">
          CO2 limit exceeded &#8226; Baseline: 400–600 ppm
        </text>
      </g>

      <!-- High-Tech Telemetry Sparkline Wave -->
      <g transform="translate(24, 148)">
        <rect width="292" height="42" rx="10" fill="#f8fafc" stroke="#f1f5f9" stroke-width="1" />
        <path d="M10 30 Q40 28 80 26 T150 24 T210 12 T250 8 L282 6" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="282" cy="6" r="4.5" fill="#ef4444" />
      </g>
    </g>

    <!-- 4. FLOATING HARDWARE TELEMETRY SYNC CHIP (Bottom Center) -->
    <g transform="translate(230, 700)" filter="url(#goldenCardShadow)">
      <rect width="480" height="88" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
      
      <g transform="translate(24, 26)">
        <circle cx="18" cy="18" r="18" fill="#eff6ff" stroke="#38bdf8" stroke-width="1.5" />
        <path d="M18 10 L12 21 H18 L16 27 L24 16 H18 Z" fill="#0071e3" />
      </g>

      <g transform="translate(78, 38)">
        <text x="0" y="0" class="sf-display-bold" font-size="18" fill="#0f172a" letter-spacing="-0.3">
          Continuous Edge Telemetry Sync
        </text>
        <text x="0" y="22" class="sf-text-regular" font-size="13" fill="#475569">
          ESP32 hardware streaming CO2, temp &amp; RH to Next.js dashboard
        </text>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 3: PERFORMANCE SPEC MATRIX & GOLDEN METRICS (Y: 2220 - 2740)
       Golden Ratio Proportions (316 x 195) · Zero Text Overflows · Truthful
       ======================================================================= -->
  <g id="performance-matrix" transform="translate(90, 2220)">
    <!-- Section Eyebrow -->
    <text x="510" y="0" class="sf-text-semibold" font-size="12" fill="#0071e3" letter-spacing="2.5" text-anchor="middle">
      SYSTEM PERFORMANCE SPECIFICATIONS
    </text>

    <!-- 3 Golden Ratio Cards (Width: 316, Height: 195 -> 316 / 195 = 1.620) -->
    <g transform="translate(0, 36)">
      
      <!-- Card 1: Hardware Cadence -->
      <g transform="translate(0, 0)">
        <rect width="316" height="195" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#goldenCardShadow)" />
        <g transform="translate(26, 46)">
          <text x="0" y="0" class="sf-display-bold" font-size="48" fill="#0f172a" letter-spacing="-1">~10s</text>
          <text x="0" y="32" class="sf-display-bold" font-size="18" fill="#1e293b">Hardware cadence.</text>
          <g transform="translate(0, 58)">
            <text x="0" y="0" class="sf-text-regular" font-size="13.5" fill="#475569">Autonomous sensor nodes</text>
            <text x="0" y="20" class="sf-text-regular" font-size="13.5" fill="#475569">stream readings roughly</text>
            <text x="0" y="40" class="sf-text-regular" font-size="13.5" fill="#475569">every 10 seconds.</text>
          </g>
        </g>
      </g>

      <!-- Card 2: Multi-Sensor Telemetry -->
      <g transform="translate(352, 0)">
        <rect width="316" height="195" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#goldenCardShadow)" />
        <g transform="translate(26, 46)">
          <text x="0" y="0" class="sf-display-bold" font-size="48" fill="#0071e3" letter-spacing="-1">CO2 &#8226; H2</text>
          <text x="0" y="32" class="sf-display-bold" font-size="18" fill="#1e293b">Multi-gas telemetry.</text>
          <g transform="translate(0, 58)">
            <text x="0" y="0" class="sf-text-regular" font-size="13.5" fill="#475569">Optical NDIR CO2 sensor,</text>
            <text x="0" y="20" class="sf-text-regular" font-size="13.5" fill="#475569">MQ-2 combustible gas,</text>
            <text x="0" y="40" class="sf-text-regular" font-size="13.5" fill="#475569">ambient temp &amp; humidity.</text>
          </g>
        </g>
      </g>

      <!-- Card 3: Instant Threshold Alarms -->
      <g transform="translate(704, 0)">
        <rect width="316" height="195" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#goldenCardShadow)" />
        <g transform="translate(26, 46)">
          <text x="0" y="0" class="sf-display-bold" font-size="48" fill="#16a34a" letter-spacing="-1">Instant</text>
          <text x="0" y="32" class="sf-display-bold" font-size="18" fill="#1e293b">Threshold alarms.</text>
          <g transform="translate(0, 58)">
            <text x="0" y="0" class="sf-text-regular" font-size="13.5" fill="#475569">Immediate visual alerts</text>
            <text x="0" y="20" class="sf-text-regular" font-size="13.5" fill="#475569">when hazard safety</text>
            <text x="0" y="40" class="sf-text-regular" font-size="13.5" fill="#475569">limits are breached.</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Secondary Tech Stack Pill Bar (Width: 1020, Height: 58) -->
    <g transform="translate(0, 260)">
      <rect width="1020" height="58" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />
      <g transform="translate(48, 36)">
        <circle cx="0" cy="-4" r="4.5" fill="#16a34a" />
        <text x="16" y="0" class="sf-text-semibold" font-size="13" fill="#0f172a">
          ESP32 Firmware
        </text>
      </g>
      <g transform="translate(295, 36)">
        <circle cx="0" cy="-4" r="4.5" fill="#0071e3" />
        <text x="16" y="0" class="sf-text-semibold" font-size="13" fill="#0f172a">
          Next.js 16 App Router
        </text>
      </g>
      <g transform="translate(580, 36)">
        <circle cx="0" cy="-4" r="4.5" fill="#9333ea" />
        <text x="16" y="0" class="sf-text-semibold" font-size="13" fill="#0f172a">
          Neon Serverless Postgres
        </text>
      </g>
      <g transform="translate(850, 36)">
        <circle cx="0" cy="-4" r="4.5" fill="#ea580c" />
        <text x="16" y="0" class="sf-text-semibold" font-size="13" fill="#0f172a">
          CSV Data Export
        </text>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 4: SYSTEM ARCHITECTURE & DEPLOYED PLATFORM SIGN-OFF (Y: 2780 - 3420)
       100% Truthful Sentinel IoT Stack · Zero Fake URLs · Master Composition
       ======================================================================= -->
  <g id="platform-architecture" transform="translate(0, 2760)">
    <!-- Fine Studio Divider Line with Gradient Fade -->
    <line x1="90" y1="0" x2="1110" y2="0" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="8 4" opacity="0.6" />

    <!-- 1. Centered Sentinel Brand Lockup -->
    <g transform="translate(600, 48)">
      <!-- Official Vector Shield Glyph -->
      <g transform="translate(-16, 0) scale(0.92)">
        <path d="M18 3 L33 8 V16 C33 25 26.5 31.5 18 34 C9.5 31.5 3 25 3 16 V8 Z"
              fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linejoin="round" />
        <circle cx="18" cy="15" r="4" fill="none" stroke="#0f172a" stroke-width="2" />
        <path d="M18 20 V25" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
      </g>

      <!-- Official Vector Wordmark Centered (width: 5146 -> scaled to 340px) -->
      <g transform="translate(-170, 46) scale(0.066)">
        <path d="${wordmarkD}" fill="#0f172a" />
      </g>

      <!-- Truthful Project Subtitle -->
      <text x="0" y="122" class="sf-text-semibold" font-size="19" fill="#475569" text-anchor="middle" letter-spacing="-0.2">
        Industrial Gas &amp; Environmental Telemetry Platform
      </text>
    </g>

    <!-- 2. Authentic 3-Pillar Architectural Breakdown (X: 90, Width: 1020) -->
    <g transform="translate(90, 205)">
      
      <!-- Card 1: Edge Hardware Nodes -->
      <g transform="translate(0, 0)">
        <rect width="316" height="225" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#goldenCardShadow)" />
        <g transform="translate(24, 28)">
          <rect width="112" height="22" rx="11" fill="#eff6ff" />
          <text x="56" y="15" class="sf-text-semibold" font-size="10" fill="#0071e3" letter-spacing="1" text-anchor="middle">
            HARDWARE
          </text>
          
          <text x="0" y="48" class="sf-display-bold" font-size="19" fill="#0f172a">
            ESP32 Sensor Nodes
          </text>

          <g transform="translate(0, 74)">
            <text x="0" y="0" class="sf-text-semibold" font-size="13" fill="#1e293b">&#8226; Optical NDIR CO2 Sensor</text>
            <text x="0" y="24" class="sf-text-regular" font-size="13" fill="#475569">&#8226; MQ-2 Combustible Gas</text>
            <text x="0" y="48" class="sf-text-regular" font-size="13" fill="#475569">&#8226; DHT22 Temp &amp; Humidity</text>
            <text x="0" y="72" class="sf-text-regular" font-size="13" fill="#475569">&#8226; Continuous WiFi Sync</text>
          </g>
        </g>
      </g>

      <!-- Card 2: Web Application Console -->
      <g transform="translate(352, 0)">
        <rect width="316" height="225" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#goldenCardShadow)" />
        <g transform="translate(24, 28)">
          <rect width="128" height="22" rx="11" fill="#f0fdf4" />
          <text x="64" y="15" class="sf-text-semibold" font-size="10" fill="#16a34a" letter-spacing="1" text-anchor="middle">
            WEB CONSOLE
          </text>
          
          <text x="0" y="48" class="sf-display-bold" font-size="19" fill="#0f172a">
            Next.js 16 Dashboard
          </text>

          <g transform="translate(0, 74)">
            <text x="0" y="0" class="sf-text-semibold" font-size="13" fill="#1e293b">&#8226; Live Telemetry Waveforms</text>
            <text x="0" y="24" class="sf-text-regular" font-size="13" fill="#475569">&#8226; Instant Threshold Alarms</text>
            <text x="0" y="48" class="sf-text-regular" font-size="13" fill="#475569">&#8226; Multi-Zone Health Status</text>
            <text x="0" y="72" class="sf-text-regular" font-size="13" fill="#475569">&#8226; Full-fidelity CSV Export</text>
          </g>
        </g>
      </g>

      <!-- Card 3: Persistent Data Layer -->
      <g transform="translate(704, 0)">
        <rect width="316" height="225" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#goldenCardShadow)" />
        <g transform="translate(24, 28)">
          <rect width="120" height="22" rx="11" fill="#faf5ff" />
          <text x="60" y="15" class="sf-text-semibold" font-size="10" fill="#9333ea" letter-spacing="1" text-anchor="middle">
            DATA ENGINE
          </text>
          
          <text x="0" y="48" class="sf-display-bold" font-size="19" fill="#0f172a">
            Postgres &amp; Drizzle
          </text>

          <g transform="translate(0, 74)">
            <text x="0" y="0" class="sf-text-semibold" font-size="13" fill="#1e293b">&#8226; Relational Sensor Records</text>
            <text x="0" y="24" class="sf-text-regular" font-size="13" fill="#475569">&#8226; Type-Safe Database Schema</text>
            <text x="0" y="48" class="sf-text-regular" font-size="13" fill="#475569">&#8226; Edge Ingestion REST API</text>
            <text x="0" y="72" class="sf-text-regular" font-size="13" fill="#475569">&#8226; Time-Series History Log</text>
          </g>
        </g>
      </g>
    </g>

    <!-- 3. Deployed Zones Operational Status Bar -->
    <g transform="translate(90, 460)">
      <rect width="1020" height="64" rx="18" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#goldenCardShadow)" />
      
      <g transform="translate(36, 38)">
        <text x="0" y="0" class="sf-text-semibold" font-size="11" fill="#64748b" letter-spacing="1.5">
          ACTIVE DEPLOYMENTS
        </text>
      </g>

      <g transform="translate(255, 38)">
        <circle cx="0" cy="-4" r="4.5" fill="#16a34a" />
        <text x="14" y="0" class="sf-text-semibold" font-size="13" fill="#0f172a">
          Zone 01: Lab &amp; Testing
        </text>
      </g>

      <g transform="translate(525, 38)">
        <circle cx="0" cy="-4" r="4.5" fill="#0071e3" />
        <text x="14" y="0" class="sf-text-semibold" font-size="13" fill="#0f172a">
          Zone 02: Production Floor
        </text>
      </g>

      <g transform="translate(805, 38)">
        <circle cx="0" cy="-4" r="4.5" fill="#9333ea" />
        <text x="14" y="0" class="sf-text-semibold" font-size="13" fill="#0f172a">
          Zone 03: Storage &amp; Air
        </text>
      </g>
    </g>

    <!-- 4. Technical Banner Specification Footnote (100% Truthful, Clear of Rollup Clamp) -->
    <g transform="translate(600, 565)">
      <text x="0" y="0" class="sf-text-semibold" font-size="12" fill="#64748b" letter-spacing="2" text-anchor="middle">
        SENTINEL &#8226; 2 FT &#215; 6 FT (24&#8243; &#215; 72&#8243; &#8226; 60.96 CM &#215; 182.88 CM) &#8226; 1:3 ASPECT RATIO ROLLUP BANNER
      </text>
      <text x="0" y="24" class="sf-text-regular" font-size="11" fill="#94a3b8" letter-spacing="1" text-anchor="middle">
        INDUSTRIAL ENVIRONMENTAL TELEMETRY &#8226; ESP32 &#8226; NEXT.JS 16 &#8226; POSTGRESQL
      </text>
    </g>

    <!-- Bottom 180px (Y: 640 to 840, i.e., banner Y: 3420 to 3600) is clear safety margin for floor stand clamp -->
  </g>
</svg>`;
}

async function main() {
  console.log('Building perfected Apple Studio White Edition with Laptop Model & Golden Ratio...');

  // 1. Build & Save SVG
  const svg = await buildStudioWhiteSvg();
  const svgPath = path.join(rollupDir, 'sentinel-banner-2x6ft-apple-studiowhite.svg');
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log('Saved SVG:', svgPath);

  // 2. Render 2400 x 7200 Print PNG via Chrome (for 100% authentic Apple SF Pro font execution)
  const pngPath = path.join(rollupDir, 'sentinel-banner-2x6ft-apple-studiowhite.png');
  const puppeteer = require('puppeteer-core');
  const tempHtmlPath = path.join(rollupDir, 'temp_render.html');
  fs.writeFileSync(tempHtmlPath, `<!DOCTYPE html><html><head><meta charset="utf-8"><style>* { margin: 0; padding: 0; } html, body { width: 1200px; height: 3600px; overflow: hidden; background: #fff; } svg { width: 1200px; height: 3600px; display: block; }</style></head><body>${svg}</body></html>`);

  console.log('Rendering 2400 x 7200 Print PNG via Google Chrome (True Apple SF Pro)...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 3600, deviceScaleFactor: 2 });
  await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.screenshot({ path: pngPath, type: 'png' });
  await browser.close();
  try { fs.unlinkSync(tempHtmlPath); } catch (e) {}
  console.log('Saved PNG via Chrome:', pngPath);

  // 3. Generate Official Print PDF (24" x 72" / 1728 x 5184 pt)
  const pdfPath = path.join(rollupDir, 'sentinel-banner-2x6ft-apple-studiowhite.pdf');
  console.log('Generating 2ft x 6ft Print PDF via PDFKit...');
  
  const doc = new PDFDocument({
    size: [1728, 5184], // 24" x 72" in points (72 points/inch)
    margins: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  const pdfStream = fs.createWriteStream(pdfPath);
  doc.pipe(pdfStream);
  
  // Embed high-res PNG into full bleed
  doc.image(pngPath, 0, 0, {
    width: 1728,
    height: 5184
  });
  doc.end();

  await new Promise((resolve, reject) => {
    pdfStream.on('finish', resolve);
    pdfStream.on('error', reject);
  });
  console.log('Saved PDF:', pdfPath);

  // 4. Copy to public directory for instant web preview / download
  console.log('Syncing to public directory...');
  const filesToSync = [
    'sentinel-banner-2x6ft-apple-studiowhite.svg',
    'sentinel-banner-2x6ft-apple-studiowhite.png',
    'sentinel-banner-2x6ft-apple-studiowhite.pdf'
  ];

  for (const f of filesToSync) {
    fs.copyFileSync(path.join(rollupDir, f), path.join(pubRollupDir, f));
  }

  console.log('All files built and synced successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
