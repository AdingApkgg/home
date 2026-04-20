"use client";

import { useEffect } from "react";
import { THEME_STYLES, useMain, type ThemeStyle } from "@/store/main";

/**
 * Applies theme (color palette + light/dark) to <html>.
 * - themeStyle === null → random on load
 * - light/dark follows prefers-color-scheme
 */
export function ThemeProvider() {
  const themeStyle = useMain((s) => s.themeStyle);

  useEffect(() => {
    const html = document.documentElement;
    const applied: ThemeStyle =
      themeStyle ?? THEME_STYLES[Math.floor(Math.random() * THEME_STYLES.length)]!;
    html.dataset.theme = applied;
  }, [themeStyle]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (dark: boolean) => {
      document.documentElement.classList.toggle("dark", dark);
    };
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return null;
}
