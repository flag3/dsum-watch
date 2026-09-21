import type { SelectPanelProps } from "@primer/react";
import type { PropsWithChildren } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";

import { SettingsPanel } from "./SettingsPanel";

const panel = vi.hoisted(() => ({ props: undefined as SelectPanelProps | undefined, filter: "" }));

vi.mock("@primer/react", () => ({
  ActionMenu: { Button: "button" },
  FormControl: Object.assign(({ children }: PropsWithChildren) => children, { Label: "label" }),
  Select: Object.assign(() => null, { Option: "option" }),
  SelectPanel: (props: SelectPanelProps) => {
    panel.props = props;
    return null;
  },
}));

vi.mock("@primer/react/experimental", () => ({
  Card: ({ children }: PropsWithChildren) => children,
}));

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();
  return {
    ...react,
    useState: (initial: unknown) => react.useState(initial === "" ? panel.filter : initial),
  };
});

it("filters localized maps while preserving the selection and reporting map changes", () => {
  const onRouteChange = vi.fn();
  for (const [language, filter, text] of [
    ["ja", "", "2ばんどうろ"],
    ["en", " ROUTE 2 ", "Route 2"],
    ["ja", "2ばん", "2ばんどうろ"],
    ["ja", "no matching map", undefined],
  ] as const) {
    panel.filter = filter;
    renderToStaticMarkup(
      <SettingsPanel
        language={language}
        selection={{ game: "RED", routeId: "ROUTE_1" }}
        onGameChange={vi.fn()}
        onLanguageChange={vi.fn()}
        onRouteChange={onRouteChange}
      />,
    );
    const props = panel.props!;
    expect(props.height).toBe("xlarge");
    expect(props.selected).toMatchObject({ id: "ROUTE_1" });
    if (text) {
      expect(props.message).toBeUndefined();
      expect(props.items).toContainEqual({ id: "ROUTE_2", text });
      if (filter) {
        expect(props.items).not.toContainEqual(expect.objectContaining({ id: "ROUTE_1" }));
      } else {
        expect(props.items).toContainEqual(expect.objectContaining({ id: "ROUTE_1" }));
      }
    } else {
      expect(props.items).toEqual([]);
      expect(props.message).toMatchObject({ variant: "empty" });
    }
  }
  const onSelectedChange = panel.props!.onSelectedChange as (
    item: { id: string } | undefined,
  ) => void;
  onSelectedChange({ id: "ROUTE_2" });
  onSelectedChange(undefined);
  expect(onRouteChange.mock.calls).toEqual([["ROUTE_2"]]);
});
