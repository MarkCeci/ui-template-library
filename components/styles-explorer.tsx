"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleCard } from "@/components/style-card";
import {
  colorPreferenceFilters,
  getStyleColorPreference,
  moodFilters,
  normalizeStyles,
  type ColorPreference,
  type MoodFilter,
  type NormalizedStyle,
} from "@/lib/style-theme";
import type { StylePack } from "@/lib/catalog";

type StylesExplorerProps = {
  styles: StylePack[];
};

const colorChipStyles: Record<
  Exclude<ColorPreference, "全部">,
  { type: "dots" | "gradient"; colors: string[] }
> = {
  蓝色系: { type: "dots", colors: ["#2563EB", "#60A5FA"] },
  紫色系: { type: "dots", colors: ["#7C3AED", "#A78BFA"] },
  绿色系: { type: "dots", colors: ["#16A34A", "#86EFAC"] },
  青色系: { type: "dots", colors: ["#06B6D4", "#67E8F9"] },
  橙色系: { type: "dots", colors: ["#F97316", "#FDBA74"] },
  红粉系: { type: "dots", colors: ["#E11D48", "#FDA4AF"] },
  黑金系: { type: "dots", colors: ["#111827", "#D4AF37"] },
  黑白灰: { type: "dots", colors: ["#111827", "#CBD5E1"] },
  渐变多彩: { type: "gradient", colors: ["#60A5FA", "#A78BFA", "#FDA4AF", "#FDBA74"] },
};

export function StylesExplorer({ styles }: StylesExplorerProps) {
  const [mood, setMood] = useState<MoodFilter>("全部");
  const [colorPreference, setColorPreference] = useState<ColorPreference>("全部");
  const [localStyles, setLocalStyles] = useState<StylePack[]>([]);

  useEffect(() => {
    window.setTimeout(() => {
      setLocalStyles(readPublishedLocalStyles());
    }, 0);
  }, []);

  const allStyles = useMemo(() => {
    const map = new Map(styles.map((style) => [style.id, style]));
    localStyles.forEach((style) => map.set(style.id, style));
    return Array.from(map.values());
  }, [localStyles, styles]);

  const normalizedStyles = useMemo(() => normalizeStyles(allStyles), [allStyles]);
  const featuredStyles = useMemo(
    () => normalizedStyles.filter((style) => style.source.displayLevel !== "hidden"),
    [normalizedStyles],
  );
  const hiddenVariantCount = useMemo(
    () => normalizedStyles.filter((style) => style.source.displayLevel === "hidden").length,
    [normalizedStyles],
  );
  const styleNameById = useMemo(
    () => new Map(normalizedStyles.map((style) => [style.id, style.name])),
    [normalizedStyles],
  );
  const matchesActiveFilters = useCallback((style: NormalizedStyle) => {
      const matchesMood = mood === "全部" || style.mood.includes(mood);
      const matchesColor =
        colorPreference === "全部" || getStyleColorPreference(style) === colorPreference;
      return matchesMood && matchesColor;
  }, [colorPreference, mood]);
  const filteredFeaturedStyles = useMemo(
    () => featuredStyles.filter(matchesActiveFilters),
    [featuredStyles, matchesActiveFilters],
  );
  const matchingHiddenVariantCount = useMemo(
    () => normalizedStyles.filter((style) => style.source.displayLevel === "hidden" && matchesActiveFilters(style)).length,
    [matchesActiveFilters, normalizedStyles],
  );

  const hasActiveFilters = mood !== "全部" || colorPreference !== "全部";
  const hasResults = filteredFeaturedStyles.length > 0;
  const resultsMotionKey = `${mood}-${colorPreference}-${filteredFeaturedStyles.length}-${matchingHiddenVariantCount}`;
  const clearFilters = () => {
    setMood("全部");
    setColorPreference("全部");
  };

  return (
    <section className="space-y-7">
      <div className="rounded-[var(--styles-pitch-radius-card)] border border-[var(--styles-pitch-color-border)] bg-[var(--styles-pitch-color-surface)] p-5 shadow-[var(--styles-pitch-shadow-card)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--styles-pitch-color-text-primary)]">
              快速筛选
            </h2>
            <p className="mt-1 text-sm text-[var(--styles-pitch-color-text-secondary)]">
              先按感觉和颜色缩小范围。
            </p>
          </div>

          {hasActiveFilters ? (
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {mood !== "全部" ? (
                <SelectedPill label={formatMoodLabel(mood)} onRemove={() => setMood("全部")} />
              ) : null}
              {colorPreference !== "全部" ? (
                <SelectedPill label={colorPreference} onRemove={() => setColorPreference("全部")} />
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4">
          <MoodFilterGroup
            label="风格气质"
            value={mood}
            options={moodFilters}
            onChange={(value) => setMood(value === mood ? "全部" : value)}
          />
          <ColorFilterGroup
            label="颜色偏好"
            value={colorPreference}
            options={colorPreferenceFilters}
            onChange={(value) => setColorPreference(value === colorPreference ? "全部" : value)}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[var(--styles-pitch-color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--styles-pitch-color-text-secondary)]">
            正在展示{" "}
            <span className="font-semibold text-[var(--styles-pitch-color-text-primary)]">
              {filteredFeaturedStyles.length}
            </span>{" "}
            / {featuredStyles.length} 个精选方向
            {matchingHiddenVariantCount > 0 ? (
              <span>，另有 {matchingHiddenVariantCount} 个相近方向可在详情页查看。</span>
            ) : hiddenVariantCount > 0 ? (
              <span>，相近方向已收纳到详情页。</span>
            ) : null}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-fit justify-center rounded-md px-1 py-1.5 text-sm font-semibold text-[var(--styles-pitch-color-text-secondary)] transition hover:text-[var(--styles-pitch-color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!hasActiveFilters}
            >
              清空筛选
            </button>
          </div>
        </div>
      </div>

      {hasResults ? (
        <div key={resultsMotionKey} className="styles-results-motion space-y-8">
          <section className="space-y-5">
            <div className="styles-gallery-grid grid gap-6 xl:grid-cols-2">
              {filteredFeaturedStyles.map((style) => (
                <StyleCard
                  key={style.id}
                  normalized={style}
                  parentStyleName={getParentStyleName(style, styleNameById)}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-[var(--styles-pitch-radius-card)] border border-dashed border-[var(--styles-pitch-color-border)] bg-white p-8 text-center shadow-[var(--styles-pitch-shadow-card)] sm:p-12">
          <p className="text-lg font-semibold text-[var(--styles-pitch-color-text-primary)]">
            暂时没有匹配的风格
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--styles-pitch-color-text-secondary)]">
            换一个气质或主色，就能继续浏览风格货架。
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-[var(--styles-pitch-radius-button)] border border-[var(--styles-pitch-color-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--styles-pitch-color-text-primary)] transition hover:border-[var(--styles-pitch-color-primary)] hover:text-[var(--styles-pitch-color-primary)]"
          >
            查看全部风格
          </button>
        </div>
      )}
    </section>
  );
}

function getParentStyleName(
  style: NormalizedStyle,
  styleNameById: Map<string, string>,
) {
  const parentStyleId = style.source.parentStyleId;
  if (!parentStyleId || parentStyleId === style.id) return undefined;
  return styleNameById.get(parentStyleId) ?? parentStyleId;
}

function MoodFilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: MoodFilter;
  options: MoodFilter[];
  onChange: (value: MoodFilter) => void;
}) {
  return (
    <FilterRow label={label}>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={filterChipClass(active)}
          >
            {formatMoodLabel(option)}
          </button>
        );
      })}
    </FilterRow>
  );
}

function ColorFilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: ColorPreference;
  options: ColorPreference[];
  onChange: (value: ColorPreference) => void;
}) {
  return (
    <FilterRow label={label}>
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={filterChipClass(active)}
          >
            {option === "全部" ? null : <ColorMark option={option} />}
            {option}
          </button>
        );
      })}
    </FilterRow>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2.5 lg:grid-cols-[92px_1fr] lg:items-start">
      <p className="pt-2 text-sm font-semibold text-[var(--styles-pitch-color-text-primary)]">{label}</p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        {children}
      </div>
    </div>
  );
}

function ColorMark({ option }: { option: Exclude<ColorPreference, "全部"> }) {
  const style = colorChipStyles[option];

  if (style.type === "gradient") {
    return (
      <span
        className="h-2.5 w-8 rounded-full"
        style={{ background: `linear-gradient(90deg, ${style.colors.join(", ")})` }}
      />
    );
  }

  return (
    <span className="flex items-center -space-x-1">
      {style.colors.map((color) => (
        <span
          key={color}
          className="h-3 w-3 rounded-full border border-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]"
          style={{ background: color }}
        />
      ))}
    </span>
  );
}

function SelectedPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="rounded-[var(--styles-pitch-radius-chip)] border border-[var(--styles-pitch-color-border)] bg-[var(--styles-pitch-color-surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--styles-pitch-color-text-secondary)] transition hover:border-[var(--styles-pitch-color-primary-soft)] hover:text-[var(--styles-pitch-color-primary)]"
    >
      {label} ×
    </button>
  );
}

function filterChipClass(active: boolean) {
  return [
    "styles-filter-chip inline-flex h-9 shrink-0 items-center gap-2 rounded-[var(--styles-pitch-radius-chip)] border px-3 text-sm font-semibold transition",
    active
      ? "border-[var(--styles-pitch-color-primary-soft)] bg-[var(--styles-pitch-color-primary-soft)] text-[var(--styles-pitch-color-primary)]"
      : "border-[var(--styles-pitch-color-border)] bg-white text-[var(--styles-pitch-color-text-secondary)] hover:border-[var(--styles-pitch-color-primary)] hover:text-[var(--styles-pitch-color-primary)]",
  ].join(" ");
}

function formatMoodLabel(value: MoodFilter) {
  return value === "科技AI" ? "科技 AI" : value;
}

function readPublishedLocalStyles(): StylePack[] {
  try {
    const raw = JSON.parse(localStorage.getItem("designMaintenanceStyles") || "[]") as unknown[];
    return raw
      .map(localStyleToStylePack)
      .filter((style): style is StylePack => Boolean(style));
  } catch {
    return [];
  }
}

function localStyleToStylePack(value: unknown): StylePack | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (item.status !== "published" || typeof item.id !== "string" || typeof item.name !== "string") {
    return null;
  }

  const tokens = item.tokens as
    | {
        light?: {
          colors?: Record<string, string>;
          primary?: string;
          secondary?: string;
          accent?: string;
          background?: string;
          surface?: string;
          textPrimary?: string;
          textSecondary?: string;
          border?: string;
        };
      }
    | undefined;
  const light = tokens?.light?.colors ?? tokens?.light ?? {};
  const tags = Array.isArray(item.tags) ? item.tags.map(String) : ["本地发布"];
  const suitableFor = Array.isArray(item.suitableFor) ? item.suitableFor.map(String) : ["企业项目"];
  const mood = Array.isArray(item.mood) ? item.mood.map(String) : [];
  const preview = item.preview as { coverVariant?: string } | undefined;

  return {
    id: item.id,
    name: item.name,
    description: typeof item.description === "string" ? item.description : "本地发布的网页维护风格。",
    status: "published",
    version: typeof item.version === "string" ? item.version : "0.1.0",
    owner: typeof item.owner === "string" ? item.owner : "设计团队",
    created_at: typeof item.createdAt === "string" ? item.createdAt : undefined,
    updated_at: typeof item.updatedAt === "string" ? item.updatedAt : undefined,
    related_items: {},
    category: mood[0] ?? "本地维护风格",
    priority: "P1",
    scenario: suitableFor.join("、"),
    visual: typeof item.slogan === "string" ? item.slogan : "网页内维护的风格 Token。",
    v1: "App 首页、个人中心、卡片列表、网页仪表盘",
    tokens: "light / dark",
    tags: ["本地发布", ...tags],
    suitableFor,
    notSuitableFor: Array.isArray(item.notSuitableFor) ? item.notSuitableFor.map(String) : [],
    slogan: typeof item.slogan === "string" ? item.slogan : undefined,
    moodTheme: mood[0],
    colorPreference: typeof item.colorPreference === "string" ? item.colorPreference : undefined,
    coverVariant: preview?.coverVariant,
    palette: {
      primary: light.primary ?? "#2563EB",
      secondary: light.secondary ?? "#60A5FA",
      accent: light.accent ?? "#7C3AED",
      background: light.background ?? "#F8FAFC",
      surface: light.surface ?? "#FFFFFF",
      textPrimary: light.textPrimary ?? "#0F172A",
      textSecondary: light.textSecondary ?? "#475569",
      border: light.border ?? "#E2E8F0",
    },
    cssVariables: {
      "--color-primary": light.primary ?? "#2563EB",
      "--color-secondary": light.secondary ?? "#60A5FA",
      "--color-accent": light.accent ?? "#7C3AED",
      "--color-bg": light.background ?? "#F8FAFC",
      "--color-surface": light.surface ?? "#FFFFFF",
      "--color-text": light.textPrimary ?? "#0F172A",
      "--color-muted": light.textSecondary ?? "#475569",
      "--color-border": light.border ?? "#E2E8F0",
    },
  };
}
