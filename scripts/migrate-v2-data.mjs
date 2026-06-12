import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const today = "2026-06-04";
const owner = "Design Platform Core";

const legacyStyleCatalog = readJson("data/ui_style_catalog_v1_30_styles.json");
const legacyTemplatesCatalog = readJson("data/templates.json");
const componentDocs = readComponentDocs();

const legacyStyles = legacyStyleCatalog.styles;
const legacyTemplates = legacyTemplatesCatalog.templates;

const templateIdsByStyle = new Map();
for (const template of legacyTemplates) {
  const items = templateIdsByStyle.get(template.style_pack_id) ?? [];
  items.push(template.id);
  templateIdsByStyle.set(template.style_pack_id, items);
}

const prompts = [
  ...legacyStyles.map((style) => buildStylePrompt(style)),
  ...legacyTemplates.map((template) => buildTemplatePrompt(template)),
];

const promptIdsByStyle = new Map();
const promptIdsByTemplate = new Map();
for (const prompt of prompts) {
  if (prompt.related_style_id) {
    const items = promptIdsByStyle.get(prompt.related_style_id) ?? [];
    items.push(prompt.id);
    promptIdsByStyle.set(prompt.related_style_id, items);
  }
  if (prompt.related_template_id) {
    promptIdsByTemplate.set(prompt.related_template_id, prompt.id);
  }
}

const tokenSets = buildTokenSets(legacyStyles);
const componentUsage = buildComponentUsage(componentDocs, legacyTemplates);

const styles = legacyStyles.map((style) => ({
  id: style.id,
  name: style.name,
  description: style.scenario,
  status: statusFromPriority(style.priority),
  version: "2.0.0",
  owner,
  created_at: legacyStyleCatalog.generated_at ?? today,
  updated_at: today,
  tags: unique([style.priority.toLowerCase(), style.category, ...style.tags]),
  related_items: {
    templates: templateIdsByStyle.get(style.id) ?? [],
    prompts: promptIdsByStyle.get(style.id) ?? [],
    tokens: [tokenIdFromModes(style.tokens)],
    components: [],
  },
  category: style.category,
  priority: style.priority,
  scenario: style.scenario,
  visual: style.visual,
  v1: style.v1,
  tokens: style.tokens,
  token_set_id: tokenIdFromModes(style.tokens),
  source: "data/ui_style_catalog_v1_30_styles.json",
}));

const templates = legacyTemplates.map((template) => {
  const style = legacyStyles.find((item) => item.id === template.style_pack_id);
  const promptId = promptIdsByTemplate.get(template.id);

  return {
    id: template.id,
    name: template.name,
    description: template.description,
    status: normalizeTemplateStatus(template.status),
    version: template.version ?? "2.0.0",
    owner: template.owner ?? owner,
    created_at: legacyTemplatesCatalog.generated_at ?? today,
    updated_at: today,
    tags: unique([
      template.platform,
      template.type,
      template.scene,
      normalizeTemplateStatus(template.status),
      ...(template.ai_tags ?? []),
    ]),
    related_items: {
      style_pack: template.style_pack_id,
      components: template.components,
      prompts: promptId ? [promptId] : [],
      tokens: style ? [tokenIdFromModes(style.tokens)] : [],
    },
    platform: normalizePlatform(template.platform),
    legacy_platform: template.platform,
    type: template.type,
    scene: template.scene,
    style_pack_id: template.style_pack_id,
    layout: template.layout,
    components: template.components,
    states: template.states,
    figma_url: template.figma_url,
    storybook_url: template.storybook_url,
    code_url: template.code_url,
    ai_prompt_id: promptId,
    ai_prompt: template.ai_prompt,
    preview_type: template.preview_type,
    suitable_for: getSuitableFor(template),
    not_suitable_for: getNotSuitableFor(template),
    ai_tags: template.ai_tags,
  };
});

const components = componentDocs.map((component) => {
  const id = componentId(component.name);
  const usedByTemplates = componentUsage.get(component.name) ?? [];

  return {
    id,
    name: component.name,
    description: component.purpose,
    status: "approved",
    version: "2.0.0",
    owner,
    created_at: today,
    updated_at: today,
    tags: unique([component.category, ...component.variants, ...component.states]),
    related_items: {
      templates: usedByTemplates,
      prompts: [],
      tokens: buildDesignTokens(component),
    },
    category: component.category,
    variants: component.variants,
    states: component.states,
    design_tokens: buildDesignTokens(component),
    figma_url: `https://figma.example.com/file/ui-template-library?node=${id}`,
    storybook_url: `https://storybook.example.com/?path=/docs/components-${id}`,
    code_url: `https://github.com/MarkCeci/ui-template-library/tree/main/components/${id}`,
    used_by_templates: usedByTemplates,
  };
});

const changelog = [
  {
    id: "change-2026-06-04-v2-data-model",
    name: "V2 数据模型初始化",
    description:
      "将风格、模板、组件、Prompt、Tokens、版本说明和变更记录统一为可校验的 JSON 数据模型。",
    status: "approved",
    version: "2.0.0",
    owner,
    created_at: today,
    updated_at: today,
    tags: ["v2", "data-model", "json", "governance"],
    related_items: {
      styles: styles.map((item) => item.id),
      templates: templates.map((item) => item.id),
      components: components.map((item) => item.id),
      prompts: prompts.map((item) => item.id),
    },
    change_type: "schema-upgrade",
    summary:
      "新增 styles、components、prompts、tokens、changelog、release-notes 数据文件，并升级 templates 数据结构。",
  },
];

const releaseNotes = [
  {
    id: "release-v2-2026-06-04",
    name: "V2 数据层准备版",
    description:
      "面向后续数据库、Figma、Storybook 和 AI 检索接入的数据层升级版本。",
    status: "approved",
    version: "2.0.0",
    owner,
    created_at: today,
    updated_at: today,
    tags: ["v2", "release-note", "data-layer"],
    related_items: {
      changelog: ["change-2026-06-04-v2-data-model"],
      data_files: [
        "data/styles.json",
        "data/templates.json",
        "data/components.json",
        "data/prompts.json",
        "data/tokens.json",
        "data/changelog.json",
        "data/release-notes.json",
      ],
    },
    highlights: [
      "统一公共字段：id、name、description、status、version、owner、created_at、updated_at、tags、related_items。",
      "模板新增 ai_prompt_id、suitable_for、not_suitable_for，并保留原始 ai_prompt 以兼容现有页面。",
      "组件新增 used_by_templates 和 design_tokens，方便后续接 Storybook 和设计规范。",
      "Prompt 独立成库，方便后续 AI 检索、复用和版本管理。",
    ],
  },
];

writeJson("data/styles.json", {
  version: "2.0.0",
  schema_version: "2.0.0",
  generated_at: today,
  description: "V2 normalized style pack catalog.",
  styles,
});

writeJson("data/templates.json", {
  version: "2.0.0",
  schema_version: "2.0.0",
  generated_at: today,
  description: "V2 normalized template catalog.",
  template_types: legacyTemplatesCatalog.template_types,
  templates,
});

writeJson("data/components.json", {
  version: "2.0.0",
  schema_version: "2.0.0",
  generated_at: today,
  description: "V2 normalized component catalog.",
  components,
});

writeJson("data/prompts.json", {
  version: "2.0.0",
  schema_version: "2.0.0",
  generated_at: today,
  description: "V2 prompt catalog for style and template generation.",
  prompts,
});

writeJson("data/tokens.json", {
  version: "2.0.0",
  schema_version: "2.0.0",
  generated_at: today,
  description: "V2 design token set catalog.",
  tokens: tokenSets,
});

writeJson("data/changelog.json", {
  version: "2.0.0",
  schema_version: "2.0.0",
  generated_at: today,
  description: "V2 data model changelog.",
  changes: changelog,
});

writeJson("data/release-notes.json", {
  version: "2.0.0",
  schema_version: "2.0.0",
  generated_at: today,
  description: "V2 release notes catalog.",
  release_notes: releaseNotes,
});

console.log(
  JSON.stringify(
    {
      styles: styles.length,
      templates: templates.length,
      components: components.length,
      prompts: prompts.length,
      tokens: tokenSets.length,
      changelog: changelog.length,
      release_notes: releaseNotes.length,
    },
    null,
    2,
  ),
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(path.join(root, filePath), `${JSON.stringify(data, null, 2)}\n`);
}

function readComponentDocs() {
  const source = fs.readFileSync(path.join(root, "app/components/page.tsx"), "utf8");
  const match = source.match(/const componentDocs: ComponentDoc\[] = \[([\s\S]*?)\];/);
  if (!match) {
    throw new Error("Cannot locate componentDocs in app/components/page.tsx");
  }

  return Function(`"use strict"; return [${match[1]}];`)();
}

function buildStylePrompt(style) {
  return {
    id: `prompt-style-${style.id.replace(/^style-/, "")}`,
    name: `${style.name} 页面生成 Prompt`,
    description: `用于基于「${style.name}」生成企业级页面的风格 Prompt。`,
    status: statusFromPriority(style.priority),
    version: "2.0.0",
    owner,
    created_at: today,
    updated_at: today,
    tags: unique(["style", "generation", style.priority.toLowerCase(), ...style.tags]),
    related_items: {
      style_pack: style.id,
      templates: templateIdsByStyle.get(style.id) ?? [],
    },
    prompt_type: "style_generation",
    target_user: "产品、设计、开发和 AI 工具",
    input_variables: ["business_goal", "platform", "page_type", "data_density"],
    prompt_text: [
      `请基于「${style.name}」设计一个企业级业务页面。`,
      `适用场景：${style.scenario}`,
      `视觉方向：${style.visual}`,
      `建议页面：${style.v1}`,
      `主题模式：${style.tokens}`,
      `关键词：${style.tags.join("、")}`,
      "要求界面干净、现代、信息层级清晰，适合真实企业产品使用。",
    ].join("\n"),
    related_template_id: null,
    related_style_id: style.id,
  };
}

function buildTemplatePrompt(template) {
  return {
    id: `prompt-template-${template.id}`,
    name: `${template.name} Prompt`,
    description: `用于生成或复用「${template.name}」的页面 Prompt。`,
    status: normalizeTemplateStatus(template.status),
    version: template.version ?? "2.0.0",
    owner: template.owner ?? owner,
    created_at: today,
    updated_at: today,
    tags: unique(["template", template.platform, template.type, ...(template.ai_tags ?? [])]),
    related_items: {
      template: template.id,
      style_pack: template.style_pack_id,
      components: template.components,
    },
    prompt_type: "template_generation",
    target_user: "产品经理、设计师、前端工程师和 AI 工具",
    input_variables: ["business_object", "primary_actions", "data_source", "permission_rules"],
    prompt_text: template.ai_prompt,
    related_template_id: template.id,
    related_style_id: template.style_pack_id,
  };
}

function buildTokenSets(styles) {
  const byToken = new Map();
  for (const style of styles) {
    const id = tokenIdFromModes(style.tokens);
    const modes = style.tokens.split("/").map((item) => item.trim()).filter(Boolean);
    const current = byToken.get(id) ?? {
      id,
      name: `${style.tokens} Token Set`,
      description: `适用于 ${style.tokens} 的主题模式集合。`,
      status: statusFromPriority(style.priority),
      version: "2.0.0",
      owner,
      created_at: today,
      updated_at: today,
      tags: unique(["tokens", ...modes, ...style.tags.slice(0, 3)]),
      related_items: {
        styles: [],
        templates: [],
        components: [],
        prompts: [],
      },
      token_modes: modes,
      color_roles: ["background", "surface", "text", "muted", "border", "brand", "accent"],
      typography: {
        font_family: "Arial, Helvetica Neue, sans-serif",
        scale: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"],
      },
      spacing: ["4", "8", "12", "16", "20", "24", "32"],
      radius: ["4", "6", "8", "12"],
      shadow: ["none", "sm", "md"],
    };

    current.related_items.styles.push(style.id);
    current.related_items.templates.push(...(templateIdsByStyle.get(style.id) ?? []));
    byToken.set(id, current);
  }

  return Array.from(byToken.values()).map((item) => ({
    ...item,
    related_items: {
      ...item.related_items,
      styles: unique(item.related_items.styles),
      templates: unique(item.related_items.templates),
    },
  }));
}

function buildComponentUsage(components, templates) {
  const usage = new Map();
  for (const component of components) {
    const componentTerms = unique([
      component.name.toLowerCase(),
      component.name.toLowerCase().replace(/([a-z])([A-Z])/g, "$1 $2"),
      ...component.variants.map((item) => item.toLowerCase()),
    ]);

    const usedBy = templates
      .filter((template) => {
        const templateText = template.components.join(" ").toLowerCase();
        return componentTerms.some((term) => templateText.includes(term));
      })
      .map((template) => template.id);

    usage.set(component.name, usedBy);
  }
  return usage;
}

function buildDesignTokens(component) {
  const base = ["color.text", "color.border", "radius.md", "spacing.md"];
  if (component.category.includes("输入")) return unique([...base, "color.brand", "focus.ring"]);
  if (component.category.includes("导航")) return unique([...base, "color.surface", "layout.nav"]);
  if (component.category.includes("展示")) return unique([...base, "color.surface", "shadow.sm"]);
  if (component.category.includes("反馈")) return unique([...base, "color.status", "shadow.md"]);
  return base;
}

function statusFromPriority(priority) {
  if (priority === "P0") return "approved";
  if (priority === "P1") return "reviewing";
  return "draft";
}

function normalizeTemplateStatus(status) {
  if (status === "ready" || status === "approved") return "approved";
  if (status === "sample" || status === "reviewing") return "reviewing";
  if (["draft", "deprecated"].includes(status)) return status;
  return "draft";
}

function normalizePlatform(platform) {
  if (platform === "web admin") return "admin";
  if (platform === "responsive app") return "app";
  if (platform === "mobile") return "mobile-web";
  if (platform === "large screen") return "dashboard";
  return platform;
}

function getSuitableFor(template) {
  const type = template.type.toLowerCase();
  if (type.includes("list")) return ["对象数量多", "需要搜索筛选", "需要批量操作"];
  if (type.includes("approval")) return ["流程审批", "节点流转", "处理意见"];
  if (type.includes("dashboard")) return ["指标概览", "趋势分析", "异常监控"];
  if (type.includes("mobile") || type.includes("app")) return ["移动办公", "快速入口", "任务处理"];
  if (type.includes("form")) return ["信息录入", "配置创建", "校验反馈"];
  if (type.includes("detail")) return ["对象详情", "记录追踪", "状态查看"];
  return ["企业业务页面", "模板复用", "跨角色对齐"];
}

function getNotSuitableFor(template) {
  const type = template.type.toLowerCase();
  if (type.includes("list")) return ["强营销页面", "少量精选内容展示"];
  if (type.includes("approval")) return ["无流程状态的内容页", "纯数据大屏"];
  if (type.includes("dashboard")) return ["大量逐条编辑", "复杂长表单录入"];
  if (type.includes("mobile") || type.includes("app")) return ["超宽复杂表格", "桌面端重配置流程"];
  return ["强品牌传播页", "完全定制交互页面"];
}

function tokenIdFromModes(tokens) {
  return `token-${slugify(tokens)}`;
}

function componentId(name) {
  return `component-${slugify(name)}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}
