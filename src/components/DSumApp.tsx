import { useEffect, useState } from "react";

import { GAME_ACCENTS } from "../constants/gameAccents";
import { getRouteData, getRouteEncounterState } from "../constants/localRoutes";
import { useDSumWatches } from "../hooks/useDSumWatches";
import {
  getInitialLanguage,
  getLocalizedDataGame,
  getRouteName,
  getTranslation,
} from "../i18n/i18n";
import type { EncounterMode, Game, Language, SelectionConfig } from "../types";
import { DSumWatchPair } from "./DSumWatchPair";
import { EncounterSlots } from "./EncounterSlots";
import { SettingsPanel } from "./SettingsPanel";

const DEFAULT_SELECTION: SelectionConfig = { game: "RED", routeId: "ROUTE_1" };

export function DSumApp() {
  const { state, now, toggle } = useDSumWatches();
  const [encounterMode, setEncounterMode] = useState<EncounterMode>("ground");
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [selection, setSelection] = useState<SelectionConfig>(DEFAULT_SELECTION);
  const setGame = (game: Game) => setSelection((current) => ({ ...current, game }));
  const setRouteId = (routeId: string) => setSelection((current) => ({ ...current, routeId }));
  const selectedRouteData = getRouteData(selection.routeId);
  const localizedDataGame = getLocalizedDataGame(selection.game, language);
  const selectedEncounterRate = selectedRouteData.encounterRate[localizedDataGame];
  const selectedWaterEncounterRate = selectedRouteData.waterEncounterRate[localizedDataGame];
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
      setSelection((current) => ({ ...current, game: "BLUE" }));
    }
  }, [language, selection.game]);

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
