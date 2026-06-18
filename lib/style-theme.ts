import type { CSSProperties } from "react";
import { buildPrompt, formatStyleValue, type StylePack } from "@/lib/catalog";

export type AudienceScope = "b2b" | "b2c" | "universal";
export type EndpointFilter = "全部" | "后台端" | "移动端" | "通用";
export type MoodFilter =
  | "全部"
  | "商务稳重"
  | "科技AI"
  | "活力年轻"
  | "高级轻奢"
  | "医疗健康"
  | "本地生活"
  | "国潮文化"
  | "暗色酷炫"
  | "梦幻渐变";

export type ColorPreference =
  | "全部"
  | "蓝色系"
  | "紫色系"
  | "绿色系"
  | "青色系"
  | "橙色系"
  | "红粉系"
  | "黑金系"
  | "黑白灰"
  | "渐变多彩";

export type PreviewScenario =
  | "enterprise-workbench"
  | "saas-admin-list"
  | "dark-dashboard"
  | "ai-assistant"
  | "mobile-workbench"
  | "medical-health"
  | "finance-dashboard"
  | "local-service"
  | "ecommerce-operation";

export type StylePalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
};

export type NormalizedStyle = {
  id: string;
  name: string;
  slogan: string;
  description: string;
  moodTheme?: string;
  audienceScope: AudienceScope[];
  endpoint: Exclude<EndpointFilter, "全部">;
  mood: Exclude<MoodFilter, "全部">[];
  colorPreference: Exclude<ColorPreference, "全部">;
  colorFamily: string[];
  suitableFor: string[];
  notSuitableFor: string[];
  visualSignature: string[];
  previewComposition?: unknown;
  differentiationFromV2?: string;
  palette: StylePalette;
  tokens: {
    colors: StylePalette;
    typography: {
      fontFamily: string;
      heading: string;
      body: string;
    };
    radius: {
      card: string;
      button: string;
      control: string;
    };
    shadow: {
      card: string;
      floating: string;
    };
    spacing: {
      page: string;
      section: string;
      card: string;
    };
    effects: {
      glass: string;
      gradient: string;
    };
  };
  preview: {
    admin: boolean;
    mobile: boolean;
  };
  previewScenario: PreviewScenario;
  handoff: {
    cssVariables: Record<string, string>;
    aiPrompt: string;
    figmaNotes: string;
  };
  source: StylePack;
};

export type PreviewPattern =
  | "glass"
  | "local"
  | "dream"
  | "enterprise"
  | "dark-ai"
  | "health"
  | "finance"
  | "guochao"
  | "default";

export const endpointFilters: EndpointFilter[] = ["全部", "后台端", "移动端", "通用"];
export const moodFilters: MoodFilter[] = [
  "全部",
  "商务稳重",
  "科技AI",
  "活力年轻",
  "高级轻奢",
  "医疗健康",
  "本地生活",
  "国潮文化",
  "暗色酷炫",
  "梦幻渐变",
];

export const colorPreferenceFilters: ColorPreference[] = [
  "全部",
  "蓝色系",
  "紫色系",
  "绿色系",
  "青色系",
  "橙色系",
  "红粉系",
  "黑金系",
  "黑白灰",
  "渐变多彩",
];

const palettePresets: Record<string, StylePalette> = {
  default: {
    primary: "#5b2bc8",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#f6f4fb",
    surface: "#ffffff",
    textPrimary: "#111827",
    textSecondary: "#667085",
    border: "#e5e1f3",
  },
  enterprise: {
    primary: "#1d4ed8",
    secondary: "#334155",
    accent: "#0ea5e9",
    background: "#f4f7fb",
    surface: "#ffffff",
    textPrimary: "#0f172a",
    textSecondary: "#52647a",
    border: "#dbe3ef",
  },
  ai: {
    primary: "#6d28d9",
    secondary: "#2563eb",
    accent: "#22d3ee",
    background: "#f6f3ff",
    surface: "#ffffff",
    textPrimary: "#15102b",
    textSecondary: "#655c7b",
    border: "#ded6ff",
  },
  dark: {
    primary: "#22d3ee",
    secondary: "#8b5cf6",
    accent: "#34d399",
    background: "#070b1a",
    surface: "#10162a",
    textPrimary: "#f8fafc",
    textSecondary: "#aab3c5",
    border: "#27314f",
  },
  mobile: {
    primary: "#4f46e5",
    secondary: "#60a5fa",
    accent: "#34d399",
    background: "#f7f9ff",
    surface: "#ffffff",
    textPrimary: "#101828",
    textSecondary: "#667085",
    border: "#dde5f4",
  },
  finance: {
    primary: "#047857",
    secondary: "#0f766e",
    accent: "#d6a84f",
    background: "#f3f7f4",
    surface: "#ffffff",
    textPrimary: "#10251f",
    textSecondary: "#596f68",
    border: "#d7e5de",
  },
  health: {
    primary: "#0891b2",
    secondary: "#14b8a6",
    accent: "#60a5fa",
    background: "#f1fbfb",
    surface: "#ffffff",
    textPrimary: "#123136",
    textSecondary: "#557277",
    border: "#ccebec",
  },
  local: {
    primary: "#f5b700",
    secondary: "#ff8a00",
    accent: "#18c76f",
    background: "#fff8df",
    surface: "#ffffff",
    textPrimary: "#261d08",
    textSecondary: "#80621b",
    border: "#f1dfa2",
  },
  guochao: {
    primary: "#b91c1c",
    secondary: "#dc2626",
    accent: "#d6a84f",
    background: "#fff7ed",
    surface: "#fffaf0",
    textPrimary: "#2a1212",
    textSecondary: "#775348",
    border: "#edd6bf",
  },
  dream: {
    primary: "#a855f7",
    secondary: "#ec4899",
    accent: "#22d3ee",
    background: "#fbf4ff",
    surface: "#ffffff",
    textPrimary: "#241033",
    textSecondary: "#775b88",
    border: "#ead7f8",
  },
  luxury: {
    primary: "#121212",
    secondary: "#3f2f1a",
    accent: "#c8a15a",
    background: "#f7f3eb",
    surface: "#fffdf8",
    textPrimary: "#17120c",
    textSecondary: "#665b4f",
    border: "#e7dac6",
  },
};

export function normalizeStyle(style: StylePack): NormalizedStyle {
  const haystack = getHaystack(style);
  const sourcePalette = readPalette(style);
  const preset = pickPalettePreset(haystack);
  const palette = { ...preset, ...sourcePalette };
  const sourceCss = style.cssVariables ?? {};
  const cssVariables = {
    ...sourceCss,
    "--color-primary": sourceCss["--color-primary"] ?? palette.primary,
    "--color-secondary": sourceCss["--color-secondary"] ?? palette.secondary,
    "--color-accent": sourceCss["--color-accent"] ?? palette.accent,
    "--color-bg": sourceCss["--color-bg"] ?? palette.background,
    "--color-surface": sourceCss["--color-surface"] ?? palette.surface,
    "--color-text": sourceCss["--color-text"] ?? sourceCss["--color-text-primary"] ?? palette.textPrimary,
    "--color-muted": sourceCss["--color-muted"] ?? sourceCss["--color-text-secondary"] ?? palette.textSecondary,
    "--color-border": sourceCss["--color-border"] ?? palette.border,
    "--radius-card": getCssVar(style, "--radius-card") || pickRadius(haystack, "card"),
    "--radius-button": getCssVar(style, "--radius-button") || pickRadius(haystack, "button"),
    "--shadow-card":
      getCssVar(style, "--shadow-card") ||
      `0 18px 42px ${hexToRgba(palette.primary, haystack.includes("dark") ? 0.2 : 0.14)}`,
    "--gradient-main":
      sourceCss["--gradient-main"] ?? `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
    "--effect-blur": sourceCss["--effect-blur"] ?? sourceCss["--glass-blur"] ?? "按场景使用轻微背景模糊",
  };
  const cardRadius = cssVariables["--radius-card"];
  const buttonRadius = cssVariables["--radius-button"];
  const cardShadow = cssVariables["--shadow-card"];

  return {
    id: style.id,
    name: style.name,
    moodTheme: style.moodTheme,
    slogan: buildSlogan(style, haystack),
    description: style.description || style.scenario || style.visual,
    audienceScope: pickAudience(haystack, style),
    endpoint: pickEndpoint(haystack, style),
    mood: pickMood(haystack, style),
    colorPreference: pickColorPreference(style, haystack, palette),
    colorFamily: pickColorFamily(palette),
    suitableFor: pickList(style.bestFor ?? style.suitableFor, style.scenario, style.category),
    notSuitableFor: pickNotSuitable(style, haystack),
    visualSignature: style.visualSignature ?? style.visualKeywords ?? splitSignature(style.visual),
    previewComposition: style.previewComposition,
    differentiationFromV2: style.differentiationFromV2,
    palette,
    tokens: {
      colors: palette,
      typography: {
        fontFamily: "Arial / Helvetica / system sans-serif",
        heading: pickTypography(haystack, "heading"),
        body: pickTypography(haystack, "body"),
      },
      radius: {
        card: cardRadius,
        button: buttonRadius,
        control: pickRadius(haystack, "control"),
      },
      shadow: {
        card: cardShadow,
        floating: `0 28px 80px ${hexToRgba(palette.primary, 0.18)}`,
      },
      spacing: {
        page: "24px / 32px",
        section: "20px / 28px",
        card: "16px / 20px",
      },
      effects: {
        glass: cssVariables["--effect-blur"],
        gradient: cssVariables["--gradient-main"],
      },
    },
    preview: {
      admin: true,
      mobile: true,
    },
    previewScenario: pickPreviewScenario(style, haystack),
    handoff: {
      cssVariables: {
        ...cssVariables,
        "--style-primary": cssVariables["--color-primary"],
        "--style-secondary": cssVariables["--color-secondary"],
        "--style-accent": cssVariables["--color-accent"],
        "--style-bg": cssVariables["--color-bg"],
        "--style-surface": cssVariables["--color-surface"],
        "--style-text": cssVariables["--color-text"],
        "--style-muted": cssVariables["--color-muted"],
        "--style-border": cssVariables["--color-border"],
        "--style-radius-card": cardRadius,
        "--style-radius-button": buttonRadius,
        "--style-shadow-card": cardShadow,
      },
      aiPrompt: buildPrompt(style),
      figmaNotes:
        "设计师只需维护该风格 JSON 中的 palette、tokens、suitableFor、notSuitableFor 与 handoff 字段，标准预览壳子会自动套用。",
    },
    source: style,
  };
}

export function normalizeStyles(styles: StylePack[]) {
  return styles.map((style) => normalizeStyle(style));
}

export function getStyleColorPreference(style: NormalizedStyle) {
  return style.colorPreference;
}

export function applyTheme(styleOrTokens: NormalizedStyle | NormalizedStyle["tokens"]) {
  const tokens = "tokens" in styleOrTokens ? styleOrTokens.tokens : styleOrTokens;
  return {
    "--color-primary": tokens.colors.primary,
    "--color-secondary": tokens.colors.secondary,
    "--color-accent": tokens.colors.accent,
    "--color-bg": tokens.colors.background,
    "--color-surface": tokens.colors.surface,
    "--color-text": tokens.colors.textPrimary,
    "--color-muted": tokens.colors.textSecondary,
    "--color-border": tokens.colors.border,
    "--radius-card": tokens.radius.card,
    "--radius-button": tokens.radius.button,
    "--radius-card-soft": multiplyCssLength(tokens.radius.card, 0.62),
    "--radius-card-inner": multiplyCssLength(tokens.radius.card, 0.78),
    "--radius-card-tile": multiplyCssLength(tokens.radius.card, 0.45),
    "--shadow-card": tokens.shadow.card,
    "--gradient-main": tokens.effects.gradient,
    "--effect-blur": tokens.effects.glass,
    "--style-primary": tokens.colors.primary,
    "--style-secondary": tokens.colors.secondary,
    "--style-accent": tokens.colors.accent,
    "--style-bg": tokens.colors.background,
    "--style-surface": tokens.colors.surface,
    "--style-text": tokens.colors.textPrimary,
    "--style-muted": tokens.colors.textSecondary,
    "--style-border": tokens.colors.border,
    "--style-radius-card": tokens.radius.card,
    "--style-radius-button": tokens.radius.button,
    "--style-shadow-card": tokens.shadow.card,
  } as CSSProperties;
}

export function getPreviewPattern(style: NormalizedStyle): PreviewPattern {
  const patternType = style.handoff.cssVariables["--pattern-type"]?.toLowerCase() ?? "";
  if (patternType.includes("glass")) return "glass";
  if (patternType.includes("coupon") || patternType.includes("local") || patternType.includes("yellow")) return "local";
  if (patternType.includes("dream") || patternType.includes("gradient") || patternType.includes("pastel")) return "dream";
  if (patternType.includes("finance") || patternType.includes("asset") || patternType.includes("gold")) return "finance";
  if (patternType.includes("guochao") || patternType.includes("seal") || patternType.includes("oriental")) return "guochao";
  if (patternType.includes("health") || patternType.includes("medical")) return "health";
  if (patternType.includes("cyber") || patternType.includes("neon") || patternType.includes("dark-ai")) return "dark-ai";
  if (patternType.includes("boardroom") || patternType.includes("enterprise")) return "enterprise";

  const text = [
    style.id,
    style.name,
    style.description,
    style.slogan,
    style.mood.join(" "),
    style.suitableFor.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  if (text.includes("liquid") || text.includes("glass") || text.includes("玻璃")) return "glass";
  if (text.includes("本地生活") || text.includes("yellow") || text.includes("外卖") || text.includes("团购")) return "local";
  if (text.includes("幻彩") || text.includes("梦幻") || text.includes("dopamine") || text.includes("pastel")) return "dream";
  if (text.includes("企业蓝") || text.includes("enterprise_blue") || text.includes("蓝白")) return "enterprise";
  if (text.includes("医疗") || text.includes("health") || text.includes("medical")) return "health";
  if (text.includes("金融") || text.includes("fintech") || text.includes("资产")) return "finance";
  if (text.includes("国潮") || text.includes("红金") || text.includes("文化")) return "guochao";
  if (text.includes("dark_ai") || text.includes("赛博") || text.includes("暗色") || text.includes("soc")) return "dark-ai";
  if (style.mood.includes("科技AI")) return "dark-ai";
  if (style.mood.includes("高级轻奢")) return "glass";
  if (style.mood.includes("梦幻渐变")) return "dream";
  if (style.mood.includes("商务稳重")) return "enterprise";
  return "default";
}

export function getPreviewScenario(style: NormalizedStyle | StylePack): PreviewScenario {
  if ("previewScenario" in style && style.previewScenario && isPreviewScenario(style.previewScenario)) {
    return style.previewScenario;
  }
  return pickPreviewScenario(style as StylePack, getHaystack(style as StylePack));
}

export function getStyleJson(style: NormalizedStyle) {
  const serializable = { ...style } as Omit<NormalizedStyle, "source"> & {
    source?: StylePack;
  };
  delete serializable.source;
  return JSON.stringify(serializable, null, 2);
}

function getHaystack(style: StylePack) {
  return [
    style.id,
    style.name,
    style.slogan,
    style.moodTheme,
    style.themeKey,
    style.themeDescription,
    style.description,
    style.category,
    style.scenario,
    style.visual,
    style.tags.join(" "),
    formatStyleValue(style.palette),
    formatStyleValue(style.personality),
    formatStyleValue(style.effects),
    formatStyleValue(style.bestFor),
    formatStyleValue(style.avoidFor),
    formatStyleValue(style.suitableFor),
    formatStyleValue(style.notSuitableFor),
    formatStyleValue(style.visualKeywords),
    formatStyleValue(style.visualSignature),
    formatStyleValue(style.designTokens),
    style.group,
    style.positioning,
    style.componentStyle,
    style.gradientStyle,
    style.glowStyle,
    style.darkModeStrategy,
    style.linearStyle,
    style.web3Style,
    style.coverVariant,
    formatStyleValue(style.previewComposition),
    style.previewPrompt,
    style.aiPrompt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function readPalette(style: StylePack): Partial<StylePalette> {
  const raw = style.palette;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const palette = raw as Record<string, unknown>;
  return {
    primary: readColor(palette.primary),
    secondary: readColor(palette.secondary),
    accent: readColor(palette.accent),
    background: readColor(palette.background),
    surface: readColor(palette.surface),
    textPrimary: readColor(palette.textPrimary),
    textSecondary: readColor(palette.textSecondary),
    border: readColor(palette.border),
  };
}

function readColor(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getCssVar(style: StylePack, key: string) {
  return style.cssVariables?.[key] ?? style.cssVariables?.[key.replace("--style", "--color")];
}

function pickPalettePreset(haystack: string) {
  if (matches(haystack, ["dark", "暗色", "cyber", "soc", "security", "night", "fintech_dark"])) return palettePresets.dark;
  if (matches(haystack, ["finance", "fintech", "金融", "trust", "payment", "保险"])) return palettePresets.finance;
  if (matches(haystack, ["health", "medical", "医疗", "健康", "hospital"])) return palettePresets.health;
  if (matches(haystack, ["local", "本地生活", "yellow", "外卖", "团购"])) return palettePresets.local;
  if (matches(haystack, ["guochao", "国潮", "文化", "red_gold"])) return palettePresets.guochao;
  if (matches(haystack, ["luxury", "premium", "轻奢", "黑金", "酒店", "珠宝"])) return palettePresets.luxury;
  if (matches(haystack, ["dream", "dopamine", "pastel", "幻彩", "糖果", "bento", "soft", "glass"])) return palettePresets.dream;
  if (matches(haystack, ["ai", "copilot", "agent", "developer", "api", "科技"])) return palettePresets.ai;
  if (matches(haystack, ["mobile", "app", "ios", "移动"])) return palettePresets.mobile;
  if (matches(haystack, ["enterprise", "table", "erp", "crm", "government", "office", "企业", "政务"])) return palettePresets.enterprise;
  return palettePresets.default;
}

function pickAudience(haystack: string, style: StylePack): AudienceScope[] {
  if (Array.isArray(style.audienceScope) && style.audienceScope.length) {
    const mapped = style.audienceScope.filter((item): item is AudienceScope =>
      ["b2b", "b2c", "universal"].includes(item),
    );
    if (mapped.length) return mapped;
  }
  if (matches(haystack, ["本地生活", "美业", "潮玩", "内容社区", "生活方式", "文旅", "奢侈品"])) return ["b2c"];
  if (matches(haystack, ["企业", "后台", "crm", "erp", "oa", "admin", "developer", "政企"])) return ["b2b"];
  return ["universal"];
}

function pickEndpoint(haystack: string, style: StylePack): Exclude<EndpointFilter, "全部"> {
  if (Array.isArray(style.platformScope)) {
    const platforms = style.platformScope.join(" ").toLowerCase();
    if (platforms.includes("admin") && platforms.includes("mobile")) return "通用";
    if (platforms.includes("mobile")) return "移动端";
    if (platforms.includes("admin")) return "后台端";
  }
  if (matches(haystack, ["mobile", "app", "ios", "移动", "小程序"])) return "移动端";
  if (matches(haystack, ["官网", "landing", "生活", "社区", "消费"])) return "通用";
  return "后台端";
}

function pickMood(haystack: string, style: StylePack): Exclude<MoodFilter, "全部">[] {
  const moods: Exclude<MoodFilter, "全部">[] = [];
  if (style.moodTheme && moodFilters.includes(style.moodTheme as MoodFilter)) {
    moods.push(style.moodTheme as Exclude<MoodFilter, "全部">);
  }
  if (matches(haystack, ["enterprise", "table", "crm", "erp", "office", "政务", "稳重", "可信", "合规"])) moods.push("商务稳重");
  if (matches(haystack, ["ai", "copilot", "agent", "cyber", "developer", "api", "科技", "future"])) moods.push("科技AI");
  if (matches(haystack, ["dopamine", "yellow", "年轻", "潮玩", "内容社区", "活动", "活力"])) moods.push("活力年轻");
  if (matches(haystack, ["luxury", "premium", "高端", "轻奢", "黑金", "glass", "liquid"])) moods.push("高级轻奢");
  if (matches(haystack, ["health", "medical", "医疗", "健康", "医院"])) moods.push("医疗健康");
  if (matches(haystack, ["local", "本地生活", "外卖", "团购", "到店"])) moods.push("本地生活");
  if (matches(haystack, ["guochao", "国潮", "文化", "茶饮", "文旅"])) moods.push("国潮文化");
  if (matches(haystack, ["dark", "night", "暗色", "soc", "security", "neon", "大屏"])) moods.push("暗色酷炫");
  if (matches(haystack, ["dream", "pastel", "幻彩", "梦幻", "渐变", "soft", "bento"])) moods.push("梦幻渐变");
  return moods.length ? Array.from(new Set(moods)).slice(0, 2) : ["商务稳重"];
}

function pickColorPreference(
  style: StylePack,
  haystack: string,
  palette: StylePalette,
): Exclude<ColorPreference, "全部"> {
  const explicit = normalizeColorPreference(style.colorPreference);
  if (explicit) return explicit;

  const palettePreference = inferColorPreferenceFromPalette(palette);
  const specialPreference = inferSpecialColorPreference(haystack, palette, palettePreference);
  if (specialPreference) return specialPreference;
  if (palettePreference) return palettePreference;

  if (matches(haystack, ["black-gold", "black_gold", "黑金", "暗绿金", "gold", "obsidian", "quiet-luxury"])) {
    return "黑金系";
  }
  if (matches(haystack, ["gradient", "dream", "iridescent", "colorful", "aurora", "pastel", "梦幻", "渐变", "多彩", "幻彩", "虹彩", "珠贝"])) {
    return "渐变多彩";
  }
  if (matches(haystack, ["neutral", "gray", "grey", "mono", "graphite", "black white", "黑白灰", "中性", "石墨", "灰阶"])) {
    return "黑白灰";
  }
  if (matches(haystack, ["pink", "red", "rose", "burgundy", "红", "粉", "酒红", "朱砂", "赤焰"])) {
    return "红粉系";
  }
  if (matches(haystack, ["orange", "yellow", "amber", "橙色", "黄色", "珊瑚", "日落"])) {
    return "橙色系";
  }
  if (matches(haystack, ["green", "eco", "emerald", "mint", "jade", "绿色", "环保", "薄荷", "翡翠"])) {
    return "绿色系";
  }
  if (matches(haystack, ["cyan", "teal", "青色", "青绿", "冷光"])) {
    return "青色系";
  }
  if (matches(haystack, ["purple", "violet", "紫", "薰衣草"])) {
    return "紫色系";
  }
  if (matches(haystack, ["blue", "蓝"])) {
    return "蓝色系";
  }

  return "蓝色系";
}

type HslSignal = {
  hue: number;
  saturation: number;
  lightness: number;
};

function inferSpecialColorPreference(
  haystack: string,
  palette: StylePalette,
  palettePreference: Exclude<ColorPreference, "全部"> | null,
): Exclude<ColorPreference, "全部"> | null {
  const signals = getPaletteSignals(palette);
  const hasDarkBase = [palette.primary, palette.background, palette.surface, palette.textPrimary]
    .map(parseHexColor)
    .some((color) => color ? getRelativeLuminance(color) < 0.08 : false);
  const hasGoldAccent = [palette.secondary, palette.accent, palette.primary]
    .map(parseHexColor)
    .some((color) => {
      if (!color) return false;
      const hsl = rgbToHsl(color);
      return hsl.hue >= 35 && hsl.hue <= 58 && hsl.saturation >= 0.28;
    });

  if (
    matches(haystack, ["black-gold", "black_gold", "黑金", "暗绿金", "obsidian", "quiet-luxury"]) ||
    (hasDarkBase && hasGoldAccent)
  ) {
    return "黑金系";
  }

  const chromaticSignals = signals.filter((signal) => signal.saturation > 0.2);
  const hueBuckets = new Set(chromaticSignals.map((signal) => getHueBucket(signal.hue)));
  if (
    matches(haystack, ["gradient", "dream", "iridescent", "colorful", "aurora", "pastel", "梦幻", "渐变", "多彩", "幻彩", "虹彩", "珠贝"]) &&
    (hueBuckets.size >= 2 || palettePreference === "渐变多彩")
  ) {
    return "渐变多彩";
  }

  const lowSaturationCount = signals.filter((signal) => signal.saturation < 0.12).length;
  if (
    signals.length > 0 &&
    lowSaturationCount >= Math.max(2, signals.length - 1) &&
    matches(haystack, ["neutral", "gray", "grey", "mono", "graphite", "black white", "黑白灰", "中性", "石墨", "灰阶", "carbon"])
  ) {
    return "黑白灰";
  }

  return null;
}

function inferColorPreferenceFromPalette(palette: StylePalette): Exclude<ColorPreference, "全部"> | null {
  const candidates = [palette.primary, palette.secondary, palette.accent]
    .map((value) => parseHexColor(value))
    .filter((value): value is RgbColor => Boolean(value))
    .map((color, index) => ({
      ...rgbToHsl(color),
      luminance: getRelativeLuminance(color),
      weight: index === 0 ? 4 : index === 1 ? 2 : 1.5,
    }))
    .filter((signal) => signal.saturation >= 0.12 && signal.lightness > 0.08 && signal.lightness < 0.94);

  if (!candidates.length) {
    return null;
  }

  const strongest = candidates.sort((a, b) => {
    const aScore = a.saturation * a.weight * (a.luminance > 0.92 ? 0.7 : 1);
    const bScore = b.saturation * b.weight * (b.luminance > 0.92 ? 0.7 : 1);
    return bScore - aScore;
  })[0];

  return getColorPreferenceByHue(strongest.hue);
}

function getPaletteSignals(palette: StylePalette): HslSignal[] {
  return [palette.primary, palette.secondary, palette.accent]
    .map((value) => parseHexColor(value))
    .filter((value): value is RgbColor => Boolean(value))
    .map(rgbToHsl);
}

function getColorPreferenceByHue(hue: number): Exclude<ColorPreference, "全部"> {
  if (hue < 15 || hue >= 315) return "红粉系";
  if (hue < 62) return "橙色系";
  if (hue < 165) return "绿色系";
  if (hue < 200) return "青色系";
  if (hue < 255) return "蓝色系";
  return "紫色系";
}

function getHueBucket(hue: number) {
  return getColorPreferenceByHue(hue);
}

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

function parseHexColor(value: string): RgbColor | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;

  const raw = match[1];
  const hex =
    raw.length === 3
      ? raw.split("").map((char) => `${char}${char}`).join("")
      : raw;

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHsl(color: RgbColor): HslSignal {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { hue: 0, saturation: 0, lightness };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === r) {
    hue = (g - b) / delta + (g < b ? 6 : 0);
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  return { hue: hue * 60, saturation, lightness };
}

function getRelativeLuminance(color: RgbColor) {
  const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function normalizeColorPreference(value: unknown): Exclude<ColorPreference, "全部"> | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  const map: Record<string, Exclude<ColorPreference, "全部">> = {
    blue: "蓝色系",
    "蓝色系": "蓝色系",
    purple: "紫色系",
    violet: "紫色系",
    "紫色系": "紫色系",
    green: "绿色系",
    "绿色系": "绿色系",
    cyan: "青色系",
    teal: "青色系",
    "青色系": "青色系",
    orange: "橙色系",
    "橙色系": "橙色系",
    "pink-red": "红粉系",
    pink: "红粉系",
    red: "红粉系",
    "红粉系": "红粉系",
    "black-gold": "黑金系",
    blackgold: "黑金系",
    "黑金系": "黑金系",
    neutral: "黑白灰",
    gray: "黑白灰",
    grey: "黑白灰",
    "黑白灰": "黑白灰",
    gradient: "渐变多彩",
    colorful: "渐变多彩",
    "渐变多彩": "渐变多彩",
  };
  return map[normalized] ?? null;
}

function pickPreviewScenario(style: StylePack, haystack: string): PreviewScenario {
  const explicit = style.preview_scenario ?? style.previewScenario;
  if (explicit && isPreviewScenario(explicit)) {
    return explicit;
  }

  if (matches(haystack, ["style-001-modern-saas-clean", "现代 saas 极简", "saas 极简"])) {
    return "enterprise-workbench";
  }
  if (matches(haystack, ["style-002-enterprise-classic-table", "经典表格", "table", "crud", "erp"])) {
    return "saas-admin-list";
  }
  if (matches(haystack, ["style-024-dark-dataviz-dashboard", "dark", "暗色", "大屏", "soc", "dashboard"])) {
    return "dark-dashboard";
  }
  if (matches(haystack, ["style-021-ai-copilot-workspace", "ai copilot", "assistant", "agent", "智能助手"])) {
    return "ai-assistant";
  }
  if (matches(haystack, ["style-030-mobile-first-enterprise", "移动优先", "轻办公", "mobile workbench"])) {
    return "mobile-workbench";
  }
  if (matches(haystack, ["health", "medical", "医疗", "健康", "医院"])) {
    return "medical-health";
  }
  if (matches(haystack, ["finance", "fintech", "金融", "资产", "保险", "payment"])) {
    return "finance-dashboard";
  }
  if (matches(haystack, ["local", "本地生活", "外卖", "团购", "到店", "门店"])) {
    return "local-service";
  }
  if (matches(haystack, ["ecommerce", "merchant", "商家", "电商", "增长", "订单"])) {
    return "ecommerce-operation";
  }
  if (matches(haystack, ["mobile", "app", "ios", "移动"])) {
    return "mobile-workbench";
  }
  return "enterprise-workbench";
}

function isPreviewScenario(value: string): value is PreviewScenario {
  return [
    "enterprise-workbench",
    "saas-admin-list",
    "dark-dashboard",
    "ai-assistant",
    "mobile-workbench",
    "medical-health",
    "finance-dashboard",
    "local-service",
    "ecommerce-operation",
  ].includes(value);
}

function pickColorFamily(palette: StylePalette) {
  return [palette.primary, palette.secondary, palette.accent, palette.background, palette.surface, palette.textPrimary];
}

function pickList(value: unknown, fallback: string, category: string) {
  if (Array.isArray(value) && value.length) {
    return value.map((item) => String(item));
  }
  return [fallback, category].filter(Boolean);
}

function pickNotSuitable(style: StylePack, haystack: string) {
  const raw = style.avoidFor ?? (style as StylePack & { notSuitableFor?: unknown }).notSuitableFor;
  if (Array.isArray(raw) && raw.length) {
    return raw.map((item) => String(item));
  }
  if (matches(haystack, ["dark", "暗色", "neon"])) return ["强合规白底文档系统", "低视觉刺激的长表单录入"];
  if (matches(haystack, ["dopamine", "yellow", "梦幻", "国潮"])) return ["严肃审计后台", "高度数据密集的金融风控页面"];
  if (matches(haystack, ["mobile", "app"])) return ["超复杂多列后台表格", "大屏监控中心"];
  return ["需要完全定制品牌视觉的对外官网", "极端复杂的数据密集大屏"];
}

function buildSlogan(style: StylePack, haystack: string) {
  if (style.slogan) {
    return style.slogan;
  }
  const personality = formatStyleValue(style.personality);
  if (personality) {
    return personality.split("、").slice(0, 3).join("、");
  }
  if (matches(haystack, ["table", "enterprise"])) return "高密度、可信、适合复杂管理";
  if (matches(haystack, ["ai", "copilot"])) return "智能、协同、面向 AI 工作流";
  if (matches(haystack, ["dark", "dashboard"])) return "深色、数据化、指挥中心感";
  if (matches(haystack, ["mobile", "app"])) return "轻量、移动优先、适合日常办公";
  if (matches(haystack, ["finance"])) return "稳健、可信、强调资产安全";
  return style.visual.split("。")[0] || style.scenario;
}

function splitSignature(value: string) {
  return value
    .split(/[、，；;。]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function pickTypography(haystack: string, kind: "heading" | "body") {
  if (matches(haystack, ["luxury", "editorial"])) return kind === "heading" ? "高对比标题，克制字重" : "舒展行高，适合精品内容";
  if (matches(haystack, ["enterprise", "table", "admin"])) return kind === "heading" ? "清晰中性标题" : "紧凑可读正文";
  return kind === "heading" ? "现代无衬线标题" : "稳定易读正文";
}

function pickRadius(haystack: string, kind: "card" | "button" | "control") {
  if (matches(haystack, ["brutalism", "粗野"])) return kind === "card" ? "8px" : "6px";
  if (matches(haystack, ["enterprise", "table", "government"])) return kind === "card" ? "10px" : "8px";
  if (matches(haystack, ["mobile", "soft", "glass", "dream"])) return kind === "card" ? "24px" : "999px";
  return kind === "card" ? "16px" : kind === "button" ? "12px" : "10px";
}

function matches(haystack: string, needles: string[]) {
  return needles.some((needle) => haystack.includes(needle.toLowerCase()));
}

function hexToRgba(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length < 7) {
    return `rgba(91,43,200,${alpha})`;
  }
  const r = Number.parseInt(color.slice(1, 3), 16);
  const g = Number.parseInt(color.slice(3, 5), 16);
  const b = Number.parseInt(color.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function multiplyCssLength(value: string, factor: number) {
  const match = value.match(/^(\d+(?:\.\d+)?)px$/);
  if (!match) return value;
  return `${Math.max(4, Math.round(Number(match[1]) * factor))}px`;
}
