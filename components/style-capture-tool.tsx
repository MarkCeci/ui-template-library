"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";

type Palette = {
  vibrant: string;
  muted: string;
  darkVibrant: string;
  darkMuted: string;
  lightVibrant: string;
  lightMuted: string;
  averageColor: string;
};

type ThemeMode = "light" | "dark";
type ThemeStyle = "normal" | "gradient" | "glass" | "linear" | "glow";
type RadiusMode = "restrained" | "soft" | "rounded";
type ShadowMode = "none" | "light" | "medium";
type DensityMode = "comfortable" | "compact";
type PreviewTab = "app-home" | "profile" | "card-list" | "dashboard";
type ExportTab = "css" | "tailwind" | "json";
type ExportScope = "light" | "dark" | "both";

type ThemeOptions = {
  mode: ThemeMode;
  style: ThemeStyle;
  radius: RadiusMode;
  shadow: ShadowMode;
  density: DensityMode;
};

type EditableModeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  textInverse: string;
  border: string;
};

type ModeTokens = {
  colors: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    primarySoft: string;
    primarySofter: string;
    secondary: string;
    secondarySoft: string;
    accent: string;
    accentSoft: string;
    background: string;
    backgroundGradient: string;
    surface: string;
    surfaceElevated: string;
    surfaceMuted: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textAccent: string;
    textInverse: string;
    border: string;
    divider: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
    border: string;
    glow: string;
  };
  shadow: {
    card: string;
    floating: string;
    glow: string;
  };
};

type SharedTokens = {
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    headingWeight: number;
    bodyWeight: number;
  };
  effects: {
    blur: string;
    glassOpacity: number;
    glowIntensity: number;
  };
  density: DensityMode;
};

type ActiveThemeTokens = ModeTokens & SharedTokens;

type ThemeTokens = {
  light: ModeTokens;
  dark: ModeTokens;
  shared: SharedTokens;
};

const fallbackPalette: Palette = {
  vibrant: "#6D28D9",
  muted: "#64748B",
  darkVibrant: "#312E81",
  darkMuted: "#334155",
  lightVibrant: "#C4B5FD",
  lightMuted: "#E2E8F0",
  averageColor: "#F8FAFC",
};

const defaultOptions: ThemeOptions = {
  mode: "light",
  style: "gradient",
  radius: "soft",
  shadow: "light",
  density: "comfortable",
};

const previewTabs: Array<[PreviewTab, string]> = [
  ["app-home", "App 首页"],
  ["profile", "个人中心"],
  ["card-list", "卡片列表"],
  ["dashboard", "网页仪表盘"],
];

const exportTabs: Array<[ExportTab, string]> = [
  ["css", "CSS Variables"],
  ["tailwind", "Tailwind Config"],
  ["json", "Design Tokens JSON"],
];

export function StyleCaptureTool() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [palette, setPalette] = useState<Palette>(fallbackPalette);
  const [colorModes, setColorModes] = useState<Record<ThemeMode, EditableModeColors>>(() =>
    paletteToEditableColorModes(fallbackPalette),
  );
  const [options, setOptions] = useState<ThemeOptions>(defaultOptions);
  const [styleName, setStyleName] = useState("蓝紫智能风");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("app-home");
  const [exportTab, setExportTab] = useState<ExportTab>("css");
  const [exportScope, setExportScope] = useState<ExportScope>("both");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const [savedCount, setSavedCount] = useState(0);

  const themeTokens = useMemo(
    () => buildThemeTokens(colorModes, options),
    [colorModes, options],
  );
  const activeTokens = useMemo(
    () => getActiveTokens(themeTokens, options.mode),
    [themeTokens, options.mode],
  );
  const activeColors = colorModes[options.mode];
  const qualityChecks = useMemo(() => getThemeQualityChecks(themeTokens), [themeTokens]);

  const exportCode = useMemo(
    () => ({
      css: toCssVariables(themeTokens, exportScope),
      tailwind: toTailwindConfig(themeTokens, exportScope),
      json: toJsonTokens(themeTokens, exportScope),
    }),
    [themeTokens, exportScope],
  );

  async function handleUpload(file?: File) {
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      setStatus("error");
      setMessage("请上传 png、jpg、jpeg 或 webp 图片。");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setImageUrl(nextUrl);
    setImageName(file.name);
    setStatus("loading");
    setMessage("正在提取图片色板...");

    try {
      const extracted = await extractPalette(nextUrl);
      setPalette(extracted);
      const nextColorModes = paletteToEditableColorModes(extracted);
      setColorModes(nextColorModes);
      setStyleName(suggestName(nextColorModes.light.primary, extracted));
      setStatus("ready");
      setMessage("色板已生成，你可以微调后复制给开发使用。");
    } catch {
      const average = await getAverageColor(nextUrl).catch(() => fallbackPalette.averageColor);
      const fallback = { ...fallbackPalette, averageColor: average };
      setPalette(fallback);
      setColorModes(paletteToEditableColorModes(fallback));
      setStyleName(suggestName(fallback.vibrant, fallback));
      setStatus("error");
      setMessage("自动提取失败，已使用兜底色板生成主题。");
    }
  }

  function updateManualColor(key: keyof EditableModeColors, value: string) {
    const normalized = normalizeHex(value);
    setColorModes((current) => {
      const currentMode = options.mode;
      const otherMode = currentMode === "light" ? "dark" : "light";
      const next = {
        ...current,
        [currentMode]: { ...current[currentMode], [key]: normalized },
      };

      if (["primary", "secondary", "accent", "textAccent"].includes(key)) {
        next[otherMode] = {
          ...next[otherMode],
          [key]: deriveModeColor(normalized, otherMode, key),
        };
      }

      return next;
    });
  }

  function updateOption<K extends keyof ThemeOptions>(key: K, value: ThemeOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  async function copyCode(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setMessage("复制失败，请检查浏览器剪贴板权限。");
    }
  }

  function saveDraft() {
    const now = new Date().toISOString();
    const draftId = `style-capture-${Date.now()}`;
    const draft = {
      id: draftId,
      name: styleName || "未命名捕捉风格",
      source: "style-capture",
      status: "draft",
      mood: [options.style === "glass" ? "高级轻奢" : options.style === "glow" ? "科技 AI" : "商务稳重"],
      colorPreference: inferColorPreference(activeTokens.colors.primary),
      description: "从风格捕捉器生成的网页内维护草稿，可以继续微调 Token、预览和验收项。",
      suitableFor: ["企业后台", "移动 App", "视觉探索"],
      notSuitableFor: ["需要严格品牌规范的正式发布"],
      tags: ["风格捕捉", options.style, options.mode],
      tokens: themeTokens,
      preview: {
        coverVariant: options.style === "glass" ? "glass-premium" : options.mode === "dark" ? "dark-dashboard" : "saas-clean",
        scenarios: [previewTab, "网页仪表盘"],
        showAppHome: true,
        showProfile: true,
        showCardList: true,
        showDashboard: true,
      },
      acceptance: {
        hasName: Boolean(styleName),
        hasScenario: true,
        hasLightMode: true,
        hasDarkMode: true,
        appReadable: false,
        profileReadable: false,
        listReadable: false,
        dashboardReadable: false,
        buttonReadable: false,
        tagReadable: false,
        cardLayered: false,
        hasChangelog: true,
      },
      changelog: [
        {
          title: "从截图生成风格草稿",
          type: "新增风格",
          description: "通过上传图片提取色板，并生成浅色、深色和共享 Token。",
          scope: "颜色 Token、预览场景、代码导出",
          owner: "设计团队",
          updatedAt: now,
          version: "0.1.0",
        },
      ],
      createdAt: now,
      updatedAt: now,
      owner: "设计团队",
      version: "0.1.0",
      themeTokens,
    };
    const stored = JSON.parse(localStorage.getItem("styleCaptureDrafts") || "[]") as unknown[];
    localStorage.setItem("styleCaptureDrafts", JSON.stringify([draft, ...stored], null, 2));
    const maintenanceStored = JSON.parse(localStorage.getItem("designMaintenanceStyles") || "[]") as Array<{ id?: string }>;
    const nextMaintenance = [draft, ...maintenanceStored.filter((item) => item.id !== draftId)];
    localStorage.setItem("designMaintenanceStyles", JSON.stringify(nextMaintenance, null, 2));
    setSavedCount((count) => count + 1);
    setMessage("已保存为风格草稿，正在打开设计维护台。");
    window.setTimeout(() => {
      window.location.href = `/design-guide?styleId=${draftId}`;
    }, 450);
  }

  function resetTheme() {
    setImageUrl("");
    setImageName("");
    setPalette(fallbackPalette);
    setColorModes(paletteToEditableColorModes(fallbackPalette));
    setOptions(defaultOptions);
    setStyleName("蓝紫智能风");
    setStatus("idle");
    setMessage("");
  }

  function syncOtherMode() {
    setColorModes((current) => {
      const currentMode = options.mode;
      const otherMode = currentMode === "light" ? "dark" : "light";
      return {
        ...current,
        [otherMode]: generateOppositeMode(current[currentMode], otherMode),
      };
    });
    setMessage("已根据当前模式同步生成另一套主题。");
  }

  function optimizeCurrentMode() {
    setColorModes((current) => ({
      ...current,
      [options.mode]: optimizeModeColors(current[options.mode], options.mode),
    }));
    setMessage(`已优化${options.mode === "light" ? "浅色" : "深色"}模式的可读性。`);
  }

  function optimizeBothModes() {
    setColorModes((current) => ({
      light: optimizeModeColors(current.light, "light"),
      dark: optimizeModeColors(current.dark, "dark"),
    }));
    setMessage("已同时优化浅色和深色模式的可读性。");
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-700">上传一张喜欢的截图</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              我们会帮你提取颜色并生成主题
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              这不是普通取色器：上传图片后会生成可读性更好的 UI 语义 Token，并同步预览 App、列表和后台页面效果。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              保存为风格草稿
            </button>
            <button
              type="button"
              onClick={resetTheme}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              重置主题
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.88fr_1fr_1.18fr]">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle title="1. 上传图片" helper="支持 png、jpg、jpeg、webp。" />
          <label className="mt-4 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-5 text-center transition hover:bg-violet-50">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="sr-only"
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={imageName || "上传图片预览"}
                className="max-h-64 w-full rounded-2xl object-contain"
              />
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
                  <Icon icon="layers" size={22} color="currentColor" />
                </span>
                <span className="mt-4 text-base font-semibold text-slate-950">点击上传截图</span>
                <span className="mt-2 text-sm leading-6 text-slate-500">
                  例如产品截图、品牌海报、竞品页面或视觉参考图。
                </span>
              </>
            )}
          </label>
          {imageName ? <p className="mt-3 truncate text-xs font-medium text-slate-500">{imageName}</p> : null}
          <StatusMessage status={status} message={message} />
          <PalettePanel palette={palette} />
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle title="2. 调整主题" helper="颜色可以手动微调，右侧预览会实时变化。" />
          <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-3">
            <p className="text-sm font-semibold text-violet-900">
              当前正在编辑：{options.mode === "light" ? "浅色模式" : "深色模式"}
            </p>
            <p className="mt-1 text-xs leading-5 text-violet-700">
              主色、辅助色、强调色会同步保持同一风格基因；背景、卡片和文字色只影响当前模式。
            </p>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">风格名称</span>
            <input
              value={styleName}
              onChange={(event) => setStyleName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <ColorGroup
            title="品牌色"
            helper="影响按钮、关键数字、图标和品牌识别。"
            fields={[
              ["primary", "主色"],
              ["secondary", "辅助色"],
              ["accent", "强调色"],
              ["textAccent", "文字主色"],
            ]}
            colors={activeColors}
            onChange={updateManualColor}
          />
          <ColorGroup
            title="界面底色"
            helper="背景和卡片只调整当前模式，避免深色模式变成简单反色。"
            fields={[
              ["background", "页面背景"],
              ["surface", "卡片背景"],
              ["surfaceMuted", "弱背景"],
              ["border", "边框色"],
            ]}
            colors={activeColors}
            onChange={updateManualColor}
          />
          <ColorGroup
            title="文字色"
            helper="主文字、次文字和反白文字分别控制可读性。"
            fields={[
              ["textPrimary", "主文字"],
              ["textSecondary", "次文字"],
              ["textInverse", "反白文字"],
            ]}
            colors={activeColors}
            onChange={updateManualColor}
          />

          <div className="mt-5 grid gap-4">
            <OptionGroup
              label="模式"
              value={options.mode}
              options={[
                ["light", "浅色"],
                ["dark", "深色"],
              ]}
              onChange={(value) => updateOption("mode", value as ThemeMode)}
            />
            <OptionGroup
              label="风格"
              value={options.style}
              options={[
                ["normal", "普通"],
                ["gradient", "渐变"],
                ["glass", "玻璃"],
                ["linear", "线性"],
                ["glow", "微光"],
              ]}
              onChange={(value) => updateOption("style", value as ThemeStyle)}
            />
            <OptionGroup
              label="圆角"
              value={options.radius}
              options={[
                ["restrained", "克制"],
                ["soft", "柔和"],
                ["rounded", "大圆角"],
              ]}
              onChange={(value) => updateOption("radius", value as RadiusMode)}
            />
            <OptionGroup
              label="阴影"
              value={options.shadow}
              options={[
                ["none", "无"],
                ["light", "轻"],
                ["medium", "中"],
              ]}
              onChange={(value) => updateOption("shadow", value as ShadowMode)}
            />
            <OptionGroup
              label="密度"
              value={options.density}
              options={[
                ["comfortable", "舒适"],
                ["compact", "紧凑"],
              ]}
              onChange={(value) => updateOption("density", value as DensityMode)}
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={syncOtherMode}
              className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
            >
              同步生成另一模式
            </button>
            <button
              type="button"
              onClick={optimizeCurrentMode}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              一键优化当前模式
            </button>
            <button
              type="button"
              onClick={optimizeBothModes}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              一键优化双模式
            </button>
          </div>
          <QualityPanel checks={qualityChecks} />
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <SectionTitle title="3. 实时预览" helper="预览是真实业务页面，会跟随 Token 变化。" />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {previewTabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPreviewTab(id)}
                className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  previewTab === id
                    ? "border-violet-200 bg-violet-50 text-violet-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ThemePreview tab={previewTab} tokens={activeTokens} name={styleName} options={options} />
        </section>
      </div>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle title="4. 复制给开发" helper="MVP 先导出代码片段，后续可以接入 Admin 审核和数据库。" />
          <div className="grid gap-2">
            <div className="flex gap-2 overflow-x-auto">
              {(["light", "dark", "both"] as ExportScope[]).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setExportScope(scope)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold ${
                    exportScope === scope
                      ? "border-violet-200 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {scope === "light" ? "只导出浅色" : scope === "dark" ? "只导出深色" : "导出双模式"}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {exportTabs.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setExportTab(id)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold ${
                    exportTab === id
                      ? "border-violet-200 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-slate-200">{exportTabs.find(([id]) => id === exportTab)?.[1]}</p>
            <button
              type="button"
              onClick={() => copyCode(exportTab, exportCode[exportTab])}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-50"
            >
              <Icon icon={copied === exportTab ? "check-circle" : "copy"} size={16} color="currentColor" />
              {copied === exportTab ? "已复制" : "复制代码"}
            </button>
          </div>
          <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-6 text-slate-100">
            <code>{exportCode[exportTab]}</code>
          </pre>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>草稿保存在浏览器 localStorage：designMaintenanceStyles，并兼容保留 styleCaptureDrafts。</span>
          {savedCount ? <span className="font-semibold text-emerald-700">本次已保存 {savedCount} 个草稿。</span> : null}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ title, helper }: { title: string; helper: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

function StatusMessage({ status, message }: { status: string; message: string }) {
  if (!message) return null;

  const tone =
    status === "error"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : status === "ready"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-blue-200 bg-blue-50 text-blue-800";

  return <p className={`mt-3 rounded-xl border px-3 py-2 text-sm font-medium ${tone}`}>{message}</p>;
}

function PalettePanel({ palette }: { palette: Palette }) {
  const items: Array<[keyof Palette, string]> = [
    ["vibrant", "Vibrant"],
    ["muted", "Muted"],
    ["darkVibrant", "Dark"],
    ["darkMuted", "Dark Muted"],
    ["lightVibrant", "Light"],
    ["lightMuted", "Light Muted"],
    ["averageColor", "Average"],
  ];

  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-slate-950">提取色板</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map(([key, label]) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="h-10 rounded-lg border border-white/80" style={{ background: palette[key] }} />
            <p className="mt-2 text-xs font-semibold text-slate-600">{label}</p>
            <p className="font-mono text-xs text-slate-400">{palette[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="mt-2 flex items-center gap-2">
        <input
          type="color"
          value={toColorInputValue(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-10 rounded-lg border border-slate-200 bg-white p-1"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 font-mono text-xs text-slate-700 outline-none focus:border-violet-300"
        />
      </span>
    </label>
  );
}

function ColorGroup({
  title,
  helper,
  fields,
  colors,
  onChange,
}: {
  title: string;
  helper: string;
  fields: Array<[keyof EditableModeColors, string]>;
  colors: EditableModeColors;
  onChange: (key: keyof EditableModeColors, value: string) => void;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-950">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <ColorField
            key={key}
            label={label}
            value={colors[key]}
            onChange={(value) => onChange(key, value)}
          />
        ))}
      </div>
    </div>
  );
}

function QualityPanel({ checks }: { checks: ReturnType<typeof getThemeQualityChecks> }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">双模式质量检查</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">分别检查浅色和深色的可读性与层级。</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {(["light", "dark"] as ThemeMode[]).map((mode) => (
          <div key={mode} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-800">{mode === "light" ? "浅色模式" : "深色模式"}</p>
            <div className="mt-3 grid gap-2">
              {checks[mode].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">{item.label}</span>
                  <span
                    className={`rounded-full px-2 py-1 font-semibold ${
                      item.pass ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.pass ? "通过" : "需要优化"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              value === id
                ? "border-violet-200 bg-violet-50 text-violet-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemePreview({
  tab,
  tokens,
  name,
  options,
}: {
  tab: PreviewTab;
  tokens: ActiveThemeTokens;
  name: string;
  options: ThemeOptions;
}) {
  const css = tokenStyle(tokens, options);
  const heroCard = getHeroCardStyle(tokens, options.mode);
  const heroTextColor = String(heroCard.color || tokens.colors.textPrimary);
  const tokenChecks = getPreviewTokenChecks(tokens, options.mode);

  return (
    <>
      <div
        className="mt-4 overflow-hidden rounded-[24px] border border-[var(--capture-border)] bg-[var(--capture-bg)] p-4 shadow-[var(--capture-shadow)]"
        style={css}
      >
        {tab === "app-home" ? <AppHomePreview heroCard={heroCard} name={name} /> : null}
        {tab === "profile" ? <ProfilePreview /> : null}
        {tab === "card-list" ? <CardListPreview /> : null}
        {tab === "dashboard" ? <DashboardPreview /> : null}
      </div>
      <TokenDebugPanel checks={tokenChecks} heroTextColor={heroTextColor} tokens={tokens} mode={options.mode} />
    </>
  );
}

function AppHomePreview({
  heroCard,
  name,
}: {
  heroCard: React.CSSProperties;
  name: string;
}) {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--capture-muted)]">9:41</p>
          <h3 className="mt-6 text-xl font-semibold text-[var(--capture-text)]">上午好，李经理</h3>
          <p className="mt-1 text-sm text-[var(--capture-muted)]">今天有 12 项待办需要处理</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--capture-primary)] text-lg font-semibold text-[var(--capture-inverse)]">
          李
        </div>
      </div>
      <div className="mt-5 rounded-[var(--capture-radius-xl)] border border-[var(--capture-border)] p-5 shadow-[var(--capture-floating)]" style={heroCard}>
        <p className="text-sm font-semibold opacity-90">{name}</p>
        <p className="mt-3 text-3xl font-bold">¥128,430</p>
        <p className="mt-2 text-sm opacity-90">本月业绩提升 18%，重点关注续约客户</p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {["审批", "客户", "报表", "任务"].map((item, index) => (
          <div key={item} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-3 text-center shadow-[var(--capture-card-shadow)]">
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--capture-primary-soft)] text-[var(--capture-primary)]">
              <Icon icon={["approval", "customer", "bar-chart", "task"][index] as never} size={17} color="currentColor" />
            </span>
            <p className="mt-2 text-xs font-semibold text-[var(--capture-text)]">{item}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {["华东区客户续约待确认", "Q2 运营报表已生成", "新增 3 条商机线索"].map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-3 shadow-[var(--capture-card-shadow)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--capture-surface-muted)] text-[var(--capture-primary)]">
              <Icon icon={["refresh", "report", "lead"][index] as never} size={17} color="currentColor" />
            </span>
            <p className="min-w-0 flex-1 text-sm font-semibold text-[var(--capture-text)]">{item}</p>
            <StatusPill>待处理</StatusPill>
          </div>
        ))}
      </div>
      <MobileTabbar />
    </PhoneFrame>
  );
}

function ProfilePreview() {
  return (
    <PhoneFrame>
      <div className="rounded-[var(--capture-radius-xl)] border border-[var(--capture-border)] bg-[var(--capture-gradient-card)] p-5 shadow-[var(--capture-card-shadow)]">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-[var(--capture-primary)] text-center text-xl font-bold leading-[56px] text-[var(--capture-inverse)]">李</div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--capture-text)]">李经理</h3>
            <p className="text-sm text-[var(--capture-muted)]">企业客户部 · 高级会员</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["24 完成", "6 待办", "86% 达成"].map((item) => (
            <div key={item} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface-elevated)] p-3 text-center text-sm font-semibold text-[var(--capture-text)]">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {["我的审批", "我的客户", "数据报表", "系统设置"].map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-4 shadow-[var(--capture-card-shadow)]">
            <Icon icon={["approval", "customer", "bar-chart", "settings"][index] as never} size={18} color="var(--capture-text-accent)" />
            <span className="flex-1 text-sm font-semibold text-[var(--capture-text)]">{item}</span>
            <span className="text-[var(--capture-muted)]">›</span>
          </div>
        ))}
      </div>
      <MobileTabbar />
    </PhoneFrame>
  );
}

function CardListPreview() {
  return (
    <PhoneFrame>
      <h3 className="text-xl font-semibold text-[var(--capture-text)]">客户跟进</h3>
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[var(--capture-surface-muted)] px-3 py-3 text-sm text-[var(--capture-muted)]">
        <Icon icon="search" size={16} color="currentColor" />
        搜索客户 / 项目
      </div>
      <div className="mt-3 flex gap-2 overflow-hidden">
        {["全部", "待跟进", "高优先级"].map((item, index) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              index === 0
                ? "bg-[var(--capture-primary)] text-[var(--capture-inverse)]"
                : "bg-[var(--capture-primary-soft)] text-[var(--capture-text-accent)]"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {[
          ["星河科技", "续约沟通", "高优先级"],
          ["云启软件", "方案确认", "进行中"],
          ["蓝海集团", "合同审批", "待处理"],
        ].map(([name, step, tag]) => (
          <div key={name} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-4 shadow-[var(--capture-card-shadow)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-[var(--capture-text)]">{name}</p>
                <p className="mt-1 text-sm text-[var(--capture-muted)]">{step} · 李经理</p>
              </div>
              <StatusPill>{tag}</StatusPill>
            </div>
            <button className="mt-3 rounded-xl bg-[var(--capture-primary)] px-3 py-2 text-sm font-semibold text-[var(--capture-inverse)]">
              添加跟进
            </button>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function DashboardPreview() {
  return (
    <div className="min-h-[520px] rounded-[var(--capture-radius-xl)] bg-[var(--capture-surface)] p-4 shadow-[var(--capture-card-shadow)]">
      <div className="flex items-center justify-between border-b border-[var(--capture-divider)] pb-4">
        <div>
          <p className="text-xs font-semibold text-[var(--capture-text-accent)]">AIMIRA Ops</p>
          <h3 className="mt-1 text-xl font-semibold text-[var(--capture-text)]">客户运营看板</h3>
        </div>
        <button className="rounded-xl bg-[var(--capture-primary)] px-4 py-2 text-sm font-semibold text-[var(--capture-inverse)]">
          新建任务
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["活跃客户", "2,846", "+12%"],
          ["待跟进", "128", "今日"],
          ["续约率", "86%", "+6%"],
        ].map(([label, value, change]) => (
          <div key={label} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface-elevated)] p-4">
            <p className="text-sm font-semibold text-[var(--capture-muted)]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[var(--capture-text)]">{value}</p>
            <p className="mt-3 w-fit rounded-full bg-[var(--capture-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--capture-text-accent)]">{change}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface-elevated)] p-4">
          <p className="font-semibold text-[var(--capture-text)]">经营趋势</p>
          <div className="mt-4 flex h-44 items-end gap-3 rounded-2xl bg-[var(--capture-surface-muted)] p-4">
            {[40, 58, 46, 70, 62, 84, 76].map((height) => (
              <span key={height} className="flex-1 rounded-t-xl bg-[var(--capture-gradient-button)]" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface-elevated)] p-4">
          <p className="font-semibold text-[var(--capture-text)]">任务提醒</p>
          <div className="mt-4 grid gap-2">
            {["华东区续约报价需确认", "3 条商机线索待分配", "Q2 报表已生成待复核"].map((item) => (
              <p key={item} className="rounded-xl bg-[var(--capture-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--capture-text)]">{item}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--capture-border)]">
        <div className="grid grid-cols-5 bg-[var(--capture-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--capture-muted)]">
          <span>客户名称</span><span>阶段</span><span>负责人</span><span>最近跟进</span><span>状态</span>
        </div>
        {[
          ["星河科技", "续约沟通", "李经理", "今天", "高优先级"],
          ["云启软件", "方案确认", "周主管", "昨天", "进行中"],
          ["蓝海集团", "合同审批", "王敏", "周二", "待处理"],
        ].map((row) => (
          <div key={row[0]} className="grid grid-cols-5 border-t border-[var(--capture-divider)] px-4 py-3 text-sm font-semibold text-[var(--capture-text)]">
            {row.slice(0, 4).map((cell) => <span key={cell}>{cell}</span>)}
            <span className="w-fit rounded-full bg-[var(--capture-primary-soft)] px-2 py-1 text-xs text-[var(--capture-text-accent)]">{row[4]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[390px] rounded-[34px] border border-[var(--capture-border)] bg-[var(--capture-bg)] p-4 shadow-[var(--capture-floating)]">
      <div className="min-h-[620px] rounded-[26px] bg-[var(--capture-bg)] p-4">
        {children}
      </div>
    </div>
  );
}

function MobileTabbar() {
  return (
    <div className="mt-5 grid grid-cols-4 rounded-3xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-2 shadow-[var(--capture-card-shadow)]">
      {["首页", "工作台", "消息", "我的"].map((item, index) => (
        <div key={item} className={`rounded-2xl py-2 text-center text-xs font-semibold ${index === 0 ? "bg-[var(--capture-primary-soft)] text-[var(--capture-primary)]" : "text-[var(--capture-muted)]"}`}>
          {item}
        </div>
      ))}
    </div>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[var(--capture-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--capture-primary)]">
      {children}
    </span>
  );
}

function TokenDebugPanel({
  checks,
  heroTextColor,
  mode,
  tokens,
}: {
  checks: ReturnType<typeof getPreviewTokenChecks>;
  heroTextColor: string;
  mode: ThemeMode;
  tokens: ActiveThemeTokens;
}) {
  const tokenRows = [
    ["mode", mode],
    ["primary", tokens.colors.primary],
    ["primarySoft", tokens.colors.primarySoft],
    ["background", tokens.colors.background],
    ["surface", tokens.colors.surface],
    ["surfaceMuted", tokens.colors.surfaceMuted],
    ["textPrimary", tokens.colors.textPrimary],
    ["textSecondary", tokens.colors.textSecondary],
    ["border", tokens.colors.border],
    ["heroGradient", tokens.gradients.hero],
    ["heroTextColor", heroTextColor],
  ];

  return (
    <details className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-slate-800">
        Token 使用检查
      </summary>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-2">
          {tokenRows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[120px_1fr] gap-3 text-xs">
              <span className="font-semibold text-slate-500">{label}</span>
              <span className="break-all font-mono text-slate-700">{value}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          {checks.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-xs">
              <span className="font-semibold text-slate-600">{item.label}</span>
              <span className={`rounded-full px-2 py-1 font-semibold ${item.pass ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {item.pass ? "通过" : "需优化"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

async function extractPalette(imageUrl: string): Promise<Palette> {
  const [{ Vibrant }, averageColor] = await Promise.all([
    import("node-vibrant/browser"),
    getAverageColor(imageUrl),
  ]);
  const palette = await Vibrant.from(imageUrl).getPalette();
  const vibrant = palette.Vibrant?.hex || averageColor;
  const muted = palette.Muted?.hex || mix(vibrant, "#64748B", 0.45);
  const darkVibrant = palette.DarkVibrant?.hex || darken(vibrant, 0.42);
  const darkMuted = palette.DarkMuted?.hex || darken(muted, 0.36);
  const lightVibrant = palette.LightVibrant?.hex || lighten(vibrant, 0.48);
  const lightMuted = palette.LightMuted?.hex || lighten(muted, 0.54);

  return {
    vibrant,
    muted,
    darkVibrant,
    darkMuted,
    lightVibrant,
    lightMuted,
    averageColor,
  };
}

function buildThemeTokens(colorModes: Record<ThemeMode, EditableModeColors>, options: ThemeOptions): ThemeTokens {
  const radius = getRadius(options.radius);
  const shared: SharedTokens = {
    radius,
    typography: {
      fontFamily: "Inter, PingFang SC, Microsoft YaHei, sans-serif",
      headingWeight: 700,
      bodyWeight: 500,
    },
    effects: {
      blur: options.style === "glass" ? "18px" : "0px",
      glassOpacity: options.style === "glass" ? 0.72 : 1,
      glowIntensity: options.style === "glow" || options.style === "glass" ? 0.28 : 0.12,
    },
    density: options.density,
  };

  return {
    light: buildModeTokens(colorModes.light, "light", options),
    dark: buildModeTokens(colorModes.dark, "dark", options),
    shared,
  };
}

function buildModeTokens(colors: EditableModeColors, mode: ThemeMode, options: ThemeOptions): ModeTokens {
  const primary = ensureModePrimary(colors.primary, mode);
  const secondary = normalizeHex(colors.secondary);
  const accent = normalizeHex(colors.accent);
  const background = normalizeHex(colors.background);
  const surface = normalizeHex(colors.surface);
  const surfaceMuted = normalizeHex(colors.surfaceMuted);
  const textPrimary = ensureText(colors.textPrimary, surface);
  const textSecondary = ensureText(colors.textSecondary, surfaceMuted);
  const textMuted = mode === "dark" ? "#94A3B8" : "#64748B";
  const textAccent = ensureText(colors.textAccent || primary, mode === "dark" ? background : mix(primary, surface, 0.84));
  const textInverse = ensureText(colors.textInverse, primary);
  const border = normalizeHex(colors.border);
  const primaryHover = mode === "dark" ? lighten(primary, 0.12) : darken(primary, 0.12);
  const primaryActive = mode === "dark" ? lighten(primary, 0.2) : darken(primary, 0.2);
  const primarySoft = mode === "dark" ? withAlpha(primary, 0.18) : mix(primary, surface, 0.86);
  const primarySofter = mode === "dark" ? withAlpha(primary, 0.1) : mix(primary, surface, 0.93);
  const secondarySoft = mode === "dark" ? withAlpha(secondary, 0.16) : mix(secondary, surface, 0.88);
  const accentSoft = mode === "dark" ? withAlpha(accent, 0.16) : mix(accent, surface, 0.86);
  const surfaceElevated = mode === "dark" ? lighten(surface, 0.08) : mix(primary, "#FFFFFF", 0.96);
  const backgroundGradient =
    mode === "dark"
      ? `linear-gradient(135deg, ${background}, ${mix(primary, background, 0.82)})`
      : `linear-gradient(135deg, ${background}, ${mix(primary, "#FFFFFF", 0.92)})`;
  const shadow = getShadow(options.shadow, primary, mode);

  return {
    colors: {
      primary,
      primaryHover,
      primaryActive,
      primarySoft,
      primarySofter,
      secondary,
      secondarySoft,
      accent,
      accentSoft,
      background,
      backgroundGradient,
      surface,
      surfaceElevated,
      surfaceMuted,
      textPrimary,
      textSecondary,
      textMuted,
      textAccent,
      textInverse,
      border,
      divider: mode === "dark" ? withAlpha("#94A3B8", 0.18) : withAlpha(border, 0.86),
      success: mode === "dark" ? "#4ADE80" : "#18A058",
      warning: mode === "dark" ? "#FBBF24" : "#F59E0B",
      danger: mode === "dark" ? "#FB7185" : "#E11D48",
      info: mode === "dark" ? "#60A5FA" : "#2563EB",
    },
    gradients: {
      hero: backgroundGradient,
      card:
        options.style === "glass"
          ? `linear-gradient(135deg, ${withAlpha(surfaceElevated, mode === "dark" ? 0.82 : 0.78)}, ${withAlpha(mix(primary, surface, 0.88), 0.72)})`
          : `linear-gradient(135deg, ${surface}, ${mode === "dark" ? mix(primary, surface, 0.9) : mix(accent, surface, 0.92)})`,
      button: `linear-gradient(135deg, ${primary}, ${accent})`,
      border: `linear-gradient(135deg, ${withAlpha(primary, mode === "dark" ? 0.32 : 0.24)}, ${withAlpha(accent, mode === "dark" ? 0.18 : 0.14)})`,
      glow: `radial-gradient(circle, ${withAlpha(primary, mode === "dark" ? 0.28 : 0.16)}, transparent 62%)`,
    },
    shadow,
  };
}

function getActiveTokens(tokens: ThemeTokens, mode: ThemeMode): ActiveThemeTokens {
  return {
    ...tokens[mode],
    ...tokens.shared,
  };
}

function getReadableTextColorForGradient(gradient: string, tokens: ActiveThemeTokens) {
  const representativeColor = getGradientRepresentativeColor(gradient);
  const textPrimaryContrast = contrastRatio(tokens.colors.textPrimary, representativeColor);
  const textInverseContrast = contrastRatio(tokens.colors.textInverse, representativeColor);

  if (textPrimaryContrast >= textInverseContrast && textPrimaryContrast >= 4.5) {
    return tokens.colors.textPrimary;
  }

  if (textInverseContrast >= 4.5) {
    return tokens.colors.textInverse;
  }

  return getLuminance(representativeColor) > 0.5 ? "#0F172A" : "#FFFFFF";
}

function getHeroCardStyle(tokens: ActiveThemeTokens, mode: ThemeMode): React.CSSProperties {
  const heroTextColor = getReadableTextColorForGradient(tokens.gradients.hero, tokens);
  const representativeColor = getGradientRepresentativeColor(tokens.gradients.hero);
  const needsOverlay = contrastRatio(heroTextColor, representativeColor) < 4.5;
  const overlay = getLuminance(representativeColor) > 0.5
    ? "linear-gradient(0deg, rgba(255,255,255,0.18), rgba(255,255,255,0.18))"
    : "linear-gradient(0deg, rgba(2,6,23,0.22), rgba(2,6,23,0.22))";

  return {
    background: needsOverlay ? `${overlay}, ${tokens.gradients.hero}` : tokens.gradients.hero,
    color: heroTextColor,
    borderColor: mode === "dark" ? withAlpha(tokens.colors.primary, 0.24) : tokens.colors.border,
  };
}

function getGradientRepresentativeColor(gradient: string) {
  const matches = gradient.match(/#[0-9a-fA-F]{6}/g);
  if (!matches?.length) return "#F8FAFC";

  const mixed = matches.reduce((current, color, index) => {
    if (index === 0) return normalizeHex(color);
    return mix(current, color, 0.5);
  }, normalizeHex(matches[0]));

  return mixed;
}

function getPreviewTokenChecks(tokens: ActiveThemeTokens, mode: ThemeMode) {
  const heroTextColor = getReadableTextColorForGradient(tokens.gradients.hero, tokens);
  const heroBg = getGradientRepresentativeColor(tokens.gradients.hero);
  const layerGap = Math.abs(getLuminance(tokens.colors.background) - getLuminance(tokens.colors.surface));
  const navActiveContrast = contrastRatio(tokens.colors.primary, tokens.colors.primarySoft);

  return [
    {
      label: "Banner 文字对比",
      pass: contrastRatio(heroTextColor, heroBg) >= 4.5,
    },
    {
      label: "普通卡片层级",
      pass: layerGap >= (mode === "dark" ? 0.018 : 0.025),
    },
    {
      label: "主按钮可见性",
      pass: contrastRatio(tokens.colors.textInverse, tokens.colors.primary) >= 3,
    },
    {
      label: "底部导航可读性",
      pass: navActiveContrast >= 3,
    },
  ];
}

function paletteToEditableColorModes(palette: Palette): Record<ThemeMode, EditableModeColors> {
  const primary = ensureSaturatedPrimary(palette.vibrant);
  const secondary = normalizeHex(palette.muted);
  const accent = ensureSaturatedPrimary(palette.lightVibrant || palette.vibrant);

  return {
    light: optimizeModeColors(
      {
        primary,
        secondary,
        accent,
        background: mix(palette.lightMuted, "#FFFFFF", 0.78),
        surface: "#FFFFFF",
        surfaceMuted: mix(primary, "#FFFFFF", 0.94),
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        textAccent: ensureText(darken(primary, 0.18), mix(primary, "#FFFFFF", 0.86)),
        textInverse: "#FFFFFF",
        border: mix(secondary, "#E6EAF2", 0.82),
      },
      "light",
    ),
    dark: optimizeModeColors(
      {
        primary: deriveModeColor(primary, "dark", "primary"),
        secondary: deriveModeColor(secondary, "dark", "secondary"),
        accent: deriveModeColor(accent, "dark", "accent"),
        background: mix(darken(primary, 0.74), "#0B1020", 0.78),
        surface: mix(darken(primary, 0.62), "#111827", 0.78),
        surfaceMuted: mix(darken(primary, 0.54), "#172033", 0.72),
        textPrimary: "#F8FAFC",
        textSecondary: "#CBD5E1",
        textAccent: deriveModeColor(primary, "dark", "textAccent"),
        textInverse: "#FFFFFF",
        border: mix(darken(primary, 0.52), "#334155", 0.76),
      },
      "dark",
    ),
  };
}

function tokenStyle(tokens: ActiveThemeTokens, options: ThemeOptions) {
  return {
    "--capture-primary": tokens.colors.primary,
    "--capture-primary-soft": tokens.colors.primarySoft,
    "--capture-secondary": tokens.colors.secondary,
    "--capture-secondary-soft": tokens.colors.secondarySoft,
    "--capture-accent": tokens.colors.accent,
    "--capture-accent-soft": tokens.colors.accentSoft,
    "--capture-bg": tokens.colors.background,
    "--capture-surface": tokens.colors.surface,
    "--capture-surface-elevated": tokens.colors.surfaceElevated,
    "--capture-surface-muted": tokens.colors.surfaceMuted,
    "--capture-text": tokens.colors.textPrimary,
    "--capture-muted": tokens.colors.textSecondary,
    "--capture-text-accent": tokens.colors.textAccent,
    "--capture-inverse": tokens.colors.textInverse,
    "--capture-border": tokens.colors.border,
    "--capture-divider": tokens.colors.divider,
    "--capture-gradient-button": tokens.gradients.button,
    "--capture-gradient-card": tokens.gradients.card,
    "--capture-radius-xl": tokens.radius.xl,
    "--capture-card-shadow": tokens.shadow.card,
    "--capture-floating": tokens.shadow.floating,
    "--capture-shadow": tokens.shadow.card,
    "--capture-glow": tokens.shadow.glow,
    "--capture-density-space": options.density === "compact" ? "0.75rem" : "1rem",
  } as React.CSSProperties;
}

function toCssVariables(tokens: ThemeTokens, scope: ExportScope) {
  const lightBlock = cssVariableBlock(":root", tokens.light, tokens.shared);
  const darkBlock = cssVariableBlock(scope === "dark" ? ":root" : "[data-theme=\"dark\"]", tokens.dark, tokens.shared);

  if (scope === "light") return lightBlock;
  if (scope === "dark") return darkBlock;
  return `${lightBlock}

${darkBlock}`;
}

function cssVariableBlock(selector: string, modeTokens: ModeTokens, shared: SharedTokens) {
  return `${selector} {
  --color-primary: ${modeTokens.colors.primary};
  --color-primary-hover: ${modeTokens.colors.primaryHover};
  --color-primary-active: ${modeTokens.colors.primaryActive};
  --color-primary-soft: ${modeTokens.colors.primarySoft};
  --color-primary-softer: ${modeTokens.colors.primarySofter};
  --color-secondary: ${modeTokens.colors.secondary};
  --color-accent: ${modeTokens.colors.accent};
  --color-bg-page: ${modeTokens.colors.background};
  --color-bg-gradient: ${modeTokens.colors.backgroundGradient};
  --color-bg-card: ${modeTokens.colors.surface};
  --color-bg-elevated: ${modeTokens.colors.surfaceElevated};
  --color-bg-muted: ${modeTokens.colors.surfaceMuted};
  --color-text-primary: ${modeTokens.colors.textPrimary};
  --color-text-secondary: ${modeTokens.colors.textSecondary};
  --color-text-muted: ${modeTokens.colors.textMuted};
  --color-text-accent: ${modeTokens.colors.textAccent};
  --color-text-inverse: ${modeTokens.colors.textInverse};
  --color-border: ${modeTokens.colors.border};
  --gradient-hero: ${modeTokens.gradients.hero};
  --gradient-button: ${modeTokens.gradients.button};
  --radius-card: ${shared.radius.xl};
  --radius-control: ${shared.radius.md};
  --shadow-card: ${modeTokens.shadow.card};
  --shadow-floating: ${modeTokens.shadow.floating};
}`;
}

function toTailwindConfig(tokens: ThemeTokens, scope: ExportScope) {
  const modes =
    scope === "both"
      ? `light: ${JSON.stringify(tokens.light.colors, null, 6)},
      dark: ${JSON.stringify(tokens.dark.colors, null, 6)}`
      : `${scope}: ${JSON.stringify(tokens[scope].colors, null, 6)}`;

  return `darkMode: ["class", "[data-theme='dark']"],
theme: {
  extend: {
    colors: {
      mode: {
      ${modes}
      }
    },
    borderRadius: {
      sm: "${tokens.shared.radius.sm}",
      md: "${tokens.shared.radius.md}",
      lg: "${tokens.shared.radius.lg}",
      xl: "${tokens.shared.radius.xl}"
    }
  }
}`;
}

function toJsonTokens(tokens: ThemeTokens, scope: ExportScope) {
  if (scope === "light") return JSON.stringify({ light: tokens.light, shared: tokens.shared }, null, 2);
  if (scope === "dark") return JSON.stringify({ dark: tokens.dark, shared: tokens.shared }, null, 2);
  return JSON.stringify(tokens, null, 2);
}

function getRadius(mode: RadiusMode) {
  if (mode === "restrained") return { sm: "6px", md: "10px", lg: "14px", xl: "18px" };
  if (mode === "rounded") return { sm: "12px", md: "18px", lg: "24px", xl: "32px" };
  return { sm: "8px", md: "14px", lg: "20px", xl: "24px" };
}

function deriveModeColor(color: string, mode: ThemeMode, key: string) {
  const normalized = normalizeHex(color);
  if (mode === "dark") {
    if (key === "textAccent") return lighten(normalized, 0.18);
    return getLuminance(normalized) < 0.28 ? lighten(normalized, 0.18) : normalized;
  }
  if (key === "textAccent") return getLuminance(normalized) > 0.42 ? darken(normalized, 0.2) : normalized;
  return getLuminance(normalized) > 0.72 ? darken(normalized, 0.28) : normalized;
}

function generateOppositeMode(colors: EditableModeColors, targetMode: ThemeMode): EditableModeColors {
  if (targetMode === "dark") {
    const primary = deriveModeColor(colors.primary, "dark", "primary");
    const secondary = deriveModeColor(colors.secondary, "dark", "secondary");
    const accent = deriveModeColor(colors.accent, "dark", "accent");
    return optimizeModeColors(
      {
        primary,
        secondary,
        accent,
        background: mix(darken(primary, 0.72), "#0B1020", 0.78),
        surface: mix(darken(primary, 0.62), "#111827", 0.8),
        surfaceMuted: mix(darken(primary, 0.54), "#172033", 0.74),
        textPrimary: "#F8FAFC",
        textSecondary: "#CBD5E1",
        textAccent: deriveModeColor(colors.textAccent || primary, "dark", "textAccent"),
        textInverse: "#FFFFFF",
        border: mix(darken(primary, 0.5), "#334155", 0.76),
      },
      "dark",
    );
  }

  const primary = deriveModeColor(colors.primary, "light", "primary");
  const secondary = deriveModeColor(colors.secondary, "light", "secondary");
  const accent = deriveModeColor(colors.accent, "light", "accent");
  return optimizeModeColors(
    {
      primary,
      secondary,
      accent,
      background: "#F8FAFC",
      surface: "#FFFFFF",
      surfaceMuted: mix(primary, "#FFFFFF", 0.94),
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      textAccent: deriveModeColor(colors.textAccent || primary, "light", "textAccent"),
      textInverse: "#FFFFFF",
      border: mix(secondary, "#E6EAF2", 0.82),
    },
    "light",
  );
}

function optimizeModeColors(colors: EditableModeColors, mode: ThemeMode): EditableModeColors {
  const primary = ensureSaturatedPrimary(colors.primary);
  const surface = mode === "dark"
    ? ensureDarkLayer(colors.surface, "#111827", 0.18)
    : ensureLightLayer(colors.surface, "#FFFFFF", 0.86);
  const background = mode === "dark"
    ? ensureDarkLayer(colors.background, "#0B1020", 0.1)
    : ensureLightLayer(colors.background, "#F8FAFC", 0.82);
  const surfaceMuted = mode === "dark"
    ? ensureDarkLayer(colors.surfaceMuted, "#172033", 0.18)
    : ensureLightLayer(colors.surfaceMuted, mix(primary, "#FFFFFF", 0.94), 0.76);

  return {
    ...colors,
    primary,
    background,
    surface,
    surfaceMuted,
    textPrimary: ensureText(mode === "dark" ? "#F8FAFC" : colors.textPrimary, surface),
    textSecondary: ensureText(mode === "dark" ? "#CBD5E1" : colors.textSecondary, surfaceMuted),
    textAccent: ensureText(colors.textAccent || primary, mode === "dark" ? background : mix(primary, surface, 0.86)),
    textInverse: ensureText(colors.textInverse || "#FFFFFF", primary),
    border: mode === "dark" ? mix(colors.border, "#334155", 0.78) : mix(colors.border, "#E6EAF2", 0.72),
  };
}

function ensureSaturatedPrimary(color: string) {
  const normalized = normalizeHex(color);
  if (getLuminance(normalized) > 0.78) return darken(normalized, 0.3);
  if (getLuminance(normalized) < 0.12) return lighten(normalized, 0.2);
  return normalized;
}

function ensureModePrimary(color: string, mode: ThemeMode) {
  let normalized = ensureSaturatedPrimary(color);
  if (mode === "light") {
    const soft = mix(normalized, "#FFFFFF", 0.86);
    let guard = 0;
    while (contrastRatio(normalized, soft) < 3 && guard < 4) {
      normalized = darken(normalized, 0.12);
      guard += 1;
    }
  } else {
    const bg = "#0F172A";
    let guard = 0;
    while (contrastRatio(normalized, bg) < 3 && guard < 4) {
      normalized = lighten(normalized, 0.12);
      guard += 1;
    }
  }
  return normalized;
}

function ensureLightLayer(color: string, fallback: string, minLuminance: number) {
  const normalized = normalizeHex(color);
  return getLuminance(normalized) < minLuminance ? mix(normalized, fallback, 0.78) : normalized;
}

function ensureDarkLayer(color: string, fallback: string, maxLuminance: number) {
  const normalized = normalizeHex(color);
  return getLuminance(normalized) > maxLuminance ? mix(normalized, fallback, 0.78) : normalized;
}

function getThemeQualityChecks(tokens: ThemeTokens) {
  return {
    light: getModeQualityChecks(tokens.light),
    dark: getModeQualityChecks(tokens.dark),
  };
}

function getModeQualityChecks(tokens: ModeTokens) {
  const colors = tokens.colors;
  const backgroundLayerGap = Math.abs(getLuminance(colors.background) - getLuminance(colors.surface));
  return [
    {
      label: "主色可读性",
      pass: contrastRatio(colors.textAccent, colors.primarySoft) >= 3,
    },
    {
      label: "按钮对比度",
      pass: contrastRatio(colors.textInverse, colors.primary) >= 3,
    },
    {
      label: "卡片文字对比度",
      pass: contrastRatio(colors.textPrimary, colors.surface) >= 4.5,
    },
    {
      label: "背景层级",
      pass: backgroundLayerGap >= 0.025,
    },
  ];
}

function getShadow(mode: ShadowMode, primary: string, themeMode: ThemeMode) {
  if (mode === "none") return { card: "none", floating: "none", glow: "none" };
  const neutral = themeMode === "dark" ? "rgba(0, 0, 0, 0.28)" : "rgba(15, 23, 42, 0.08)";
  if (mode === "medium") {
    return {
      card: `0 16px 42px ${themeMode === "dark" ? "rgba(0, 0, 0, 0.38)" : "rgba(15, 23, 42, 0.12)"}`,
      floating: `0 24px 64px ${themeMode === "dark" ? "rgba(0, 0, 0, 0.46)" : "rgba(15, 23, 42, 0.16)"}`,
      glow: `0 18px 48px ${withAlpha(primary, themeMode === "dark" ? 0.34 : 0.26)}`,
    };
  }
  return {
    card: `0 12px 32px ${neutral}`,
    floating: `0 18px 48px ${themeMode === "dark" ? "rgba(0, 0, 0, 0.34)" : "rgba(15, 23, 42, 0.10)"}`,
    glow: `0 14px 36px ${withAlpha(primary, themeMode === "dark" ? 0.28 : 0.18)}`,
  };
}

async function getAverageColor(imageUrl: string): Promise<string> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("image load failed"));
  });
  const canvas = document.createElement("canvas");
  const size = 48;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return fallbackPalette.averageColor;
  context.drawImage(image, 0, 0, size, size);
  const { data } = context.getImageData(0, 0, size, size);
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 40) continue;
    r += data[index];
    g += data[index + 1];
    b += data[index + 2];
    count += 1;
  }
  return rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count));
}

function suggestName(primary: string, palette: Palette) {
  const hue = rgbToHsl(hexToRgb(primary)).h;
  const luminance = getLuminance(primary);
  const isGradient = colorDistance(palette.vibrant, palette.lightVibrant) > 105;
  if (luminance < 0.16 && hue > 32 && hue < 72) return "黑金高级风";
  if (isGradient && hue > 230 && hue < 310) return "极光渐变风";
  if (hue >= 180 && hue < 260) return "蓝紫智能风";
  if (hue >= 140 && hue < 180) return "青绿健康风";
  if (hue >= 20 && hue < 70) return "橙金增长风";
  if (hue >= 200 && hue < 240) return "冰川专业风";
  return "图片捕捉风";
}

function inferColorPreference(primary: string) {
  const hue = rgbToHsl(hexToRgb(primary)).h;
  const luminance = getLuminance(primary);

  if (luminance < 0.14) return "黑金系";
  if (hue >= 200 && hue < 260) return "蓝色系";
  if (hue >= 260 && hue < 320) return "紫色系";
  if (hue >= 95 && hue < 165) return "绿色系";
  if (hue >= 165 && hue < 200) return "青色系";
  if (hue >= 20 && hue < 70) return "橙色系";
  if (hue >= 320 || hue < 20) return "红粉系";
  return "渐变多彩";
}

function ensureText(color: string, background: string) {
  const normalized = normalizeHex(color);
  if (contrastRatio(normalized, background) >= 4.5) return normalized;
  return getLuminance(background) > 0.5 ? "#0F172A" : "#F8FAFC";
}

function normalizeHex(value: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toUpperCase();
  }
  return fallbackPalette.vibrant;
}

function toColorInputValue(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallbackPalette.vibrant;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex).replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function mix(a: string, b: string, weight = 0.5) {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  return rgbToHex(
    Math.round(first.r * (1 - weight) + second.r * weight),
    Math.round(first.g * (1 - weight) + second.g * weight),
    Math.round(first.b * (1 - weight) + second.b * weight),
  );
}

function lighten(hex: string, amount: number) {
  return mix(hex, "#FFFFFF", amount);
}

function darken(hex: string, amount: number) {
  return mix(hex, "#000000", amount);
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const values = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function contrastRatio(a: string, b: string) {
  const first = getLuminance(a);
  const second = getLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    switch (max) {
      case r1:
        h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) * 60;
        break;
      case g1:
        h = ((b1 - r1) / d + 2) * 60;
        break;
      default:
        h = ((r1 - g1) / d + 4) * 60;
    }
  }
  return { h, l };
}

function colorDistance(a: string, b: string) {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  return Math.sqrt(
    (first.r - second.r) ** 2 + (first.g - second.g) ** 2 + (first.b - second.b) ** 2,
  );
}
