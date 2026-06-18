import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const commonFields = [
  "id",
  "name",
  "description",
  "status",
  "version",
  "owner",
  "created_at",
  "updated_at",
  "tags",
  "related_items",
];

const specs = [
  {
    file: "data/styles.json",
    collection: "styles",
    fields: ["category", "priority", "scenario", "visual", "v1", "tokens"],
  },
  {
    file: "data/templates.json",
    collection: "templates",
    fields: [
      "platform",
      "scene",
      "style_pack_id",
      "layout",
      "components",
      "states",
      "figma_url",
      "storybook_url",
      "code_url",
      "ai_prompt_id",
      "preview_type",
      "suitable_for",
      "not_suitable_for",
      "figma_file_url",
      "figma_component_url",
      "figma_page_url",
      "figma_last_updated",
      "figma_owner",
      "design_acceptance",
    ],
  },
  {
    file: "data/components.json",
    collection: "components",
    fields: [
      "category",
      "variants",
      "states",
      "design_tokens",
      "figma_url",
      "storybook_url",
      "code_url",
      "used_by_templates",
      "figma_file_url",
      "figma_component_url",
      "figma_page_url",
      "figma_last_updated",
      "figma_owner",
    ],
  },
  {
    file: "data/prompts.json",
    collection: "prompts",
    fields: [
      "prompt_type",
      "target_user",
      "input_variables",
      "prompt_text",
      "related_template_id",
      "related_style_id",
    ],
  },
  {
    file: "data/tokens.json",
    collection: "tokens",
    fields: ["token_modes", "color_roles"],
  },
  {
    file: "data/changelog.json",
    collection: "changes",
    fields: ["change_type", "summary"],
  },
  {
    file: "data/release-notes.json",
    collection: "release_notes",
    fields: ["highlights"],
  },
];

const errors = [];
const summaries = {};

const datasets = new Map(
  specs.map((spec) => {
    const data = readJson(spec.file);
    const items =
      spec.collection === "styles"
        ? [...data[spec.collection], ...readOptionalStyleExtensions()]
        : data[spec.collection];
    if (!Array.isArray(items)) {
      errors.push(`${spec.file}: missing array "${spec.collection}"`);
      return [spec.collection, []];
    }
    summaries[spec.collection] = items.length;
    validateItems(spec.file, items, [...commonFields, ...spec.fields]);
    return [spec.collection, items];
  }),
);

validateRelations();

if (errors.length > 0) {
  console.error("Data validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Data validation passed:");
console.log(JSON.stringify(summaries, null, 2));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(root, filePath), "utf8"));
}

function readOptionalStyleExtensions() {
  return ["data/advanced-styles-v4.json", "data/expanded-styles-v5.json"].flatMap((file) => {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(data.styles) ? data.styles : [];
  });
}

function validateItems(file, items, requiredFields) {
  const seenIds = new Set();

  for (const item of items) {
    if (seenIds.has(item.id)) {
      errors.push(`${file}: duplicated id "${item.id}"`);
    }
    seenIds.add(item.id);

    for (const field of requiredFields) {
      if (!(field in item)) {
        errors.push(`${file}: ${item.id} missing "${field}"`);
      }
    }

    if (!hasValue(item.id) || !hasValue(item.name) || !hasValue(item.description)) {
      errors.push(`${file}: ${item.id ?? "unknown"} id/name/description must not be empty`);
    }

    if (!Array.isArray(item.tags) || item.tags.length === 0) {
      errors.push(`${file}: ${item.id} tags must be an array`);
    }
  }
}

function validateRelations() {
  const styles = datasets.get("styles");
  const templates = datasets.get("templates");
  const components = datasets.get("components");
  const prompts = datasets.get("prompts");

  const styleIds = new Set(styles.map((item) => item.id));
  const templateIds = new Set(templates.map((item) => item.id));
  const componentKeys = new Set(
    components.flatMap((item) => [
      item.id.toLowerCase(),
      item.name.toLowerCase(),
      ...item.tags.map((tag) => tag.toLowerCase()),
    ]),
  );
  const promptIds = new Set(prompts.map((item) => item.id));

  for (const style of styles) {
    for (const urlField of ["figma_file_url", "figma_component_url", "figma_page_url"]) {
      validateUrl(`data/styles.json: ${style.id}`, urlField, style[urlField]);
    }
    if (!hasValue(style.figma_last_updated) || !hasValue(style.figma_owner)) {
      errors.push(`data/styles.json: ${style.id} missing Figma owner or updated date`);
    }
  }

  for (const template of templates) {
    if (!styleIds.has(template.style_pack_id)) {
      errors.push(`data/templates.json: ${template.id} references missing style ${template.style_pack_id}`);
    }

    if (!promptIds.has(template.ai_prompt_id)) {
      errors.push(`data/templates.json: ${template.id} references missing prompt ${template.ai_prompt_id}`);
    }

    for (const urlField of [
      "figma_url",
      "storybook_url",
      "code_url",
      "figma_file_url",
      "figma_component_url",
      "figma_page_url",
    ]) {
      validateUrl(`data/templates.json: ${template.id}`, urlField, template[urlField]);
    }

    validateDesignAcceptance(template);

    for (const component of template.components) {
      if (!isTemplateComponentMapped(component, componentKeys)) {
        errors.push(`data/templates.json: ${template.id} references unmapped component "${component}"`);
      }
    }
  }

  for (const component of components) {
    for (const templateId of component.used_by_templates) {
      if (!templateIds.has(templateId)) {
        errors.push(`data/components.json: ${component.id} references missing template ${templateId}`);
      }
    }
    for (const urlField of [
      "figma_url",
      "storybook_url",
      "code_url",
      "figma_file_url",
      "figma_component_url",
      "figma_page_url",
    ]) {
      validateUrl(`data/components.json: ${component.id}`, urlField, component[urlField]);
    }
  }

  for (const prompt of prompts) {
    if (prompt.related_template_id && !templateIds.has(prompt.related_template_id)) {
      errors.push(`data/prompts.json: ${prompt.id} references missing template ${prompt.related_template_id}`);
    }
    if (prompt.related_style_id && !styleIds.has(prompt.related_style_id)) {
      errors.push(`data/prompts.json: ${prompt.id} references missing style ${prompt.related_style_id}`);
    }
  }

  validateRouteIds(styles, templates);
}

function validateRouteIds(styles, templates) {
  const badStyleIds = styles.filter((item) => !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(item.id));
  const badTemplateIds = templates.filter((item) => !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(item.id));
  for (const item of badStyleIds) errors.push(`data/styles.json: ${item.id} is not URL-safe`);
  for (const item of badTemplateIds) errors.push(`data/templates.json: ${item.id} is not URL-safe`);
}

function validateUrl(scope, field, value) {
  if (typeof value !== "string" || !/^https?:\/\/.+/i.test(value)) {
    errors.push(`${scope} invalid ${field}`);
  }
}

function validateDesignAcceptance(template) {
  const required = [
    "follows_style_pack",
    "uses_standard_components",
    "includes_empty_state",
    "includes_error_state",
    "includes_loading_state",
    "includes_responsive_notes",
    "includes_figma_link",
  ];
  if (!template.design_acceptance || typeof template.design_acceptance !== "object") {
    errors.push(`data/templates.json: ${template.id} missing design_acceptance`);
    return;
  }
  for (const key of required) {
    if (typeof template.design_acceptance[key] !== "boolean") {
      errors.push(`data/templates.json: ${template.id} design_acceptance.${key} must be boolean`);
    }
  }
}

function isTemplateComponentMapped(component, componentKeys) {
  const normalized = compact(component);
  if (componentKeys.has(component.toLowerCase()) || componentKeys.has(normalized)) return true;
  if (normalized.endsWith("marker")) return true;

  const aliases = {
    appshell: ["sidebar", "topbar", "menu"],
    navigation: ["menu", "sidebar", "topbar"],
    statustag: ["tag", "badge"],
    emptystate: ["empty"],
    metriccard: ["card", "chartcard"],
    linechart: ["chartcard"],
    barchart: ["chartcard"],
    activitylist: ["card", "table"],
    searchinput: ["searchbar", "input"],
    filtergroup: ["select", "checkbox", "radio"],
    datatable: ["table"],
    batchactionbar: ["button", "table"],
    approvalcard: ["card"],
    evidenceviewer: ["card", "drawer"],
    decisionbuttons: ["button"],
    auditlog: ["table", "card"],
    mobilecard: ["card"],
    bottomnav: ["menu", "topbar"],
    largetapbutton: ["button"],
    messagebadge: ["badge"],
    formfield: ["input", "select", "textarea"],
    validationmessage: ["alert"],
    stickysubmitbar: ["button"],
    welcomepanel: ["card"],
    quickaction: ["button", "card"],
    feedcard: ["card"],
    notificationitem: ["alert", "badge"],
    detailheader: ["card"],
    tabgroup: ["tabs"],
    descriptionlist: ["card"],
    timeline: ["card"],
    recordsummary: ["card"],
    sideactivity: ["drawer", "card"],
    relatedlist: ["table"],
    commentbox: ["textarea"],
    kanbancolumn: ["card"],
    listitem: ["card"],
    statusfilter: ["select", "tag"],
    assigneechip: ["avatar", "tag"],
    darkmetrictile: ["chartcard", "card"],
    glowchart: ["chartcard"],
    mapmodule: ["card"],
    realtimeticker: ["badge", "alert"],
  };

  return (aliases[normalized] ?? []).some((alias) => componentKeys.has(alias));
}

function compact(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, "");
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return true;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}
