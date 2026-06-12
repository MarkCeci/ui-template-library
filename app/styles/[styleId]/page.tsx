import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyAction } from "@/components/copy-action";
import { PageShell } from "@/components/page-shell";
import { RealScenarioPreview } from "@/components/real-scenario-preview";
import { ColorSwatches } from "@/components/style-preview-panels";
import { ThemeHandoffPanel } from "@/components/theme-handoff-panel";
import { getStyleById, styles } from "@/lib/catalog";
import { getStyleJson, normalizeStyle } from "@/lib/style-theme";

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
  const cssVariableText = Object.entries(style.handoff.cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");
  const jsonText = getStyleJson(style);
  const hasV3Fields = Boolean(
    style.moodTheme ||
      style.visualSignature.length ||
      style.previewComposition ||
      style.differentiationFromV2,
  );
  const hasAdvancedFields = style.source.tags.includes("advanced-v4");

  return (
    <PageShell
      eyebrow="Style Detail"
      title={style.name}
      description={style.description}
      actions={
        <Link
          href="/styles"
          className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          返回风格广场
        </Link>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-violet-700">{style.slogan}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">风格概览</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  这个页面展示同一个风格套在后台端和移动端标准壳子里的效果。设计师只维护风格 JSON，预览会自动跟随 token 变化。
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <ColorSwatches style={style} />
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                    {style.endpoint}
                  </span>
                  {style.mood.map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <PreviewSection
            title="真实场景完整预览"
            description="默认展示真实中文业务数据；可切换移动端 App、后台 Web，以及加载、空状态、错误和无权限等交付状态。"
          >
            <RealScenarioPreview
              style={style}
              scenario={style.previewScenario}
              stylePackId={style.id}
              tokenModes={[style.source.tokens]}
              showControls
              showPlatformTabs
            />
          </PreviewSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <InfoPanel title="适合项目" items={style.suitableFor} />
            <InfoPanel title="不适合项目" items={style.notSuitableFor} />
          </div>

          {hasV3Fields ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    V3 Theme Pack
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">
                    V3 视觉主题信息
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    这些字段来自 V3 主题包，用于说明风格差异、视觉识别和预览构成。
                  </p>
                </div>
                {style.moodTheme ? (
                  <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    {style.moodTheme}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoBlock title="视觉特征 visualSignature" value={style.visualSignature.join("、") || "暂无"} />
                <InfoBlock title="差异说明 differentiationFromV2" value={style.differentiationFromV2 || "暂无"} />
                <InfoBlock title="后台/移动预览构成 previewComposition" value={formatDisplayValue(style.previewComposition)} />
                <InfoBlock title="AI 生成提示 previewPrompt" value={style.handoff.aiPrompt} />
              </div>
            </div>
          ) : null}

          {hasAdvancedFields ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    V4 Advanced Visual Style
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">
                    高级视觉主题说明
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    这些字段用于判断它是不是只换颜色，还是在渐变、光效、暗色、线性、Web3 或玻璃拟态上形成了真实差异。
                  </p>
                </div>
                {style.source.group ? (
                  <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    {style.source.group}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoBlock title="渐变方式 gradientStyle" value={style.source.gradientStyle || "暂无"} />
                <InfoBlock title="光效方式 glowStyle" value={style.source.glowStyle || "暂无"} />
                <InfoBlock title="暗色策略 darkModeStrategy" value={style.source.darkModeStrategy || "暂无"} />
                <InfoBlock title="Linear 特征 linearStyle" value={style.source.linearStyle || "暂无"} />
                <InfoBlock title="Web3 特征 web3Style" value={style.source.web3Style || "暂无"} />
                <InfoBlock title="组件气质 componentStyle" value={style.source.componentStyle || "暂无"} />
                <InfoBlock title="移动端适配 mobileAdaptation" value={style.source.mobileAdaptation || "暂无"} />
                <InfoBlock title="后台端适配 adminAdaptation" value={style.source.adminAdaptation || "暂无"} />
                <InfoBlock title="数据看板适配 dashboardAdaptation" value={style.source.dashboardAdaptation || "暂无"} />
                <InfoBlock title="差异化说明 differenceFromExisting" value={formatDisplayValue(style.source.differenceFromExisting)} />
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">设计规范</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <SpecBlock title="色彩 token" value={Object.entries(style.tokens.colors).map(([key, value]) => `${key}: ${value}`).join(" / ")} />
              <SpecBlock title="字体建议" value={`${style.tokens.typography.heading}；${style.tokens.typography.body}`} />
              <SpecBlock title="圆角规范" value={`卡片 ${style.tokens.radius.card}；按钮 ${style.tokens.radius.button}；控件 ${style.tokens.radius.control}`} />
              <SpecBlock title="阴影规范" value={`卡片：${style.tokens.shadow.card}；浮层：${style.tokens.shadow.floating}`} />
            </div>
          </div>

          <ThemeHandoffPanel style={sourceStyle} />
        </div>

        <aside className="space-y-5">
          <CopyPanel
            title="复制 CSS 变量"
            description="开发同事可通过 styleId 获取风格后，把这些变量应用到标准预览壳子或业务页面。"
            buttonLabel="复制 CSS 变量"
            value={cssVariableText}
          />

          <CopyPanel
            title="复制 AI Prompt"
            description="用于后续让 AI 生成该风格的首屏 UI、说明文档或页面方案。"
            buttonLabel="复制 AI Prompt"
            value={style.handoff.aiPrompt}
          />

          <CopyPanel
            title="查看 / 复制该风格 JSON"
            description="设计师后续只维护风格 JSON；新增风格后，风格广场会自动出现。"
            buttonLabel="复制风格 JSON"
            value={jsonText}
            preHeight="max-h-[420px]"
          />

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">开发调用</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <p>
                使用 <span className="font-mono text-slate-950">getStyleById(&quot;{style.id}&quot;)</span> 获取风格。
              </p>
              <p>
                使用 <span className="font-mono text-slate-950">applyTheme(style.tokens)</span> 输出 CSS 变量。
              </p>
              <p>
                页面结构复用标准壳子，风格只负责色彩、圆角、阴影、字体和氛围。
              </p>
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function PreviewSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function InfoPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <p key={item} className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function SpecBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}

function formatDisplayValue(value: unknown): string {
  if (!value) return "暂无";
  if (Array.isArray(value)) return value.map(formatDisplayValue).join("、");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${key}: ${formatDisplayValue(item)}`)
      .join("\n");
  }
  return String(value);
}

function CopyPanel({
  title,
  description,
  buttonLabel,
  value,
  preHeight = "max-h-56",
}: {
  title: string;
  description: string;
  buttonLabel: string;
  value: string;
  preHeight?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <CopyAction label={buttonLabel} value={value} />
      </div>
      <pre className={`mt-4 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs leading-5 text-slate-100 ${preHeight}`}>
        {value}
      </pre>
    </div>
  );
}
