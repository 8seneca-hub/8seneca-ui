import { isCurrent } from "./apps";
import type { AppTile } from "./types";

type PanelProps = {
  tiles: AppTile[];
  hostname: string;
  label: string;
  id: string;
};

const TILE_CLASS =
  "flex flex-col items-center gap-1.5 rounded-xl p-3 no-underline transition-colors " +
  "text-launcher-fg hover:bg-launcher-hover focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-launcher-ring";

export function LauncherPanel({ tiles, hostname, label, id }: PanelProps) {
  return (
    <div
      id={id}
      role="group"
      aria-label={label}
      className="w-72 rounded-2xl border border-launcher-border bg-launcher-surface p-4 shadow-lg"
    >
      <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wide text-launcher-muted">
        {label}
      </p>
      <div className="grid grid-cols-3 gap-1">
        {tiles.map((app) => {
          const current = isCurrent(app, hostname);
          const body = (
            <>
              <img src={app.logo} alt="" className="h-10 w-10 rounded-xl" />
              <span className="text-[11px] font-medium">{app.name}</span>
            </>
          );

          return current ? (
            <span
              key={app.id}
              aria-current="page"
              className={`${TILE_CLASS} cursor-default bg-launcher-hover`}
            >
              {body}
            </span>
          ) : (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className={TILE_CLASS}
            >
              {body}
            </a>
          );
        })}
      </div>
    </div>
  );
}
