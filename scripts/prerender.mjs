import { createServer } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

const server = await createServer({
  configFile: false,
  cacheDir: "node_modules/.vite-prerender",
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const home = await server.ssrLoadModule("/src/design-home.tsx");
  const cases = await server.ssrLoadModule("/src/design-case-studies.tsx");
  const other = await server.ssrLoadModule("/src/design-about.tsx");
  const origin = "https://josiah-design-portfolio.henrydegrasse.chatgpt.site";
  const routes = [
    [
      "/",
      home.DesignHome,
      {},
      "Josiah deGrasse — AI Engineer · Human Factors",
      "I build AI-assisted products that connect evidence, explain decisions, and keep people in control. Selected design work by Josiah deGrasse.",
      "/images/portfolio-preview.png",
    ],
    [
      "/work/nfi",
      cases.NfiCaseStudy,
      {},
      "Designing an AI-assisted decision system for food scientists — Josiah deGrasse",
      "New Food Innovation: Human Factors, AI-assisted workflows, and evidence-based decision support.",
      "/images/nfi/nfi-sensory-profile.png",
    ],
    [
      "/work/red-hat",
      cases.RedHatCaseStudy,
      {},
      "Red Hat OpenShift AI — Making deployments easier to debug — Josiah deGrasse",
      "A Tufts capstone with Red Hat: eight discovery interviews, two feedback rounds, and prototypes for diagnostics, YAML review, and editable hardware presets.",
      "/images/red-hat/capstone-deployments.png",
    ],
    [
      "/about",
      other.AboutPage,
      {},
      "About Josiah — Josiah deGrasse",
      "Human Factors, AI product design, and a maker’s curiosity.",
      "/images/lacrosse/lacrosse-action.webp",
    ],
    [
      "/resume",
      other.ResumePage,
      {},
      "Résumé — Josiah deGrasse",
      "AI Engineer · Human Factors",
    ],
    [
      "/work/headtap",
      other.SecondaryProject,
      { id: "headtap" },
      "HeadTap — Josiah deGrasse",
      "Music discovery designed around taste, time, and place.",
    ],
    [
      "/work/lacrosse",
      other.SecondaryProject,
      { id: "lacrosse" },
      "Made for the field — Josiah deGrasse",
      "Physical design, teamwork, and a maker’s perspective.",
      "/images/lacrosse/lacrosse-head-cad.webp",
    ],
    [
      "/work/helfrich",
      other.SecondaryProject,
      { id: "helfrich" },
      "Helfrich Brothers — Josiah deGrasse",
      "Precision and clear communication on the factory floor.",
    ],
  ];
  const template = await readFile("dist/index.html", "utf8");
  if (!template.includes('<div id="root"></div>'))
    throw new Error("Run the Vite build before prerendering.");
  const escape = (s) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  for (const [path, Component, props, title, description, image] of routes) {
    let html = template
      .replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
      .replace(
        /\s*<meta\s+(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g,
        "",
      )
      .replace(
        /<link\s+rel="canonical"[^>]*>/,
        `<link rel="canonical" href="${origin}${path}" />`,
      );
    const head = `<meta name="description" content="${escape(description)}"/><meta property="og:type" content="website"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(description)}"/><meta property="og:url" content="${origin}${path}"/><meta name="twitter:title" content="${escape(title)}"/><meta name="twitter:description" content="${escape(description)}"/><meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}"/>${image ? `<meta property="og:image" content="${origin}${image}"/><meta name="twitter:image" content="${origin}${image}"/>` : ""}`;
    html = html
      .replace("</head>", `${head}</head>`)
      .replace(
        '<div id="root"></div>',
        `<div id="root" data-route="${path}">${renderToString(createElement(Component, props))}</div>`,
      );
    const dest = join("dist", path, "index.html");
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, html);
    if (path !== "/") await writeFile(join("dist", path + ".html"), html);
  }
  // Existing deep links render the new editorial pages; canonical stays on /work.
  for (const [old, newPath] of [
    ["/portfolio", "/"],
    ["/portfolio/case-studies", "/"],
    ["/work", "/"],
    ["/play", "/"],
    ["/portfolio/play", "/"],
    ["/portfolio/about", "/about"],
    ...["nfi", "red-hat", "headtap", "lacrosse", "helfrich"].map((id) => [
      `/portfolio/projects/${id}`,
      `/work/${id}`,
    ]),
  ]) {
    const dest = join("dist", old, "index.html");
    await mkdir(dirname(dest), { recursive: true });
    const aliasHtml = await readFile(
      join("dist", newPath, "index.html"),
      "utf8",
    );
    await writeFile(dest, aliasHtml);
    await writeFile(join("dist", old + ".html"), aliasHtml);
  }
  // Static 404 with an accessible recovery path.
  const notFound = template
    .replace(
      /<title>.*?<\/title>/s,
      "<title>Page not found — Josiah deGrasse</title>",
    )
    .replace("</head>", '<meta name="robots" content="noindex,follow"/></head>')
    .replace(
      '<div id="root"></div>',
      `<div id="root" data-route="404">${renderToString(createElement(other.NotFound))}</div>`,
    );
  await writeFile("dist/404.html", notFound);
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([p]) => `<url><loc>${origin}${p}</loc></url>`).join("")}</urlset>`,
  );
  console.log(
    `Prerendered ${routes.length} portfolio pages, legacy aliases, and 404.`,
  );
} finally {
  await server.close();
}
