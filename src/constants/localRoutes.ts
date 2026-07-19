import { CSV_ENCOUNTER_DATA, type CsvEncounterData } from "./csvEncounterData";
import { ROUTE_ORDER } from "./routeCatalog";
import type { RouteId } from "./routeCatalog";
import type { Game, RouteData } from "../types";

const GAMES = ["RED", "GREEN", "BLUE", "YELLOW"] as const;

function byGame<T>(
  routeId: RouteId,
  pick: (data: CsvEncounterData | undefined) => T,
): Record<Game, T> {
  return Object.fromEntries(
    GAMES.map((game) => [game, pick(CSV_ENCOUNTER_DATA[game][routeId])]),
  ) as Record<Game, T>;
}

function buildRoute(routeId: RouteId): RouteData {
  return {
    id: routeId,
    encounterRate: byGame(routeId, (data) => data?.encounterRate ?? 0),
    waterEncounterRate: byGame(routeId, (data) => data?.waterEncounterRate ?? 0),
    encounters: byGame(routeId, (data) => data?.encounters ?? []),
    waterEncounters: byGame(routeId, (data) => data?.waterEncounters ?? []),
  };
}

export const ROUTES: readonly RouteData[] = ROUTE_ORDER.map(buildRoute);

const ROUTES_BY_ID = new Map(ROUTES.map((route) => [route.id, route]));

export function getRouteData(routeId: string): RouteData {
  return ROUTES_BY_ID.get(routeId) ?? ROUTES[0];
}

export function getRouteEncounterState(route: RouteData, game: Game) {
  const groundEncounters = route.encounters[game];
  const waterEncounters = route.waterEncounters[game];

  return {
    groundEncounters,
    waterEncounters,
    hasGroundEncounters: groundEncounters.length > 0,
    hasWaterEncounters: waterEncounters.length > 0,
  };
}
