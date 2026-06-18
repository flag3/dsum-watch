import {
  ENGLISH_ROUTE_NAMES_BY_ID,
  JAPANESE_ROUTE_NAMES_BY_ID,
  type RouteId,
} from "../constants/routeCatalog";
import { getPokemonName as getLocalizedPokemonName } from "../constants/pokemonNames";
import type { Game, Language } from "../types";

export const SUPPORTED_LANGUAGES: readonly {
  readonly id: Language;
  readonly name: string;
}[] = [
  { id: "en", name: "English" },
  { id: "ja", name: "日本語" },
];

const TRANSLATIONS = {
  ja: {
    "app.credit.before": "",
    "app.credit.after":
      "さん作成のDSumWatchをもとに、エンカウントリスト表示機能を追加して公開しています。",
    "settings.label": "設定",
    "settings.game": "バージョン",
    "settings.route": "マップ",
    "settings.language": "言語",
    "encounters.title": "エンカウントリスト",
    "encounters.modeLabel": "エンカウント種別",
    "encounters.ground": "地上",
    "encounters.water": "水上",
    "encounters.empty": "この設定のエンカウントリストはありません。",
    "watch.battle": "戦闘中",
    "watch.field": "フィールド",
    "watch.toggle": "切替",
    "keyboard.space": "切替",
  },
  en: {
    "app.credit.before": "Published based on DSumWatch created by ",
    "app.credit.after": ", with an added encounter list display.",
    "settings.label": "Settings",
    "settings.game": "Version",
    "settings.route": "Map",
    "settings.language": "Language",
    "encounters.title": "Encounter list",
    "encounters.modeLabel": "Encounter type",
    "encounters.ground": "Grass",
    "encounters.water": "Surfing",
    "encounters.empty": "There is no encounter list for this setting.",
    "watch.battle": "In battle",
    "watch.field": "Field",
    "watch.toggle": "Toggle",
    "keyboard.space": "Toggle",
  },
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)["ja"];

const GAME_NAMES: Record<Language, Readonly<Record<Game, string>>> = {
  ja: {
    RED: "赤",
    GREEN: "緑",
    BLUE: "青",
    YELLOW: "ピカチュウ",
  },
  en: {
    RED: "Red",
    GREEN: "Green",
    BLUE: "Blue",
    YELLOW: "Yellow",
  },
};

const SELECTABLE_GAMES: Record<Language, readonly Game[]> = {
  ja: ["RED", "GREEN", "BLUE", "YELLOW"],
  en: ["RED", "BLUE", "YELLOW"],
};

export function getTranslation(language: Language, key: TranslationKey): string {
  return TRANSLATIONS[language][key];
}

export function normalizeLanguage(language: string): Language {
  return language === "ja" ? "ja" : "en";
}

export function getBrowserLanguage(languages: readonly string[]): Language {
  const primaryLanguage = languages[0]?.toLowerCase() ?? "";
  return primaryLanguage === "ja" || primaryLanguage.startsWith("ja-") ? "ja" : "en";
}

export function getInitialLanguage(): Language {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const languages = navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  return getBrowserLanguage(languages);
}

export function getGameName(game: Game, language: Language): string {
  return GAME_NAMES[language][game];
}

export function getSelectableGames(language: Language): readonly Game[] {
  return SELECTABLE_GAMES[language];
}

export function getLocalizedDataGame(game: Game, language: Language): Game {
  return language === "en" && game === "BLUE" ? "GREEN" : game;
}

export function getRouteName(routeId: string, language: Language): string {
  const names = language === "en" ? ENGLISH_ROUTE_NAMES_BY_ID : JAPANESE_ROUTE_NAMES_BY_ID;
  return names[routeId as RouteId] ?? routeId;
}

export function getPokemonName(dex: number, language: Language, fallback: string): string {
  return getLocalizedPokemonName(dex, language, fallback);
}

export function formatLevel(level: number, language: Language): string {
  return language === "en" ? `Lv. ${level}` : `Lv ${level}`;
}

export function formatSeconds(label: string, language: Language): string {
  return language === "en" ? `${label} sec` : `${label}秒`;
}
