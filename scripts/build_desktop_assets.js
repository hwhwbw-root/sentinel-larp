const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseDir = path.resolve(__dirname, '..', 'canva-bunting-assets', '08_desktop_dashboards');
fs.mkdirSync(baseDir, { recursive: true });

const publicBuntingDir = path.resolve(__dirname, '..', 'public', 'branding', 'bunting');
const publicDesktopDir = path.join(publicBuntingDir, '08_desktop_dashboards');
fs.mkdirSync(publicDesktopDir, { recursive: true });

// Load Satoshi glyphs
const glyphData = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_glyphs.json'), 'utf8'));
const { wordmark } = glyphData;

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
  borderLight: '#f1f5f9',
  green: '#16a34a',
  greenBg: '#dcfce7',
  amber: '#f59e0b',
  amberBg: '#fef3c7',
  red: '#ef4444',
  redBg: '#fee2e2'
};

// SVG Icon Helpers
function iconShield(size = 32, color = COLORS.blue) {
  return `<g transform="scale(${size / 80})">
    <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="${color}" stroke-width="4" stroke-linejoin="round" />
    <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z" fill="${COLORS.lightBlue}" stroke="${color}" stroke-width="2" />
    <circle cx="40" cy="36" r="9" fill="none" stroke="${color}" stroke-width="3.5" />
    <circle cx="40" cy="36" r="2.6" fill="${color}" />
    <path d="M40 47 V56" stroke="${color}" stroke-width="3.5" stroke-linecap="round" />
  </g>`;
}

function iconLayout(color = COLORS.grayText, size = 18) {
  return `<g transform="scale(${size / 24})">
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="${color}" stroke-width="2" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="${color}" stroke-width="2" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="${color}" stroke-width="2" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="${color}" stroke-width="2" />
  </g>`;
}

function iconHistory(color = COLORS.grayText, size = 18) {
  return `<g transform="scale(${size / 24})">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M3 3v5h5" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 7v5l4 2" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </g>`;
}

function iconDevices(color = COLORS.grayText, size = 18) {
  return `<g transform="scale(${size / 24})">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="${color}" stroke-width="2" />
    <path d="M4 14h16" stroke="${color}" stroke-width="2" />
    <circle cx="8" cy="18" r="1" fill="${color}" />
    <circle cx="12" cy="18" r="1" fill="${color}" />
  </g>`;
}

function iconUsers(color = COLORS.grayText, size = 18) {
  return `<g transform="scale(${size / 24})">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="none" stroke="${color}" stroke-width="2" />
    <circle cx="9" cy="7" r="4" fill="none" stroke="${color}" stroke-width="2" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" fill="none" stroke="${color}" stroke-width="2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="${color}" stroke-width="2" />
  </g>`;
}

// 1. Core Desktop App UI Content (1920 x 1080)
function getDesktopDashboardUi(w = 1920, h = 1080) {
  const sidebarW = 260;
  const contentW = w - sidebarW;

  return `
  <!-- Desktop Background -->
  <rect width="${w}" height="${h}" fill="#f8fafc" />

  <!-- SIDEBAR NAVIGATION -->
  <g transform="translate(0, 0)">
    <!-- Sidebar Background -->
    <rect width="${sidebarW}" height="${h}" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    
    <!-- Sidebar Brand Lockup -->
    <g transform="translate(24, 28)">
      ${iconShield(38, COLORS.blue)}
      <g transform="translate(48, 4) scale(0.026)">
        <path d="${wordmark.d}" fill="${COLORS.dark}" />
      </g>
    </g>

    <!-- Project Scope Badge -->
    <g transform="translate(24, 88)">
      <rect width="212" height="28" rx="6" fill="${COLORS.lightBlue}" />
      <circle cx="14" cy="14" r="4" fill="${COLORS.blue}" />
      <text x="26" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}" letter-spacing="0.5">INDUSTRIAL IOT CLOUD</text>
    </g>

    <!-- Nav Items -->
    <g transform="translate(16, 140)">
      <!-- Item 1: Overview (Active) -->
      <rect width="228" height="42" rx="8" fill="${COLORS.lightBlue}" />
      <g transform="translate(14, 12)">${iconLayout(COLORS.blue, 18)}</g>
      <text x="44" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="${COLORS.blue}">Overview</text>
      <rect x="222" y="10" width="3" height="22" rx="1.5" fill="${COLORS.blue}" />

      <!-- Item 2: Data History -->
      <g transform="translate(0, 52)">
        <rect width="228" height="42" rx="8" fill="transparent" />
        <g transform="translate(14, 12)">${iconHistory(COLORS.grayText, 18)}</g>
        <text x="44" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="14" fill="${COLORS.dark}">Data History</text>
      </g>

      <!-- Item 3: Device Fleet -->
      <g transform="translate(0, 104)">
        <rect width="228" height="42" rx="8" fill="transparent" />
        <g transform="translate(14, 12)">${iconDevices(COLORS.grayText, 18)}</g>
        <text x="44" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="14" fill="${COLORS.dark}">Device Fleet</text>
        <rect x="180" y="12" width="34" height="20" rx="10" fill="#e2e8f0" />
        <text x="197" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}" text-anchor="middle">3</text>
      </g>

      <!-- Item 4: User Management -->
      <g transform="translate(0, 156)">
        <rect width="228" height="42" rx="8" fill="transparent" />
        <g transform="translate(14, 12)">${iconUsers(COLORS.grayText, 18)}</g>
        <text x="44" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="14" fill="${COLORS.dark}">Team &amp; Access</text>
      </g>
    </g>

    <!-- Node System Health Box -->
    <g transform="translate(18, ${h - 190})">
      <rect width="224" height="96" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
      <g transform="translate(16, 18)">
        <circle cx="6" cy="6" r="4" fill="${COLORS.green}" />
        <text x="18" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.dark}">Mesh Gateway</text>
        <text x="0" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">WebSocket &#8226; Polling 2.0s</text>
        <text x="0" y="48" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.green}">0 Drops &#8226; Latency 24ms</text>
      </g>
    </g>

    <!-- User Profile Footer -->
    <g transform="translate(18, ${h - 76})">
      <circle cx="20" cy="20" r="18" fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="1.5" />
      <text x="20" y="25" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="${COLORS.blue}" text-anchor="middle">AD</text>
      <text x="50" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="${COLORS.dark}">Admin Console</text>
      <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">admin@sentinel.io</text>
    </g>
  </g>

  <!-- MAIN DASHBOARD CONTENT AREA -->
  <g transform="translate(${sidebarW}, 0)">
    <!-- Top Header Bar -->
    <g transform="translate(0, 0)">
      <rect width="${contentW}" height="80" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
      
      <!-- Page Title & Breadcrumb -->
      <g transform="translate(36, 26)">
        <text x="0" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="22" fill="${COLORS.dark}">Environmental Overview</text>
        <text x="260" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.grayText}">Facility Zone 01 &#8226; Main Laboratory</text>
      </g>

      <!-- Right Header Actions -->
      <g transform="translate(${contentW - 580}, 22)">
        <!-- Node Selector Dropdown -->
        <rect width="210" height="38" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
        <circle cx="20" cy="19" r="4" fill="${COLORS.green}" />
        <text x="32" y="24" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.dark}">ESP32-Node 1A2B</text>
        <path d="M185 17 L190 22 L195 17" fill="none" stroke="${COLORS.grayText}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Time Range Selector -->
        <g transform="translate(225, 0)">
          <rect width="180" height="38" rx="8" fill="#f1f5f9" />
          <rect x="3" y="3" width="56" height="32" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8" />
          <text x="31" y="23" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.blue}" text-anchor="middle">10m</text>
          <text x="90" y="23" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}" text-anchor="middle">30m</text>
          <text x="150" y="23" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}" text-anchor="middle">1h</text>
        </g>

        <!-- Live Badge -->
        <g transform="translate(420, 4)">
          <rect width="90" height="30" rx="15" fill="${COLORS.greenBg}" />
          <circle cx="16" cy="15" r="4.5" fill="${COLORS.green}">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="28" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="11" fill="${COLORS.green}" letter-spacing="0.5">POLLING</text>
        </g>
      </g>
    </g>

    <!-- System Nominal Alert Banner -->
    <g transform="translate(36, 104)">
      <rect width="${contentW - 72}" height="48" rx="10" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.2" />
      <g transform="translate(20, 15)">
        <!-- Green Shield Check -->
        <circle cx="10" cy="10" r="9" fill="${COLORS.green}" />
        <path d="M6 10 L9 13 L14 7" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <text x="30" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#15803d">ALL SENSORS NOMINAL:</text>
        <text x="195" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="13" fill="#166534">3 nodes reporting live environmental telemetry with zero threshold violations in the past 24 hours.</text>
      </g>
      <g transform="translate(${contentW - 240}, 12)">
        <rect width="144" height="26" rx="6" fill="#dcfce7" />
        <text x="72" y="17" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#15803d" text-anchor="middle">HARDWARE ENCRYPTED</text>
      </g>
    </g>

    <!-- 3 HERO METRIC CARDS (Bento Grid) -->
    <g transform="translate(36, 172)">
      <!-- Card 1: Gas / Air Quality (Hero Focus) -->
      <g transform="translate(0, 0)">
        <rect width="490" height="175" rx="16" fill="#ffffff" stroke="#c7d9fc" stroke-width="1.5" />
        <!-- Top Accent Bar -->
        <path d="M16 0 H474 Q490 0 490 16 V24 H0 V16 Q0 0 16 0 Z" fill="${COLORS.lightBlue}" />
        <rect x="20" y="8" width="8" height="8" rx="4" fill="${COLORS.blue}" />
        <text x="36" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}" letter-spacing="1">MQ-2 SENSOR METRIC</text>
        
        <g transform="translate(28, 50)">
          <text x="0" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="${COLORS.grayText}">GAS CONCENTRATION</text>
          <text x="0" y="62" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="46" fill="${COLORS.dark}">524 <tspan font-size="20" font-weight="600" fill="${COLORS.grayText}">ppm</tspan></text>
          
          <g transform="translate(230, 22)">
            <rect width="90" height="28" rx="14" fill="${COLORS.greenBg}" />
            <text x="45" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.green}" text-anchor="middle">✓ SAFE</text>
          </g>

          <g transform="translate(0, 94)">
            <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">Baseline: 400–600 ppm &#8226; Danger Limit: 1000 ppm</text>
            <!-- Progress / Level meter bar -->
            <rect x="0" y="8" width="434" height="6" rx="3" fill="#f1f5f9" />
            <rect x="0" y="8" width="227" height="6" rx="3" fill="${COLORS.blue}" />
          </g>
        </g>
      </g>

      <!-- Card 2: Temperature -->
      <g transform="translate(515, 0)">
        <rect width="490" height="175" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />
        <path d="M16 0 H474 Q490 0 490 16 V24 H0 V16 Q0 0 16 0 Z" fill="#f8fafc" />
        <text x="24" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}" letter-spacing="1">THERMAL SENSOR</text>

        <g transform="translate(28, 50)">
          <text x="0" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="${COLORS.grayText}">AMBIENT TEMPERATURE</text>
          <text x="0" y="62" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="46" fill="${COLORS.dark}">24.4 <tspan font-size="20" font-weight="600" fill="${COLORS.grayText}">°C</tspan></text>

          <g transform="translate(230, 22)">
            <rect width="110" height="28" rx="14" fill="#eff6ff" />
            <text x="55" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.blue}" text-anchor="middle">OPTIMAL</text>
          </g>

          <g transform="translate(0, 94)">
            <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">Calibration: &#177;0.2°C &#8226; Target: 22°C–25°C</text>
            <rect x="0" y="8" width="434" height="6" rx="3" fill="#f1f5f9" />
            <rect x="0" y="8" width="280" height="6" rx="3" fill="#3b82f6" />
          </g>
        </g>
      </g>

      <!-- Card 3: Relative Humidity -->
      <g transform="translate(1030, 0)">
        <rect width="530" height="175" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />
        <path d="M16 0 H514 Q530 0 530 16 V24 H0 V16 Q0 0 16 0 Z" fill="#f8fafc" />
        <text x="24" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}" letter-spacing="1">HYGROMETER</text>

        <g transform="translate(28, 50)">
          <text x="0" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="${COLORS.grayText}">RELATIVE HUMIDITY</text>
          <text x="0" y="62" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="46" fill="${COLORS.dark}">48.1 <tspan font-size="20" font-weight="600" fill="${COLORS.grayText}">%</tspan></text>

          <g transform="translate(230, 22)">
            <rect width="105" height="28" rx="14" fill="${COLORS.greenBg}" />
            <text x="52" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.green}" text-anchor="middle">COMFORT</text>
          </g>

          <g transform="translate(0, 94)">
            <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">Safe Range: 40%–60% &#8226; Moisture normal</text>
            <rect x="0" y="8" width="474" height="6" rx="3" fill="#f1f5f9" />
            <rect x="0" y="8" width="230" height="6" rx="3" fill="#06b6d4" />
          </g>
        </g>
      </g>
    </g>

    <!-- MIDDLE SECTION: REAL-TIME TELEMETRY CHART (Interactive Area Chart) -->
    <g transform="translate(36, 372)">
      <rect width="${contentW - 72}" height="350" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />
      
      <!-- Chart Card Header -->
      <g transform="translate(28, 28)">
        <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="${COLORS.dark}">Real-Time Telemetry Stream</text>
        <text x="0" y="36" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="13" fill="${COLORS.grayText}">Atmospheric Gas &amp; Sensor Dynamics (Last 10 minutes, 2-second resolution)</text>
      </g>

      <!-- Chart Legend & Indicators -->
      <g transform="translate(${contentW - 460}, 28)">
        <circle cx="10" cy="14" r="5" fill="${COLORS.blue}" />
        <text x="22" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.dark}">Gas (ppm)</text>
        
        <circle cx="110" cy="14" r="5" fill="#f59e0b" />
        <text x="122" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.dark}">Alert Line (800)</text>

        <rect x="230" y="4" width="130" height="24" rx="12" fill="${COLORS.lightBlue}" />
        <text x="295" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}" text-anchor="middle">LIVE STREAMING</text>
      </g>

      <!-- Chart Graphics Area -->
      <g transform="translate(60, 90)">
        <!-- Gridlines -->
        <line x1="0" y1="0" x2="${contentW - 160}" y2="0" stroke="#f1f5f9" stroke-width="1" />
        <text x="-12" y="4" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}" text-anchor="end">1000</text>

        <line x1="0" y1="50" x2="${contentW - 160}" y2="50" stroke="#fee2e2" stroke-width="1.5" stroke-dasharray="6 4" />
        <text x="-12" y="54" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.red}" text-anchor="end">800 (Alert)</text>

        <line x1="0" y1="100" x2="${contentW - 160}" y2="100" stroke="#f1f5f9" stroke-width="1" />
        <text x="-12" y="104" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}" text-anchor="end">600</text>

        <line x1="0" y1="150" x2="${contentW - 160}" y2="150" stroke="#f1f5f9" stroke-width="1" />
        <text x="-12" y="154" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}" text-anchor="end">400</text>

        <line x1="0" y1="200" x2="${contentW - 160}" y2="200" stroke="#e2e8f0" stroke-width="1.5" />
        <text x="-12" y="204" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}" text-anchor="end">200</text>

        <!-- Shaded Area Gradient Definition -->
        <defs>
          <linearGradient id="desktopChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${COLORS.blue}" stop-opacity="0.35" />
            <stop offset="100%" stop-color="${COLORS.blue}" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Area Curve -->
        <path d="M0 120 Q120 135 240 110 T480 125 T720 95 T960 115 T1200 85 T1380 98 L1380 200 L0 200 Z" fill="url(#desktopChartGrad)" />
        <path d="M0 120 Q120 135 240 110 T480 125 T720 95 T960 115 T1200 85 T1380 98" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />

        <!-- Data Points -->
        <circle cx="240" cy="110" r="4.5" fill="#ffffff" stroke="${COLORS.blue}" stroke-width="2.5" />
        <circle cx="720" cy="95" r="4.5" fill="#ffffff" stroke="${COLORS.blue}" stroke-width="2.5" />
        <circle cx="1200" cy="85" r="4.5" fill="#ffffff" stroke="${COLORS.blue}" stroke-width="2.5" />
        
        <!-- Live End Pulse Point -->
        <circle cx="1380" cy="98" r="8" fill="${COLORS.blue}" opacity="0.25">
          <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1380" cy="98" r="5" fill="${COLORS.blue}" stroke="#ffffff" stroke-width="2" />

        <!-- Interactive Tooltip Overlay on point 1200 -->
        <g transform="translate(1120, 10)">
          <rect width="160" height="60" rx="8" fill="#18181b" />
          <text x="14" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#94a3b8">10:38:12 &#8226; Lab A</text>
          <text x="14" y="44" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="16" fill="#ffffff">524 ppm <tspan font-size="11" font-weight="600" fill="#4ade80">Safe</tspan></text>
          <!-- Tooltip pin line -->
          <line x1="80" y1="60" x2="80" y2="75" stroke="#18181b" stroke-width="1.5" stroke-dasharray="2 2" />
        </g>

        <!-- Time Ticks on X-Axis -->
        <g transform="translate(0, 220)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:30:00</text>
          <text x="240" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:32:00</text>
          <text x="480" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:34:00</text>
          <text x="720" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:36:00</text>
          <text x="960" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:38:00</text>
          <text x="1200" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:40:00</text>
          <text x="1380" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}" text-anchor="end">Now (Live)</text>
        </g>
      </g>
    </g>

    <!-- LOWER SECTION: HARDWARE FLEET TABLE (3 Nodes) -->
    <g transform="translate(36, 746)">
      <rect width="${contentW - 72}" height="300" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />
      
      <!-- Table Header Title -->
      <g transform="translate(28, 24)">
        <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="${COLORS.dark}">Active Hardware Fleet (ESP32 Nodes)</text>
        <text x="360" y="15" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">3 nodes connected &#8226; End-to-end encrypted mesh</text>
      </g>

      <!-- Table Column Headers -->
      <g transform="translate(28, 64)">
        <rect width="${contentW - 128}" height="34" rx="6" fill="#f8fafc" />
        <text x="16" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}">BOX ID / NODE</text>
        <text x="240" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}">LOCATION</text>
        <text x="460" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}">SENSOR TYPE</text>
        <text x="680" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}">CURRENT READING</text>
        <text x="920" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}">SIGNAL / BATTERY</text>
        <text x="1180" y="22" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.grayText}">STATUS</text>
      </g>

      <!-- Row 1: Node 1A2B -->
      <g transform="translate(28, 108)">
        <rect width="${contentW - 128}" height="56" rx="8" fill="#f0f5ff" stroke="#c7d9fc" stroke-width="1" />
        <g transform="translate(16, 18)">
          <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.blue}">ESP32-Node 1A2B</text>
          <text x="0" y="30" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">Firmware v2.4.1</text>
        </g>
        <text x="256" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">Primary Lab (Zone 1)</text>
        <text x="476" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">MQ-2 Gas + DHT22</text>
        <g transform="translate(696, 18)">
          <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="${COLORS.dark}">524 ppm</text>
          <text x="0" y="30" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">24.4°C &#8226; 48% RH</text>
        </g>
        <text x="936" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">-48 dBm &#8226; 98% (Solar)</text>
        <g transform="translate(1196, 14)">
          <rect width="84" height="28" rx="14" fill="${COLORS.greenBg}" />
          <text x="42" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="11" fill="${COLORS.green}" text-anchor="middle">ONLINE</text>
        </g>
      </g>

      <!-- Row 2: Node 3C4D -->
      <g transform="translate(28, 172)">
        <rect width="${contentW - 128}" height="56" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" />
        <g transform="translate(16, 18)">
          <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="${COLORS.dark}">ESP32-Node 3C4D</text>
          <text x="0" y="30" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">Firmware v2.4.1</text>
        </g>
        <text x="256" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">Server Room B</text>
        <text x="476" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">CO2 Optical NDIR</text>
        <g transform="translate(696, 18)">
          <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="${COLORS.dark}">412 ppm</text>
          <text x="0" y="30" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">20.8°C &#8226; 42% RH</text>
        </g>
        <text x="936" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">-52 dBm &#8226; 94% (Mains)</text>
        <g transform="translate(1196, 14)">
          <rect width="84" height="28" rx="14" fill="${COLORS.greenBg}" />
          <text x="42" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="11" fill="${COLORS.green}" text-anchor="middle">ONLINE</text>
        </g>
      </g>

      <!-- Row 3: Node 5E6F -->
      <g transform="translate(28, 236)">
        <rect width="${contentW - 128}" height="56" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="0.8" />
        <g transform="translate(16, 18)">
          <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="${COLORS.dark}">ESP32-Node 5E6F</text>
          <text x="0" y="30" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">Firmware v2.3.9</text>
        </g>
        <text x="256" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">Chemical Storage Area</text>
        <text x="476" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">Multi-Gas Electrochemical</text>
        <g transform="translate(696, 18)">
          <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="${COLORS.dark}">389 ppm</text>
          <text x="0" y="30" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">23.1°C &#8226; 45% RH</text>
        </g>
        <text x="936" y="34" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="${COLORS.dark}">-61 dBm &#8226; 89% (Battery)</text>
        <g transform="translate(1196, 14)">
          <rect width="84" height="28" rx="14" fill="${COLORS.greenBg}" />
          <text x="42" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="11" fill="${COLORS.green}" text-anchor="middle">ONLINE</text>
        </g>
      </g>
    </g>
  </g>
  `;
}

// 2. Desktop Browser Window Frame Mockup (Chrome / macOS style with shadow)
function getDesktopBrowserMockupSvg() {
  const w = 1920;
  const h = 1080;
  const titleBarH = 44;
  const totalW = w + 120;
  const totalH = h + titleBarH + 120;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="2040" height="1244">
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
        <!-- Browser Window Titlebar (macOS Dark Zinc Style) -->
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
          <!-- Padlock Icon -->
          <g transform="translate(18, 7) scale(0.7)">
            <rect x="2" y="6" width="14" height="10" rx="2" fill="none" stroke="#94a3b8" stroke-width="1.8" />
            <path d="M5 6 V4 A4 4 0 0 1 13 4 V6" fill="none" stroke="#94a3b8" stroke-width="1.8" />
          </g>
          <text x="38" y="19" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#cbd5e1">https://app.sentinel.io/dashboard</text>
        </g>

        <!-- App UI Content mounted inside browser frame -->
        <g transform="translate(0, ${titleBarH})">
          ${getDesktopDashboardUi(w, h)}
        </g>
      </g>
    </g>
  </svg>`;
}

// 3. Realistic MacBook / Laptop Display Mockup
function getMacBookMockupSvg() {
  const screenW = 1536;
  const screenH = 960;
  const bezel = 28;
  const topBezel = 36;
  const lidW = screenW + bezel * 2;
  const lidH = screenH + bezel + topBezel;
  const baseW = lidW + 180;
  const baseH = 28;
  const notchW = 160;

  const totalW = baseW + 100;
  const totalH = lidH + baseH + 120;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="1800" height="1180">
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
      <!-- Lid / Outer Bezel -->
      <g transform="translate(${(baseW - lidW) / 2}, 0)">
        <rect width="${lidW}" height="${lidH}" rx="20" fill="#0f172a" stroke="#334155" stroke-width="2" />
        
        <!-- Camera Dot -->
        <circle cx="${lidW / 2}" cy="18" r="4" fill="#020617" />
        <circle cx="${lidW / 2}" cy="18" r="1.5" fill="#1e293b" />

        <!-- Screen Display Content -->
        <g transform="translate(${bezel}, ${topBezel})" clip-path="url(#screenClip)">
          <!-- Scale 1920x1080 to 1536x960 -->
          <g transform="scale(${screenW / 1920})">
            ${getDesktopDashboardUi(1920, 1080 * (960 / (1536 * (1080 / 1920))))}
          </g>
        </g>
      </g>

      <!-- Laptop Base / Hinge -->
      <g transform="translate(0, ${lidH})">
        <!-- Hinge cutout -->
        <rect x="${(baseW - 240) / 2}" y="-4" width="240" height="8" rx="3" fill="#1e293b" />
        <!-- Top of base aluminum -->
        <path d="M40 0 L${baseW - 40} 0 L${baseW} ${baseH} L0 ${baseH} Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
        <!-- Center opening notch -->
        <path d="M${(baseW - notchW) / 2} 0 H${(baseW + notchW) / 2} Q${baseW / 2} 12 ${(baseW - notchW) / 2} 0 Z" fill="#94a3b8" />
        <!-- Bottom lip -->
        <rect x="0" y="${baseH}" width="${baseW}" height="6" rx="2" fill="#94a3b8" />
        <!-- Rubber feet -->
        <rect x="80" y="${baseH + 2}" width="60" height="4" rx="2" fill="#334155" />
        <rect x="${baseW - 140}" y="${baseH + 2}" width="60" height="4" rx="2" fill="#334155" />
      </g>
    </g>
  </svg>`;
}

// 4. Isolated Desktop Components (Pure Vector & Ready for Canva)

// Component A: Large Gas & Air Quality Stat Card
function getCompGasCardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="1080" height="440">
    <defs>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#0f172a" flood-opacity="0.08" />
      </filter>
    </defs>
    <g transform="translate(20, 15)" filter="url(#cardShadow)">
      <rect width="500" height="190" rx="16" fill="#ffffff" stroke="#c7d9fc" stroke-width="1.6" />
      <path d="M16 0 H484 Q500 0 500 16 V28 H0 V16 Q0 0 16 0 Z" fill="${COLORS.lightBlue}" />
      <rect x="22" y="10" width="8" height="8" rx="4" fill="${COLORS.blue}" />
      <text x="38" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}" letter-spacing="1">MQ-2 SENSOR &#8226; PRIMARY TELEMETRY</text>

      <g transform="translate(30, 56)">
        <text x="0" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="${COLORS.grayText}">AIR &amp; GAS CONCENTRATION</text>
        <text x="0" y="66" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="50" fill="${COLORS.dark}">524 <tspan font-size="22" font-weight="600" fill="${COLORS.grayText}">ppm</tspan></text>

        <g transform="translate(240, 24)">
          <rect width="96" height="30" rx="15" fill="${COLORS.greenBg}" />
          <text x="48" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="12" fill="${COLORS.green}" text-anchor="middle">✓ SAFE</text>
        </g>

        <g transform="translate(0, 102)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">Baseline: 400–600 ppm &#8226; Max Danger Threshold: 1000 ppm</text>
          <rect x="0" y="8" width="440" height="7" rx="3.5" fill="#f1f5f9" />
          <rect x="0" y="8" width="230" height="7" rx="3.5" fill="${COLORS.blue}" />
        </g>
      </g>
    </g>
  </svg>`;
}

// Component B: Dual Temperature & Humidity Bento Card
function getCompTempHumidityCardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 220" width="1080" height="440">
    <defs>
      <filter id="cardShadow2" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#0f172a" flood-opacity="0.08" />
      </filter>
    </defs>
    <g transform="translate(20, 15)" filter="url(#cardShadow2)">
      <!-- Temp Sub-Card -->
      <g transform="translate(0, 0)">
        <rect width="242" height="190" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />
        <path d="M16 0 H226 Q242 0 242 16 V26 H0 V16 Q0 0 16 0 Z" fill="#f8fafc" />
        <text x="18" y="17" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.grayText}" letter-spacing="0.5">TEMPERATURE</text>
        <g transform="translate(20, 56)">
          <text x="0" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">AMBIENT</text>
          <text x="0" y="58" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="38" fill="${COLORS.dark}">24.4°C</text>
          <g transform="translate(0, 72)">
            <rect width="84" height="22" rx="11" fill="#eff6ff" />
            <text x="42" y="15" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.blue}" text-anchor="middle">OPTIMAL</text>
          </g>
          <text x="0" y="114" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">Target 22–25°C</text>
        </g>
      </g>

      <!-- Humidity Sub-Card -->
      <g transform="translate(258, 0)">
        <rect width="242" height="190" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />
        <path d="M16 0 H226 Q242 0 242 16 V26 H0 V16 Q0 0 16 0 Z" fill="#f8fafc" />
        <text x="18" y="17" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.grayText}" letter-spacing="0.5">HUMIDITY</text>
        <g transform="translate(20, 56)">
          <text x="0" y="14" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">RELATIVE RH</text>
          <text x="0" y="58" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="38" fill="${COLORS.dark}">48.1%</text>
          <g transform="translate(0, 72)">
            <rect width="84" height="22" rx="11" fill="${COLORS.greenBg}" />
            <text x="42" y="15" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="10" fill="${COLORS.green}" text-anchor="middle">COMFORT</text>
          </g>
          <text x="0" y="114" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">Safe Range 40–60%</text>
        </g>
      </g>
    </g>
  </svg>`;
}

// Component C: Telemetry Stream Area Chart Widget
function getCompChartWidgetSvg() {
  const w = 900;
  const h = 420;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w + 40} ${h + 40}" width="1880" height="920">
    <defs>
      <filter id="chartWidgetShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.1" />
      </filter>
      <linearGradient id="chartCompGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.blue}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${COLORS.blue}" stop-opacity="0.0" />
      </linearGradient>
    </defs>
    <g transform="translate(20, 20)" filter="url(#chartWidgetShadow)">
      <rect width="${w}" height="${h}" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />

      <!-- Header -->
      <g transform="translate(30, 32)">
        <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="20" fill="${COLORS.dark}">Real-Time Telemetry Stream</text>
        <text x="0" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="13" fill="${COLORS.grayText}">Gas Concentration (MQ-2) &#8226; ESP32-Node 1A2B</text>
      </g>

      <!-- Time Pills -->
      <g transform="translate(${w - 220}, 28)">
        <rect width="180" height="34" rx="8" fill="#f1f5f9" />
        <rect x="3" y="3" width="56" height="28" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8" />
        <text x="31" y="21" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.blue}" text-anchor="middle">10m</text>
        <text x="90" y="21" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}" text-anchor="middle">30m</text>
        <text x="150" y="21" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}" text-anchor="middle">1h</text>
      </g>

      <!-- Chart Graphics -->
      <g transform="translate(60, 110)">
        <line x1="0" y1="0" x2="${w - 100}" y2="0" stroke="#f1f5f9" stroke-width="1" />
        <text x="-12" y="4" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}" text-anchor="end">1000</text>

        <line x1="0" y1="60" x2="${w - 100}" y2="60" stroke="#fee2e2" stroke-width="1.5" stroke-dasharray="6 4" />
        <text x="-12" y="64" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.red}" text-anchor="end">800 (Alert)</text>

        <line x1="0" y1="120" x2="${w - 100}" y2="120" stroke="#f1f5f9" stroke-width="1" />
        <text x="-12" y="124" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}" text-anchor="end">600</text>

        <line x1="0" y1="180" x2="${w - 100}" y2="180" stroke="#f1f5f9" stroke-width="1" />
        <text x="-12" y="184" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}" text-anchor="end">400</text>

        <line x1="0" y1="240" x2="${w - 100}" y2="240" stroke="#e2e8f0" stroke-width="1.5" />
        <text x="-12" y="244" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}" text-anchor="end">200</text>

        <!-- Area Curve -->
        <path d="M0 140 Q100 160 200 130 T400 150 T600 110 T720 120 L720 240 L0 240 Z" fill="url(#chartCompGrad)" />
        <path d="M0 140 Q100 160 200 130 T400 150 T600 110 T720 120" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />

        <!-- Highlight Point & Tooltip -->
        <circle cx="600" cy="110" r="5" fill="${COLORS.blue}" stroke="#ffffff" stroke-width="2" />
        <g transform="translate(520, 35)">
          <rect width="160" height="56" rx="8" fill="#18181b" />
          <text x="14" y="18" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#94a3b8">10:38:12</text>
          <text x="14" y="40" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="16" fill="#ffffff">524 ppm <tspan font-size="11" font-weight="600" fill="#4ade80">Safe</tspan></text>
        </g>

        <!-- X Axis Ticks -->
        <g transform="translate(0, 262)">
          <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:30</text>
          <text x="180" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:32</text>
          <text x="360" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:34</text>
          <text x="540" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">10:36</text>
          <text x="720" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}" text-anchor="end">Live</text>
        </g>
      </g>
    </g>
  </svg>`;
}

// Component D: Hardware Fleet Node List
function getCompFleetListSvg() {
  const w = 700;
  const h = 330;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w + 40} ${h + 40}" width="1480" height="740">
    <defs>
      <filter id="fleetShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0f172a" flood-opacity="0.1" />
      </filter>
    </defs>
    <g transform="translate(20, 20)" filter="url(#fleetShadow)">
      <rect width="${w}" height="${h}" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" />

      <!-- Header -->
      <g transform="translate(24, 24)">
        <text x="0" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="18" fill="${COLORS.dark}">ESP32 Fleet Nodes</text>
        <text x="180" y="15" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="${COLORS.grayText}">3 active &#8226; AES-256 Mesh</text>
      </g>

      <!-- Row 1 -->
      <g transform="translate(24, 60)">
        <rect width="${w - 48}" height="70" rx="10" fill="#f0f5ff" stroke="#c7d9fc" stroke-width="1" />
        <circle cx="24" cy="35" r="10" fill="${COLORS.blue}" />
        <circle cx="24" cy="35" r="4" fill="#ffffff" />
        <g transform="translate(46, 26)">
          <text x="0" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.blue}">ESP32-Node 1A2B</text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">Zone 1 &#8226; Primary Lab &#8226; MQ-2 Gas</text>
        </g>
        <g transform="translate(420, 26)">
          <text x="0" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.dark}">524 ppm</text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">24.4°C &#8226; -48 dBm</text>
        </g>
        <g transform="translate(${w - 148}, 22)">
          <rect width="78" height="26" rx="13" fill="${COLORS.greenBg}" />
          <text x="39" y="17" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="10" fill="${COLORS.green}" text-anchor="middle">ONLINE</text>
        </g>
      </g>

      <!-- Row 2 -->
      <g transform="translate(24, 142)">
        <rect width="${w - 48}" height="70" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
        <circle cx="24" cy="35" r="10" fill="#e2e8f0" />
        <circle cx="24" cy="35" r="4" fill="${COLORS.grayText}" />
        <g transform="translate(46, 26)">
          <text x="0" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.dark}">ESP32-Node 3C4D</text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">Server Room B &#8226; Optical NDIR</text>
        </g>
        <g transform="translate(420, 26)">
          <text x="0" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.dark}">412 ppm</text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">20.8°C &#8226; -52 dBm</text>
        </g>
        <g transform="translate(${w - 148}, 22)">
          <rect width="78" height="26" rx="13" fill="${COLORS.greenBg}" />
          <text x="39" y="17" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="10" fill="${COLORS.green}" text-anchor="middle">ONLINE</text>
        </g>
      </g>

      <!-- Row 3 -->
      <g transform="translate(24, 224)">
        <rect width="${w - 48}" height="70" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
        <circle cx="24" cy="35" r="10" fill="#e2e8f0" />
        <circle cx="24" cy="35" r="4" fill="${COLORS.grayText}" />
        <g transform="translate(46, 26)">
          <text x="0" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.dark}">ESP32-Node 5E6F</text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">Chemical Storage &#8226; Electrochemical</text>
        </g>
        <g transform="translate(420, 26)">
          <text x="0" y="10" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="14" fill="${COLORS.dark}">389 ppm</text>
          <text x="0" y="26" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.grayText}">23.1°C &#8226; -61 dBm</text>
        </g>
        <g transform="translate(${w - 148}, 22)">
          <rect width="78" height="26" rx="13" fill="${COLORS.greenBg}" />
          <text x="39" y="17" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="10" fill="${COLORS.green}" text-anchor="middle">ONLINE</text>
        </g>
      </g>
    </g>
  </svg>`;
}

// 5. Updated Rollup Standing Banner Variant with Desktop + Phone Mockup
function getRollupBannerDesktopSvg(w = 1200, h = 2800) {
  // Same dimensions and brand hierarchy as reference, but center stage has both Desktop Laptop Mockup & Phone!
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bannerBg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="15%" stop-color="#f0f5ff" />
        <stop offset="48%" stop-color="#ffffff" />
        <stop offset="80%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>

      <linearGradient id="electricBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2f6fed" />
        <stop offset="100%" stop-color="#1d4ed8" />
      </linearGradient>

      <filter id="deskMockupShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="32" stdDeviation="36" flood-color="#0f172a" flood-opacity="0.25" />
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.15" />
      </filter>

      <filter id="phoneShadow" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.25" />
      </filter>
    </defs>

    <!-- Main Background Canvas -->
    <rect width="${w}" height="${h}" fill="url(#bannerBg)" />

    <!-- Subtle Background Sensor Waves -->
    <g opacity="0.35">
      <circle cx="600" cy="980" r="450" fill="none" stroke="${COLORS.blue}" stroke-width="1.2" stroke-dasharray="6 8" />
      <circle cx="600" cy="980" r="620" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="10 12" opacity="0.6" />
      <circle cx="600" cy="980" r="820" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="12 16" opacity="0.3" />
    </g>

    <!-- SECTION 1: TOP BRAND HEADER -->
    <g transform="translate(0, 110)">
      <!-- Central Logo Lockup -->
      <g transform="translate(600, 0)">
        <!-- Shield Icon -->
        <g transform="translate(-80, 0) scale(2.0)">
          <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
                fill="none" stroke="${COLORS.blue}" stroke-width="4" stroke-linejoin="round" />
          <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
                fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
          <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
          <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
          <path d="M40 47 V56" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />
        </g>

        <!-- Satoshi Typography Wordmark -->
        <g transform="translate(-235, 175) scale(0.092)">
          <path d="${wordmark.d}" fill="${COLORS.dark}" />
        </g>
      </g>

      <!-- Category Pill -->
      <g transform="translate(430, 275)">
        <rect width="340" height="42" rx="21" fill="${COLORS.lightBlue}" stroke="#c7d9fc" stroke-width="1.5" />
        <circle cx="24" cy="21" r="5" fill="${COLORS.blue}" />
        <text x="40" y="27" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="14" fill="${COLORS.blue}" letter-spacing="2">DESKTOP &amp; MOBILE FLEET</text>
      </g>
    </g>

    <!-- SECTION 2: CENTERPIECE - DESKTOP DASHBOARD WINDOW + OVERLAPPING SMARTPHONE -->
    <g transform="translate(0, 520)">
      <!-- Desktop Browser Window Frame (Tilted / Scaled) -->
      <g transform="translate(60, 0) scale(0.53)" filter="url(#deskMockupShadow)">
        <rect width="2040" height="1244" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
        
        <!-- Window Title Bar -->
        <rect width="2040" height="60" rx="24" fill="#1e293b" />
        <g transform="translate(30, 22)">
          <circle cx="0" cy="8" r="8" fill="#ef4444" />
          <circle cx="28" cy="8" r="8" fill="#f59e0b" />
          <circle cx="56" cy="8" r="8" fill="#10b981" />
        </g>
        <rect x="700" y="12" width="640" height="36" rx="8" fill="#0f172a" />
        <text x="1020" y="36" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#cbd5e1" text-anchor="middle">https://app.sentinel.io/dashboard</text>

        <!-- Desktop Screen Content Inside Window -->
        <g transform="translate(60, 80)">
          ${getDesktopDashboardUi(1920, 1080)}
        </g>
      </g>

      <!-- Overlapping Floating Mobile Phone (Foreground Right) -->
      <g transform="translate(730, 360) scale(0.95)" filter="url(#phoneShadow)">
        <!-- Phone Outer Shell -->
        <rect x="0" y="0" width="375" height="740" rx="46" fill="#0f172a" stroke="#334155" stroke-width="4" />
        <!-- Screen Area -->
        <g transform="translate(12, 12)">
          <rect width="351" height="716" rx="36" fill="#f8fafc" />
          <!-- Phone Status Bar -->
          <text x="24" y="28" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="13" fill="#000000">10:38</text>
          <!-- Live Telemetry Card on Mobile -->
          <g transform="translate(18, 50)">
            <rect width="315" height="140" rx="16" fill="${COLORS.lightBlue}" stroke="#c7d9fc" stroke-width="1.2" />
            <text x="18" y="24" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="${COLORS.blue}">MQ-2 GAS MONITOR</text>
            <text x="18" y="66" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="38" fill="${COLORS.dark}">524 <tspan font-size="18" font-weight="600" fill="${COLORS.grayText}">ppm</tspan></text>
            <g transform="translate(18, 86)">
              <rect width="76" height="22" rx="11" fill="#dcfce7" />
              <text x="38" y="15" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="11" fill="#16a34a" text-anchor="middle">✓ SAFE</text>
            </g>
          </g>

          <!-- Real-Time Mini Chart on Mobile -->
          <g transform="translate(18, 210)">
            <rect width="315" height="230" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
            <text x="16" y="24" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="13" fill="${COLORS.dark}">Real-Time Stream</text>
            <path d="M16 130 Q70 145 120 120 T200 135 T295 105" fill="none" stroke="${COLORS.blue}" stroke-width="3" />
            <circle cx="295" cy="105" r="5" fill="${COLORS.blue}" />
            <g transform="translate(16, 170)">
              <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="${COLORS.dark}">Temp: 24.4°C &#8226; 48% RH</text>
              <text x="0" y="20" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="${COLORS.green}">Hardware Node: 1A2B Online</text>
            </g>
          </g>

          <!-- Bottom Nav Bar on Mobile -->
          <g transform="translate(0, 640)">
            <rect width="351" height="76" rx="0" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
            <circle cx="80" cy="28" r="14" fill="${COLORS.lightBlue}" />
            <circle cx="175" cy="28" r="14" fill="#f8fafc" />
            <circle cx="270" cy="28" r="14" fill="#f8fafc" />
            <!-- Home Bar Indicator -->
            <rect x="110" y="58" width="130" height="4" rx="2" fill="#000000" />
          </g>
        </g>
      </g>
    </g>

    <!-- SECTION 3: BOLD HEADLINE & VALUE PROPOSITION -->
    <g transform="translate(0, 1620)">
      <!-- Category Badge -->
      <g transform="translate(600, 0)">
        <g transform="translate(-240, 0)">
          <rect width="480" height="48" rx="24" fill="${COLORS.dark}" />
          <circle cx="24" cy="24" r="6" fill="${COLORS.blue}" />
          <text x="44" y="31" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="15" fill="#ffffff" letter-spacing="2">REAL-TIME MULTI-SCREEN TELEMETRY</text>
        </g>
      </g>

      <!-- Giant Punchline: "MONITORING FOR ALL" (Vector Path Typography) -->
      <g transform="translate(600, 140)">
        <!-- Row 1: "MONITORING" -->
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="82" fill="${COLORS.dark}" text-anchor="middle" letter-spacing="-1">MONITORING</text>
        <!-- Row 2: "FOR ALL" -->
        <text x="0" y="86" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="900" font-size="82" fill="${COLORS.blue}" text-anchor="middle" letter-spacing="-1">FOR ALL</text>
      </g>

      <!-- Subtitle Description -->
      <g transform="translate(600, 275)">
        <text x="0" y="0" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="22" fill="${COLORS.grayText}" text-anchor="middle">
          Full desktop command center &amp; instant mobile field alerts.
        </text>
        <text x="0" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="22" fill="${COLORS.grayText}" text-anchor="middle">
          Tamper-evident audit logs &amp; decentralized ESP32 telemetry mesh.
        </text>
      </g>

      <!-- 3 Feature Highlight Badges with Checkmarks -->
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
          <text x="66" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="19" fill="${COLORS.dark}">Sub-Second Toxic Gas &amp; Hazardous Spike Detection</text>
        </g>

        <g transform="translate(0, 160)">
          <rect width="920" height="64" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
          <circle cx="36" cy="32" r="14" fill="${COLORS.blue}" />
          <path d="M30 32 L34 36 L42 28" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="66" y="38" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="800" font-size="19" fill="${COLORS.dark}">Zero Cloud Lock-in &#8226; Edge-First Offline Mesh Architecture</text>
        </g>
      </g>
    </g>

    <!-- SECTION 4: HIGH-CONTRAST FOOTER -->
    <g transform="translate(0, 2380)">
      <!-- Slate Dark Background -->
      <rect width="${w}" height="420" fill="${COLORS.slateDark}" />

      <!-- Top Border Accent Line -->
      <rect width="${w}" height="6" fill="${COLORS.blue}" />

      <!-- Footer Brand Info -->
      <g transform="translate(100, 60)">
        <g transform="translate(0, 0)">
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
        </g>
        <text x="0" y="85" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="500" font-size="15" fill="#94a3b8">
          Next-Generation IoT Environmental Monitoring &amp; Telemetry.
        </text>
      </g>

      <!-- 4-Item Contact Grid -->
      <g transform="translate(100, 185)">
        <!-- Grid Item 1: Web -->
        <g transform="translate(0, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M12 20 A8 8 0 1 0 28 20 A8 8 0 1 0 12 20 M12 20 H28 M20 12 A12 8 0 0 0 20 28 M20 12 A12 8 0 0 1 20 28" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">MAIN WEBSITE</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">sentinel.io</text>
        </g>

        <!-- Grid Item 2: App / Portal -->
        <g transform="translate(540, 0)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M16 12 L24 20 L16 28 M22 20 H12" fill="none" stroke="${COLORS.blue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">FLEET CLOUD PORTAL</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">app.sentinel.io</text>
        </g>

        <!-- Grid Item 3: GitHub -->
        <g transform="translate(0, 75)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M14 24 V21 A3 3 0 0 1 17 18 H23 A3 3 0 0 1 26 21 V24 M17 15 A3 3 0 1 0 23 15 A3 3 0 1 0 17 15" fill="none" stroke="${COLORS.blue}" stroke-width="1.6" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">OPEN SOURCE CORE</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">github.com/sentinel/core</text>
        </g>

        <!-- Grid Item 4: Documentation -->
        <g transform="translate(540, 75)">
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.08)" stroke="#334155" stroke-width="1.2" />
          <path d="M14 14 H24 M14 18 H24 M14 22 H20 M12 11 H26 A2 2 0 0 1 28 13 V25 A2 2 0 0 1 26 27 H12 A2 2 0 0 1 10 25 V13 A2 2 0 0 1 12 11 Z" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" />
          <text x="50" y="16" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#94a3b8" letter-spacing="1">DEVELOPER &amp; API DOCS</text>
          <text x="50" y="32" font-family="Arial, Helvetica, 'Segoe UI', sans-serif" font-weight="700" font-size="16" fill="#ffffff">docs.sentinel.io</text>
        </g>
      </g>
    </g>
  </svg>`;
}

async function buildDesktopAssets() {
  console.log('Generating Desktop Dashboard Screenshots & Components...');

  // 1. Desktop Browser Frame Mockup (Chrome/Mac Window)
  console.log('Rendering Desktop Browser Window Mockup...');
  const browserSvg = getDesktopBrowserMockupSvg();
  const browserSvgPath = path.join(baseDir, 'desktop-dashboard-browser-frame.svg');
  const browserPngPath = path.join(baseDir, 'desktop-dashboard-browser-frame.png');
  fs.writeFileSync(browserSvgPath, browserSvg, 'utf8');
  await sharp(Buffer.from(browserSvg)).resize(2040, 1244).png().toFile(browserPngPath);

  // 2. Realistic MacBook Display Mockup
  console.log('Rendering MacBook Laptop Mockup...');
  const macbookSvg = getMacBookMockupSvg();
  const macbookSvgPath = path.join(baseDir, 'desktop-dashboard-macbook-mockup.svg');
  const macbookPngPath = path.join(baseDir, 'desktop-dashboard-macbook-mockup.png');
  fs.writeFileSync(macbookSvgPath, macbookSvg, 'utf8');
  await sharp(Buffer.from(macbookSvg)).resize(1800, 1180).png().toFile(macbookPngPath);

  // 3. Clean Full-HD Dashboard Screenshot (Borderless 1920x1080)
  console.log('Rendering Clean Full-HD 1920x1080 Dashboard Screenshot...');
  const cleanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
    ${getDesktopDashboardUi(1920, 1080)}
  </svg>`;
  const cleanSvgPath = path.join(baseDir, 'desktop-dashboard-clean-fullhd.svg');
  const cleanPngPath = path.join(baseDir, 'desktop-dashboard-clean-fullhd.png');
  fs.writeFileSync(cleanSvgPath, cleanSvg, 'utf8');
  await sharp(Buffer.from(cleanSvg)).resize(1920, 1080).png().toFile(cleanPngPath);

  // 4. Isolated Components:
  console.log('Rendering Isolated Desktop UI Components...');

  // A: Gas Stat Card
  const gasCardSvg = getCompGasCardSvg();
  fs.writeFileSync(path.join(baseDir, 'comp-desktop-stat-gas.svg'), gasCardSvg, 'utf8');
  await sharp(Buffer.from(gasCardSvg)).resize(1080, 440).png().toFile(path.join(baseDir, 'comp-desktop-stat-gas.png'));

  // B: Temp & Humidity Card
  const tempCardSvg = getCompTempHumidityCardSvg();
  fs.writeFileSync(path.join(baseDir, 'comp-desktop-stat-temp-humidity.svg'), tempCardSvg, 'utf8');
  await sharp(Buffer.from(tempCardSvg)).resize(1080, 440).png().toFile(path.join(baseDir, 'comp-desktop-stat-temp-humidity.png'));

  // C: Telemetry Area Chart Widget
  const chartSvg = getCompChartWidgetSvg();
  fs.writeFileSync(path.join(baseDir, 'comp-desktop-telemetry-chart.svg'), chartSvg, 'utf8');
  await sharp(Buffer.from(chartSvg)).resize(1880, 920).png().toFile(path.join(baseDir, 'comp-desktop-telemetry-chart.png'));

  // D: Hardware Fleet Node List
  const fleetSvg = getCompFleetListSvg();
  fs.writeFileSync(path.join(baseDir, 'comp-desktop-fleet-table.svg'), fleetSvg, 'utf8');
  await sharp(Buffer.from(fleetSvg)).resize(1480, 740).png().toFile(path.join(baseDir, 'comp-desktop-fleet-table.png'));

  // 5. Build Desktop Rollup Standing Banner Variant
  console.log('Rendering Desktop Rollup Banner Variant (1200x2800)...');
  const bannerDeskDir = path.resolve(__dirname, '..', 'canva-bunting-assets', '07_rollup_banner');
  const bannerDeskSvg = getRollupBannerDesktopSvg(1200, 2800);
  fs.writeFileSync(path.join(bannerDeskDir, 'sentinel-rollup-banner-desktop.svg'), bannerDeskSvg, 'utf8');
  await sharp(Buffer.from(bannerDeskSvg)).resize(1200, 2800).png().toFile(path.join(bannerDeskDir, 'sentinel-rollup-banner-desktop.png'));

  // Copy all assets to public directory
  console.log('Copying files to public/branding/bunting/ ...');
  const generatedFiles = fs.readdirSync(baseDir);
  for (const f of generatedFiles) {
    fs.copyFileSync(path.join(baseDir, f), path.join(publicDesktopDir, f));
  }
  fs.copyFileSync(path.join(bannerDeskDir, 'sentinel-rollup-banner-desktop.svg'), path.join(publicBuntingDir, '07_rollup_banner', 'sentinel-rollup-banner-desktop.svg'));
  fs.copyFileSync(path.join(bannerDeskDir, 'sentinel-rollup-banner-desktop.png'), path.join(publicBuntingDir, '07_rollup_banner', 'sentinel-rollup-banner-desktop.png'));

  // 6. Update HTML Asset Hub
  console.log('Injecting Desktop Dashboards & Components into CANVA_BUNTING_ASSET_HUB.html...');
  const hubPath = path.resolve(__dirname, '..', 'canva-bunting-assets', 'CANVA_BUNTING_ASSET_HUB.html');
  const pubHubPath = path.resolve(__dirname, '..', 'public', 'branding', 'bunting', 'CANVA_BUNTING_ASSET_HUB.html');

  if (fs.existsSync(hubPath)) {
    let hubHtml = fs.readFileSync(hubPath, 'utf8');

    // Remove any previous 08_desktop section if already added
    const deskSectionMarker = '<!-- SECTION_08_DESKTOP_START -->';
    const deskSectionEnd = '<!-- SECTION_08_DESKTOP_END -->';
    if (hubHtml.includes(deskSectionMarker)) {
      const p1 = hubHtml.indexOf(deskSectionMarker);
      const p2 = hubHtml.indexOf(deskSectionEnd) + deskSectionEnd.length;
      hubHtml = hubHtml.substring(0, p1) + hubHtml.substring(p2);
    }

    const desktopSectionHtml = `
    ${deskSectionMarker}
    <div class="section-title" id="desktop-dashboards-section" style="margin-top: 48px; border-top: 2px solid var(--border); padding-top: 36px;">
      <div>
        <span style="display: flex; align-items: center; gap: 8px;">
          <span class="badge" style="margin-bottom: 0;">NEW</span>
          08 Desktop Dashboard Screenshots &amp; Mockups
        </span>
        <p style="font-size: 14px; color: var(--gray); font-weight: normal; margin-top: 4px;">
          Full-HD desktop command center screens, realistic browser window frames, and MacBook laptop mockups. Perfect for pitch decks, posters, rollup banners, and Canva layouts.
        </p>
      </div>
      <span style="font-size: 14px; color: var(--gray); font-weight: 500;">3 full mockups + 1 desktop banner</span>
    </div>

    <!-- Banner Variant: Desktop + Mobile -->
    <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 32px; box-shadow: 0 6px 20px rgba(0,0,0,0.04);">
      <div style="display: flex; flex-wrap: wrap; gap: 32px; align-items: center;">
        <div style="flex: 0 0 280px; max-width: 320px; background: #f4f4f5; border-radius: 12px; padding: 12px; border: 1px solid var(--border); box-shadow: 0 10px 25px rgba(0,0,0,0.08); text-align: center;">
          <div style="max-height: 520px; overflow: hidden; border-radius: 8px;">
            ${bannerDeskSvg}
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: var(--gray); font-weight: 600;">1200 &times; 2800 px &bull; Rollup Banner (Desktop + Phone)</div>
        </div>
        <div style="flex: 1; min-width: 300px;">
          <div class="badge">BANNER VARIATION</div>
          <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 12px; color: var(--dark);">Sentinel Rollup Banner — Desktop Command Center Edition</h2>
          <p style="font-size: 15px; color: var(--gray); margin-bottom: 20px; line-height: 1.6;">
            A powerful variation of the standing rollup banner showcasing both the <strong>Full Desktop Web Dashboard window</strong> and the <strong>Mobile Smartphone field monitor</strong> together with "MONITORING FOR ALL" Satoshi typography!
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <button class="btn btn-primary" style="padding: 12px 24px; font-size: 14px;" onclick="copySvg('sentinel-rollup-banner-desktop')">📋 Copy Desktop Banner SVG</button>
            <a href="07_rollup_banner/sentinel-rollup-banner-desktop.png" download="sentinel-rollup-banner-desktop.png" class="btn btn-secondary" style="padding: 12px 24px; font-size: 14px;">⬇ Download Banner PNG (300 DPI)</a>
            <button class="btn btn-secondary" style="padding: 12px 20px; font-size: 14px;" onclick="downloadSvgDirect('sentinel-rollup-banner-desktop', 'sentinel-rollup-banner-desktop.svg')">⬇ Download SVG</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Mockups Grid -->
    <div class="grid">
      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${browserSvg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Desktop Dashboard in Dark Browser Frame</div>
            <div class="card-desc">desktop-dashboard-browser-frame.svg &bull; 2040&times;1244 Window with shadow</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('desktop-dashboard-browser-frame')">Copy SVG (Canva)</button>
            <a href="08_desktop_dashboards/desktop-dashboard-browser-frame.png" download="desktop-dashboard-browser-frame.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('desktop-dashboard-browser-frame', 'desktop-dashboard-browser-frame.svg')">Download SVG</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${macbookSvg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">MacBook Laptop Screen Mockup</div>
            <div class="card-desc">desktop-dashboard-macbook-mockup.svg &bull; 1800&times;1180 Aluminum chassis</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('desktop-dashboard-macbook-mockup')">Copy SVG (Canva)</button>
            <a href="08_desktop_dashboards/desktop-dashboard-macbook-mockup.png" download="desktop-dashboard-macbook-mockup.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('desktop-dashboard-macbook-mockup', 'desktop-dashboard-macbook-mockup.svg')">Download SVG</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${cleanSvg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Clean Full-HD 1920&times;1080 Dashboard Screen</div>
            <div class="card-desc">desktop-dashboard-clean-fullhd.svg &bull; Edge-to-edge UI screenshot</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('desktop-dashboard-clean-fullhd')">Copy SVG (Canva)</button>
            <a href="08_desktop_dashboards/desktop-dashboard-clean-fullhd.png" download="desktop-dashboard-clean-fullhd.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('desktop-dashboard-clean-fullhd', 'desktop-dashboard-clean-fullhd.svg')">Download SVG</button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 09: ISOLATED DESKTOP COMPONENTS -->
    <div class="section-title" id="desktop-components-section" style="margin-top: 48px; border-top: 2px solid var(--border); padding-top: 36px;">
      <div>
        <span style="display: flex; align-items: center; gap: 8px;">
          <span class="badge" style="margin-bottom: 0;">NEW</span>
          09 Isolated Desktop UI Components (Modular for Canva)
        </span>
        <p style="font-size: 14px; color: var(--gray); font-weight: normal; margin-top: 4px;">
          Modular bento stat cards, area chart widgets, and fleet node lists extracted as standalone components. Drag, drop, scale, and arrange anywhere in your Canva designs.
        </p>
      </div>
      <span style="font-size: 14px; color: var(--gray); font-weight: 500;">4 isolated components</span>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${gasCardSvg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Desktop Stat Card: Gas Concentration (524 ppm)</div>
            <div class="card-desc">comp-desktop-stat-gas.svg &bull; Accent header, safe badge &amp; bar</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('comp-desktop-stat-gas')">Copy SVG (Canva)</button>
            <a href="08_desktop_dashboards/comp-desktop-stat-gas.png" download="comp-desktop-stat-gas.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('comp-desktop-stat-gas', 'comp-desktop-stat-gas.svg')">Download SVG</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${tempCardSvg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Desktop Stat Card: Temp (24.4°C) &amp; Humidity (48.1%)</div>
            <div class="card-desc">comp-desktop-stat-temp-humidity.svg &bull; Dual Bento metric card</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('comp-desktop-stat-temp-humidity')">Copy SVG (Canva)</button>
            <a href="08_desktop_dashboards/comp-desktop-stat-temp-humidity.png" download="comp-desktop-stat-temp-humidity.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('comp-desktop-stat-temp-humidity', 'comp-desktop-stat-temp-humidity.svg')">Download SVG</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${chartSvg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Desktop Telemetry Chart Widget</div>
            <div class="card-desc">comp-desktop-telemetry-chart.svg &bull; Gradient area curve, 800ppm alert line, tooltip</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('comp-desktop-telemetry-chart')">Copy SVG (Canva)</button>
            <a href="08_desktop_dashboards/comp-desktop-telemetry-chart.png" download="comp-desktop-telemetry-chart.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('comp-desktop-telemetry-chart', 'comp-desktop-telemetry-chart.svg')">Download SVG</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-preview">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${fleetSvg}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">Desktop Hardware Fleet Node List</div>
            <div class="card-desc">comp-desktop-fleet-table.svg &bull; 3 ESP32 nodes, signal dBm, battery &amp; status</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copySvg('comp-desktop-fleet-table')">Copy SVG (Canva)</button>
            <a href="08_desktop_dashboards/comp-desktop-fleet-table.png" download="comp-desktop-fleet-table.png" class="btn btn-secondary">Download PNG</a>
            <button class="btn btn-secondary" onclick="downloadSvgDirect('comp-desktop-fleet-table', 'comp-desktop-fleet-table.svg')">Download SVG</button>
          </div>
        </div>
      </div>
    </div>
    ${deskSectionEnd}
`;

    const insertPoint = hubHtml.indexOf('</div>\n\n  <div id="toast"');
    if (insertPoint !== -1) {
      hubHtml = hubHtml.substring(0, insertPoint) + desktopSectionHtml + '\n' + hubHtml.substring(insertPoint);
    } else {
      const altInsert = hubHtml.lastIndexOf('</div>');
      hubHtml = hubHtml.substring(0, altInsert) + desktopSectionHtml + '\n' + hubHtml.substring(altInsert);
    }

    const deskSvgEntries = {
      'desktop-dashboard-browser-frame': browserSvg,
      'desktop-dashboard-macbook-mockup': macbookSvg,
      'desktop-dashboard-clean-fullhd': cleanSvg,
      'comp-desktop-stat-gas': gasCardSvg,
      'comp-desktop-stat-temp-humidity': tempCardSvg,
      'comp-desktop-telemetry-chart': chartSvg,
      'comp-desktop-fleet-table': fleetSvg,
      'sentinel-rollup-banner-desktop': bannerDeskSvg
    };

    const extraScriptMarker = '/* DESKTOP_SVGS_INJECTED */';
    if (!hubHtml.includes(extraScriptMarker)) {
      const scriptIndex = hubHtml.indexOf('<script>');
      if (scriptIndex !== -1) {
        const injectScript = `\n    ${extraScriptMarker}\n    Object.assign(svgDatabase, ${JSON.stringify(deskSvgEntries)});\n`;
        hubHtml = hubHtml.replace('<script>', '<script>' + injectScript);
      }
    } else {
      const reg = new RegExp('/\\* DESKTOP_SVGS_INJECTED \\*/[\\s\\S]*?Object\\.assign\\(svgDatabase, [\\s\\S]*?\\);');
      hubHtml = hubHtml.replace(reg, `${extraScriptMarker}\n    Object.assign(svgDatabase, ${JSON.stringify(deskSvgEntries)});`);
    }

    fs.writeFileSync(hubPath, hubHtml, 'utf8');
    fs.writeFileSync(pubHubPath, hubHtml, 'utf8');
    console.log('HTML Hub updated with Desktop Dashboards & Components!');
  }

  console.log('Done building desktop assets!');
}

buildDesktopAssets().catch(console.error);
