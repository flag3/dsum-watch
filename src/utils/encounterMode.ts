import type { EncounterMode } from "../types";

export function resolveEncounterMode(
  preferredMode: EncounterMode,
  {
    hasGroundEncounters,
    hasWaterEncounters,
  }: { readonly hasGroundEncounters: boolean; readonly hasWaterEncounters: boolean },
): EncounterMode {
  if (!hasWaterEncounters) return "ground";
  if (!hasGroundEncounters) return "water";
  return preferredMode;
}
