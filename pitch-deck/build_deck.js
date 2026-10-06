// Sentinel investor pitch deck (5 min, 9 slides) — pptxgenjs, Canva-importable.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");

const ASSETS = "C:/Users/User/OneDrive/Documents/sentinel/canva-bunting-assets/";
const OUT = process.argv[2] || "Sentinel-Investor-Pitch.pptx";

// Brand palette (from DESIGN.md / brag plan)
const C = {
  navy: "0B1530",      // dark slides
  navy2: "16244A",     // cards on dark
  blue: "2F6FED",      // electric blue accent
  blueSoft: "E8EFFD",  // tint
  ink: "18181B",       // zinc-900
  muted: "71717A",     // zinc-500
  line: "E4E4E7",
  card: "F4F6FA",
  white: "FFFFFF",
  red: "DC2626",
  redSoft: "FDECEC",
  ph: "B45309",        // placeholder amber — fill these in before presenting
  phSoft: "FEF3C7",
};
const H = "Arial", B = "Arial";

async function icon(name, color = "FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(lu[name], { color: "#" + color, size: String(size) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
async function img(path, opts = {}) {
  let s = sharp(ASSETS + path);
  if (opts.extract) s = s.extract(opts.extract);
  if (opts.width) s = s.resize({ width: opts.width });
  const buf = await s.png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.title = "Sentinel — Investor Pitch";

  const logoWhite = await img("01_logos/sentinel-shield-white.png", { width: 400 });
  const logoColor = await img("01_logos/sentinel-shield-color.png", { width: 400 });
  const wordWhite = await img("02_wordmarks/sentinel-wordmark-white.png", { width: 1200 });
  // Dashboard: crop away the empty lower area of the 3840x2160 screenshot
  const dash = await img("08_real_project_screenshots/sentinel-real-dashboard-desktop.png", {
    extract: { left: 0, top: 0, width: 3840, height: 1560 }, width: 2000,
  });
  const alerts = await img("09_real_project_components/real-comp-recent-alerts-card.png");

  const T = (slide, text, o) => slide.addText(text, { isTextBox: true, fontFace: B, margin: 0, ...o });
  const shadow = () => ({ type: "outer", color: "000000", blur: 12, offset: 3, angle: 90, opacity: 0.08 });
  const card = (slide, x, y, w, h, fill = C.card, extra = {}) =>
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.18, fill: { color: fill }, line: { color: fill }, ...extra });
  const iconBubble = async (slide, name, x, y, d = 0.5, bg = C.blue, fg = "FFFFFF") => {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
    const p = d * 0.25;
    slide.addImage({ data: await icon(name, fg), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  };
  const title = (slide, text, color = C.ink, y = 0.45) =>
    T(slide, text, { x: 0.5, y, w: 9, h: 0.6, fontFace: H, fontSize: 30, bold: true, color });
  const kicker = (slide, text, color = C.blue, y = 0.2) =>
    T(slide, text.toUpperCase(), { x: 0.5, y, w: 9, h: 0.3, fontSize: 11, bold: true, color, charSpacing: 2 });
  const pageNum = (slide, n, dark = false) =>
    T(slide, String(n), { x: 9.1, y: 5.2, w: 0.4, h: 0.25, fontSize: 9, color: dark ? "8A94B0" : C.muted, align: "right" });

  // ---------- 1. Title ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: logoWhite, x: 0.5, y: 0.55, w: 0.75, h: 0.75 });
    s.addImage({ data: wordWhite, x: 0.5, y: 1.75, w: 4.6, h: 4.6 * 311 / 2000 });
    T(s, "Real-time gas safety monitoring —\nwithout the enterprise price tag.", {
      x: 0.5, y: 2.75, w: 6.5, h: 1.0, fontSize: 22, color: "C9D6F5",
    });
    T(s, [
      { text: "Investor pitch  ·  2026  ·  ", options: { color: "8A94B0" } },
      { text: "[Presenter name, title]", options: { color: "FBBF24" } },
    ], { x: 0.5, y: 4.75, w: 6, h: 0.3, fontSize: 12 });
    // Live-dot motif
    s.addShape(pres.shapes.OVAL, { x: 7.6, y: 1.4, w: 1.9, h: 1.9, fill: { color: C.blue, transparency: 85 }, line: { color: C.blue, transparency: 60, width: 1 } });
    s.addShape(pres.shapes.OVAL, { x: 8.05, y: 1.85, w: 1.0, h: 1.0, fill: { color: C.blue, transparency: 65 }, line: { color: C.blue, transparency: 100 } });
    s.addShape(pres.shapes.OVAL, { x: 8.37, y: 2.17, w: 0.36, h: 0.36, fill: { color: C.blue }, line: { color: C.blue } });
    s.addNotes("~20s. Hi, I'm [name]. Sentinel is a connected gas-safety platform: low-cost sensor boxes that stream CO2 and hydrogen readings to a live dashboard and flag danger the moment it happens.");
  }

  // ---------- 2. Problem ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "The problem");
    title(s, "Some dangers you can't see.");
    T(s, "Industrial gas leaks are invisible, fast — and usually noticed by the person standing next to the alarm.", {
      x: 0.5, y: 1.1, w: 8.5, h: 0.5, fontSize: 15, color: C.muted,
    });
    const items = [
      ["LuEyeOff", "Invisible", "CO2 and hydrogen are colourless and odourless. Hydrogen is flammable from just 4% in air."],
      ["LuBellOff", "Local alarms only", "Fixed detectors beep on site. Managers, other shifts and other sites never find out in time."],
      ["LuWallet", "Costly & locked-in", "Networked monitoring is sold as enterprise systems — out of reach for SMEs and small sites."],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.5 + i * 3.05;
      card(s, x, 1.95, 2.85, 2.9);
      await iconBubble(s, items[i][0], x + 0.3, 2.25, 0.6, C.red);
      T(s, items[i][1], { x: x + 0.3, y: 3.05, w: 2.3, h: 0.4, fontSize: 18, bold: true, color: C.ink });
      T(s, items[i][2], { x: x + 0.3, y: 3.5, w: 2.3, h: 1.2, fontSize: 12.5, color: C.muted, valign: "top" });
    }
    pageNum(s, 2);
    s.addNotes("~35s. CO2 and hydrogen give no warning — no colour, no smell. Today most sites rely on standalone detectors that only alarm locally, so nobody off-site knows. Connected systems exist, but they're priced and sold as enterprise contracts, which leaves smaller facilities exposed.");
  }

  // ---------- 3. Solution ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    kicker(s, "The solution", "7FA5F5");
    title(s, "Sense. Analyze. Alert — in seconds.", C.white);
    const steps = [
      ["LuCpu", "Sense", "A low-cost ESP32 Sentinel box reads CO2 or H2, temperature and humidity every ~10 seconds."],
      ["LuCloud", "Analyze", "Each reading is checked in the cloud against per-device warning and danger thresholds."],
      ["LuBellRing", "Alert", "The dashboard flips to red and logs the alert instantly — for every site, from anywhere."],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.5 + i * 3.1;
      card(s, x, 1.45, 2.8, 3.0, C.navy2);
      await iconBubble(s, steps[i][0], x + 0.3, 1.75, 0.65, i === 2 ? C.red : C.blue);
      T(s, `0${i + 1}`, { x: x + 1.9, y: 1.8, w: 0.6, h: 0.5, fontSize: 22, bold: true, color: "3B4A75", align: "right" });
      T(s, steps[i][1], { x: x + 0.3, y: 2.65, w: 2.2, h: 0.45, fontSize: 20, bold: true, color: C.white });
      T(s, steps[i][2], { x: x + 0.3, y: 3.15, w: 2.25, h: 1.5, fontSize: 13, color: "C9D6F5", valign: "top" });
      if (i < 2) s.addImage({ data: await icon("LuArrowRight", "7FA5F5"), x: x + 2.83, y: 2.95, w: 0.24, h: 0.24 });
    }
    pageNum(s, 3, true);
    s.addNotes("~35s. Sentinel closes that gap. Our box senses every ten seconds, the cloud evaluates each reading against thresholds set per device, and the moment a reading crosses danger, everyone with access sees it — on any screen, at any site.");
  }

  // ---------- 4. Product ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "The product");
    title(s, "One live view of every sensor.");
    // Screenshot in a framed card
    const dh = 6.06 * 1560 / 3840;
    card(s, 0.5, 1.75, 6.3, dh + 0.24, C.card);
    s.addImage({ data: dash, x: 0.62, y: 1.87, w: 6.06, h: dh, shadow: shadow() });
    T(s, "Live product — not a mockup", { x: 0.5, y: 1.87 + dh + 0.25, w: 6.3, h: 0.3, fontSize: 10.5, italic: true, color: C.muted, align: "center" });
    const pts = [
      ["Live readings", "CO2 / H2, temperature and humidity, refreshed every ~4 s."],
      ["Trends & history", "Spot spikes and patterns across 10 min to full history."],
      ["Fleet & access", "Manage devices and give Viewer / Admin / Superadmin roles."],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.3 + i * 1.3;
      s.addShape(pres.shapes.OVAL, { x: 7.1, y: y + 0.05, w: 0.3, h: 0.3, fill: { color: C.blueSoft }, line: { color: C.blueSoft } });
      T(s, String(i + 1), { x: 7.1, y: y + 0.05, w: 0.3, h: 0.3, fontSize: 11, bold: true, color: C.blue, align: "center", valign: "middle" });
      T(s, pts[i][0], { x: 7.55, y, w: 2.0, h: 0.4, fontSize: 15, bold: true, color: C.ink });
      T(s, pts[i][1], { x: 7.55, y: y + 0.42, w: 2.0, h: 0.75, fontSize: 11.5, color: C.muted, valign: "top" });
    }
    pageNum(s, 4);
    s.addNotes("~30s. This is the real product, not a mockup. Live readings at the top, trends underneath, recent alerts on the right. Admins manage the device fleet and decide who can see and change what.");
  }

  // ---------- 5. The alert moment ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "Why it matters", C.red);
    title(s, "Danger is flagged the moment it happens.");
    s.addImage({ data: alerts, x: 0.5, y: 1.3, w: 4.6, h: 4.6 * 780 / 1046, shadow: shadow() });
    const stats = [
      ["~10 s", "between sensor readings", C.blue],
      ["~4 s", "dashboard refresh — no page reload", C.blue],
      ["24/7", "visibility from any browser, on or off site", C.red],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.3 + i * 1.2;
      card(s, 5.5, y, 4.0, 1.05, i === 2 ? C.redSoft : C.card);
      T(s, stats[i][0], { x: 5.75, y: y + 0.12, w: 1.6, h: 0.8, fontSize: 36, bold: true, color: stats[i][2], valign: "middle" });
      T(s, stats[i][1], { x: 7.35, y: y + 0.12, w: 2.0, h: 0.8, fontSize: 13, color: C.ink, valign: "middle" });
    }
    pageNum(s, 5);
    s.addNotes("~30s. Here's what a real danger event looks like: the reading crosses the threshold, the card turns red and the alert lands in the feed with the exact concentration and device. Readings arrive every ten seconds and the dashboard refreshes every four — the safety manager knows whether or not they're on site.");
  }

  // ---------- 6. Why we win ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "Why Sentinel wins");
    title(s, "Enterprise-grade visibility, SME-friendly cost.");
    const grid = [
      ["LuCpu", "Low-cost hardware", "Built on commodity ESP32 boards and off-the-shelf sensors — not proprietary detector panels."],
      ["LuLock", "Secure by design", "Every device gets its own hashed API key; roles are enforced on the server, not just hidden in the UI."],
      ["LuFlaskConical", "Multi-gas, incl. hydrogen", "CO2 today and H2 for the growing hydrogen economy — the same platform, per-device thresholds."],
      ["LuServer", "Serverless & scalable", "Runs on serverless Postgres and cloud hosting: costs scale with customers, near-zero when idle."],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 0.5 + (i % 2) * 4.6, y = 1.3 + Math.floor(i / 2) * 1.95;
      card(s, x, y, 4.4, 1.75);
      await iconBubble(s, grid[i][0], x + 0.3, y + 0.3, 0.55, C.blueSoft, C.blue);
      T(s, grid[i][1], { x: x + 1.05, y: y + 0.28, w: 3.1, h: 0.4, fontSize: 16, bold: true, color: C.ink });
      T(s, grid[i][2], { x: x + 1.05, y: y + 0.7, w: 3.1, h: 0.95, fontSize: 12, color: C.muted, valign: "top" });
    }
    pageNum(s, 6);
    s.addNotes("~30s. Four reasons we win. Our hardware is commodity, so the box is cheap. Security is built in — each device has its own key, unlike typical DIY IoT setups. We already support hydrogen, which matters as H2 adoption grows. And our cloud costs scale with customers, so margins improve as we grow.");
  }

  // ---------- 7. Market & business model ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "Market & business model");
    title(s, "Who pays, and how.");
    // Left: target customers
    T(s, "Who we sell to", { x: 0.5, y: 1.25, w: 4.3, h: 0.35, fontSize: 14, bold: true, color: C.ink });
    const segs = [
      ["LuFactory", "Factories & plants"],
      ["LuBeer", "Breweries & beverage (CO2)"],
      ["LuFuel", "Hydrogen & fuel-cell sites (H2)"],
      ["LuMicroscope", "Labs & universities"],
      ["LuWarehouse", "Warehouses & cold storage"],
    ];
    for (let i = 0; i < segs.length; i++) {
      const y = 1.7 + i * 0.5;
      await iconBubble(s, segs[i][0], 0.5, y, 0.38, C.blueSoft, C.blue);
      T(s, segs[i][1], { x: 1.0, y, w: 3.6, h: 0.38, fontSize: 13, color: C.ink, valign: "middle" });
    }
    card(s, 0.5, 4.35, 4.2, 0.8, C.phSoft);
    T(s, [
      { text: "Market size: ", options: { bold: true, color: C.ink } },
      { text: "[Add sourced TAM / SAM / SOM for your launch region]", options: { color: C.ph } },
    ], { x: 0.7, y: 4.4, w: 3.9, h: 0.7, fontSize: 12, valign: "middle" });
    // Right: model
    T(s, "Revenue model", { x: 5.3, y: 1.25, w: 4.2, h: 0.35, fontSize: 14, bold: true, color: C.ink });
    const model = [
      ["Hardware", "Sentinel box per monitoring point", "[Price / unit]"],
      ["Subscription", "Dashboard, alerts & history per device / month", "[Price / device / mo]"],
      ["Enterprise", "Multi-site rollouts, onboarding & support", "[Annual contract]"],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.7 + i * 1.15;
      card(s, 5.3, y, 4.2, 1.0, i === 1 ? C.blueSoft : C.card);
      T(s, model[i][0], { x: 5.5, y: y + 0.12, w: 2.2, h: 0.35, fontSize: 15, bold: true, color: i === 1 ? C.blue : C.ink });
      T(s, model[i][2], { x: 7.4, y: y + 0.12, w: 1.95, h: 0.35, fontSize: 12, bold: true, color: C.ph, align: "right" });
      T(s, model[i][1], { x: 5.5, y: y + 0.5, w: 3.85, h: 0.4, fontSize: 11.5, color: C.muted });
    }
    pageNum(s, 7);
    s.addNotes("~35s. We sell to any site where invisible gas is an everyday risk — manufacturing, breweries that handle bulk CO2, hydrogen and fuel-cell facilities, labs and cold storage. [State market size with source.] We earn on hardware once and on a per-device subscription every month, which gives us recurring revenue that grows with every sensor installed.");
  }

  // ---------- 8. Traction & roadmap ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "Traction & roadmap");
    title(s, "Built and working today. Scaling next.");
    const cols = [
      ["Today", C.blue, false, [
        "Working end-to-end platform: device → cloud → dashboard",
        "CO2 and H2 sensor support, per-device thresholds",
        "Role-based access, secure per-device keys",
        "Device simulator for demos and load testing",
      ]],
      ["Next 6 months", C.ink, true, [
        "[Pilot customers / LOIs — names or count]",
        "SMS / email / WhatsApp alert notifications",
        "[Certification path for target market]",
        "[First paid deployments target]",
      ]],
      ["12 months +", C.ink, true, [
        "More gas types (e.g. CO, CH4, NH3)",
        "Multi-site enterprise accounts",
        "[Revenue / devices-installed target]",
        "[Regional expansion]",
      ]],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.5 + i * 3.05;
      card(s, x, 1.3, 2.85, 3.45, i === 0 ? C.blueSoft : C.card);
      T(s, cols[i][0], { x: x + 0.25, y: 1.5, w: 2.4, h: 0.4, fontSize: 17, bold: true, color: cols[i][1] });
      const runs = cols[i][3].map((t, j, a) => ({
        text: t,
        options: { bullet: { indent: 12 }, breakLine: j < a.length - 1, color: t.startsWith("[") ? C.ph : C.ink, paraSpaceAfter: 6 },
      }));
      T(s, runs, { x: x + 0.25, y: 2.0, w: 2.4, h: 2.6, fontSize: 11.5, valign: "top" });
    }
    pageNum(s, 8);
    s.addNotes("~30s. The platform is built and running end to end today — real devices, real alerts. Over the next six months we're focused on [pilots], adding phone and email notifications, and [certification]. After that: more gas types and multi-site enterprise accounts.");
  }

  // ---------- 9. Team ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "The team");
    title(s, "Who's building Sentinel.");
    for (let i = 0; i < 3; i++) {
      const x = 0.5 + i * 3.05;
      card(s, x, 1.35, 2.85, 3.5);
      s.addShape(pres.shapes.OVAL, { x: x + 0.93, y: 1.65, w: 1.0, h: 1.0, fill: { color: C.blueSoft }, line: { color: C.blueSoft } });
      s.addImage({ data: await icon("LuUser", C.blue), x: x + 1.18, y: 1.9, w: 0.5, h: 0.5 });
      T(s, "[Name]", { x: x + 0.2, y: 2.85, w: 2.45, h: 0.4, fontSize: 17, bold: true, color: C.ph, align: "center" });
      T(s, "[Role]", { x: x + 0.2, y: 3.25, w: 2.45, h: 0.3, fontSize: 12, bold: true, color: C.blue, align: "center" });
      T(s, "[One line of credibility: past company, domain expertise or key achievement]", { x: x + 0.25, y: 3.65, w: 2.35, h: 1.0, fontSize: 11, color: C.ph, align: "center", valign: "top" });
    }
    T(s, "Replace each circle with a headshot in Canva.", { x: 0.5, y: 4.95, w: 9, h: 0.25, fontSize: 9.5, italic: true, color: C.muted });
    pageNum(s, 9);
    s.addNotes("~20s. [Introduce each founder in one sentence: who they are and why they're the right person to build this — hardware, software, industry or sales experience.]");
  }

  // ---------- 10. The ask ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    kicker(s, "The ask", "7FA5F5", 0.35);
    T(s, [
      { text: "Raising ", options: { color: C.white } },
      { text: "[amount]", options: { color: "FBBF24" } },
      { text: " to put Sentinel on every site that can't see its risks.", options: { color: C.white } },
    ], { x: 0.5, y: 0.7, w: 9, h: 1.1, fontFace: H, fontSize: 26, bold: true });
    const uses = [
      ["LuUsers", "Pilots & sales", "[__%]"],
      ["LuShieldCheck", "Certification & hardware", "[__%]"],
      ["LuRocket", "Product & team", "[__%]"],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.5 + i * 3.05;
      card(s, x, 2.15, 2.85, 1.55, C.navy2);
      await iconBubble(s, uses[i][0], x + 0.25, 2.35, 0.5, C.blue);
      T(s, uses[i][2], { x: x + 1.3, y: 2.35, w: 1.35, h: 0.5, fontSize: 20, bold: true, color: "FBBF24", align: "right", valign: "middle" });
      T(s, uses[i][1], { x: x + 0.25, y: 3.05, w: 2.4, h: 0.45, fontSize: 14, bold: true, color: C.white });
    }
    s.addImage({ data: logoWhite, x: 0.5, y: 4.2, w: 0.6, h: 0.6 });
    T(s, "Sentinel — connected gas safety, on your own terms.", { x: 1.25, y: 4.2, w: 6, h: 0.3, fontSize: 14, bold: true, color: C.white });
    T(s, "[email]  ·  [website]  ·  [phone]", { x: 1.25, y: 4.52, w: 6, h: 0.3, fontSize: 12, color: "FBBF24" });
    s.addNotes("~25s. We're raising [amount] to run pilots, complete certification, and grow the team. Invisible gas shouldn't need an enterprise budget to be seen. Thank you — I'd love your questions.");
  }

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();
