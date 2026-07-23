import { SegmentedControl } from "@primer/react";

import { getRouteEncounterState } from "../constants/localRoutes";
import { formatLevel, getPokemonName, getTranslation } from "../i18n/i18n";
import type { Encounter, EncounterMode, Game, Language, RouteData } from "../types";

interface EncounterSlotsProps {
  readonly game: Game;
  readonly language: Language;
  readonly mode: EncounterMode;
  readonly onModeChange: (mode: EncounterMode) => void;
  readonly routeName: string;
  readonly route: RouteData;
}

export function EncounterSlots({
  game,
  language,
  mode,
  onModeChange,
  routeName,
  route,
}: EncounterSlotsProps) {
  const { groundEncounters, hasGroundEncounters, hasWaterEncounters, waterEncounters } =
    getRouteEncounterState(route, game);
  const activeEncounters = mode === "water" ? waterEncounters : groundEncounters;
  const activeRate = mode === "water" ? route.waterEncounterRate[game] : route.encounterRate[game];

  return (
    <section className="encounter-slots" aria-label={getTranslation(language, "encounters.title")}>
      <header className="encounter-header">
        <div>
          <p className="eyebrow">{getTranslation(language, "encounters.title")}</p>
          <h2>{routeName}</h2>
        </div>
        <div className="encounter-controls">
          {hasGroundEncounters && hasWaterEncounters ? (
            <SegmentedControl
              aria-label={getTranslation(language, "encounters.modeLabel")}
              onChange={(selectedIndex) => onModeChange(selectedIndex === 1 ? "water" : "ground")}
            >
              <SegmentedControl.Button selected={mode === "ground"}>
                {getTranslation(language, "encounters.ground")}
              </SegmentedControl.Button>
              <SegmentedControl.Button selected={mode === "water"}>
                {getTranslation(language, "encounters.water")}
              </SegmentedControl.Button>
            </SegmentedControl>
          ) : null}
          <span className="encounter-rate">
            <span>{getTranslation(language, "encounters.rate")}</span>
            <strong>{activeRate}</strong>
          </span>
        </div>
      </header>

      {activeEncounters.length > 0 ? (
        <SlotGrid encounters={activeEncounters} language={language} />
      ) : null}
      {!hasGroundEncounters && !hasWaterEncounters ? (
        <p className="empty-slots">{getTranslation(language, "encounters.empty")}</p>
      ) : null}
    </section>
  );
}

function SlotGrid({
  encounters,
  language,
}: {
  readonly encounters: readonly Encounter[];
  readonly language: Language;
}) {
  return (
    <div className="slot-grid">
      {encounters.map((encounter, index) => (
        <article className="slot-card" key={`${index}-${encounter.dex}-${encounter.level}`}>
          <span className="slot-index">{index + 1}</span>
          <span className="slot-detail">
            <strong>{getPokemonName(encounter.dex, language, String(encounter.dex))}</strong>
            <span>{formatLevel(encounter.level, language)}</span>
          </span>
        </article>
      ))}
    </div>
  );
}
