import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const defaultSource = "data/ui-style-templates-v2-20.json";
const sourcePath = process.argv[2] ?? defaultSource;
const targetPath = "data/styles.json";

const source = readJson(sourcePath);
const target = readJson(targetPath);

if (!Array.isArray(source.templates)) {
  throw new Error(`${sourcePath}: missing templates array`);
}

const existingIds = new Set(target.styles.map((style) => style.id));
const imported = [];

for (const template of source.templates) {
  if (!template?.id || existingIds.has(template.id)) {
    continue;
  }

  imported.push(normalizeStyleTemplate(template, source));
  existingIds.add(template.id);
}

target.styles.push(...imported);
target.generated_at = new Date().toISOString().slice(0, 10);
target.description = `${target.description ?? "Style catalog"} Appended ${imported.length} V2 style templates from ${path.basename(sourcePath)}.`;

fs.writeFileSync(
  path.join(root, targetPath),
  `${JSON.stringify(target, null, 2)}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      source: sourcePath,
      target: targetPath,
      sourceTemplates: source.templates.length,
      appended: imported.length,
      totalStyles: target.styles.length,
    },
    null,
    2,
  ),
);

function normalizeStyleTemplate(template, sourceMeta) {
  const now = new Date().toISOString().slice(0, 10);
  const tags = unique([
    "v2-style-template",
    ...toArray(template.category),
    ...toArray(template.personality),
    ...toArray(template.bestFor),
    ...toArray(template.searchTags),
  ]).filter(Boolean);

  return {
    id: template.id,
    name: template.name,
    description: template.description,
    status: template.status ?? "approved",
    version: template.version ?? "1.0.0",
    owner: template.owner ?? "Design Platform Core",
    created_at: template.created_at ?? now,
    updated_at: template.updated_at ?? now,
    tags: tags.length ? tags : ["v2-style-template"],
    related_items: {
      templates: [],
      prompts: [],
      tokens: [],
      components: Object.keys(template.components ?? {}),
    },
    category: toArray(template.category).join(" / ") || "V2 风格模板",
    priority: template.priority ?? "P1",
    scenario: toArray(template.bestFor).join("、") || template.description,
    visual: [
      formatValue(template.personality),
      formatValue(template.shape),
      formatValue(template.effects),
    ]
      .filter(Boolean)
      .join("；"),
    v1: formatValue(template.layout) || "首屏预览、风格卡片、组件状态、AI Prompt",
    tokens: formatValue(template.palette) || "V2 style variables",
    token_set_id: `token-${template.id}`,
    source: sourceMeta.libraryName ?? sourcePath,
    figma_file_url: template.figma_file_url ?? "https://figma.example.com/file/ui-template-library",
    figma_component_url:
      template.figma_component_url ??
      `https://figma.example.com/file/ui-template-library?node=${template.id}&kind=style-component`,
    figma_page_url:
      template.figma_page_url ??
      `https://figma.example.com/file/ui-template-library?node=${template.id}&kind=style-page`,
    figma_last_updated: template.figma_last_updated ?? now,
    figma_owner: template.figma_owner ?? "Design Platform Core",
    nameEn: template.nameEn,
    palette: template.palette,
    gradients: template.gradients,
    personality: template.personality,
    bestFor: template.bestFor,
    avoidFor: template.avoidFor,
    components: template.components,
    layout: template.layout,
    shape: template.shape,
    effects: template.effects,
    typography: template.typography,
    imagery: template.imagery,
    motion: template.motion,
    accessibility: template.accessibility,
    dos: template.dos,
    donts: template.donts,
    previewPrompt: template.previewPrompt,
    cssVariables: template.cssVariables,
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, filePath), "utf8"));
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function unique(items) {
  return Array.from(new Set(items.map((item) => String(item).trim()).filter(Boolean)));
}

function formatValue(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value.map(formatValue).filter(Boolean).join("、");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key}: ${formatValue(item)}`)
      .filter(Boolean)
      .join("；");
  }
  return String(value);
}
