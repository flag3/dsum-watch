import { useCallback, useEffect, useState } from "react";
import { BATTLE_TIMEOUT_MS } from "../constants/dsum";
import { applyBattleTimeout, createInitialWatchState, toggleWatchState } from "../utils/dsumClock";
import type { WatchState } from "../types";

export function useDSumWatches() {
  const [state, setState] = useState<WatchState>(() => createInitialWatchState(Date.now()));

  const toggle = useCallback(() => {
    setState((currentState) => toggleWatchState(currentState, Date.now()));
  }, []);

  useEffect(() => {
    if (state.phase !== "battle") {
      return;
    }

    // applyBattleTimeout requires elapsed > BATTLE_TIMEOUT_MS, so fire slightly after
    const timeoutId = window.setTimeout(() => {
      setState((currentState) => applyBattleTimeout(currentState, Date.now()));
    }, BATTLE_TIMEOUT_MS + 50);

    return () => window.clearTimeout(timeoutId);
  }, [state]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      // BUTTON included: let a focused button keep its native Space press
      if (
        target?.tagName === "BUTTON" ||
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
    toggle,
  };
}
