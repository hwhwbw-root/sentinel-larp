// Sentinel 5-min pitch in the "Grey Bold Minimalist" template style:
// cobalt blue / warm grey alternating, huge tight black headlines, outline pills,
// page-number pill, B&W photos in arch / notched frames.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");
const path = require("path");

const ASSETS = "C:/Users/User/OneDrive/Documents/sentinel/canva-bunting-assets/";
const PHOTOS = path.join(__dirname, "photos") + "/";
const OUT = process.argv[2] || "Sentinel-Pitch-Bold.pptx";

const BLUE = "1250AA", GREY = "E3E2DE", RED = "D93025";
const HEAD = "Arial Black", BODY = "Arial";

const icon = async (name, color, size = 256) => {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(lu[name], { color: "#" + color, size: String(size) }));
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
};

// ---- photo frames (sharp masks) ----
const PX = 300; // px per inch for rendered frames
function maskSvg(shape, W, H) {
  if (shape === "arch") {
    const r = W / 2;
    return `<svg width="${W}" height="${H}"><path d="M0 ${H} V${r} A${r} ${r} 0 0 1 ${W} ${r} V${H} Z" fill="#fff"/></svg>`;
  }
  if (shape === "ticket") { // rounded rect with concave corner notches
    const r = Math.min(W, H) * 0.14;
    return `<svg width="${W}" height="${H}"><defs><mask id="m"><rect width="${W}" height="${H}" rx="${r * 0.6}" fill="#fff"/>
      <circle cx="0" cy="0" r="${r}" fill="#000"/><circle cx="${W}" cy="0" r="${r}" fill="#000"/>
      <circle cx="0" cy="${H}" r="${r}" fill="#000"/><circle cx="${W}" cy="${H}" r="${r}" fill="#000"/></mask></defs>
      <rect width="${W}" height="${H}" fill="#fff" mask="url(#m)"/></svg>`;
  }
  const r = Math.min(W, H) * 0.08; // rounded
  return `<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="${r}" fill="#fff"/></svg>`;
}
async function framed(file, wIn, hIn, shape, { gray = true, position = "centre", extract } = {}) {
  const W = Math.round(wIn * PX), H = Math.round(hIn * PX);
  let img = sharp(file);
  if (extract) img = img.extract(extract);
  img = img.resize(W, H, { fit: "cover", position });
  if (gray) img = img.grayscale().normalise().linear(1.08, -8);
  const base = await img.png().toBuffer();
  const out = await sharp(base).ensureAlpha()
    .composite([{ input: Buffer.from(maskSvg(shape, W, H)), blend: "dest-in" }]).png().toBuffer();
  return "image/png;base64," + out.toString("base64");
}
const assetImg = async (p, width) =>
  "image/png;base64," + (await sharp(ASSETS + p).resize({ width }).png().toBuffer()).toString("base64");

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.title = "Sentinel — Pitch";

  const T = (s, text, o) => s.addText(text, { isTextBox: true, fontFace: BODY, margin: 0, ...o });
  const headline = (s, text, color, o = {}) =>
    T(s, text, { x: 0.35, y: 0.22, w: 8.2, h: 1.0, fontFace: HEAD, fontSize: 50, color, charSpacing: -3, valign: "top", lineSpacingMultiple: 0.82, ...o });
  const pill = (s, text, x, y, w, color, o = {}) => {
    const h = o.h || 0.36;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: h / 2, fill: o.fill ? { color: o.fill } : { type: "none" }, line: { color, width: 1.25 } });
    T(s, text, { x, y, w, h, fontSize: o.fontSize || 11, bold: true, color: o.textColor || color, align: "center", valign: "middle" });
  };
  const pageNo = (s, n, color) => pill(s, String(n).padStart(2, "0"), 9.0, 0.3, 0.6, color, { h: 0.28, fontSize: 9 });
  const blueSlide = () => { const s = pres.addSlide(); s.background = { color: BLUE }; return s; };
  const greySlide = () => { const s = pres.addSlide(); s.background = { color: GREY }; return s; };

  const logoBlue = await assetImg("01_logos/sentinel-shield-color.png", 300);
  const logoWhite = await assetImg("01_logos/sentinel-shield-white.png", 300);

  // ---------- 1. Title ----------
  {
    const s = greySlide();
    s.addImage({ data: await framed(PHOTOS + "c5.jpg", 3.2, 3.6, "arch", { position: "top" }), x: 0.35, y: 2.03, w: 3.2, h: 3.6 });
    T(s, "Sentinel", { x: 0.3, y: 0.15, w: 9, h: 1.7, fontFace: HEAD, fontSize: 104, color: BLUE, charSpacing: -6, valign: "top" });
    T(s, "Some dangers\nyou can't see.", { x: 4.0, y: 2.2, w: 5.4, h: 1.5, fontFace: HEAD, fontSize: 36, color: BLUE, charSpacing: -1.5, valign: "top", lineSpacingMultiple: 0.9 });
    T(s, "REAL-TIME GAS SAFETY MONITORING\nFOR EVERY FACILITY", { x: 4.0, y: 3.85, w: 5, h: 0.5, fontSize: 11, color: BLUE, charSpacing: 1, valign: "top" });
    T(s, [{ text: "PRESENTED BY", options: { breakLine: true } }, { text: "KOPISCRIPT", options: { bold: true } }],
      { x: 4.0, y: 4.75, w: 4, h: 0.45, fontSize: 10, color: BLUE, valign: "top" });
    s.addNotes("(~20s) Hi, we're Sentinel. We make real-time gas monitoring for every facility — because some of the most dangerous things at work are the ones you can't see.");
  }

  // ---------- 2. Contents ----------
  {
    const s = blueSlide();
    T(s, "What\nwe'll\ncover", { x: 0.35, y: 1.55, w: 4.5, h: 3.6, fontFace: HEAD, fontSize: 60, color: GREY, charSpacing: -3, valign: "top", lineSpacingMultiple: 0.85 });
    const items = ["THE PROBLEM", "WHERE IT HAPPENS", "THE SOLUTION", "LIVE DASHBOARD", "WHY SENTINEL", "NEXT STEPS"];
    items.forEach((t, i) => pill(s, t, i % 2 ? 7.25 : 6.4, 0.6 + i * 0.72, 2.35, GREY, { h: 0.46, fontSize: 12 }));
    s.addNotes("(~10s) In the next five minutes: the problem, where it happens, our solution and live product, why we win, and what's next.");
  }

  // ---------- 3. The problem ----------
  {
    const s = blueSlide();
    headline(s, "The Problem", GREY);
    pageNo(s, 1, GREY);
    s.addImage({ data: await framed(PHOTOS + "c2.jpg", 2.9, 3.35, "arch"), x: 6.1, y: 1.4, w: 2.9, h: 3.35 });
    pill(s, "4% H2 IN AIR CAN IGNITE", 6.325, 4.95, 2.45, GREY, { h: 0.34, fontSize: 10 });
    const facts = [
      ["LuEyeOff", "Invisible.", "CO2 and hydrogen have no colour, no smell and no sound."],
      ["LuFlame", "Explosive.", "Hydrogen ignites at just 4% in air."],
      ["LuSkull", "Deadly.", "CO2 at 40,000 ppm is immediately dangerous to life."],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.6 + i * 0.95;
      s.addImage({ data: await icon(facts[i][0], GREY), x: 0.6, y: y + 0.04, w: 0.42, h: 0.42 });
      T(s, [
        { text: facts[i][1] + " ", options: { fontFace: HEAD, fontSize: 18, color: GREY } },
        { text: facts[i][2], options: { fontSize: 12.5, color: "C9D6F0" } },
      ], { x: 1.25, y, w: 4.3, h: 0.75, valign: "top" });
    }
    T(s, "Without monitoring, a leak is found when someone gets hurt.", { x: 0.6, y: 4.6, w: 4.9, h: 0.55, fontSize: 13, bold: true, color: GREY, valign: "top" });
    s.addNotes("(~40s) The problem: the gases facilities handle every day are invisible — no colour, no smell, no sound. Hydrogen ignites at just four percent in air. CO2 at forty thousand ppm is immediately dangerous to life. Without monitoring, a leak is discovered when someone gets hurt.");
  }

  // ---------- 4. Where it happens ----------
  {
    const s = greySlide();
    headline(s, "Where It Happens", BLUE);
    pageNo(s, 2, BLUE);
    s.addImage({ data: await framed(PHOTOS + "c4.jpg", 2.1, 3.1, "ticket"), x: 0.35, y: 1.55, w: 2.1, h: 3.1 });
    s.addImage({ data: await framed(PHOTOS + "c8.jpg", 2.1, 3.1, "ticket"), x: 2.6, y: 1.55, w: 2.1, h: 3.1 });
    T(s, "Breweries, factories, labs, cold storage and hydrogen sites handle these gases every single day.", {
      x: 5.25, y: 1.6, w: 4.2, h: 0.85, fontSize: 13, color: BLUE, valign: "top",
    });
    T(s, "Most rely on a detector that only beeps on site. If nobody is there — nobody knows.", {
      x: 5.25, y: 2.5, w: 4.2, h: 0.65, fontSize: 13, bold: true, color: BLUE, valign: "top",
    });
    const places = ["FACTORIES", "BREWERIES", "HYDROGEN SITES", "LABS", "COLD STORAGE"];
    const pos = [[5.25, 3.45, 1.35], [6.7, 3.45, 1.35], [8.15, 3.45, 1.45], [5.25, 3.95, 0.9], [6.25, 3.95, 1.6]];
    places.forEach((p, i) => pill(s, p, pos[i][0], pos[i][1], pos[i][2], BLUE, { h: 0.36, fontSize: 9.5 }));
    s.addNotes("(~30s) Where does it happen? Breweries, factories, labs, cold storage, hydrogen sites — every day. And most of them rely on a detector that only beeps on site. At night or on a weekend, if nobody is there, nobody knows.");
  }

  // ---------- 5. The solution ----------
  {
    const s = blueSlide();
    headline(s, "The Solution", GREY);
    pageNo(s, 3, GREY);
    const rows = [
      ["SENSE", "A Sentinel box reads CO2 or H2, temperature and humidity every ~10 seconds."],
      ["ALERT", "Cross the danger line and it's flagged red instantly — checked in the cloud."],
      ["SEE", "Every site, live, in any browser. On site, at home, anywhere."],
    ];
    rows.forEach((r, i) => {
      const y = 1.65 + i * 1.0;
      pill(s, r[0], 0.6, y, 1.15, GREY, { h: 0.4, fontSize: 12 });
      T(s, r[1], { x: 2.0, y: y - 0.02, w: 3.5, h: 0.75, fontSize: 12.5, color: GREY, valign: "top" });
    });
    s.addImage({ data: await framed(PHOTOS + "c1.jpg", 3.3, 3.5, "arch", { position: "left" }), x: 5.9, y: 1.45, w: 3.3, h: 3.5 });
    s.addImage({ data: logoWhite, x: 0.6, y: 4.75, w: 0.4, h: 0.4 });
    T(s, "Secure by design: every device has its own key.", { x: 1.15, y: 4.75, w: 4.4, h: 0.4, fontSize: 11, color: "C9D6F0", valign: "middle" });
    s.addNotes("(~35s) Sentinel fixes that. A small box on the wall senses CO2 or hydrogen every ten seconds. The cloud checks every reading, and the moment it crosses the danger line it's flagged red. And anyone responsible can see every site live, from any browser. Every device has its own secure key.");
  }

  // ---------- 6. Live dashboard ----------
  {
    const s = greySlide();
    headline(s, "Live Dashboard", BLUE);
    pageNo(s, 4, BLUE);
    const dashW = 6.4, dashH = dashW * 1560 / 3840;
    const dash = await framed(ASSETS + "08_real_project_screenshots/sentinel-real-dashboard-desktop.png", dashW, dashH, "rounded",
      { gray: false, extract: { left: 0, top: 0, width: 3840, height: 1560 } });
    s.addImage({ data: dash, x: 0.35, y: 1.5, w: dashW, h: dashH, shadow: { type: "outer", color: "000000", blur: 16, offset: 4, angle: 90, opacity: 0.15 } });
    const pts = [["LIVE READINGS", "CO2 / H2, temperature, humidity"], ["TRENDS", "Spot spikes over time"], ["DANGER ALERTS", "Red the moment it matters"]];
    pts.forEach((p, i) => {
      const y = 1.55 + i * 0.95;
      pill(s, p[0], 7.0, y, 2.4, i === 2 ? RED : BLUE, { h: 0.36, fontSize: 10.5 });
      T(s, p[1], { x: 7.0, y: y + 0.44, w: 2.4, h: 0.35, fontSize: 11, color: BLUE, align: "center" });
    });
    T(s, "The real product — running today.", { x: 0.35, y: 1.5 + dashH + 0.22, w: dashW, h: 0.35, fontSize: 12, bold: true, color: BLUE });
    s.addNotes("(~35s) This is the real product, running today. Live readings at the top, trends underneath, and on the right, real danger alerts — each one shows the exact level and which device caught it.");
  }

  // ---------- 7. Big stat ----------
  {
    const s = blueSlide();
    T(s, "OUR SENSORS CHECK THE AIR", { x: 0.35, y: 1.25, w: 9.3, h: 0.4, fontSize: 16, bold: true, color: GREY, charSpacing: 2 });
    T(s, "Every 10\nSeconds.", { x: 0.3, y: 1.75, w: 9.3, h: 2.8, fontFace: HEAD, fontSize: 96, color: GREY, charSpacing: -6, valign: "top", lineSpacingMultiple: 0.82 });
    pill(s, "24 HOURS A DAY", 6.25, 4.75, 1.65, GREY, { h: 0.36, fontSize: 10 });
    pill(s, "ON SITE OR NOT", 8.0, 4.75, 1.65, GREY, { h: 0.36, fontSize: 10 });
    s.addNotes("(~15s) Our sensors check the air every ten seconds — twenty-four hours a day, whether anyone is on site or not.");
  }

  // ---------- 8. Why Sentinel ----------
  {
    const s = greySlide();
    headline(s, "Why Sentinel", BLUE);
    pageNo(s, 5, BLUE);
    const cols = [
      ["STANDALONE\nDETECTORS", ["Beeps on site only", "No history", "Nobody off-site knows"], false],
      ["ENTERPRISE\nSYSTEMS", ["Full visibility", "Expensive", "Complex to install"], false],
      ["SENTINEL", ["Live, from anywhere", "Instant danger alerts", "Affordable & simple"], true],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.35 + i * 3.15, me = cols[i][2];
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 2.95, h: 3.6, rectRadius: 0.3, fill: me ? { color: BLUE } : { type: "none" }, line: { color: BLUE, width: 1.25 } });
      T(s, cols[i][0], { x: x + 0.3, y: 1.75, w: 2.4, h: 0.85, fontFace: HEAD, fontSize: 17, color: me ? GREY : BLUE, valign: "top", charSpacing: -0.5 });
      for (let j = 0; j < 3; j++) {
        const y = 2.85 + j * 0.62, good = me || (i === 1 && j === 0);
        s.addImage({ data: await icon(good ? "LuCircleCheck" : "LuCircleX", me ? GREY : good ? BLUE : "9A9A9A"), x: x + 0.3, y: y + 0.03, w: 0.3, h: 0.3 });
        T(s, cols[i][1][j], { x: x + 0.72, y, w: 2.1, h: 0.36, fontSize: 12, bold: me, color: me ? GREY : BLUE, valign: "middle" });
      }
    }
    s.addNotes("(~35s) Today, facilities choose between a standalone detector that only beeps on site and keeps no record — or an enterprise system that does everything, at a price and complexity only big plants can afford. Sentinel gives every facility live visibility from anywhere and instant danger alerts, while staying affordable and simple.");
  }

  // ---------- 9. Next steps (zig-zag timeline) ----------
  {
    const s = blueSlide();
    headline(s, "Next Steps", GREY);
    pageNo(s, 6, GREY);
    const steps = [
      ["PILOTS", "First partner\nfacilities"], ["ALERTS", "SMS & email\nnotifications"],
      ["MORE GASES", "Beyond CO2\nand H2"], ["SCALE", "Multi-site\naccounts"],
    ];
    const pts = steps.map((_, i) => [0.35 + i * 2.35, i % 2 ? 3.55 : 2.0]);
    for (let i = 0; i < 3; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const ax = x1 + 2.0, ay = y1 + 0.2, bx = x2, by = y2 + 0.2;
      s.addShape(pres.shapes.LINE, { x: ax, y: Math.min(ay, by), w: bx - ax, h: Math.abs(by - ay), flipV: by < ay, line: { color: GREY, width: 1 } });
    }
    steps.forEach((st, i) => {
      const [x, y] = pts[i];
      pill(s, st[0], x, y, 2.0, GREY, { h: 0.4, fontSize: 12 });
      T(s, st[1], { x, y: y + 0.5, w: 2.0, h: 0.55, fontSize: 11, color: "C9D6F0", align: "center", valign: "top" });
    });
    s.addNotes("(~25s) What's next: pilots with our first partner facilities, then SMS and email notifications, more gas types beyond CO2 and hydrogen, and multi-site accounts so one team can protect every location.");
  }

  // ---------- 10. The ask / close ----------
  {
    const s = greySlide();
    T(s, "Help Us Make Every\nFacility Safe.", { x: 0.35, y: 0.3, w: 8.4, h: 1.6, fontFace: HEAD, fontSize: 44, color: BLUE, charSpacing: -2.5, valign: "top", lineSpacingMultiple: 0.85 });
    T(s, "WE'RE LOOKING FOR", { x: 0.4, y: 1.95, w: 4, h: 0.3, fontSize: 11, bold: true, color: BLUE, charSpacing: 2 });
    const asks = [
      ["PILOT PARTNERS", "Breweries, labs and plants handling CO2 or H2"],
      ["SAFETY MENTORS", "Experts in industrial gas safety and standards"],
      ["INTRODUCTIONS", "To facility and safety managers you know"],
    ];
    asks.forEach((a, i) => {
      const y = 2.4 + i * 0.68;
      pill(s, a[0], 0.35, y, 1.75, BLUE, { h: 0.38, fontSize: 10.5, fill: i === 0 ? BLUE : undefined, textColor: i === 0 ? GREY : BLUE });
      T(s, a[1], { x: 2.25, y, w: 2.2, h: 0.5, fontSize: 10.5, color: BLUE, valign: "middle" });
    });
    s.addImage({ data: await framed(PHOTOS + "c6.jpg", 2.4, 3.0, "arch", { position: "top" }), x: 4.6, y: 2.35, w: 2.4, h: 3.0 });
    s.addImage({ data: await framed(PHOTOS + "c10.jpg", 2.4, 3.0, "arch"), x: 7.15, y: 2.35, w: 2.4, h: 3.0 });
    pill(s, "TEAM KOPISCRIPT", 0.35, 4.85, 1.95, BLUE, { h: 0.34, fontSize: 10, fill: BLUE, textColor: GREY });
    s.addNotes("(~25s) Here's how you can help. We're looking for pilot partners — breweries, labs and plants that handle CO2 or hydrogen and want to see their risks live. We're looking for mentors in industrial gas safety to help us meet the right standards. And if you know a facility or safety manager, we'd love an introduction. Let's make every facility safe. Thank you.");
  }

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();
