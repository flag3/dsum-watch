import { BATTLE_TIMEOUT_MS, DSUM_AREAS } from "../constants/dsum";
import type { DrawWatchInput, Game, RingAngles, WatchConfig, WatchState } from "../types";

const FULL_TURN = Math.PI * 2;
const START_ANGLE = -Math.PI / 2;

export function createInitialWatchState(now: number): WatchState {
  return {
    phase: "afterBattle",
    startTime: now,
    battleEndTime: now,
  };
}

export function toggleWatchState(state: WatchState, now: number): WatchState {
  if (state.phase === "battle") {
    return {
      ...state,
      phase: "afterBattle",
      battleEndTime: now,
    };
  }

  return {
    ...state,
    phase: "battle",
    startTime: now,
    battleEndTime: now,
  };
}

export function applyBattleTimeout(state: WatchState, now: number): WatchState {
  if (state.phase === "battle" && now - state.startTime > BATTLE_TIMEOUT_MS) {
    return {
      ...state,
      phase: "afterBattle",
      battleEndTime: now,
    };
  }

  return state;
}

export function getElapsedTimes(state: WatchState, now: number) {
  return {
    battleMs: state.battleEndTime - state.startTime,
    totalMs: now - state.startTime,
    afterBattleMs: now - state.battleEndTime,
  };
}

export function getWatchCycleLabel(config: WatchConfig, game: Game): string {
  return game === "YELLOW" ? (config.cycleSec * 2).toFixed(1) : config.label;
}

function getOverworldDirection(game: Game): 1 | -1 {
  return game === "YELLOW" ? 1 : -1;
}

function getOverworldCycleMultiplier(game: Game): 1 | 2 {
  return game === "YELLOW" ? 2 : 1;
}

export function getRingAngles(
  config: WatchConfig,
  state: WatchState,
  now: number,
  game: Game = "RED",
): RingAngles {
  const { battleMs, totalMs, afterBattleMs } = getElapsedTimes(state, now);
  const cycleMs = config.cycleSec * 1000;
  const battleCycleMs = cycleMs * 2;
  const overworldCycleMs = cycleMs * getOverworldCycleMultiplier(game);
  const battleAngle = (battleMs * FULL_TURN) / battleCycleMs;
  const overworldAngle =
    (afterBattleMs * FULL_TURN * getOverworldDirection(game)) / overworldCycleMs;

  if (state.phase === "battle") {
    return {
      inner: START_ANGLE + (totalMs * FULL_TURN) / battleCycleMs,
      outer: null,
    };
  }

  return {
    inner: START_ANGLE + battleAngle,
    outer: START_ANGLE + battleAngle + overworldAngle,
  };
}

export function drawDSumWatch({ canvas, config, game, palette, state, now }: DrawWatchInput): void {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const size = 300;
  canvas.width = size;
  canvas.height = size;

  const center = size / 2;
  const labelRadius = center * 0.85;
  const angles = getRingAngles(config, state, now, game);

  context.clearRect(0, 0, size, size);
  context.save();
  context.translate(center, center);

  drawFace(context, size, labelRadius);
  drawSeparators(context);
  drawCenter(context, getWatchCycleLabel(config, game), palette, state);

  if (angles.outer !== null) {
    drawNumberRing(context, angles.outer, 92.5, {
      outerStart: 110,
      outerEnd: 100.5,
      innerStart: 84.5,
      innerEnd: 75,
    });
  }

  drawNumberRing(context, angles.inner, 50, {
    outerStart: 66.5,
    outerEnd: 58,
    innerStart: 42,
    innerEnd: 33.5,
  });

  context.restore();
}

function drawFace(context: CanvasRenderingContext2D, size: number, labelRadius: number): void {
  context.save();
  context.strokeStyle = "rgb(207, 207, 207)";
  context.lineWidth = 3;
  context.shadowBlur = 10;
  context.shadowColor = "#000";
  context.fillStyle = "rgb(241, 241, 241)";
  context.beginPath();
  context.arc(0, 0, size / 2 - 5, 0, FULL_TURN, false);
  context.fill();
  context.stroke();

  context.font = "20px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgb(0, 0, 0)";
  context.shadowBlur = 5;
  context.shadowColor = "#fff";

  let radian = 0;
  for (const area of DSUM_AREAS) {
    radian += area.radians / 2;
    const x = labelRadius * Math.sin(radian);
    const y = -labelRadius * Math.cos(radian);
    context.fillText(area.label, x, y);
    radian += area.radians / 2;
  }

  context.beginPath();
  context.arc(0, 0, 110, 0, FULL_TURN, false);
  context.fillStyle = "#fff";
  context.fill();
  context.restore();
}

function drawSeparators(context: CanvasRenderingContext2D): void {
  context.save();
  context.strokeStyle = "#ccc";
  context.lineWidth = 2;
  context.beginPath();
  context.rotate(START_ANGLE);
  for (const area of DSUM_AREAS) {
    context.moveTo(110, 0);
    context.lineTo(0, 0);
    context.rotate(area.radians);
  }
  context.stroke();
  context.restore();
}

function drawCenter(
  context: CanvasRenderingContext2D,
  label: string,
  palette: DrawWatchInput["palette"],
  state: WatchState,
): void {
  const colors =
    state.phase === "battle"
      ? { stroke: palette.active, fill: palette.activeFill }
      : { stroke: palette.inactive, fill: palette.inactive };

  context.save();
  context.lineWidth = 20;
  context.strokeStyle = colors.stroke;
  context.fillStyle = colors.fill;
  context.beginPath();
  context.arc(0, 0, 24, 0, FULL_TURN, true);
  context.stroke();
  context.fill();

  context.font = "20px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgb(0, 0, 0)";
  context.shadowBlur = 5;
  context.shadowColor = "#fff";
  context.fillText(label, 0, 0);
  context.restore();
}

function drawNumberRing(
  context: CanvasRenderingContext2D,
  angle: number,
  radius: number,
  ticks: {
    readonly outerStart: number;
    readonly outerEnd: number;
    readonly innerStart: number;
    readonly innerEnd: number;
  },
): void {
  context.save();
  context.rotate(angle);
  context.strokeStyle = "#ddd";
  context.font = "12px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgb(0, 0, 0)";

  for (const area of DSUM_AREAS) {
    context.rotate(area.radians / 2);
    context.beginPath();
    context.moveTo(ticks.outerStart, 0);
    context.lineTo(ticks.outerEnd, 0);
    context.moveTo(ticks.innerStart, 0);
    context.lineTo(ticks.innerEnd, 0);
    context.stroke();

    context.beginPath();
    context.arc(radius, 0, 8, 0, FULL_TURN, false);
    context.stroke();
    context.fillText(area.label, radius, 0);
    context.rotate(area.radians / 2);
  }

  context.restore();
}
