"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { ThemeHandoffPanel } from "@/components/theme-handoff-panel";
import type { StylePack } from "@/lib/catalog";
import { normalizeStyle } from "@/lib/style-theme";

type StyleStatus = "draft" | "reviewing" | "published" | "deprecated";
type MainTab = "basic" | "tokens" | "preview" | "acceptance" | "export";
type TokenMode = "light" | "dark";

type ModeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  border: string;
};

type MaintenanceTokens = {
  light: ModeColors;
  dark: ModeColors;
  shared: {
    radius: "克制" | "柔和" | "大圆角";
    effect: "普通" | "渐变" | "玻璃" | "线性" | "微光";
    shadow: "无" | "轻" | "中";
    density: "舒适" | "紧凑";
    mode: "浅色" | "深色" | "双模式";
  };
};

type AcceptanceKey =
  | "hasName"
  | "hasScenario"
  | "hasLightMode"
  | "hasDarkMode"
  | "appReadable"
  | "profileReadable"
  | "listReadable"
  | "dashboardReadable"
  | "buttonReadable"
  | "tagReadable"
  | "cardLayered"
  | "hasChangelog";

type MaintenanceStyle = {
  id: string;
  name: string;
  slogan: string;
  description: string;
  suitableFor: string[];
  notSuitableFor: string[];
  mood: string[];
  colorPreference: string;
  tags: string[];
  owner: string;
  version: string;
  status: StyleStatus;
  source: "catalog" | "web-maintenance" | "style-capture";
  createdAt: string;
  updatedAt: string;
  tokens: MaintenanceTokens;
  preview: {
    coverVariant: string;
    scenarios: string[];
    showAppHome: boolean;
    showProfile: boolean;
    showCardList: boolean;
    showDashboard: boolean;
  };
  acceptance: Record<AcceptanceKey, boolean>;
  changelog: Array<{
    title: string;
    type: string;
    description: string;
    scope: string;
    owner: string;
    updatedAt: string;
    version: string;
  }>;
};

const STORAGE_KEY = "designMaintenanceStyles";

const workflowSteps: Array<{
  id: MainTab;
  step: string;
  label: string;
  helper: string;
}> = [
  { id: "basic", step: "01", label: "填写信息", helper: "名称、定位、适合项目" },
  { id: "tokens", step: "02", label: "调整颜色", helper: "主色、背景、文字和圆角" },
  { id: "preview", step: "03", label: "查看预览", helper: "确认 App 和 Web 效果" },
  { id: "acceptance", step: "04", label: "发布检查", helper: "勾选验收项并写更新记录" },
  { id: "export", step: "05", label: "交付开发", helper: "复制代码或导出 JSON" },
];

const statusOptions: Array<{ value: StyleStatus | "all"; label: string }> = [
  { value: "all", label: "全部" },
  { value: "draft", label: "草稿" },
  { value: "reviewing", label: "待审核" },
  { value: "published", label: "已发布" },
  { value: "deprecated", label: "已废弃" },
];

const acceptanceItems: Array<{ key: AcceptanceKey; label: string; helper: string }> = [
  { key: "hasName", label: "已填写风格名称", helper: "让别人一眼知道这套风格叫什么。" },
  { key: "hasScenario", label: "已填写适用场景", helper: "说明适合什么项目、不适合什么项目。" },
  { key: "hasLightMode", label: "有浅色模式", helper: "浅色页面、卡片和文字清晰。" },
  { key: "hasDarkMode", label: "有深色模式", helper: "深色页面不是简单反色，也能看清。" },
  { key: "appReadable", label: "App 首页可读", helper: "移动端首页文字和按钮都清楚。" },
  { key: "profileReadable", label: "个人中心可读", helper: "头像、菜单和状态清楚。" },
  { key: "listReadable", label: "卡片列表可读", helper: "列表项、标签和操作按钮清楚。" },
  { key: "dashboardReadable", label: "网页仪表盘可读", helper: "数据卡、图表和表格有层级。" },
  { key: "buttonReadable", label: "主按钮清晰", helper: "按钮背景和文字对比足够。" },
  { key: "tagReadable", label: "状态标签清晰", helper: "待处理、进行中等标签不刺眼也不发虚。" },
  { key: "cardLayered", label: "卡片有层级", helper: "背景、卡片、弱背景能区分。" },
  { key: "hasChangelog", label: "已填写更新记录", helper: "写明这次改了什么，方便回溯。" },
];

const moodOptions = ["商务稳重", "科技 AI", "活力年轻", "高级轻奢", "医疗健康", "本地生活", "国潮文化", "暗色酷炫", "梦幻渐变"];
const colorOptions = ["蓝色系", "紫色系", "绿色系", "青色系", "橙色系", "红粉系", "黑金系", "黑白灰", "渐变多彩"];
const coverVariants = ["saas-clean", "enterprise-table", "mobile-workbench", "ai-copilot", "dark-dashboard", "glass-premium", "medical-health", "finance-trust", "ecommerce-growth", "local-service"];

export function DesignMaintenanceWorkbench({ initialStyles }: { initialStyles: StylePack[] }) {
  const [styles, setStyles] = useState<MaintenanceStyle[]>(() =>
    initialStyles.map((style) => stylePackToMaintenance(style)),
  );
  const [selectedId, setSelectedId] = useState(initialStyles[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<MainTab>("basic");
  const [statusFilter, setStatusFilter] = useState<StyleStatus | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [tokenMode, setTokenMode] = useState<TokenMode>("light");
  const [copied, setCopied] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const localStyles = readLocalStyles();
    if (!localStyles.length) return;

    window.setTimeout(() => {
      setStyles((current) => mergeStyles(current, localStyles));

      const queryId = new URLSearchParams(window.location.search).get("styleId");
      if (queryId && localStyles.some((style) => style.id === queryId)) {
        setSelectedId(queryId);
        setNotice("已从风格捕捉器带回一个新草稿，可以继续微调后提交审核。");
      }
    }, 0);
  }, []);

  const selectedStyle = styles.find((style) => style.id === selectedId) ?? styles[0];
  const filteredStyles = styles.filter((style) => statusFilter === "all" || style.status === statusFilter);
  const completeness = selectedStyle ? getCompleteness(selectedStyle) : 0;
  const missingItems = selectedStyle ? getMissingItems(selectedStyle) : [];
  const exportPayload = selectedStyle ? buildExportPayload(selectedStyle) : null;

  function updateSelected(patch: Partial<MaintenanceStyle>) {
    if (!selectedStyle) return;
    const next = {
      ...selectedStyle,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    setStyles((current) => current.map((style) => (style.id === selectedStyle.id ? next : style)));
  }

  function updateTokens(mode: TokenMode, key: keyof ModeColors, value: string) {
    if (!selectedStyle) return;
    updateSelected({
      tokens: {
        ...selectedStyle.tokens,
        [mode]: {
          ...selectedStyle.tokens[mode],
          [key]: normalizeHex(value),
        },
      },
    });
  }

  function updateSharedToken<K extends keyof MaintenanceTokens["shared"]>(key: K, value: MaintenanceTokens["shared"][K]) {
    if (!selectedStyle) return;
    updateSelected({
      tokens: {
        ...selectedStyle.tokens,
        shared: {
          ...selectedStyle.tokens.shared,
          [key]: value,
        },
      },
    });
  }

  function updatePreview<K extends keyof MaintenanceStyle["preview"]>(key: K, value: MaintenanceStyle["preview"][K]) {
    if (!selectedStyle) return;
    updateSelected({
      preview: {
        ...selectedStyle.preview,
        [key]: value,
      },
    });
  }

  function updateAcceptance(key: AcceptanceKey, checked: boolean) {
    if (!selectedStyle) return;
    updateSelected({
      acceptance: {
        ...selectedStyle.acceptance,
        [key]: checked,
      },
    });
  }

  function addBlankStyle() {
    const now = new Date().toISOString();
    const draft = createBlankStyle(now);
    setStyles((current) => [draft, ...current]);
    setSelectedId(draft.id);
    setActiveTab("basic");
    setShowCreate(false);
    setNotice("已创建空白风格草稿。先填基础信息，再调 Token 和预览。");
  }

  function copyCurrentStyle() {
    if (!selectedStyle) return;
    const now = new Date().toISOString();
    const copiedStyle: MaintenanceStyle = {
      ...selectedStyle,
      id: `style-copy-${Date.now()}`,
      name: `${selectedStyle.name} 副本`,
      status: "draft",
      source: "web-maintenance",
      createdAt: now,
      updatedAt: now,
      version: "0.1.0",
      changelog: [
        {
          title: "复制已有风格",
          type: "新增风格",
          description: `基于「${selectedStyle.name}」复制后调整。`,
          scope: "风格基础信息和 Token",
          owner: selectedStyle.owner,
          updatedAt: now,
          version: "0.1.0",
        },
      ],
    };
    setStyles((current) => [copiedStyle, ...current]);
    setSelectedId(copiedStyle.id);
    setActiveTab("basic");
    setShowCreate(false);
    setNotice("已复制为新草稿，可以在此基础上微调。");
  }

  function saveCurrent(status?: StyleStatus) {
    if (!selectedStyle) return;
    const next: MaintenanceStyle = {
      ...selectedStyle,
      status: status ?? selectedStyle.status,
      source: selectedStyle.source === "catalog" ? "web-maintenance" : selectedStyle.source,
      updatedAt: new Date().toISOString(),
    };
    setStyles((current) => current.map((style) => (style.id === next.id ? next : style)));
    persistStyle(next);
    setNotice(
      status === "published"
        ? "已发布到本地风格库。刷新后仍会保留，并会出现在风格广场。"
        : status === "reviewing"
          ? "已提交为待审核状态。"
          : "已保存草稿，刷新后仍会保留。",
    );
  }

  async function copyText(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  if (!selectedStyle) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-950">暂时没有可维护的风格</p>
      </section>
    );
  }

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-24 xl:self-start">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-violet-700">风格列表</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">网页内维护</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((value) => !value)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            <Icon icon="pen-tool" size={16} color="currentColor" />
            新增
          </button>
        </div>

        {showCreate ? (
          <div className="mt-4 grid gap-2 rounded-2xl border border-violet-100 bg-violet-50 p-3">
            <button type="button" onClick={addBlankStyle} className="create-option">
              <span className="font-semibold text-slate-950">从空白创建</span>
              <span className="text-xs text-slate-500">手动填写名称、气质和颜色。</span>
            </button>
            <Link href="/style-capture?from=design-maintenance" className="create-option">
              <span className="font-semibold text-slate-950">从风格捕捉创建</span>
              <span className="text-xs text-slate-500">上传截图，把颜色变成可用主题。</span>
            </Link>
            <button type="button" onClick={copyCurrentStyle} className="create-option">
              <span className="font-semibold text-slate-950">复制已有风格</span>
              <span className="text-xs text-slate-500">基于当前风格复制一份再调整。</span>
            </button>
          </div>
        ) : null}

        <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1">
          {statusOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatusFilter(item.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === item.value
                  ? "border-violet-200 bg-violet-50 text-violet-800"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 max-h-[720px] min-w-0 space-y-2 overflow-auto pr-1">
          {filteredStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedId(style.id)}
              className={`w-full min-w-0 rounded-2xl border p-3 text-left transition ${
                style.id === selectedStyle.id
                  ? "border-violet-200 bg-violet-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-violet-100 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{style.name}</p>
                  <p className="mt-1 truncate font-mono text-[11px] text-slate-400">{style.id}</p>
                </div>
                <StatusBadge status={style.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <SmallPill>{style.mood[0] ?? "待选择"}</SmallPill>
                <SmallPill>{style.colorPreference || "待选择"}</SmallPill>
              </div>
              <p className="mt-2 text-xs text-slate-400">更新：{formatDate(style.updatedAt)}</p>
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0 space-y-5">
        <main className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-violet-700">设计维护台</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{selectedStyle.name}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                在网页里维护风格，不需要打开 Figma。按 5 步完成信息、颜色、预览、检查和交付。
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
              <button type="button" onClick={() => saveCurrent("draft")} className="secondary-action">
                保存草稿
              </button>
              <button type="button" onClick={() => saveCurrent("reviewing")} className="secondary-action">
                提交审核
              </button>
            </div>
          </div>

          {notice ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {notice}
            </div>
          ) : null}

          <WorkflowStepper activeTab={activeTab} onChange={setActiveTab} />
          <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            当前步骤：
            <span className="font-semibold text-slate-950">
              {workflowSteps.find((step) => step.id === activeTab)?.label}
            </span>
            。按 1 到 5 走完，就能发布到风格广场并交付给开发。
          </p>

          <div className="mt-5">
            {activeTab === "basic" ? (
              <BasicTab style={selectedStyle} onChange={updateSelected} />
            ) : null}
            {activeTab === "tokens" ? (
              <TokenTab
                style={selectedStyle}
                mode={tokenMode}
                onModeChange={setTokenMode}
                onColorChange={updateTokens}
                onSharedChange={updateSharedToken}
                onOptimize={() => updateSelected({ tokens: optimizeTokens(selectedStyle.tokens) })}
              />
            ) : null}
            {activeTab === "preview" ? (
              <PreviewTabPanel style={selectedStyle} onChange={updatePreview} />
            ) : null}
            {activeTab === "acceptance" ? (
              <AcceptanceAndChangelogTab
                style={selectedStyle}
                completeness={completeness}
                onAcceptanceChange={updateAcceptance}
                onStyleChange={updateSelected}
              />
            ) : null}
            {activeTab === "export" && exportPayload ? (
              <ExportTabPanel
                style={selectedStyle}
                copied={copied}
                onDelivered={() => {
                  updateSelected({
                    tags: Array.from(new Set([...selectedStyle.tags, "已交付开发"])),
                    changelog: [
                      {
                        title: "标记已交付开发",
                        type: "发布更新",
                        description: "已将主题代码交付给开发使用。",
                        scope: "CSS Variables、Tailwind Config、Tokens JSON",
                        owner: selectedStyle.owner,
                        updatedAt: new Date().toISOString(),
                        version: selectedStyle.version,
                      },
                      ...selectedStyle.changelog,
                    ],
                  });
                  setNotice("已标记为交付给开发。");
                }}
                onCopy={copyText}
              />
            ) : null}
          </div>
        </main>

        <section className="grid gap-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-violet-700">实时预览</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">App 与 Web 效果</h2>
              </div>
              <StatusBadge status={selectedStyle.status} />
            </div>
            <div className="mt-4 grid min-w-0 gap-4 2xl:grid-cols-2">
              <MiniAppPreview style={selectedStyle} />
              <MiniDashboardPreview style={selectedStyle} />
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-950">发布检查</h2>
              <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-800">
                {completeness}%
              </span>
            </div>
            <Progress value={completeness} />
            <div className="mt-4 grid gap-2">
              {getQualityChecks(selectedStyle).map((item) => (
                <CheckRow key={item.label} label={item.label} pass={item.pass} />
              ))}
            </div>
            {missingItems.length ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-3">
                <p className="text-sm font-semibold text-amber-900">发布前还缺：</p>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-800">
                  {missingItems.slice(0, 5).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
                已满足发布条件。
              </div>
            )}
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => saveCurrent("published")}
                disabled={completeness < 100}
                className="rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                发布到风格广场
              </button>
              <button type="button" onClick={() => saveCurrent("draft")} className="secondary-action">
                保存草稿
              </button>
              <button
                type="button"
                onClick={() => copyText("json", exportPayload ? exportPayload.json : "")}
                className="secondary-action"
              >
                {copied === "json" ? "已复制 JSON" : "导出 JSON"}
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              发布只是本地模拟。后续接数据库后，这里会变成真实审核流程。
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}

function BasicTab({
  style,
  onChange,
}: {
  style: MaintenanceStyle;
  onChange: (patch: Partial<MaintenanceStyle>) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="风格名称" value={style.name} onChange={(value) => onChange({ name: value })} />
        <TextField label="一句话定位" value={style.slogan} onChange={(value) => onChange({ slogan: value })} />
        <SelectField label="风格气质" value={style.mood[0] ?? ""} options={moodOptions} onChange={(value) => onChange({ mood: [value] })} />
        <SelectField label="颜色偏好" value={style.colorPreference} options={colorOptions} onChange={(value) => onChange({ colorPreference: value })} />
        <TextField label="维护人" value={style.owner} onChange={(value) => onChange({ owner: value })} />
        <TextField label="版本号" value={style.version} onChange={(value) => onChange({ version: value })} />
      </div>
      <AreaField label="风格描述" value={style.description} onChange={(value) => onChange({ description: value })} />
      <AreaField label="适合什么项目" helper="用逗号分隔，例如：企业后台，移动办公，AI 工具。" value={style.suitableFor.join("，")} onChange={(value) => onChange({ suitableFor: splitList(value) })} />
      <AreaField label="不适合什么项目" helper="说明边界，避免别人误用。" value={style.notSuitableFor.join("，")} onChange={(value) => onChange({ notSuitableFor: splitList(value) })} />
      <AreaField label="关键词标签" value={style.tags.join("，")} onChange={(value) => onChange({ tags: splitList(value) })} />
      <SelectField
        label="状态"
        value={style.status}
        options={["draft", "reviewing", "published", "deprecated"]}
        optionLabel={(value) => statusText(value as StyleStatus)}
        onChange={(value) => onChange({ status: value as StyleStatus })}
      />
    </div>
  );
}

function WorkflowStepper({
  activeTab,
  onChange,
}: {
  activeTab: MainTab;
  onChange: (tab: MainTab) => void;
}) {
  const activeIndex = workflowSteps.findIndex((step) => step.id === activeTab);

  return (
    <div className="mt-5 min-w-0 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50 p-3">
      <div className="-mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1 xl:grid xl:grid-cols-5 xl:overflow-visible xl:pb-0">
        {workflowSteps.map((item, index) => {
          const active = item.id === activeTab;
          const done = index < activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`group min-w-[150px] rounded-2xl border p-3 text-left transition xl:min-w-0 ${
                active
                  ? "border-violet-200 bg-white shadow-sm"
                  : done
                    ? "border-emerald-100 bg-white"
                    : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                  active
                    ? "bg-violet-700 text-white"
                    : done
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-white text-slate-400"
                }`}
              >
                {done ? "✓" : item.step}
              </span>
              <span className="mt-3 block whitespace-nowrap text-sm font-semibold text-slate-950">{item.label}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">{item.helper}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TokenTab({
  style,
  mode,
  onModeChange,
  onColorChange,
  onSharedChange,
  onOptimize,
}: {
  style: MaintenanceStyle;
  mode: TokenMode;
  onModeChange: (mode: TokenMode) => void;
  onColorChange: (mode: TokenMode, key: keyof ModeColors, value: string) => void;
  onSharedChange: <K extends keyof MaintenanceTokens["shared"]>(key: K, value: MaintenanceTokens["shared"][K]) => void;
  onOptimize: () => void;
}) {
  const colors = style.tokens[mode];

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-violet-900">正在编辑：{mode === "light" ? "浅色模式" : "深色模式"}</p>
          <p className="mt-1 text-sm leading-6 text-violet-700">Token 会影响按钮、卡片、标签和页面背景。</p>
        </div>
        <div className="flex gap-2">
          {(["light", "dark"] as TokenMode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                mode === item ? "border-violet-200 bg-white text-violet-800" : "border-violet-100 bg-violet-50 text-violet-600"
              }`}
            >
              {item === "light" ? "浅色" : "深色"}
            </button>
          ))}
        </div>
      </div>

      <TokenGroup
        title="品牌色"
        items={[
          ["primary", "主色"],
          ["secondary", "辅助色"],
          ["accent", "强调色"],
        ]}
        colors={colors}
        mode={mode}
        onChange={onColorChange}
      />
      <TokenGroup
        title="界面底色"
        items={[
          ["background", "页面背景"],
          ["surface", "卡片背景"],
          ["surfaceMuted", "弱背景"],
          ["border", "边框色"],
        ]}
        colors={colors}
        mode={mode}
        onChange={onColorChange}
      />
      <TokenGroup
        title="文字色"
        items={[
          ["textPrimary", "主文字"],
          ["textSecondary", "次文字"],
          ["textInverse", "反白文字"],
        ]}
        colors={colors}
        mode={mode}
        onChange={onColorChange}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField label="模式" value={style.tokens.shared.mode} options={["浅色", "深色", "双模式"]} onChange={(value) => onSharedChange("mode", value as MaintenanceTokens["shared"]["mode"])} />
        <SelectField label="风格效果" value={style.tokens.shared.effect} options={["普通", "渐变", "玻璃", "线性", "微光"]} onChange={(value) => onSharedChange("effect", value as MaintenanceTokens["shared"]["effect"])} />
        <SelectField label="圆角" value={style.tokens.shared.radius} options={["克制", "柔和", "大圆角"]} onChange={(value) => onSharedChange("radius", value as MaintenanceTokens["shared"]["radius"])} />
        <SelectField label="阴影" value={style.tokens.shared.shadow} options={["无", "轻", "中"]} onChange={(value) => onSharedChange("shadow", value as MaintenanceTokens["shared"]["shadow"])} />
        <SelectField label="信息密度" value={style.tokens.shared.density} options={["舒适", "紧凑"]} onChange={(value) => onSharedChange("density", value as MaintenanceTokens["shared"]["density"])} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onOptimize} className="secondary-action">
          一键优化主题
        </button>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(style.tokens, null, 2))}
          className="secondary-action"
        >
          复制当前 Token
        </button>
      </div>
    </div>
  );
}

function PreviewTabPanel({
  style,
  onChange,
}: {
  style: MaintenanceStyle;
  onChange: <K extends keyof MaintenanceStyle["preview"]>(key: K, value: MaintenanceStyle["preview"][K]) => void;
}) {
  return (
    <div className="grid gap-5">
      <SelectField
        label="封面类型"
        value={style.preview.coverVariant}
        options={coverVariants}
        onChange={(value) => onChange("coverVariant", value)}
      />
      <AreaField
        label="默认预览场景"
        value={style.preview.scenarios.join("，")}
        onChange={(value) => onChange("scenarios", splitList(value))}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["showAppHome", "展示 App 首页"],
          ["showProfile", "展示个人中心"],
          ["showCardList", "展示卡片列表"],
          ["showDashboard", "展示网页仪表盘"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(style.preview[key as keyof MaintenanceStyle["preview"]])}
              onChange={(event) =>
                onChange(key as keyof MaintenanceStyle["preview"], event.target.checked as never)
              }
              className="h-4 w-4 rounded border-slate-300 text-violet-700"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}

function AcceptanceAndChangelogTab({
  style,
  completeness,
  onAcceptanceChange,
  onStyleChange,
}: {
  style: MaintenanceStyle;
  completeness: number;
  onAcceptanceChange: (key: AcceptanceKey, checked: boolean) => void;
  onStyleChange: (patch: Partial<MaintenanceStyle>) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-950">交付完整度</h3>
            <p className="mt-1 text-sm text-slate-500">达到 100% 后才能发布到风格广场。</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-violet-800">{completeness}%</span>
        </div>
        <Progress value={completeness} />
      </div>
      <div className="grid gap-3">
        {acceptanceItems.map((item) => (
          <label key={item.key} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <input
              type="checkbox"
              checked={style.acceptance[item.key]}
              onChange={(event) => onAcceptanceChange(item.key, event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-700"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-950">{item.label}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-500">{item.helper}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-950">本次更新记录</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            发布前简单写清楚这次改了什么，后续别人就知道为什么要用这个版本。
          </p>
        </div>
        <ChangelogTab style={style} onChange={onStyleChange} />
      </div>
    </div>
  );
}

function ChangelogTab({
  style,
  onChange,
}: {
  style: MaintenanceStyle;
  onChange: (patch: Partial<MaintenanceStyle>) => void;
}) {
  const latest = style.changelog[0] ?? createDefaultChange(style);

  function updateChange(patch: Partial<(typeof style.changelog)[number]>) {
    onChange({
      changelog: [{ ...latest, ...patch, updatedAt: new Date().toISOString() }, ...style.changelog.slice(1)],
      acceptance: { ...style.acceptance, hasChangelog: true },
    });
  }

  return (
    <div className="grid gap-4">
      <TextField label="本次更新标题" value={latest.title} onChange={(value) => updateChange({ title: value })} />
      <SelectField label="更新类型" value={latest.type} options={["新增风格", "颜色调整", "Token 调整", "预览调整", "文案调整", "发布更新"]} onChange={(value) => updateChange({ type: value })} />
      <AreaField label="更新说明" value={latest.description} onChange={(value) => updateChange({ description: value })} />
      <TextField label="影响范围" value={latest.scope} onChange={(value) => updateChange({ scope: value })} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="更新人" value={latest.owner} onChange={(value) => updateChange({ owner: value })} />
        <TextField label="新版本号" value={latest.version} onChange={(value) => updateChange({ version: value })} />
      </div>
    </div>
  );
}

function ExportTabPanel({
  style,
  copied,
  onDelivered,
  onCopy,
}: {
  style: MaintenanceStyle;
  copied: string;
  onDelivered: () => void;
  onCopy: (label: string, value: string) => void;
}) {
  return (
    <div className="grid gap-4">
      <ThemeHandoffPanel
        style={style}
        title="交付给开发"
        description="复制当前风格的主题代码给开发同学。第一版推荐先使用 CSS Variables，后续再升级为主题包。"
        draftNotice={style.status !== "published"}
      />
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <button type="button" onClick={onDelivered} className="secondary-action">
          标记已交付
        </button>
        <button
          type="button"
          onClick={() => onCopy("prompt", buildExportPayload(style).prompt)}
          className="secondary-action"
        >
          {copied === "prompt" ? "已复制 Prompt" : "复制 AI Prompt"}
        </button>
      </div>
    </div>
  );
}

function TokenGroup({
  title,
  items,
  colors,
  mode,
  onChange,
}: {
  title: string;
  items: Array<[keyof ModeColors, string]>;
  colors: ModeColors;
  mode: TokenMode;
  onChange: (mode: TokenMode, key: keyof ModeColors, value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {items.map(([key, label]) => (
          <label key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <span className="text-sm font-semibold text-slate-600">{label}</span>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                value={colors[key]}
                onChange={(event) => onChange(mode, key, event.target.value)}
                className="h-10 w-12 rounded-xl border border-slate-200 bg-white p-1"
              />
              <input
                value={colors[key]}
                onChange={(event) => onChange(mode, key, event.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function MiniAppPreview({ style }: { style: MaintenanceStyle }) {
  const t = style.tokens.light;
  return (
    <div className="min-w-0 overflow-hidden rounded-[28px] border p-3" style={{ background: t.background, borderColor: t.border }}>
      <div className="min-w-0 rounded-[24px] border p-3 shadow-sm" style={{ background: t.surface, borderColor: t.border }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: t.textSecondary }}>上午好，李经理</p>
            <p className="mt-1 text-base font-semibold" style={{ color: t.textPrimary }}>今日待办 12</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-semibold" style={{ background: t.primary, color: t.textInverse }}>李</span>
        </div>
        <div className="mt-3 rounded-2xl p-3 text-white" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}>
          <p className="text-xs font-semibold">本月业绩</p>
          <p className="mt-1 text-xl font-bold">¥128,430</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {["审批 4", "客户 8", "报表", "任务"].map((item) => (
            <div key={item} className="rounded-xl border p-2 text-xs font-semibold" style={{ borderColor: t.border, color: t.textPrimary }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniDashboardPreview({ style }: { style: MaintenanceStyle }) {
  const t = style.tokens.light;
  return (
    <div className="min-w-0 overflow-hidden rounded-[22px] border p-3" style={{ background: t.background, borderColor: t.border }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>客户运营看板</p>
        <span className="rounded-lg px-2 py-1 text-xs font-semibold" style={{ background: t.primary, color: t.textInverse }}>新建</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["客户 2,846", "待跟进 128", "续约率 86%"].map((item) => (
          <div key={item} className="rounded-xl border p-2 text-xs font-semibold" style={{ background: t.surface, borderColor: t.border, color: t.textPrimary }}>
            {item}
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-20 items-end gap-2 rounded-xl border p-3" style={{ background: t.surface, borderColor: t.border }}>
        {[36, 58, 42, 72, 64, 88].map((height, index) => (
          <span key={index} className="flex-1 rounded-t-lg" style={{ height: `${height}%`, background: t.primary }} />
        ))}
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}

function AreaField({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {helper ? <span className="ml-2 text-xs text-slate-400">{helper}</span> : null}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-950 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  optionLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  optionLabel?: (value: string) => string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {optionLabel ? optionLabel(item) : item}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusBadge({ status }: { status: StyleStatus }) {
  const tone =
    status === "published"
      ? "bg-emerald-50 text-emerald-700"
      : status === "reviewing"
        ? "bg-blue-50 text-blue-700"
        : status === "deprecated"
          ? "bg-slate-100 text-slate-500"
          : "bg-amber-50 text-amber-700";
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{statusText(status)}</span>;
}

function SmallPill({ children }: { children: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">{children}</span>;
}

function CheckRow({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className={pass ? "text-emerald-700" : "text-amber-700"}>{pass ? "通过" : "需完善"}</span>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="mt-3 h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-violet-700 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

function stylePackToMaintenance(style: StylePack): MaintenanceStyle {
  const normalized = normalizeStyle(style);
  const now = style.updated_at ?? new Date().toISOString();
  const palette = normalized.palette;
  return {
    id: style.id,
    name: style.name,
    slogan: normalized.slogan,
    description: normalized.description,
    suitableFor: normalized.suitableFor,
    notSuitableFor: normalized.notSuitableFor,
    mood: normalized.mood,
    colorPreference: normalized.colorPreference,
    tags: style.tags ?? [],
    owner: style.owner ?? "Design Platform Core",
    version: style.version ?? "1.0.0",
    status: "published",
    source: "catalog",
    createdAt: style.created_at ?? now,
    updatedAt: now,
    tokens: {
      light: {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        background: palette.background,
        surface: palette.surface,
        surfaceMuted: "#F1F5F9",
        textPrimary: palette.textPrimary,
        textSecondary: palette.textSecondary,
        textInverse: "#FFFFFF",
        border: palette.border,
      },
      dark: {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        background: "#0F172A",
        surface: "#111827",
        surfaceMuted: "#1E293B",
        textPrimary: "#F8FAFC",
        textSecondary: "#CBD5E1",
        textInverse: "#0F172A",
        border: "#334155",
      },
      shared: {
        radius: normalized.tokens.radius.card.includes("24") || normalized.tokens.radius.card.includes("28") ? "大圆角" : "柔和",
        effect: normalized.tokens.effects.gradient.includes("gradient") ? "渐变" : "普通",
        shadow: "轻",
        density: "舒适",
        mode: "双模式",
      },
    },
    preview: {
      coverVariant: style.coverVariant ?? "saas-clean",
      scenarios: [normalized.previewScenario],
      showAppHome: true,
      showProfile: true,
      showCardList: true,
      showDashboard: true,
    },
    acceptance: Object.fromEntries(acceptanceItems.map((item) => [item.key, true])) as Record<AcceptanceKey, boolean>,
    changelog: [
      {
        title: "已导入现有风格",
        type: "新增风格",
        description: "来自当前风格库数据，可在网页内继续维护。",
        scope: "风格信息、Token 和预览设置",
        owner: style.owner ?? "Design Platform Core",
        updatedAt: now,
        version: style.version ?? "1.0.0",
      },
    ],
  };
}

function createBlankStyle(now: string): MaintenanceStyle {
  return {
    id: `style-web-draft-${Date.now()}`,
    name: "新风格草稿",
    slogan: "一句话说明这个风格的气质",
    description: "请说明这个风格适合什么企业项目。",
    suitableFor: ["企业后台", "移动 App"],
    notSuitableFor: ["强营销活动页"],
    mood: ["商务稳重"],
    colorPreference: "蓝色系",
    tags: ["草稿", "待完善"],
    owner: "设计团队",
    version: "0.1.0",
    status: "draft",
    source: "web-maintenance",
    createdAt: now,
    updatedAt: now,
    tokens: defaultTokens(),
    preview: {
      coverVariant: "saas-clean",
      scenarios: ["客户运营看板", "移动工作台"],
      showAppHome: true,
      showProfile: true,
      showCardList: true,
      showDashboard: true,
    },
    acceptance: Object.fromEntries(acceptanceItems.map((item) => [item.key, false])) as Record<AcceptanceKey, boolean>,
    changelog: [createDefaultChange({ name: "新风格草稿", owner: "设计团队", version: "0.1.0" } as MaintenanceStyle)],
  };
}

function defaultTokens(): MaintenanceTokens {
  return {
    light: {
      primary: "#2563EB",
      secondary: "#60A5FA",
      accent: "#7C3AED",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      surfaceMuted: "#F1F5F9",
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      textInverse: "#FFFFFF",
      border: "#E2E8F0",
    },
    dark: {
      primary: "#60A5FA",
      secondary: "#A78BFA",
      accent: "#22D3EE",
      background: "#0F172A",
      surface: "#111827",
      surfaceMuted: "#1E293B",
      textPrimary: "#F8FAFC",
      textSecondary: "#CBD5E1",
      textInverse: "#0F172A",
      border: "#334155",
    },
    shared: {
      radius: "柔和",
      effect: "渐变",
      shadow: "轻",
      density: "舒适",
      mode: "双模式",
    },
  };
}

function createDefaultChange(style: MaintenanceStyle) {
  return {
    title: "新增风格草稿",
    type: "新增风格",
    description: "创建风格草稿，等待补充 Token、预览和验收信息。",
    scope: "风格基础信息和视觉 Token",
    owner: style.owner,
    updatedAt: new Date().toISOString(),
    version: style.version,
  };
}

function readLocalStyles() {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown[];
    return raw.map(normalizeStoredStyle).filter(Boolean) as MaintenanceStyle[];
  } catch {
    return [];
  }
}

function normalizeStoredStyle(value: unknown): MaintenanceStyle | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<MaintenanceStyle> & {
    createdAt?: string;
    themeTokens?: unknown;
    tokens?: unknown;
  };
  if (!item.id || !item.name) return null;
  const now = new Date().toISOString();
  return {
    ...createBlankStyle(now),
    ...item,
    source: item.source === "style-capture" ? "style-capture" : "web-maintenance",
    status: isStatus(item.status) ? item.status : "draft",
    tokens: normalizeTokens(item.tokens ?? item.themeTokens),
    preview: {
      coverVariant: item.preview?.coverVariant ?? "saas-clean",
      scenarios: item.preview?.scenarios ?? ["移动工作台", "网页仪表盘"],
      showAppHome: item.preview?.showAppHome ?? true,
      showProfile: item.preview?.showProfile ?? true,
      showCardList: item.preview?.showCardList ?? true,
      showDashboard: item.preview?.showDashboard ?? true,
    },
    acceptance: {
      ...Object.fromEntries(acceptanceItems.map((entry) => [entry.key, false])),
      ...(item.acceptance ?? {}),
    } as Record<AcceptanceKey, boolean>,
    changelog: item.changelog?.length ? item.changelog : [createDefaultChange({ ...createBlankStyle(now), name: item.name, owner: item.owner ?? "设计团队", version: item.version ?? "0.1.0" })],
  };
}

function normalizeTokens(value: unknown): MaintenanceTokens {
  const fallback = defaultTokens();
  if (!value || typeof value !== "object") return fallback;
  const raw = value as { light?: { colors?: Partial<ModeColors> } | Partial<ModeColors>; dark?: { colors?: Partial<ModeColors> } | Partial<ModeColors>; shared?: Partial<MaintenanceTokens["shared"]> };
  return {
    light: {
      ...fallback.light,
      ...(("colors" in (raw.light ?? {}) ? (raw.light as { colors?: Partial<ModeColors> }).colors : raw.light) ?? {}),
    },
    dark: {
      ...fallback.dark,
      ...(("colors" in (raw.dark ?? {}) ? (raw.dark as { colors?: Partial<ModeColors> }).colors : raw.dark) ?? {}),
    },
    shared: {
      ...fallback.shared,
      ...(raw.shared ?? {}),
    },
  };
}

function persistStyle(style: MaintenanceStyle) {
  const stored = readLocalStyles().filter((item) => item.id !== style.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([style, ...stored], null, 2));
}

function mergeStyles(base: MaintenanceStyle[], local: MaintenanceStyle[]) {
  const map = new Map(base.map((style) => [style.id, style]));
  local.forEach((style) => map.set(style.id, style));
  return Array.from(map.values());
}

function getCompleteness(style: MaintenanceStyle) {
  const total = acceptanceItems.length;
  const checked = acceptanceItems.filter((item) => style.acceptance[item.key]).length;
  return Math.round((checked / total) * 100);
}

function getMissingItems(style: MaintenanceStyle) {
  return acceptanceItems.filter((item) => !style.acceptance[item.key]).map((item) => item.label);
}

function getQualityChecks(style: MaintenanceStyle) {
  return [
    { label: "按钮对比度", pass: contrastRatio(style.tokens.light.primary, style.tokens.light.textInverse) >= 3 },
    { label: "文字对比度", pass: contrastRatio(style.tokens.light.background, style.tokens.light.textPrimary) >= 4.5 },
    { label: "背景层级", pass: style.tokens.light.background.toLowerCase() !== style.tokens.light.surface.toLowerCase() },
    { label: "深色模式", pass: contrastRatio(style.tokens.dark.background, style.tokens.dark.textPrimary) >= 4.5 },
    { label: "状态色", pass: Boolean(style.tokens.light.accent && style.tokens.dark.accent) },
  ];
}

function buildExportPayload(style: MaintenanceStyle) {
  const css = [
    ":root {",
    ...Object.entries(style.tokens.light).map(([key, value]) => `  --style-${kebab(key)}: ${value};`),
    "}",
    "",
    '[data-theme="dark"] {',
    ...Object.entries(style.tokens.dark).map(([key, value]) => `  --style-${kebab(key)}: ${value};`),
    "}",
  ].join("\n");
  const tailwind = `theme: {\n  extend: {\n    colors: {\n      primary: "${style.tokens.light.primary}",\n      background: "${style.tokens.light.background}",\n      surface: "${style.tokens.light.surface}",\n      border: "${style.tokens.light.border}"\n    }\n  }\n}`;
  const json = JSON.stringify(style, null, 2);
  const prompt = [
    `请基于「${style.name}」生成企业级 UI。`,
    `风格定位：${style.slogan}`,
    `适合项目：${style.suitableFor.join("、")}`,
    `视觉关键词：${style.tags.join("、")}`,
    `主色：${style.tokens.light.primary}`,
    "要求同时考虑后台 Web 与移动端 App 的可读性、按钮对比度和卡片层级。",
  ].join("\n");
  return { css, tailwind, json, prompt };
}

function optimizeTokens(tokens: MaintenanceTokens): MaintenanceTokens {
  return {
    ...tokens,
    light: {
      ...tokens.light,
      background: tokens.light.background || "#F8FAFC",
      surface: tokens.light.surface || "#FFFFFF",
      surfaceMuted: tokens.light.surfaceMuted || "#F1F5F9",
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      textInverse: getReadableText(tokens.light.primary),
      border: tokens.light.border || "#E2E8F0",
    },
    dark: {
      ...tokens.dark,
      background: "#0F172A",
      surface: "#111827",
      surfaceMuted: "#1E293B",
      textPrimary: "#F8FAFC",
      textSecondary: "#CBD5E1",
      textInverse: "#0F172A",
      border: "#334155",
    },
  };
}

function splitList(value: string) {
  return value
    .split(/[，,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeHex(value: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value.toUpperCase();
  return value;
}

function statusText(status: StyleStatus) {
  return {
    draft: "草稿",
    reviewing: "待审核",
    published: "已发布",
    deprecated: "已废弃",
  }[status];
}

function isStatus(value: unknown): value is StyleStatus {
  return value === "draft" || value === "reviewing" || value === "published" || value === "deprecated";
}

function formatDate(value: string) {
  return value.slice(0, 10);
}

function kebab(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const values = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function contrastRatio(a: string, b: string) {
  const first = luminance(a);
  const second = luminance(b);
  const light = Math.max(first, second);
  const dark = Math.min(first, second);
  return (light + 0.05) / (dark + 0.05);
}

function getReadableText(background: string) {
  return contrastRatio(background, "#FFFFFF") >= contrastRatio(background, "#0F172A") ? "#FFFFFF" : "#0F172A";
}
