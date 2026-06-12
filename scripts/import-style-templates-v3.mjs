import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const defaultSource = "data/ui-style-templates-v3-45-theme-pack.json";
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
target.description = `${target.description ?? "Style catalog"} Appended ${imported.length} V3 theme pack templates from ${path.basename(sourcePath)}.`;

fs.writeFileSync(path.join(root, targetPath), `${JSON.stringify(target, null, 2)}\n`, "utf8");

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
    "v3-theme-pack",
    template.moodTheme,
    template.themeKey,
    ...toArray(template.category),
    ...toArray(template.personality),
    ...toArray(template.bestFor),
    ...toArray(template.visualSignature),
    ...toArray(template.searchTags),
  ]);

  return {
    id: template.id,
    name: template.name,
    description: template.description,
    status: template.status ?? "approved",
    version: template.version ?? "3.0.0",
    owner: template.owner ?? "Design Platform Core",
    created_at: template.created_at ?? now,
    updated_at: template.updated_at ?? now,
    tags: tags.length ? tags : ["v3-theme-pack"],
    related_items: {
      templates: [],
      prompts: [],
      tokens: [],
      components: Object.keys(template.components ?? {}),
    },
    category: toArray(template.category).join(" / ") || template.moodTheme || "V3 Theme Pack",
    priority: template.priority ?? "P1",
    scenario: toArray(template.bestFor).join("、") || template.description,
    visual: toArray(template.visualSignature).join("、") || template.description,
    v1: formatValue(template.previewComposition) || "后台端预览、移动端预览、色板、AI Prompt",
    tokens: formatValue(template.palette) || "V3 theme variables",
    token_set_id: `token-${template.id}`,
    source: sourceMeta.libraryName ?? sourcePath,
    figma_file_url: template.figma_file_url ?? "https://figma.example.com/file/ui-template-library-v3",
    figma_component_url:
      template.figma_component_url ??
      `https://figma.example.com/file/ui-template-library-v3?node=${template.id}&kind=style-component`,
    figma_page_url:
      template.figma_page_url ??
      `https://figma.example.com/file/ui-template-library-v3?node=${template.id}&kind=style-page`,
    figma_last_updated: template.figma_last_updated ?? now,
    figma_owner: template.figma_owner ?? "Design Platform Core",
    nameEn: template.nameEn,
    moodTheme: template.moodTheme,
    themeKey: template.themeKey,
    themeDescription: template.themeDescription,
    sequenceInTheme: template.sequenceInTheme,
    audienceScope: template.audienceScope,
    platformScope: template.platformScope,
    slogan: template.slogan,
    palette: template.palette,
    gradients: template.gradients,
    personality: template.personality,
    bestFor: template.bestFor,
    avoidFor: template.avoidFor,
    differentiationFromV2: template.differentiationFromV2,
    visualSignature: template.visualSignature,
    previewComposition: template.previewComposition,
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
  return Array.from(new Set(items.map((item) => String(item ?? "").trim()).filter(Boolean)));
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
