export type AppId = "hrm" | "plane" | "ai";

/** Deployment ring — decides which host each tile points at. */
export type RingId = "prod" | "kc-test" | "sandbox";

export type AppTile = {
  id: AppId;
  name: string;
  url: string;
  /** The app's square brand logo as an image URL; the panel rounds its corners. */
  logo: string;
};

export type AppLauncherProps = {
  /** Override tile URLs by id — local development only. */
  urls?: Partial<Record<AppId, string>>;
  /** Panel heading. Default: "Your apps". */
  label?: string;
  /** Inline trigger only: which edge the panel aligns to. Default: "end". */
  align?: "start" | "end";
};
