import { Heading, SegmentedControl, Stack, Text } from "@primer/react";
import { Blankslate } from "@primer/react/experimental";

import { getRouteEncounterState } from "../constants/localRoutes";
import { formatEncounterRate, formatLevel, getPokemonName, getTranslation } from "../i18n/i18n";
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
    <Stack
      as="section"
      className="encounter-slots"
      aria-label={getTranslation(language, "encounters.title")}
      padding="normal"
    >
      <Stack as="header" direction="horizontal" align="center" wrap="wrap" justify="space-between">
        <div>
          <Text as="p" className="eyebrow" size="small">
            {getTranslation(language, "encounters.title")}
          </Text>
          <Heading as="h2" variant="medium">
            {routeName}
          </Heading>
        </div>
        <Stack direction="horizontal" align="center" gap="condensed">
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
          <Stack
            as="span"
            className="encounter-rate"
            direction="horizontal"
            align="baseline"
            gap="tight"
          >
            <Text size="small">{getTranslation(language, "encounters.rate")}</Text>
            <Text as="strong" weight="semibold">
              {formatEncounterRate(activeRate)}
            </Text>
          </Stack>
        </Stack>
      </Stack>

      {activeEncounters.length > 0 ? (
        <SlotGrid encounters={activeEncounters} language={language} />
      ) : null}
      {!hasGroundEncounters && !hasWaterEncounters ? (
        <Blankslate size="small">
          <Blankslate.Description>
            {getTranslation(language, "encounters.empty")}
          </Blankslate.Description>
        </Blankslate>
      ) : null}
    </Stack>
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
          <Stack
            as="span"
            className="slot-detail"
            direction="horizontal"
            align="baseline"
            gap="condensed"
          >
            <Text as="strong" weight="semibold">
              {getPokemonName(encounter.dex, language, String(encounter.dex))}
            </Text>
            <Text size="small">{formatLevel(encounter.level, language)}</Text>
          </Stack>
        </article>
      ))}
    </div>
  );
}
