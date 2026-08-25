import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Popover state for the launcher: outside-click and Escape both close it, and
 * Escape returns focus to the trigger. Deliberately hand-rolled — the three
 * consumer apps have three different popover libraries between them.
 */
export function useLauncher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((value) => !value), []);
  const close = useCallback(() => setOpen(false), []);

  return { open, toggle, close, rootRef, triggerRef, panelId };
}

/**
 * The current hostname, read after mount so server-rendered markup (Next) and
 * the first client render agree. Empty string until mounted.
 */
export function useHostname(): string {
  const [hostname, setHostname] = useState("");
  useEffect(() => setHostname(window.location.hostname), []);
  return hostname;
}
