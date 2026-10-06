const fs = require('fs');
const path = require('path');

const hubPath = path.resolve(__dirname, '..', 'canva-bunting-assets', 'CANVA_BUNTING_ASSET_HUB.html');
const pubHubPath = path.resolve(__dirname, '..', 'public', 'branding', 'bunting', 'CANVA_BUNTING_ASSET_HUB.html');

let hubHtml = fs.readFileSync(hubPath, 'utf8');

// Strip previous 08 and 09 sections if present
const markers = [
  ['<!-- SECTION_08_DESKTOP_START -->', '<!-- SECTION_08_DESKTOP_END -->'],
  ['<!-- SECTION_08_REAL_START -->', '<!-- SECTION_08_REAL_END -->'],
  ['<!-- SECTION_09_REAL_START -->', '<!-- SECTION_09_REAL_END -->']
];

for (const [s, e] of markers) {
  if (hubHtml.includes(s)) {
    const p1 = hubHtml.indexOf(s);
    const p2 = hubHtml.indexOf(e) + e.length;
    hubHtml = hubHtml.substring(0, p1) + hubHtml.substring(p2);
  }
}

// Generate the new HTML sections
const newSectionsHtml = `
<!-- SECTION_08_REAL_START -->
<div class="section-title" id="real-screenshots-section" style="margin-top: 56px; border-top: 3px solid var(--blue); padding-top: 40px;">
  <div>
    <span style="display: flex; align-items: center; gap: 8px;">
      <span class="badge" style="background: #16a34a; color: #fff; margin-bottom: 0;">100% AUTHENTIC</span>
      08 Real Project Screenshots &amp; Device Viewports
    </span>
    <p style="font-size: 14px; color: var(--gray); font-weight: normal; margin-top: 4px;">
      Direct, uncompressed 2x &amp; 3x Retina captures from the live running Sentinel Next.js project on <code>http://localhost:3000</code>. Verified authentic data from your actual database, telemetry charts, and UI components.
    </p>
  </div>
  <span style="font-size: 14px; color: var(--gray); font-weight: 500;">6 full screens</span>
</div>

<div class="grid">
  <!-- Desktop Dashboard Overview -->
  <div class="card" style="grid-column: span 2;">
    <div class="card-preview" style="height: 380px; padding: 12px; background: #0f172a;">
      <img src="08_real_project_screenshots/sentinel-real-dashboard-desktop.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);" alt="Real Desktop Dashboard" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Real Desktop Dashboard (/dashboard)</div>
        <div class="card-desc">sentinel-real-dashboard-desktop.png &bull; 1920&times;1080 @ 2x Retina &bull; Live Telemetry, CO2 Bento cards &amp; Recharts Area curve</div>
      </div>
      <div class="card-actions">
        <a href="08_real_project_screenshots/sentinel-real-dashboard-desktop.png" download="sentinel-real-dashboard-desktop.png" class="btn btn-primary">Download Real PNG</a>
      </div>
    </div>
  </div>

  <!-- Mobile Dashboard Viewport -->
  <div class="card">
    <div class="card-preview" style="height: 380px; padding: 12px; background: #0f172a;">
      <img src="08_real_project_screenshots/sentinel-real-dashboard-mobile.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);" alt="Real Mobile Dashboard" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Real Mobile Dashboard (390&times;844)</div>
        <div class="card-desc">sentinel-real-dashboard-mobile.png &bull; iPhone Retina capture &bull; Vertical responsive stack</div>
      </div>
      <div class="card-actions">
        <a href="08_real_project_screenshots/sentinel-real-dashboard-mobile.png" download="sentinel-real-dashboard-mobile.png" class="btn btn-primary">Download Real PNG</a>
      </div>
    </div>
  </div>

  <!-- Device Management Page -->
  <div class="card">
    <div class="card-preview" style="height: 280px; padding: 12px; background: #f8fafc;">
      <img src="08_real_project_screenshots/sentinel-real-devices-desktop.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" alt="Real Devices Page" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Device Management Console (/devices)</div>
        <div class="card-desc">sentinel-real-devices-desktop.png &bull; Hardware node table, thresholds, active status</div>
      </div>
      <div class="card-actions">
        <a href="08_real_project_screenshots/sentinel-real-devices-desktop.png" download="sentinel-real-devices-desktop.png" class="btn btn-primary">Download Real PNG</a>
      </div>
    </div>
  </div>

  <!-- Data History / Analytics Page -->
  <div class="card">
    <div class="card-preview" style="height: 280px; padding: 12px; background: #f8fafc;">
      <img src="08_real_project_screenshots/sentinel-real-analytics-desktop.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" alt="Real Analytics Page" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Data History &amp; Range Export (/analytics)</div>
        <div class="card-desc">sentinel-real-analytics-desktop.png &bull; Historical querying and CSV telemetry export</div>
      </div>
      <div class="card-actions">
        <a href="08_real_project_screenshots/sentinel-real-analytics-desktop.png" download="sentinel-real-analytics-desktop.png" class="btn btn-primary">Download Real PNG</a>
      </div>
    </div>
  </div>

  <!-- User Access Management Page -->
  <div class="card">
    <div class="card-preview" style="height: 280px; padding: 12px; background: #f8fafc;">
      <img src="08_real_project_screenshots/sentinel-real-users-desktop.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" alt="Real Users Page" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">User RBAC &amp; Access (/users)</div>
        <div class="card-desc">sentinel-real-users-desktop.png &bull; Role permissions and credentials management</div>
      </div>
      <div class="card-actions">
        <a href="08_real_project_screenshots/sentinel-real-users-desktop.png" download="sentinel-real-users-desktop.png" class="btn btn-primary">Download Real PNG</a>
      </div>
    </div>
  </div>

  <!-- Login Screen -->
  <div class="card">
    <div class="card-preview" style="height: 280px; padding: 12px; background: #f8fafc;">
      <img src="08_real_project_screenshots/sentinel-real-login-desktop.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" alt="Real Login Page" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Portal Login Screen (/login)</div>
        <div class="card-desc">sentinel-real-login-desktop.png &bull; Sentinel shield brand authentication portal</div>
      </div>
      <div class="card-actions">
        <a href="08_real_project_screenshots/sentinel-real-login-desktop.png" download="sentinel-real-login-desktop.png" class="btn btn-primary">Download Real PNG</a>
      </div>
    </div>
  </div>
</div>
<!-- SECTION_08_REAL_END -->

<!-- SECTION_09_REAL_START -->
<div class="section-title" id="real-components-section" style="margin-top: 56px; border-top: 3px solid var(--blue); padding-top: 40px;">
  <div>
    <span style="display: flex; align-items: center; gap: 8px;">
      <span class="badge" style="background: #2f6fed; color: #fff; margin-bottom: 0;">MODULAR CANVA CROPS</span>
      09 Real Isolated Project Components
    </span>
    <p style="font-size: 14px; color: var(--gray); font-weight: normal; margin-top: 4px;">
      High-resolution isolated element crops straight from the live DOM (Bento cards, Recharts curves, threshold alert lists, device tables). Drag-and-drop or paste individually into any Canva presentation or poster!
    </p>
  </div>
  <span style="font-size: 14px; color: var(--gray); font-weight: 500;">8 individual components</span>
</div>

<div class="grid">
  <!-- Component 1: CO2 Bento Card -->
  <div class="card">
    <div class="card-preview" style="height: 220px; padding: 16px; background: #f8fafc;">
      <img src="09_real_project_components/real-comp-co2-gas-card.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" alt="CO2 Gas Bento Card" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Bento Card: CO2 Gas Metric</div>
        <div class="card-desc">real-comp-co2-gas-card.png &bull; Live ppm reading, trend % and wind icon</div>
      </div>
      <div class="card-actions">
        <a href="09_real_project_components/real-comp-co2-gas-card.png" download="real-comp-co2-gas-card.png" class="btn btn-primary">Download PNG</a>
      </div>
    </div>
  </div>

  <!-- Component 2: Temperature Bento Card -->
  <div class="card">
    <div class="card-preview" style="height: 220px; padding: 16px; background: #f8fafc;">
      <img src="09_real_project_components/real-comp-temperature-card.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" alt="Temperature Bento Card" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Bento Card: Temperature Metric</div>
        <div class="card-desc">real-comp-temperature-card.png &bull; Live ambient &deg;C with thermometer icon</div>
      </div>
      <div class="card-actions">
        <a href="09_real_project_components/real-comp-temperature-card.png" download="real-comp-temperature-card.png" class="btn btn-primary">Download PNG</a>
      </div>
    </div>
  </div>

  <!-- Component 3: Humidity Bento Card -->
  <div class="card">
    <div class="card-preview" style="height: 220px; padding: 16px; background: #f8fafc;">
      <img src="09_real_project_components/real-comp-humidity-card.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" alt="Humidity Bento Card" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Bento Card: Relative Humidity Metric</div>
        <div class="card-desc">real-comp-humidity-card.png &bull; Live RH % with water droplets icon</div>
      </div>
      <div class="card-actions">
        <a href="09_real_project_components/real-comp-humidity-card.png" download="real-comp-humidity-card.png" class="btn btn-primary">Download PNG</a>
      </div>
    </div>
  </div>

  <!-- Component 4: CO2 Trend Chart -->
  <div class="card">
    <div class="card-preview" style="height: 260px; padding: 16px; background: #f8fafc;">
      <img src="09_real_project_components/real-comp-co2-trend-chart.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" alt="CO2 Trend Chart" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Recharts: Real-Time CO2 Area Curve</div>
        <div class="card-desc">real-comp-co2-trend-chart.png &bull; Real spikes, axis timestamps &amp; gradient fill</div>
      </div>
      <div class="card-actions">
        <a href="09_real_project_components/real-comp-co2-trend-chart.png" download="real-comp-co2-trend-chart.png" class="btn btn-primary">Download PNG</a>
      </div>
    </div>
  </div>

  <!-- Component 5: Temp & Humidity Chart -->
  <div class="card">
    <div class="card-preview" style="height: 260px; padding: 16px; background: #f8fafc;">
      <img src="09_real_project_components/real-comp-temp-humidity-chart.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" alt="Temp & Humidity Chart" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Recharts: Dual Temp &amp; Humidity Chart</div>
        <div class="card-desc">real-comp-temp-humidity-chart.png &bull; Amber &amp; cyan dual telemetry curves</div>
      </div>
      <div class="card-actions">
        <a href="09_real_project_components/real-comp-temp-humidity-chart.png" download="real-comp-temp-humidity-chart.png" class="btn btn-primary">Download PNG</a>
      </div>
    </div>
  </div>

  <!-- Component 6: Recent Alerts Card -->
  <div class="card">
    <div class="card-preview" style="height: 260px; padding: 16px; background: #f8fafc;">
      <img src="09_real_project_components/real-comp-recent-alerts-card.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" alt="Recent Alerts Card" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Component: Recent Danger &amp; Threshold Alerts</div>
        <div class="card-desc">real-comp-recent-alerts-card.png &bull; Live incident cards with timestamps and status</div>
      </div>
      <div class="card-actions">
        <a href="09_real_project_components/real-comp-recent-alerts-card.png" download="real-comp-recent-alerts-card.png" class="btn btn-primary">Download PNG</a>
      </div>
    </div>
  </div>

  <!-- Component 7: Device Fleet Table -->
  <div class="card" style="grid-column: span 2;">
    <div class="card-preview" style="height: 260px; padding: 16px; background: #f8fafc;">
      <img src="09_real_project_components/real-comp-device-fleet-table.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" alt="Device Fleet Table" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Component: Registered Hardware Fleet Table</div>
        <div class="card-desc">real-comp-device-fleet-table.png &bull; Live table of ESP32 nodes, thresholds &amp; calibration parameters</div>
      </div>
      <div class="card-actions">
        <a href="09_real_project_components/real-comp-device-fleet-table.png" download="real-comp-device-fleet-table.png" class="btn btn-primary">Download PNG</a>
      </div>
    </div>
  </div>

  <!-- Component 8: Sidebar Navigation -->
  <div class="card">
    <div class="card-preview" style="height: 260px; padding: 16px; background: #f8fafc;">
      <img src="09_real_project_components/real-comp-sidebar-navigation.png" style="max-height: 100%; max-width: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" alt="Sidebar Navigation" />
    </div>
    <div class="card-info">
      <div>
        <div class="card-name">Component: App Navigation Sidebar</div>
        <div class="card-desc">real-comp-sidebar-navigation.png &bull; Sentinel logo lockup, nav links and active state</div>
      </div>
      <div class="card-actions">
        <a href="09_real_project_components/real-comp-sidebar-navigation.png" download="real-comp-sidebar-navigation.png" class="btn btn-primary">Download PNG</a>
      </div>
    </div>
  </div>
</div>
<!-- SECTION_09_REAL_END -->
`;

const insertPoint = hubHtml.indexOf('</div>\n\n  <div id="toast"');
if (insertPoint !== -1) {
  hubHtml = hubHtml.substring(0, insertPoint) + newSectionsHtml + '\n' + hubHtml.substring(insertPoint);
} else {
  const altInsert = hubHtml.lastIndexOf('</div>');
  hubHtml = hubHtml.substring(0, altInsert) + newSectionsHtml + '\n' + hubHtml.substring(altInsert);
}

fs.writeFileSync(hubPath, hubHtml, 'utf8');
fs.writeFileSync(pubHubPath, hubHtml, 'utf8');
console.log('Updated CANVA_BUNTING_ASSET_HUB.html with real project screenshots & components!');
