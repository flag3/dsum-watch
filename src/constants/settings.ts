import type { Game } from "../types";

export const GAMES: readonly { readonly id: Game; readonly name: string }[] = [
  { id: "RED", name: "赤" },
  { id: "GREEN", name: "緑" },
  { id: "BLUE", name: "青" },
  { id: "YELLOW", name: "ピカチュウ" },
];

export const DEFAULT_SELECTION = {
  game: "RED",
  routeId: "ROUTE_1",
} as const;
