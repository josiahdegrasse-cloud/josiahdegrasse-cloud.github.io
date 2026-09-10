import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import assert from "node:assert/strict";
const routes = [
  "/",
  "/work/nfi",
  "/work/red-hat",
  "/about",
  "/resume",
  "/work/headtap",
  "/work/lacrosse",
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
    html.includes(
      `<link rel="canonical" href="https://josiah-design-portfolio.henrydegrasse.chatgpt.site${route}"`,
    ),
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
      assert.ok(await exists(join("dist", src)), `${route}: missing ${src}`);
      images++;
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const [pathname, hash] = href.split("#");
    const targetPath = (pathname || route).split("?")[0];
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
    const imagePath = new URL(match[1]).pathname;
    assert.ok(
      await exists(join("dist", imagePath)),
      `${route}: missing social image`,
    );
  }
}
assert.ok(await exists("dist/josiah-degrasse-design-resume.pdf"));
assert.ok(await exists("dist/sitemap.xml"));
assert.ok(await exists("dist/404.html"));
console.log(
  `Validated ${routes.length} prerendered pages, ${links} internal links, ${images} image references, résumé, social metadata, sitemap and 404.`,
);
