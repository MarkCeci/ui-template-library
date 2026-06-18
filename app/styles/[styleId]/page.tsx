import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyAction } from "@/components/copy-action";
import { ColorSwatches } from "@/components/style-preview-panels";
import { StyleDetailModePreview } from "@/components/style-detail-mode-preview";
import { ThemeHandoffPanel } from "@/components/theme-handoff-panel";
import { getStyleById, styles, type StylePack } from "@/lib/catalog";
import { generateCssVariables } from "@/lib/theme-handoff";
import { normalizeStyle, type NormalizedStyle } from "@/lib/style-theme";

export function generateStaticParams() {
  return styles.map((style) => ({ styleId: style.id }));
}

export default async function StyleDetailPage({
  params,
}: {
  params: Promise<{ styleId: string }>;
}) {
  const { styleId } = await params;
  const sourceStyle = getStyleById(styleId);

  if (!sourceStyle) {
    notFound();
  }

  const style = normalizeStyle(sourceStyle);
  const parentId = sourceStyle.parentStyleId ?? sourceStyle.id;
  const parentSource = getStyleById(parentId) ?? sourceStyle;
  const parentStyle = normalizeStyle(parentSource);
  const relatedSources = styles.filter((item) => (item.parentStyleId ?? item.id) === parentId);
  const variants = relatedSources
    .filter((item) => item.id !== parentSource.id)
    .map((item) => normalizeStyle(item));
  const siblingVariants = relatedSources
    .filter((item) => item.id !== sourceStyle.id)
    .map((item) => normalizeStyle(item))
    .slice(0, 8);
  const cssVariableText = generateCssVariables(sourceStyle);
  const positioning = sourceStyle.positioning || style.description || style.slogan;
  const isMainStyle = sourceStyle.isMainStyle ?? sourceStyle.id === parentId;
  const displayBadge = getDisplayBadge(sourceStyle, isMainStyle);

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/styles"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7]"
          >
            返回风格广场
          </Link>
          <span className="hidden text-sm text-slate-400 sm:inline">风格说明书</span>
        </div>

        {sourceStyle.displayLevel === "hidden" ? (
          <HiddenNotice style={style} parentStyle={parentStyle} />
        ) : null}

        <section className="overflow-hidden rounded-[24px] border border-[#E9ECEF] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={displayBadge.tone}>{displayBadge.label}</Badge>
                <Badge tone="muted">{sourceStyle.styleFamily || style.mood[0]}</Badge>
                {typeof sourceStyle.differentiationScore === "number" ? (
                  <Badge tone="score">差异化 {sourceStyle.differentiationScore}</Badge>
                ) : null}
              </div>
              <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-normal text-[#111827] md:text-5xl">
                {style.name}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#6B7280] md:text-lg">
                {positioning}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {pickItems(style.suitableFor, 4).map((item) => (
                  <span key={item} className="rounded-full bg-[#F1F3F5] px-3 py-1.5 text-sm font-medium text-[#111827]">
                    {item}
                  </span>
                ))}
              </div>
              {!isMainStyle ? (
                <p className="mt-5 text-sm text-[#6B7280]">
                  相近方向：
                  <Link href={`/styles/${parentStyle.id}`} className="font-semibold text-[#6C5CE7] hover:underline">
                    {parentStyle.name}
                  </Link>
                  {sourceStyle.variantName ? ` · ${getFriendlyDirectionName(sourceStyle.variantName)}` : null}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-[#E9ECEF] bg-[#F7F8FA] p-5">
              <p className="text-sm font-semibold text-[#111827]">颜色偏好</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <ColorSwatches style={style} />
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6B7280]">
                  {style.colorPreference}
                </span>
              </div>
              <div className="mt-5 grid gap-2 text-sm text-[#6B7280]">
                <p>后台：适合仪表盘、列表、审批、工作台。</p>
                <p>移动端：适合首页、任务流、轻操作场景。</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <CopyAction label="复制 Token" value={cssVariableText} />
                <a
                  href="#developer-integration"
                  className="inline-flex justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#6C5CE7]/30 hover:bg-[#F1EEFF] hover:text-[#6C5CE7]"
                >
                  查看开发接入
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="developer-integration">
          <ThemeHandoffPanel
            style={sourceStyle}
            title="开发接入"
            description="复制下面的主题代码到项目中，就能把当前风格应用到真实页面。第一版推荐 CSS Variables，最稳、最容易接入，也方便后续切换深色模式。"
          />
        </section>

        <Section
          eyebrow="Preview"
          title="双端真实预览"
          description="同一套风格同时落到后台 Dashboard 和移动端 App 首页，方便判断它是不是能进入真实项目。"
        >
          <StyleDetailModePreview style={style} />
        </Section>

        <Section
          eyebrow="Components"
          title="组件样板"
          description="用最常见的业务组件检查按钮、卡片、标签、输入框、表格和状态徽标是否协调。"
        >
          <ComponentSpecimen style={style} />
        </Section>

        <Section
          eyebrow="Mechanism"
          title="风格机制说明"
          description="把视觉选择翻译成可执行规则，设计、产品和开发都能对齐。"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MechanismCard title="色彩机制" value={sourceStyle.visualMechanism || `${style.colorPreference}为主，保留足够中性色承载信息层级。`} />
            <MechanismCard title="布局机制" value={sourceStyle.layoutMechanism || "优先内容密度和可扫描性，列表、卡片、表单之间保持稳定间距。"} />
            <MechanismCard title="组件机制" value={sourceStyle.componentMechanism || "按钮、标签、卡片和表格使用统一圆角、边框与轻阴影。"} />
            <MechanismCard title="圆角机制" value={`卡片 ${style.tokens.radius.card}，按钮 ${style.tokens.radius.button}，输入控件 ${style.tokens.radius.control}。`} />
            <MechanismCard title="阴影机制" value={`卡片阴影 ${style.tokens.shadow.card}，浮层阴影 ${style.tokens.shadow.floating}。`} />
            <MechanismCard title="动效机制" value={sourceStyle.motionMechanism || "轻微 hover、状态反馈和列表切换即可，不依赖夸张动效。"} />
          </div>
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <FitPanel title="适合什么项目" items={style.suitableFor} tone="good" />
          <FitPanel title="不适合什么项目" items={style.notSuitableFor} tone="bad" />
        </div>

        <Section
          eyebrow="Related"
          title="相近风格推荐"
          description="这些风格和当前方向接近，但在颜色、质感、信息密度或适用场景上有所不同。"
        >
          <VariantSection
            currentStyle={style}
            parentStyle={parentStyle}
            variants={isMainStyle ? variants : siblingVariants}
            isMainStyle={isMainStyle}
          />
        </Section>
      </div>
    </main>
  );
}

function HiddenNotice({ style, parentStyle }: { style: NormalizedStyle; parentStyle: NormalizedStyle }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
      <span className="font-semibold">该风格已收纳为相近方向。</span>
      当前仍可访问详情用于历史追溯；建议优先查看
      <Link href={`/styles/${parentStyle.id}`} className="mx-1 font-semibold underline underline-offset-4">
        {parentStyle.name}
      </Link>
      ，再决定是否使用 {style.name} 作为局部方向。
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-[#E9ECEF] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:p-6">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6C5CE7]">{eyebrow}</span>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#111827]">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ComponentSpecimen({ style }: { style: NormalizedStyle }) {
  const theme = {
    "--sample-primary": style.palette.primary,
    "--sample-secondary": style.palette.secondary,
    "--sample-accent": style.palette.accent,
    "--sample-bg": style.palette.background,
    "--sample-surface": style.palette.surface,
    "--sample-text": style.palette.textPrimary,
    "--sample-muted": style.palette.textSecondary,
    "--sample-border": style.palette.border,
    "--sample-radius-card": style.tokens.radius.card,
    "--sample-radius-button": style.tokens.radius.button,
    "--sample-shadow": style.tokens.shadow.card,
  } as CSSProperties;

  return (
    <div className="rounded-2xl border p-4 md:p-5" style={{ ...theme, background: "var(--sample-bg)", borderColor: "var(--sample-border)" }}>
      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[var(--sample-radius-card)] border bg-[var(--sample-surface)] p-5 shadow-[var(--sample-shadow)]" style={{ borderColor: "var(--sample-border)" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--sample-text)]">客户增长卡片</p>
              <p className="mt-1 text-sm text-[var(--sample-muted)]">本周新增线索和转化质量</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: soft(style.palette.primary), color: style.palette.primary }}>
              Tag
            </span>
          </div>
          <div className="mt-5 flex items-end gap-2">
            {[42, 64, 51, 78, 58, 86].map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="w-full rounded-t-md"
                style={{
                  height,
                  background: index % 2 ? style.palette.accent : style.palette.primary,
                  opacity: 0.34 + index * 0.08,
                }}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-[var(--sample-radius-button)] px-4 py-2 text-sm font-semibold text-white" style={{ background: style.palette.primary }}>
              Button
            </button>
            <button className="rounded-[var(--sample-radius-button)] border px-4 py-2 text-sm font-semibold text-[var(--sample-text)]" style={{ borderColor: "var(--sample-border)", background: "var(--sample-surface)" }}>
              Secondary
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[var(--sample-radius-card)] border bg-[var(--sample-surface)] p-4" style={{ borderColor: "var(--sample-border)" }}>
            <label className="text-xs font-semibold text-[var(--sample-muted)]">Input</label>
            <div className="mt-2 rounded-[var(--sample-radius-button)] border px-3 py-2 text-sm text-[var(--sample-text)]" style={{ borderColor: "var(--sample-border)", background: style.palette.surface }}>
              请输入项目名称
            </div>
          </div>
          <div className="overflow-hidden rounded-[var(--sample-radius-card)] border bg-[var(--sample-surface)]" style={{ borderColor: "var(--sample-border)" }}>
            <div className="grid grid-cols-[1fr_0.7fr_0.6fr] gap-3 border-b px-4 py-3 text-xs font-semibold text-[var(--sample-muted)]" style={{ borderColor: "var(--sample-border)" }}>
              <span>Table</span>
              <span>Owner</span>
              <span>Status</span>
            </div>
            {["企业后台", "移动工作台", "数据看板"].map((item, index) => (
              <div key={item} className="grid grid-cols-[1fr_0.7fr_0.6fr] gap-3 px-4 py-3 text-sm text-[var(--sample-text)]">
                <span>{item}</span>
                <span className="text-[var(--sample-muted)]">Design</span>
                <span>
                  <span
                    className="rounded-full px-2 py-1 text-xs font-semibold"
                    style={{
                      background: index === 0 ? soft(style.palette.accent) : soft(style.palette.primary),
                      color: index === 0 ? style.palette.accent : style.palette.primary,
                    }}
                  >
                    Status Badge
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MechanismCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E9ECEF] bg-[#F7F8FA] p-4">
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6B7280]">{value}</p>
    </div>
  );
}

function FitPanel({ title, items, tone }: { title: string; items: string[]; tone: "good" | "bad" }) {
  return (
    <section className="rounded-[20px] border border-[#E9ECEF] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:p-6">
      <h2 className="text-xl font-semibold text-[#111827]">{title}</h2>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <p
            key={item}
            className={`rounded-xl px-3 py-2 text-sm leading-6 ${
              tone === "good" ? "bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-600"
            }`}
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function VariantSection({
  currentStyle,
  parentStyle,
  variants,
  isMainStyle,
}: {
  currentStyle: NormalizedStyle;
  parentStyle: NormalizedStyle;
  variants: NormalizedStyle[];
  isMainStyle: boolean;
}) {
  const list = variants.slice(0, 8);

  return (
    <div className="space-y-4">
      {!isMainStyle ? (
        <VariantCard style={parentStyle} note="推荐先看" />
      ) : null}
      {list.length ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <VariantCard
              key={item.id}
              style={item}
              note={item.id === currentStyle.id ? "当前风格" : getFriendlyDirectionName(item.source.variantName)}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-[#F7F8FA] px-4 py-3 text-sm text-[#6B7280]">
          当前方向暂无更多相近推荐，可以直接作为标准方案使用。
        </p>
      )}
    </div>
  );
}

function VariantCard({ style, note }: { style: NormalizedStyle; note: string }) {
  const differentiators = getVariantDifferentiators(style);

  return (
    <Link
      href={`/styles/${style.id}`}
      className="rounded-2xl border border-[#E9ECEF] bg-[#F7F8FA] p-4 transition hover:-translate-y-0.5 hover:border-[#6C5CE7]/30 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      <span className="text-xs font-semibold text-[#6C5CE7]">{note}</span>
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-[#111827]">{style.name}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6B7280]">
        {style.source.positioning || style.description}
      </p>
      {differentiators.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {differentiators.map((item) => (
            <span key={item} className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#667085]">
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

function getVariantDifferentiators(style: NormalizedStyle) {
  const diff = style.source.styleDifferentiators;
  const text = [
    diff?.typography,
    diff?.shadow,
    diff?.iconLanguage,
    diff?.layoutRhythm,
    diff?.border,
  ].filter(Boolean).join(" ");

  const rules: Array<[RegExp, string]> = [
    [/细字|轻量/, "轻字重"],
    [/粗|强标题/, "强标题"],
    [/宽字距|字距/, "宽字距"],
    [/等宽|mono/i, "等宽"],
    [/紧凑|dense|compact/i, "高密度"],
    [/宽松|超大留白|relaxed/i, "大留白"],
    [/柔光|软阴影/, "柔光阴影"],
    [/硬质|清晰硬/, "硬阴影"],
    [/无阴影|扁平/, "扁平"],
    [/实心|填充/, "面性图标"],
    [/线性|细线/, "线性图标"],
    [/虚线/, "虚线分割"],
    [/主题色|渐变|金属/, "强调描边"],
  ];

  return Array.from(new Set(rules.flatMap(([pattern, label]) => (pattern.test(text) ? [label] : [])))).slice(0, 4);
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "primary" | "muted" | "score" | "hidden" }) {
  const className =
    tone === "primary"
      ? "bg-[#F1EEFF] text-[#6C5CE7]"
      : tone === "score"
        ? "bg-emerald-50 text-emerald-700"
        : tone === "hidden"
          ? "bg-amber-50 text-amber-700"
          : "bg-[#F1F3F5] text-[#6B7280]";
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

function getDisplayBadge(style: StylePack, isMainStyle: boolean): { label: string; tone: "primary" | "muted" | "score" | "hidden" } {
  if (style.displayLevel === "hidden") return { label: "相近方向", tone: "hidden" };
  if (style.displayLevel === "hero") return { label: "主推", tone: "primary" };
  if (isMainStyle) return { label: "精选风格", tone: "primary" };
  return { label: "相近风格", tone: "muted" };
}

function getFriendlyDirectionName(value?: string) {
  if (!value) return "相近风格";
  return value.replace(/变体/g, "方向").replace(/主风格/g, "精选方向");
}

function pickItems(items: string[], count: number) {
  return items.filter(Boolean).slice(0, count);
}

function soft(color: string) {
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) return "#F1F3F5";
  return `${color}18`;
}
