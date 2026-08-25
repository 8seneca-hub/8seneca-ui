import { Grip } from "lucide-react";
import { resolveApps } from "./apps";
import { LauncherPanel } from "./panel";
import type { AppLauncherProps } from "./types";
import { useHostname, useLauncher } from "./use-launcher";

const TRIGGER_BASE =
  "inline-flex items-center justify-center rounded-full text-launcher-fg " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-launcher-ring";

/** Inline 9-dot trigger — mount inside an app's own header or top bar. */
export function AppLauncher({ urls, label = "Your apps", align = "end" }: AppLauncherProps = {}) {
  const { open, toggle, rootRef, triggerRef, panelId } = useLauncher();
  const hostname = useHostname();
  const tiles = resolveApps(urls);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open app launcher"
        className={`${TRIGGER_BASE} h-9 w-9 hover:bg-launcher-hover`}
      >
        <Grip className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <div className={`absolute top-11 z-50 ${align === "end" ? "right-0" : "left-0"}`}>
          <LauncherPanel tiles={tiles} hostname={hostname} label={label} id={panelId} />
        </div>
      )}
    </div>
  );
}

/** Floating trigger at bottom-right — mount once in an app's root layout. */
export function AppLauncherFab({ urls, label = "Your apps" }: AppLauncherProps = {}) {
  const { open, toggle, rootRef, triggerRef, panelId } = useLauncher();
  const hostname = useHostname();
  const tiles = resolveApps(urls);

  return (
    <div ref={rootRef} className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="absolute bottom-16 right-0">
          <LauncherPanel tiles={tiles} hostname={hostname} label={label} id={panelId} />
        </div>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open app launcher"
        title="Open apps"
        className={`${TRIGGER_BASE} size-12 bg-launcher-surface border border-launcher-border shadow-lg transition-transform hover:scale-105`}
      >
        <Grip className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
