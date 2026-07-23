import { Link } from "@primer/react";
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
  const { state, toggle } = useDSumWatches();
  const [encounterMode, setEncounterMode] = useState<EncounterMode>("ground");
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [selection, setSelection] = useState<SelectionConfig>(DEFAULT_SELECTION);
  const setGame = (game: Game) => setSelection((current) => ({ ...current, game }));
  const setRouteId = (routeId: string) => setSelection((current) => ({ ...current, routeId }));
  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    if (nextLanguage === "en" && selection.game === "GREEN") {
      setGame("BLUE");
    }
  };
  const selectedRouteData = getRouteData(selection.routeId);
  const localizedDataGame = getLocalizedDataGame(selection.game, language);
  const { hasGroundEncounters, hasWaterEncounters } = getRouteEncounterState(
    selectedRouteData,
    localizedDataGame,
  );
  const resolvedEncounterMode: EncounterMode =
    encounterMode === "water"
      ? hasWaterEncounters
        ? "water"
        : "ground"
      : !hasGroundEncounters && hasWaterEncounters
        ? "water"
        : "ground";
  const watchPalette = GAME_ACCENTS[selection.game];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main className="dsum-shell">
      <header className="app-header">
        <div>
          <h1>DSum Watch</h1>
          <p className="app-credit">
            {getTranslation(language, "app.credit.before")}
            <Link href="https://x.com/zunow150poke" rel="noreferrer" target="_blank">
              ずのう
            </Link>
            {getTranslation(language, "app.credit.after")}
          </p>
        </div>
      </header>

      <SettingsPanel
        language={language}
        onGameChange={setGame}
        onLanguageChange={handleLanguageChange}
        onRouteChange={setRouteId}
        selection={selection}
      />

      <EncounterSlots
        game={localizedDataGame}
        language={language}
        mode={resolvedEncounterMode}
        onModeChange={setEncounterMode}
        route={selectedRouteData}
        routeName={getRouteName(selectedRouteData.id, language)}
      />

      <div className="watch-grid">
        <DSumWatchPair
          game={selection.game}
          language={language}
          onToggle={toggle}
          palette={watchPalette}
          state={state}
        />
      </div>
    </main>
  );
}
