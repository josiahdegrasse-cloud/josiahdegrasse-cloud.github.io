const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix site-local links and assets for hosts that mount this app in a subdirectory. */
export function sitePath(path: string): string {
  if (!base || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === base || path.startsWith(base + "/")) return path;
  return base + path;
}

export function routePath(path: string): string {
  if (base && (path === base || path.startsWith(base + "/"))) {
    path = path.slice(base.length);
  }
  return path.replace(/\/+$/, "") || "/";
}
