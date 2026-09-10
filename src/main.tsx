import { createRoot, hydrateRoot } from "react-dom/client";
import { PortfolioPage } from "./portfolio-page";
import "./index.css";

const root = document.getElementById("root")!;
const query = new URLSearchParams(window.location.search);
const dynamic = query.has("world") || query.has("mission");
const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
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
if (root.hasChildNodes() && !dynamic && matchesPrerender)
  hydrateRoot(root, <PortfolioPage />);
else createRoot(root).render(<PortfolioPage />);
