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

// Load real assets as base64
function toBase64(filePath) {
  return fs.readFileSync(filePath).toString('base64');
}

const desktopDashB64 = toBase64(path.join(screensDir, 'sentinel-real-dashboard-desktop.png'));
const mobileDashB64 = toBase64(path.join(screensDir, 'sentinel-real-dashboard-mobile.png'));
const co2CardB64 = toBase64(path.join(compsDir, 'real-comp-co2-gas-card.png'));
const co2ChartB64 = toBase64(path.join(compsDir, 'real-comp-co2-trend-chart.png'));
const tempCardB64 = toBase64(path.join(compsDir, 'real-comp-temperature-card.png'));

// Extract official SVG wordmark path from extracted_glyphs.json
let wordmarkD = '';
try {
  const glyphs = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_glyphs.json'), 'utf8'));
  wordmarkD = glyphs.wordmark.d;
} catch (e) {
  console.log('Error loading wordmark:', e.message);
}

async function getQrInner(url, darkColor = '#000000', lightColor = '#ffffff') {
  const svg = await qrcode.toString(url, {
    type: 'svg',
    margin: 0,
    color: {
      dark: darkColor,
      light: lightColor
    }
  });
  return svg.replace(/<\?xml.*?\?>/, '').replace(/<svg[^>]*>/, '').replace('</svg>', '');
}

/* =========================================================================
   APPLE SPACE BLACK EDITION ("Pro Keynote / Billboard")
   Pure OLED Black (#000000), specular titanium rims, monumental typography,
   floating Studio Display & iPhone 16 Pro running the authentic Sentinel app.
   ========================================================================= */
async function buildAppleSpaceBlackSvg() {
  const qrInner = await getQrInner('https://sentinel.io', '#000000', '#ffffff');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 3600" width="1200" height="3600">
  <defs>
    <!-- Apple Titanium / Iridescent Gradients -->
    <linearGradient id="appleTitanium" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#cbd5e1" />
      <stop offset="70%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>

    <linearGradient id="appleLaserGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="40%" stop-color="#818cf8" />
      <stop offset="70%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#f472b6" />
    </linearGradient>

    <linearGradient id="appleBlueAura" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#0284c7" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </linearGradient>

    <radialGradient id="displayBacklight" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#1e40af" stop-opacity="0.4" />
      <stop offset="50%" stop-color="#0284c7" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Studio Floor Reflection Gradient -->
    <linearGradient id="floorFade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.9" />
    </linearGradient>

    <!-- Apple Precision Specular Lighting Filters -->
    <filter id="appleStudioShadow" x="-20%" y="-10%" width="150%" height="130%">
      <feDropShadow dx="0" dy="50" stdDeviation="60" flood-color="#000000" flood-opacity="0.9" />
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0284c7" flood-opacity="0.25" />
    </filter>

    <filter id="phoneAppleShadow" x="-30%" y="-20%" width="160%" height="150%">
      <feDropShadow dx="-10" dy="45" stdDeviation="50" flood-color="#000000" flood-opacity="0.95" />
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#38bdf8" flood-opacity="0.3" />
    </filter>

    <filter id="glassWidgetShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="30" stdDeviation="35" flood-color="#000000" flood-opacity="0.8" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#ffffff" flood-opacity="0.1" />
    </filter>

    <clipPath id="studioDisplayClip">
      <rect width="940" height="588" rx="8" />
    </clipPath>

    <clipPath id="iphone16Clip">
      <rect width="280" height="606" rx="42" />
    </clipPath>
  </defs>

  <!-- 1. PURE SPACE BLACK CANVAS (#000000) -->
  <rect width="1200" height="3600" fill="#000000" />
  
  <!-- Subtle Top Atmospheric Gradient -->
  <rect width="1200" height="1200" fill="url(#appleBlueAura)" />
  
  <!-- Massive Backlight Aura Behind Device Stage -->
  <ellipse cx="600" cy="1480" rx="550" ry="420" fill="url(#displayBacklight)" />

  <!-- =======================================================================
       ZONE 1: THE REVEAL & APPLE MONUMENTAL TYPOGRAPHY (Y: 100 - 680)
       ======================================================================= -->
  <g transform="translate(600, 120)">
    <!-- Minimalist Top Shield Icon Lockup -->
    <g transform="translate(0, 0)">
      <!-- Apple-grade Silver Shield Glyph -->
      <g transform="translate(-18, 0) scale(0.9)">
        <path d="M20 4 L36 10 V20 C36 30 29 37 20 40 C11 37 4 30 4 20 V10 Z"
              fill="none" stroke="url(#appleTitanium)" stroke-width="2.5" />
        <circle cx="20" cy="18" r="4.5" fill="none" stroke="url(#appleTitanium)" stroke-width="2" />
        <path d="M20 24 V28" stroke="url(#appleTitanium)" stroke-width="2" stroke-linecap="round" />
      </g>
    </g>

    <!-- Sub-Brand Tracking -->
    <text x="0" y="78" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#94a3b8" letter-spacing="6" text-anchor="middle">
      SENTINEL PRO
    </text>

    <!-- Monumental Keynote Headline (70px Ultra-bold) -->
    <g transform="translate(0, 175)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="68" fill="#ffffff" letter-spacing="-2" text-anchor="middle">
        Hazard detection.
      </text>
      <text x="0" y="80" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="68" fill="url(#appleLaserGlow)" letter-spacing="-2" text-anchor="middle">
        Down to the molecule.
      </text>
    </g>

    <!-- Apple Sub-Headline (Clean, Conversational, Confident) -->
    <g transform="translate(0, 375)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="24" fill="#94a3b8" letter-spacing="-0.3" text-anchor="middle">
        Continuous real-time gas telemetry. Sub-second response.
      </text>
      <text x="0" y="36" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="24" fill="#94a3b8" letter-spacing="-0.3" text-anchor="middle">
        Engineered for the world&apos;s most demanding facilities.
      </text>
    </g>

    <!-- Apple Status Pill -->
    <g transform="translate(-160, 470)">
      <rect width="320" height="42" rx="21" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="1.2" />
      <circle cx="26" cy="21" r="4.5" fill="#38bdf8">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="44" y="27" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="13" fill="#ffffff" letter-spacing="2">
        PRO TELEMETRY ARCHITECTURE
      </text>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 2: THE HERO STAGING — STUDIO DISPLAY & IPHONE 16 PRO (Y: 740 - 2150)
       Exquisite hardware chassis, specular rim lighting, real running Next.js app
       ======================================================================= -->
  <g id="apple-hero-stage" transform="translate(100, 750)">
    
    <!-- 1. THE STUDIO DISPLAY / PRO MONITOR (Width: 970, Height: 618) -->
    <g transform="translate(15, 60)" filter="url(#appleStudioShadow)">
      <!-- Aluminum / Titanium Unibody Chassis -->
      <rect width="970" height="618" rx="24" fill="#0b0f17" stroke="#334155" stroke-width="2.5" />
      
      <!-- Razor-thin 15px Titanium Bezel Frame -->
      <rect x="15" y="15" width="940" height="588" rx="10" fill="#000000" />

      <!-- Top Center Apple Camera Dot -->
      <circle cx="485" cy="8" r="3" fill="#1e293b" />
      <circle cx="485" cy="8" r="1.2" fill="#000000" />

      <!-- Screen Contents: Authentic Next.js Desktop Dashboard -->
      <g transform="translate(15, 15)" clip-path="url(#studioDisplayClip)">
        <image href="data:image/png;base64,${desktopDashB64}" x="0" y="0" width="940" height="588" preserveAspectRatio="xMidYMid slice" />
        
        <!-- Glass Specular Highlight Sheen diagonally across top left -->
        <path d="M0 0 L450 0 L250 588 L0 588 Z" fill="url(#appleTitanium)" opacity="0.03" />
      </g>

      <!-- Specular Top Rim Light -->
      <line x1="40" y1="0" x2="930" y2="0" stroke="url(#appleTitanium)" stroke-width="1.8" opacity="0.7" />
    </g>

    <!-- 2. FLOATING IPHONE 16 PRO (Foreground Right — Dynamic Depth) -->
    <g transform="translate(730, 240)" filter="url(#phoneAppleShadow)">
      <!-- Deep Space Black Titanium Chassis -->
      <rect x="-8" y="-8" width="296" height="622" rx="50" fill="#020617" stroke="#475569" stroke-width="2.5" />
      
      <!-- Screen Display -->
      <g clip-path="url(#iphone16Clip)">
        <image href="data:image/png;base64,${mobileDashB64}" width="280" height="606" preserveAspectRatio="xMidYMid slice" />
        
        <!-- Subtle Screen Glass Reflection -->
        <path d="M0 0 L280 0 L140 606 L0 606 Z" fill="#ffffff" opacity="0.04" />
      </g>

      <!-- Dynamic Island Pill -->
      <rect x="90" y="12" width="100" height="24" rx="12" fill="#000000" />
      <circle cx="166" cy="24" r="3.5" fill="#1e293b" />

      <!-- Specular Side Titanium Rims -->
      <line x1="-8" y1="80" x2="-8" y2="520" stroke="#94a3b8" stroke-width="1.5" opacity="0.6" />
    </g>

    <!-- 3. FLOATING FROSTED GLASS CALLOUT: THE CRITICAL SPIKE (Top Left) -->
    <g transform="translate(-30, 0)" filter="url(#glassWidgetShadow)">
      <!-- Frosted Glassmorphism Card -->
      <rect width="360" height="210" rx="20" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
      
      <!-- Top Red Alert Pill -->
      <g transform="translate(20, 24)">
        <rect width="130" height="26" rx="13" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1" />
        <circle cx="14" cy="13" r="4" fill="#ef4444" />
        <text x="26" y="17" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="11" fill="#fca5a5" letter-spacing="1">
          DANGER SPIKE
        </text>
      </g>
      <text x="340" y="42" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="600" font-size="12" fill="#94a3b8" text-anchor="end">
        Zone 01 &#8226; Lab
      </text>

      <!-- Monumental Metric -->
      <g transform="translate(20, 95)">
        <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="52" fill="#ffffff" letter-spacing="-1">
          1,639 <tspan font-size="22" font-weight="600" fill="#94a3b8">ppm</tspan>
        </text>
        <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="500" font-size="13" fill="#cbd5e1">
          Threshold breached &#8226; Automated Siren Dispatched
        </text>
      </g>

      <!-- Mini Sparkline Wave -->
      <g transform="translate(20, 140)">
        <rect width="320" height="42" rx="8" fill="rgba(0,0,0,0.4)" />
        <path d="M10 28 Q40 28 70 26 T130 24 T190 22 T240 8 T280 6 L310 4" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="310" cy="4" r="4" fill="#ef4444" />
      </g>
    </g>

    <!-- 4. FLOATING FROSTED GLASS CALLOUT: SUB-SECOND TELEMETRY (Bottom Center) -->
    <g transform="translate(210, 580)" filter="url(#glassWidgetShadow)">
      <rect width="480" height="96" rx="20" fill="rgba(15,23,42,0.85)" stroke="rgba(56,189,248,0.3)" stroke-width="1.5" />
      
      <g transform="translate(24, 30)">
        <circle cx="18" cy="18" r="18" fill="rgba(37,99,235,0.25)" stroke="#38bdf8" stroke-width="1.5" />
        <path d="M18 10 L12 21 H18 L16 27 L24 16 H18 Z" fill="#38bdf8" />
      </g>

      <g transform="translate(80, 42)">
        <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="-0.5">
          &lt; 0.02s Stream Latency
        </text>
        <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="500" font-size="13" fill="#94a3b8">
          Sub-second MQTT telemetry direct from ESP32 edge sensors
        </text>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 3: APPLE PRO PERFORMANCE SPEC MATRIX (Y: 2280 - 2860)
       Giant clean typography, three monumental columns (Classic Apple Keynote)
       ======================================================================= -->
  <g id="apple-specs" transform="translate(100, 2300)">
    <!-- Section Eyebrow -->
    <text x="500" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="14" fill="#38bdf8" letter-spacing="4" text-anchor="middle">
      PRO ARCHITECTURE SPECIFICATIONS
    </text>

    <!-- 3-Pillar Clean Grid (Apple Keynote Style) -->
    <g transform="translate(0, 50)">
      
      <!-- Pillar 1: Latency -->
      <g transform="translate(0, 0)">
        <rect width="310" height="240" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <g transform="translate(30, 55)">
          <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="54" fill="#ffffff" letter-spacing="-2">
            0.02s
          </text>
          <text x="0" y="38" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="18" fill="#ffffff">
            Sub-second streaming.
          </text>
          <text x="0" y="66" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="14" fill="#94a3b8" line-height="1.4">
            Direct MQTT broker streams over Server-Sent Events with sub-second spike detection.
          </text>
        </g>
      </g>

      <!-- Pillar 2: Security -->
      <g transform="translate(345, 0)">
        <rect width="310" height="240" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <g transform="translate(30, 55)">
          <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="54" fill="#38bdf8" letter-spacing="-2">
            AES-256
          </text>
          <text x="0" y="38" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="18" fill="#ffffff">
            Hardware encrypted.
          </text>
          <text x="0" y="66" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="14" fill="#94a3b8" line-height="1.4">
            Decentralized ESP32 mesh nodes operate offline with local memory buffers.
          </text>
        </g>
      </g>

      <!-- Pillar 3: Sovereignty -->
      <g transform="translate(690, 0)">
        <rect width="310" height="240" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <g transform="translate(30, 55)">
          <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="54" fill="#c084fc" letter-spacing="-2">
            Zero
          </text>
          <text x="0" y="38" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="18" fill="#ffffff">
            Cloud lock-in.
          </text>
          <text x="0" y="66" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="14" fill="#94a3b8" line-height="1.4">
            Air-gapped deployment, complete data sovereignty, and one-click audit exports.
          </text>
        </g>
      </g>
    </g>

    <!-- Secondary Capability Bar -->
    <g transform="translate(0, 320)">
      <rect width="1000" height="64" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      <g transform="translate(36, 40)">
        <circle cx="0" cy="-4" r="5" fill="#10b981" />
        <text x="18" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="15" fill="#ffffff">
          Physical Siren Relays
        </text>
      </g>
      <g transform="translate(280, 40)">
        <circle cx="0" cy="-4" r="5" fill="#38bdf8" />
        <text x="18" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="15" fill="#ffffff">
          Optical NDIR &amp; MQ Sensors
        </text>
      </g>
      <g transform="translate(560, 40)">
        <circle cx="0" cy="-4" r="5" fill="#a855f7" />
        <text x="18" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="15" fill="#ffffff">
          Next.js App Router Native
        </text>
      </g>
      <g transform="translate(830, 40)">
        <circle cx="0" cy="-4" r="5" fill="#f59e0b" />
        <text x="18" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="15" fill="#ffffff">
          Open Source
        </text>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 4: THE APPLE FOOTER & EXPERIMENTAL QR DEMO (Y: 2900 - 3480)
       Understated, confident, immaculate contrast
       ======================================================================= -->
  <g id="apple-footer" transform="translate(0, 2900)">
    <!-- Top Divider Line -->
    <line x1="100" y1="0" x2="1100" y2="0" stroke="rgba(255,255,255,0.12)" stroke-width="1" />

    <g transform="translate(100, 60)">
      <!-- Left: Apple-Style Vector QR Card -->
      <g transform="translate(0, 0)">
        <rect width="260" height="340" rx="24" fill="#ffffff" />
        
        <!-- Scannable Vector QR Code -->
        <g transform="translate(40, 36) scale(6.666)">
          ${qrInner}
        </g>

        <!-- QR Bottom Pill -->
        <g transform="translate(130, 255)">
          <rect x="-95" y="0" width="190" height="32" rx="16" fill="#000000" />
          <text x="0" y="21" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">
            EXPERIENCE LIVE DEMO
          </text>
        </g>
        <text x="130" y="315" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="500" font-size="12" fill="#64748b" text-anchor="middle">
          Point camera to explore
        </text>
      </g>

      <!-- Right: Pure Apple Brand Lockup & Linkage -->
      <g transform="translate(320, 30)">
        <!-- Official Vector Wordmark -->
        <g transform="scale(0.08)">
          <path d="${wordmarkD}" fill="#ffffff" />
        </g>

        <text x="0" y="110" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="-1">
          sentinel.io
        </text>

        <text x="0" y="148" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="20" fill="#94a3b8">
          The open environmental telemetry standard.
        </text>

        <!-- Direct Action Grid -->
        <g transform="translate(0, 195)">
          <!-- Cloud App -->
          <g transform="translate(0, 0)">
            <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="13" fill="#38bdf8" letter-spacing="1">CLOUD CONSOLE</text>
            <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="20" fill="#ffffff">app.sentinel.io</text>
          </g>

          <!-- GitHub Core -->
          <g transform="translate(280, 0)">
            <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="13" fill="#c084fc" letter-spacing="1">OPEN SOURCE</text>
            <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="20" fill="#ffffff">github.com/sentinel</text>
          </g>

          <!-- Enterprise -->
          <g transform="translate(0, 68)">
            <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="13" fill="#10b981" letter-spacing="1">FACILITY INQUIRIES</text>
            <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="20" fill="#ffffff">contact@sentinel.io</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Bottom Safety Buffer (Keep clear of mechanical stand clamps) -->
    <g transform="translate(100, 520)">
      <text x="500" y="20" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="600" font-size="12" fill="#475569" letter-spacing="2" text-anchor="middle">
        SENTINEL PRO &#8226; 2 FT &#215; 6 FT (24&#8243; &#215; 72&#8243; &#8226; 60.96 CM &#215; 182.88 CM) &#8226; 1:3 ASPECT RATIO
      </text>
    </g>
  </g>
</svg>`;
}

/* =========================================================================
   APPLE STUDIO WHITE EDITION ("Apple Store Retail / Clean Lab")
   Pure #fbfbfd studio canvas, soft ambient shadow, dark titanium typography.
   ========================================================================= */
async function buildAppleStudioWhiteSvg() {
  const qrInner = await getQrInner('https://sentinel.io', '#000000', '#ffffff');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 3600" width="1200" height="3600">
  <defs>
    <!-- Apple Studio Light Gradients -->
    <linearGradient id="appleWhiteBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#fbfbfd" />
      <stop offset="70%" stop-color="#f5f5f7" />
      <stop offset="100%" stop-color="#e5e5ea" />
    </linearGradient>

    <linearGradient id="appleDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d1d1f" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>

    <linearGradient id="appleBlueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0071e3" />
      <stop offset="100%" stop-color="#43a047" />
    </linearGradient>

    <!-- Super Soft Studio Diffused Shadows -->
    <filter id="whiteStudioShadow" x="-20%" y="-10%" width="150%" height="130%">
      <feDropShadow dx="0" dy="40" stdDeviation="45" flood-color="#000000" flood-opacity="0.14" />
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.08" />
    </filter>

    <filter id="whitePhoneShadow" x="-30%" y="-20%" width="160%" height="150%">
      <feDropShadow dx="-8" dy="36" stdDeviation="40" flood-color="#000000" flood-opacity="0.22" />
    </filter>

    <filter id="whiteWidgetShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.12" />
    </filter>

    <clipPath id="whiteStudioClip">
      <rect width="940" height="588" rx="8" />
    </clipPath>

    <clipPath id="whitePhoneClip">
      <rect width="280" height="606" rx="42" />
    </clipPath>
  </defs>

  <!-- 1. APPLE STUDIO WHITE CANVAS -->
  <rect width="1200" height="3600" fill="url(#appleWhiteBg)" />
  
  <!-- Subtle Top Ambient Soft Wave -->
  <path d="M0 0 L1200 0 L1200 480 Q600 620 0 480 Z" fill="#ffffff" opacity="0.6" />

  <!-- =======================================================================
       ZONE 1: THE REVEAL & APPLE TYPOGRAPHY (Y: 100 - 680)
       ======================================================================= -->
  <g transform="translate(600, 120)">
    <!-- Minimalist Top Shield Icon Lockup -->
    <g transform="translate(0, 0)">
      <g transform="translate(-18, 0) scale(0.9)">
        <path d="M20 4 L36 10 V20 C36 30 29 37 20 40 C11 37 4 30 4 20 V10 Z"
              fill="none" stroke="#1d1d1f" stroke-width="2.5" />
        <circle cx="20" cy="18" r="4.5" fill="none" stroke="#1d1d1f" stroke-width="2" />
        <path d="M20 24 V28" stroke="#1d1d1f" stroke-width="2" stroke-linecap="round" />
      </g>
    </g>

    <!-- Sub-Brand Tracking -->
    <text x="0" y="78" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="15" fill="#6e6e73" letter-spacing="6" text-anchor="middle">
      SENTINEL PRO
    </text>

    <!-- Monumental Headline -->
    <g transform="translate(0, 175)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="68" fill="#1d1d1f" letter-spacing="-2" text-anchor="middle">
        Hazard detection.
      </text>
      <text x="0" y="80" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="68" fill="#0071e3" letter-spacing="-2" text-anchor="middle">
        Down to the molecule.
      </text>
    </g>

    <!-- Apple Sub-Headline -->
    <g transform="translate(0, 375)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="24" fill="#6e6e73" letter-spacing="-0.3" text-anchor="middle">
        Continuous real-time gas telemetry. Sub-second response.
      </text>
      <text x="0" y="36" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="24" fill="#6e6e73" letter-spacing="-0.3" text-anchor="middle">
        Engineered for the world&apos;s most demanding facilities.
      </text>
    </g>

    <!-- Apple Status Pill -->
    <g transform="translate(-160, 470)">
      <rect width="320" height="42" rx="21" fill="#ffffff" stroke="#d2d2d7" stroke-width="1.2" filter="url(#whiteWidgetShadow)" />
      <circle cx="26" cy="21" r="4.5" fill="#0071e3" />
      <text x="44" y="27" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="600" font-size="13" fill="#1d1d1f" letter-spacing="2">
        PRO TELEMETRY ARCHITECTURE
      </text>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 2: THE HERO STAGING — STUDIO DISPLAY & IPHONE 16 PRO (Y: 740 - 2150)
       ======================================================================= -->
  <g id="apple-hero-stage" transform="translate(100, 750)">
    
    <!-- 1. THE STUDIO DISPLAY / PRO MONITOR (Light Edition) -->
    <g transform="translate(15, 60)" filter="url(#whiteStudioShadow)">
      <rect width="970" height="618" rx="24" fill="#ffffff" stroke="#d2d2d7" stroke-width="2" />
      <rect x="15" y="15" width="940" height="588" rx="10" fill="#000000" />
      <circle cx="485" cy="8" r="3" fill="#86868b" />

      <!-- Authentic Desktop Screen -->
      <g transform="translate(15, 15)" clip-path="url(#whiteStudioClip)">
        <image href="data:image/png;base64,${desktopDashB64}" x="0" y="0" width="940" height="588" preserveAspectRatio="xMidYMid slice" />
      </g>
    </g>

    <!-- 2. FLOATING IPHONE 16 PRO -->
    <g transform="translate(730, 240)" filter="url(#whitePhoneShadow)">
      <rect x="-8" y="-8" width="296" height="622" rx="50" fill="#000000" stroke="#86868b" stroke-width="2" />
      <g clip-path="url(#whitePhoneClip)">
        <image href="data:image/png;base64,${mobileDashB64}" width="280" height="606" preserveAspectRatio="xMidYMid slice" />
      </g>
      <rect x="90" y="12" width="100" height="24" rx="12" fill="#000000" />
      <circle cx="166" cy="24" r="3.5" fill="#1e293b" />
    </g>

    <!-- 3. FLOATING FROSTED GLASS CALLOUT: DANGER SPIKE -->
    <g transform="translate(-30, 0)" filter="url(#whiteWidgetShadow)">
      <rect width="360" height="210" rx="20" fill="#ffffff" stroke="#e5e5ea" stroke-width="1.5" />
      
      <g transform="translate(20, 24)">
        <rect width="130" height="26" rx="13" fill="#fef2f2" stroke="#ef4444" stroke-width="1" />
        <circle cx="14" cy="13" r="4" fill="#ef4444" />
        <text x="26" y="17" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="11" fill="#dc2626" letter-spacing="1">
          DANGER SPIKE
        </text>
      </g>
      <text x="340" y="42" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="600" font-size="12" fill="#86868b" text-anchor="end">
        Zone 01 &#8226; Lab
      </text>

      <g transform="translate(20, 95)">
        <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="52" fill="#1d1d1f" letter-spacing="-1">
          1,639 <tspan font-size="22" font-weight="600" fill="#86868b">ppm</tspan>
        </text>
        <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="500" font-size="13" fill="#6e6e73">
          Threshold breached &#8226; Automated Siren Dispatched
        </text>
      </g>

      <g transform="translate(20, 140)">
        <rect width="320" height="42" rx="8" fill="#f8fafc" stroke="#f1f5f9" stroke-width="1" />
        <path d="M10 28 Q40 28 70 26 T130 24 T190 22 T240 8 T280 6 L310 4" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="310" cy="4" r="4" fill="#ef4444" />
      </g>
    </g>

    <!-- 4. FLOATING FROSTED GLASS CALLOUT: SUB-SECOND TELEMETRY -->
    <g transform="translate(210, 580)" filter="url(#whiteWidgetShadow)">
      <rect width="480" height="96" rx="20" fill="#ffffff" stroke="#e5e5ea" stroke-width="1.5" />
      
      <g transform="translate(24, 30)">
        <circle cx="18" cy="18" r="18" fill="#eff6ff" stroke="#0071e3" stroke-width="1.5" />
        <path d="M18 10 L12 21 H18 L16 27 L24 16 H18 Z" fill="#0071e3" />
      </g>

      <g transform="translate(80, 42)">
        <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="20" fill="#1d1d1f" letter-spacing="-0.5">
          &lt; 0.02s Stream Latency
        </text>
        <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="500" font-size="13" fill="#6e6e73">
          Sub-second MQTT telemetry direct from ESP32 edge sensors
        </text>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 3: APPLE PRO PERFORMANCE SPEC MATRIX (Y: 2280 - 2860)
       ======================================================================= -->
  <g id="apple-specs" transform="translate(100, 2300)">
    <text x="500" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="14" fill="#0071e3" letter-spacing="4" text-anchor="middle">
      PRO ARCHITECTURE SPECIFICATIONS
    </text>

    <g transform="translate(0, 50)">
      <!-- Pillar 1 -->
      <g transform="translate(0, 0)">
        <rect width="310" height="240" rx="20" fill="#ffffff" stroke="#e5e5ea" stroke-width="1.5" filter="url(#whiteWidgetShadow)" />
        <g transform="translate(30, 55)">
          <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="54" fill="#1d1d1f" letter-spacing="-2">
            0.02s
          </text>
          <text x="0" y="38" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="18" fill="#1d1d1f">
            Sub-second speed.
          </text>
          <text x="0" y="66" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="14" fill="#6e6e73" line-height="1.4">
            Direct MQTT broker streams over Server-Sent Events with sub-second spike detection.
          </text>
        </g>
      </g>

      <!-- Pillar 2 -->
      <g transform="translate(345, 0)">
        <rect width="310" height="240" rx="20" fill="#ffffff" stroke="#e5e5ea" stroke-width="1.5" filter="url(#whiteWidgetShadow)" />
        <g transform="translate(30, 55)">
          <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="54" fill="#0071e3" letter-spacing="-2">
            AES-256
          </text>
          <text x="0" y="38" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="18" fill="#1d1d1f">
            Hardware encrypted.
          </text>
          <text x="0" y="66" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="14" fill="#6e6e73" line-height="1.4">
            Decentralized ESP32 mesh nodes operate offline with local memory buffers.
          </text>
        </g>
      </g>

      <!-- Pillar 3 -->
      <g transform="translate(690, 0)">
        <rect width="310" height="240" rx="20" fill="#ffffff" stroke="#e5e5ea" stroke-width="1.5" filter="url(#whiteWidgetShadow)" />
        <g transform="translate(30, 55)">
          <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="54" fill="#6b21a8" letter-spacing="-2">
            Zero
          </text>
          <text x="0" y="38" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="18" fill="#1d1d1f">
            Cloud lock-in.
          </text>
          <text x="0" y="66" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="14" fill="#6e6e73" line-height="1.4">
            Air-gapped deployment, complete data sovereignty, and one-click audit exports.
          </text>
        </g>
      </g>
    </g>

    <!-- Secondary Capability Bar -->
    <g transform="translate(0, 320)">
      <rect width="1000" height="64" rx="16" fill="#ffffff" stroke="#e5e5ea" stroke-width="1.2" />
      <g transform="translate(36, 40)">
        <circle cx="0" cy="-4" r="5" fill="#16a34a" />
        <text x="18" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="15" fill="#1d1d1f">
          Physical Siren Relays
        </text>
      </g>
      <g transform="translate(280, 40)">
        <circle cx="0" cy="-4" r="5" fill="#0071e3" />
        <text x="18" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="15" fill="#1d1d1f">
          Optical NDIR &amp; MQ Sensors
        </text>
      </g>
      <g transform="translate(560, 40)">
        <circle cx="0" cy="-4" r="5" fill="#9333ea" />
        <text x="18" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="15" fill="#1d1d1f">
          Next.js App Router Native
        </text>
      </g>
      <g transform="translate(830, 40)">
        <circle cx="0" cy="-4" r="5" fill="#ea580c" />
        <text x="18" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="15" fill="#1d1d1f">
          Open Source
        </text>
      </g>
    </g>
  </g>

  <!-- =======================================================================
       ZONE 4: APPLE FOOTER & EXPERIMENTAL QR DEMO (Y: 2900 - 3480)
       ======================================================================= -->
  <g id="apple-footer" transform="translate(0, 2900)">
    <rect width="1200" height="700" fill="#1d1d1f" />
    <line x1="0" y1="0" x2="1200" y2="0" stroke="rgba(255,255,255,0.15)" stroke-width="1" />

    <g transform="translate(100, 60)">
      <!-- Left: Apple-Style Vector QR Card -->
      <g transform="translate(0, 0)">
        <rect width="260" height="340" rx="24" fill="#ffffff" />
        
        <g transform="translate(40, 36) scale(6.666)">
          ${qrInner}
        </g>

        <g transform="translate(130, 255)">
          <rect x="-95" y="0" width="190" height="32" rx="16" fill="#000000" />
          <text x="0" y="21" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">
            EXPERIENCE LIVE DEMO
          </text>
        </g>
        <text x="130" y="315" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="500" font-size="12" fill="#64748b" text-anchor="middle">
          Point camera to explore
        </text>
      </g>

      <!-- Right: Brand Lockup & Linkage -->
      <g transform="translate(320, 30)">
        <g transform="scale(0.08)">
          <path d="${wordmarkD}" fill="#ffffff" />
        </g>

        <text x="0" y="110" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="-1">
          sentinel.io
        </text>

        <text x="0" y="148" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="400" font-size="20" fill="#94a3b8">
          The open environmental telemetry standard.
        </text>

        <g transform="translate(0, 195)">
          <g transform="translate(0, 0)">
            <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="13" fill="#38bdf8" letter-spacing="1">CLOUD CONSOLE</text>
            <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="20" fill="#ffffff">app.sentinel.io</text>
          </g>

          <g transform="translate(280, 0)">
            <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="13" fill="#c084fc" letter-spacing="1">OPEN SOURCE</text>
            <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="20" fill="#ffffff">github.com/sentinel</text>
          </g>

          <g transform="translate(0, 68)">
            <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="13" fill="#10b981" letter-spacing="1">FACILITY INQUIRIES</text>
            <text x="0" y="24" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="700" font-size="20" fill="#ffffff">contact@sentinel.io</text>
          </g>
        </g>
      </g>
    </g>

    <g transform="translate(100, 520)">
      <text x="500" y="20" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="600" font-size="12" fill="#86868b" letter-spacing="2" text-anchor="middle">
        SENTINEL PRO &#8226; 2 FT &#215; 6 FT (24&#8243; &#215; 72&#8243; &#8226; 60.96 CM &#215; 182.88 CM) &#8226; 1:3 ASPECT RATIO
      </text>
    </g>
  </g>
</svg>`;
}

async function main() {
  console.log('Generating Apple Keynote Product Buntings (2ft x 6ft)...');

  // 1. Apple Space Black Edition
  console.log('Building Apple Space Black Edition...');
  const blackSvg = await buildAppleSpaceBlackSvg();
  const blackSvgPath = path.join(rollupDir, 'sentinel-banner-2x6ft-apple-spaceblack.svg');
  const blackPngPath = path.join(rollupDir, 'sentinel-banner-2x6ft-apple-spaceblack.png');
  fs.writeFileSync(blackSvgPath, blackSvg, 'utf8');

  console.log('Rendering 2400 x 7200 Print PNG for Apple Space Black...');
  await sharp(Buffer.from(blackSvg))
    .resize(2400, 7200)
    .png({ quality: 95 })
    .toFile(blackPngPath);

  // 2. Apple Studio White Edition
  console.log('Building Apple Studio White Edition...');
  const whiteSvg = await buildAppleStudioWhiteSvg();
  const whiteSvgPath = path.join(rollupDir, 'sentinel-banner-2x6ft-apple-studiowhite.svg');
  const whitePngPath = path.join(rollupDir, 'sentinel-banner-2x6ft-apple-studiowhite.png');
  fs.writeFileSync(whiteSvgPath, whiteSvg, 'utf8');

  console.log('Rendering 2400 x 7200 Print PNG for Apple Studio White...');
  await sharp(Buffer.from(whiteSvg))
    .resize(2400, 7200)
    .png({ quality: 95 })
    .toFile(whitePngPath);

  // Sync to public/branding/bunting/07_rollup_banner
  console.log('Syncing to public directory...');
  const filesToSync = [
    'sentinel-banner-2x6ft-apple-spaceblack.svg',
    'sentinel-banner-2x6ft-apple-spaceblack.png',
    'sentinel-banner-2x6ft-apple-studiowhite.svg',
    'sentinel-banner-2x6ft-apple-studiowhite.png'
  ];

  for (const f of filesToSync) {
    fs.copyFileSync(path.join(rollupDir, f), path.join(pubRollupDir, f));
  }

  console.log('All Apple-Grade Product Buntings created successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
