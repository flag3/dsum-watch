import type { SelectPanelProps } from "@primer/react";
import {
  useState,
  type PropsWithChildren,
  type ReactElement,
  type PointerEvent,
  type MouseEvent,
  type FocusEvent,
} from "react";
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
    useState: vi.fn((initial: unknown) => react.useState(initial === "" ? panel.filter : initial)),
  };
});

it("starts touch browsing at the title and keeps search focus for mouse and keyboard", () => {
  const setBrowseMapsFirst = vi.fn();
  const setSearchActivated = vi.fn();
  const matchMedia = vi.fn(() => ({ matches: false }));
  vi.stubGlobal("window", { matchMedia });
  for (const browseMapsFirst of [false, true]) {
    vi.mocked(useState)
      .mockReturnValueOnce([false, vi.fn()])
      .mockReturnValueOnce(["", vi.fn()])
      .mockReturnValueOnce([browseMapsFirst, setBrowseMapsFirst])
      .mockReturnValueOnce([false, setSearchActivated]);
    renderToStaticMarkup(
      <SettingsPanel
        language="ja"
        selection={{ game: "RED", routeId: "ROUTE_1" }}
        onGameChange={vi.fn()}
        onLanguageChange={vi.fn()}
        onRouteChange={vi.fn()}
      />,
    );
    const props = panel.props!;
    if (browseMapsFirst) {
      expect(props.onInputRefChanged).toBeTypeOf("function");
      expect(props.overlayProps?.initialFocusRef).toBe(
        (props.title as ReactElement<{ ref: unknown }>).props.ref,
      );
      expect(props.textInputProps?.disabled).not.toBe(true);
      expect((props.title as ReactElement<{ tabIndex: number }>).props.tabIndex).toBe(-1);
      expect(props.textInputProps?.readOnly).toBe(true);
      const titleFocus = vi.fn();
      const titleRef = props.overlayProps!.initialFocusRef!;
      titleRef.current = { focus: titleFocus } as unknown as HTMLElement;
      const inputFocus = vi.fn();
      const input = { readOnly: true, focus: inputFocus } as unknown as HTMLInputElement;
      props.textInputProps?.onFocus?.({ currentTarget: input } as FocusEvent<HTMLInputElement>);
      expect(titleFocus).toHaveBeenCalledOnce();
      props.textInputProps?.onClick?.({ currentTarget: input } as MouseEvent<HTMLInputElement>);
      expect(input.readOnly).toBe(false);
      expect(inputFocus).toHaveBeenCalledOnce();
      expect(setSearchActivated).toHaveBeenLastCalledWith(true);
    } else {
      expect(props.onInputRefChanged).toBeUndefined();
      expect(props.overlayProps).toBeUndefined();
    }
    const anchor = props.renderAnchor!({}) as ReactElement<{
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
    }>;
    for (const pointerType of ["touch", "pen", "mouse"]) {
      anchor.props.onPointerDown({ pointerType } as PointerEvent<HTMLButtonElement>);
      props.onOpenChange(true, "anchor-click");
      expect(setBrowseMapsFirst).toHaveBeenLastCalledWith(pointerType !== "mouse");
      props.onOpenChange(true, "anchor-key-press");
      expect(setBrowseMapsFirst).toHaveBeenLastCalledWith(false);
    }
    matchMedia.mockReturnValueOnce({ matches: true });
    props.onOpenChange(true, "anchor-click");
    expect(setBrowseMapsFirst).toHaveBeenLastCalledWith(true);
  }
  vi.unstubAllGlobals();
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
