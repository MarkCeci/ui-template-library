import type { StylePack } from "@/lib/catalog";
import { normalizeStyle } from "@/lib/style-theme";

type HandoffMode = {
  colors: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    primarySoft: string;
    secondary: string;
    secondarySoft: string;
    accent: string;
    accentSoft: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceMuted: string;
    textPrimary: string;
    textSecondary: string;
    textInverse: string;
    border: string;
    divider: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
  };
  shadow: {
    card: string;
    floating: string;
    glow: string;
  };
};

export type ThemeHandoffTokens = {
  light: HandoffMode;
  dark: HandoffMode;
  shared: {
    radius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    typography: {
      fontFamily: string;
      headingWeight: number;
      bodyWeight: number;
    };
    spacing: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    effects: {
      blur: string;
      glassOpacity: number;
    };
    density: string;
  };
};

type HandoffSource = StylePack | Record<string, unknown>;

export function getThemeHandoffTokens(source: HandoffSource): ThemeHandoffTokens {
  const rawTokens = isRecord(source.tokens) ? source.tokens : null;
  const explicit = rawTokens ? normalizeExplicitTokens(rawTokens) : null;
  if (explicit) return explicit;

  const normalized = normalizeStyle(source as StylePack);
  const palette = normalized.palette;

  return {
    light: buildMode({
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: palette.background || "#F8FAFC",
      surface: palette.surface || "#FFFFFF",
      surfaceMuted: "#F1F5F9",
      textPrimary: palette.textPrimary || "#0F172A",
      textSecondary: palette.textSecondary || "#475569",
      textInverse: "#FFFFFF",
      border: palette.border || "#E2E8F0",
      dark: false,
    }),
    dark: buildMode({
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: "#0F172A",
      surface: "#111827",
      surfaceMuted: "#1E293B",
      textPrimary: "#F8FAFC",
      textSecondary: "#CBD5E1",
      textInverse: "#0F172A",
      border: "rgba(148, 163, 184, 0.22)",
      dark: true,
    }),
    shared: {
      radius: {
        sm: "8px",
        md: normalized.tokens.radius.control,
        lg: normalized.tokens.radius.card,
        xl: "24px",
      },
      typography: {
        fontFamily: "Arial, Helvetica, system-ui, sans-serif",
        headingWeight: 700,
        bodyWeight: 500,
      },
      spacing: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      effects: {
        blur: "16px",
        glassOpacity: 0.72,
      },
      density: normalized.source.layoutDensity ?? "comfortable",
    },
  };
}

export function generateCssVariables(source: HandoffSource) {
  const tokens = getThemeHandoffTokens(source);
  return [
    ":root {",
    ...modeCss(tokens.light),
    ...sharedCss(tokens.shared),
    "}",
    "",
    '[data-theme="dark"] {',
    ...modeCss(tokens.dark),
    "}",
  ].join("\n");
}

export function generateTailwindConfig(source: HandoffSource) {
  const tokens = getThemeHandoffTokens(source);
  return `theme: {
  extend: {
    colors: {
      primary: "var(--color-primary)",
      primarySoft: "var(--color-primary-soft)",
      background: "var(--color-bg-page)",
      surface: "var(--color-bg-card)",
      muted: "var(--color-bg-muted)",
      border: "var(--color-border)",
      textPrimary: "var(--color-text-primary)",
      textSecondary: "var(--color-text-secondary)"
    },
    borderRadius: {
      sm: "${tokens.shared.radius.sm}",
      md: "${tokens.shared.radius.md}",
      lg: "${tokens.shared.radius.lg}",
      xl: "${tokens.shared.radius.xl}"
    },
    boxShadow: {
      card: "var(--shadow-card)",
      floating: "var(--shadow-floating)",
      glow: "var(--shadow-glow)"
    }
  }
}`;
}

export function generateDesignTokensJson(source: HandoffSource) {
  return JSON.stringify(getThemeHandoffTokens(source), null, 2);
}

export function generateReactThemeObject(source: HandoffSource) {
  const name = typeof source.name === "string" ? source.name : "enterpriseTheme";
  const tokens = getThemeHandoffTokens(source);
  return `export const theme = ${JSON.stringify({ name, ...tokens }, null, 2)} as const;`;
}

export function generateThemeUsageExample(source: HandoffSource) {
  const name = typeof source.name === "string" ? source.name : "当前风格";
  return `/* 1. 把 CSS Variables 放到 global.css 或 theme.css */
@import "./theme.css";

/* 2. 页面和组件使用变量，不要写死颜色 */
.page {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}

.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.button-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
}

/* 3. React 示例 */
export function DemoCard() {
  return (
    <div className="card">
      <h3>客户运营看板</h3>
      <p>当前使用：${name}</p>
      <button className="button-primary">查看详情</button>
    </div>
  );
}

/* 4. 深色模式切换 */
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-theme", "light");`;
}

export function buildThemePackage(source: HandoffSource) {
  return {
    css: generateCssVariables(source),
    tailwind: generateTailwindConfig(source),
    tokensJson: generateDesignTokensJson(source),
    reactTheme: generateReactThemeObject(source),
    usage: generateThemeUsageExample(source),
  };
}

function normalizeExplicitTokens(tokens: Record<string, unknown>): ThemeHandoffTokens | null {
  const lightSource = readModeSource(tokens.light);
  const darkSource = readModeSource(tokens.dark);
  if (!lightSource && !darkSource) return null;

  const light = buildMode({
    primary: readString(lightSource, "primary", "#2563EB"),
    secondary: readString(lightSource, "secondary", "#60A5FA"),
    accent: readString(lightSource, "accent", "#7C3AED"),
    background: readString(lightSource, "background", "#F8FAFC"),
    surface: readString(lightSource, "surface", "#FFFFFF"),
    surfaceMuted: readString(lightSource, "surfaceMuted", "#F1F5F9"),
    textPrimary: readString(lightSource, "textPrimary", "#0F172A"),
    textSecondary: readString(lightSource, "textSecondary", "#475569"),
    textInverse: readString(lightSource, "textInverse", "#FFFFFF"),
    border: readString(lightSource, "border", "#E2E8F0"),
    dark: false,
  });
  const dark = buildMode({
    primary: readString(darkSource, "primary", light.colors.primary),
    secondary: readString(darkSource, "secondary", light.colors.secondary),
    accent: readString(darkSource, "accent", light.colors.accent),
    background: readString(darkSource, "background", "#0F172A"),
    surface: readString(darkSource, "surface", "#111827"),
    surfaceMuted: readString(darkSource, "surfaceMuted", "#1E293B"),
    textPrimary: readString(darkSource, "textPrimary", "#F8FAFC"),
    textSecondary: readString(darkSource, "textSecondary", "#CBD5E1"),
    textInverse: readString(darkSource, "textInverse", "#0F172A"),
    border: readString(darkSource, "border", "rgba(148, 163, 184, 0.22)"),
    dark: true,
  });

  const shared = isRecord(tokens.shared) ? tokens.shared : {};
  return {
    light,
    dark,
    shared: {
      radius: {
        sm: readNestedString(shared, ["radius", "sm"], "8px"),
        md: readNestedString(shared, ["radius", "md"], "12px"),
        lg: readNestedString(shared, ["radius", "lg"], "20px"),
        xl: readNestedString(shared, ["radius", "xl"], "28px"),
      },
      typography: {
        fontFamily: readNestedString(shared, ["typography", "fontFamily"], "Arial, Helvetica, system-ui, sans-serif"),
        headingWeight: readNestedNumber(shared, ["typography", "headingWeight"], 700),
        bodyWeight: readNestedNumber(shared, ["typography", "bodyWeight"], 500),
      },
      spacing: {
        sm: readNestedString(shared, ["spacing", "sm"], "8px"),
        md: readNestedString(shared, ["spacing", "md"], "16px"),
        lg: readNestedString(shared, ["spacing", "lg"], "24px"),
        xl: readNestedString(shared, ["spacing", "xl"], "32px"),
      },
      effects: {
        blur: readNestedString(shared, ["effects", "blur"], "16px"),
        glassOpacity: readNestedNumber(shared, ["effects", "glassOpacity"], 0.72),
      },
      density: readString(shared, "density", "comfortable"),
    },
  };
}

function buildMode(input: {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  dark: boolean;
}): HandoffMode {
  return {
    colors: {
      primary: input.primary,
      primaryHover: input.dark ? lighten(input.primary, 0.08) : darken(input.primary, 0.08),
      primaryActive: input.dark ? lighten(input.primary, 0.14) : darken(input.primary, 0.14),
      primarySoft: mix(input.primary, input.dark ? "#111827" : "#FFFFFF", input.dark ? 0.76 : 0.86),
      secondary: input.secondary,
      secondarySoft: mix(input.secondary, input.dark ? "#111827" : "#FFFFFF", input.dark ? 0.78 : 0.88),
      accent: input.accent,
      accentSoft: mix(input.accent, input.dark ? "#111827" : "#FFFFFF", input.dark ? 0.78 : 0.88),
      background: input.background,
      surface: input.surface,
      surfaceElevated: input.dark ? lighten(input.surface, 0.06) : "#FFFFFF",
      surfaceMuted: input.surfaceMuted,
      textPrimary: input.textPrimary,
      textSecondary: input.textSecondary,
      textInverse: input.textInverse,
      border: input.border,
      divider: input.border,
      success: input.dark ? "#34D399" : "#16A34A",
      warning: input.dark ? "#FBBF24" : "#D97706",
      danger: input.dark ? "#FB7185" : "#E11D48",
      info: input.dark ? "#38BDF8" : "#0284C7",
    },
    gradients: {
      hero: `linear-gradient(135deg, ${input.primary}, ${input.secondary})`,
      card: `linear-gradient(180deg, ${mix(input.primary, input.surface, 0.9)}, ${input.surface})`,
      button: `linear-gradient(135deg, ${input.primary}, ${input.secondary})`,
    },
    shadow: {
      card: input.dark ? "0 16px 36px rgba(0, 0, 0, 0.28)" : "0 12px 32px rgba(15, 23, 42, 0.08)",
      floating: input.dark ? "0 24px 60px rgba(0, 0, 0, 0.36)" : "0 24px 60px rgba(15, 23, 42, 0.12)",
      glow: `0 0 32px ${hexToRgba(input.primary, input.dark ? 0.26 : 0.16)}`,
    },
  };
}

function modeCss(mode: HandoffMode) {
  return [
    `  --color-primary: ${mode.colors.primary};`,
    `  --color-primary-hover: ${mode.colors.primaryHover};`,
    `  --color-primary-active: ${mode.colors.primaryActive};`,
    `  --color-primary-soft: ${mode.colors.primarySoft};`,
    `  --color-secondary: ${mode.colors.secondary};`,
    `  --color-secondary-soft: ${mode.colors.secondarySoft};`,
    `  --color-accent: ${mode.colors.accent};`,
    `  --color-accent-soft: ${mode.colors.accentSoft};`,
    `  --color-bg-page: ${mode.colors.background};`,
    `  --color-bg-card: ${mode.colors.surface};`,
    `  --color-bg-elevated: ${mode.colors.surfaceElevated};`,
    `  --color-bg-muted: ${mode.colors.surfaceMuted};`,
    `  --color-text-primary: ${mode.colors.textPrimary};`,
    `  --color-text-secondary: ${mode.colors.textSecondary};`,
    `  --color-text-inverse: ${mode.colors.textInverse};`,
    `  --color-border: ${mode.colors.border};`,
    `  --color-divider: ${mode.colors.divider};`,
    `  --color-success: ${mode.colors.success};`,
    `  --color-warning: ${mode.colors.warning};`,
    `  --color-danger: ${mode.colors.danger};`,
    `  --color-info: ${mode.colors.info};`,
    `  --gradient-hero: ${mode.gradients.hero};`,
    `  --gradient-card: ${mode.gradients.card};`,
    `  --gradient-button: ${mode.gradients.button};`,
    `  --shadow-card: ${mode.shadow.card};`,
    `  --shadow-floating: ${mode.shadow.floating};`,
    `  --shadow-glow: ${mode.shadow.glow};`,
  ];
}

function sharedCss(shared: ThemeHandoffTokens["shared"]) {
  return [
    `  --radius-sm: ${shared.radius.sm};`,
    `  --radius-md: ${shared.radius.md};`,
    `  --radius-lg: ${shared.radius.lg};`,
    `  --radius-xl: ${shared.radius.xl};`,
    `  --space-sm: ${shared.spacing.sm};`,
    `  --space-md: ${shared.spacing.md};`,
    `  --space-lg: ${shared.spacing.lg};`,
    `  --space-xl: ${shared.spacing.xl};`,
    `  --font-family-base: ${shared.typography.fontFamily};`,
  ];
}

function readModeSource(value: unknown) {
  if (!isRecord(value)) return null;
  return isRecord(value.colors) ? value.colors : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(source: Record<string, unknown> | null | undefined, key: string, fallback: string) {
  const value = source?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readNestedString(source: Record<string, unknown>, path: string[], fallback: string) {
  const value = path.reduce<unknown>((current, key) => (isRecord(current) ? current[key] : undefined), source);
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readNestedNumber(source: Record<string, unknown>, path: string[], fallback: number) {
  const value = path.reduce<unknown>((current, key) => (isRecord(current) ? current[key] : undefined), source);
  return typeof value === "number" ? value : fallback;
}

function hexToRgb(hex: string) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return { r: 37, g: 99, b: 235 };
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function mix(a: string, b: string, weight = 0.5) {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  return rgbToHex(
    Math.round(first.r * (1 - weight) + second.r * weight),
    Math.round(first.g * (1 - weight) + second.g * weight),
    Math.round(first.b * (1 - weight) + second.b * weight),
  );
}

function lighten(hex: string, amount: number) {
  return mix(hex, "#FFFFFF", amount);
}

function darken(hex: string, amount: number) {
  return mix(hex, "#000000", amount);
}

function hexToRgba(hex: string, alpha: number) {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
