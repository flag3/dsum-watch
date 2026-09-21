import { ActionMenu, FormControl, Select, SelectPanel } from "@primer/react";
import { Card } from "@primer/react/experimental";
import { useRef, useState } from "react";

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
  const [routePanelOpen, setRoutePanelOpen] = useState(false);
  const [routeFilter, setRouteFilter] = useState("");
  const [browseMapsFirst, setBrowseMapsFirst] = useState(false);
  const [searchActivated, setSearchActivated] = useState(false);
  const routeTitleRef = useRef<HTMLSpanElement>(null);
  const openedWithTouch = useRef(false);
  const routeItems = ROUTES.map((route) => ({
    id: route.id,
    text: getRouteName(route.id, language),
  }));
  const filteredRouteItems = routeItems.filter((item) =>
    item.text.toLowerCase().includes(routeFilter.trim().toLowerCase()),
  );

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

        <FormControl>
          <FormControl.Label>{getTranslation(language, "settings.route")}</FormControl.Label>
          <SelectPanel
            height="xlarge"
            open={routePanelOpen}
            onOpenChange={(open, gesture) => {
              if (open) {
                setBrowseMapsFirst(
                  gesture === "anchor-click" &&
                    (openedWithTouch.current || window.matchMedia("(pointer: coarse)").matches),
                );
                setSearchActivated(false);
              }
              setRoutePanelOpen(open);
              setRouteFilter("");
            }}
            selected={routeItems.find((item) => item.id === selection.routeId)}
            onSelectedChange={(item: { id?: string | number } | undefined) => {
              if (typeof item?.id === "string") onRouteChange(item.id);
            }}
            items={filteredRouteItems}
            filterValue={routeFilter}
            onFilterChange={setRouteFilter}
            title={
              <span ref={routeTitleRef} tabIndex={-1}>
                {getTranslation(language, "settings.route")}
              </span>
            }
            {...(browseMapsFirst && {
              // Keep Primer from registering the search field as its initial focus target.
              onInputRefChanged: () => undefined,
              overlayProps: {
                initialFocusRef: routeTitleRef,
                onKeyDownCapture: () => setSearchActivated(true),
              },
              textInputProps: {
                // Primer also focuses the input through its focus trap; block the keyboard until requested.
                readOnly: !searchActivated,
                onFocus: (event) => {
                  if (event.currentTarget.readOnly) routeTitleRef.current?.focus();
                },
                onClick: (event) => {
                  event.currentTarget.readOnly = false;
                  setSearchActivated(true);
                  event.currentTarget.focus();
                },
              },
            })}
            placeholderText={getTranslation(language, "settings.routeSearch")}
            message={
              filteredRouteItems.length === 0
                ? {
                    variant: "empty",
                    title: getTranslation(language, "settings.routeEmpty"),
                    body: "",
                  }
                : undefined
            }
            renderAnchor={({ children, ...props }) => (
              <ActionMenu.Button
                {...props}
                block
                alignContent="start"
                onPointerDown={(event) => {
                  openedWithTouch.current =
                    event.pointerType === "touch" || event.pointerType === "pen";
                }}
              >
                {children}
              </ActionMenu.Button>
            )}
          />
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
      </div>
    </Card>
  );
}
