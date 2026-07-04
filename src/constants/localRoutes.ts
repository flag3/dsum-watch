import { CSV_ENCOUNTER_DATA } from "./csvEncounterData";
import { ROUTE_ORDER } from "./routeCatalog";
import type { RouteId } from "./routeCatalog";
import type { Game, RouteData } from "../types";

function buildRoute(routeId: RouteId): RouteData {
  const redData = CSV_ENCOUNTER_DATA.RED[routeId];
  const greenData = CSV_ENCOUNTER_DATA.GREEN[routeId];
  const blueData = CSV_ENCOUNTER_DATA.BLUE[routeId];
  const yellowData = CSV_ENCOUNTER_DATA.YELLOW[routeId];

  return {
    id: routeId,
    encounterRate: {
      RED: redData?.encounterRate ?? 0,
      GREEN: greenData?.encounterRate ?? 0,
      BLUE: blueData?.encounterRate ?? 0,
      YELLOW: yellowData?.encounterRate ?? 0,
    },
    waterEncounterRate: {
      RED: redData?.waterEncounterRate ?? 0,
      GREEN: greenData?.waterEncounterRate ?? 0,
      BLUE: blueData?.waterEncounterRate ?? 0,
      YELLOW: yellowData?.waterEncounterRate ?? 0,
    },
    waterEncounters: {
      RED: redData?.waterEncounters ?? [],
      GREEN: greenData?.waterEncounters ?? [],
      BLUE: blueData?.waterEncounters ?? [],
      YELLOW: yellowData?.waterEncounters ?? [],
    },
    encounters: {
      RED: redData?.encounters ?? [],
      GREEN: greenData?.encounters ?? [],
      BLUE: blueData?.encounters ?? [],
      YELLOW: yellowData?.encounters ?? [],
    },
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
