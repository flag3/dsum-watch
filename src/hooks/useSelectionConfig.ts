import { useMemo, useState } from "react";
import { DEFAULT_SELECTION } from "../constants/settings";
import { getRouteData } from "../constants/localRoutes";
import type { Game, RouteData, SelectionConfig } from "../types";

export interface SelectionConfigController {
  readonly selection: SelectionConfig;
  readonly selectedRouteData: RouteData;
  readonly selectedEncounterRate: number;
  readonly selectedWaterEncounterRate: number;
  readonly setGame: (game: Game) => void;
  readonly setRouteId: (routeId: string) => void;
}

export function useSelectionConfig(): SelectionConfigController {
  const [selection, setSelection] = useState<SelectionConfig>(DEFAULT_SELECTION);
  const selectedRouteData = useMemo(() => getRouteData(selection.routeId), [selection.routeId]);
  const selectedEncounterRate = useMemo(
    () => selectedRouteData.encounterRate[selection.game] ?? 0,
    [selectedRouteData, selection.game],
  );
  const selectedWaterEncounterRate = useMemo(
    () => selectedRouteData.waterEncounterRate?.[selection.game] ?? 0,
    [selectedRouteData, selection.game],
  );

  return {
    selection,
    selectedRouteData,
    selectedEncounterRate,
    selectedWaterEncounterRate,
    setGame: (game) =>
      setSelection((currentSelection) => ({
        ...currentSelection,
        game,
      })),
    setRouteId: (routeId) =>
      setSelection((currentSelection) => ({
        ...currentSelection,
        routeId,
      })),
  };
}
