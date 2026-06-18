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
      <div className="settings-field">
        <label htmlFor="game">{getTranslation(language, "settings.game")}</label>
        <select
          id="game"
          onChange={(event) => onGameChange(event.target.value as Game)}
          value={selection.game}
        >
          {getSelectableGames(language).map((game) => (
            <option key={game} value={game}>
              {getGameName(game, language)}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-field route-field">
        <label htmlFor="route">{getTranslation(language, "settings.route")}</label>
        <select
          id="route"
          onChange={(event) => onRouteChange(event.target.value)}
          value={selection.routeId}
        >
          {ROUTES.map((route) => (
            <option key={route.id} value={route.id}>
              {getRouteName(route.id, language)}
            </option>
          ))}
        </select>
      </div>

      <div className="settings-field language-field">
        <label htmlFor="language">{getTranslation(language, "settings.language")}</label>
        <select
          id="language"
          onChange={(event) => onLanguageChange(normalizeLanguage(event.target.value))}
          value={language}
        >
          {SUPPORTED_LANGUAGES.map((supportedLanguage) => (
            <option key={supportedLanguage.id} value={supportedLanguage.id}>
              {supportedLanguage.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
