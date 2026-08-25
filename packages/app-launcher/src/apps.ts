import { Briefcase, FolderKanban, LayoutGrid } from "lucide-react";
import type { AppId, AppTile } from "./types";

/**
 * The complete 8seneca app list. URLs live here on purpose: the apps' env
 * conventions diverge (NEXT_PUBLIC_* vs VITE_*), so baking them keeps every
 * consumer at zero configuration. Adding an app means publishing a version.
 */
export const APPS: AppTile[] = [
  {
    id: "hrm",
    name: "8People",
    url: "https://people.8seneca.com",
    icon: Briefcase,
    color: "oklch(0.65 0.15 240)",
  },
  {
    id: "plane",
    name: "8Projects",
    url: "https://projects.8seneca.com",
    icon: FolderKanban,
    color: "oklch(0.65 0.15 30)",
  },
  {
    id: "portal",
    name: "8Seneca Hub",
    url: "https://portal.8seneca.com",
    icon: LayoutGrid,
    color: "oklch(0.65 0.15 150)",
  },
];

/** Applies per-id URL overrides. Unknown ids and empty strings are ignored. */
export function resolveApps(urls?: Partial<Record<AppId, string>>): AppTile[] {
  if (!urls) return APPS;
  return APPS.map((app) => {
    const override = urls[app.id];
    return override ? { ...app, url: override } : app;
  });
}

/** True when the tile points at the page we are already on. */
export function isCurrent(app: AppTile, hostname: string): boolean {
  if (!hostname) return false;
  try {
    return new URL(app.url).hostname === hostname;
  } catch {
    return false;
  }
}
