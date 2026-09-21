import { expect, it } from "vitest";
import { resolveEncounterMode } from "./encounterMode";

it.each([
  { ground: true, water: false, preferred: "ground", expected: "ground" },
  { ground: true, water: false, preferred: "water", expected: "ground" },
  { ground: false, water: true, preferred: "ground", expected: "water" },
  { ground: false, water: true, preferred: "water", expected: "water" },
  { ground: true, water: true, preferred: "ground", expected: "ground" },
  { ground: true, water: true, preferred: "water", expected: "water" },
  { ground: false, water: false, preferred: "ground", expected: "ground" },
  { ground: false, water: false, preferred: "water", expected: "ground" },
] as const)(
  "resolves $preferred to $expected when ground=$ground and water=$water",
  ({ ground, water, preferred, expected }) => {
    expect(
      resolveEncounterMode(preferred, { hasGroundEncounters: ground, hasWaterEncounters: water }),
    ).toBe(expected);
  },
);
