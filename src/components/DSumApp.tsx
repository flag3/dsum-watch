import { useEffect, useState } from "react";

import { GAME_ACCENTS } from "../constants/gameAccents";
import { getRouteEncounterState } from "../constants/localRoutes";
import { useDSumWatches } from "../hooks/useDSumWatches";
import { useSelectionConfig } from "../hooks/useSelectionConfig";
import {
  getInitialLanguage,
  getLocalizedDataGame,
  getRouteName,
  getTranslation,
} from "../i18n/i18n";
import type { EncounterMode, Language } from "../types";
import { DSumWatchPair } from "./DSumWatchPair";
import { EncounterSlots } from "./EncounterSlots";
import { SettingsPanel } from "./SettingsPanel";

export function DSumApp() {
  const { state, now, toggle } = useDSumWatches();
  const [encounterMode, setEncounterMode] = useState<EncounterMode>("ground");
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const { selection, selectedRouteData, setGame, setRouteId } = useSelectionConfig();
  const localizedDataGame = getLocalizedDataGame(selection.game, language);
  const selectedEncounterRate = selectedRouteData.encounterRate[localizedDataGame] ?? 0;
  const selectedWaterEncounterRate = selectedRouteData.waterEncounterRate?.[localizedDataGame] ?? 0;
  const { hasGroundEncounters, hasWaterEncounters } = getRouteEncounterState(
    selectedRouteData,
    localizedDataGame,
  );
  const watchPalette = GAME_ACCENTS[selection.game];

  useEffect(() => {
    if (encounterMode === "water" && !hasWaterEncounters) {
      setEncounterMode("ground");
    }
    if (encounterMode === "ground" && !hasGroundEncounters && hasWaterEncounters) {
      setEncounterMode("water");
    }
  }, [encounterMode, hasGroundEncounters, hasWaterEncounters]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (language === "en" && selection.game === "GREEN") {
      setGame("BLUE");
    }
  }, [language, selection.game, setGame]);

  return (
    <main className="dsum-shell">
      <header className="app-header">
        <div>
          <h1>DSum Watch</h1>
          <p className="app-credit">
            {getTranslation(language, "app.credit.before")}
            <a href="https://x.com/zunow150poke" rel="noreferrer" target="_blank">
              ずのう
            </a>
            {getTranslation(language, "app.credit.after")}
          </p>
        </div>
      </header>

      <SettingsPanel
        language={language}
        onGameChange={setGame}
        onLanguageChange={setLanguage}
        onRouteChange={setRouteId}
        selection={selection}
      />

      <EncounterSlots
        encounterRate={selectedEncounterRate}
        game={localizedDataGame}
        language={language}
        mode={encounterMode}
        onModeChange={setEncounterMode}
        route={selectedRouteData}
        routeName={getRouteName(selectedRouteData.id, language)}
        waterEncounterRate={selectedWaterEncounterRate}
      />

      <div className="watch-grid">
        <DSumWatchPair
          game={selection.game}
          language={language}
          now={now}
          onToggle={toggle}
          palette={watchPalette}
          state={state}
        />
      </div>

      <footer className="keyboard-hints">
        <span>
          <kbd>Space</kbd> {getTranslation(language, "keyboard.space")}
        </span>
      </footer>
    </main>
  );
}
