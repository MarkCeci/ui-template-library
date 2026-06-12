import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { EnterpriseStyleCover } from "@/components/enterprise-style-cover";
import {
  getPrimaryScenario,
  getStyleCoverVariant,
  getVisualKeywords,
} from "@/components/style-showroom-cover";
import {
  applyTheme,
  getPreviewPattern,
  normalizeStyle,
  type NormalizedStyle,
} from "@/lib/style-theme";
import type { StylePack } from "@/lib/catalog";

type StylePreviewCardProps = {
  style?: StylePack;
  normalized?: NormalizedStyle;
};

export function StylePreviewCard({ style, normalized }: StylePreviewCardProps) {
  const viewModel = normalized ?? (style ? normalizeStyle(style) : null);

  if (!viewModel) {
    return null;
  }

  const pattern = getPreviewPattern(viewModel);
  const variant = getStyleCoverVariant(viewModel);
  const projectTags = getSelectionTags(viewModel, variant).slice(0, 3);
  const visualTags = getVisualKeywords(viewModel, variant);
  const previewVars = {
    ...applyTheme(viewModel),
    "--pattern-type": pattern,
  } as CSSProperties;
  const isLocalPublished = viewModel.source.tags.includes("本地发布");
  const detailHref = isLocalPublished ? `/styles/local/${viewModel.id}` : `/styles/${viewModel.id}`;
  return (
    <article
      className="style-preview-card enterprise-card-v2 group"
      style={previewVars}
      data-pattern={pattern}
      data-cover-variant={variant}
    >
      <Link href={detailHref} className="style-preview-link">
        <div className="style-preview-stage">
          <EnterpriseStyleCover style={viewModel} />
        </div>

        <div className="style-preview-info">
          <div className="style-preview-title-row">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-lg font-semibold text-slate-950">
                {viewModel.name}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                {getPrimaryScenario(viewModel, variant)}：{viewModel.slogan}
              </p>
            </div>
          </div>

          <div className="style-selection-meta">
            <MetaBlock label="适合项目">
              {projectTags.slice(0, 3).map((tag) => (
                <span key={tag} className="style-business-tag">
                  {tag}
                </span>
              ))}
            </MetaBlock>
            <MetaBlock label="适合平台">
              <span className="style-business-tag mood">{viewModel.endpoint}</span>
            </MetaBlock>
            <MetaBlock label="视觉关键词">
              {visualTags.slice(0, 3).map((tag) => (
                <span key={tag} className="style-business-tag">
                  {tag}
                </span>
              ))}
            </MetaBlock>
          </div>

          <div className="style-card-footer">
            <ColorRibbon style={viewModel} />
            <span className="style-detail-cta">查看详情 →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function MetaBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ColorRibbon({ style }: { style: NormalizedStyle }) {
  const colors = [
    style.palette.primary,
    style.palette.secondary,
    style.palette.accent,
    style.palette.background,
    style.palette.surface,
  ].filter(Boolean);

  return (
    <div className="style-color-ribbon" aria-label="代表色">
      {colors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          style={{
            background: color,
            flex: index === 0 ? 2.2 : index === 1 ? 1.5 : 1,
          }}
        />
      ))}
    </div>
  );
}

export function AdminMiniPreview({ style }: { style: NormalizedStyle }) {
  const pattern = getPreviewPattern(style);

  return (
    <div className="admin-mini-preview">
      <div className="mini-admin-sidebar">
        <span className="mini-logo" />
        {[0, 1, 2, 3, 4].map((item) => (
          <span key={item} className={item === 1 ? "mini-nav active" : "mini-nav"} />
        ))}
      </div>

      <div className="mini-admin-main">
        <div className="mini-topbar">
          <div>
            <span className="mini-title-line" />
            <span className="mini-sub-line" />
          </div>
          <span className="mini-action" />
        </div>

        <div className="mini-kpis">
          {[0, 1, 2].map((item) => (
            <div key={item} className="mini-kpi">
              <span className="mini-kpi-icon" />
              <span className="mini-kpi-value" />
              <span className="mini-kpi-caption" />
            </div>
          ))}
        </div>

        <div className="mini-content-grid">
          <div className="mini-chart-card">
            <div className="mini-chart-head">
              <span />
              <span />
            </div>
            {pattern === "finance" ? <AssetChart /> : <BarChart />}
          </div>
          <div className="mini-side-card">
            {pattern === "local" ? <CouponStack /> : pattern === "guochao" ? <SealStack /> : <StatusStack />}
          </div>
        </div>

        <div className="mini-table">
          {[0, 1, 2].map((row) => (
            <div key={row} className="mini-table-row">
              <span className="mini-cell strong" />
              <span className="mini-cell" />
              <span className={row === 1 ? "mini-status warning" : "mini-status"} />
              <span className="mini-cell short" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MobileMiniPreview({ style }: { style: NormalizedStyle }) {
  const pattern = getPreviewPattern(style);

  return (
    <div className="mobile-mini-preview">
      <div className="mobile-phone">
        <div className="phone-status">
          <span />
          <span />
        </div>
        <div className="phone-banner">
          <span className="phone-banner-title" />
          <span className="phone-banner-copy" />
          <span className="phone-banner-button" />
        </div>
        <div className="phone-entry-grid">
          {[0, 1, 2, 3].map((item) => (
            <span key={item} className={item === 0 ? "phone-entry active" : "phone-entry"} />
          ))}
        </div>
        <div className="phone-card">
          <span className="phone-card-media" />
          <span className="phone-card-line" />
          <span className="phone-card-line short" />
        </div>
        <div className="phone-list">
          {[0, 1].map((item) => (
            <div key={item} className="phone-list-item">
              <span className="phone-list-icon" />
              <span className="phone-list-lines">
                <i />
                <i />
              </span>
            </div>
          ))}
        </div>
        <div className="phone-tabbar">
          {[0, 1, 2, 3].map((item) => (
            <span key={item} className={item === 0 ? "tab-dot active" : "tab-dot"} />
          ))}
        </div>
        {pattern === "glass" || pattern === "dream" ? <span className="phone-orb" /> : null}
      </div>
    </div>
  );
}

function BarChart() {
  return (
    <div className="mini-bars">
      {[34, 58, 46, 76, 52, 68].map((height, index) => (
        <span key={`${height}-${index}`} style={{ height }} />
      ))}
    </div>
  );
}

function AssetChart() {
  return (
    <div className="mini-asset-chart">
      <span />
      <span />
      <span />
    </div>
  );
}

function StatusStack() {
  return (
    <div className="mini-status-stack">
      {[0, 1, 2, 3].map((item) => (
        <span key={item} />
      ))}
    </div>
  );
}

function CouponStack() {
  return (
    <div className="mini-coupon-stack">
      {[0, 1, 2].map((item) => (
        <span key={item} />
      ))}
    </div>
  );
}

function SealStack() {
  return (
    <div className="mini-seal-stack">
      <span />
      <span />
      <span />
    </div>
  );
}

function getScenarioTags(style: NormalizedStyle) {
  const text = [
    style.name,
    style.description,
    style.suitableFor.join(" "),
    style.visualSignature.join(" "),
    style.moodTheme ?? "",
    style.mood.join(" "),
  ].join(" ");
  const tags: string[] = [];

  if (/企业|后台|CRM|ERP|OA|SaaS|表格|管理/.test(text)) tags.push("企业后台");
  if (/移动|App|手机|小程序/.test(text)) tags.push("移动 App");
  if (/AI|Copilot|Agent|智能|科技/.test(text)) tags.push("AI 工具");
  if (/数据|大屏|看板|dashboard|指标/.test(text)) tags.push("数据看板");
  if (/医疗|健康|体检|医院/.test(text)) tags.push("医疗健康");
  if (/金融|资产|投资|支付|保险/.test(text)) tags.push("金融系统");
  if (/本地生活|外卖|团购|到店|生活服务/.test(text)) tags.push("本地生活");
  if (/国潮|文化|文旅|茶饮/.test(text)) tags.push("国潮文化");
  if (/内容|社区|媒体|美妆|探店/.test(text)) tags.push("内容社区");
  if (/开发者|API|控制台/.test(text)) tags.push("开发平台");

  if (tags.length) return Array.from(new Set(tags));
  return style.suitableFor.slice(0, 3).map((item) => item.split(" / ")[0].trim());
}

function getSelectionTags(style: NormalizedStyle, variant: ReturnType<typeof getStyleCoverVariant>) {
  const variantTags: Record<ReturnType<typeof getStyleCoverVariant>, string[]> = {
    "saas-clean-showroom": ["企业后台", "SaaS 系统", "客户运营"],
    "enterprise-table-showroom": ["高密度后台", "ERP / CRM", "主数据管理"],
    "mobile-workbench-showroom": ["移动办公", "审批待办", "客户跟进"],
    "glass-enterprise-showroom": ["AI 工具", "智能分析", "高端产品"],
    "dark-dashboard-showroom": ["数据大屏", "监控中心", "运营看板"],
    "ai-copilot-showroom": ["AI 助手", "知识工作台", "智能推荐"],
    "medical-health-showroom": ["医疗健康", "报告管理", "患者服务"],
    "finance-trust-showroom": ["金融系统", "资产账户", "风控场景"],
    "ecommerce-growth-showroom": ["电商运营", "订单增长", "营销活动"],
    "local-service-showroom": ["本地生活", "门店经营", "预约服务"],
  };

  return Array.from(new Set([...variantTags[variant], ...getScenarioTags(style)]));
}
