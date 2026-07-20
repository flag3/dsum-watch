import { FormControl, Select } from "@primer/react";

import { ROUTES } from "../constants/localRoutes";
import {
  getGameName,
  getRouteName,
  getSelectableGames,
  getTranslation,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from "../i18n/i18n";
import type { Game, Language, SelectionConfig } from "../types";

interface SettingsPanelProps {
  readonly language: Language;
  readonly selection: SelectionConfig;
  readonly onGameChange: (game: Game) => void;
  readonly onLanguageChange: (language: Language) => void;
  readonly onRouteChange: (routeId: string) => void;
}

export function SettingsPanel({
  language,
  selection,
  onGameChange,
  onLanguageChange,
  onRouteChange,
}: SettingsPanelProps) {
  return (
    <section className="settings-panel" aria-label={getTranslation(language, "settings.label")}>
      <FormControl>
        <FormControl.Label>{getTranslation(language, "settings.game")}</FormControl.Label>
        <Select
          block
          onChange={(event) => onGameChange(event.target.value as Game)}
          value={selection.game}
        >
          {getSelectableGames(language).map((game) => (
            <Select.Option key={game} value={game}>
              {getGameName(game, language)}
            </Select.Option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormControl.Label>{getTranslation(language, "settings.route")}</FormControl.Label>
        <Select
          block
          onChange={(event) => onRouteChange(event.target.value)}
          value={selection.routeId}
        >
          {ROUTES.map((route) => (
            <Select.Option key={route.id} value={route.id}>
              {getRouteName(route.id, language)}
            </Select.Option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormControl.Label>{getTranslation(language, "settings.language")}</FormControl.Label>
        <Select
          block
          onChange={(event) => onLanguageChange(normalizeLanguage(event.target.value))}
          value={language}
        >
          {SUPPORTED_LANGUAGES.map((supportedLanguage) => (
            <Select.Option key={supportedLanguage.id} value={supportedLanguage.id}>
              {supportedLanguage.name}
            </Select.Option>
          ))}
        </Select>
      </FormControl>
    </section>
  );
}
