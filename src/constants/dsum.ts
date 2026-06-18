import type { DSumArea, WatchConfig } from "../types";

const AREA_FRAMES = [51, 51, 39, 25, 25, 25, 13, 13, 11, 3] as const;

export const DSUM_AREAS: readonly DSumArea[] = AREA_FRAMES.map((frames, index) => ({
  label: String(index + 1),
  frames,
  radians: (2 * Math.PI * frames) / 256,
}));

export const WATCH_CONFIGS: readonly WatchConfig[] = [
  { cycleSec: 6.2, label: "6.2" },
  { cycleSec: 6.5, label: "6.5" },
];

export const BATTLE_TIMEOUT_MS = 300_000;
