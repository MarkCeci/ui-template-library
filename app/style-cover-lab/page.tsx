import Link from "next/link";
import {
  EnterpriseStyleCover,
  enterpriseStyleCoverMap,
  mapToEnterpriseCoverVariant,
} from "@/components/enterprise-style-cover";
import { PageShell } from "@/components/page-shell";
import {
  getPrimaryScenario,
  getStyleCoverVariant,
  getVisualKeywords,
} from "@/components/style-showroom-cover";
import { styles } from "@/lib/catalog";
import { normalizeStyle, type NormalizedStyle } from "@/lib/style-theme";

export default function StyleCoverLabPage() {
  const normalized = styles.map((style) => normalizeStyle(style));

  return (
    <PageShell
      eyebrow="Internal QA"
      title="Style Cover Lab"
      description={`集中验收 EnterpriseStyleCover 的封面 variant。本页用于检查大尺寸样张、实际卡片效果，以及全部 ${styles.length} 个风格的映射关系。`}
    >
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Enterprise Cover V2
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              10 个已通过封面 Variant
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              前 4 个为首批样板，后 6 个补齐行业和气质差异。风格广场当前 95 个风格都统一使用这些新封面。
            </p>
          </div>
          <Link
            href="/styles"
            className="w-fit rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            返回风格广场
          </Link>
        </div>

        <div className="grid gap-6">
          {enterpriseStyleCoverMap.map((rule) => {
            const sampleStyle = getSampleStyle(normalized, rule.sampleStyleId);
            const mappedStyles = getMappedStyles(normalized, rule);
            if (!sampleStyle) return null;

            return (
              <article
                key={rule.variant}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        approved
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                        {rule.variant}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-slate-950">
                      {sampleStyle.name}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      {rule.applicableScenarios.join(" / ")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {mappedStyles.map((style) => (
                        <Link
                          href={`/styles/${style.id}`}
                          key={style.id}
                          className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                          {style.id}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold text-slate-500">卡片实际效果</p>
                    <StyleCardDemo style={sampleStyle} />
                  </div>
                </div>

                <div className="style-cover-lab-frame">
                  <EnterpriseStyleCover style={sampleStyle} variant={rule.variant} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Full Mapping
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">
              当前 {styles.length} 个风格接入映射
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            这里用于检查风格广场中每张卡片会调用哪个 EnterpriseStyleCover。所有优先级都不再回退到旧封面。
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-[1.1fr_1.35fr_1fr] bg-slate-50 text-xs font-semibold text-slate-500">
            <span className="px-3 py-2">风格 ID</span>
            <span className="px-3 py-2">风格名称</span>
            <span className="px-3 py-2">coverVariant</span>
          </div>
          {normalized.map((style) => {
            const rule = getRuleForStyle(style);
            return (
              <Link
                href={`/styles/${style.id}`}
                key={style.id}
                className="grid grid-cols-[1.1fr_1.35fr_1fr] border-t border-slate-100 text-sm text-slate-600 hover:bg-violet-50"
              >
                <span className="truncate px-3 py-2 font-mono text-xs">{style.id}</span>
                <span className="truncate px-3 py-2 font-semibold text-slate-900">{style.name}</span>
                <span className="truncate px-3 py-2">{rule?.variant ?? "未映射"}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

function StyleCardDemo({ style }: { style: NormalizedStyle }) {
  const variant = getStyleCoverVariant(style);
  const scenario = getPrimaryScenario(style, variant);
  const visualTags = getVisualKeywords(style, variant).slice(0, 3);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="home-feature-cover bg-slate-50 p-2">
        <EnterpriseStyleCover style={style} />
      </div>
      <div className="p-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-slate-950">{style.name}</h4>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {scenario}：{style.slogan}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visualTags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function getSampleStyle(normalized: NormalizedStyle[], sampleStyleId: string) {
  return normalized.find((style) => style.id === sampleStyleId) ?? normalized[0];
}

function getRuleForStyle(style: NormalizedStyle) {
  const variant = mapToEnterpriseCoverVariant(style);
  return enterpriseStyleCoverMap.find((rule) => rule.variant === variant);
}

function getMappedStyles(
  normalized: NormalizedStyle[],
  rule: (typeof enterpriseStyleCoverMap)[number],
) {
  const exact = normalized.filter((style) => rule.approvedStyleIds.includes(style.id));
  const exactIds = new Set(exact.map((style) => style.id));
  const keywordMatches = normalized
    .filter((style) => !exactIds.has(style.id))
    .filter((style) => {
      const text = [
        style.id,
        style.name,
        style.description,
        style.slogan,
        style.source.category,
        style.source.visual,
        style.source.tokens,
        style.source.tags?.join(" ") ?? "",
        style.moodTheme,
        style.visualSignature.join(" "),
        style.suitableFor.join(" "),
      ].join(" ").toLowerCase();

      return rule.futureReuseKeywords.some((keyword) => text.includes(keyword.toLowerCase()));
    })
    .slice(0, 6);

  return [...exact, ...keywordMatches].slice(0, 8);
}
