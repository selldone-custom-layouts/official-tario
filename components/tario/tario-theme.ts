/*
 * Tario — the theme switcher's config (the footer's "Theme" row since
 * 10 November 2026, the header button before: the same on every molino
 * Layout as on Digito and Besti).
 *
 * The switcher itself is Layout-agnostic (components/theme-switcher/); this
 * file is everything Tario-specific: the palettes, which Kalio variables
 * each palette value feeds, the dark token set, and Vuetify's dark surfaces.
 * storefront.ts calls bootThemeSwitcher(TARIO_THEME, vuetify) before
 * mounting, so the chosen theme paints first, with no flash.
 *
 * Tario's dress: a white header and floor, light-grey wells; the action
 * colour (red) carries buttons, links and chosen states, a deeper shade
 * ("deep") the hovers and bands, a pale tint ("soft") the chosen rows. A
 * saving stays red in every palette (--k-coral).
 *
 * Contrast (WCAG 2.1, measured): white on each light primary — red 5.89,
 * blue 6.97, green 6.99, violet 7.10, teal 6.51. White on each dark primary
 * — 5.04, 5.17, 5.48, 5.21, 5.36, each 3:1 or more against the dark card
 * #161d2e; each dark "text" colour on that card — 7.41, 7.86, 11.03, 9.11,
 * 11.60.
 */
import type { ThemeSwitcherConfig } from "../theme-switcher/theme-switcher";
import { THEME_SETTINGS } from "./tario-theme.settings";
import { t } from "../kalio/i18n/kalio-i18n";

/* Plain hex mixes (not color-mix), so the audits can measure them. */
const mix = (c: string, pct: number, base: string): string => {
  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [rgb(c), rgb(base)];
  return "#" + a.map((v, i) => Math.round((v * pct + b[i] * (100 - pct)) / 100).toString(16).padStart(2, "0")).join("");
};

export const TARIO_THEME: ThemeSwitcherConfig = {
  settings: THEME_SETTINGS,

  /* The owner (9 November 2026): a merchant who imports Tario into their
     own shop must not see the switcher. With themeSwitcher "showcase" it
     shows only on these shops (window.shop.id, else <meta name="shop-name">). */
  showcaseShops: [
    { id: 15549, name: "digini-hzgablru" }, // Digini: Digito, Besti
    { id: 15645, name: "molino" }, // Molino: Molino, Tario, Walio, Dino, Valero
  ],

  storageKey: "tario-theme",
  darkClass: "tr-dark",

  palettes: [
    {
      id: "red",
      get name() {
        return t("tario.palette.red", "Tario red");
      },
      light: { primary: "#cc0000", deep: "#a30000", lift: "#e01b1b", soft: "#fdeeee", onPrimary: "#ffffff", text: "#cc0000" },
      dark: { primary: "#d42a2a", deep: "#a30000", lift: "#e04848", soft: "#3d1a1a", onPrimary: "#ffffff", text: "#ff8a8a" },
    },
    {
      id: "blue",
      get name() {
        return t("tario.palette.blue", "Ocean blue");
      },
      light: { primary: "#0a4bd8", deep: "#0838a8", lift: "#2563eb", soft: "#e8efff", onPrimary: "#ffffff", text: "#0a4bd8" },
      dark: { primary: "#2563eb", deep: "#1d4ed8", lift: "#3b82f6", soft: "#16264d", onPrimary: "#ffffff", text: "#8fb0ff" },
    },
    {
      id: "green",
      get name() {
        return t("tario.palette.green", "Green");
      },
      light: { primary: "#05664a", deep: "#064e3b", lift: "#047857", soft: "#e3f6ee", onPrimary: "#ffffff", text: "#05664a" },
      dark: { primary: "#047857", deep: "#065f46", lift: "#059669", soft: "#123a30", onPrimary: "#ffffff", text: "#6ee7b7" },
    },
    {
      id: "violet",
      get name() {
        return t("tario.palette.violet", "Violet");
      },
      light: { primary: "#6d28d9", deep: "#5b21b6", lift: "#7c3aed", soft: "#efe8fd", onPrimary: "#ffffff", text: "#6d28d9" },
      dark: { primary: "#8046ee", deep: "#6d28d9", lift: "#8b5cf6", soft: "#2a1d4d", onPrimary: "#ffffff", text: "#c4b5fd" },
    },
    {
      id: "teal",
      get name() {
        return t("tario.palette.teal", "Teal");
      },
      light: { primary: "#0c6680", deep: "#164e63", lift: "#0e7490", soft: "#e0f4f8", onPrimary: "#ffffff", text: "#0c6680" },
      dark: { primary: "#0e7490", deep: "#155e75", lift: "#0891b2", soft: "#123540", onPrimary: "#ffffff", text: "#67e8f9" },
    },
  ],

  /* Palette value -> the Kalio variables that carry it (--k-green* is
     Kalio's name for the action colour, whatever its hue). */
  tokens: {
    "--k-green": "primary",
    "--k-green-deep": "deep",
    "--k-green-lift": "lift",
    "--k-leaf": "lift",
    "--k-green-soft": "soft",
    "--k-on-green": "onPrimary",
    "--t-link": "text",
    "--t-band": "light.deep",
    "--t-primary-rgb": "primary:rgb",
    "--t-on-brand": "onPrimary",
    "--t-on-brand-rgb": "onPrimary:rgb",
  },

  /* While dark (Digito's neutrals, the same on every molino Layout but
     Valero). The packshot wells stay light; the sale red lightens as words
     (--t-sale-solid keeps it for badges with white words). */
  dark: {
    "--t-ink-bg": "var(--k-green)",
    "--k-ink": "#e8ecf3",
    "--k-ink-2": "#d3d9e3",
    "--k-muted": "#a3adbd",
    "--k-paper": "#0d1220",
    "--k-wash": "#1e2639",
    "--k-card": "#161d2e",
    "--k-plain": "#1e2639",
    "--k-line": "#2a3347",
    "--k-line-strong": "#6b7690",
    "--k-line-soft": "#232b3d",
    "--k-coral": "#ff8a8a",
    "--k-coral-soft": "#3d1a1a",
    "--k-amber": "#fbbf24",
    "--k-star-off": "#6b7690",
    "--k-shadow": "0 10px 28px -14px rgba(0, 0, 0, 0.7)",
  },

  vuetify: {
    light: "light",
    dark: "dark",
    paletteColors: { primary: "primary", "on-primary": "onPrimary" },
    darkColors: {
      background: "#0d1220",
      surface: "#161d2e",
      "surface-bright": "#1e2639",
      "surface-variant": "#2a3347",
      "on-background": "#e8ecf3",
      "on-surface": "#e8ecf3",
      "on-surface-variant": "#c3cbd8",
      "on-primary": "#ffffff",
      secondary: "#e8ecf3",
      "on-secondary": "#0d1220",
      error: "#ff6b7d",
      info: "#7aa2ff",
      success: "#4ade80",
      warning: "#fbbf24",
    },
  },

  metaThemeColor: "light.primary",
  ui: { ink: "var(--k-ink)", muted: "var(--k-muted)", line: "var(--k-line)", surface: "var(--k-card)", font: "var(--k-body)" },
  /* Getters: the words follow the visitor's language (kalio-i18n). */
  labels: {
    get theme() {
      return t("theme.title", "Theme");
    },
    get palettes() {
      return t("theme.palettes", "Colour");
    },
    get mode() {
      return t("theme.mode", "Light or dark");
    },
    get modeTitle() {
      return t("theme.modeTitle", "Mode");
    },
    get light() {
      return t("theme.light", "Light");
    },
    get dark() {
      return t("theme.dark", "Dark");
    },
    get custom() {
      return t("theme.custom", "Custom colour");
    },
    get adjusted() {
      return t("theme.adjusted", "Adjusted for readability");
    },
    get brand() {
      return t("theme.brand", "Brand colour");
    },
  },

  /* "Custom colour" (the owner, 9 November 2026): any colour, made readable
     by paletteFromColor(). Tario's bands carry pale words on the action
     colour, so white on the light primary must reach 6.5:1. */
  custom: {
    headerContrast: 6.5,
    darkSurfaces: ["#0d1220", "#161d2e", "#1e2639"],
    darkText: "#1f1f1f",
    extras: (v, mode) => (mode === "light" ? { lift: mix(v.primary, 82, "#ffffff") } : { lift: mix(v.primary, 85, "#ffffff") }),
  },
};
