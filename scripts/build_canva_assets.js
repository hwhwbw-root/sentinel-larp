const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Load extracted glyphs
const glyphData = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_glyphs.json'), 'utf8'));
const { letters, wordmark } = glyphData;

// Output directories
const baseDir = path.resolve(__dirname, '..', 'canva-bunting-assets');
const dirs = {
  root: baseDir,
  logos: path.join(baseDir, '01_logos'),
  wordmarks: path.join(baseDir, '02_wordmarks'),
  letters: path.join(baseDir, '03_bunting_letters'),
  triangleFlags: path.join(baseDir, '04_triangle_flags'),
  swallowtailFlags: path.join(baseDir, '05_swallowtail_flags'),
  decorative: path.join(baseDir, '06_decorative_elements'),
};

for (const d of Object.values(dirs)) {
  fs.mkdirSync(d, { recursive: true });
}

// Also public folder for web serving
const publicBuntingDir = path.resolve(__dirname, '..', 'public', 'branding', 'bunting');
fs.mkdirSync(publicBuntingDir, { recursive: true });

// Brand Colors
const COLORS = {
  blue: '#2f6fed',
  lightBlue: '#f0f5ff',
  dark: '#18181b',
  slateDark: '#0f172a',
  white: '#ffffff',
  offWhite: '#fafafa',
  borderLight: '#e4e4e7',
  grayText: '#71717a',
  green: '#16a34a',
  amber: '#f59e0b',
  red: '#ef4444'
};

// SVG Templates
function getShieldSvg(variant = 'color', size = 400) {
  let stroke = COLORS.blue;
  let innerFill = COLORS.lightBlue;
  let innerStroke = COLORS.blue;
  let eyeStroke = COLORS.blue;
  let pupilFill = COLORS.blue;
  let stemStroke = COLORS.blue;
  let outerFill = 'none';

  if (variant === 'white') {
    stroke = COLORS.white;
    innerFill = 'rgba(255, 255, 255, 0.15)';
    innerStroke = COLORS.white;
    eyeStroke = COLORS.white;
    pupilFill = COLORS.white;
    stemStroke = COLORS.white;
  } else if (variant === 'dark') {
    stroke = COLORS.dark;
    innerFill = '#f4f4f5';
    innerStroke = COLORS.dark;
    eyeStroke = COLORS.dark;
    pupilFill = COLORS.dark;
    stemStroke = COLORS.dark;
  } else if (variant === 'solid-blue') {
    stroke = COLORS.blue;
    innerFill = COLORS.blue;
    innerStroke = COLORS.blue;
    eyeStroke = COLORS.white;
    pupilFill = COLORS.white;
    stemStroke = COLORS.white;
    outerFill = COLORS.blue;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}">
  <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
        fill="${outerFill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round" />
  <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
        fill="${innerFill}" stroke="${innerStroke}" stroke-width="2" />
  <circle cx="40" cy="36" r="9" fill="none" stroke="${eyeStroke}" stroke-width="3.5" />
  <circle cx="40" cy="36" r="2.6" fill="${pupilFill}" />
  <path d="M40 47 V56" stroke="${stemStroke}" stroke-width="3.5" stroke-linecap="round" />
</svg>`;
}

function getBadgeCircleSvg(size = 500) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${size}" height="${size}">
  <circle cx="60" cy="60" r="56" fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="3" />
  <circle cx="60" cy="60" r="50" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
  <g transform="translate(20, 20)">
    <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
          fill="none" stroke="${COLORS.blue}" stroke-width="4" stroke-linejoin="round" />
    <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
          fill="#ffffff" stroke="${COLORS.blue}" stroke-width="2" />
    <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
    <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
    <path d="M40 47 V56" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />
  </g>
</svg>`;
}

function getShieldRadarSvg(size = 500) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="${size}" height="${size}">
  <circle cx="80" cy="76" r="55" fill="none" stroke="${COLORS.blue}" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.3" />
  <circle cx="80" cy="76" r="68" fill="none" stroke="${COLORS.blue}" stroke-width="1" opacity="0.2" />
  <circle cx="80" cy="76" r="76" fill="none" stroke="${COLORS.blue}" stroke-width="1" stroke-dasharray="3 3" opacity="0.15" />
  <g transform="translate(40, 36)">
    <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
          fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="4" stroke-linejoin="round" />
    <circle cx="40" cy="36" r="9" fill="none" stroke="${COLORS.blue}" stroke-width="3.5" />
    <circle cx="40" cy="36" r="2.6" fill="${COLORS.blue}" />
    <path d="M40 47 V56" stroke="${COLORS.blue}" stroke-width="3.5" stroke-linecap="round" />
  </g>
</svg>`;
}

function getWordmarkSvg(color = COLORS.blue, width = 1200) {
  const vbW = wordmark.width;
  const vbH = 800;
  const h = Math.round((vbH / vbW) * width);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="${width}" height="${h}">
  <path d="${wordmark.d}" fill="${color}" fill-rule="nonzero" />
</svg>`;
}

function getHorizontalLockupSvg(colorVariant = 'blue', width = 1400) {
  let shieldFill = COLORS.lightBlue;
  let primaryColor = COLORS.blue;
  let textColor = COLORS.dark;

  if (colorVariant === 'blue') {
    textColor = COLORS.blue;
  } else if (colorVariant === 'white') {
    shieldFill = 'rgba(255,255,255,0.15)';
    primaryColor = COLORS.white;
    textColor = COLORS.white;
  } else if (colorVariant === 'dark') {
    shieldFill = '#f4f4f5';
    primaryColor = COLORS.dark;
    textColor = COLORS.dark;
  }

  const totalW = 6200;
  const totalH = 840;
  const height = Math.round((totalH / totalW) * width);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${width}" height="${height}">
  <g transform="translate(0, 40) scale(9.5)">
    <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
          fill="none" stroke="${primaryColor}" stroke-width="4" stroke-linejoin="round" />
    <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
          fill="${shieldFill}" stroke="${primaryColor}" stroke-width="2" />
    <circle cx="40" cy="36" r="9" fill="none" stroke="${primaryColor}" stroke-width="3.5" />
    <circle cx="40" cy="36" r="2.6" fill="${primaryColor}" />
    <path d="M40 47 V56" stroke="${primaryColor}" stroke-width="3.5" stroke-linecap="round" />
  </g>
  <g transform="translate(1050, 40)">
    <path d="${wordmark.d}" fill="${textColor}" fill-rule="nonzero" />
  </g>
</svg>`;
}

function getVerticalLockupSvg(colorVariant = 'blue', height = 1000) {
  let shieldFill = COLORS.lightBlue;
  let primaryColor = COLORS.blue;
  let textColor = COLORS.dark;

  if (colorVariant === 'blue') {
    textColor = COLORS.blue;
  } else if (colorVariant === 'white') {
    shieldFill = 'rgba(255,255,255,0.15)';
    primaryColor = COLORS.white;
    textColor = COLORS.white;
  } else if (colorVariant === 'dark') {
    shieldFill = '#f4f4f5';
    primaryColor = COLORS.dark;
    textColor = COLORS.dark;
  }

  const totalW = 5146;
  const totalH = 3800;
  const width = Math.round((totalW / totalH) * height);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${width}" height="${height}">
  <g transform="translate(1373, 100) scale(30)">
    <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
          fill="none" stroke="${primaryColor}" stroke-width="4" stroke-linejoin="round" />
    <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
          fill="${shieldFill}" stroke="${primaryColor}" stroke-width="2" />
    <circle cx="40" cy="36" r="9" fill="none" stroke="${primaryColor}" stroke-width="3.5" />
    <circle cx="40" cy="36" r="2.6" fill="${primaryColor}" />
    <path d="M40 47 V56" stroke="${primaryColor}" stroke-width="3.5" stroke-linecap="round" />
  </g>
  <g transform="translate(0, 2800)">
    <path d="${wordmark.d}" fill="${textColor}" fill-rule="nonzero" />
  </g>
</svg>`;
}

function getLetterSvg(char, color = COLORS.blue, size = 500) {
  const info = letters[char];
  const [xmin, ymin, xmax, ymax] = info.bounds;
  const glyphW = xmax - xmin;
  
  const pad = 120;
  const boxW = Math.max(info.width, glyphW) + pad * 2;
  const boxH = 800 + pad * 2;
  const offsetX = (boxW - info.width) / 2;
  const offsetY = pad;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${boxW} ${boxH}" width="${size}" height="${size}">
  <g transform="translate(${offsetX}, ${offsetY})">
    <path d="${info.d}" fill="${color}" fill-rule="nonzero" />
  </g>
</svg>`;
}

// BUNTING TRIANGLE FLAG
function getTriangleFlagSvg({
  type = 'shield',
  bgColor = COLORS.blue,
  fgColor = COLORS.white,
  showFoldTab = true,
  width = 600,
  height = 850
}) {
  let content = '';

  if (type === 'shield') {
    const isBgBlue = bgColor === COLORS.blue;
    const shieldStroke = isBgBlue ? COLORS.white : COLORS.blue;
    const innerFill = isBgBlue ? 'rgba(255,255,255,0.18)' : COLORS.lightBlue;
    content = `
    <g transform="translate(180, 230) scale(3)">
      <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
            fill="none" stroke="${shieldStroke}" stroke-width="4" stroke-linejoin="round" />
      <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
            fill="${innerFill}" stroke="${shieldStroke}" stroke-width="2" />
      <circle cx="40" cy="36" r="9" fill="none" stroke="${shieldStroke}" stroke-width="3.5" />
      <circle cx="40" cy="36" r="2.6" fill="${shieldStroke}" />
      <path d="M40 47 V56" stroke="${shieldStroke}" stroke-width="3.5" stroke-linecap="round" />
    </g>`;
  } else if (letters[type]) {
    const info = letters[type];
    const letterScale = 0.36;
    const scaledW = info.width * letterScale;
    const startX = 300 - (scaledW / 2);
    content = `
    <g transform="translate(${startX}, 250) scale(${letterScale})">
      <path d="${info.d}" fill="${fgColor}" fill-rule="nonzero" />
    </g>`;
  } else if (type === 'mesh') {
    content = `
    <g transform="translate(120, 220) scale(0.85)">
      <line x1="90" y1="80" x2="260" y2="60" stroke="${fgColor}" stroke-opacity="0.4" stroke-width="2" />
      <line x1="90" y1="80" x2="190" y2="190" stroke="${fgColor}" stroke-opacity="0.4" stroke-width="2" />
      <line x1="260" y1="60" x2="340" y2="170" stroke="${fgColor}" stroke-opacity="0.4" stroke-width="2" />
      <line x1="190" y1="190" x2="340" y2="170" stroke="${fgColor}" stroke-opacity="0.4" stroke-width="2" />
      <line x1="190" y1="190" x2="120" y2="280" stroke="${fgColor}" stroke-opacity="0.4" stroke-width="2" />
      <line x1="340" y1="170" x2="300" y2="300" stroke="${fgColor}" stroke-opacity="0.4" stroke-width="2" />
      <line x1="120" y1="280" x2="300" y2="300" stroke="${fgColor}" stroke-opacity="0.4" stroke-width="2" />
      <circle cx="90" cy="80" r="8" fill="${fgColor}" />
      <circle cx="260" cy="60" r="8" fill="${fgColor}" />
      <circle cx="190" cy="190" r="14" fill="${fgColor}" fill-opacity="0.2" stroke="${fgColor}" stroke-width="2" />
      <circle cx="190" cy="190" r="8" fill="${fgColor}" />
      <circle cx="340" cy="170" r="8" fill="${fgColor}" />
      <circle cx="120" cy="280" r="8" fill="${fgColor}" />
      <circle cx="300" cy="300" r="8" fill="${fgColor}" />
    </g>`;
  }

  const borderStroke = bgColor === COLORS.white ? `stroke="${COLORS.borderLight}" stroke-width="2"` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="${width}" height="${height}">
  <defs>
    <filter id="soft-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08" />
    </filter>
  </defs>

  ${showFoldTab ? `
  <!-- Top Fold Flap Guide -->
  <polygon points="30,80 30,10 570,10 570,80" fill="${bgColor}" opacity="0.85" />
  <line x1="30" y1="80" x2="570" y2="80" stroke="${bgColor === COLORS.white ? '#a1a1aa' : '#ffffff'}" stroke-width="2" stroke-dasharray="6,6" opacity="0.7" />
  <!-- Punch Hole Guides -->
  <circle cx="70" cy="45" r="12" fill="none" stroke="${bgColor === COLORS.white ? '#a1a1aa' : '#ffffff'}" stroke-width="2" stroke-dasharray="3,3" />
  <circle cx="530" cy="45" r="12" fill="none" stroke="${bgColor === COLORS.white ? '#a1a1aa' : '#ffffff'}" stroke-width="2" stroke-dasharray="3,3" />
  <text x="300" y="50" font-family="Arial, sans-serif" font-size="12" fill="${bgColor === COLORS.white ? '#a1a1aa' : '#ffffff'}" text-anchor="middle" letter-spacing="1">FOLD FLAP OVER STRING</text>
  ` : ''}

  <!-- Triangle Pennant Body -->
  <polygon points="30,80 570,80 300,820" fill="${bgColor}" ${borderStroke} filter="url(#soft-shadow)" />

  <!-- Accent top bar on flag -->
  <line x1="50" y1="95" x2="550" y2="95" stroke="${fgColor}" stroke-width="3" opacity="0.3" stroke-linecap="round" />

  <!-- Flag Content -->
  ${content}
</svg>`;
}

// BUNTING SWALLOWTAIL FLAG
function getSwallowtailFlagSvg({
  type = 'shield',
  bgColor = COLORS.blue,
  fgColor = COLORS.white,
  showFoldTab = true,
  width = 600,
  height = 850
}) {
  let content = '';

  if (type === 'shield') {
    const isBgBlue = bgColor === COLORS.blue;
    const shieldStroke = isBgBlue ? COLORS.white : COLORS.blue;
    const innerFill = isBgBlue ? 'rgba(255,255,255,0.18)' : COLORS.lightBlue;
    content = `
    <g transform="translate(180, 240) scale(3)">
      <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z"
            fill="none" stroke="${shieldStroke}" stroke-width="4" stroke-linejoin="round" />
      <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z"
            fill="${innerFill}" stroke="${shieldStroke}" stroke-width="2" />
      <circle cx="40" cy="36" r="9" fill="none" stroke="${shieldStroke}" stroke-width="3.5" />
      <circle cx="40" cy="36" r="2.6" fill="${shieldStroke}" />
      <path d="M40 47 V56" stroke="${shieldStroke}" stroke-width="3.5" stroke-linecap="round" />
    </g>`;
  } else if (letters[type]) {
    const info = letters[type];
    const letterScale = 0.36;
    const scaledW = info.width * letterScale;
    const startX = 300 - (scaledW / 2);
    content = `
    <g transform="translate(${startX}, 250) scale(${letterScale})">
      <path d="${info.d}" fill="${fgColor}" fill-rule="nonzero" />
    </g>`;
  }

  const borderStroke = bgColor === COLORS.white ? `stroke="${COLORS.borderLight}" stroke-width="2"` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="${width}" height="${height}">
  ${showFoldTab ? `
  <!-- Top Fold Flap Guide -->
  <polygon points="30,80 30,10 570,10 570,80" fill="${bgColor}" opacity="0.85" />
  <line x1="30" y1="80" x2="570" y2="80" stroke="${bgColor === COLORS.white ? '#a1a1aa' : '#ffffff'}" stroke-width="2" stroke-dasharray="6,6" opacity="0.7" />
  <circle cx="70" cy="45" r="12" fill="none" stroke="${bgColor === COLORS.white ? '#a1a1aa' : '#ffffff'}" stroke-width="2" stroke-dasharray="3,3" />
  <circle cx="530" cy="45" r="12" fill="none" stroke="${bgColor === COLORS.white ? '#a1a1aa' : '#ffffff'}" stroke-width="2" stroke-dasharray="3,3" />
  <text x="300" y="50" font-family="Arial, sans-serif" font-size="12" fill="${bgColor === COLORS.white ? '#a1a1aa' : '#ffffff'}" text-anchor="middle" letter-spacing="1">FOLD FLAP OVER STRING</text>
  ` : ''}

  <!-- Swallowtail Pennant Body -->
  <polygon points="30,80 570,80 570,780 300,660 30,780" fill="${bgColor}" ${borderStroke} />

  <!-- Accent top bar on flag -->
  <line x1="60" y1="100" x2="540" y2="100" stroke="${fgColor}" stroke-width="3" opacity="0.3" stroke-linecap="round" />

  <!-- Flag Content -->
  ${content}
</svg>`;
}

// Decorative sensor network graphic (isolated)
function getSensorMeshSvg(size = 600) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 380" width="${size}" height="${Math.round(size * 380 / 420)}">
  <defs>
    <radialGradient id="mesh-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${COLORS.blue}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${COLORS.blue}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <circle cx="190" cy="190" r="120" fill="url(#mesh-glow)" />
  <line x1="90" y1="80" x2="260" y2="60" stroke="${COLORS.blue}" stroke-opacity="0.35" stroke-width="2" />
  <line x1="90" y1="80" x2="190" y2="190" stroke="${COLORS.blue}" stroke-opacity="0.35" stroke-width="2" />
  <line x1="260" y1="60" x2="340" y2="170" stroke="${COLORS.blue}" stroke-opacity="0.35" stroke-width="2" />
  <line x1="190" y1="190" x2="340" y2="170" stroke="${COLORS.blue}" stroke-opacity="0.35" stroke-width="2" />
  <line x1="190" y1="190" x2="120" y2="280" stroke="${COLORS.blue}" stroke-opacity="0.35" stroke-width="2" />
  <line x1="340" y1="170" x2="300" y2="300" stroke="${COLORS.blue}" stroke-opacity="0.35" stroke-width="2" />
  <line x1="120" y1="280" x2="300" y2="300" stroke="${COLORS.blue}" stroke-opacity="0.35" stroke-width="2" />
  <line x1="90" y1="80" x2="120" y2="280" stroke="${COLORS.blue}" stroke-opacity="0.15" stroke-width="1.5" stroke-dasharray="4 4" />
  <line x1="260" y1="60" x2="300" y2="300" stroke="${COLORS.blue}" stroke-opacity="0.15" stroke-width="1.5" stroke-dasharray="4 4" />

  <circle cx="90" cy="80" r="7" fill="${COLORS.blue}" />
  <circle cx="260" cy="60" r="7" fill="${COLORS.blue}" />
  <circle cx="190" cy="190" r="16" fill="none" stroke="${COLORS.blue}" stroke-width="2" opacity="0.5" />
  <circle cx="190" cy="190" r="9" fill="${COLORS.blue}" />
  <circle cx="340" cy="170" r="7" fill="${COLORS.blue}" />
  <circle cx="120" cy="280" r="7" fill="${COLORS.blue}" />
  <circle cx="300" cy="300" r="7" fill="${COLORS.blue}" />
</svg>`;
}

// IoT Icons
function getSensorIconsSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 150" width="600" height="150">
  <g transform="translate(50, 25)">
    <circle cx="50" cy="50" r="45" fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
    <path d="M50 25 C45 38 35 45 35 57 C35 66 42 73 50 73 C58 73 65 66 65 57 C65 45 55 38 50 25 Z" fill="${COLORS.blue}" />
    <path d="M50 48 C48 53 44 57 44 61 C44 64 47 67 50 67 C53 67 56 64 56 61 C56 57 52 53 50 48 Z" fill="#ffffff" />
    <text x="50" y="92" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="${COLORS.dark}" text-anchor="middle">AIR / GAS</text>
  </g>
  <g transform="translate(185, 25)">
    <circle cx="50" cy="50" r="45" fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
    <path d="M47 30 H53 V58 C57 60 60 65 60 70 C60 76 56 80 50 80 C44 80 40 76 40 70 C40 65 43 60 47 58 Z" fill="none" stroke="${COLORS.blue}" stroke-width="3" stroke-linejoin="round" />
    <circle cx="50" cy="70" r="6" fill="${COLORS.blue}" />
    <rect x="48" y="44" width="4" height="20" fill="${COLORS.blue}" />
    <text x="50" y="92" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="${COLORS.dark}" text-anchor="middle">TEMP</text>
  </g>
  <g transform="translate(320, 25)">
    <circle cx="50" cy="50" r="45" fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
    <path d="M50 28 C50 28 34 50 34 62 C34 71 41 78 50 78 C59 78 66 71 66 62 C66 50 50 28 50 28 Z" fill="${COLORS.blue}" />
    <circle cx="45" cy="58" r="3" fill="#ffffff" opacity="0.7" />
    <text x="50" y="92" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="${COLORS.dark}" text-anchor="middle">HUMIDITY</text>
  </g>
  <g transform="translate(455, 25)">
    <circle cx="50" cy="50" r="45" fill="${COLORS.lightBlue}" stroke="${COLORS.blue}" stroke-width="2" />
    <path d="M50 25 L68 32 V45 C68 57 60 66 50 72 C40 66 32 57 32 45 V32 Z" fill="none" stroke="${COLORS.blue}" stroke-width="3" stroke-linejoin="round" />
    <path d="M43 47 L48 52 L58 40" fill="none" stroke="${COLORS.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <text x="50" y="92" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="${COLORS.dark}" text-anchor="middle">STATUS OK</text>
  </g>
</svg>`;
}

// Bunting strung together ribbon preview
function getStrungBuntingPreviewSvg() {
  const flagW = 120;
  const flagH = 170;
  const gap = 18;
  const count = 10;
  const totalW = (flagW * count) + (gap * (count - 1)) + 160;
  const totalH = 280;

  const sequence = [
    { type: 'shield', bg: COLORS.blue, fg: COLORS.white },
    { type: 'S', bg: COLORS.white, fg: COLORS.blue },
    { type: 'E', bg: COLORS.blue, fg: COLORS.white },
    { type: 'N', bg: COLORS.white, fg: COLORS.blue },
    { type: 'T', bg: COLORS.blue, fg: COLORS.white },
    { type: 'I', bg: COLORS.white, fg: COLORS.blue },
    { type: 'N', bg: COLORS.blue, fg: COLORS.white },
    { type: 'E', bg: COLORS.white, fg: COLORS.blue },
    { type: 'L', bg: COLORS.blue, fg: COLORS.white },
    { type: 'shield', bg: COLORS.white, fg: COLORS.blue },
  ];

  let flagsMarkup = '';
  sequence.forEach((item, idx) => {
    const x = 80 + idx * (flagW + gap);
    const sag = Math.sin((idx + 0.5) / count * Math.PI) * 22;
    const y = 50 + sag;
    
    let emblem = '';
    if (item.type === 'shield') {
      const isBlue = item.bg === COLORS.blue;
      const stroke = isBlue ? COLORS.white : COLORS.blue;
      const fill = isBlue ? 'rgba(255,255,255,0.2)' : COLORS.lightBlue;
      emblem = `<g transform="translate(${x + flagW/2 - 20}, ${y + 35}) scale(0.5)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="${stroke}" stroke-width="4" />
        <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z" fill="${fill}" stroke="${stroke}" stroke-width="2" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="${stroke}" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="${stroke}" />
      </g>`;
    } else {
      const info = letters[item.type];
      const scale = 0.07;
      const sw = info.width * scale;
      emblem = `<g transform="translate(${x + flagW/2 - sw/2}, ${y + 38}) scale(${scale})">
        <path d="${info.d}" fill="${item.fg}" fill-rule="nonzero" />
      </g>`;
    }

    const border = item.bg === COLORS.white ? `stroke="${COLORS.borderLight}" stroke-width="1.5"` : '';

    flagsMarkup += `
    <g>
      <polygon points="${x},${y} ${x + flagW},${y} ${x + flagW/2},${y + flagH}" fill="${item.bg}" ${border} />
      <line x1="${x + 6}" y1="${y + 4}" x2="${x + flagW - 6}" y2="${y + 4}" stroke="${item.fg}" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.5" />
      ${emblem}
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">
  <rect width="${totalW}" height="${totalH}" fill="#fafafa" rx="16" />
  <path d="M 20 60 Q ${totalW / 2} 115 ${totalW - 20} 60" fill="none" stroke="#a1a1aa" stroke-width="3" stroke-dasharray="6,4" />
  <circle cx="20" cy="60" r="5" fill="#71717a" />
  <circle cx="${totalW - 20}" cy="60" r="5" fill="#71717a" />
  ${flagsMarkup}
</svg>`;
}

// Build list of all assets
const assets = [];

// 1. Logos
assets.push({
  dir: dirs.logos,
  name: 'sentinel-shield-color',
  svg: getShieldSvg('color', 600),
  title: 'Sentinel Shield (Primary Electric Blue & Ice Blue)'
});
assets.push({
  dir: dirs.logos,
  name: 'sentinel-shield-white',
  svg: getShieldSvg('white', 600),
  title: 'Sentinel Shield (Pure White for Dark & Blue Flags)'
});
assets.push({
  dir: dirs.logos,
  name: 'sentinel-shield-dark',
  svg: getShieldSvg('dark', 600),
  title: 'Sentinel Shield (Deep Zinc / Slate Monochrome)'
});
assets.push({
  dir: dirs.logos,
  name: 'sentinel-shield-solid-blue',
  svg: getShieldSvg('solid-blue', 600),
  title: 'Sentinel Shield (Solid Electric Blue Silhouette)'
});
assets.push({
  dir: dirs.logos,
  name: 'sentinel-shield-badge-circle',
  svg: getBadgeCircleSvg(600),
  title: 'Sentinel Circular Emblem Badge'
});
assets.push({
  dir: dirs.logos,
  name: 'sentinel-shield-radar',
  svg: getShieldRadarSvg(600),
  title: 'Sentinel Shield with Radar Waves'
});

// 2. Wordmarks
assets.push({
  dir: dirs.wordmarks,
  name: 'sentinel-wordmark-blue',
  svg: getWordmarkSvg(COLORS.blue, 1400),
  title: 'Sentinel Wordmark (Electric Blue, Satoshi Bold)'
});
assets.push({
  dir: dirs.wordmarks,
  name: 'sentinel-wordmark-dark',
  svg: getWordmarkSvg(COLORS.dark, 1400),
  title: 'Sentinel Wordmark (Deep Zinc #18181b, Satoshi Bold)'
});
assets.push({
  dir: dirs.wordmarks,
  name: 'sentinel-wordmark-white',
  svg: getWordmarkSvg(COLORS.white, 1400),
  title: 'Sentinel Wordmark (Pure White, Satoshi Bold)'
});
assets.push({
  dir: dirs.wordmarks,
  name: 'sentinel-lockup-horizontal-blue',
  svg: getHorizontalLockupSvg('blue', 1600),
  title: 'Sentinel Primary Horizontal Lockup (Shield + Wordmark, Blue)'
});
assets.push({
  dir: dirs.wordmarks,
  name: 'sentinel-lockup-horizontal-dark',
  svg: getHorizontalLockupSvg('dark', 1600),
  title: 'Sentinel Primary Horizontal Lockup (Shield + Wordmark, Dark)'
});
assets.push({
  dir: dirs.wordmarks,
  name: 'sentinel-lockup-horizontal-white',
  svg: getHorizontalLockupSvg('white', 1600),
  title: 'Sentinel Horizontal Lockup (Pure White)'
});
assets.push({
  dir: dirs.wordmarks,
  name: 'sentinel-lockup-vertical-blue',
  svg: getVerticalLockupSvg('blue', 1200),
  title: 'Sentinel Vertical Stacked Lockup (Ideal for Pennants)'
});
assets.push({
  dir: dirs.wordmarks,
  name: 'sentinel-lockup-vertical-white',
  svg: getVerticalLockupSvg('white', 1200),
  title: 'Sentinel Vertical Stacked Lockup (Pure White)'
});

// 3. Individual Letters (S - E - N - T - I - N - E - L)
const buntingLetters = ['S', 'E', 'N', 'T', 'I', 'N', 'E', 'L'];
buntingLetters.forEach((char, idx) => {
  const suffix = (idx === 5) ? '2' : (idx === 6) ? '2' : '';
  const id = `${char}${suffix}`;

  assets.push({
    dir: dirs.letters,
    name: `letter-${id}-blue`,
    svg: getLetterSvg(char, COLORS.blue, 600),
    title: `Letter ${char} (Electric Blue, Satoshi Bold)`
  });
  assets.push({
    dir: dirs.letters,
    name: `letter-${id}-white`,
    svg: getLetterSvg(char, COLORS.white, 600),
    title: `Letter ${char} (White, Satoshi Bold)`
  });
  assets.push({
    dir: dirs.letters,
    name: `letter-${id}-dark`,
    svg: getLetterSvg(char, COLORS.dark, 600),
    title: `Letter ${char} (Deep Zinc, Satoshi Bold)`
  });
});

// 4. Ready-to-Print Triangle Pennant Flags
assets.push({
  dir: dirs.triangleFlags,
  name: 'flag-triangle-shield-blue',
  svg: getTriangleFlagSvg({ type: 'shield', bgColor: COLORS.blue, fgColor: COLORS.white }),
  title: 'Triangle Flag: Sentinel Shield (Electric Blue)'
});
assets.push({
  dir: dirs.triangleFlags,
  name: 'flag-triangle-shield-white',
  svg: getTriangleFlagSvg({ type: 'shield', bgColor: COLORS.white, fgColor: COLORS.blue }),
  title: 'Triangle Flag: Sentinel Shield (White & Electric Blue)'
});
assets.push({
  dir: dirs.triangleFlags,
  name: 'flag-triangle-shield-dark',
  svg: getTriangleFlagSvg({ type: 'shield', bgColor: COLORS.slateDark, fgColor: COLORS.white }),
  title: 'Triangle Flag: Sentinel Shield (Slate Dark)'
});
assets.push({
  dir: dirs.triangleFlags,
  name: 'flag-triangle-mesh-blue',
  svg: getTriangleFlagSvg({ type: 'mesh', bgColor: COLORS.blue, fgColor: COLORS.white }),
  title: 'Triangle Flag: Sensor Network Mesh (Electric Blue)'
});

// Alternating letter flags for triangle bunting
buntingLetters.forEach((char, idx) => {
  const suffix = (idx === 5) ? '2' : (idx === 6) ? '2' : '';
  const id = `${char}${suffix}`;
  const isBlueBg = idx % 2 === 0;
  const bg = isBlueBg ? COLORS.blue : COLORS.white;
  const fg = isBlueBg ? COLORS.white : COLORS.blue;

  assets.push({
    dir: dirs.triangleFlags,
    name: `flag-triangle-${id}`,
    svg: getTriangleFlagSvg({ type: char, bgColor: bg, fgColor: fg }),
    title: `Triangle Flag: Letter ${char} (${isBlueBg ? 'Blue Background' : 'White Background'})`
  });
});

// 5. Swallowtail / V-Notch Pennants
assets.push({
  dir: dirs.swallowtailFlags,
  name: 'flag-swallowtail-shield-blue',
  svg: getSwallowtailFlagSvg({ type: 'shield', bgColor: COLORS.blue, fgColor: COLORS.white }),
  title: 'Swallowtail Flag: Sentinel Shield (Electric Blue)'
});
assets.push({
  dir: dirs.swallowtailFlags,
  name: 'flag-swallowtail-shield-white',
  svg: getSwallowtailFlagSvg({ type: 'shield', bgColor: COLORS.white, fgColor: COLORS.blue }),
  title: 'Swallowtail Flag: Sentinel Shield (White)'
});

buntingLetters.forEach((char, idx) => {
  const suffix = (idx === 5) ? '2' : (idx === 6) ? '2' : '';
  const id = `${char}${suffix}`;
  const isBlueBg = idx % 2 === 0;
  const bg = isBlueBg ? COLORS.blue : COLORS.white;
  const fg = isBlueBg ? COLORS.white : COLORS.blue;

  assets.push({
    dir: dirs.swallowtailFlags,
    name: `flag-swallowtail-${id}`,
    svg: getSwallowtailFlagSvg({ type: char, bgColor: bg, fgColor: fg }),
    title: `Swallowtail Flag: Letter ${char} (${isBlueBg ? 'Blue Background' : 'White Background'})`
  });
});

// 6. Decorative Motifs
assets.push({
  dir: dirs.decorative,
  name: 'sensor-network-mesh',
  svg: getSensorMeshSvg(800),
  title: 'Sentinel IoT Sensor Network Graphic'
});
assets.push({
  dir: dirs.decorative,
  name: 'iot-sensor-icons-row',
  svg: getSensorIconsSvg(),
  title: 'IoT Sensor Metrics Icons (Gas, Temp, Humidity, Shield)'
});
assets.push({
  dir: dirs.decorative,
  name: 'bunting-strung-preview',
  svg: getStrungBuntingPreviewSvg(),
  title: 'Full Strung Bunting Preview Mockup'
});

// 7. Master Canva SVG Sheet (Clean, Spacious layout)
function getMasterSheetSvg() {
  const sheetW = 3600;
  const sheetH = 2600;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sheetW} ${sheetH}" width="${sheetW}" height="${sheetH}">
  <defs>
    <style>
      .hdr { font-family: Arial, sans-serif; font-weight: 800; font-size: 32px; fill: #18181b; letter-spacing: 2px; }
      .sub { font-family: Arial, sans-serif; font-weight: 500; font-size: 18px; fill: #71717a; }
      .lbl { font-family: Arial, sans-serif; font-weight: 700; font-size: 15px; fill: #2f6fed; }
      .box { fill: #ffffff; stroke: #e4e4e7; rx: 16px; }
    </style>
  </defs>
  <rect width="${sheetW}" height="${sheetH}" fill="#fafafa" />

  <!-- Header Banner -->
  <g transform="translate(100, 80)">
    <text x="0" y="40" class="hdr" font-size="46">SENTINEL BRAND ASSET KIT FOR CANVA &amp; BUNTING</text>
    <text x="0" y="80" class="sub" font-size="22">Native SVG vector outlines (Satoshi typography, Electric Blue #2f6fed, no font dependencies)</text>
  </g>

  <!-- SECTION 1: LOGOS & EMBLEMS -->
  <g transform="translate(100, 220)">
    <text x="0" y="0" class="hdr">1. CORE LOGO &amp; SHIELD ASSETS</text>
    
    <!-- Color Shield -->
    <g transform="translate(0, 30)">
      <rect width="220" height="220" class="box" />
      <g transform="translate(50, 50) scale(1.5)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="#2f6fed" stroke-width="4" stroke-linejoin="round" />
        <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z" fill="#f0f5ff" stroke="#2f6fed" stroke-width="2" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#2f6fed" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#2f6fed" />
        <path d="M40 47 V56" stroke="#2f6fed" stroke-width="3.5" stroke-linecap="round" />
      </g>
      <text x="110" y="270" class="lbl" text-anchor="middle">Primary Color</text>
    </g>

    <!-- White Shield on Blue -->
    <g transform="translate(260, 30)">
      <rect width="220" height="220" fill="#2f6fed" rx="16" />
      <g transform="translate(50, 50) scale(1.5)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
        <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="2" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#ffffff" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#ffffff" />
        <path d="M40 47 V56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
      </g>
      <text x="110" y="270" class="lbl" text-anchor="middle">White Outlined</text>
    </g>

    <!-- Dark Shield -->
    <g transform="translate(520, 30)">
      <rect width="220" height="220" class="box" />
      <g transform="translate(50, 50) scale(1.5)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="#18181b" stroke-width="4" stroke-linejoin="round" />
        <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z" fill="#f4f4f5" stroke="#18181b" stroke-width="2" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#18181b" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#18181b" />
        <path d="M40 47 V56" stroke="#18181b" stroke-width="3.5" stroke-linecap="round" />
      </g>
      <text x="110" y="270" class="lbl" text-anchor="middle">Deep Zinc Dark</text>
    </g>

    <!-- Circular Badge -->
    <g transform="translate(780, 30)">
      <rect width="220" height="220" class="box" />
      <circle cx="110" cy="110" r="85" fill="#f0f5ff" stroke="#2f6fed" stroke-width="2.5" />
      <circle cx="110" cy="110" r="76" fill="none" stroke="#2f6fed" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6" />
      <g transform="translate(55, 50) scale(1.4)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="#2f6fed" stroke-width="4" stroke-linejoin="round" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#2f6fed" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#2f6fed" />
      </g>
      <text x="110" y="270" class="lbl" text-anchor="middle">Circular Badge</text>
    </g>

    <!-- Radar Shield -->
    <g transform="translate(1040, 30)">
      <rect width="220" height="220" class="box" />
      <circle cx="110" cy="110" r="80" fill="none" stroke="#2f6fed" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.3" />
      <circle cx="110" cy="110" r="95" fill="none" stroke="#2f6fed" stroke-width="1" opacity="0.2" />
      <g transform="translate(55, 50) scale(1.4)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="#f0f5ff" stroke="#2f6fed" stroke-width="4" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#2f6fed" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#2f6fed" />
      </g>
      <text x="110" y="270" class="lbl" text-anchor="middle">Radar Shield</text>
    </g>
  </g>

  <!-- SECTION 2: WORDMARKS & LOCKUPS -->
  <g transform="translate(1420, 220)">
    <text x="0" y="0" class="hdr">2. SATOSHI TYPOGRAPHY &amp; WORDMARKS</text>
    
    <!-- Wordmark Blue -->
    <g transform="translate(0, 30)">
      <rect width="900" height="130" class="box" />
      <g transform="translate(40, 20) scale(0.11)">
        <path d="${wordmark.d}" fill="#2f6fed" />
      </g>
      <text x="450" y="115" class="lbl" text-anchor="middle">Electric Blue Wordmark</text>
    </g>

    <!-- Wordmark Dark -->
    <g transform="translate(940, 30)">
      <rect width="900" height="130" class="box" />
      <g transform="translate(40, 20) scale(0.11)">
        <path d="${wordmark.d}" fill="#18181b" />
      </g>
      <text x="450" y="115" class="lbl" text-anchor="middle">Deep Zinc Wordmark</text>
    </g>

    <!-- Horizontal Lockup -->
    <g transform="translate(0, 180)">
      <rect width="1100" height="140" class="box" />
      <g transform="translate(40, 25) scale(0.95)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="#2f6fed" stroke-width="4" />
        <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z" fill="#f0f5ff" stroke="#2f6fed" stroke-width="2" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#2f6fed" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#2f6fed" />
      </g>
      <g transform="translate(150, 40) scale(0.095)">
        <path d="${wordmark.d}" fill="#18181b" />
      </g>
      <text x="550" y="125" class="lbl" text-anchor="middle">Primary Horizontal Lockup</text>
    </g>

    <!-- Vertical Lockup -->
    <g transform="translate(1140, 180)">
      <rect width="320" height="240" class="box" />
      <g transform="translate(115, 20) scale(1.05)">
        <path d="M40 4 L72 16 V38 C72 58 58 71 40 76 C22 71 8 58 8 38 V16 Z" fill="none" stroke="#2f6fed" stroke-width="4" />
        <path d="M40 14 L64 23 V38 C64 53.5 53.5 63.5 40 67.5 C26.5 63.5 16 53.5 16 38 V23 Z" fill="#f0f5ff" stroke="#2f6fed" stroke-width="2" />
        <circle cx="40" cy="36" r="9" fill="none" stroke="#2f6fed" stroke-width="3.5" />
        <circle cx="40" cy="36" r="2.6" fill="#2f6fed" />
      </g>
      <g transform="translate(25, 150) scale(0.052)">
        <path d="${wordmark.d}" fill="#2f6fed" />
      </g>
      <text x="160" y="220" class="lbl" text-anchor="middle">Vertical Pennant Lockup</text>
    </g>
  </g>

  <!-- SECTION 3: INDIVIDUAL LETTERS -->
  <g transform="translate(100, 600)">
    <text x="0" y="0" class="hdr">3. INDIVIDUAL SATOSHI BUNTING LETTERS (S - E - N - T - I - N - E - L)</text>
    ${buntingLetters.map((char, i) => {
      const info = letters[char];
      const x = i * 420;
      const isBlue = i % 2 === 0;
      const bg = isBlue ? '#2f6fed' : '#ffffff';
      const fg = isBlue ? '#ffffff' : '#2f6fed';
      const border = !isBlue ? 'stroke="#e4e4e7"' : '';
      const sc = 0.16;
      const sw = info.width * sc;
      return `
      <g transform="translate(${x}, 30)">
        <rect width="380" height="200" fill="${bg}" rx="16" ${border} />
        <g transform="translate(${190 - sw/2}, 45) scale(${sc})">
          <path d="${info.d}" fill="${fg}" />
        </g>
        <text x="190" y="245" class="lbl" text-anchor="middle">Letter ${char}</text>
      </g>`;
    }).join('')}
  </g>

  <!-- SECTION 4: FULL BUNTING STRIP (10 FLAGS IN A ROW) -->
  <g transform="translate(100, 930)">
    <text x="0" y="0" class="hdr">4. ASSEMBLED BUNTING FLAG SEQUENCE (TRIANGLE PENNANTS)</text>
    
    <!-- Strung Twine Mockup -->
    <g transform="translate(0, 30)">
      ${getStrungBuntingPreviewSvg()}
    </g>
  </g>

  <!-- SECTION 5: READY-TO-PRINT BUNTING PENNANTS -->
  <g transform="translate(100, 1300)">
    <text x="0" y="0" class="hdr">5. READY-TO-PRINT PENNANT FLAGS (FOLD FLAPS &amp; HOLE GUIDES)</text>
    
    <!-- Triangle Row -->
    <g transform="translate(0, 30)">
      <g transform="translate(0, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'shield', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(250, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'S', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
      <g transform="translate(500, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'E', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(750, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'N', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
      <g transform="translate(1000, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'T', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(1250, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'I', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
      <g transform="translate(1500, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'N', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(1750, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'E', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
      <g transform="translate(2000, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'L', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(2250, 0) scale(0.38)">
        ${getTriangleFlagSvg({ type: 'shield', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
    </g>

    <!-- Swallowtail Row -->
    <g transform="translate(0, 420)">
      <g transform="translate(0, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'shield', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(250, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'S', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
      <g transform="translate(500, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'E', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(750, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'N', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
      <g transform="translate(1000, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'T', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(1250, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'I', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
      <g transform="translate(1500, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'N', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(1750, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'E', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
      <g transform="translate(2000, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'L', bgColor: COLORS.blue, fgColor: COLORS.white })}
      </g>
      <g transform="translate(2250, 0) scale(0.38)">
        ${getSwallowtailFlagSvg({ type: 'shield', bgColor: COLORS.white, fgColor: COLORS.blue })}
      </g>
    </g>
  </g>

  <!-- SECTION 6: COLOR PALETTE & IOT GRAPHICS -->
  <g transform="translate(100, 2200)">
    <text x="0" y="0" class="hdr">6. BRAND COLOR TOKENS &amp; IOT SENSOR GRAPHICS</text>
    
    <g transform="translate(0, 30)">
      <!-- Swatches -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="160" height="90" fill="#2f6fed" rx="10" />
        <text x="10" y="120" class="lbl">Electric Blue</text>
        <text x="10" y="145" class="sub">#2f6fed</text>

        <rect x="180" y="0" width="160" height="90" fill="#f0f5ff" rx="10" stroke="#e4e4e7" />
        <text x="190" y="120" class="lbl" fill="#18181b">Ice Blue</text>
        <text x="190" y="145" class="sub">#f0f5ff</text>

        <rect x="360" y="0" width="160" height="90" fill="#18181b" rx="10" />
        <text x="370" y="120" class="lbl" fill="#18181b">Deep Zinc</text>
        <text x="370" y="145" class="sub">#18181b</text>

        <rect x="540" y="0" width="160" height="90" fill="#fafafa" rx="10" stroke="#e4e4e7" />
        <text x="550" y="120" class="lbl" fill="#18181b">Off-White</text>
        <text x="550" y="145" class="sub">#fafafa</text>

        <rect x="720" y="0" width="90" height="90" fill="#16a34a" rx="10" />
        <text x="720" y="120" class="sub">#16a34a</text>

        <rect x="830" y="0" width="90" height="90" fill="#f59e0b" rx="10" />
        <text x="830" y="120" class="sub">#f59e0b</text>

        <rect x="940" y="0" width="90" height="90" fill="#ef4444" rx="10" />
        <text x="940" y="120" class="sub">#ef4444</text>
      </g>

      <!-- Sensor Mesh -->
      <g transform="translate(1300, -20) scale(0.42)">
        <rect width="420" height="380" fill="#ffffff" rx="16" stroke="#e4e4e7" />
        ${getSensorMeshSvg(420)}
      </g>

      <!-- Sensor Icons -->
      <g transform="translate(1520, -5)">
        <rect width="600" height="150" fill="#ffffff" rx="16" stroke="#e4e4e7" />
        ${getSensorIconsSvg()}
      </g>
    </g>
  </g>
</svg>`;
}

// Add master sheet
assets.push({
  dir: dirs.root,
  name: '00_SENTINEL_CANVA_MASTER_SHEET',
  svg: getMasterSheetSvg(),
  title: 'Sentinel Complete Canva Master Sheet (All Assets in One Artboard)'
});

// Build all
async function buildAll() {
  console.log(`Starting asset generation for ${assets.length} items...`);
  const assetManifest = [];

  for (const item of assets) {
    const svgPath = path.join(item.dir, `${item.name}.svg`);
    const pngPath = path.join(item.dir, `${item.name}.png`);

    const pubSvgPath = path.join(publicBuntingDir, `${item.name}.svg`);
    const pubPngPath = path.join(publicBuntingDir, `${item.name}.png`);

    fs.writeFileSync(svgPath, item.svg, 'utf8');
    fs.writeFileSync(pubSvgPath, item.svg, 'utf8');

    let renderWidth = 1200;
    if (item.name.includes('MASTER_SHEET')) {
      renderWidth = 3600;
    } else if (item.name.includes('preview')) {
      renderWidth = 2400;
    } else if (item.name.includes('wordmark') || item.name.includes('lockup')) {
      renderWidth = 2000;
    } else if (item.name.includes('flag')) {
      renderWidth = 1200;
    }

    try {
      await sharp(Buffer.from(item.svg))
        .resize({ width: renderWidth })
        .png()
        .toFile(pngPath);
      
      fs.copyFileSync(pngPath, pubPngPath);
    } catch (e) {
      console.error(`Error rendering PNG for ${item.name}:`, e.message);
    }

    assetManifest.push({
      name: item.name,
      title: item.title,
      relDir: path.relative(baseDir, item.dir),
      svgFile: `${item.name}.svg`,
      pngFile: `${item.name}.png`,
      svgContent: item.svg
    });

    console.log(`[DONE] ${item.name}`);
  }

  createHtmlViewer(assetManifest);
}

function createHtmlViewer(manifest) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sentinel — Canva Brand &amp; Bunting Asset Hub</title>
  <style>
    :root {
      --blue: #2f6fed;
      --light-blue: #f0f5ff;
      --dark: #18181b;
      --gray: #71717a;
      --bg: #fafafa;
      --card: #ffffff;
      --border: #e4e4e7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--dark);
      line-height: 1.5;
      padding: 40px 24px;
    }
    .container {
      max-width: 1360px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 36px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background-color: var(--light-blue);
      color: var(--blue);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    p.subtitle {
      font-size: 16px;
      color: var(--gray);
      max-width: 800px;
    }
    .instructions-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 36px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .instructions-card h2 {
      font-size: 18px;
      margin-bottom: 12px;
      color: var(--blue);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .step-item {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
    }
    .step-item span.num {
      display: inline-flex;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      background: var(--blue);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }
    .step-item h3 { font-size: 14px; margin-bottom: 4px; }
    .step-item p { font-size: 13px; color: var(--gray); }

    .colors-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 16px;
    }
    .color-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: background 0.15s;
    }
    .color-chip:hover {
      background: #f4f4f5;
    }
    .color-dot {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.1);
    }

    .section-title {
      font-size: 22px;
      font-weight: 700;
      margin: 44px 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    }
    .card-preview {
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: repeating-conic-gradient(#f4f4f5 0% 25%, #ffffff 0% 50%) 50% / 16px 16px;
      position: relative;
    }
    .card-preview.dark-preview {
      background: #0f172a !important;
    }
    .card-preview svg {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      display: block;
    }
    .card-info {
      padding: 16px;
      border-top: 1px solid var(--border);
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-name {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .card-desc {
      font-size: 12px;
      color: var(--gray);
      margin-bottom: 12px;
    }
    .btn-group {
      display: flex;
      gap: 8px;
    }
    button.btn {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--border);
      background: #fff;
      color: var(--dark);
      transition: all 0.15s;
      text-align: center;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    button.btn:hover {
      background: #f4f4f5;
      border-color: #d4d4d8;
    }
    button.btn-primary {
      background: var(--blue);
      color: #fff;
      border-color: var(--blue);
    }
    button.btn-primary:hover {
      background: #2558c7;
      border-color: #2558c7;
    }
    .bg-toggle {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(4px);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      font-weight: 600;
      color: var(--dark);
    }
    .dark-preview .bg-toggle {
      background: rgba(24, 24, 27, 0.85);
      color: #fff;
      border-color: #3f3f46;
    }
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #18181b;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .toast.show { opacity: 1; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">SENTINEL BRAND SYSTEM</div>
      <h1>Canva Logo Assets &amp; Bunting Kit</h1>
      <p class="subtitle">
        Vector assets and ready-to-print bunting elements for Sentinel. Wordmarks and letters are converted from Satoshi Bold directly into pure SVG path vector curves — paste directly into Canva with 100% precision.
      </p>

      <div class="colors-bar">
        <span style="font-size: 12px; font-weight: 700; align-self: center;">Brand Colors:</span>
        <div class="color-chip" onclick="copyHex('#2f6fed')">
          <div class="color-dot" style="background: #2f6fed;"></div>
          <span>Electric Blue: #2f6fed</span>
        </div>
        <div class="color-chip" onclick="copyHex('#f0f5ff')">
          <div class="color-dot" style="background: #f0f5ff;"></div>
          <span>Ice Blue: #f0f5ff</span>
        </div>
        <div class="color-chip" onclick="copyHex('#18181b')">
          <div class="color-dot" style="background: #18181b;"></div>
          <span>Deep Zinc: #18181b</span>
        </div>
        <div class="color-chip" onclick="copyHex('#0f172a')">
          <div class="color-dot" style="background: #0f172a;"></div>
          <span>Slate Dark: #0f172a</span>
        </div>
        <div class="color-chip" onclick="copyHex('#fafafa')">
          <div class="color-dot" style="background: #fafafa;"></div>
          <span>Off-White: #fafafa</span>
        </div>
      </div>
    </header>

    <div class="instructions-card">
      <h2>✨ How to use these elements in Canva</h2>
      <div class="steps">
        <div class="step-item">
          <span class="num">1</span>
          <h3>Method A: 1-Click Copy &amp; Paste</h3>
          <p>Click <strong>"Copy SVG (Canva)"</strong> on any element below, switch to your Canva document, and press <strong>Ctrl+V</strong> (or Cmd+V). It pastes as an editable vector graphic!</p>
        </div>
        <div class="step-item">
          <span class="num">2</span>
          <h3>Method B: Drag &amp; Drop Files</h3>
          <p>Drag any <code>.svg</code> or <code>.png</code> file from the <code>canva-bunting-assets/</code> folder straight into Canva's Uploads panel.</p>
        </div>
        <div class="step-item">
          <span class="num">3</span>
          <h3>All-in-One Master Sheet</h3>
          <p>Upload <code>00_SENTINEL_CANVA_MASTER_SHEET.svg</code> to Canva. Click <strong>Ungroup</strong> to have all logos, letters, and flags instantly ready on your canvas.</p>
        </div>
        <div class="step-item">
          <span class="num">4</span>
          <h3>Printing &amp; Assembling Bunting</h3>
          <p>The pennant flags have a top fold flap and punch-hole guides. Print on 200–300gsm white cardstock, fold the top over twine/string, and hole-punch or tape.</p>
        </div>
      </div>
    </div>

    <!-- Strung preview hero -->
    <div style="margin-bottom: 40px; background: #fff; padding: 24px; border-radius: 16px; border: 1px solid var(--border);">
      <h2 style="font-size: 18px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
        <span>Bunting Layout Inspiration: [Shield] S - E - N - T - I - N - E - L [Shield]</span>
        <button class="btn btn-primary" style="flex: none; width: auto;" onclick="copySvg('bunting-strung-preview')">Copy Preview SVG</button>
      </h2>
      <div style="width: 100%; border-radius: 8px; overflow: hidden;">
        ${getStrungBuntingPreviewSvg()}
      </div>
    </div>

    ${renderGroup('00 Master Sheet & Overviews', manifest.filter(m => m.relDir === ''))}
    ${renderGroup('01 Core Logo & Shield Marks', manifest.filter(m => m.relDir === '01_logos'))}
    ${renderGroup('02 Satoshi Typography & Wordmarks', manifest.filter(m => m.relDir === '02_wordmarks'))}
    ${renderGroup('03 Individual Bunting Letters (S-E-N-T-I-N-E-L)', manifest.filter(m => m.relDir === '03_bunting_letters'))}
    ${renderGroup('04 Ready-to-Print Triangle Pennants', manifest.filter(m => m.relDir === '04_triangle_flags'))}
    ${renderGroup('05 Ready-to-Print Swallowtail Pennants', manifest.filter(m => m.relDir === '05_swallowtail_flags'))}
    ${renderGroup('06 Decorative & IoT Sensor Elements', manifest.filter(m => m.relDir === '06_decorative_elements'))}

  </div>

  <div id="toast" class="toast">SVG copied to clipboard! Paste into Canva (Ctrl+V)</div>

  <script>
    const svgDatabase = ${JSON.stringify(manifest.reduce((acc, cur) => { acc[cur.name] = cur.svgContent; return acc; }, {}))};

    function copySvg(name) {
      const svg = svgDatabase[name];
      if (!svg) return;
      navigator.clipboard.writeText(svg).then(() => {
        showToast("✓ SVG copied! Open Canva and press Ctrl+V to paste.");
      }).catch(err => {
        console.error(err);
      });
    }

    function copyHex(hex) {
      navigator.clipboard.writeText(hex).then(() => {
        showToast("✓ Copied color: " + hex);
      });
    }

    function toggleBg(btn) {
      const preview = btn.closest('.card-preview');
      preview.classList.toggle('dark-preview');
    }

    function downloadSvgDirect(name, filename) {
      const svg = svgDatabase[name];
      if (!svg) return;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2500);
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(baseDir, 'CANVA_BUNTING_ASSET_HUB.html'), htmlContent, 'utf8');
  fs.writeFileSync(path.join(publicBuntingDir, 'CANVA_BUNTING_ASSET_HUB.html'), htmlContent, 'utf8');
}

function renderGroup(title, items) {
  if (!items || items.length === 0) return '';
  return `
  <div class="section-title">
    <span>${title}</span>
    <span style="font-size: 14px; color: var(--gray); font-weight: 500;">${items.length} items</span>
  </div>
  <div class="grid">
    ${items.map(item => {
      const isWhite = item.name.includes('white');
      const relPath = item.relDir ? `${item.relDir}/${item.pngFile}` : item.pngFile;
      return `
      <div class="card">
        <div class="card-preview ${isWhite ? 'dark-preview' : ''}">
          <button class="bg-toggle" onclick="toggleBg(this)">BG</button>
          ${item.svgContent}
        </div>
        <div class="card-info">
          <div>
            <div class="card-name">${item.title}</div>
            <div class="card-desc">${item.svgFile} &bull; Vector SVG &amp; 300-DPI PNG</div>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="copySvg('${item.name}')">Copy SVG (Canva)</button>
            <button class="btn" onclick="downloadSvgDirect('${item.name}', '${item.svgFile}')">SVG</button>
            <a class="btn" href="${relPath}" download="${item.pngFile}">PNG</a>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

buildAll().then(() => {
  console.log('Finished generating all Canva and Bunting assets successfully!');
}).catch(console.error);
