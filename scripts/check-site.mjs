import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import assert from "node:assert/strict";
import { checkCadModel } from "./check-cad-model.mjs";
const origin = (
  process.env.VITE_SITE_ORIGIN ||
  "https://josiah-design-portfolio.henrydegrasse.chatgpt.site"
).replace(/\/$/, "");
const base = (process.env.VITE_SITE_BASE || "/").replace(/\/$/, "");
const localPath = (path) => {
  assert.ok(
    !base || path === base || path.startsWith(base + "/"),
    `Unprefixed local URL: ${path}`,
  );
  return base ? path.slice(base.length) || "/" : path;
};
const routes = [
  "/",
  "/work/nfi",
  "/work/red-hat",
  "/about",
  "/resume",
  "/work/headtap",
  "/work/lacrosse",
  "/work/moka-pot",
  "/work/helfrich",
];
let links = 0,
  images = 0;
const exists = async (path) => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};
for (const route of routes) {
  const file = join("dist", route, "index.html");
  const html = await readFile(file, "utf8");
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${route}: exactly one h1`,
  );
  assert.ok(html.includes('<meta name="description"'), `${route}: description`);
  assert.ok(
    html.includes(`<link rel="canonical" href="${origin}${base}${route}"`),
    `${route}: canonical`,
  );
  assert.ok(
    !html.includes("fetchPriority"),
    `${route}: no unsupported React attribute`,
  );
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    const src = tag[0].match(/src="([^"]+)"/)?.[1];
    assert.ok(tag[0].includes('alt="'), `${route}: image alt`);
    if (src?.startsWith("/")) {
      assert.ok(
        await exists(join("dist", localPath(src))),
        `${route}: missing ${src}`,
      );
      images++;
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = match[1];
    assert.ok(
      !/^\/(?:portfolio\/)?play(?:[/?#]|$)/.test(href),
      `${route}: retired game link`,
    );
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const [pathname, hash] = href.split("#");
    const targetPath = (pathname ? localPath(pathname) : route).split("?")[0];
    const direct = join("dist", targetPath);
    const target = (await exists(direct)) ? direct : join(direct, "index.html");
    assert.ok(await exists(target), `${route}: broken link ${href}`);
    links++;
    if (hash && target.endsWith(".html"))
      assert.ok(
        (await readFile(target, "utf8")).includes(`id="${hash}"`),
        `${route}: missing anchor ${href}`,
      );
  }
  for (const match of html.matchAll(
    /<meta [^>]*(?:property="og:image"|name="twitter:image")[^>]*content="([^"]+)"/g,
  )) {
    const imagePath = localPath(new URL(match[1]).pathname);
    assert.ok(
      await exists(join("dist", imagePath)),
      `${route}: missing social image`,
    );
  }
}
const homeHtml = await readFile("dist/index.html", "utf8");
for (const match of homeHtml.matchAll(
  /<(?:script|link)\b[^>]*(?:src|href)="(\/[^\"]+)"/g,
)) {
  assert.ok(
    await exists(join("dist", localPath(match[1]))),
    `Missing build resource: ${match[1]}`,
  );
}
assert.ok(await exists("dist/josiah-degrasse-design-resume.pdf"));
assert.ok(await exists("dist/sitemap.xml"));
assert.ok(await exists("dist/404.html"));
for (const retired of ["/play", "/portfolio/play"]) {
  for (const file of [
    join("dist", retired, "index.html"),
    join("dist", retired + ".html"),
  ]) {
    const html = await readFile(file, "utf8");
    assert.ok(
      html.includes('data-route="/"'),
      `${retired}: prerendered portfolio recovery`,
    );
    assert.ok(
      html.includes('id="home-title"'),
      `${retired}: usable without JavaScript`,
    );
  }
}
const manifest = JSON.parse(await readFile("package.json", "utf8"));
const model = await checkCadModel();
assert.ok(await exists("dist/drawings/lacrosse-head.pdf"));
assert.ok(
  !manifest.dependencies.three && !manifest.devDependencies["@types/three"],
  "Three.js removed from dependencies",
);
console.log(
  `Validated ${routes.length} prerendered pages, ${links} internal links, ${images} image references, ${model.triangles} CAD triangles, résumé, social metadata, sitemap and 404.`,
);
