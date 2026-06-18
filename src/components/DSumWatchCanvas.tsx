import { useEffect, useRef } from "react";
import { formatSeconds } from "../i18n/i18n";
import { drawDSumWatch, getWatchCycleLabel } from "../utils/dsumClock";
import type { Game, Language, WatchConfig, WatchPalette, WatchState } from "../types";

interface DSumWatchCanvasProps {
  readonly config: WatchConfig;
  readonly game: Game;
  readonly language: Language;
  readonly palette: WatchPalette;
  readonly state: WatchState;
  readonly now: number;
}

export function DSumWatchCanvas({
  config,
  game,
  language,
  palette,
  state,
  now,
}: DSumWatchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const label = getWatchCycleLabel(config, game);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    drawDSumWatch({
      canvas,
      config,
      game,
      palette,
      state,
      now,
    });
  }, [config, game, palette, state, now]);

  return (
    <canvas
      aria-label={`${formatSeconds(label, language)} DSum Watch`}
      className="dsum-watch-canvas"
      ref={canvasRef}
    />
  );
}
