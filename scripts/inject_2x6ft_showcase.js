const fs = require('fs');
const path = require('path');

const hubPath = path.resolve(__dirname, '..', 'canva-bunting-assets', 'CANVA_BUNTING_ASSET_HUB.html');
const pubHubPath = path.resolve(__dirname, '..', 'public', 'branding', 'bunting', 'CANVA_BUNTING_ASSET_HUB.html');
let html = fs.readFileSync(hubPath, 'utf8');

const bannerAppleHtml = `
    <!-- 2FT X 6FT APPLE PRODUCT LAUNCH BANNERS (FLAGSHIP) -->
    <div style="background: radial-gradient(circle at 50% 0%, #1e293b 0%, #030712 70%); border: 2px solid #38bdf8; border-radius: 28px; padding: 40px; margin-bottom: 44px; color: #ffffff; box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(56,189,248,0.15);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <span class="badge" style="background: #ffffff; color: #000000; font-weight: 800; margin-bottom: 0; padding: 5px 14px; letter-spacing: 1.5px;">APPLE KEYNOTE AESTHETIC</span>
            <span class="badge" style="background: rgba(56,189,248,0.2); color: #38bdf8; border: 1px solid #38bdf8; margin-bottom: 0;">2FT &times; 6FT (24&Prime; &times; 72&Prime;)</span>
          </div>
          <h2 style="font-size: 32px; font-weight: 900; color: #ffffff; margin: 4px 0; letter-spacing: -1px;">Sentinel Pro &mdash; Apple Product Launch Buntings</h2>
          <p style="color: #94a3b8; font-size: 15px; margin: 0; max-width: 860px; line-height: 1.6;">
            Designed strictly under Apple product marketing philosophy: monumental typography, radical restraint, zero visual clutter, and pure hardware-grade staging. Features your authentic Next.js dashboard mounted on a titanium Studio Display and iPhone 16 Pro.
          </p>
        </div>
        <div style="display: flex; gap: 12px;">
          <span style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 800; color: #ffffff;">2400 &times; 7200 Print PNG</span>
          <span style="background: rgba(56,189,248,0.15); border: 1px solid #38bdf8; padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 800; color: #38bdf8;">Scalable Vector SVG</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr)); gap: 36px;">
        
        <!-- Apple Space Black Edition -->
        <div style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 26px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 16px 40px rgba(0,0,0,0.7);">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
              <span style="font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: 2px;">SPACE BLACK EDITION</span>
              <span style="background: rgba(255,255,255,0.15); color: #fff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700;">PRO EVENT BILLBOARD</span>
            </div>
            <div style="height: 520px; background: #000000; border-radius: 14px; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 14px; border: 1px solid rgba(255,255,255,0.1);">
              <img src="07_rollup_banner/sentinel-banner-2x6ft-apple-spaceblack.png" style="max-height: 100%; max-width: 100%; object-fit: contain; box-shadow: 0 12px 36px rgba(0,0,0,0.9);" alt="Apple Space Black 2x6ft Banner" />
            </div>
            <h3 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-top: 20px; letter-spacing: -0.5px;">Sentinel Pro &mdash; Space Black</h3>
            <p style="font-size: 14px; color: #94a3b8; margin: 8px 0 18px; line-height: 1.6;">
              Pure OLED black canvas, laser-etched titanium rim lighting, monumental SF Pro typography (<em style="color:#fff;">&ldquo;Hazard detection. Down to the molecule.&rdquo;</em>), floating Studio Display, iPhone 16 Pro, live 1639 ppm danger chip, and scannable demo QR.
            </p>
          </div>
          <div style="display: flex; gap: 12px;">
            <a href="07_rollup_banner/sentinel-banner-2x6ft-apple-spaceblack.png" download="sentinel-banner-2x6ft-apple-spaceblack.png" class="btn btn-primary" style="flex: 1.3; text-align: center; text-decoration: none; padding: 14px; font-weight: 800; background: #ffffff; color: #000000; border-radius: 10px; font-size: 14px;">Download 2400&times;7200 PNG</a>
            <a href="07_rollup_banner/sentinel-banner-2x6ft-apple-spaceblack.svg" download="sentinel-banner-2x6ft-apple-spaceblack.svg" class="btn btn-secondary" style="flex: 1; text-align: center; text-decoration: none; padding: 14px; font-weight: 700; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; font-size: 14px;">Vector SVG</a>
          </div>
        </div>

        <!-- Apple Studio White Edition -->
        <div style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 26px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 16px 40px rgba(0,0,0,0.7);">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
              <span style="font-size: 14px; font-weight: 800; color: #38bdf8; letter-spacing: 2px;">STUDIO WHITE EDITION</span>
              <span style="background: rgba(56,189,248,0.2); color: #38bdf8; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700;">APPLE STORE RETAIL</span>
            </div>
            <div style="height: 520px; background: #fbfbfd; border-radius: 14px; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 14px; border: 1px solid rgba(255,255,255,0.1);">
              <img src="07_rollup_banner/sentinel-banner-2x6ft-apple-studiowhite.png" style="max-height: 100%; max-width: 100%; object-fit: contain; box-shadow: 0 12px 36px rgba(0,0,0,0.2);" alt="Apple Studio White 2x6ft Banner" />
            </div>
            <h3 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-top: 20px; letter-spacing: -0.5px;">Sentinel Pro &mdash; Studio White</h3>
            <p style="font-size: 14px; color: #94a3b8; margin: 8px 0 18px; line-height: 1.6;">
              Atmospheric light studio gradient, authentic Apple SF Pro typography, precision MacBook Pro 16″ laptop model + iPhone companion, Golden Ratio (Φ 1.618) card layout, and 100% truthful ESP32/Next.js/Postgres architecture. Zero text overflow.
            </p>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <a href="07_rollup_banner/sentinel-banner-2x6ft-apple-studiowhite.pdf" download="sentinel-banner-2x6ft-apple-studiowhite.pdf" class="btn" style="flex: 1 1 100%; text-align: center; text-decoration: none; padding: 12px; font-weight: 800; background: #16a34a; color: #ffffff; border-radius: 10px; font-size: 14px;">Download Print-Ready PDF (24&Prime; &times; 72&Prime;)</a>
            <a href="07_rollup_banner/sentinel-banner-2x6ft-apple-studiowhite.png" download="sentinel-banner-2x6ft-apple-studiowhite.png" class="btn btn-primary" style="flex: 1; text-align: center; text-decoration: none; padding: 12px; font-weight: 800; background: #0071e3; color: #ffffff; border-radius: 10px; font-size: 14px;">2400&times;7200 PNG</a>
            <a href="07_rollup_banner/sentinel-banner-2x6ft-apple-studiowhite.svg" download="sentinel-banner-2x6ft-apple-studiowhite.svg" class="btn btn-secondary" style="flex: 1; text-align: center; text-decoration: none; padding: 12px; font-weight: 700; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; font-size: 14px;">Vector SVG</a>
          </div>
        </div>

      </div>
    </div>
`;

// Clean previous 2FT X 6FT STANDING BANNER SHOWCASE if present
if (html.includes('<!-- 2FT X 6FT STANDING BANNER SHOWCASE (NEW) -->')) {
  const p1 = html.indexOf('<!-- 2FT X 6FT STANDING BANNER SHOWCASE (NEW) -->');
  const p2 = html.indexOf('<!-- Featured Banner Showcase -->');
  html = html.substring(0, p1) + bannerAppleHtml + '\n' + html.substring(p2);
} else if (html.includes('<!-- 2FT X 6FT APPLE PRODUCT LAUNCH BANNERS (FLAGSHIP) -->')) {
  const p1 = html.indexOf('<!-- 2FT X 6FT APPLE PRODUCT LAUNCH BANNERS (FLAGSHIP) -->');
  const p2 = html.indexOf('<!-- Featured Banner Showcase -->');
  html = html.substring(0, p1) + bannerAppleHtml + '\n' + html.substring(p2);
} else {
  const target = '<!-- Featured Banner Showcase -->';
  const pos = html.indexOf(target);
  if (pos !== -1) {
    html = html.substring(0, pos) + bannerAppleHtml + '\n    ' + html.substring(pos);
  }
}

fs.writeFileSync(hubPath, html, 'utf8');
fs.writeFileSync(pubHubPath, html, 'utf8');
console.log('Successfully injected Apple Product Launch Buntings into CANVA_BUNTING_ASSET_HUB.html!');
