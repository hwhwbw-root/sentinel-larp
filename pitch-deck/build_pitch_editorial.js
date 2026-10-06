// Sentinel 5-min pitch — editorial style (cream paper + blue, condensed serif, script accents,
// thin outline pills, B&W photos) following the Bold deck's structure + a How It Works slide.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");
const path = require("path");

const ASSETS = "C:/Users/User/OneDrive/Documents/sentinel/canva-bunting-assets/";
const PHOTOS = path.join(__dirname, "photos") + "/";
const OUT = process.argv[2] || "Sentinel-Pitch-Editorial.pptx";

const CREAM = "EFEAD9", BLUE = "2F5C90", INK = "1B4E89";
const DISPLAY = "Bodoni MT Condensed", SCRIPT = "Edwardian Script ITC", BODY = "Arial";
const TEAM = "KOPISCRIPT";

async function paper(hex) {
  const W = 1600, H = 900, r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  const buf = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    const n = (Math.random() - 0.5) * 14;
    buf[i * 3] = Math.max(0, Math.min(255, r + n));
    buf[i * 3 + 1] = Math.max(0, Math.min(255, g + n));
    buf[i * 3 + 2] = Math.max(0, Math.min(255, b + n));
  }
  return "image/jpeg;base64," + (await sharp(buf, { raw: { width: W, height: H, channels: 3 } }).blur(0.6).jpeg({ quality: 82 }).toBuffer()).toString("base64");
}
const icon = async (name, color, size = 256) => {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(lu[name], { color: "#" + color, size: String(size) }));
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
};
const PX = 260;
async function photo(file, wIn, hIn, { gray = true, position = "centre", extract, arch = false } = {}) {
  const W = Math.round(wIn * PX), H = Math.round(hIn * PX);
  let img = sharp(file);
  if (extract) img = img.extract(extract);
  img = img.resize(W, H, { fit: "cover", position });
  if (gray) img = img.grayscale().normalise().linear(1.05, -4);
  if (!arch) return "image/jpeg;base64," + (await img.jpeg({ quality: 86 }).toBuffer()).toString("base64");
  const r = W / 2, mask = `<svg width="${W}" height="${H}"><path d="M0 ${H} V${r} A${r} ${r} 0 0 1 ${W} ${r} V${H} Z" fill="#fff"/></svg>`;
  const out = await sharp(await img.png().toBuffer()).ensureAlpha().composite([{ input: Buffer.from(mask), blend: "dest-in" }]).png().toBuffer();
  return "image/png;base64," + out.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.title = "Sentinel — Pitch";

  const creamBg = await paper(CREAM), blueBg = await paper(BLUE);
  const T = (s, text, o) => s.addText(text, { isTextBox: true, fontFace: BODY, margin: 0, ...o });
  const display = (s, text, color, o) => T(s, text, { fontFace: DISPLAY, color, valign: "top", lineSpacingMultiple: 0.82, ...o });
  const script = (s, text, color, o) => T(s, text, { fontFace: SCRIPT, color, valign: "top", ...o });
  const body = (s, text, color, o) => T(s, text.toUpperCase(), { fontSize: 9, color, align: "justify", valign: "top", lineSpacingMultiple: 1.05, ...o });
  const img = async (s, file, x, y, w, h, opts) => s.addImage({ data: await photo(file, w, h, opts), x, y, w, h });
  const pill = (s, text, x, y, w, color, o = {}) => {
    const h = o.h || 0.32;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: h / 2, fill: o.fill ? { color: o.fill } : { type: "none" }, line: { color, width: 0.75 } });
    T(s, text, { x, y, w, h, fontSize: o.fontSize || 8, bold: true, color: o.textColor || color, align: "center", valign: "middle", charSpacing: 1 });
  };
  const line = (s, x, y, w, color, h = 0, flipV = false) => s.addShape(pres.shapes.LINE, { x, y, w, h, flipV, line: { color, width: 0.6 } });
  const corners = (s, color, { tl = true, bl = true } = {}) => {
    const o = { fontSize: 6.5, bold: true, color, h: 0.18 };
    if (tl) T(s, "SENTINEL — GAS SAFETY MONITORING", { ...o, x: 0.35, y: 0.22, w: 3.5 });
    if (bl) T(s, [{ text: "PRESENTED BY:", options: { bold: false, breakLine: true } }, { text: TEAM }], { ...o, x: 0.35, y: 5.2, w: 3, h: 0.25 });
  };
  const cream = () => { const s = pres.addSlide(); s.background = { data: creamBg }; return s; };
  const blue = () => { const s = pres.addSlide(); s.background = { data: blueBg }; return s; };

  // ---------- 1. Title ----------
  {
    const s = cream();
    display(s, "Sentinel", INK, { x: 0.3, y: 0.08, w: 9.4, h: 1.5, fontSize: 118, align: "center" });
    line(s, 0.35, 1.72, 9.3, INK);
    await img(s, PHOTOS + "c5.jpg", 0.35, 1.98, 2.75, 3.4, { arch: true, position: "top" });
    script(s, "Some dangers\nyou can't see.", INK, { x: 3.5, y: 2.05, w: 3.2, h: 1.6, fontSize: 40 });
    body(s, "Real-time gas safety monitoring that warns you the moment a reading turns dangerous — built for every facility, not just the biggest plants.", INK,
      { x: 3.55, y: 3.75, w: 2.9, h: 0.75, fontSize: 8 });
    T(s, [{ text: "BY: ", options: { bold: false } }, { text: TEAM }], { x: 3.55, y: 4.75, w: 2.9, h: 0.25, fontSize: 9, bold: true, color: INK, charSpacing: 1.5 });
    await img(s, PHOTOS + "c9.jpg", 6.85, 1.98, 2.8, 3.4);
    s.addNotes("(~15s) Hi, we're Kopiscript, and this is Sentinel — real-time gas safety monitoring, because some dangers you simply can't see.");
  }

  // ---------- 2. What we'll cover ----------
  {
    const s = blue();
    corners(s, CREAM);
    display(s, "What we'll\ncover", CREAM, { x: 0.7, y: 1.35, w: 3.8, h: 2.6, fontSize: 72 });
    const items = ["THE PROBLEM", "WHERE IT HAPPENS", "THE SOLUTION", "HOW IT WORKS", "LIVE DASHBOARD", "WHY SENTINEL", "NEXT STEPS"];
    items.forEach((t, i) => {
      const x = i % 2 ? 6.55 : 5.3, y = 0.62 + i * 0.6;
      pill(s, t, x, y, 2.6, CREAM, { h: 0.38, fontSize: 8.5 });
      T(s, "\\" + String(i + 3).padStart(2, "0"), { x: x + 2.7, y, w: 0.5, h: 0.38, fontSize: 8, bold: true, color: CREAM, valign: "middle" });
    });
    s.addNotes("(~5s) Here's what we'll cover in the next five minutes.");
  }

  // ---------- 3. The problem ----------
  {
    const s = cream();
    await img(s, PHOTOS + "c2.jpg", 0, 0, 3.55, 5.625, { position: "right" });
    T(s, "SENTINEL — GAS SAFETY MONITORING", { x: 3.95, y: 0.22, w: 3.5, h: 0.18, fontSize: 6.5, bold: true, color: INK });
    const facts = [
      ["Invisible.", "CO2 and hydrogen have no colour, no smell and no sound."],
      ["Explosive.", "Hydrogen ignites at just 4% in air."],
      ["Deadly.", "CO2 at 40,000 ppm is immediately dangerous to life."],
    ];
    facts.forEach((f, i) => {
      const x = 4.0 + i * 1.9;
      line(s, x, 0.7, 1.7, INK);
      display(s, f[0], INK, { x, y: 0.82, w: 1.75, h: 0.6, fontSize: 30 });
      body(s, f[1], INK, { x, y: 1.45, w: 1.7, h: 0.9, fontSize: 8, align: "left" });
    });
    script(s, "Without monitoring, a leak is found\nwhen someone gets hurt.", INK, { x: 4.0, y: 2.45, w: 5.6, h: 0.95, fontSize: 24 });
    display(s, "The Problem", INK, { x: 3.95, y: 3.5, w: 5.7, h: 1.5, fontSize: 96 });
    s.addNotes("(~35s) The problem. These gases are invisible — no colour, no smell, no sound. They're explosive — hydrogen ignites at just four percent in air. And they're deadly — CO2 at forty thousand ppm is immediately dangerous to life. Without monitoring, a leak is found when someone gets hurt.");
  }

  // ---------- 4. Where it happens ----------
  {
    const s = blue();
    corners(s, CREAM);
    display(s, "Where It\nHappens", CREAM, { x: 0.55, y: 0.65, w: 3.6, h: 2.3, fontSize: 70 });
    script(s, "Every day, in plain sight.", CREAM, { x: 0.6, y: 2.95, w: 3.4, h: 0.6, fontSize: 24 });
    await img(s, PHOTOS + "c4.jpg", 4.1, 0.65, 1.95, 2.7);
    await img(s, PHOTOS + "c8.jpg", 4.1, 3.45, 1.95, 1.55);
    body(s, "Breweries, factories, labs, cold storage and hydrogen sites handle these gases every single day. Most rely on a detector that only beeps on site — at night, on a weekend, in an empty room, nobody hears it.", CREAM,
      { x: 6.45, y: 0.7, w: 3.15, h: 1.35, fontSize: 8.5 });
    const places = ["FACTORIES", "BREWERIES", "HYDROGEN SITES", "LABS", "COLD STORAGE"];
    places.forEach((p, i) => pill(s, p, 6.45, 2.3 + i * 0.47, 2.2, CREAM, { h: 0.34, fontSize: 8 }));
    s.addNotes("(~25s) Where does it happen? Breweries, factories, labs, cold storage, hydrogen sites — every day. And most of them rely on a detector that only beeps on site. At night or on a weekend, nobody hears it.");
  }

  // ---------- 5. The solution ----------
  {
    const s = cream();
    corners(s, INK);
    display(s, "The Solution", INK, { x: 0.5, y: 0.5, w: 5.5, h: 1.2, fontSize: 80 });
    script(s, "Sense it, flag it, see it — anywhere.", INK, { x: 0.55, y: 1.6, w: 5.3, h: 0.6, fontSize: 24 });
    const rows = [
      ["SENSE", "A Sentinel box on the wall reads CO2 or H2, temperature and humidity every ~10 seconds."],
      ["ALERT", "Cross the danger line and it's flagged red instantly — checked in the cloud."],
      ["SEE", "Every site, live, in any browser. On site, at home, anywhere."],
    ];
    rows.forEach((r, i) => {
      const y = 2.5 + i * 0.82;
      pill(s, r[0], 0.55, y, 1.15, INK, { h: 0.34, fontSize: 8.5, fill: i === 1 ? INK : undefined, textColor: i === 1 ? CREAM : INK });
      body(s, r[1], INK, { x: 1.95, y: y - 0.01, w: 3.8, h: 0.6, fontSize: 8.5, align: "left" });
    });
    await img(s, PHOTOS + "c1.jpg", 6.25, 0.6, 3.4, 4.4, { position: "left" });
    s.addNotes("(~30s) Sentinel fixes that. A small box on the wall senses CO2 or hydrogen every ten seconds. The moment a reading crosses the danger line, it's flagged red. And anyone responsible can see every site live, from any browser.");
  }

  // ---------- 6. How it works ----------
  {
    const s = blue();
    corners(s, CREAM);
    display(s, "How It Works", CREAM, { x: 0.5, y: 0.5, w: 6, h: 1.2, fontSize: 76 });
    script(s, "From the air to your screen,\nin seconds.", CREAM, { x: 6.2, y: 0.65, w: 3.4, h: 0.9, fontSize: 22, align: "center" });
    const steps = [
      ["01", "MEASURE", "The Sentinel box — an ESP32 board with a gas sensor — reads CO2 or H2, temperature and humidity every ~10 seconds."],
      ["02", "SEND SECURELY", "Each reading travels over Wi-Fi to our cloud, signed with that device's own secret key. No shared passwords."],
      ["03", "CHECK", "The server compares every reading to that device's warning and danger thresholds, stores it, and logs any alert."],
      ["04", "SHOW", "The dashboard refreshes every ~4 seconds with live readings, trends and red alerts — for each user's role."],
    ];
    const W = 2.1, gap = 0.27, x0 = 0.5, Y = 2.05;
    steps.forEach((st, i) => {
      const x = x0 + i * (W + gap);
      line(s, x, Y, W, CREAM);
      display(s, st[0], CREAM, { x, y: Y + 0.12, w: W, h: 0.75, fontSize: 48 });
      T(s, st[1], { x, y: Y + 0.95, w: W, h: 0.25, fontSize: 9.5, bold: true, color: CREAM });
      body(s, st[2], CREAM, { x, y: Y + 1.28, w: W, h: 1.4, fontSize: 8, align: "left" });
    });
    T(s, "SENSOR BOX   →   SECURE CLOUD   →   THRESHOLD CHECK   →   LIVE DASHBOARD", { x: 0.5, y: 4.85, w: 9, h: 0.25, fontSize: 7.5, bold: true, color: CREAM, align: "center", charSpacing: 1 });
    s.addNotes("(~35s) Here's how it works. One: the box measures every ten seconds. Two: each reading travels over Wi-Fi to our cloud, signed with that device's own secret key, so nobody can fake a reading. Three: the server checks it against that device's warning and danger thresholds and logs any alert. Four: the dashboard refreshes every four seconds, so the right people see danger almost instantly.");
  }

  // ---------- 7. Live dashboard ----------
  {
    const s = cream();
    corners(s, INK);
    display(s, "Live Dashboard", INK, { x: 0.5, y: 0.45, w: 5.5, h: 1.0, fontSize: 60 });
    script(s, "Running today, not a mockup.", INK, { x: 5.6, y: 0.6, w: 4.0, h: 0.6, fontSize: 24, align: "right" });
    // Browser-window frame around the real screenshot
    const fw = 8.4, bar = 0.24, sh = fw * 1500 / 3840, fx = (10 - fw) / 2, fy = 1.4;
    s.addShape(pres.shapes.RECTANGLE, { x: fx, y: fy, w: fw, h: bar + sh, fill: { color: "FFFFFF" }, line: { color: "D8D3C2", width: 0.75 },
      shadow: { type: "outer", color: "1B2A44", blur: 18, offset: 6, angle: 90, opacity: 0.18 } });
    s.addShape(pres.shapes.RECTANGLE, { x: fx, y: fy, w: fw, h: bar, fill: { color: "F3F1EA" }, line: { color: "D8D3C2", width: 0.75 } });
    ["E0645C", "E5B547", "5FBF5A"].forEach((c, i) => s.addShape(pres.shapes.OVAL, { x: fx + 0.12 + i * 0.15, y: fy + 0.075, w: 0.09, h: 0.09, fill: { color: c }, line: { color: c } }));
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: fx + fw / 2 - 1.3, y: fy + 0.05, w: 2.6, h: 0.14, rectRadius: 0.07, fill: { color: "E6E2D6" }, line: { color: "E6E2D6" } });
    T(s, "sentinel · live monitoring", { x: fx + fw / 2 - 1.3, y: fy + 0.05, w: 2.6, h: 0.14, fontSize: 6, color: "6B6B6B", align: "center", valign: "middle" });
    s.addImage({ data: await photo(ASSETS + "08_real_project_screenshots/sentinel-real-dashboard-desktop.png", fw, sh,
      { gray: false, extract: { left: 0, top: 0, width: 3840, height: 1500 } }), x: fx, y: fy + bar, w: fw, h: sh });
    T(s, [
      { text: "LIVE READINGS  ·  TRENDS  ·  ", options: {} },
      { text: "DANGER ALERTS", options: { color: "B3261E" } },
    ], { x: fx, y: fy + bar + sh + 0.12, w: fw, h: 0.22, fontSize: 7.5, bold: true, color: INK, align: "center", charSpacing: 1.5 });
    s.addNotes("(~30s) This is the real product, running today. Live readings at the top, trends underneath, and on the right, real danger alerts — each showing the exact level and which device caught it.");
  }

  // ---------- 8. Every 10 seconds ----------
  {
    const s = blue();
    corners(s, CREAM);
    T(s, "OUR SENSORS CHECK THE AIR", { x: 0.5, y: 1.0, w: 9, h: 0.3, fontSize: 10, bold: true, color: CREAM, align: "center", charSpacing: 3 });
    display(s, "Every 10 Seconds.", CREAM, { x: 0.3, y: 1.35, w: 9.4, h: 2.0, fontSize: 130, align: "center" });
    script(s, "Twenty-four hours a day — whether anyone is on site or not.", CREAM, { x: 0.5, y: 3.55, w: 9, h: 0.7, fontSize: 28, align: "center" });
    s.addNotes("(~15s) Our sensors check the air every ten seconds — twenty-four hours a day, whether anyone is on site or not.");
  }

  // ---------- 9. Why Sentinel ----------
  {
    const s = cream();
    corners(s, INK);
    display(s, "Why Sentinel", INK, { x: 0.5, y: 0.45, w: 5.5, h: 1.0, fontSize: 70 });
    script(s, "The reach of a big system,\nthe price of a detector.", INK, { x: 5.6, y: 0.5, w: 4.0, h: 0.9, fontSize: 22, align: "right" });
    const cols = [
      ["STANDALONE DETECTORS", ["Beeps on site only", "No history", "Nobody off-site knows"], [0, 0, 0]],
      ["ENTERPRISE SYSTEMS", ["Full visibility", "Expensive", "Complex to install"], [1, 0, 0]],
      ["SENTINEL", ["Live, from anywhere", "Instant danger alerts", "Affordable & simple"], [1, 1, 1]],
    ];
    const ok = await icon("LuCheck", INK), no = await icon("LuX", "9AA7B8"), okC = await icon("LuCheck", CREAM);
    for (let i = 0; i < 3; i++) {
      const x = 0.5 + i * 3.05, me = i === 2, w = 2.85, y = 1.65;
      if (me) s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 3.35, fill: { color: INK }, line: { color: INK } });
      else line(s, x, y, w, INK);
      T(s, cols[i][0], { x: x + 0.2, y: y + 0.25, w: w - 0.4, h: 0.3, fontSize: 10, bold: true, color: me ? CREAM : INK, charSpacing: 1 });
      if (!me) line(s, x, y + 3.35, w, INK);
      cols[i][1].forEach((t, j) => {
        const yy = y + 0.95 + j * 0.72;
        s.addImage({ data: me ? okC : cols[i][2][j] ? ok : no, x: x + 0.2, y: yy + 0.04, w: 0.24, h: 0.24 });
        display(s, t, me ? CREAM : INK, { x: x + 0.6, y: yy - 0.06, w: w - 0.8, h: 0.45, fontSize: 22 });
      });
    }
    s.addNotes("(~30s) Today, facilities choose between a standalone detector that only beeps on site and keeps no record — or an enterprise system that does everything, at a price and complexity only big plants can afford. Sentinel gives every facility live visibility from anywhere and instant danger alerts, while staying affordable and simple.");
  }

  // ---------- 10. Next steps ----------
  {
    const s = blue();
    corners(s, CREAM);
    display(s, "Next Steps", CREAM, { x: 0.5, y: 0.45, w: 5.5, h: 1.0, fontSize: 70 });
    script(s, "Where we go from here.", CREAM, { x: 5.6, y: 0.6, w: 4.0, h: 0.6, fontSize: 24, align: "right" });
    const steps = [["PILOTS", "First partner facilities"], ["ALERTS", "SMS & email notifications"], ["MORE GASES", "Beyond CO2 and H2"], ["SCALE", "Multi-site accounts"]];
    const pts = steps.map((_, i) => [0.5 + i * 2.3, i % 2 ? 3.45 : 2.05]);
    for (let i = 0; i < 3; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const ax = x1 + 1.9, ay = y1 + 0.18, bx = x2, by = y2 + 0.18;
      line(s, ax, Math.min(ay, by), bx - ax, CREAM, Math.abs(by - ay), by < ay);
    }
    steps.forEach((st, i) => {
      const [x, y] = pts[i];
      display(s, String(i + 1).padStart(2, "0"), CREAM, { x, y: y - 0.62, w: 1.9, h: 0.55, fontSize: 30, align: "center" });
      pill(s, st[0], x, y, 1.9, CREAM, { h: 0.36, fontSize: 9 });
      body(s, st[1], CREAM, { x, y: y + 0.48, w: 1.9, h: 0.4, fontSize: 7.5, align: "center" });
    });
    s.addNotes("(~20s) What's next: pilots with our first partner facilities, then SMS and email notifications, more gas types beyond CO2 and hydrogen, and multi-site accounts so one team can protect every location.");
  }

  // ---------- 11. Close + ask ----------
  {
    const s = cream();
    corners(s, INK);
    display(s, "Let's Make Every\nFacility Safe.", INK, { x: 0.5, y: 0.45, w: 5.6, h: 2.0, fontSize: 66 });
    T(s, "WE'RE LOOKING FOR", { x: 0.55, y: 2.6, w: 4, h: 0.25, fontSize: 8.5, bold: true, color: INK, charSpacing: 2 });
    const asks = [["PILOT PARTNERS", "Breweries, labs and plants handling CO2 or H2"], ["SAFETY MENTORS", "Experts in industrial gas safety and standards"], ["INTRODUCTIONS", "To facility and safety managers you know"]];
    asks.forEach((a, i) => {
      const y = 2.98 + i * 0.5;
      pill(s, a[0], 0.55, y, 1.65, INK, { h: 0.34, fontSize: 8, fill: i === 0 ? INK : undefined, textColor: i === 0 ? CREAM : INK });
      body(s, a[1], INK, { x: 2.35, y: y + 0.08, w: 3.3, h: 0.25, fontSize: 7.5, align: "left" });
    });
    pill(s, "TEAM " + TEAM, 0.55, 4.6, 1.95, INK, { h: 0.34, fontSize: 8.5, fill: INK, textColor: CREAM });
    await img(s, PHOTOS + "c6.jpg", 6.05, 0.6, 1.75, 4.4, { position: "top" });
    await img(s, PHOTOS + "c10.jpg", 7.9, 0.6, 1.75, 4.4);
    s.addNotes("(~25s) Here's how you can help. We're looking for pilot partners — breweries, labs and plants handling CO2 or hydrogen — mentors in industrial gas safety, and introductions to facility and safety managers you know. Let's make every facility safe. Thank you.");
  }

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();
