import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "data/styles.json",
  "data/advanced-styles-v4.json",
  "data/expanded-styles-v5.json",
];

const catalogs = files.flatMap((file) => {
  const json = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  return (json.styles ?? []).map((style) => ({ ...style, __sourceFile: file }));
});

const visibleStyles = catalogs.filter((style) => style.displayLevel !== "hidden");
const pairs = [];

for (let i = 0; i < visibleStyles.length; i += 1) {
  for (let j = i + 1; j < visibleStyles.length; j += 1) {
    const a = visibleStyles[i];
    const b = visibleStyles[j];
    const score = getSimilarityScore(a, b);
    if (score >= 0.78) {
      pairs.push({ a, b, score });
    }
  }
}

pairs.sort((left, right) => right.score - left.score);

console.log(`Style similarity audit`);
console.log(`- Visible representative styles: ${visibleStyles.length}`);
console.log(`- Hidden/sub-variant styles: ${catalogs.length - visibleStyles.length}`);
console.log(`- Suspicious visible pairs: ${pairs.length}`);

if (pairs.length) {
  console.log("\nTop suspicious pairs:");
  pairs.slice(0, 20).forEach(({ a, b, score }, index) => {
    console.log(
      `${String(index + 1).padStart(2, "0")}. ${Math.round(score * 100)}%  ${a.id} (${a.name})  <->  ${b.id} (${b.name})`,
    );
    console.log(`    建议：${getActionSuggestion(a, b)}。`);
  });
}

const hiddenGroups = groupBy(catalogs.filter((style) => style.displayLevel === "hidden"), (style) => style.parentStyleId ?? style.duplicateGroupId ?? "unknown");
const largestHiddenGroups = Array.from(hiddenGroups.entries())
  .map(([id, items]) => ({ id, count: items.length }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

if (largestHiddenGroups.length) {
  console.log("\nLargest sub-variant groups:");
  largestHiddenGroups.forEach((group) => {
    console.log(`- ${group.id}: ${group.count} variants`);
  });
}

function getSimilarityScore(a, b) {
  const dimensions = [
    same(a.coverVariant, b.coverVariant),
    same(a.previewScenario ?? a.preview_scenario, b.previewScenario ?? b.preview_scenario),
    same(a.colorPreference, b.colorPreference),
    same(a.moodTheme ?? first(a.mood), b.moodTheme ?? first(b.mood)),
    same(a.styleFamily, b.styleFamily),
    same(a.duplicateGroupId, b.duplicateGroupId),
    jaccard(normalizeList(a.suitableFor), normalizeList(b.suitableFor)),
    jaccard(normalizeList(a.visualKeywords), normalizeList(b.visualKeywords)),
    jaccard(normalizeList(a.tags), normalizeList(b.tags)),
    paletteSimilarity(a.palette, b.palette),
    differentiatorSimilarity(a.styleDifferentiators, b.styleDifferentiators),
  ];

  const weights = [0.1, 0.08, 0.09, 0.09, 0.12, 0.08, 0.1, 0.08, 0.08, 0.12, 0.06];
  const total = dimensions.reduce((sum, score, index) => sum + score * weights[index], 0);
  return Number(total.toFixed(4));
}

function getActionSuggestion(a, b) {
  if ((a.parentStyleId && a.parentStyleId === b.parentStyleId) || a.duplicateGroupId === b.duplicateGroupId) {
    return "隐藏为同族子变体，详情页用变体切换展示";
  }
  if (a.styleFamily && a.styleFamily === b.styleFamily) {
    return "合并为同一风格族，仅保留一个代表卡";
  }
  if (a.coverVariant === b.coverVariant && a.colorPreference === b.colorPreference) {
    return "强化封面差异，补充字体、阴影、图标、密度、边框的 styleDifferentiators";
  }
  return "人工复核：确认是否应合并、隐藏为变体或强化差异";
}

function same(a, b) {
  if (!a || !b) return 0;
  return String(a).toLowerCase() === String(b).toLowerCase() ? 1 : 0;
}

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
}

function jaccard(a, b) {
  if (!a.length || !b.length) return 0;
  const left = new Set(a);
  const right = new Set(b);
  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 0;
}

function paletteSimilarity(a, b) {
  const left = typeof a === "object" && a ? a : {};
  const right = typeof b === "object" && b ? b : {};
  const keys = ["primary", "secondary", "accent", "background", "surface", "textPrimary", "border"];
  const scores = keys.map((key) => colorSimilarity(left[key], right[key]));
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function colorSimilarity(a, b) {
  const left = parseHex(a);
  const right = parseHex(b);
  if (!left || !right) return 0;
  const distance = Math.sqrt(
    (left.r - right.r) ** 2 +
      (left.g - right.g) ** 2 +
      (left.b - right.b) ** 2,
  );
  return Math.max(0, 1 - distance / 441.7);
}

function parseHex(value) {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!match) return null;
  const hex = match[1];
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function differentiatorSimilarity(a, b) {
  const left = typeof a === "object" && a ? Object.values(a).join(" ") : "";
  const right = typeof b === "object" && b ? Object.values(b).join(" ") : "";
  if (!left || !right) return 0;
  const leftWords = left.split(/[；，、\s/]+/).filter(Boolean);
  const rightWords = right.split(/[；，、\s/]+/).filter(Boolean);
  return jaccard(leftWords, rightWords);
}

function groupBy(items, getKey) {
  const map = new Map();
  items.forEach((item) => {
    const key = getKey(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  });
  return map;
}
