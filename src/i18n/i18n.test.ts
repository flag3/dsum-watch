import { describe, expect, it } from "vitest";
import {
  formatLevel,
  formatSeconds,
  getGameName,
  getLocalizedDataGame,
  getPokemonName,
  getRouteName,
  getSelectableGames,
  getTranslation,
  getBrowserLanguage,
  normalizeLanguage,
} from "./i18n";

describe("i18n", () => {
  it("returns English UI copy and localized names", () => {
    expect(getTranslation("en", "settings.game")).toBe("Version");
    expect(getTranslation("en", "encounters.title")).toBe("Encounter list");
    expect(getTranslation("en", "watch.toggleToBattle")).toBe("Start battle");
    expect(getTranslation("en", "watch.toggleToField")).toBe("Return to field");
    expect(getGameName("YELLOW", "en")).toBe("Yellow");
    expect(getRouteName("ROUTE_1", "en")).toBe("Route 1");
    expect(getPokemonName(16, "en", "ポッポ")).toBe("Pidgey");
    expect(formatLevel(3, "en")).toBe("Lv. 3");
    expect(formatSeconds("6.2", "en")).toBe("6.2 sec");
  });

  it("keeps Japanese as the default localized copy", () => {
    expect(getTranslation("ja", "settings.game")).toBe("バージョン");
    expect(getGameName("RED", "ja")).toBe("赤");
    expect(getRouteName("ROUTE_1", "ja")).toBe("1ばんどうろ");
    expect(getPokemonName(16, "ja", "Pidgey")).toBe("ポッポ");
    expect(formatLevel(3, "ja")).toBe("Lv 3");
    expect(formatSeconds("6.2", "ja")).toBe("6.2秒");
  });

  it("uses the international version list for English", () => {
    expect(getSelectableGames("en")).toEqual(["RED", "BLUE", "YELLOW"]);
    expect(getSelectableGames("ja")).toEqual(["RED", "GREEN", "BLUE", "YELLOW"]);
  });

  it("maps English Blue to the Japanese Green encounter data", () => {
    expect(getLocalizedDataGame("BLUE", "en")).toBe("GREEN");
    expect(getLocalizedDataGame("BLUE", "ja")).toBe("BLUE");
    expect(getLocalizedDataGame("RED", "en")).toBe("RED");
  });

  it("falls back to English for every non-Japanese language value", () => {
    expect(normalizeLanguage("ja")).toBe("ja");
    expect(normalizeLanguage("en")).toBe("en");
    expect(normalizeLanguage("")).toBe("en");
    expect(normalizeLanguage("fr")).toBe("en");
    expect(normalizeLanguage("ja-JP")).toBe("en");
  });

  it("opens in Japanese only when the browser primary language is Japanese", () => {
    expect(getBrowserLanguage(["ja"])).toBe("ja");
    expect(getBrowserLanguage(["ja-JP"])).toBe("ja");
    expect(getBrowserLanguage(["en-US", "ja-JP"])).toBe("en");
    expect(getBrowserLanguage(["fr"])).toBe("en");
    expect(getBrowserLanguage([])).toBe("en");
  });
});
