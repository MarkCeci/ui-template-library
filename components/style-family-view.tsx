"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EnterpriseStyleCover } from "@/components/enterprise-style-cover";
import { ColorSwatches } from "@/components/style-preview-panels";
import type { NormalizedStyle } from "@/lib/style-theme";

type StyleFamilyViewProps = {
  featuredStyles: NormalizedStyle[];
  historicalStyles: NormalizedStyle[];
};

type FamilyDefinition = {
  key: string;
  label: string;
  description: string;
  tone: string;
  bestFor: string[];
  keywords: string[];
};

type StyleFamilyGroup = FamilyDefinition & {
  featured: NormalizedStyle[];
  historical: NormalizedStyle[];
  mainStyles: NormalizedStyle[];
  variants: NormalizedStyle[];
  representative?: NormalizedStyle;
};

const familyDefinitions: FamilyDefinition[] = [
  {
    key: "现代 SaaS / B2B 工具",
    label: "现代 SaaS / B2B 工具",
    description: "浅色、留白、卡片化，适合客户运营、项目管理、团队协作等企业 SaaS。",
    tone: "清爽、可信、低学习成本",
    bestFor: ["企业后台", "客户运营", "协作工具"],
    keywords: ["saas", "b2b", "minimal", "modern", "客户", "运营", "项目", "协作"],
  },
  {
    key: "Linear / 极简效率",
    label: "Linear / 极简效率",
    description: "更克制、更工具化，适合任务流、开发者平台、资源管理和高频操作界面。",
    tone: "极简、高效、结构清楚",
    bestFor: ["任务管理", "开发者工具", "资源控制台"],
    keywords: ["linear", "developer", "console", "devops", "cloud", "resource", "资源", "开发者", "控制台", "效率"],
  },
  {
    key: "AI Copilot / Agent 工作台",
    label: "AI Copilot / Agent 工作台",
    description: "突出对话、知识卡片和智能建议，适合 AI 助手、Agent、智能分析产品。",
    tone: "智能、轻科技、辅助决策",
    bestFor: ["AI 助手", "智能分析", "知识工作台"],
    keywords: ["ai", "copilot", "agent", "assistant", "chat", "education", "智能", "助手", "知识", "教育"],
  },
  {
    key: "Apple / Liquid Glass 高端系统",
    label: "Apple / Liquid Glass 高端系统",
    description: "玻璃、半透明和柔和光感，适合需要高级感但仍要可读的品牌型产品。",
    tone: "高级、轻盈、未来感",
    bestFor: ["品牌型产品", "高端工具", "移动体验"],
    keywords: ["apple", "liquid", "glass", "premium", "aqua", "aurora", "高级", "轻奢", "玻璃", "极光"],
  },
  {
    key: "企业 ERP / CRM 表格",
    label: "企业 ERP / CRM 表格",
    description: "表格、筛选、审批和批量操作优先，适合复杂管理后台和数据录入流程。",
    tone: "稳重、高密度、强管理",
    bestFor: ["ERP / CRM", "审批流程", "主数据管理"],
    keywords: ["enterprise", "table", "erp", "crm", "salesforce", "sap", "carbon", "process", "approval", "表格", "审批", "流程", "主数据"],
  },
  {
    key: "深色数据大屏 / 指挥中心",
    label: "深色数据大屏 / 指挥中心",
    description: "深色、KPI、监控图表和告警列表，适合运营大屏、运维、安全和指挥中心。",
    tone: "沉浸、数据化、状态感强",
    bestFor: ["数据大屏", "监控中心", "安全运营"],
    keywords: ["dark", "dashboard", "data", "visualization", "soc", "security", "monitor", "暗色", "大屏", "数据", "监控", "指挥"],
  },
  {
    key: "金融科技 / 可信交易",
    label: "金融科技 / 可信交易",
    description: "强调资产、交易、风控和可信感，适合金融、支付、风控和经营分析。",
    tone: "稳重、可信、精密",
    bestFor: ["金融系统", "资产看板", "风控交易"],
    keywords: ["finance", "fintech", "trust", "risk", "asset", "payment", "金融", "资产", "风控", "交易", "可信"],
  },
  {
    key: "医疗健康 / 清洁专业",
    label: "医疗健康 / 清洁专业",
    description: "蓝绿、留白和清洁层级，适合健康报告、医疗管理和检测服务。",
    tone: "干净、专业、安心",
    bestFor: ["医疗健康", "检测报告", "患者管理"],
    keywords: ["medical", "health", "doctor", "patient", "report", "医疗", "健康", "检测", "报告", "患者"],
  },
  {
    key: "电商运营 / 增长后台",
    label: "电商运营 / 增长后台",
    description: "订单、商品、活动和转化率优先，适合电商、商家运营和增长工具。",
    tone: "活跃、运营感、目标明确",
    bestFor: ["电商运营", "订单增长", "营销活动"],
    keywords: ["ecommerce", "commerce", "growth", "merchant", "order", "shop", "电商", "商家", "订单", "增长", "营销"],
  },
  {
    key: "本地生活 / 门店服务",
    label: "本地生活 / 门店服务",
    description: "门店、预约、服务卡和评价标签，适合生活服务、到店和区域运营。",
    tone: "亲和、生活化、轻运营",
    bestFor: ["门店服务", "预约订单", "本地生活"],
    keywords: ["local", "life", "service", "store", "booking", "appointment", "本地生活", "门店", "预约", "服务", "到店"],
  },
  {
    key: "年轻消费 / 内容社区",
    label: "年轻消费 / 内容社区",
    description: "更活力、更轻社交，适合内容社区、活动、会员和年轻消费产品。",
    tone: "活力、轻松、视觉记忆点强",
    bestFor: ["内容社区", "会员活动", "年轻消费"],
    keywords: ["young", "content", "community", "pink", "red", "dopamine", "activity", "年轻", "内容", "社区", "活动", "红粉"],
  },
  {
    key: "国潮文化 / 新消费品牌",
    label: "国潮文化 / 新消费品牌",
    description: "红金、文化符号和品牌仪式感，适合文旅、茶饮、新消费和文化产品。",
    tone: "文化感、品牌感、东方气质",
    bestFor: ["文旅品牌", "茶饮零售", "文化项目"],
    keywords: ["guochao", "culture", "oriental", "red", "gold", "tea", "travel", "国潮", "文化", "文旅", "茶饮", "红金"],
  },
];

export function StyleFamilyView({ featuredStyles, historicalStyles }: StyleFamilyViewProps) {
  const [activeFamilyKey, setActiveFamilyKey] = useState(familyDefinitions[0].key);
  const [showHidden, setShowHidden] = useState(false);

  const groups = useMemo(
    () =>
      familyDefinitions.map((definition) => {
        const featured = featuredStyles.filter((style) => getFamilyKey(style) === definition.key);
        const historical = historicalStyles.filter((style) => getFamilyKey(style) === definition.key);
        const mainStyles = featured.filter(isMainStyle);
        const variants = featured.filter((style) => !isMainStyle(style));
        const representative = pickRepresentativeStyle(definition, mainStyles.length ? mainStyles : featured, historical);

        return {
          ...definition,
          featured,
          historical,
          mainStyles: mainStyles.length ? mainStyles : featured.slice(0, 2),
          variants,
          representative,
        };
      }),
    [featuredStyles, historicalStyles],
  );

  const visibleGroups = groups.filter((group) => group.featured.length > 0 || group.historical.length > 0);
  const activeFamily = visibleGroups.find((group) => group.key === activeFamilyKey) ?? visibleGroups[0];

  if (!activeFamily) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--styles-pitch-color-border)] bg-white p-8 text-center">
        <p className="text-sm text-[var(--styles-pitch-color-text-secondary)]">
          当前筛选条件下没有可展示的精选方向。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {visibleGroups.map((group) => (
          <FamilySummaryCard
            key={group.key}
            group={group}
            active={group.key === activeFamily.key}
            onEnter={() => {
              setActiveFamilyKey(group.key);
              setShowHidden(false);
            }}
          />
        ))}
      </div>

      <section className="rounded-[var(--styles-pitch-radius-card)] border border-[var(--styles-pitch-color-border)] bg-white p-5 shadow-[var(--styles-pitch-shadow-card)] sm:p-6">
        <div className="flex flex-col gap-3 border-b border-[var(--styles-pitch-color-border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--styles-pitch-color-primary)]">
              Related Styles
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--styles-pitch-color-text-primary)]">
              {activeFamily.label}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--styles-pitch-color-text-secondary)]">
              {activeFamily.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-[var(--styles-pitch-color-primary-soft)] px-3 py-1 text-[var(--styles-pitch-color-primary)]">
              精选方向 {activeFamily.mainStyles.length}
            </span>
            <span className="rounded-full bg-[var(--styles-pitch-color-surface-muted)] px-3 py-1 text-[var(--styles-pitch-color-text-secondary)]">
              相近方向 {activeFamily.variants.length}
            </span>
            <span className="rounded-full bg-[var(--styles-pitch-color-surface-muted)] px-3 py-1 text-[var(--styles-pitch-color-text-secondary)]">
              历史方向 {activeFamily.historical.length}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <FamilyBlock title="精选方向" description="优先从这些风格开始选，它们代表这一类的核心视觉方向。">
            <div className="grid gap-3 md:grid-cols-2">
              {activeFamily.mainStyles.map((style) => (
                <FamilyStyleCard key={style.id} style={style} emphasis />
              ))}
            </div>
          </FamilyBlock>

          <FamilyBlock title="相近风格" description="这些方向在颜色、密度、行业或平台侧重点上不同，适合做进一步比较。">
            {activeFamily.variants.length ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {activeFamily.variants.map((style) => (
                  <FamilyStyleCard key={style.id} style={style} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-[var(--styles-pitch-color-surface-muted)] px-4 py-3 text-sm text-[var(--styles-pitch-color-text-secondary)]">
                当前筛选条件下，这一类暂无更多相近推荐。
              </p>
            )}
          </FamilyBlock>

          <div className="rounded-[var(--styles-pitch-radius-card)] border border-dashed border-[var(--styles-pitch-color-border)] bg-[var(--styles-pitch-color-surface-muted)] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--styles-pitch-color-text-primary)]">
                  历史方向
                </h3>
                <p className="mt-1 text-sm text-[var(--styles-pitch-color-text-secondary)]">
                  {activeFamily.historical.length} 个风格已收纳到这一类，默认不展开，避免干扰选择。
                </p>
              </div>
              {activeFamily.historical.length ? (
                <button
                  type="button"
                  onClick={() => setShowHidden((value) => !value)}
                  className="inline-flex w-fit rounded-md px-1 py-1.5 text-sm font-semibold text-[var(--styles-pitch-color-text-muted)] transition hover:text-[var(--styles-pitch-color-primary)]"
                >
                  {showHidden ? "收起历史风格" : "展开历史风格"}
                </button>
              ) : null}
            </div>

            {showHidden && activeFamily.historical.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {activeFamily.historical.map((style) => (
                  <FamilyStyleCard key={style.id} style={style} muted />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function FamilySummaryCard({
  group,
  active,
  onEnter,
}: {
  group: StyleFamilyGroup;
  active: boolean;
  onEnter: () => void;
}) {
  const previewStyle = pickFamilyPreviewStyle(group);

  return (
    <article
      className={`style-family-card rounded-[var(--styles-pitch-radius-card)] border bg-white shadow-[var(--styles-pitch-shadow-card)] transition ${
        active
          ? "border-[var(--styles-pitch-color-primary-soft)] ring-1 ring-[var(--styles-pitch-color-primary-soft)]"
          : "border-[var(--styles-pitch-color-border)] hover:-translate-y-0.5 hover:border-[#DFE3E8] hover:shadow-[var(--styles-pitch-shadow-card-hover)]"
      }`}
    >
      {previewStyle ? (
        <div className="style-family-showcase">
          <EnterpriseStyleCover style={previewStyle} presentation="app-gallery" />
        </div>
      ) : (
        <div className="style-family-empty-showcase">
          <span>{group.tone}</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--styles-pitch-color-primary)]">
              {group.tone}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--styles-pitch-color-text-primary)]">
              {group.label}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--styles-pitch-color-text-secondary)]">
              {group.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--styles-pitch-color-primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--styles-pitch-color-primary)]">
            {group.featured.length}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {group.bestFor.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full bg-[var(--styles-pitch-color-surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--styles-pitch-color-text-secondary)]"
            >
              {item}
            </span>
          ))}
        </div>

        {previewStyle ? (
          <div className="mt-4 rounded-xl bg-[var(--styles-pitch-color-surface-muted)] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="line-clamp-1 text-sm font-semibold text-[var(--styles-pitch-color-text-primary)]">
                代表风格：{previewStyle.name}
              </p>
              <ColorSwatches style={previewStyle} />
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--styles-pitch-color-border)] pt-4">
          <p className="text-sm text-[var(--styles-pitch-color-text-secondary)]">
            {group.mainStyles.length} 个精选方向 · {group.variants.length} 个相近方向
          </p>
          <button
            type="button"
            onClick={onEnter}
            className="rounded-[var(--styles-pitch-radius-button)] border border-[var(--styles-pitch-color-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--styles-pitch-color-text-primary)] transition hover:border-[var(--styles-pitch-color-primary-soft)] hover:bg-[var(--styles-pitch-color-primary-soft)] hover:text-[var(--styles-pitch-color-primary)]"
          >
            查看这一类
          </button>
        </div>
      </div>
    </article>
  );
}

function FamilyBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-[var(--styles-pitch-color-text-primary)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--styles-pitch-color-text-secondary)]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function FamilyStyleCard({
  style,
  emphasis = false,
  muted = false,
}: {
  style: NormalizedStyle;
  emphasis?: boolean;
  muted?: boolean;
}) {
  return (
    <Link
      href={`/styles/${style.id}`}
      className={`rounded-[var(--styles-pitch-radius-card)] border p-4 transition hover:-translate-y-0.5 hover:border-[#DFE3E8] hover:shadow-[var(--styles-pitch-shadow-card-hover)] ${
        muted
          ? "border-dashed border-[var(--styles-pitch-color-border)] bg-white/70"
          : emphasis
            ? "border-[var(--styles-pitch-color-primary-soft)] bg-white"
            : "border-[var(--styles-pitch-color-border)] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${emphasis ? "bg-[var(--styles-pitch-color-primary-soft)] text-[var(--styles-pitch-color-primary)]" : "bg-[var(--styles-pitch-color-surface-muted)] text-[var(--styles-pitch-color-text-secondary)]"}`}>
              {getStyleRoleLabel(style)}
            </span>
            {typeof style.source.differentiationScore === "number" ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {style.source.differentiationScore}
              </span>
            ) : null}
          </div>
          <h4 className="mt-3 line-clamp-2 text-sm font-semibold text-[var(--styles-pitch-color-text-primary)]">
            {style.name}
          </h4>
        </div>
        <ColorSwatches style={style} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--styles-pitch-color-text-secondary)]">
        {style.source.positioning || style.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {style.suitableFor.slice(0, 2).map((item) => (
          <span key={item} className="rounded-full bg-[var(--styles-pitch-color-surface-muted)] px-2 py-1 text-xs font-medium text-[var(--styles-pitch-color-text-secondary)]">
            {item}
          </span>
        ))}
      </div>
    </Link>
  );
}

function isMainStyle(style: NormalizedStyle) {
  return style.source.isMainStyle || (style.source.parentStyleId ?? style.id) === style.id;
}

function pickFamilyPreviewStyle(group: StyleFamilyGroup) {
  const candidates = [
    ...group.mainStyles,
    ...(group.representative ? [group.representative] : []),
    ...group.featured,
  ];
  const unique = Array.from(new Map(candidates.map((style) => [style.id, style])).values());

  return unique.sort((a, b) => scoreFamilyPreview(b, group) - scoreFamilyPreview(a, group))[0];
}

function scoreFamilyPreview(style: NormalizedStyle, group: StyleFamilyGroup) {
  const text = getSearchText(style);
  let score = 0;

  if (isMainStyle(style)) score += 12;
  if (style.source.displayLevel === "hero") score += 8;
  if (style.source.displayLevel === "hidden") score -= 12;
  score += group.keywords.reduce((sum, keyword) => sum + (text.includes(keyword.toLowerCase()) ? 2 : 0), 0);

  if (group.key === "现代 SaaS / B2B 工具") {
    if (text.includes("saas") || text.includes("clean") || text.includes("modern") || text.includes("极简")) score += 12;
    if (text.includes("dark") || text.includes("暗色") || text.includes("command")) score -= 16;
    if (text.includes("ai") || text.includes("copilot") || text.includes("agent")) score -= 8;
  }

  if (group.key === "AI Copilot / Agent 工作台") {
    if (text.includes("ai") || text.includes("copilot") || text.includes("agent") || text.includes("智能")) score += 12;
  }

  if (group.key === "深色数据大屏 / 指挥中心") {
    if (text.includes("dark") || text.includes("暗色") || text.includes("command")) score += 12;
  }

  return score;
}

function getStyleRoleLabel(style: NormalizedStyle) {
  if (style.source.displayLevel === "hidden") return "已收纳";
  if (style.source.displayLevel === "hero") return "主推";
  return isMainStyle(style) ? "精选方向" : getFriendlyDirectionName(style.source.variantName);
}

function getFriendlyDirectionName(value?: string) {
  if (!value) return "相近方向";
  return value.replace(/变体/g, "方向").replace(/主风格/g, "精选方向");
}

function getFamilyKey(style: NormalizedStyle) {
  const explicit = explicitFamilyByStyleId(style.id);
  if (explicit) return explicit;

  const raw = normalizeFamilyName(style.source.styleFamily);
  if (raw && familyDefinitions.some((item) => item.key === raw)) return raw;

  const text = getSearchText(style);

  const ranked = familyDefinitions
    .map((definition) => ({
      key: definition.key,
      score: definition.keywords.reduce((score, keyword) => score + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score ? ranked[0].key : "现代 SaaS / B2B 工具";
}

function pickRepresentativeStyle(
  definition: FamilyDefinition,
  featured: NormalizedStyle[],
  historical: NormalizedStyle[],
) {
  const candidates = [...featured, ...historical];
  if (!candidates.length) return undefined;

  return (
    candidates.find((style) => style.source.displayLevel === "hero" && isFamilyMatch(style, definition)) ??
    candidates.find((style) => style.source.isMainStyle && isFamilyMatch(style, definition)) ??
    candidates.find((style) => isFamilyMatch(style, definition)) ??
    candidates[0]
  );
}

function isFamilyMatch(style: NormalizedStyle, definition: FamilyDefinition) {
  const text = getSearchText(style);
  return definition.keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function normalizeFamilyName(value?: string) {
  if (!value) return undefined;
  const mapping: Record<string, string> = {
    企业后台基础: "企业 ERP / CRM 表格",
    AI科技: "AI Copilot / Agent 工作台",
    "AI 科技": "AI Copilot / Agent 工作台",
    深色数据: "深色数据大屏 / 指挥中心",
    高级视觉: "Apple / Liquid Glass 高端系统",
    行业业务: "电商运营 / 增长后台",
    特殊机制: "Linear / 极简效率",
  };
  return mapping[value] ?? value;
}

function explicitFamilyByStyleId(id: string) {
  const text = id.toLowerCase();
  if (
    text.includes("style-001-modern-saas-clean") ||
    text.includes("style-006-atlassian-teamwork") ||
    text.includes("style-029-white-label-multitenant") ||
    text.includes("glacier-blue")
  ) {
    return "现代 SaaS / B2B 工具";
  }
  if (text.includes("liquid") || text.includes("glass") || text.includes("apple") || text.includes("premium")) {
    return "Apple / Liquid Glass 高端系统";
  }
  if (text.includes("ai") || text.includes("copilot") || text.includes("agent") || text.includes("education")) {
    return "AI Copilot / Agent 工作台";
  }
  if (text.includes("dark") || text.includes("dashboard") || text.includes("security") || text.includes("soc")) {
    return "深色数据大屏 / 指挥中心";
  }
  if (text.includes("finance") || text.includes("fintech") || text.includes("risk")) {
    return "金融科技 / 可信交易";
  }
  if (text.includes("health") || text.includes("medical")) {
    return "医疗健康 / 清洁专业";
  }
  if (text.includes("commerce") || text.includes("merchant") || text.includes("growth") || text.includes("order")) {
    return "电商运营 / 增长后台";
  }
  if (text.includes("local") || text.includes("life") || text.includes("store")) {
    return "本地生活 / 门店服务";
  }
  if (text.includes("guochao") || text.includes("culture") || text.includes("tea")) {
    return "国潮文化 / 新消费品牌";
  }
  if (text.includes("young") || text.includes("community") || text.includes("content")) {
    return "年轻消费 / 内容社区";
  }
  if (text.includes("linear") || text.includes("developer") || text.includes("devops") || text.includes("cloud")) {
    return "Linear / 极简效率";
  }
  if (text.includes("table") || text.includes("crm") || text.includes("erp") || text.includes("carbon") || text.includes("process")) {
    return "企业 ERP / CRM 表格";
  }
  return undefined;
}

function getSearchText(style: NormalizedStyle) {
  return [
    style.id,
    style.name,
    style.slogan,
    style.description,
    style.moodTheme,
    style.endpoint,
    style.colorPreference,
    style.previewScenario,
    style.source.category,
    style.source.group,
    style.source.coverVariant,
    style.source.styleFamily,
    style.source.themeKey,
    style.source.visual,
    style.source.scenario,
    style.source.positioning,
    ...(style.mood ?? []),
    ...(style.suitableFor ?? []),
    ...(style.visualSignature ?? []),
    ...(style.source.tags ?? []),
    ...(style.source.visualKeywords ?? []),
    ...(style.source.bestFor ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
