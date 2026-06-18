import type { CSSProperties } from "react";
import { applyTheme, type NormalizedStyle } from "@/lib/style-theme";
import { getStyleCoverVariant, type StyleCoverVariant } from "@/components/style-showroom-cover";
import {
  hasMainstreamCaseCover,
  MainstreamStyleCaseCover,
} from "@/components/mainstream-style-case-cover";

export type EnterpriseCoverVariant =
  | "saas-dashboard"
  | "saas-clean"
  | "enterprise-table"
  | "mobile-workbench"
  | "ai-workspace"
  | "ai-copilot"
  | "dark-command"
  | "dark-dashboard"
  | "glass-premium"
  | "healthcare-report"
  | "medical-health"
  | "finance-trust"
  | "ecommerce-growth"
  | "local-service"
  | "gradient-aurora"
  | "dark-command-center"
  | "glow-ai-workspace"
  | "linear-system"
  | "linear-enterprise"
  | "web3-console"
  | "glass-aurora";

type EnterpriseStyleCoverProps = {
  style: NormalizedStyle;
  variant?: EnterpriseCoverVariant;
};

export const enterpriseCoverTokens = {
  coverBackground: "#f7f9fc",
  cardShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
  borderRadius: "24px",
  accentColor: "var(--color-primary)",
  density: "comfortable",
  tagStyle: "soft-neutral",
  buttonStyle: "solid-accent",
} as const;

export const enterpriseStyleCoverMap: {
  variant: EnterpriseCoverVariant;
  status: "approved";
  approvedStyleIds: string[];
  sampleStyleId: string;
  applicableScenarios: string[];
  futureReuseKeywords: string[];
}[] = [
  {
    variant: "saas-dashboard",
    status: "approved",
    approvedStyleIds: ["style-001-modern-saas-clean"],
    sampleStyleId: "style-001-modern-saas-clean",
    applicableScenarios: ["SaaS 后台", "客户运营", "轻量管理系统"],
    futureReuseKeywords: ["saas", "minimal", "clean", "admin", "运营", "客户"],
  },
  {
    variant: "saas-clean",
    status: "approved",
    approvedStyleIds: [
      "style-001-modern-saas-clean",
      "style-006-atlassian-teamwork",
      "style-029-white-label-multitenant",
    ],
    sampleStyleId: "style-001-modern-saas-clean",
    applicableScenarios: ["SaaS 后台", "客户运营", "轻量管理系统"],
    futureReuseKeywords: ["saas", "minimal", "clean", "admin", "运营", "客户"],
  },
  {
    variant: "enterprise-table",
    status: "approved",
    approvedStyleIds: [
      "style-002-enterprise-classic-table",
      "style-004-carbon-data-enterprise",
      "style-005-crm-salesforce-lightning",
      "style-007-sap-process-enterprise",
    ],
    sampleStyleId: "style-002-enterprise-classic-table",
    applicableScenarios: ["ERP / CRM", "高密度表格", "流程管理", "主数据管理"],
    futureReuseKeywords: ["table", "enterprise", "erp", "crm", "carbon", "流程", "表格"],
  },
  {
    variant: "mobile-workbench",
    status: "approved",
    approvedStyleIds: [
      "style-009-material-cross-platform",
      "style-010-apple-premium-mobile",
      "style-030-mobile-first-enterprise",
    ],
    sampleStyleId: "style-030-mobile-first-enterprise",
    applicableScenarios: ["移动办公", "审批待办", "客户跟进", "商家移动管理"],
    futureReuseKeywords: ["mobile", "app", "workbench", "移动", "轻办公", "审批", "商家"],
  },
  {
    variant: "ai-workspace",
    status: "approved",
    approvedStyleIds: [
      "style-021-ai-copilot-workspace",
      "style-advanced-glow-ai-blue-purple-001",
    ],
    sampleStyleId: "style-021-ai-copilot-workspace",
    applicableScenarios: ["AI 助手", "知识工作台", "智能推荐", "Agent 工作台"],
    futureReuseKeywords: ["ai", "copilot", "assistant", "agent", "助手", "智能", "微光"],
  },
  {
    variant: "ai-copilot",
    status: "approved",
    approvedStyleIds: [
      "style-003-fluent-office-collab",
      "style-021-ai-copilot-workspace",
    ],
    sampleStyleId: "style-021-ai-copilot-workspace",
    applicableScenarios: ["AI 助手", "知识工作台", "学习平台", "智能推荐"],
    futureReuseKeywords: ["ai", "copilot", "assistant", "agent", "教育", "学习", "知识"],
  },
  {
    variant: "dark-command",
    status: "approved",
    approvedStyleIds: [
      "style-024-dark-dataviz-dashboard",
      "style-advanced-dark-space-command-001",
      "style-advanced-dark-ops-monitor-001",
      "style-advanced-dark-saas-pro-001",
    ],
    sampleStyleId: "style-advanced-dark-space-command-001",
    applicableScenarios: ["深色大屏", "指挥中心", "运维监控", "暗色 SaaS"],
    futureReuseKeywords: ["dark", "dashboard", "command", "monitor", "暗色", "指挥", "运维"],
  },
  {
    variant: "dark-dashboard",
    status: "approved",
    approvedStyleIds: ["style-024-dark-dataviz-dashboard"],
    sampleStyleId: "style-024-dark-dataviz-dashboard",
    applicableScenarios: ["数据大屏", "监控中心", "指挥中心", "实时运营"],
    futureReuseKeywords: ["dark", "dashboard", "dataviz", "大屏", "监控", "指挥", "soc"],
  },
  {
    variant: "glass-premium",
    status: "approved",
    approvedStyleIds: ["style_liquid_glass_aqua"],
    sampleStyleId: "style_liquid_glass_aqua",
    applicableScenarios: ["高端工具", "智能分析", "轻奢产品", "未来感工作台"],
    futureReuseKeywords: ["glass", "liquid", "premium", "luxury", "高端", "轻奢", "未来"],
  },
  {
    variant: "healthcare-report",
    status: "approved",
    approvedStyleIds: ["style_medical_clean_azure"],
    sampleStyleId: "style_medical_clean_azure",
    applicableScenarios: ["医疗健康", "检测报告", "风险标签", "患者服务"],
    futureReuseKeywords: ["medical", "health", "医疗", "健康", "报告", "风险"],
  },
  {
    variant: "medical-health",
    status: "approved",
    approvedStyleIds: [],
    sampleStyleId: "style-013-healthcare-clean",
    applicableScenarios: ["医疗健康", "检测报告", "患者服务", "健康管理"],
    futureReuseKeywords: ["medical", "health", "医疗", "健康", "报告", "患者", "检测"],
  },
  {
    variant: "finance-trust",
    status: "approved",
    approvedStyleIds: ["style-011-fintech-trust"],
    sampleStyleId: "style-011-fintech-trust",
    applicableScenarios: ["金融账户", "资产管理", "风控提醒", "交易系统"],
    futureReuseKeywords: ["finance", "fintech", "trust", "金融", "资产", "风控", "交易", "账户"],
  },
  {
    variant: "ecommerce-growth",
    status: "approved",
    approvedStyleIds: ["style-008-polars-merchant-ops"],
    sampleStyleId: "style-008-polars-merchant-ops",
    applicableScenarios: ["商家后台", "订单增长", "商品运营", "营销活动"],
    futureReuseKeywords: ["commerce", "ecommerce", "merchant", "电商", "商家", "订单", "商品", "增长"],
  },
  {
    variant: "local-service",
    status: "approved",
    approvedStyleIds: [],
    sampleStyleId: "style_local_life_meituan_yellow",
    applicableScenarios: ["本地生活", "门店经营", "预约服务", "到店履约"],
    futureReuseKeywords: ["local", "service", "life", "本地生活", "门店", "预约", "到店", "服务"],
  },
  {
    variant: "gradient-aurora",
    status: "approved",
    approvedStyleIds: ["style-advanced-gradient-aurora-001"],
    sampleStyleId: "style-advanced-gradient-aurora-001",
    applicableScenarios: ["高级渐变", "AI SaaS", "数据分析", "智能工作台"],
    futureReuseKeywords: ["advanced-gradient", "gradient", "aurora", "渐变", "极光", "流体"],
  },
  {
    variant: "dark-command-center",
    status: "approved",
    approvedStyleIds: ["style-advanced-dark-space-command-001"],
    sampleStyleId: "style-advanced-dark-space-command-001",
    applicableScenarios: ["深色控制台", "指挥中心", "运维监控", "实时大屏"],
    futureReuseKeywords: ["advanced-dark", "command", "terminal", "暗色", "指挥", "监控"],
  },
  {
    variant: "glow-ai-workspace",
    status: "approved",
    approvedStyleIds: ["style-advanced-glow-ai-blue-purple-001"],
    sampleStyleId: "style-advanced-glow-ai-blue-purple-001",
    applicableScenarios: ["微光 AI", "智能助手", "知识库", "数据洞察"],
    futureReuseKeywords: ["advanced-glow", "glow", "微光", "光效", "洞察"],
  },
  {
    variant: "linear-system",
    status: "approved",
    approvedStyleIds: ["style-advanced-linear-blue-white-001"],
    sampleStyleId: "style-advanced-linear-blue-white-001",
    applicableScenarios: ["Linear 专业", "工作流列表", "研发工具", "轻后台"],
    futureReuseKeywords: ["advanced-linear", "linear", "线性", "1px", "工作流"],
  },
  {
    variant: "linear-enterprise",
    status: "approved",
    approvedStyleIds: ["style-advanced-linear-blue-white-001"],
    sampleStyleId: "style-advanced-linear-blue-white-001",
    applicableScenarios: ["Linear 专业", "ERP / CRM", "高密度表格", "标准后台"],
    futureReuseKeywords: ["advanced-linear", "linear", "线性", "1px", "分割线"],
  },
  {
    variant: "web3-console",
    status: "approved",
    approvedStyleIds: ["style-advanced-web3-wallet-console-001"],
    sampleStyleId: "style-advanced-web3-wallet-console-001",
    applicableScenarios: ["Web3 控制台", "钱包资产", "链上数据", "交易终端"],
    futureReuseKeywords: ["advanced-web3", "web3", "crypto", "wallet", "链上", "钱包"],
  },
  {
    variant: "glass-aurora",
    status: "approved",
    approvedStyleIds: ["style-advanced-glass-liquid-enterprise-001"],
    sampleStyleId: "style-advanced-glass-liquid-enterprise-001",
    applicableScenarios: ["玻璃拟态", "Aurora", "高端 SaaS", "未来工作台"],
    futureReuseKeywords: ["advanced-glass", "glass", "aurora", "玻璃", "极光", "空间"],
  },
];

export const v2CoverStyleIds = new Set(
  enterpriseStyleCoverMap.flatMap((item) => item.approvedStyleIds),
);

export const styleCoverMap = enterpriseStyleCoverMap;

export function shouldUseEnterpriseCover(style: NormalizedStyle) {
  return Boolean(style.id);
}

export function mapToEnterpriseCoverVariant(style: NormalizedStyle): EnterpriseCoverVariant {
  const semanticVariant = mapToSemanticCoverVariant(style);
  if (semanticVariant) return semanticVariant;

  const explicitVariant = normalizeEnterpriseCoverVariant(style.source.coverVariant);
  if (explicitVariant) return explicitVariant;

  const approved = enterpriseStyleCoverMap.find((item) => item.approvedStyleIds.includes(style.id));
  if (approved) return approved.variant;

  const legacyVariant = getStyleCoverVariant(style);
  if (legacyVariant === "dark-dashboard-showroom") return "dark-dashboard";
  if (legacyVariant === "glass-enterprise-showroom") return "glass-premium";
  if (legacyVariant === "medical-health-showroom") return "medical-health";
  if (legacyVariant === "finance-trust-showroom") return "finance-trust";
  if (legacyVariant === "ecommerce-growth-showroom") return "ecommerce-growth";
  if (legacyVariant === "local-service-showroom") return "local-service";
  if (legacyVariant === "enterprise-table-showroom") return "enterprise-table";
  if (legacyVariant === "mobile-workbench-showroom") return "mobile-workbench";
  if (legacyVariant === "ai-copilot-showroom") return "ai-copilot";
  return "saas-clean";
}

function mapToSemanticCoverVariant(style: NormalizedStyle): EnterpriseCoverVariant | null {
  const mainId = style.source.parentStyleId ?? style.id;
  const text = [
    mainId,
    style.id,
    style.name,
    style.source.styleFamily,
    style.source.visualMechanism,
    style.source.layoutMechanism,
    style.source.componentMechanism,
    style.source.duplicateGroupId,
    style.source.category,
    style.source.coverVariant,
    style.mood.join(" "),
    style.colorPreference,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const mainVariantMap: Record<string, EnterpriseCoverVariant> = {
    "style-001-modern-saas-clean": "saas-dashboard",
    "style-002-enterprise-classic-table": "enterprise-table",
    "style-004-carbon-data-enterprise": "enterprise-table",
    "style-007-sap-process-enterprise": "enterprise-table",
    "style-021-ai-copilot-workspace": "ai-workspace",
    "style-advanced-glow-ai-blue-purple-001": "ai-workspace",
    "style-advanced-gradient-cyan-fluid-001": "ai-workspace",
    "style-027-developer-console-api": "linear-system",
    "style-024-dark-dataviz-dashboard": "dark-command",
    "style-advanced-dark-space-command-001": "dark-command",
    "style-advanced-dark-ops-monitor-001": "dark-command",
    "style-advanced-dark-saas-pro-001": "dark-command",
    "style-advanced-glass-liquid-enterprise-001": "glass-aurora",
    "style-advanced-gradient-aurora-001": "glass-aurora",
    "style_luxury_editorial_black_gold": "finance-trust",
    "style-advanced-gradient-glacier-blue-001": "saas-dashboard",
    "style-030-mobile-first-enterprise": "mobile-workbench",
    "style_medical_clean_azure": "healthcare-report",
    "style-011-fintech-trust": "finance-trust",
    "style_local_life_meituan_yellow": "mobile-workbench",
    "style-008-polars-merchant-ops": "ecommerce-growth",
    "style-014-education-learning": "saas-dashboard",
    "style-advanced-linear-blue-white-001": "linear-system",
    "style-advanced-web3-wallet-console-001": "web3-console",
  };

  if (mainVariantMap[mainId]) return mainVariantMap[mainId];
  if (has(text, ["web3", "crypto", "钱包", "链上"])) return "web3-console";
  if (has(text, ["finance", "金融", "资产", "交易", "black-gold", "黑金"])) return "finance-trust";
  if (has(text, ["medical", "health", "医疗", "健康", "报告"])) return "healthcare-report";
  if (has(text, ["commerce", "merchant", "ecommerce", "电商", "商家", "订单", "增长"])) return "ecommerce-growth";
  if (has(text, ["mobile", "移动", "本地生活", "门店", "预约", "到店"])) return "mobile-workbench";
  if (has(text, ["linear", "线性", "1px", "developer", "api", "开发者"])) return "linear-system";
  if (has(text, ["dark", "暗色", "大屏", "command", "指挥", "运维", "监控"])) return "dark-command";
  if (has(text, ["ai", "copilot", "agent", "智能", "微光", "科技"])) return "ai-workspace";
  if (has(text, ["glass", "aurora", "gradient", "玻璃", "极光", "渐变"])) return "glass-aurora";
  if (has(text, ["table", "carbon", "erp", "流程", "表格", "数据密集"])) return "enterprise-table";
  if (has(text, ["saas", "极简", "教育", "学习"])) return "saas-dashboard";
  return null;
}

function normalizeEnterpriseCoverVariant(value: unknown): EnterpriseCoverVariant | null {
  if (!isEnterpriseCoverVariant(value)) return null;
  if (value === "saas-clean") return "saas-dashboard";
  if (value === "ai-copilot" || value === "glow-ai-workspace") return "ai-workspace";
  if (value === "dark-dashboard" || value === "dark-command-center") return "dark-command";
  if (value === "glass-premium" || value === "gradient-aurora") return "glass-aurora";
  if (value === "medical-health") return "healthcare-report";
  if (value === "linear-enterprise") return "linear-system";
  if (value === "local-service") return "mobile-workbench";
  return value;
}

function isEnterpriseCoverVariant(value: unknown): value is EnterpriseCoverVariant {
  return (
    typeof value === "string" &&
    enterpriseStyleCoverMap.some((item) => item.variant === value)
  );
}

export function EnterpriseStyleCover({ style, variant = mapToEnterpriseCoverVariant(style) }: EnterpriseStyleCoverProps) {
  const vars = applyTheme(style) as CSSProperties;
  const useMainstreamCaseCover = hasMainstreamCaseCover(style);

  return (
    <div className="enterprise-style-cover" data-enterprise-variant={variant} style={vars}>
      {useMainstreamCaseCover ? (
        <MainstreamStyleCaseCover style={style} />
      ) : (
        <>
          {variant === "enterprise-table" ? <EnterpriseTableCover style={style} /> : null}
          {variant === "mobile-workbench" ? <MobileWorkbenchCover /> : null}
          {variant === "ai-workspace" ? <AiWorkspaceCover style={style} /> : null}
          {variant === "ai-copilot" ? <AiCopilotCover style={style} /> : null}
          {variant === "dark-command" ? <DarkCommandCover style={style} /> : null}
          {variant === "dark-dashboard" ? <DarkDashboardCover /> : null}
          {variant === "glass-premium" ? <GlassPremiumCover /> : null}
          {variant === "healthcare-report" ? <HealthcareReportCover /> : null}
          {variant === "medical-health" ? <MedicalHealthCover /> : null}
          {variant === "finance-trust" ? <FinanceTrustCover /> : null}
          {variant === "ecommerce-growth" ? <EcommerceGrowthCover /> : null}
          {variant === "local-service" ? <LocalServiceCover /> : null}
          {variant === "gradient-aurora" ? <GradientAuroraCover style={style} /> : null}
          {variant === "dark-command-center" ? <DarkCommandCenterCover style={style} /> : null}
          {variant === "glow-ai-workspace" ? <GlowAiWorkspaceCover style={style} /> : null}
          {variant === "linear-system" ? <LinearSystemCover style={style} /> : null}
          {variant === "linear-enterprise" ? <LinearEnterpriseCover style={style} /> : null}
          {variant === "web3-console" ? <Web3ConsoleCover style={style} /> : null}
          {variant === "glass-aurora" ? <GlassAuroraCover style={style} /> : null}
          {variant === "saas-dashboard" ? <SaasDashboardCover style={style} /> : null}
          {variant === "saas-clean" ? <SaasCleanCover style={style} /> : null}
        </>
      )}
    </div>
  );
}

export function legacyToEnterpriseVariant(variant: StyleCoverVariant): EnterpriseCoverVariant | "deprecated" {
  if (variant === "saas-clean-showroom") return "saas-clean";
  if (variant === "enterprise-table-showroom") return "enterprise-table";
  if (variant === "mobile-workbench-showroom") return "mobile-workbench";
  if (variant === "ai-copilot-showroom") return "ai-copilot";
  if (variant === "dark-dashboard-showroom") return "dark-dashboard";
  if (variant === "glass-enterprise-showroom") return "glass-premium";
  if (variant === "medical-health-showroom") return "medical-health";
  if (variant === "finance-trust-showroom") return "finance-trust";
  if (variant === "ecommerce-growth-showroom") return "ecommerce-growth";
  if (variant === "local-service-showroom") return "local-service";
  return "deprecated";
}

function styleText(style: NormalizedStyle) {
  return [
    style.id,
    style.name,
    style.slogan,
    style.description,
    style.moodTheme,
    style.endpoint,
    style.colorPreference,
    ...style.mood,
    ...style.colorFamily,
    ...style.suitableFor,
    ...style.visualSignature,
    ...(style.source.tags ?? []),
    style.source.category,
    style.source.visual,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function styleHas(style: NormalizedStyle, keywords: string[]) {
  const text = styleText(style);
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function has(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function SaasDashboardCover({ style }: { style: NormalizedStyle }) {
  return <SaasCleanCover style={style} />;
}

function AiWorkspaceCover({ style }: { style: NormalizedStyle }) {
  return <GlowAiWorkspaceCover style={style} />;
}

function DarkCommandCover({ style }: { style: NormalizedStyle }) {
  return <DarkCommandCenterCover style={style} />;
}

function HealthcareReportCover() {
  return <MedicalHealthCover />;
}

function LinearSystemCover({ style }: { style: NormalizedStyle }) {
  return (
    <div className="enterprise-cover-scene linear-system-v2">
      <header className="v2-linear-head">
        <div>
          <span>Linear System</span>
          <strong>{styleHas(style, ["developer", "api", "开发者"]) ? "开发者工作流" : "产品交付工作流"}</strong>
        </div>
        <b>清晰</b>
      </header>
      <div className="v2-linear-layout">
        <section className="v2-linear-list">
          {[
            ["需求确认", "进行中", "P1"],
            ["接口联调", "待处理", "P0"],
            ["设计走查", "已完成", "P2"],
            ["发布检查", "排期中", "P1"],
          ].map((item) => (
            <p key={item[0]}>
              <span>{item[0]}</span>
              <b>{item[1]}</b>
              <i>{item[2]}</i>
            </p>
          ))}
        </section>
        <aside className="v2-linear-panel">
          <span>状态概览</span>
          <Metric label="开放任务" value="24" />
          <Metric label="本周完成" value="18" />
        </aside>
      </div>
    </div>
  );
}

function GradientAuroraCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["sunrise", "growth", "orange", "日出", "橙金", "增长"])) {
    return (
      <div className="enterprise-cover-scene ecommerce-growth-v2 v2-gradient-growth">
        <header className="v2-commerce-head">
          <div>
            <span>增长实验室</span>
            <strong>活动转化看板</strong>
          </div>
          <b>提升 18%</b>
        </header>
        <div className="v2-commerce-grid">
          <section className="v2-commerce-metrics">
            <Metric label="新增线索" value="2,436" />
            <Metric label="转化率" value="14.8%" />
          </section>
          <section className="v2-product-card">
            <span>推荐动作</span>
            <strong>加推会员券</strong>
            <p>覆盖高意向用户 8,420 人</p>
          </section>
          <section className="v2-commerce-chart">
            <span>增长趋势</span>
            <MiniLine />
          </section>
        </div>
      </div>
    );
  }

  if (styleHas(style, ["forest", "oxygen", "health", "森林", "绿氧", "医疗", "健康"])) {
    return <MedicalHealthCover />;
  }

  if (styleHas(style, ["glacier", "blue", "冰川", "专业"])) {
    return <SaasCleanCover style={style} />;
  }

  return (
    <div className="enterprise-cover-scene glass-premium-v2">
      <section className="v2-glass-workspace">
        <div className="v2-glass-title">
          <span>AI SaaS · Aurora</span>
          <strong>智能增长工作台</strong>
        </div>
        <div className="v2-glass-metrics">
          <Metric label="活跃项目" value="128" />
          <Metric label="AI 洞察" value="24" />
          <Metric label="转化提升" value="+18%" />
        </div>
        <div className="v2-glass-grid">
          <section className="v2-glass-card">
            <span>极光趋势</span>
            <MiniLine />
          </section>
          <section className="v2-glass-card">
            <span>智能建议</span>
            <p>优先跟进高意向客户，并生成本周运营摘要。</p>
          </section>
        </div>
      </section>
    </div>
  );
}

function DarkCommandCenterCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["finance", "black-gold", "金融", "黑金"])) {
    return <FinanceTrustCover />;
  }

  if (styleHas(style, ["medical", "imaging", "医疗", "影像"])) {
    return (
      <div className="enterprise-cover-scene dark-dashboard-v2 v2-dark-medical">
        <header className="v2-dark-header">
          <div>
            <span>Medical Imaging</span>
            <strong>影像质控中心</strong>
          </div>
          <b>稳定</b>
        </header>
        <div className="v2-dark-kpis">
          <Metric label="今日检查" value="286" />
          <Metric label="待诊断" value="18" />
          <Metric label="准确率" value="96.8%" />
        </div>
        <div className="v2-dark-grid">
          <section className="v2-dark-panel">
            <span>影像队列</span>
            <MiniLine />
          </section>
          <section className="v2-dark-panel v2-alert-list">
            <strong>复核提醒</strong>
            {["胸部 CT 待复核", "MRI 报告已生成", "异常指标已标注"].map((item, index) => (
              <p key={item}><span>{item}</span><b>{index === 0 ? "待复核" : "完成"}</b></p>
            ))}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="enterprise-cover-scene dark-dashboard-v2">
      <header className="v2-dark-header">
        <div>
          <span>Command Center</span>
          <strong>深空指挥中心</strong>
        </div>
        <b>Live</b>
      </header>
      <div className="v2-dark-kpis">
        <Metric label="在线节点" value="18,420" />
        <Metric label="风险预警" value="4" />
        <Metric label="处置率" value="98.2%" />
      </div>
      <div className="v2-dark-grid">
        <section className="v2-dark-panel">
          <span>链路吞吐</span>
          <MiniLine />
        </section>
        <section className="v2-dark-panel v2-alert-list">
          <strong>事件队列</strong>
          {["华东链路延迟", "自动扩容完成", "告警已分派"].map((item, index) => (
            <p key={item}><span>{item}</span><b>{index === 0 ? "高" : "中"}</b></p>
          ))}
        </section>
      </div>
    </div>
  );
}

function GlowAiWorkspaceCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["knowledge", "学习", "教育", "course", "learning"])) {
    return (
      <div className="enterprise-cover-scene ai-copilot-v2 v2-learning-ai">
        <aside className="v2-ai-side">
          <strong>课程</strong>
          <span>学习计划</span>
          <span>知识测验</span>
          <span>错题复盘</span>
        </aside>
        <main className="v2-ai-main">
          <div className="v2-ai-answer">
            <span>AI 学习助手</span>
            <strong>已生成本周学习路径</strong>
            <p>根据测评结果，优先补齐数据分析与产品协作模块。</p>
          </div>
          <div className="v2-ai-input">输入学习目标，生成训练计划</div>
        </main>
        <section className="v2-ai-knowledge">
          <strong>知识卡片</strong>
          <span>课程笔记</span>
          <span>练习记录</span>
        </section>
      </div>
    );
  }

  return (
    <div className="enterprise-cover-scene ai-copilot-v2">
      <aside className="v2-ai-side">
        <strong>Prompt</strong>
        <span>客户摘要</span>
        <span>数据洞察</span>
        <span>风险解释</span>
      </aside>
      <main className="v2-ai-main">
        <div className="v2-ai-answer">
          <span>AI 微光工作台</span>
          <strong>已生成 5 条运营建议</strong>
          <p>结合 CRM 与订单数据，识别出 3 个增长机会。</p>
        </div>
        <div className="v2-ai-input">输入需求，生成下一步行动</div>
      </main>
      <section className="v2-ai-knowledge">
        <strong>知识源</strong>
        <span>业务指标</span>
        <span>历史案例</span>
      </section>
    </div>
  );
}

function LinearEnterpriseCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["mobile", "app", "移动"])) {
    return <MobileWorkbenchCover />;
  }

  return (
    <div className="enterprise-cover-scene enterprise-table-v2">
      <div className="v2-table-toolbar">
        <span>业务对象</span>
        <span>状态</span>
        <span>更新时间</span>
        <button type="button">筛选</button>
      </div>
      <div className="v2-data-table">
        {["项目", "阶段", "负责人", "进度", "状态"].map((item) => <b key={item}>{item}</b>)}
        {[
          ["客户续约", "报价", "李经理", "76%", "进行中"],
          ["权限审核", "复核", "周主管", "52%", "待处理"],
          ["订单同步", "完成", "王敏", "100%", "已完成"],
          ["数据治理", "排期", "陈宁", "33%", "低风险"],
        ].flatMap((row) => row.map((cell, index) => (
          <span key={`${row[0]}-${cell}`} className={index === 4 ? "v2-status" : ""}>{cell}</span>
        )))}
      </div>
    </div>
  );
}

function Web3ConsoleCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["dao", "governance", "治理"])) {
    return (
      <div className="enterprise-cover-scene dark-dashboard-v2 v2-web3-governance">
        <header className="v2-dark-header">
          <div>
            <span>DAO Console</span>
            <strong>治理投票中心</strong>
          </div>
          <b>投票中</b>
        </header>
        <div className="v2-dark-kpis">
          <Metric label="提案数量" value="42" />
          <Metric label="参与地址" value="8.2K" />
          <Metric label="通过率" value="74%" />
        </div>
        <div className="v2-dark-grid">
          <section className="v2-dark-panel">
            <span>投票趋势</span>
            <MiniLine />
          </section>
          <section className="v2-dark-panel v2-alert-list">
            <strong>提案队列</strong>
            {["金库预算调整", "节点奖励更新", "社区活动拨款"].map((item) => (
              <p key={item}><span>{item}</span><b>投票</b></p>
            ))}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="enterprise-cover-scene dark-dashboard-v2">
      <header className="v2-dark-header">
        <div>
          <span>Web3 Console</span>
          <strong>钱包资产控制台</strong>
        </div>
        <b>已连接</b>
      </header>
      <div className="v2-dark-kpis">
        <Metric label="总资产" value="$82.4K" />
        <Metric label="链上活动" value="326" />
        <Metric label="风险地址" value="4" />
      </div>
      <div className="v2-dark-grid">
        <section className="v2-dark-panel">
          <span>资产趋势</span>
          <MiniLine />
        </section>
        <section className="v2-dark-panel v2-alert-list">
          <strong>链上事件</strong>
          {["Swap 已确认", "治理投票进行中", "凭证即将过期"].map((item, index) => (
            <p key={item}><span>{item}</span><b>{index === 1 ? "投票" : "完成"}</b></p>
          ))}
        </section>
      </div>
    </div>
  );
}

function GlassAuroraCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["white", "minimal", "极简", "白"])) {
    return <SaasCleanCover style={style} />;
  }

  return (
    <div className="enterprise-cover-scene glass-premium-v2">
      <section className="v2-glass-workspace">
        <div className="v2-glass-title">
          <span>Glass Aurora</span>
          <strong>未来分析工作台</strong>
        </div>
        <div className="v2-glass-metrics">
          <Metric label="智能任务" value="32" />
          <Metric label="数据质量" value="96%" />
          <Metric label="待确认" value="8" />
        </div>
        <div className="v2-glass-grid">
          <section className="v2-glass-card">
            <span>空间面板</span>
            <MiniLine />
          </section>
          <section className="v2-glass-card">
            <span>协作摘要</span>
            <p>团队已完成 12 个节点校验，建议同步到移动端。</p>
          </section>
        </div>
      </section>
    </div>
  );
}

function SaasCleanCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["atlassian", "teamwork", "kanban", "项目", "协作", "issue"])) {
    return (
      <div className="enterprise-cover-scene saas-clean-v2 v2-teamwork-cover">
        <section className="v2-saas-shell">
          <div className="v2-cover-topbar">
            <strong>项目协作空间</strong>
            <button type="button">新建任务</button>
          </div>
          <div className="v2-kanban-board">
            {[
              ["待处理", "移动端审批优化", "权限字段确认"],
              ["进行中", "客户跟进看板", "消息中心联调"],
              ["已完成", "筛选体验升级", "组件状态补齐"],
            ].map((column) => (
              <section key={column[0]}>
                <strong>{column[0]}</strong>
                <span>{column[1]}</span>
                <span>{column[2]}</span>
              </section>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (styleHas(style, ["white-label", "tenant", "theme", "brand", "白标", "多租户", "换肤"])) {
    return (
      <div className="enterprise-cover-scene saas-clean-v2 v2-theme-config-cover">
        <section className="v2-saas-shell">
          <div className="v2-cover-topbar">
            <strong>品牌主题配置</strong>
            <button type="button">发布主题</button>
          </div>
          <div className="v2-theme-config-grid">
            <section>
              <b>主品牌</b>
              <span style={{ background: "var(--color-primary)" }} />
              <span style={{ background: "var(--color-secondary)" }} />
              <span style={{ background: "var(--color-accent)" }} />
            </section>
            <section>
              <b>租户预览</b>
              <p>企业 A · 浅色</p>
              <p>企业 B · 高对比</p>
              <p>企业 C · 移动端</p>
            </section>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="enterprise-cover-scene saas-clean-v2">
      <section className="v2-saas-shell">
        <div className="v2-cover-topbar">
          <strong>客户运营</strong>
          <button type="button">新建客户</button>
        </div>
        <div className="v2-kpi-row">
          <Metric label="活跃客户" value="2,846" />
          <Metric label="待跟进" value="128" />
          <Metric label="续约率" value="86%" />
        </div>
        <div className="v2-saas-grid">
          <div className="v2-panel v2-chart-panel">
            <span>本月成交</span>
            <strong>¥128,430</strong>
            <MiniLine />
          </div>
          <div className="v2-panel v2-list-panel">
            {["星河科技", "云启软件", "蓝海集团"].map((item, index) => (
              <p key={item}>
                <b>{item}</b>
                <span>{index === 0 ? "高优先级" : index === 1 ? "进行中" : "待处理"}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EnterpriseTableCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["carbon", "ibm", "cloud", "data", "数据密集", "云平台"])) {
    return <CarbonDataCover />;
  }

  if (styleHas(style, ["crm", "sales", "pipeline", "销售", "商机"])) {
    return <CrmPipelineCover />;
  }

  if (styleHas(style, ["process", "sap", "workflow", "流程", "erp"])) {
    return <ProcessEnterpriseCover />;
  }

  if (styleHas(style, ["risk", "compliance", "audit", "合规", "审计", "风控"])) {
    return <AuditComplianceCover />;
  }

  return (
    <div className="enterprise-cover-scene enterprise-table-v2">
      <div className="v2-table-toolbar">
        <span>客户名称</span>
        <span>负责人</span>
        <span>阶段</span>
        <button type="button">查询</button>
      </div>
      <div className="v2-data-table">
        {["客户名称", "阶段", "负责人", "最近跟进", "状态"].map((item) => (
          <b key={item}>{item}</b>
        ))}
        {[
          ["星河科技", "续约沟通", "李经理", "今天", "高优先级"],
          ["云启软件", "方案确认", "周主管", "昨天", "进行中"],
          ["蓝海集团", "合同审批", "王敏", "周二", "待处理"],
          ["远洲制造", "报价复核", "陈宁", "周一", "已完成"],
        ].flatMap((row) =>
          row.map((cell, index) => (
            <span key={`${row[0]}-${cell}`} className={index === 4 ? "v2-status" : ""}>
              {cell}
            </span>
          )),
        )}
      </div>
    </div>
  );
}

function CarbonDataCover() {
  return (
    <div className="enterprise-cover-scene carbon-data-v2">
      <div className="v2-carbon-topline">
        <strong>云资源管理</strong>
        <span>高密度 · 配置 · 监控</span>
      </div>
      <div className="v2-carbon-layout">
        <section className="v2-carbon-table">
          {["资源 ID", "区域", "CPU", "内存", "状态"].map((item) => <b key={item}>{item}</b>)}
          {[
            ["ecs-prod-01", "华东", "72%", "64%", "运行中"],
            ["db-core-09", "华北", "58%", "82%", "告警"],
            ["cache-12", "华南", "31%", "45%", "正常"],
          ].flatMap((row) => row.map((cell, index) => (
            <span key={`${row[0]}-${cell}`} className={index === 4 ? "v2-status" : ""}>{cell}</span>
          )))}
        </section>
        <aside className="v2-carbon-inspector">
          <span>资源详情</span>
          <strong>db-core-09</strong>
          <p>连接数 1,284</p>
          <p>备份状态 正常</p>
          <p>风险等级 中</p>
        </aside>
      </div>
    </div>
  );
}

function CrmPipelineCover() {
  return (
    <div className="enterprise-cover-scene crm-pipeline-v2">
      <div className="v2-cover-topbar">
        <strong>销售机会管线</strong>
        <button type="button">新增商机</button>
      </div>
      <div className="v2-pipeline-board">
        {[
          ["初步沟通", "星河科技", "¥86,000"],
          ["方案确认", "云启软件", "¥128,000"],
          ["合同审批", "蓝海集团", "¥240,000"],
        ].map((item) => (
          <section key={item[0]}>
            <span>{item[0]}</span>
            <strong>{item[1]}</strong>
            <b>{item[2]}</b>
          </section>
        ))}
      </div>
      <div className="v2-crm-footer">
        <Metric label="本月成交" value="¥428K" />
        <Metric label="续约率" value="86%" />
      </div>
    </div>
  );
}

function ProcessEnterpriseCover() {
  return (
    <div className="enterprise-cover-scene process-enterprise-v2">
      <div className="v2-cover-topbar">
        <strong>采购审批流程</strong>
        <button type="button">发起流程</button>
      </div>
      <div className="v2-process-flow">
        {["申请", "部门审批", "财务复核", "归档"].map((item, index) => (
          <span key={item} className={index < 2 ? "done" : ""}>{item}</span>
        ))}
      </div>
      <div className="v2-process-grid">
        <Metric label="待审批" value="42" />
        <Metric label="超时预警" value="6" />
        <section>
          <strong>当前节点</strong>
          <p>财务复核 · 周主管</p>
          <p>预计今日 18:00 完成</p>
        </section>
      </div>
    </div>
  );
}

function AuditComplianceCover() {
  return (
    <div className="enterprise-cover-scene audit-compliance-v2">
      <div className="v2-carbon-topline">
        <strong>合规审计台账</strong>
        <span>留痕 · 复核 · 风险</span>
      </div>
      <div className="v2-audit-list">
        {[
          ["权限变更", "待复核", "高"],
          ["合同导出", "已记录", "中"],
          ["数据访问", "通过", "低"],
          ["审批撤回", "待确认", "中"],
        ].map((item) => (
          <p key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span><b>{item[2]}</b></p>
        ))}
      </div>
    </div>
  );
}

function MobileWorkbenchCover() {
  return (
    <div className="enterprise-cover-scene mobile-workbench-v2">
      <div className="v2-phone">
        <div className="v2-phone-status">
          <span>9:41</span>
          <span>100%</span>
        </div>
        <div className="v2-phone-title">
          <strong>上午好，李经理</strong>
          <span>今天有 12 项待办</span>
        </div>
        <div className="v2-phone-hero">
          <span>今日会议</span>
          <strong>3 场</strong>
        </div>
        <div className="v2-phone-metrics">
          <Metric label="待审批" value="4" />
          <Metric label="客户跟进" value="8" />
        </div>
        <div className="v2-phone-actions">
          {["审批", "客户", "消息", "任务"].map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="v2-phone-list">
          {["华东区客户续约待确认", "Q2 运营报表已生成"].map((item) => <p key={item}>{item}</p>)}
        </div>
        <div className="v2-phone-tabs">
          {["首页", "工作台", "消息", "我的"].map((item, index) => (
            <span key={item} className={index === 0 ? "active" : ""}>{item}</span>
          ))}
        </div>
      </div>
      <aside className="v2-sync-card">
        <span>同步提醒</span>
        <strong>待办 12</strong>
      </aside>
    </div>
  );
}

function AiCopilotCover({ style }: { style: NormalizedStyle }) {
  if (styleHas(style, ["fluent", "office", "collaboration", "办公", "协同", "productivity"])) {
    return (
      <div className="enterprise-cover-scene fluent-office-v2">
        <aside className="v2-office-rail">
          <strong>协作</strong>
          <span>日程</span>
          <span>文档</span>
          <span>任务</span>
        </aside>
        <main className="v2-office-main">
          <div className="v2-office-hero">
            <span>今日团队工作台</span>
            <strong>3 个项目需要同步</strong>
            <p>设计评审、客户纪要和周报将在今天完成流转。</p>
          </div>
          <div className="v2-office-docs">
            {["客户会议纪要", "产品需求文档", "Q2 复盘材料"].map((item) => (
              <p key={item}><span>{item}</span><b>协作中</b></p>
            ))}
          </div>
        </main>
        <section className="v2-office-activity">
          <strong>动态</strong>
          <span>王敏评论了需求</span>
          <span>李经理上传附件</span>
        </section>
      </div>
    );
  }

  return (
    <div className="enterprise-cover-scene ai-copilot-v2">
      <aside className="v2-ai-side">
        <strong>会话</strong>
        <span>销售总结</span>
        <span>续约策略</span>
        <span>周报生成</span>
      </aside>
      <main className="v2-ai-main">
        <div className="v2-ai-answer">
          <span>AI 总结</span>
          <strong>已识别 5 个高意向客户</strong>
          <p>建议优先跟进华东区续约项目，并生成报价草案。</p>
        </div>
        <div className="v2-ai-input">输入需求，让 AI 生成下一步计划</div>
      </main>
      <section className="v2-ai-knowledge">
        <strong>知识卡片</strong>
        <span>CRM 数据</span>
        <span>合同模板</span>
      </section>
    </div>
  );
}

function DarkDashboardCover() {
  return (
    <div className="enterprise-cover-scene dark-dashboard-v2">
      <header className="v2-dark-header">
        <div>
          <span>Command Center</span>
          <strong>实时运营指挥中心</strong>
        </div>
        <b>在线监控</b>
      </header>
      <div className="v2-dark-kpis">
        <Metric label="在线设备" value="12,846" />
        <Metric label="告警事件" value="24" />
        <Metric label="处置率" value="97.8%" />
      </div>
      <div className="v2-dark-grid">
        <section className="v2-dark-panel">
          <span>吞吐趋势</span>
          <MiniLine />
        </section>
        <section className="v2-dark-panel v2-alert-list">
          <strong>告警列表</strong>
          {["华东节点延迟升高", "支付通道自动切换", "库存同步队列拥塞"].map((item, index) => (
            <p key={item}>
              <span>{item}</span>
              <b>{index === 0 ? "高" : "中"}</b>
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}

function GlassPremiumCover() {
  return (
    <div className="enterprise-cover-scene glass-premium-v2">
      <section className="v2-glass-workspace">
        <div className="v2-glass-title">
          <span>智能分析工作台</span>
          <strong>智能运营分析</strong>
        </div>
        <div className="v2-glass-metrics">
          <Metric label="今日线索" value="326" />
          <Metric label="转化率" value="18.6%" />
          <Metric label="AI 建议" value="5 条" />
        </div>
        <div className="v2-glass-grid">
          <section className="v2-glass-card">
            <span>AI 摘要</span>
            <p>华东续约客户意向提升，建议优先推送报价方案。</p>
          </section>
          <section className="v2-glass-card">
            <span>趋势分析</span>
            <MiniLine />
          </section>
        </div>
      </section>
    </div>
  );
}

function MedicalHealthCover() {
  return (
    <div className="enterprise-cover-scene medical-health-v2">
      <header className="v2-health-head">
        <div>
          <span>健康报告中心</span>
          <strong>患者检测总览</strong>
        </div>
        <b>低风险</b>
      </header>
      <div className="v2-health-layout">
        <section className="v2-health-card">
          <Metric label="今日报告" value="128" />
          <Metric label="待复核" value="16" />
        </section>
        <section className="v2-report-list">
          {["血糖检测已完成", "心率趋势稳定", "体检报告待医生确认"].map((item, index) => (
            <p key={item}>
              <span>{item}</span>
              <b>{index === 2 ? "待确认" : "正常"}</b>
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}

function FinanceTrustCover() {
  return (
    <div className="enterprise-cover-scene finance-trust-v2">
      <section className="v2-finance-asset">
        <span>资产概览</span>
        <strong>¥8,642,900</strong>
        <p>风险等级：稳健</p>
      </section>
      <div className="v2-finance-layout">
        <section className="v2-finance-card">
          <span>净值趋势</span>
          <MiniLine />
        </section>
        <section className="v2-transaction-list">
          {["企业转账", "理财赎回", "风控复核"].map((item, index) => (
            <p key={item}>
              <span>{item}</span>
              <b>{index === 2 ? "提醒" : "完成"}</b>
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}

function EcommerceGrowthCover() {
  return (
    <div className="enterprise-cover-scene ecommerce-growth-v2">
      <header className="v2-commerce-head">
        <div>
          <span>商家增长中心</span>
          <strong>订单运营看板</strong>
        </div>
        <b>618 活动中</b>
      </header>
      <div className="v2-commerce-grid">
        <section className="v2-commerce-metrics">
          <Metric label="今日订单" value="326" />
          <Metric label="转化率" value="12.8%" />
        </section>
        <section className="v2-product-card">
          <span>热卖商品</span>
          <strong>轻办公背包</strong>
          <p>库存 248 · 销量 +23%</p>
        </section>
        <section className="v2-commerce-chart">
          <span>增长趋势</span>
          <MiniLine />
        </section>
      </div>
    </div>
  );
}

function LocalServiceCover() {
  return (
    <div className="enterprise-cover-scene local-service-v2">
      <section className="v2-store-card">
        <span>门店经营中心</span>
        <strong>南京西路旗舰店</strong>
        <p>今日预约 42 · 评分 4.8</p>
      </section>
      <div className="v2-local-grid">
        <section className="v2-service-grid">
          {["到店护理", "团购核销", "会员储值"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>
        <section className="v2-appointment-card">
          <strong>14:30 张女士</strong>
          <p>面部护理 · 淮海中路店</p>
          <b>已确认</b>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="v2-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniLine() {
  return (
    <div className="v2-mini-line">
      {[28, 46, 38, 64, 58, 78, 72].map((height, index) => (
        <i key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}
