import Link from "next/link";
import type { CSSProperties } from "react";
import { EnterpriseStyleCover } from "@/components/enterprise-style-cover";
import { getStyleCoverVariant } from "@/components/style-showroom-cover";
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
  parentStyleName?: string;
};

export function StylePreviewCard({ style, normalized, parentStyleName }: StylePreviewCardProps) {
  const viewModel = normalized ?? (style ? normalizeStyle(style) : null);

  if (!viewModel) {
    return null;
  }

  const pattern = getPreviewPattern(viewModel);
  const variant = getStyleCoverVariant(viewModel);
  const projectTags = getProjectTags(viewModel);
  const mechanismTags = getMechanismTags(viewModel, variant);
  const positionText = getPositionText(viewModel);
  const previewVars = {
    ...applyTheme(viewModel),
    "--pattern-type": pattern,
  } as CSSProperties;
  const isLocalPublished = viewModel.source.tags.includes("本地发布");
  const isMergedVariant = viewModel.source.displayLevel === "hidden";
  const isVariant = !viewModel.source.isMainStyle;
  const displayBadge =
    viewModel.source.displayLevel === "hero"
      ? "主推"
      : isMergedVariant
        ? "相近方向"
        : isVariant
          ? "相近风格"
          : "精选风格";
  const score = viewModel.source.differentiationScore;
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
          <EnterpriseStyleCover style={viewModel} presentation="app-gallery" />
        </div>

        <div className="style-preview-info">
          <div className="style-preview-title-row">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-lg font-semibold text-slate-950">
                {viewModel.name}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className={`style-priority-badge priority-${viewModel.source.displayLevel === "hero" ? "P0" : "P1"}`}>
                {displayBadge}
              </span>
              {typeof score === "number" ? (
                <span className="style-score-badge">{score}</span>
              ) : null}
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--styles-pitch-color-text-secondary)]">
            {positionText}
          </p>

          <div className="style-selection-meta">
            <InfoRow label="适合项目" tags={projectTags} />
            <InfoRow label="视觉机制" tags={mechanismTags} />
          </div>

          <div className="style-card-footer">
            <div className="min-w-0 space-y-2">
              <div className="flex min-w-0 items-center gap-2">
                <ColorRibbon style={viewModel} />
                <span className="shrink-0 text-xs font-semibold text-[var(--styles-pitch-color-text-secondary)]">
                  {viewModel.colorPreference}
                </span>
              </div>
              {isVariant ? (
                <p className="line-clamp-1 text-xs font-semibold text-[var(--styles-pitch-color-text-muted)]">
                  相近方向：{parentStyleName ?? viewModel.source.parentStyleId ?? "相近风格"}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {isMergedVariant ? (
                <span className="rounded-full bg-[var(--styles-pitch-color-surface-muted)] px-2 py-1 text-xs font-semibold text-[var(--styles-pitch-color-text-muted)]">
                  已收纳
                </span>
              ) : null}
              <span className="style-detail-cta">查看详情 →</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function InfoRow({
  label,
  tags,
}: {
  label: string;
  tags: string[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="style-business-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function getPositionText(style: NormalizedStyle) {
  const source = style.source;
  return source.positioning || source.description || style.description || style.slogan;
}

function getProjectTags(style: NormalizedStyle) {
  return normalizeTagList(style.suitableFor.length ? style.suitableFor : [style.source.category]).slice(0, 3);
}

function getMechanismTags(style: NormalizedStyle, variant: string) {
  const differentiators = style.source.styleDifferentiators;
  const text = [
    differentiators?.typography,
    differentiators?.shadow,
    differentiators?.iconLanguage,
    differentiators?.layoutRhythm,
    differentiators?.border,
    differentiators?.atmosphere,
    style.source.visualMechanism,
    style.source.layoutMechanism,
    style.source.componentMechanism,
    style.source.visual,
    variant,
    ...style.visualSignature,
  ]
    .filter(Boolean)
    .join(" ");
  const rules: Array<[RegExp, string]> = [
    [/玻璃|glass/i, "玻璃拟态"],
    [/线性|1px|linear/i, "线性"],
    [/表格|高密度|dense/i, "高密度表格"],
    [/深色|暗色|大屏|command|dark/i, "深色大屏"],
    [/微光|glow|发光/i, "微光"],
    [/渐变|gradient|极光/i, "渐变"],
    [/卡片|card/i, "卡片化"],
    [/轻阴影|低阴影|shadow/i, "轻阴影"],
    [/移动|mobile/i, "移动优先"],
    [/流程|审批|节点/i, "流程化"],
    [/AI|智能|Copilot|Agent/i, "AI 工作台"],
    [/金融|资产|交易/i, "金融可信"],
  ];
  const tags = rules.flatMap(([pattern, label]) => (pattern.test(text) ? [label] : []));
  return Array.from(new Set(tags.length ? tags : ["内容优先", "轻量组件", "可落地"])).slice(0, 3);
}

function normalizeTagList(tags: string[]) {
  return tags
    .map((tag) => tag.replace(/\s*\/\s*/g, " / ").trim())
    .filter(Boolean);
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
