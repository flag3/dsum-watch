import type { Game, WatchPalette } from "../types";

export const GAME_ACCENTS: Readonly<Record<Game, WatchPalette>> = {
  RED: {
    active: "rgb(255, 51, 51)",
    activeFill: "rgb(255, 240, 240)",
    inactive: "rgb(255, 153, 153)",
  },
  GREEN: {
    active: "rgb(51, 255, 51)",
    activeFill: "rgb(240, 255, 240)",
    inactive: "rgb(153, 255, 153)",
  },
  BLUE: {
    active: "rgb(51, 153, 255)",
    activeFill: "rgb(240, 248, 255)",
    inactive: "rgb(153, 204, 255)",
  },
  YELLOW: {
    active: "rgb(255, 221, 51)",
    activeFill: "rgb(255, 253, 240)",
    inactive: "rgb(255, 238, 153)",
  },
};
