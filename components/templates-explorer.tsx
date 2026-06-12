"use client";

import { useMemo, useState } from "react";
import { TemplateCard } from "@/components/template-card";
import type { StylePack, TemplateItem } from "@/lib/catalog";

type TemplatesExplorerProps = {
  templates: TemplateItem[];
  styles: StylePack[];
  platforms: string[];
  templateTypes: string[];
  scenes: string[];
  statuses: string[];
};

const platformFilters = [
  { value: "ALL", label: "全部平台" },
  { value: "app", label: "app" },
  { value: "admin", label: "admin" },
  { value: "mobile-web", label: "mobile-web" },
  { value: "dashboard", label: "dashboard" },
];

const assetTypeFilters = [
  { value: "ALL", label: "全部类型" },
  { value: "component", label: "component" },
  { value: "pattern", label: "pattern" },
  { value: "template", label: "template" },
  { value: "example", label: "example" },
];

export function TemplatesExplorer({
  templates,
  styles,
  platforms,
  templateTypes,
  scenes,
  statuses,
}: TemplatesExplorerProps) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("ALL");
  const [assetType, setAssetType] = useState("ALL");
  const [styleId, setStyleId] = useState("ALL");
  const [scene, setScene] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [hasCode, setHasCode] = useState("ALL");

  const styleMap = useMemo(
    () => new Map(styles.map((style) => [style.id, style])),
    [styles],
  );

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return templates.filter((template) => {
      const style = styleMap.get(template.style_pack_id);
      const searchText = [
        template.name,
        template.scene,
        template.description,
        template.components.join(" "),
        template.ai_tags.join(" "),
        template.type,
        template.platform,
        style?.name,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = normalizedQuery
        ? searchText.includes(normalizedQuery)
        : true;
      const matchesPlatform =
        platform === "ALL" ? true : getPlatformBucket(template.platform) === platform;
      const matchesAssetType =
        assetType === "ALL"
          ? true
          : getAssetTypeBuckets(template).includes(assetType);
      const matchesStyle = styleId === "ALL" ? true : template.style_pack_id === styleId;
      const matchesScene = scene === "ALL" ? true : template.scene === scene;
      const matchesStatus = status === "ALL" ? true : template.status === status;
      const matchesCode =
        hasCode === "ALL"
          ? true
          : hasCode === "yes"
            ? Boolean(template.code_url)
            : !template.code_url;

      return (
        matchesQuery &&
        matchesPlatform &&
        matchesAssetType &&
        matchesStyle &&
        matchesScene &&
        matchesStatus &&
        matchesCode
      );
    });
  }, [assetType, hasCode, platform, query, scene, status, styleId, styleMap, templates]);

  const clearFilters = () => {
    setQuery("");
    setPlatform("ALL");
    setAssetType("ALL");
    setStyleId("ALL");
    setScene("ALL");
    setStatus("ALL");
    setHasCode("ALL");
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_160px_170px]">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              搜索模板
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                placeholder="搜索模板名称、场景、组件、AI 标签..."
              />
            </label>

            <FilterSelect
              label="平台"
              value={platform}
              onChange={setPlatform}
              options={platformFilters}
            />

            <FilterSelect
              label="交付类型"
              value={assetType}
              onChange={setAssetType}
              options={assetTypeFilters}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_150px_160px]">
            <FilterSelect
              label="风格包"
              value={styleId}
              onChange={setStyleId}
              options={[
                { value: "ALL", label: "全部风格包" },
                ...styles.map((style) => ({ value: style.id, label: style.name })),
              ]}
            />

            <FilterSelect
              label="场景"
              value={scene}
              onChange={setScene}
              options={[
                { value: "ALL", label: "全部场景" },
                ...scenes.map((item) => ({ value: item, label: item })),
              ]}
            />

            <FilterSelect
              label="状态"
              value={status}
              onChange={setStatus}
              options={[
                { value: "ALL", label: "全部状态" },
                ...statuses.map((item) => ({ value: item, label: item })),
              ]}
            />

            <FilterSelect
              label="代码链接"
              value={hasCode}
              onChange={setHasCode}
              options={[
                { value: "ALL", label: "全部" },
                { value: "yes", label: "有代码" },
                { value: "no", label: "无代码" },
              ]}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              当前显示{" "}
              <span className="font-semibold text-slate-950">
                {filteredTemplates.length}
              </span>{" "}
              / {templates.length} 个模板
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              清空筛选
            </button>
          </div>
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                style={styleMap.get(template.style_pack_id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-950">
              没有找到匹配的模板
            </p>
            <p className="mt-2 text-sm text-slate-500">
              可以换一个关键词，或清空平台、类型、风格、场景、状态筛选。
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white"
            >
              清空筛选
            </button>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <SummaryPanel
          title="平台分布"
          items={platforms.map((item) => ({
            label: getPlatformBucket(item),
            value: templates.filter((template) => template.platform === item).length,
          }))}
          onClick={(label) => setPlatform(label)}
        />

        <SummaryPanel
          title="模板类型"
          items={templateTypes.map((item) => ({
            label: item,
            value: templates.filter((template) => template.type === item).length,
          }))}
        />

        <div className="rounded-xl border border-violet-100 bg-violet-50 p-5">
          <h2 className="text-sm font-semibold text-violet-950">如何选择模板</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-violet-900">
            <p>1. 先按平台选择：后台系统看 admin，移动办公看 mobile-web，大屏看 dashboard。</p>
            <p>2. 再按业务场景搜索，例如审批、客户、资源、工作台。</p>
            <p>3. 最后确认是否有 Figma、Storybook、Code 和 Prompt，方便设计或开发接入。</p>
          </div>
        </div>
      </aside>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryPanel({
  title,
  items,
  onClick,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
  onClick?: (label: string) => void;
}) {
  const merged = new Map<string, number>();
  items.forEach((item) => {
    merged.set(item.label, (merged.get(item.label) ?? 0) + item.value);
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-3">
        {Array.from(merged.entries()).map(([label, value]) => (
          <button
            type="button"
            key={label}
            onClick={() => onClick?.(label)}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-violet-200 hover:bg-violet-50"
          >
            <span className="text-sm font-semibold text-slate-700">{label}</span>
            <span className="text-sm font-semibold text-slate-950">{value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function getPlatformBucket(platform: string) {
  if (platform === "web admin") return "admin";
  if (platform === "responsive app") return "app";
  if (platform === "mobile") return "mobile-web";
  if (platform === "large screen") return "dashboard";
  return platform;
}

function getAssetTypeBuckets(template: TemplateItem) {
  const buckets = new Set<string>();

  if (template.status === "ready" || template.status === "approved") {
    buckets.add("template");
  }

  if (template.status === "sample" || template.status === "reviewing") {
    buckets.add("example");
  }

  if (template.components.length > 0) {
    buckets.add("component");
  }

  if (template.layout.regions.length > 0 || template.type.includes("admin")) {
    buckets.add("pattern");
  }

  return Array.from(buckets);
}
