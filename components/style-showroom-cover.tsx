import type { CSSProperties } from "react";
import { applyTheme, type NormalizedStyle } from "@/lib/style-theme";

// Deprecated: the style gallery now uses EnterpriseStyleCover for every card.
// This module is kept only for variant inference and legacy preview references.
export type StyleCoverVariant =
  | "saas-clean-showroom"
  | "enterprise-table-showroom"
  | "mobile-workbench-showroom"
  | "glass-enterprise-showroom"
  | "dark-dashboard-showroom"
  | "ai-copilot-showroom"
  | "medical-health-showroom"
  | "finance-trust-showroom"
  | "ecommerce-growth-showroom"
  | "local-service-showroom";

export type StyleCoverMode = "showroom" | "compare";

type StyleShowroomCoverProps = {
  style: NormalizedStyle;
  mode?: StyleCoverMode;
};

const variantLabels: Record<StyleCoverVariant, string> = {
  "saas-clean-showroom": "SaaS 极简",
  "enterprise-table-showroom": "企业表格",
  "mobile-workbench-showroom": "移动办公",
  "glass-enterprise-showroom": "玻璃 AI",
  "dark-dashboard-showroom": "深色大屏",
  "ai-copilot-showroom": "AI 助手",
  "medical-health-showroom": "医疗健康",
  "finance-trust-showroom": "金融可信",
  "ecommerce-growth-showroom": "电商增长",
  "local-service-showroom": "本地生活",
};

export const styleCoverMap: { variant: StyleCoverVariant; keywords: string[] }[] = [
  {
    variant: "finance-trust-showroom",
    keywords: ["finance", "fintech", "investment", "insurance", "金融", "trust", "资产", "风控", "投资", "保险", "财务"],
  },
  {
    variant: "medical-health-showroom",
    keywords: ["medical", "health", "healthcare", "医疗", "健康", "患者", "体检", "检测", "康复", "慢病"],
  },
  {
    variant: "local-service-showroom",
    keywords: ["local_life", "local-life", "本地生活", "门店", "预约", "团购", "生活服务", "到店", "配送", "美食", "社区团购", "文旅", "家居", "亲子"],
  },
  {
    variant: "ecommerce-growth-showroom",
    keywords: ["ecommerce", "merchant", "marketplace", "plugin", "marketing", "campaign", "cms", "media", "content", "电商", "商家", "增长", "订单", "营销", "内容", "市场"],
  },
  {
    variant: "glass-enterprise-showroom",
    keywords: ["liquid", "glass", "玻璃", "高端", "premium", "luxury", "轻奢", "珠光", "香槟", "黑曜石", "静奢"],
  },
  {
    variant: "mobile-workbench-showroom",
    keywords: ["style-030", "移动优先", "mobile", "ios", "轻办公", "workbench", "移动端", "跨端", "小程序"],
  },
  {
    variant: "enterprise-table-showroom",
    keywords: ["style-002", "table", "表格", "erp", "classic", "crud", "compliance", "audit", "risk", "合规", "审计", "政务", "government"],
  },
  {
    variant: "dark-dashboard-showroom",
    keywords: ["dark", "暗色", "大屏", "dataviz", "visualization", "dashboard", "soc", "security", "industrial", "iot", "terminal", "监控", "安全", "工业"],
  },
  {
    variant: "ai-copilot-showroom",
    keywords: ["ai", "copilot", "assistant", "agent", "助手", "lowcode", "builder", "developer", "api", "console", "automation", "mlops", "training", "低代码", "开发者"],
  },
];

export function StyleShowroomCover({ style, mode = "showroom" }: StyleShowroomCoverProps) {
  const variant = mode === "compare" ? "saas-clean-showroom" : getStyleCoverVariant(style);
  const vars = applyTheme(style) as CSSProperties;

  return (
    <div className="style-showroom-cover" style={vars} data-variant={mode === "compare" ? "compare-showroom" : variant}>
      <div className="showroom-chrome">
        <span>{mode === "compare" ? "同场景对比" : variantLabels[variant]}</span>
        <b>{getPrimaryScenario(style, variant)}</b>
      </div>
      {mode === "compare" ? <CompareShowroom /> : <VariantShowroom variant={variant} />}
    </div>
  );
}

export function getStyleCoverVariant(style: NormalizedStyle): StyleCoverVariant {
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
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const mapped = styleCoverMap.find((rule) => has(text, rule.keywords));
  if (mapped) return mapped.variant;
  return "saas-clean-showroom";
}

export function getPrimaryScenario(style: NormalizedStyle, variant = getStyleCoverVariant(style)) {
  if (variant === "mobile-workbench-showroom") return "企业移动工作台";
  if (variant === "glass-enterprise-showroom") return "智能运营分析";
  if (variant === "enterprise-table-showroom") return "客户数据管理";
  if (variant === "dark-dashboard-showroom") return "数据监控大屏";
  if (variant === "ai-copilot-showroom") return "智能助手工作台";
  if (variant === "medical-health-showroom") return "健康报告总览";
  if (variant === "finance-trust-showroom") return "账户资产中心";
  if (variant === "ecommerce-growth-showroom") return "订单增长分析";
  if (variant === "local-service-showroom") return "门店经营中心";
  return style.suitableFor[0] ?? "客户运营看板";
}

export function getVisualKeywords(style: NormalizedStyle, variant = getStyleCoverVariant(style)) {
  const fromStyle = style.visualSignature.length ? style.visualSignature : style.mood;
  const fallback: Record<StyleCoverVariant, string[]> = {
    "saas-clean-showroom": ["留白", "卡片", "低噪音"],
    "enterprise-table-showroom": ["高密度", "表格", "克制"],
    "mobile-workbench-showroom": ["移动优先", "待办", "轻办公"],
    "glass-enterprise-showroom": ["通透", "玻璃拟态", "未来感"],
    "dark-dashboard-showroom": ["深色", "发光", "数据化"],
    "ai-copilot-showroom": ["会话", "推荐", "知识卡片"],
    "medical-health-showroom": ["洁净", "可信", "健康指标"],
    "finance-trust-showroom": ["稳重", "资产", "风控"],
    "ecommerce-growth-showroom": ["增长", "转化", "营销"],
    "local-service-showroom": ["亲和", "门店", "服务"],
  };
  return [...fromStyle, ...fallback[variant]].filter(Boolean).slice(0, 3);
}

function VariantShowroom({ variant }: { variant: StyleCoverVariant }) {
  if (variant === "enterprise-table-showroom") return <EnterpriseTableShowroom />;
  if (variant === "mobile-workbench-showroom") return <MobileWorkbenchShowroom />;
  if (variant === "glass-enterprise-showroom") return <GlassEnterpriseShowroom />;
  if (variant === "dark-dashboard-showroom") return <DarkDashboardShowroom />;
  if (variant === "ai-copilot-showroom") return <AiCopilotShowroom />;
  if (variant === "medical-health-showroom") return <MedicalHealthShowroom />;
  if (variant === "finance-trust-showroom") return <FinanceTrustShowroom />;
  if (variant === "ecommerce-growth-showroom") return <EcommerceGrowthShowroom />;
  if (variant === "local-service-showroom") return <LocalServiceShowroom />;
  return <SaasCleanShowroom />;
}

function SaasCleanShowroom() {
  return (
    <div className="showroom-layout saas-clean">
      <div className="showroom-panel main">
        <ShowroomHeader title="客户运营看板" action="新建客户" />
        <KpiRow items={[["活跃客户", "2,846"], ["待跟进", "128"], ["续约率", "86%"]]} />
        <MiniChart title="本月成交 ¥128,430" />
        <MiniTable rows={["星河科技", "云启软件", "蓝海集团"]} />
      </div>
      <MiniPhone compact />
    </div>
  );
}

function EnterpriseTableShowroom() {
  return (
    <div className="showroom-layout enterprise-table">
      <div className="showroom-filter">
        <span>客户名称</span><span>阶段</span><span>负责人</span><button>批量处理</button>
      </div>
      <div className="showroom-table dense">
        {["客户名称", "阶段", "负责人", "最近跟进", "状态"].map((cell) => <b key={cell}>{cell}</b>)}
        {["星河科技|续约|李经理|今天|高优先级", "云启软件|方案|周主管|昨天|进行中", "蓝海集团|合同|王敏|周二|待处理"].flatMap((row) =>
          row.split("|").map((cell, index) => <span key={`${row}-${index}`} className={index === 4 ? "status" : ""}>{cell}</span>),
        )}
      </div>
      <div className="showroom-pagination"><span>上一页</span><b>1</b><span>2</span><span>下一页</span></div>
    </div>
  );
}

function MobileWorkbenchShowroom() {
  return (
    <div className="showroom-layout mobile-workbench">
      <div className="mobile-workbench-phone">
        <div className="phone-head"><span>9:41</span><b>李经理</b></div>
        <h3>上午好，李经理</h3>
        <p>今天有 12 项待办需要处理</p>
        <KpiRow items={[["待审批", "4"], ["客户跟进", "8"], ["今日会议", "3"]]} />
        <div className="showroom-actions"><span>审批</span><span>客户</span><span>报表</span><span>任务</span></div>
        <TaskList items={["华东区客户续约待确认", "Q2 运营报表已生成", "新增 3 条商机线索"]} />
        <div className="phone-tabs"><b>首页</b><span>工作台</span><span>消息</span><span>我的</span></div>
      </div>
      <div className="mobile-workbench-side">
        <strong>后台同步</strong><span>待办 12</span><span>消息 6</span>
      </div>
    </div>
  );
}

function GlassEnterpriseShowroom() {
  return (
    <div className="showroom-layout glass-enterprise">
      <div className="glass-panel hero">
        <ShowroomHeader title="智能运营分析" action="生成洞察" />
        <KpiRow items={[["今日线索", "326"], ["转化率", "18.6%"], ["AI 建议", "5 条"]]} />
      </div>
      <div className="glass-grid">
        <div className="glass-panel"><strong>AI 摘要</strong><p>续约客户集中在华东区，建议优先跟进高意向线索。</p></div>
        <MiniChart title="线索趋势" />
        <TaskList items={["联系 12 个高意向客户", "复核报价策略", "生成周报摘要"]} />
      </div>
    </div>
  );
}

function DarkDashboardShowroom() {
  return (
    <div className="showroom-layout dark-dashboard">
      <ShowroomHeader title="数据监控大屏" action="实时刷新" />
      <KpiRow items={[["在线设备", "18,420"], ["风险预警", "4"], ["吞吐量", "92%"]]} />
      <div className="dashboard-grid">
        <MiniChart title="实时趋势" />
        <TaskList items={["华北链路延迟", "4 个节点需复核", "已完成自动扩容"]} />
      </div>
    </div>
  );
}

function AiCopilotShowroom() {
  return (
    <div className="showroom-layout ai-copilot">
      <aside><b>会话</b><span>销售总结</span><span>续约策略</span><span>报表生成</span></aside>
      <main>
        <strong>智能助手工作台</strong>
        <div className="chat-bubble">已为你总结 12 条客户跟进记录。</div>
        <div className="ai-input">让 AI 生成本周续约建议</div>
      </main>
      <section><b>知识卡片</b><span>CRM 数据</span><span>合同模板</span><span>推荐问题</span></section>
    </div>
  );
}

function MedicalHealthShowroom() {
  return (
    <div className="showroom-layout medical-health">
      <ShowroomHeader title="健康报告总览" action="查看报告" />
      <KpiRow items={[["今日预约", "32"], ["风险提醒", "3"], ["随访完成", "91%"]]} />
      <div className="health-card"><b>患者：王女士</b><span>血压稳定</span><span>复诊待确认</span></div>
      <MiniChart title="健康指标趋势" />
    </div>
  );
}

function FinanceTrustShowroom() {
  return (
    <div className="showroom-layout finance-trust">
      <ShowroomHeader title="账户资产中心" action="风险评估" />
      <div className="asset-card"><span>总资产</span><strong>¥2,846,000</strong><b>低风险</b></div>
      <MiniChart title="收益趋势" />
      <MiniTable rows={["基金申购", "债券到期", "风险测评"]} />
    </div>
  );
}

function EcommerceGrowthShowroom() {
  return (
    <div className="showroom-layout ecommerce-growth">
      <ShowroomHeader title="订单增长分析" action="创建活动" />
      <KpiRow items={[["今日订单", "326"], ["转化率", "18.6%"], ["GMV", "¥89,420"]]} />
      <div className="product-row"><span>爆款商品</span><span>满减活动</span><span>库存预警</span></div>
      <MiniChart title="活动趋势" />
    </div>
  );
}

function LocalServiceShowroom() {
  return (
    <div className="showroom-layout local-service">
      <ShowroomHeader title="门店经营中心" action="发布优惠" />
      <div className="store-card"><b>城西护理门店</b><span>4.8 分</span><span>今日预约 42</span></div>
      <div className="service-grid"><span>洗护</span><span>预约</span><span>到店</span><span>评价</span></div>
      <TaskList items={["14:00 张女士护理预约", "3 条评价待回复", "附近活动券已生效"]} />
    </div>
  );
}

function CompareShowroom() {
  return (
    <div className="showroom-layout compare-standard">
      <div className="showroom-panel main">
        <ShowroomHeader title="客户运营后台" action="新建跟进" />
        <KpiRow items={[["活跃客户", "2,846"], ["待跟进", "128"], ["商机金额", "¥1.28M"]]} />
        <MiniTable rows={["星河科技", "云启软件", "蓝海集团"]} />
      </div>
      <MiniPhone compact />
    </div>
  );
}

function ShowroomHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="showroom-header">
      <div><strong>{title}</strong><span>进行中</span></div>
      <button>{action}</button>
    </div>
  );
}

function KpiRow({ items }: { items: [string, string][] }) {
  return (
    <div className="showroom-kpis">
      {items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
    </div>
  );
}

function MiniChart({ title }: { title: string }) {
  return (
    <div className="showroom-chart"><b>{title}</b><div>{[38, 62, 48, 80, 66, 92].map((h) => <span key={h} style={{ height: `${h}%` }} />)}</div></div>
  );
}

function MiniTable({ rows }: { rows: string[] }) {
  return <div className="showroom-mini-table">{rows.map((row, index) => <p key={row}><b>{row}</b><span>{index === 0 ? "高优先级" : index === 1 ? "进行中" : "待处理"}</span></p>)}</div>;
}

function TaskList({ items }: { items: string[] }) {
  return <div className="showroom-task-list">{items.map((item, index) => <p key={item}><i>{index + 1}</i><span>{item}</span></p>)}</div>;
}

function MiniPhone({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "showroom-phone compact" : "showroom-phone"}>
      <b>今日待办</b>
      <span>审批 4</span>
      <span>客户 8</span>
      <span>消息 6</span>
      <div><i /><i /><i /><i /></div>
    </div>
  );
}

function has(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
