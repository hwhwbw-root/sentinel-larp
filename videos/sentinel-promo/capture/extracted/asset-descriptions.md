# Asset Descriptions

⚠️  No vision credentials — descriptions below are catalog-derived (alt text, headings, section context, filename) instead of Vision-generated. To get richer Vision descriptions on the next capture, set GEMINI_API_KEY (or GOOGLE_API_KEY), or HYPERFRAMES_VERTEX_PROJECT_ID plus HYPERFRAMES_VERTEX_SERVICE_ACCOUNT for Vertex service-account auth, and re-run.

The `logo-<hash>.svg` filename prefix is a structural hint (DOM said this SVG was inside a `<header>`, home-link `<a>`, or had an aria-label matching the page brand). To pick the actual brand logo without Vision, open the `logo-*` candidates in a previewer or rasterize them with `sharp` before referencing — composing a fake logo ships off-brand in the final video.

- svgs/svg-b37b51f5.svg — password-field eye icon (lucide-eye), decorative only
- svgs/svg-d9b653fc.svg — decorative sensor-network graph from the login page (7 pulsing nodes, brand-blue #2f6fed connecting lines) — good hook/social-proof motif for "every sensor, connected"
- sentinel-logo.svg — **the real Sentinel brand mark** (shield outline, blue #2f6fed, dot-and-stem sensor glyph at center). Not reachable by the automated crawler (behind auth); pulled directly from `public/branding/sentinel-logo.svg` in the app source. Use for Product_Intro / Brand_Outro / CTA lockups.
