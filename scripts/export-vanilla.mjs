// Builds a plain HTML/CSS/JS copy of the site into ./vanilla — no React, no
// Next.js, no build step for whoever receives it. Open vanilla/index.html
// directly or serve the folder from any static host.
//
// How it stays identical to the real UI:
//   • HTML  — the pages Next.js pre-renders at build time (dist/server/app),
//             with React's scripts stripped and links rewritten to .html files.
//   • CSS   — the site's compiled stylesheet + self-hosted fonts, copied as is.
//   • JS    — scripts/vanilla-src/main.js re-implements every interaction
//             (same GSAP/Lenis libraries, copied from node_modules).
//   • Copy & icons the JS needs are generated from lib/home-new-content.ts and
//             lucide-react, so they can't drift from the React components.
//
// Usage:  npm run export:vanilla      (runs `next build` first)

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "vanilla");
const SRC = path.join(ROOT, "scripts", "vanilla-src");

const PAGES = [
  { file: "index.html", page: "home" },
  { file: "pricing.html", page: "pricing" },
  { file: "contact.html", page: "contact" },
  { file: "privacy-policy.html", page: "privacy" },
  { file: "login.html", page: "login" },
];

// Site routes → exported files.
const ROUTES = {
  "/": "index.html",
  "/pricing": "pricing.html",
  "/contact": "contact.html",
  "/privacy-policy": "privacy-policy.html",
  "/login": "login.html",
};

const log = (...a) => console.log("  ", ...a);
const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
const copy = (from, to) => {
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
};

if (!fs.existsSync(path.join(DIST, "server", "app", "index.html"))) {
  console.error("No build found in dist/. Run `npm run build` first (or `npm run export:vanilla`).");
  process.exit(1);
}

// Empty the folder rather than deleting it: on Windows a folder that is open in
// Explorer, a terminal or a dev server cannot be removed.
ensureDir(OUT);
for (const entry of fs.readdirSync(OUT)) fs.rmSync(path.join(OUT, entry), { recursive: true, force: true });
ensureDir(OUT);
console.log("Exporting vanilla site → vanilla/");

const assets = new Set(); // /home-new/... files referenced by the pages
let cssSource = null;

/** Maps a site URL to its path in the export (or null to leave it alone). */
function mapUrl(url) {
  if (/^\/_next\/static\/chunks\/[^"]+\.css$/.test(url)) {
    cssSource = url;
    return "assets/css/styles.css";
  }
  if (url.startsWith("/_next/static/media/")) return "assets/media/" + url.slice("/_next/static/media/".length);
  if (url.startsWith("/favicon.ico")) return "assets/favicon.ico";
  if (url === "/favicon.png") return "assets/favicon.png";
  if (url.startsWith("/home-new/")) {
    assets.add(url);
    return "assets" + url;
  }
  const [route, hash = ""] = url.split("#");
  if (route in ROUTES) return ROUTES[route] + (hash ? "#" + hash : "");
  return null;
}

for (const { file, page } of PAGES) {
  let html = fs.readFileSync(path.join(DIST, "server", "app", file), "utf8");

  html = html
    // React/Next runtime: scripts, script preloads, font preloads, size-adjust.
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<link\b[^>]*rel="preload"[^>]*>/g, "")
    .replace(/<meta name="next-size-adjust"[^>]*>/g, "")
    // React's empty text-node markers.
    .replace(/<!-- -->/g, "")
    .replace(/<!--\/?\$-->/g, "")
    // Rewrite every internal href/src.
    .replace(/\b(href|src)="(\/[^"]*)"/g, (m, attr, url) => {
      const mapped = mapUrl(url.replace(/&amp;/g, "&"));
      return mapped ? `${attr}="${mapped}"` : m;
    })
    // …and url(/…) inside inline styles (e.g. the announcement bar texture).
    .replace(/url\((&quot;|'|")?(\/home-new\/[^)"'&]+)(&quot;|'|")?\)/g, (m, q1 = "", url, q2 = "") => {
      const mapped = mapUrl(url);
      return mapped ? `url(${q1}${mapped}${q2})` : m;
    });

  const scripts = [
    "assets/js/gsap.min.js",
    "assets/js/ScrollTrigger.min.js",
    "assets/js/lenis.min.js",
    "assets/js/content.js",
    "assets/js/icons.js",
    "assets/js/main.js",
  ]
    .map((s) => `<script src="${s}" defer></script>`)
    .join("");

  html = html
    .replace("</head>", `<link rel="stylesheet" href="assets/css/vanilla.css"/></head>`)
    .replace(/<body([^>]*)>/, `<body$1 data-page="${page}">`)
    .replace("</body>", `${scripts}</body>`);

  fs.writeFileSync(path.join(OUT, file), html);
  log(file);
}

// CSS + fonts. The stylesheet references fonts as url(../media/…), which
// still resolves once it sits in assets/css next to assets/media.
if (!cssSource) throw new Error("No stylesheet found in the exported pages.");
copy(path.join(DIST, cssSource.replace(/^\/_next\//, "")), path.join(OUT, "assets/css/styles.css"));
for (const f of fs.readdirSync(path.join(DIST, "static", "media"))) {
  if (f.endsWith(".woff2")) copy(path.join(DIST, "static", "media", f), path.join(OUT, "assets/media", f));
}
copy(path.join(SRC, "vanilla.css"), path.join(OUT, "assets/css/vanilla.css"));
log("assets/css (styles.css, vanilla.css) + fonts");

// Favicons and the images/videos the pages reference.
copy(path.join(ROOT, "app", "favicon.ico"), path.join(OUT, "assets/favicon.ico"));
copy(path.join(ROOT, "public", "favicon.png"), path.join(OUT, "assets/favicon.png"));
// Referenced by main.js (login Google button is in the HTML; logo is reused).
["/home-new/icons/Layer_1-1.svg", "/home-new/icons/google.svg"].forEach((a) => assets.add(a));
let missing = 0;
for (const a of assets) {
  const from = path.join(ROOT, "public", a);
  if (fs.existsSync(from)) copy(from, path.join(OUT, "assets", a));
  else missing++;
}
log(`assets/home-new (${assets.size - missing} files${missing ? `, ${missing} referenced but not in public/ — e.g. feature videos not added yet` : ""})`);

// Vendor libraries — the same ones the React site uses.
copy(require.resolve("gsap/dist/gsap.min.js"), path.join(OUT, "assets/js/gsap.min.js"));
copy(require.resolve("gsap/dist/ScrollTrigger.min.js"), path.join(OUT, "assets/js/ScrollTrigger.min.js"));
copy(path.join(path.dirname(require.resolve("lenis")), "lenis.min.js"), path.join(OUT, "assets/js/lenis.min.js"));

// Copy text used by the interactive pieces, generated from the real content
// file (TypeScript → JS → JSON).
{
  const ts = require("typescript");
  const source = fs.readFileSync(path.join(ROOT, "lib", "home-new-content.ts"), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const mod = { exports: {} };
  new Function("module", "exports", outputText)(mod, mod.exports);
  const c = mod.exports;
  const content = {
    auth: c.AUTH,
    contact: { success: c.CONTACT_PAGE.success },
    newsletter: { success: c.FOOTER.cta.success },
    navLinks: c.NAV_LINKS,
  };
  fs.writeFileSync(
    path.join(OUT, "assets/js/content.js"),
    `// Generated from lib/home-new-content.ts by scripts/export-vanilla.mjs\nwindow.HELPPERR_CONTENT = ${JSON.stringify(content, null, 2)};\n`
  );
}

// Icons used by markup the JS builds (menu, modal, login steps…), rendered
// from lucide-react so they match the React components exactly.
{
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const lucide = require("lucide-react");
  const names = [
    "X", "Menu", "Check", "CircleCheck", "CircleAlert", "CircleX",
    "LoaderCircle", "AtSign", "MailCheck", "ArrowLeft", "ChevronDown",
  ];
  const icons = {};
  for (const n of names) icons[n] = renderToStaticMarkup(React.createElement(lucide[n], { size: 24 }));
  fs.writeFileSync(
    path.join(OUT, "assets/js/icons.js"),
    `// Generated from lucide-react by scripts/export-vanilla.mjs\nwindow.HELPPERR_ICONS = ${JSON.stringify(icons, null, 2)};\n`
  );
}

copy(path.join(SRC, "main.js"), path.join(OUT, "assets/js/main.js"));
fs.writeFileSync(
  path.join(OUT, "README.md"),
  `# Helpperr — static (vanilla) site

Plain HTML, CSS and JavaScript copy of the Helpperr website. No build step or
framework needed.

- Open \`index.html\` in a browser, or upload this whole folder to any static
  host (Netlify, GitHub Pages, S3, a plain web server…).
- Pages: \`index.html\` (home), \`pricing.html\`, \`contact.html\`,
  \`privacy-policy.html\`, \`login.html\`.
- \`assets/css/styles.css\` is the site's stylesheet; \`assets/js/main.js\` runs
  all interactions (menu, FAQ, pricing seats, modals, forms, login flow,
  animations) using GSAP and Lenis, included locally in \`assets/js\`.

Forms and the login flow are front-end only (no backend), exactly like the
main site: they show their confirmation states but don't send anything.

This folder is generated — don't edit it by hand. In the main project run
\`npm run export:vanilla\` to regenerate it after changing the site.
`
);
log("assets/js (main.js, content.js, icons.js, gsap, ScrollTrigger, lenis), README.md");
console.log("Done.");
