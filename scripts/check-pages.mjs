import fs from "node:fs";
import path from "node:path";
import stylesData from "../data/styles.json" with { type: "json" };
import advancedStylesData from "../data/advanced-styles-v4.json" with { type: "json" };
import expandedStylesData from "../data/expanded-styles-v5.json" with { type: "json" };
import templatesData from "../data/templates.json" with { type: "json" };

const root = process.cwd();
const errors = [];

const staticRoutes = [
  ["/", "app/page.tsx"],
  ["/styles", "app/styles/page.tsx"],
  ["/templates", "app/templates/page.tsx"],
  ["/components", "app/components/page.tsx"],
  ["/design-guide", "app/design-guide/page.tsx"],
  ["/developer", "app/developer/page.tsx"],
  ["/ai-recommend", "app/ai-recommend/page.tsx"],
  ["/admin", "app/admin/page.tsx"],
  ["/admin/design-handoff", "app/admin/design-handoff/page.tsx"],
  ["/style-cover-lab", "app/style-cover-lab/page.tsx"],
  ["/advanced-style-lab", "app/advanced-style-lab/page.tsx"],
];

for (const [route, file] of staticRoutes) {
  assertFile(route, file);
}

assertFile("/styles/[styleId]", "app/styles/[styleId]/page.tsx");
assertFile("/templates/[templateId]", "app/templates/[templateId]/page.tsx");
assertFile("loading", "app/loading.tsx");
assertFile("error", "app/error.tsx");
assertFile("not-found", "app/not-found.tsx");

validateDynamicRoutes();
validateQualityMarkers();

if (errors.length) {
  console.error("Page check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Page check passed:");
console.log(JSON.stringify({
  static_routes: staticRoutes.length,
  style_detail_routes: getAllStyles().length,
  template_detail_routes: templatesData.templates.length,
}, null, 2));

function assertFile(route, file) {
  if (!fs.existsSync(path.join(root, file))) {
    errors.push(`${route}: missing ${file}`);
  }
}

function validateDynamicRoutes() {
  const allStyles = getAllStyles();
  const styleIds = new Set(allStyles.map((item) => item.id));
  const templateIds = new Set(templatesData.templates.map((item) => item.id));

  if (styleIds.size !== allStyles.length) {
    errors.push("/styles/[styleId]: duplicated style ids");
  }
  if (templateIds.size !== templatesData.templates.length) {
    errors.push("/templates/[templateId]: duplicated template ids");
  }

  for (const template of templatesData.templates) {
    if (!styleIds.has(template.style_pack_id)) {
      errors.push(`/templates/${template.id}: missing style ${template.style_pack_id}`);
    }
  }
}

function getAllStyles() {
  return [...stylesData.styles, ...advancedStylesData.styles, ...expandedStylesData.styles];
}

function validateQualityMarkers() {
  const files = [
    "components/styles-explorer.tsx",
    "components/templates-explorer.tsx",
    "components/admin-maintenance-workbench.tsx",
    "components/copy-action.tsx",
    "components/template-detail-preview.tsx",
  ];
  const text = files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  const requiredMarkers = ["没有找到", "清空筛选", "已复制", "loading", "empty", "error", "permission-denied"];

  for (const marker of requiredMarkers) {
    if (!text.includes(marker)) {
      errors.push(`quality marker missing: ${marker}`);
    }
  }
}
