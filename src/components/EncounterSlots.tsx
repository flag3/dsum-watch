import { getRouteEncounterState } from "../constants/localRoutes";
import { formatLevel, getPokemonName, getTranslation } from "../i18n/i18n";
import type { EncounterMode, Game, Language, RouteData } from "../types";

interface EncounterSlotsProps {
  readonly game: Game;
  readonly language: Language;
  readonly mode: EncounterMode;
  readonly encounterRate: number;
  readonly onModeChange: (mode: EncounterMode) => void;
  readonly routeName: string;
  readonly waterEncounterRate: number;
  readonly route: RouteData;
}

export function EncounterSlots({
  game,
  language,
  mode,
  encounterRate,
  onModeChange,
  routeName,
  waterEncounterRate,
  route,
}: EncounterSlotsProps) {
  const { groundEncounters, hasGroundEncounters, hasWaterEncounters, waterEncounters } =
    getRouteEncounterState(route, game);
  const activeEncounters = mode === "water" ? waterEncounters : groundEncounters;
  const activeRate = mode === "water" ? waterEncounterRate : encounterRate;

  return (
    <section className="encounter-slots" aria-label={getTranslation(language, "encounters.title")}>
      <header className="encounter-header">
        <div>
          <p className="eyebrow">{getTranslation(language, "encounters.title")}</p>
          <h2>{routeName}</h2>
        </div>
        <div className="encounter-controls">
          {hasGroundEncounters && hasWaterEncounters ? (
            <div
              className="encounter-mode-toggle"
              aria-label={getTranslation(language, "encounters.modeLabel")}
            >
              <button
                aria-pressed={mode === "ground"}
                onClick={() => onModeChange("ground")}
                type="button"
              >
                {getTranslation(language, "encounters.ground")}
              </button>
              <button
                aria-pressed={mode === "water"}
                onClick={() => onModeChange("water")}
                type="button"
              >
                {getTranslation(language, "encounters.water")}
              </button>
            </div>
          ) : null}
          <span className="encounter-rate">{activeRate}</span>
        </div>
      </header>

      {activeEncounters.length > 0 ? (
        <SlotGrid encounters={activeEncounters} language={language} />
      ) : null}
      {hasGroundEncounters === false && hasWaterEncounters === false ? (
        <p className="empty-slots">{getTranslation(language, "encounters.empty")}</p>
      ) : null}
    </section>
  );
}

function SlotGrid({
  encounters,
  language,
}: {
  readonly encounters: readonly {
    readonly dex: number;
    readonly species: string;
    readonly level: number;
  }[];
  readonly language: Language;
}) {
  return (
    <div className="slot-grid">
      {encounters.map((encounter, index) => (
        <article className="slot-card" key={`${index}-${encounter.dex}-${encounter.level}`}>
          <span className="slot-index">{index + 1}</span>
          <span className="slot-detail">
            <strong>{getPokemonName(encounter.dex, language, encounter.species)}</strong>
            <span>{formatLevel(encounter.level, language)}</span>
          </span>
        </article>
      ))}
    </div>
  );
}
