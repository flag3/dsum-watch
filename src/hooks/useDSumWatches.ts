import { useCallback, useEffect, useMemo, useState } from "react";
import { applyBattleTimeout, createInitialWatchState, toggleWatchState } from "../utils/dsumClock";
import type { WatchState } from "../types";

export interface DSumWatchController {
  readonly state: WatchState;
  readonly now: number;
  readonly toggle: () => void;
}

export function useDSumWatches(): DSumWatchController {
  const initialNow = useMemo(() => Date.now(), []);
  const [now, setNow] = useState(initialNow);
  const [state, setState] = useState<WatchState>(() => createInitialWatchState(initialNow));

  const toggle = useCallback(() => {
    const currentNow = Date.now();
    setNow(currentNow);
    setState((currentState) => toggleWatchState(currentState, currentNow));
  }, []);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      const currentNow = Date.now();
      setNow(currentNow);
      setState((currentState) => applyBattleTimeout(currentState, currentNow));
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "SELECT" ||
        target?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return {
    state,
    now,
    toggle,
  };
}
