import peopleLogo from "./logos/8people-logo.svg";
import projectsLogo from "./logos/8projects-logo.png";
import aiLogo from "./logos/8ai-logo.svg";
import type { AppId, AppTile, RingId } from "./types";

/**
 * Tile presentation. URLs are not here — they depend on which ring the page is
 * served from (see RINGS), because a sandbox launcher linking to production is
 * a trap: it looks like it works right up until someone edits real data.
 */
const TILES: Omit<AppTile, "url">[] = [
  { id: "hrm", name: "8People", logo: peopleLogo },
  { id: "plane", name: "8Projects", logo: projectsLogo },
  { id: "ai", name: "8AI", logo: aiLogo },
];

/** 8AI has a single deployment, so every ring links to it. */
const AI_URL = "https://8ai.up.railway.app/assistant";

/**
 * One URL set per deployment ring. Baked in on purpose: the apps' env
 * conventions diverge (NEXT_PUBLIC_* vs VITE_*), so this keeps every consumer
 * at zero configuration. Adding a ring or moving a host means publishing.
 */
export const RINGS: Record<RingId, Record<AppId, string>> = {
  prod: {
    hrm: "https://people.8seneca.com",
    plane: "https://projects.8seneca.com",
    ai: AI_URL,
  },
  // The Keycloak test ring: hrm on its kc-test environment, Plane on its
  // sandbox one — the two that authenticate against the same realm.
  "kc-test": {
    hrm: "https://hr-systemweb-kc-test.up.railway.app",
    plane: "https://hub-plane-sandbox.up.railway.app",
    ai: AI_URL,
  },
  // hrm's own sandbox environment. There is only one sandbox Plane, so it
  // points at the same host kc-test does.
  sandbox: {
    hrm: "https://hr-systemweb-sandbox.up.railway.app",
    plane: "https://hub-plane-sandbox.up.railway.app",
    ai: AI_URL,
  },
};

/**
 * Which ring a hostname belongs to. An unknown host falls back to prod, so a
 * new custom domain shows working links rather than nothing.
 */
const HOST_RING: Record<string, RingId> = {
  "people.8seneca.com": "prod",
  "projects.8seneca.com": "prod",
  "hr-systemweb-kc-test.up.railway.app": "kc-test",
  // The sandbox Plane is the Keycloak-enabled one, so it pairs with kc-test hrm.
  "hub-plane-sandbox.up.railway.app": "kc-test",
  "hr-systemweb-sandbox.up.railway.app": "sandbox",
};

export function ringFor(hostname: string): RingId {
  return HOST_RING[hostname] ?? "prod";
}

/** The production tiles, for consumers that want the list without a hostname. */
export const APPS: AppTile[] = TILES.map((tile) => ({ ...tile, url: RINGS.prod[tile.id] }));

/**
 * Tiles for the ring `hostname` belongs to, with per-id URL overrides applied
 * last. Unknown ids and empty strings are ignored.
 */
export function resolveApps(
  urls?: Partial<Record<AppId, string>>,
  hostname = "",
): AppTile[] {
  const ring = RINGS[ringFor(hostname)];
  return TILES.map((tile) => {
    const override = urls?.[tile.id];
    return { ...tile, url: override || ring[tile.id] };
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
