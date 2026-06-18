import catalog from "@/data/styles.json";
import advancedStylesCatalog from "@/data/advanced-styles-v4.json";
import expandedStylesCatalog from "@/data/expanded-styles-v5.json";
import templatesCatalog from "@/data/templates.json";
import componentsCatalog from "@/data/components.json";
import promptsCatalog from "@/data/prompts.json";
import tokensCatalog from "@/data/tokens.json";
import changelogCatalog from "@/data/changelog.json";

export type Priority = "P0" | "P1" | "P2";

export type StylePack = {
  id: string;
  name: string;
  englishName?: string;
  group?: string;
  description?: string;
  status?: string;
  version?: string;
  owner?: string;
  created_at?: string;
  updated_at?: string;
  related_items?: Record<string, unknown>;
  category: string;
  priority: Priority;
  scenario: string;
  visual: string;
  v1: string;
  tokens: string;
  tags: string[];
  figma_file_url?: string;
  figma_component_url?: string;
  figma_page_url?: string;
  figma_last_updated?: string;
  figma_owner?: string;
  palette?: unknown;
  personality?: unknown;
  components?: unknown;
  layout?: unknown;
  shape?: unknown;
  effects?: unknown;
  dos?: unknown;
  donts?: unknown;
  cssVariables?: Record<string, string>;
  previewPrompt?: string;
  suitableFor?: string[];
  notSuitableFor?: string[];
  slogan?: string;
  moodTheme?: string;
  colorPreference?: string;
  themeKey?: string;
  themeDescription?: string;
  audienceScope?: string[];
  platformScope?: string[];
  bestFor?: string[];
  avoidFor?: string[];
  differentiationFromV2?: string;
  visualSignature?: string[];
  previewComposition?: unknown;
  preview_scenario?: string;
  previewScenario?: string;
  gradients?: unknown;
  typography?: unknown;
  positioning?: string;
  visualKeywords?: string[];
  mood?: string[];
  themeMode?: string;
  layoutDensity?: string;
  componentStyle?: string;
  gradientStyle?: string;
  glowStyle?: string;
  darkModeStrategy?: string;
  linearStyle?: string;
  web3Style?: string;
  mobileAdaptation?: string;
  adminAdaptation?: string;
  dashboardAdaptation?: string;
  designTokens?: {
    colors?: Record<string, string>;
    gradients?: Record<string, string>;
    radius?: Record<string, string>;
    shadow?: Record<string, string>;
    typography?: Record<string, string>;
    effects?: Record<string, string | number>;
  };
  coverVariant?: string;
  parentStyleId?: string;
  variantName?: string;
  styleFamily?: string;
  styleDifferentiators?: {
    typography?: string;
    shadow?: string;
    iconLanguage?: string;
    layoutRhythm?: string;
    colorLogic?: string;
    motion?: string;
    border?: string;
    atmosphere?: string;
  };
  visualMechanism?: string;
  layoutMechanism?: string;
  componentMechanism?: string;
  motionMechanism?: string;
  differentiationScore?: number;
  duplicateGroupId?: string;
  displayLevel?: "hero" | "normal" | "hidden";
  displayReason?: string;
  isMainStyle?: boolean;
  aiTags?: string[];
  aiPrompt?: string;
  differenceFromExisting?: {
    notJustColor?: boolean;
    uniquePoints?: string[];
    avoidSimilarityWith?: string[];
  };
  v1Templates?: string[];
};

export type TemplateGroup = {
  id: string;
  name: string;
  description: string;
  keywords: string[];
};

export type TemplateItem = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  related_items?: Record<string, unknown>;
  platform: string;
  legacy_platform?: string;
  type: string;
  scene: string;
  style_pack_id: string;
  description: string;
  layout: {
    shell: string;
    density: string;
    navigation: string;
    responsive: string;
    regions: string[];
  };
  components: string[];
  states: string[];
  preview_type: string;
  figma_url: string;
  storybook_url: string;
  code_url: string;
  ai_prompt_id?: string;
  ai_tags: string[];
  ai_prompt: string;
  status: string;
  version: string;
  owner: string;
  suitable_for?: string[];
  not_suitable_for?: string[];
  figma_file_url?: string;
  figma_component_url?: string;
  figma_page_url?: string;
  figma_last_updated?: string;
  figma_owner?: string;
  design_acceptance?: {
    follows_style_pack: boolean;
    uses_standard_components: boolean;
    includes_empty_state: boolean;
    includes_error_state: boolean;
    includes_loading_state: boolean;
    includes_responsive_notes: boolean;
    includes_figma_link: boolean;
  };
};

export type ComponentItem = {
  id: string;
  name: string;
  description: string;
  status: string;
  version: string;
  owner: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  related_items: Record<string, unknown>;
  category: string;
  variants: string[];
  states: string[];
  design_tokens: string[];
  figma_url: string;
  storybook_url: string;
  code_url: string;
  used_by_templates: string[];
  figma_file_url?: string;
  figma_component_url?: string;
  figma_page_url?: string;
  figma_last_updated?: string;
  figma_owner?: string;
};

export type PromptItem = {
  id: string;
  name: string;
  description: string;
  status: string;
  version: string;
  owner: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  related_items: Record<string, unknown>;
  prompt_type: string;
  target_user: string;
  input_variables: string[];
  prompt_text: string;
  related_template_id: string | null;
  related_style_id: string | null;
};

export type TokenItem = {
  id: string;
  name: string;
  description: string;
  status: string;
  version: string;
  owner: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  related_items: Record<string, unknown>;
  token_modes: string[];
  color_roles: string[];
  typography: {
    font_family: string;
    scale: string[];
  };
  spacing: string[];
  radius: string[];
  shadow: string[];
};

export type ChangelogItem = {
  id: string;
  name: string;
  description: string;
  status: string;
  version: string;
  owner: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  related_items: Record<string, unknown>;
  change_content?: string[];
  updated_by?: string;
  updated_at_detail?: string;
  affected_templates?: string[];
  affected_components?: string[];
};

const templateGroups: TemplateGroup[] = [
  {
    id: "dashboard",
    name: "Dashboard / 工作台",
    description: "用于经营概览、资源概览、工作台、监控中心等首屏聚合页面。",
    keywords: ["Dashboard", "概览", "工作台", "首页", "大屏", "监控", "Copilot"],
  },
  {
    id: "list",
    name: "列表 / 表格",
    description: "用于客户、订单、资源、任务、交易、员工等对象的浏览和筛选。",
    keywords: ["列表", "表格", "资源", "客户", "订单", "任务", "交易"],
  },
  {
    id: "detail",
    name: "详情 / 对象页",
    description: "用于展示单个业务对象的完整资料、状态、时间线和操作入口。",
    keywords: ["详情", "对象", "记录", "报告", "时间线", "面板"],
  },
  {
    id: "form",
    name: "表单 / 配置",
    description: "用于创建、审批、配置、确认、设置等需要用户输入的页面。",
    keywords: ["表单", "配置", "设置", "确认", "审批", "创建"],
  },
  {
    id: "mobile",
    name: "移动端 / App",
    description: "用于移动首页、审批、消息、巡检、移动 CRM 等轻办公场景。",
    keywords: ["移动", "App", "手机", "移动端", "审批", "巡检"],
  },
  {
    id: "ai-workspace",
    name: "AI 工作台",
    description: "用于智能助手、对话、任务建议、结果卡片和引用溯源。",
    keywords: ["AI", "Copilot", "对话", "建议", "引用", "Agent"],
  },
];

export const baseStyles = catalog.styles as StylePack[];
export const advancedStyles = advancedStylesCatalog.styles as StylePack[];
export const expandedStyles = expandedStylesCatalog.styles as StylePack[];
export const styles = [...baseStyles, ...advancedStyles, ...expandedStyles];
export const catalogMeta = {
  version: catalog.version,
  generatedAt: catalog.generated_at,
  description: `${catalog.description} Appended ${advancedStyles.length} V4 advanced visual styles and ${expandedStyles.length} V5 mainstream app-first styles.`,
};

export const templates = templatesCatalog.templates as TemplateItem[];
export const components = componentsCatalog.components as ComponentItem[];
export const prompts = promptsCatalog.prompts as PromptItem[];
export const tokens = tokensCatalog.tokens as TokenItem[];
export const changelog = changelogCatalog.changes as ChangelogItem[];
export const templatesMeta = {
  version: templatesCatalog.version,
  generatedAt: templatesCatalog.generated_at,
  description: templatesCatalog.description,
  templateTypes: templatesCatalog.template_types,
};

export function getStyleById(styleId: string) {
  return styles.find((style) => style.id === styleId);
}

export function getPriorityCounts() {
  return styles.reduce<Record<Priority, number>>(
    (counts, style) => {
      counts[style.priority] += 1;
      return counts;
    },
    { P0: 0, P1: 0, P2: 0 },
  );
}

export function getCategories() {
  return Array.from(new Set(styles.map((style) => style.category))).sort();
}

export function getTags() {
  return Array.from(new Set(styles.flatMap((style) => style.tags))).sort();
}

export function getTemplateGroups() {
  return templateGroups.map((group) => ({
    ...group,
    styles: styles.filter((style) =>
      group.keywords.some((keyword) =>
        `${style.name} ${style.category} ${style.scenario} ${style.v1} ${style.tags.join(" ")}`
          .toLowerCase()
          .includes(keyword.toLowerCase()),
      ),
    ),
  }));
}

export function getTemplateGroupById(templateId: string) {
  return getTemplateGroups().find((group) => group.id === templateId);
}

export function getTemplateById(templateId: string) {
  return templates.find((template) => template.id === templateId);
}

export function getTemplatePlatforms() {
  return Array.from(new Set(templates.map((template) => template.platform))).sort();
}

export function getTemplateTypes() {
  return Array.from(new Set(templates.map((template) => template.type))).sort();
}

export function getTemplateScenes() {
  return Array.from(new Set(templates.map((template) => template.scene))).sort();
}

export function getTemplateStatuses() {
  return Array.from(new Set(templates.map((template) => template.status))).sort();
}

export function buildPrompt(style: StylePack) {
  if (style.aiPrompt) {
    return style.aiPrompt;
  }

  if (style.previewPrompt) {
    return style.previewPrompt;
  }

  return [
    `请基于「${style.name}」设计一个企业级业务页面。`,
    `适用场景：${style.scenario}`,
    `视觉方向：${style.visual}`,
    `建议页面：${style.v1}`,
    `主题模式：${style.tokens}`,
    `关键词：${style.tags.join("、")}`,
    "要求界面干净、现代、信息层级清晰，适合真实企业产品使用。",
  ].join("\n");
}

export function formatStyleValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((item) => formatStyleValue(item)).filter(Boolean).join("、");
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${key}: ${formatStyleValue(item)}`)
      .filter(Boolean)
      .join("；");
  }

  return String(value);
}

export function getStylePaletteText(style: StylePack) {
  return formatStyleValue(style.palette) || style.tokens;
}

export function getStylePersonalityText(style: StylePack) {
  return formatStyleValue(style.personality);
}
