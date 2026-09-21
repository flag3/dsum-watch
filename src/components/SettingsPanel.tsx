import { FormControl, Select } from "@primer/react";
import { Card } from "@primer/react/experimental";

import {
  getGameName,
  getSelectableGames,
  getTranslation,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from "../i18n/i18n";
import type { Game, Language, SelectionConfig } from "../types";
import { RouteSelect } from "./RouteSelect";

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
    <Card
      as="section"
      aria-label={getTranslation(language, "settings.label")}
      borderRadius="medium"
      padding="none"
    >
      <div className="settings-panel">
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

        <RouteSelect
          language={language}
          routeId={selection.routeId}
          onRouteChange={onRouteChange}
        />

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
      </div>
    </Card>
  );
}
