import { routePath, sitePath } from "./site-path";
import { createRoot, hydrateRoot } from "react-dom/client";
import { PortfolioPage } from "./portfolio-page";
import "./index.css";

const root = document.getElementById("root")!;
// Retired experience links resolve to the portfolio without reloading the page.
const url = new URL(window.location.href);
const retiredPath = ["/play", "/portfolio/play"].includes(
  routePath(url.pathname),
);
if (
  retiredPath ||
  url.searchParams.has("world") ||
  url.searchParams.has("mission")
) {
  if (retiredPath) url.pathname = sitePath("/");
  url.searchParams.delete("world");
  url.searchParams.delete("mission");
  window.history.replaceState(null, "", url.pathname + url.search + url.hash);
}
const pathname = routePath(window.location.pathname);
const canonicalPath = [
  "/portfolio",
  "/portfolio/case-studies",
  "/work",
].includes(pathname)
  ? "/"
  : pathname === "/portfolio/about"
    ? "/about"
    : pathname.replace(/^\/portfolio\/projects\//, "/work/");
const matchesPrerender =
  root.dataset.route === canonicalPath || root.dataset.route === "404";
if (root.hasChildNodes() && matchesPrerender)
  hydrateRoot(root, <PortfolioPage />);
else createRoot(root).render(<PortfolioPage />);
