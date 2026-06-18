export type WatchPhase = "battle" | "afterBattle";

export type Game = "RED" | "GREEN" | "BLUE" | "YELLOW";

export type EncounterMode = "ground" | "water";

export type Language = "ja" | "en";

export interface Encounter {
  readonly species: string;
  readonly dex: number;
  readonly level: number;
}

export interface RouteData {
  readonly id: string;
  readonly name: string;
  readonly encounterRate: Partial<Record<Game, number>>;
  readonly encounters: Partial<Record<Game, readonly Encounter[]>>;
  readonly waterEncounterRate?: Partial<Record<Game, number>>;
  readonly waterEncounters?: Partial<Record<Game, readonly Encounter[]>>;
}

export interface SelectionConfig {
  readonly game: Game;
  readonly routeId: string;
}

export interface WatchState {
  readonly phase: WatchPhase;
  readonly startTime: number;
  readonly battleEndTime: number;
}

export interface WatchConfig {
  readonly cycleSec: number;
  readonly label: string;
}

export interface WatchPalette {
  readonly active: string;
  readonly activeFill: string;
  readonly inactive: string;
}

export interface DSumArea {
  readonly label: string;
  readonly frames: number;
  readonly radians: number;
}

export interface DrawWatchInput {
  readonly canvas: HTMLCanvasElement;
  readonly config: WatchConfig;
  readonly game: Game;
  readonly palette: WatchPalette;
  readonly state: WatchState;
  readonly now: number;
}

export interface RingAngles {
  readonly inner: number;
  readonly outer: number | null;
}
