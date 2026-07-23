import { Button } from "@primer/react";

import { WATCH_CONFIGS } from "../constants/dsum";
import { getTranslation } from "../i18n/i18n";
import type { Game, Language, WatchPalette, WatchState } from "../types";
import { DSumWatchCanvas } from "./DSumWatchCanvas";

interface DSumWatchPairProps {
  readonly game: Game;
  readonly language: Language;
  readonly state: WatchState;
  readonly onToggle: () => void;
  readonly palette: WatchPalette;
}

export function DSumWatchPair({ game, language, state, onToggle, palette }: DSumWatchPairProps) {
  return (
    <section className="watch-pair" aria-label="DSum Watch">
      <header className="watch-pair-header">
        <div>
          <span className="phase-label">
            {state.phase === "battle"
              ? getTranslation(language, "watch.battle")
              : getTranslation(language, "watch.field")}
          </span>
        </div>
        <div className="watch-actions">
          <Button onClick={onToggle}>{getTranslation(language, "watch.toggle")}</Button>
        </div>
      </header>
      <div className="watch-canvas-row">
        {WATCH_CONFIGS.map((config) => (
          <DSumWatchCanvas
            config={config}
            game={game}
            key={config.label}
            language={language}
            palette={palette}
            state={state}
          />
        ))}
      </div>
    </section>
  );
}
