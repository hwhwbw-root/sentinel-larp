// Sentinel pitch in the mIQrotech deck format (white, one accent, running tagline, one idea per slide).
// Compressed to 9 slides / ~5 minutes. No pricing.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");

const ASSETS = "C:/Users/User/OneDrive/Documents/sentinel/canva-bunting-assets/";
const OUT = process.argv[2] || "Sentinel-Pitch-5min.pptx";

const C = {
  accent: "2F6FED", accentSoft: "E8EFFD", ink: "27272A", muted: "71717A", faint: "A1A1AA",
  rule: "D4D4D8", white: "FFFFFF", red: "DC2626", ph: "B45309",
};
const B = "Arial";
const TAGLINE = "SOME DANGERS YOU CAN'T SEE.";

async function icon(name, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(lu[name], { color: "#" + color, size: String(size) }));
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
}
async function img(path, opts = {}) {
  let s = sharp(ASSETS + path);
  if (opts.extract) s = s.extract(opts.extract);
  if (opts.width) s = s.resize({ width: opts.width });
  return "image/png;base64," + (await s.png().toBuffer()).toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625
  pres.title = "Sentinel — Pitch";

  const lockup = await img("02_wordmarks/sentinel-lockup-horizontal-dark.png", { width: 600 });
  const lockupBig = await img("02_wordmarks/sentinel-lockup-horizontal-dark.png", { width: 2000 });
  const dash = await img("08_real_project_screenshots/sentinel-real-dashboard-desktop.png", {
    extract: { left: 0, top: 0, width: 3840, height: 1560 }, width: 2400,
  });
  const LOCK_AR = 271 / 2000;

  const T = (slide, text, o) => slide.addText(text, { isTextBox: true, fontFace: B, margin: 0, ...o });
  const rule = (slide, y, x = 0.5, w = 9) =>
    slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: C.rule, width: 0.75 } });

  // Shared frame: running tagline + rule on top, section title, logo bottom-right
  const frame = (slide, section) => {
    slide.background = { color: C.white };
    T(slide, TAGLINE, { x: 0.5, y: 0.22, w: 6, h: 0.22, fontSize: 9, color: C.muted, charSpacing: 1 });
    rule(slide, 0.5);
    if (section) T(slide, section, { x: 0.5, y: 0.68, w: 9, h: 0.42, fontSize: 20, bold: true, color: C.accent, charSpacing: 1 });
    slide.addImage({ data: lockup, x: 8.15, y: 5.2, w: 1.35, h: 1.35 * LOCK_AR });
  };
  const iconAt = async (slide, name, x, y, d, color = C.accent) =>
    slide.addImage({ data: await icon(name, color), x, y, w: d, h: d });

  // ---------- 1. Title ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addImage({ data: lockupBig, x: 1.75, y: 1.75, w: 6.5, h: 6.5 * LOCK_AR });
    rule(s, 2.95, 1.0, 8.0);
    T(s, "SEE THE DANGER BEFORE IT SPREADS.", { x: 0.5, y: 3.15, w: 9, h: 0.45, fontSize: 20, bold: true, color: C.accent, align: "center", charSpacing: 1 });
    s.addNotes("(~20s) We're Sentinel. Our mission: see the danger before it spreads — real-time gas monitoring for every facility that handles dangerous gas.");
  }

  // ---------- 2. The problem (stacked infographic, like mIQrotech's) ----------
  {
    const s = pres.addSlide();
    frame(s, "THE PROBLEM");
    T(s, [
      { text: "Every day, facilities handle gases that are ", options: { color: C.ink } },
      { text: "invisible and odourless.", options: { color: C.accent, bold: true } },
    ], { x: 0.5, y: 1.15, w: 9, h: 0.4, fontSize: 16, align: "center" });
    const rows = [
      ["LuEyeOff", C.accent, "You can't see, smell or hear", "a CO2 or hydrogen leak."],
      ["LuFlame", C.red, "Hydrogen ignites at just", "4% in air."],
      ["LuSkull", C.red, "CO2 at 40,000 ppm is", "immediately dangerous to life."],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.75 + i * 0.95;
      await iconAt(s, rows[i][0], 1.9, y, 0.6, rows[i][1]);
      T(s, [
        { text: rows[i][2] + " ", options: { color: C.ink } },
        { text: rows[i][3], options: { color: rows[i][1], bold: true } },
      ], { x: 2.7, y, w: 6.8, h: 0.6, fontSize: 16, valign: "middle" });
    }
    T(s, "WITHOUT MONITORING, YOU FIND OUT TOO LATE.", { x: 0.5, y: 4.6, w: 9, h: 0.45, fontSize: 20, bold: true, color: C.accent, align: "center" });
    s.addNotes("(~40s) The problem: every day, breweries, factories, labs and hydrogen sites handle gases you cannot see, smell or hear. Hydrogen ignites at just four percent in air. CO2 at forty thousand ppm is immediately dangerous to life. Without monitoring, the first sign of a leak is often someone getting hurt.");
  }

  // ---------- 3. The environment ----------
  {
    const s = pres.addSlide();
    frame(s, "THE ENVIRONMENT");
    const places = [
      ["LuFactory", "Factories"], ["LuBeer", "Breweries"], ["LuFuel", "Hydrogen sites"],
      ["LuMicroscope", "Labs"], ["LuSnowflake", "Cold storage"],
    ];
    const d = 1.35, gap = 0.4, start = (10 - (5 * d + 4 * gap)) / 2;
    for (let i = 0; i < 5; i++) {
      const x = start + i * (d + gap);
      s.addShape(pres.shapes.OVAL, { x, y: 1.55, w: d, h: d, fill: { color: C.accentSoft }, line: { color: C.accentSoft } });
      await iconAt(s, places[i][0], x + d * 0.3, 1.55 + d * 0.3, d * 0.4);
      T(s, places[i][1], { x: x - 0.2, y: 3.05, w: d + 0.4, h: 0.35, fontSize: 13, bold: true, color: C.ink, align: "center" });
    }
    T(s, [
      { text: "Most rely on a detector that only beeps ", options: { color: C.ink } },
      { text: "on site", options: { color: C.accent, bold: true } },
      { text: " — if nobody is there, ", options: { color: C.ink } },
      { text: "nobody knows.", options: { color: C.red, bold: true } },
    ], { x: 0.5, y: 4.0, w: 9, h: 0.5, fontSize: 17, align: "center" });
    s.addNotes("(~30s) Where does this happen? Factories, breweries, hydrogen sites, labs, cold storage. Most of them rely on a detector that only beeps on site. At night, on a weekend, in a back room — if nobody is there, nobody knows.");
  }

  // ---------- 4. The solution (device + brace + variables, like mIQrotech's) ----------
  {
    const s = pres.addSlide();
    frame(s, "THE SOLUTION");
    await iconAt(s, "LuCpu", 1.05, 1.5, 1.1);
    T(s, "ALL-IN-ONE SENSOR", { x: 0.4, y: 2.75, w: 2.4, h: 0.35, fontSize: 13, bold: true, color: C.accent, align: "center" });
    T(s, "Mounts on the wall and streams readings to the cloud.", { x: 0.55, y: 3.12, w: 2.1, h: 0.75, fontSize: 11, color: C.muted, align: "center", valign: "top" });
    // brace
    T(s, "{", { x: 3.0, y: 1.2, w: 0.8, h: 2.9, fontSize: 150, color: C.rule, align: "center", valign: "middle" });
    T(s, "MEASURES", { x: 3.95, y: 1.3, w: 2.4, h: 0.35, fontSize: 14, bold: true, color: C.accent });
    const vars = [["LuWind", "CO2 or Hydrogen (H2)"], ["LuThermometer", "Temperature"], ["LuDroplets", "Humidity"], ["LuTimer", "Every ~10 seconds"]];
    for (let i = 0; i < vars.length; i++) {
      const y = 1.8 + i * 0.55;
      await iconAt(s, vars[i][0], 3.95, y + 0.04, 0.3);
      T(s, vars[i][1], { x: 4.4, y, w: 2.2, h: 0.38, fontSize: 13, color: C.ink, valign: "middle" });
    }
    T(s, "}", { x: 6.35, y: 1.2, w: 0.8, h: 2.9, fontSize: 150, color: C.rule, align: "center", valign: "middle" });
    await iconAt(s, "LuKeyRound", 7.75, 1.55, 0.9);
    T(s, "SECURE BY DESIGN", { x: 7.15, y: 2.65, w: 2.2, h: 0.35, fontSize: 13, bold: true, color: C.accent, align: "center" });
    T(s, "Every device has its own secure key.", { x: 7.2, y: 3.05, w: 2.1, h: 0.6, fontSize: 11, color: C.muted, align: "center", valign: "top" });
    s.addNotes("(~35s) Our solution: an all-in-one Sentinel sensor box. It mounts on the wall and measures CO2 or hydrogen, plus temperature and humidity, every ten seconds — streaming it all to the cloud. Every device has its own secure key, so the system can't be spoofed with one shared password.");
  }

  // ---------- 5. The live data ----------
  {
    const s = pres.addSlide();
    frame(s, "THE LIVE DATA");
    const dw = 7.2, dh = dw * 1560 / 3840;
    s.addImage({ data: dash, x: (10 - dw) / 2, y: 1.2, w: dw, h: dh, line: { color: C.rule, width: 0.75 } });
    T(s, [
      { text: "When a reading crosses the danger line, the dashboard turns ", options: { color: C.ink } },
      { text: "red instantly", options: { color: C.red, bold: true } },
      { text: " — on any browser, anywhere.", options: { color: C.ink } },
    ], { x: 0.5, y: 1.2 + dh + 0.2, w: 9, h: 0.45, fontSize: 14, align: "center" });
    s.addNotes("(~35s) This is the live product. Every sensor's readings in real time, trends over time, and on the right, real danger alerts. The moment a reading crosses the threshold you set, it turns red — and anyone with access sees it, wherever they are.");
  }

  // ---------- 6. Big statement ----------
  {
    const s = pres.addSlide();
    frame(s, null);
    T(s, "OUR SENSORS CHECK THE AIR", { x: 0.5, y: 1.85, w: 9, h: 0.5, fontSize: 22, color: C.muted, align: "center" });
    T(s, "EVERY 10 SECONDS.", { x: 0.5, y: 2.35, w: 9, h: 1.1, fontSize: 60, bold: true, color: C.accent, align: "center" });
    T(s, "24 hours a day. Whether anyone is on site or not.", { x: 0.5, y: 3.55, w: 9, h: 0.4, fontSize: 16, color: C.ink, align: "center" });
    s.addNotes("(~20s) Our sensors check the air every ten seconds. Twenty-four hours a day. Whether anyone is on site or not. (Pause.)");
  }

  // ---------- 7. The substitutes (check-mark table, like mIQrotech's) ----------
  {
    const s = pres.addSlide();
    frame(s, "THE SUBSTITUTES");
    const cols = ["Remote\nvisibility", "Instant\ndanger alert", "Reading\nhistory", "Affordable\nfor SMEs", "Easy to\ninstall"];
    const rows = [
      ["Manual checks", [0, 0, 0, 1, 1]],
      ["Standalone detectors", [0, 1, 0, 1, 1]],
      ["Enterprise control systems", [1, 1, 1, 0, 0]],
      ["Sentinel", [1, 1, 1, 1, 1]],
    ];
    const x0 = 3.6, cw = 1.18, y0 = 1.25;
    cols.forEach((c, j) => T(s, c, { x: x0 + j * cw, y: y0, w: cw, h: 0.6, fontSize: 11, bold: true, color: C.muted, align: "center", valign: "bottom" }));
    const check = await icon("LuCircleCheck", C.accent), checkGrey = await icon("LuCircleCheck", "A1A1AA"), cross = await icon("LuX", "D4D4D8");
    for (let i = 0; i < rows.length; i++) {
      const y = 2.05 + i * 0.68, me = i === rows.length - 1;
      if (me) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: y - 0.1, w: 9, h: 0.6, rectRadius: 0.1, fill: { color: C.accentSoft }, line: { color: C.accentSoft } });
      else rule(s, y + 0.55);
      T(s, rows[i][0], { x: 0.7, y, w: 2.8, h: 0.4, fontSize: me ? 16 : 14, bold: me, color: me ? C.accent : C.ink, valign: "middle" });
      rows[i][1].forEach((v, j) => s.addImage({ data: v ? (me ? check : checkGrey) : cross, x: x0 + j * cw + cw / 2 - 0.16, y: y + 0.04, w: 0.32, h: 0.32 }));
    }
    s.addNotes("(~35s) We don't have competition so much as substitutes. Manual checks are cheap but blind. Standalone detectors alarm locally, but nobody off-site knows and nothing is recorded. Enterprise control systems do it all — at a price and complexity only big plants can afford. Sentinel is the only option that ticks every box for the facilities in between.");
  }

  // ---------- 8. The next steps ----------
  {
    const s = pres.addSlide();
    frame(s, "THE NEXT STEPS");
    T(s, "Focus on three things:", { x: 0.5, y: 1.25, w: 9, h: 0.4, fontSize: 16, color: C.ink });
    const steps = [
      ["LuHardHat", "PILOTS", "Install Sentinel at our first partner facilities."],
      ["LuBellRing", "PRODUCT", "SMS & email alerts, and more gas types."],
      ["LuUsers", "PEOPLE", "Grow the team to install and support customers."],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.5 + i * 3.1;
      await iconAt(s, steps[i][0], x, 1.95, 0.7);
      T(s, steps[i][1], { x, y: 2.85, w: 2.8, h: 0.4, fontSize: 20, bold: true, color: C.accent });
      T(s, steps[i][2], { x, y: 3.3, w: 2.7, h: 0.8, fontSize: 13, color: C.ink, valign: "top" });
    }
    s.addNotes("(~30s) Next, we're focused on three things. Pilots — getting Sentinel into our first partner facilities. Product — adding SMS and email alerts and more gas types. And people — growing the team to install and support customers.");
  }

  // ---------- 9. Contact ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    s.addImage({ data: lockupBig, x: 2.25, y: 1.3, w: 5.5, h: 5.5 * LOCK_AR });
    rule(s, 2.35, 1.0, 8.0);
    const contacts = [["LuGlobe", "[website]"], ["LuMail", "[email]"], ["LuPhone", "[phone]"]];
    for (let i = 0; i < 3; i++) {
      const x = 1.2 + i * 2.7;
      await iconAt(s, contacts[i][0], x, 2.62, 0.32, C.ink);
      T(s, contacts[i][1], { x: x + 0.45, y: 2.6, w: 2.0, h: 0.36, fontSize: 13, color: C.ph, valign: "middle" });
    }
    T(s, "LET'S MAKE EVERY FACILITY SAFE.", { x: 0.5, y: 3.4, w: 9, h: 0.45, fontSize: 20, bold: true, color: C.accent, align: "center" });
    s.addNotes("(~15s) Gas leaks don't announce themselves. Let's make every facility safe. Thank you.");
  }

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();
