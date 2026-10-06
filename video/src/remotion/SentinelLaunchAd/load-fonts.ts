import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// @remotion/fonts (not next/font — this bundle renders outside Next's request
// lifecycle) delays the render until the variable font file is actually parsed,
// so text never captures a frame in the fallback face during Lambda encoding.
export const satoshiLoaded = loadFont({
  family: "Satoshi",
  url: staticFile("fonts/Satoshi-Variable.woff2"),
  weight: "400 900",
  style: "normal",
});
