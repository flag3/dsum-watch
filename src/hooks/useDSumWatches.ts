import { useCallback, useEffect, useState } from "react";
import { applyBattleTimeout, createInitialWatchState, toggleWatchState } from "../utils/dsumClock";
import type { WatchState } from "../types";

export function useDSumWatches() {
  const [now, setNow] = useState(() => Date.now());
  const [state, setState] = useState<WatchState>(() => createInitialWatchState(now));

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
