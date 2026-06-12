import Link from "next/link";
import { EnterpriseStyleCover } from "@/components/enterprise-style-cover";
import { PageShell } from "@/components/page-shell";
import { ColorSwatches } from "@/components/style-preview-panels";
import { styles } from "@/lib/catalog";
import { normalizeStyle, type NormalizedStyle } from "@/lib/style-theme";

const groupOrder = [
  "高级渐变 Gradient 系",
  "深色暗黑 Dark 系",
  "光效微渐变 Glow 系",
  "Linear 线性专业系",
  "Web3 / Crypto 系",
  "玻璃拟态与未来感 Glass / Aurora 系",
];

export default async function AdvancedStyleLabPage({
  searchParams,
}: {
  searchParams?: Promise<{ p0?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const p0Only = resolvedSearchParams?.p0 === "1";
  const advanced = styles
    .filter((style) => style.tags.includes("advanced-v4"))
    .filter((style) => !p0Only || style.priority === "P0")
    .map((style) => normalizeStyle(style));

  const grouped = groupOrder.map((group) => ({
    group,
    styles: advanced.filter((style) => style.source.group === group),
  }));

  return (
    <PageShell
      eyebrow="V4 QA"
      title="Advanced Style Lab"
      description={`集中验收 V4 新增高级视觉主题。当前展示 ${advanced.length} 个风格，覆盖渐变、深色、微光、Linear、Web3 和玻璃拟态。`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href="/advanced-style-lab"
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
              p0Only ? "border-slate-200 text-slate-600 hover:bg-slate-50" : "border-violet-200 bg-violet-50 text-violet-700"
            }`}
          >
            全部 V4
          </Link>
          <Link
            href="/advanced-style-lab?p0=1"
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
              p0Only ? "border-violet-200 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            只看 P0
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {grouped.map(({ group, styles: groupStyles }) => (
          <section key={group} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                  {groupStyles.length} styles
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">{group}</h2>
              </div>
              <p className="text-sm text-slate-500">每组原始数量为 6 个，P0 筛选时只显示推荐项。</p>
            </div>

            {groupStyles.length ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {groupStyles.map((style) => (
                  <AdvancedStyleLabCard key={style.id} style={style} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                当前筛选下这个组没有可展示的风格。
              </div>
            )}
          </section>
        ))}
      </div>
    </PageShell>
  );
}

function AdvancedStyleLabCard({ style }: { style: NormalizedStyle }) {
  const tokens = style.source.designTokens;
  const difference = style.source.differenceFromExisting?.uniquePoints ?? [];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-4 p-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <EnterpriseStyleCover style={style} />
        </div>
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
                {style.source.priority}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                {style.source.coverVariant}
              </span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">{style.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{style.description}</p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-400">Token 色板</p>
              <ColorSwatches style={style} />
            </div>
            <GradientSample tokens={tokens} />
            <MiniPreviewSummary style={style} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/styles/${style.id}`}
              className="rounded-md bg-violet-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              查看详情
            </Link>
            <span className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500">
              {style.source.group}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-semibold text-slate-400">差异化说明</p>
        <div className="mt-2 grid gap-2">
          {difference.map((item) => (
            <p key={item} className="rounded-md bg-white px-3 py-2 text-sm leading-6 text-slate-600">
              {item}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

function GradientSample({ tokens }: { tokens: NormalizedStyle["source"]["designTokens"] }) {
  const gradients = tokens?.gradients ?? {};
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-400">渐变样张</p>
      <div
        className="h-12 rounded-xl border border-slate-200"
        style={{
          background:
            gradients.hero ??
            gradients.button ??
            "linear-gradient(135deg, #7c3aed, #22d3ee)",
        }}
      />
    </div>
  );
}

function MiniPreviewSummary({ style }: { style: NormalizedStyle }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold text-slate-400">后台样张</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">Dashboard / 表格 / 表单</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold text-slate-400">移动端样张</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">
          {style.previewScenario === "mobile-workbench" ? "工作台 / 待办" : "首页 / 列表 / 详情"}
        </p>
      </div>
    </div>
  );
}
