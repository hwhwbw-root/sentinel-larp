// Sentinel — short sales pitch (5 min, 5 slides). Why it matters + sell the product. No pricing.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");

const ASSETS = "C:/Users/User/OneDrive/Documents/sentinel/canva-bunting-assets/";
const OUT = process.argv[2] || "Sentinel-Sales-Pitch.pptx";

const C = {
  navy: "0B1530", navy2: "16244A", blue: "2F6FED", blueLt: "7FA5F5", blueSoft: "E8EFFD",
  ink: "18181B", muted: "71717A", pale: "C9D6F5", card: "F4F6FA", white: "FFFFFF",
  red: "DC2626", redLt: "F87171", redSoft: "FDECEC", ph: "FBBF24",
};
const B = "Arial";

async function icon(name, color = "FFFFFF", size = 256) {
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
  pres.title = "Sentinel — Gas safety you can see";

  const logoWhite = await img("01_logos/sentinel-shield-white.png", { width: 400 });
  const wordWhite = await img("02_wordmarks/sentinel-wordmark-white.png", { width: 1200 });
  const dash = await img("08_real_project_screenshots/sentinel-real-dashboard-desktop.png", {
    extract: { left: 0, top: 0, width: 3840, height: 1560 }, width: 2400,
  });

  const T = (slide, text, o) => slide.addText(text, { isTextBox: true, fontFace: B, margin: 0, ...o });
  const shadow = () => ({ type: "outer", color: "000000", blur: 14, offset: 4, angle: 90, opacity: 0.12 });
  const card = (slide, x, y, w, h, fill) =>
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.18, fill: { color: fill }, line: { color: fill } });
  const bubble = async (slide, name, x, y, d, bg, fg = "FFFFFF") => {
    slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
    const p = d * 0.25;
    slide.addImage({ data: await icon(name, fg), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  };
  const kicker = (slide, text, color) =>
    T(slide, text.toUpperCase(), { x: 0.5, y: 0.3, w: 9, h: 0.3, fontSize: 11, bold: true, color, charSpacing: 2 });

  // ---------- 1. Title ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    s.addImage({ data: logoWhite, x: 0.5, y: 0.6, w: 0.75, h: 0.75 });
    s.addImage({ data: wordWhite, x: 0.5, y: 1.8, w: 4.6, h: 4.6 * 311 / 2000 });
    T(s, "Some dangers you can't see.", { x: 0.5, y: 2.8, w: 7, h: 0.6, fontSize: 28, bold: true, color: C.white });
    T(s, "Real-time gas monitoring that warns you the moment it matters.", { x: 0.5, y: 3.45, w: 7, h: 0.5, fontSize: 17, color: C.pale });
    [[1.9, 85], [1.0, 65], [0.36, 0]].forEach(([d, t]) => {
      s.addShape(pres.shapes.OVAL, { x: 8.55 - d / 2, y: 2.35 - d / 2, w: d, h: d, fill: { color: C.red, transparency: t }, line: { color: C.red, transparency: t ? 70 : 0, width: 1 } });
    });
    s.addNotes("(~30s) Hi, we're Sentinel. Some of the most dangerous things in a facility are the ones you can't see — and that's exactly the problem we solve.");
  }

  // ---------- 2. Why it matters ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "Why it matters", C.red);
    T(s, "No gas monitoring? You're working blind.", { x: 0.5, y: 0.65, w: 9, h: 0.65, fontSize: 28, bold: true, color: C.ink });
    const risks = [
      ["LuEyeOff", "You can't sense it", "CO2 and hydrogen have no colour and no smell. By the time someone feels unwell, it's already too late."],
      ["LuFlame", "It can explode", "Hydrogen ignites at just 4% in air — and its flame is almost invisible in daylight."],
      ["LuSkull", "It can kill", "High CO2 pushes out oxygen. At 40,000 ppm it is immediately dangerous to life."],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.5 + i * 3.05;
      card(s, x, 1.6, 2.85, 2.65, C.redSoft);
      await bubble(s, risks[i][0], x + 0.3, 1.88, 0.6, C.red);
      T(s, risks[i][1], { x: x + 0.3, y: 2.65, w: 2.3, h: 0.4, fontSize: 18, bold: true, color: C.ink });
      T(s, risks[i][2], { x: x + 0.3, y: 3.08, w: 2.3, h: 1.1, fontSize: 12.5, color: C.muted, valign: "top" });
    }
    T(s, [
      { text: "Without monitoring, a leak is only discovered ", options: { color: C.ink } },
      { text: "when someone gets hurt.", options: { color: C.red, bold: true } },
    ], { x: 0.5, y: 4.55, w: 9, h: 0.45, fontSize: 18 });
    s.addNotes("(~75s) A facility without gas monitoring is working blind. CO2 and hydrogen have no colour and no smell — you cannot sense a leak until your body tells you, and by then it's too late. Hydrogen ignites at just four percent in air, and its flame is almost invisible. CO2 displaces oxygen — at forty thousand parts per million it's immediately dangerous to life. Breweries, factories, labs, cold storage and hydrogen sites all handle these gases every day. Without monitoring, the only alarm is a person getting hurt.");
  }

  // ---------- 3. Sentinel ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    kicker(s, "Meet Sentinel", C.blue);
    T(s, "See every gas risk, live, from anywhere.", { x: 0.5, y: 0.65, w: 9, h: 0.65, fontSize: 28, bold: true, color: C.ink });
    const dw = 5.9, dh = dw * 1560 / 3840;
    card(s, 0.5, 1.55, dw + 0.24, dh + 0.24, C.card);
    s.addImage({ data: dash, x: 0.62, y: 1.67, w: dw, h: dh, shadow: shadow() });
    const steps = [
      ["LuCpu", "Sense", "A Sentinel box reads CO2 or H2 every ~10 seconds."],
      ["LuTriangleAlert", "Alert", "Cross the danger line and it turns red instantly."],
      ["LuMonitorSmartphone", "See", "Every site, live, in any browser — on site or off."],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 1.55 + i * 1.12;
      await bubble(s, steps[i][0], 6.95, y, 0.5, i === 1 ? C.red : C.blue);
      T(s, steps[i][1], { x: 7.6, y: y - 0.02, w: 1.9, h: 0.35, fontSize: 16, bold: true, color: C.ink });
      T(s, steps[i][2], { x: 7.6, y: y + 0.33, w: 1.9, h: 0.75, fontSize: 11, color: C.muted, valign: "top" });
    }
    T(s, "Live product — not a mockup", { x: 0.5, y: 1.55 + dh + 0.35, w: dw + 0.24, h: 0.3, fontSize: 10.5, italic: true, color: C.muted, align: "center" });
    s.addNotes("(~60s) That's why we built Sentinel. A small sensor box on the wall reads CO2 or hydrogen every ten seconds. The moment a reading crosses the danger line, it's flagged red on the dashboard. And managers can see every site live, from any browser — whether they're on the floor or at home. This is the real, running product, not a mockup.");
  }

  // ---------- 4. Why Sentinel ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    kicker(s, "Why Sentinel", C.blueLt);
    T(s, "Big-facility safety, made for every facility.", { x: 0.5, y: 0.65, w: 9, h: 0.65, fontSize: 28, bold: true, color: C.white });
    const why = [
      ["LuTimer", "Seconds, not hours", "Danger shows up on screen within seconds — not after someone reports it."],
      ["LuGlobe", "Watch from anywhere", "One dashboard for every site. No control room needed."],
      ["LuFlaskConical", "CO2 and hydrogen", "Ready for today's industry and the coming hydrogen economy."],
      ["LuLock", "Secure & simple", "Every device has its own secure key. Plug in, connect, protected."],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 0.5 + (i % 2) * 4.6, y = 1.6 + Math.floor(i / 2) * 1.75;
      card(s, x, y, 4.4, 1.55, C.navy2);
      await bubble(s, why[i][0], x + 0.3, y + 0.3, 0.6, C.blue);
      T(s, why[i][1], { x: x + 1.15, y: y + 0.28, w: 3.0, h: 0.4, fontSize: 17, bold: true, color: C.white });
      T(s, why[i][2], { x: x + 1.15, y: y + 0.7, w: 3.0, h: 0.75, fontSize: 12.5, color: C.pale, valign: "top" });
    }
    s.addNotes("(~60s) Why Sentinel? Speed — danger is on screen in seconds, not discovered hours later. Reach — one dashboard covers every site, no control room needed. Coverage — CO2 today, and hydrogen as that industry grows. And it's secure and simple to deploy. The kind of safety that used to be reserved for the biggest plants, built for every facility.");
  }

  // ---------- 5. Close ----------
  {
    const s = pres.addSlide();
    s.background = { color: C.navy };
    T(s, "Don't wait for the leak.", { x: 0.5, y: 1.3, w: 9, h: 0.8, fontSize: 40, bold: true, color: C.white, align: "center" });
    T(s, "Make every facility's invisible risks visible — with Sentinel.", { x: 0.5, y: 2.15, w: 9, h: 0.5, fontSize: 18, color: C.pale, align: "center" });
    s.addImage({ data: logoWhite, x: 4.6, y: 3.05, w: 0.8, h: 0.8 });
    T(s, "[email]  ·  [website]", { x: 2, y: 4.1, w: 6, h: 0.3, fontSize: 13, color: C.ph, align: "center" });
    s.addNotes("(~30s) Gas leaks don't announce themselves. Don't wait for one to find out you were blind. Sentinel makes the invisible visible. Thank you — we'd love to talk.");
  }

  await pres.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();
