import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const serverDir = join(process.cwd(), "dist", "server");
const workerPath = join(serverDir, "index.js");

const worker = `const cacheableExtensions = new Set([
  ".avif",
  ".css",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".png",
  ".svg",
  ".webp",
  ".woff",
  ".woff2",
]);

function assetHeaders(pathname, response) {
  const headers = new Headers(response.headers);
  const extension = pathname.includes(".")
    ? pathname.slice(pathname.lastIndexOf(".")).toLowerCase()
    : "";

  if (cacheableExtensions.has(extension)) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return headers;
}

async function serveAsset(request, env) {
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) {
    const url = new URL(request.url);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: assetHeaders(url.pathname, response),
    });
  }

  return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    return serveAsset(request, env);
  },
};
`;

await mkdir(serverDir, { recursive: true });
await writeFile(workerPath, worker);
