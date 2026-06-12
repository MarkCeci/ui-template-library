"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { StyleCard } from "@/components/style-card";
import {
  colorPreferenceFilters,
  getStyleColorPreference,
  moodFilters,
  normalizeStyles,
  type ColorPreference,
  type MoodFilter,
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
  const [advancedOnly, setAdvancedOnly] = useState(false);
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
  const filteredStyles = useMemo(() => {
    return normalizedStyles.filter((style) => {
      const matchesMood = mood === "全部" || style.mood.includes(mood);
      const matchesColor =
        colorPreference === "全部" || getStyleColorPreference(style) === colorPreference;
      const matchesAdvanced = !advancedOnly || style.source.tags.includes("advanced-v4");
      return matchesMood && matchesColor && matchesAdvanced;
    });
  }, [advancedOnly, colorPreference, mood, normalizedStyles]);

  const hasActiveFilters = mood !== "全部" || colorPreference !== "全部" || advancedOnly;
  const clearFilters = () => {
    setMood("全部");
    setColorPreference("全部");
    setAdvancedOnly(false);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[20px] border border-[#E6EAF2] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-5">
        <div className="grid gap-4">
          <MoodFilterGroup
            label="你想要什么感觉？"
            value={mood}
            options={moodFilters}
            onChange={(value) => setMood(value)}
          />
          <ColorFilterGroup
            label="偏好的主色？"
            value={colorPreference}
            options={colorPreferenceFilters}
            onChange={(value) => setColorPreference(value)}
          />
          <FilterRow label="分组入口">
            <button
              type="button"
              onClick={() => setAdvancedOnly((value) => !value)}
              className={filterChipClass(advancedOnly)}
            >
              高级视觉主题
            </button>
          </FilterRow>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-600">
            当前展示{" "}
            <span className="font-semibold text-slate-950">
              {filteredStyles.length}
            </span>{" "}
            / {allStyles.length} 个风格
          </p>

          {hasActiveFilters ? (
            <div className="flex min-w-0 flex-1 flex-wrap gap-2 lg:justify-center">
              <span className="py-1 text-sm font-semibold text-slate-500">已选：</span>
              {mood !== "全部" ? (
                <SelectedPill label={formatMoodLabel(mood)} onRemove={() => setMood("全部")} />
              ) : null}
              {colorPreference !== "全部" ? (
                <SelectedPill label={colorPreference} onRemove={() => setColorPreference("全部")} />
              ) : null}
              {advancedOnly ? (
                <SelectedPill label="高级视觉主题" onRemove={() => setAdvancedOnly(false)} />
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex w-fit justify-center rounded-md px-2 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!hasActiveFilters}
          >
            清空筛选
          </button>
        </div>
      </div>

      {filteredStyles.length > 0 ? (
        <div className="styles-gallery-grid grid gap-5 lg:grid-cols-2">
          {filteredStyles.map((style) => (
            <StyleCard key={style.id} normalized={style} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-950">
            暂时没有匹配的风格
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            换一个气质或主色，就能继续浏览风格货架。
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            查看全部风格
          </button>
        </div>
      )}
    </section>
  );
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
    <div className="grid gap-2.5 lg:grid-cols-[140px_1fr] lg:items-center">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
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
      className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
    >
      {label} ×
    </button>
  );
}

function filterChipClass(active: boolean) {
  return [
    "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition",
    active
      ? "border-[#C4B5FD] bg-[#F1E8FF] text-[#6D28D9]"
      : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
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
