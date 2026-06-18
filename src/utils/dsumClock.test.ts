import { describe, expect, it } from "vitest";
import {
  applyBattleTimeout,
  createInitialWatchState,
  getRingAngles,
  getWatchCycleLabel,
  toggleWatchState,
} from "./dsumClock";
import type { WatchConfig } from "../types";

const config: WatchConfig = { cycleSec: 6.2, label: "6.2" };
const slowConfig: WatchConfig = { cycleSec: 6.5, label: "6.5" };

describe("dsumClock", () => {
  it("creates a field state", () => {
    expect(createInitialWatchState(1000)).toEqual({
      phase: "afterBattle",
      startTime: 1000,
      battleEndTime: 1000,
    });
  });

  it("toggles between battle and after-battle states immutably", () => {
    const battle = toggleWatchState(createInitialWatchState(1000), 1000);
    const afterBattle = toggleWatchState(battle, 2000);

    expect(afterBattle).toEqual({
      phase: "afterBattle",
      startTime: 1000,
      battleEndTime: 2000,
    });
    expect(toggleWatchState(afterBattle, 3000)).toEqual({
      phase: "battle",
      startTime: 3000,
      battleEndTime: 3000,
    });
    expect(battle.phase).toBe("battle");
  });

  it("forces battle state to after-battle after five minutes", () => {
    const state = toggleWatchState(createInitialWatchState(0), 0);

    expect(applyBattleTimeout(state, 300_001)).toMatchObject({
      phase: "afterBattle",
      battleEndTime: 300_001,
    });
  });

  it("keeps outer ring hidden during battle and visible after battle", () => {
    const battle = toggleWatchState(createInitialWatchState(0), 0);
    const afterBattle = toggleWatchState(battle, 1000);

    expect(getRingAngles(config, battle, 1000).outer).toBeNull();
    expect(getRingAngles(config, afterBattle, 2000).outer).toEqual(expect.any(Number));
  });

  it("reverses the field ring direction for Pikachu version", () => {
    const battle = toggleWatchState(createInitialWatchState(0), 0);
    const afterBattle = toggleWatchState(battle, 1000);
    const redOuter = getRingAngles(config, afterBattle, 2000, "RED").outer;
    const yellowOuter = getRingAngles(config, afterBattle, 2000, "YELLOW").outer;

    expect(redOuter).toEqual(expect.any(Number));
    expect(yellowOuter).toEqual(expect.any(Number));
    if (redOuter === null || yellowOuter === null) {
      throw new Error("Field rings should be visible after battle.");
    }
    expect(yellowOuter).toBeGreaterThan(redOuter);
  });

  it("uses double cycle timing for both field and battle in Pikachu version", () => {
    const battle = toggleWatchState(createInitialWatchState(0), 0);
    const field = createInitialWatchState(0);
    const now = config.cycleSec * 1000;
    const battleAngle = getRingAngles(config, battle, now, "YELLOW").inner;
    const fieldAngle = getRingAngles(config, field, now, "YELLOW").outer;

    expect(fieldAngle).toEqual(expect.any(Number));
    if (fieldAngle === null) {
      throw new Error("Field ring should be visible outside battle.");
    }
    expect(battleAngle).toBeCloseTo(Math.PI / 2);
    expect(fieldAngle).toBeCloseTo(Math.PI / 2);
  });

  it("shows doubled cycle labels for Pikachu version", () => {
    expect(getWatchCycleLabel(config, "RED")).toBe("6.2");
    expect(getWatchCycleLabel(config, "YELLOW")).toBe("12.4");
    expect(getWatchCycleLabel(slowConfig, "YELLOW")).toBe("13.0");
  });
});
