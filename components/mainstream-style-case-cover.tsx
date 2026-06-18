import type { NormalizedStyle } from "@/lib/style-theme";

type CaseKind =
  | "docs"
  | "crm"
  | "ai-chat"
  | "agent"
  | "settings"
  | "hr"
  | "soc"
  | "payments"
  | "merchant"
  | "store"
  | "learning"
  | "tea";

type CaseConfig = {
  kind: CaseKind;
  eyebrow: string;
  title: string;
  metric: string;
  metricLabel: string;
  action: string;
  items: string[];
  tags: string[];
};

const caseConfigs: Record<string, CaseConfig> = {
  "style-mainstream-saas-notion-docs-001": {
    kind: "docs",
    eyebrow: "TEAM WIKI",
    title: "产品知识库",
    metric: "128",
    metricLabel: "本周更新",
    action: "新建文档",
    items: ["Q3 产品路线图", "客户访谈纪要", "组件规范更新"],
    tags: ["文档", "项目", "协作"],
  },
  "style-mainstream-saas-hubspot-crm-001": {
    kind: "crm",
    eyebrow: "CRM GROWTH",
    title: "销售增长中心",
    metric: "42%",
    metricLabel: "转化提升",
    action: "新增商机",
    items: ["星河科技｜续约沟通", "云启软件｜方案确认", "蓝海集团｜合同审批"],
    tags: ["漏斗", "客户", "营销"],
  },
  "style-mainstream-ai-chatgpt-enterprise-001": {
    kind: "ai-chat",
    eyebrow: "AI ASSISTANT",
    title: "企业知识助手",
    metric: "5",
    metricLabel: "建议动作",
    action: "继续追问",
    items: ["总结本周客户风险", "生成报价跟进邮件", "提取合同关键条款"],
    tags: ["对话", "引用", "总结"],
  },
  "style-mainstream-ai-agent-builder-001": {
    kind: "agent",
    eyebrow: "AGENT FLOW",
    title: "自动化编排",
    metric: "8",
    metricLabel: "运行节点",
    action: "发布流程",
    items: ["读取 CRM", "判断优先级", "生成跟进任务"],
    tags: ["节点", "工具", "流程"],
  },
  "style-mainstream-apple-settings-clean-001": {
    kind: "settings",
    eyebrow: "SYSTEM",
    title: "会员设置中心",
    metric: "Pro",
    metricLabel: "当前权益",
    action: "管理权益",
    items: ["账号安全", "设备同步", "通知偏好"],
    tags: ["设置", "会员", "设备"],
  },
  "style-mainstream-erp-workday-001": {
    kind: "hr",
    eyebrow: "HR SUITE",
    title: "人力运营台",
    metric: "96%",
    metricLabel: "流程完成",
    action: "发起审批",
    items: ["Alice Chen｜绩效复核", "Bob Kim｜入职确认", "Cara Singh｜调岗审批"],
    tags: ["员工", "绩效", "审批"],
  },
  "style-mainstream-dark-soc-cyber-001": {
    kind: "soc",
    eyebrow: "SECURITY OPS",
    title: "安全态势中心",
    metric: "17",
    metricLabel: "高危事件",
    action: "处置告警",
    items: ["异常登录｜高危", "终端隔离｜进行中", "策略命中｜已确认"],
    tags: ["SOC", "告警", "响应"],
  },
  "style-mainstream-finance-stripe-dashboard-001": {
    kind: "payments",
    eyebrow: "PAYMENT OPS",
    title: "支付运营看板",
    metric: "¥2.8M",
    metricLabel: "本月流水",
    action: "查看结算",
    items: ["订阅收入 +18%", "退款率 0.8%", "商户结算 32 笔"],
    tags: ["支付", "订阅", "结算"],
  },
  "style-mainstream-commerce-shopify-merchant-001": {
    kind: "merchant",
    eyebrow: "MERCHANT",
    title: "商家增长中心",
    metric: "326",
    metricLabel: "今日订单",
    action: "创建活动",
    items: ["爆款商品补货", "优惠券转化 18%", "会员复购提升"],
    tags: ["商品", "订单", "增长"],
  },
  "style-mainstream-local-meituan-store-001": {
    kind: "store",
    eyebrow: "LOCAL STORE",
    title: "门店经营台",
    metric: "84",
    metricLabel: "预约待核销",
    action: "上架团购",
    items: ["午餐套餐｜热销", "到店评价 4.8", "骑手配送准时率 96%"],
    tags: ["门店", "预约", "评价"],
  },
  "style-mainstream-young-duolingo-learning-001": {
    kind: "learning",
    eyebrow: "LEARNING",
    title: "学习成长页",
    metric: "12",
    metricLabel: "连续打卡",
    action: "开始练习",
    items: ["今日词汇 20 个", "听力任务 3 组", "升级挑战待完成"],
    tags: ["打卡", "课程", "激励"],
  },
  "style-mainstream-guochao-tea-retail-001": {
    kind: "tea",
    eyebrow: "NEW CHINESE",
    title: "国潮茶饮会员",
    metric: "新品",
    metricLabel: "春日上新",
    action: "发布活动",
    items: ["龙井轻乳茶", "会员礼券待领取", "门店热销榜更新"],
    tags: ["茶饮", "会员", "上新"],
  },
};

export function hasMainstreamCaseCover(style: NormalizedStyle) {
  return style.id in caseConfigs;
}

export function MainstreamStyleCaseCover({ style }: { style: NormalizedStyle }) {
  const config = caseConfigs[style.id];
  if (!config) return null;

  return (
    <div className="enterprise-cover-scene mainstream-case-cover" data-case-kind={config.kind}>
      <section className="mainstream-case-hero">
        <div className="mainstream-case-copy">
          <span>{config.eyebrow}</span>
          <strong>{config.title}</strong>
          <p>{style.slogan || style.description}</p>
        </div>
        <button type="button">{config.action}</button>
      </section>

      <div className="mainstream-case-stage">
        {renderCasePreview(config)}
      </div>
    </div>
  );
}

function renderCasePreview(config: CaseConfig) {
  if (config.kind === "ai-chat") return <AiChatCase config={config} />;
  if (config.kind === "agent") return <AgentCase config={config} />;
  if (config.kind === "settings") return <SettingsCase config={config} />;
  if (config.kind === "soc") return <SocCase config={config} />;
  if (config.kind === "learning" || config.kind === "store" || config.kind === "tea") {
    return <MobileCase config={config} />;
  }
  if (config.kind === "crm" || config.kind === "hr" || config.kind === "payments" || config.kind === "merchant") {
    return <DashboardCase config={config} />;
  }
  return <DocsCase config={config} />;
}

function DocsCase({ config }: { config: CaseConfig }) {
  return (
    <div className="mainstream-docs-case">
      <aside>
        {["项目", "客户", "规范"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </aside>
      <main>
        <div className="case-page-title">
          <b>{config.title}</b>
          <small>{config.metricLabel} {config.metric}</small>
        </div>
        {config.items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </main>
    </div>
  );
}

function DashboardCase({ config }: { config: CaseConfig }) {
  return (
    <div className="mainstream-dashboard-case">
      <div className="case-metric-card">
        <span>{config.metricLabel}</span>
        <strong>{config.metric}</strong>
      </div>
      <div className="case-chart-card">
        {[38, 52, 45, 66, 58, 78].map((height, index) => (
          <i key={index} style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="case-table-card">
        {config.items.map((item) => (
          <p key={item}>
            <span>{item}</span>
            <b>进行中</b>
          </p>
        ))}
      </div>
    </div>
  );
}

function AiChatCase({ config }: { config: CaseConfig }) {
  return (
    <div className="mainstream-ai-chat-case">
      <aside>{config.items.map((item) => <span key={item}>{item}</span>)}</aside>
      <main>
        <div className="case-ai-answer">
          <b>AI 总结</b>
          <strong>识别 {config.metric} 条高价值建议</strong>
          <p>已结合 CRM、合同和客户纪要生成下一步行动。</p>
        </div>
        <div className="case-ai-input">输入需求，让 AI 生成计划</div>
      </main>
    </div>
  );
}

function AgentCase({ config }: { config: CaseConfig }) {
  return (
    <div className="mainstream-agent-case">
      {config.items.map((item, index) => (
        <div key={item} className="case-node">
          <span>0{index + 1}</span>
          <strong>{item}</strong>
        </div>
      ))}
      <div className="case-node case-node-active">
        <span>{config.metric}</span>
        <strong>{config.metricLabel}</strong>
      </div>
    </div>
  );
}

function SettingsCase({ config }: { config: CaseConfig }) {
  return (
    <div className="mainstream-settings-case">
      <div className="case-phone-card">
        <strong>{config.title}</strong>
        <span>{config.metric} · {config.metricLabel}</span>
        {config.items.map((item) => <p key={item}>{item}</p>)}
      </div>
      <div className="case-floating-card">{config.action}</div>
    </div>
  );
}

function SocCase({ config }: { config: CaseConfig }) {
  return (
    <div className="mainstream-soc-case">
      <div className="case-soc-metric">
        <span>{config.metricLabel}</span>
        <strong>{config.metric}</strong>
      </div>
      <div className="case-soc-map">
        <i />
        <i />
        <i />
      </div>
      <div className="case-soc-list">
        {config.items.map((item) => <p key={item}>{item}</p>)}
      </div>
    </div>
  );
}

function MobileCase({ config }: { config: CaseConfig }) {
  return (
    <div className="mainstream-mobile-case">
      <div className="case-mobile-shell">
        <div className="case-mobile-head">
          <span>{config.eyebrow}</span>
          <b>{config.metric}</b>
        </div>
        <strong>{config.title}</strong>
        <div className="case-mobile-actions">
          {config.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="case-mobile-list">
          {config.items.map((item) => <p key={item}>{item}</p>)}
        </div>
      </div>
      <div className="case-mobile-side">{config.action}</div>
    </div>
  );
}
