import { Button, Label } from "@primer/react";
import { KeybindingHint } from "@primer/react/experimental";

import { WATCH_CONFIGS } from "../constants/dsum";
import { getTranslation } from "../i18n/i18n";
import type { Game, Language, WatchPalette, WatchState } from "../types";
import { DSumWatchCanvas } from "./DSumWatchCanvas";

function SpaceHint() {
  return <KeybindingHint className="space-hint" keys="Space" format="full" size="small" />;
}

interface DSumWatchPairProps {
  readonly game: Game;
  readonly language: Language;
  readonly state: WatchState;
  readonly onToggle: () => void;
  readonly palette: WatchPalette;
}

export function DSumWatchPair({ game, language, state, onToggle, palette }: DSumWatchPairProps) {
  const isBattle = state.phase === "battle";

  return (
    <section className="watch-pair" aria-label="DSum Watch">
      <header className="watch-pair-header">
        <Label variant={isBattle ? "attention" : "secondary"}>
          {getTranslation(language, isBattle ? "watch.battle" : "watch.field")}
        </Label>
        <Button onClick={onToggle} size="small" trailingVisual={SpaceHint}>
          {getTranslation(language, isBattle ? "watch.toggleToField" : "watch.toggleToBattle")}
        </Button>
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
