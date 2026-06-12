"use client";

import { useMemo, useState } from "react";
import {
  applyTheme,
  getPreviewPattern,
  type NormalizedStyle,
  type PreviewScenario,
} from "@/lib/style-theme";
import { Icon, type IconName } from "@/components/icon";

export type RealPreviewPlatform = "app" | "admin" | "dashboard" | "ai-copilot";
export type RealPreviewPage =
  | "home"
  | "list"
  | "detail"
  | "profile"
  | "dashboard"
  | "form"
  | "approval";
export type RealPreviewState = "default" | "loading" | "empty" | "error" | "permission-denied";
type MobileIconName =
  | "approval"
  | "customer"
  | "report"
  | "task"
  | "calendar"
  | "follow"
  | "patient"
  | "asset"
  | "risk"
  | "trade"
  | "order"
  | "coupon"
  | "store"
  | "stock"
  | "campaign"
  | "chat"
  | "knowledge"
  | "generate"
  | "review"
  | "monitor"
  | "alert"
  | "link"
  | "renewal"
  | "chart"
  | "lead"
  | "home"
  | "workbench"
  | "message"
  | "profile"
  | "settings";

type RealScenarioPreviewProps = {
  style: NormalizedStyle;
  platform?: RealPreviewPlatform;
  scenario?: PreviewScenario;
  pages?: RealPreviewPage[];
  stylePackId?: string;
  tokenModes?: string[];
  density?: "comfortable" | "compact";
  state?: RealPreviewState;
  showControls?: boolean;
  showPlatformTabs?: boolean;
  initialPlatform?: "app" | "admin";
};

const stateOptions: { id: RealPreviewState; label: string }[] = [
  { id: "default", label: "默认" },
  { id: "loading", label: "加载中" },
  { id: "empty", label: "空状态" },
  { id: "error", label: "错误" },
  { id: "permission-denied", label: "无权限" },
];

const mobilePages: { id: RealPreviewPage; label: string }[] = [
  { id: "home", label: "首页" },
  { id: "list", label: "列表" },
  { id: "detail", label: "详情" },
  { id: "profile", label: "我的" },
];

const adminPages: { id: RealPreviewPage; label: string }[] = [
  { id: "dashboard", label: "看板" },
  { id: "list", label: "列表" },
  { id: "form", label: "表单" },
  { id: "detail", label: "详情" },
];

export function RealScenarioPreview({
  style,
  platform,
  scenario,
  stylePackId,
  tokenModes,
  density = "comfortable",
  state,
  showControls = true,
  showPlatformTabs = true,
  initialPlatform = "app",
}: RealScenarioPreviewProps) {
  const resolvedScenario = scenario ?? style.previewScenario;
  const [activePlatform, setActivePlatform] = useState<"app" | "admin">(
    platform === "admin" || platform === "dashboard" ? "admin" : initialPlatform,
  );
  const [activeState, setActiveState] = useState<RealPreviewState>(state ?? "default");
  const [activeMobilePage, setActiveMobilePage] = useState<RealPreviewPage>("home");
  const [activeAdminPage, setActiveAdminPage] = useState<RealPreviewPage>("dashboard");
  const viewPlatform = platform ? (platform === "app" ? "app" : "admin") : activePlatform;
  const viewState = state ?? activeState;
  const pattern = getPreviewPattern(style);
  const content = useMemo(() => getScenarioContent(resolvedScenario), [resolvedScenario]);
  const themeStyle = applyTheme(style);

  return (
    <div
      className={`real-scenario-preview density-${density} pattern-${pattern}`}
      data-scenario={resolvedScenario}
      style={themeStyle}
    >
      <div className="real-preview-toolbar">
        <div>
          <p className="real-preview-kicker">Real Scenario Preview</p>
          <h3>{content.title}</h3>
          <p>{content.description}</p>
        </div>
        <div className="real-preview-meta">
          <span>{stylePackId ?? style.id}</span>
          {(tokenModes ?? [style.source.tokens]).filter(Boolean).slice(0, 2).map((mode) => (
            <span key={mode}>{mode}</span>
          ))}
        </div>
      </div>

      {showPlatformTabs && !platform ? (
        <div className="real-preview-primary-nav">
          <p>选择预览端型</p>
          <div className="real-preview-tabs" aria-label="预览端型">
            <button
              className={viewPlatform === "app" ? "active" : ""}
              type="button"
              onClick={() => {
                setActivePlatform("app");
                setActiveState("default");
              }}
            >
              移动端 App 预览
            </button>
            <button
              className={viewPlatform === "admin" ? "active" : ""}
              type="button"
              onClick={() => {
                setActivePlatform("admin");
                setActiveState("default");
              }}
            >
              后台 Web 预览
            </button>
          </div>
        </div>
      ) : null}

      {showControls ? (
        <div className="real-preview-control-panel">
          <div className="real-preview-control-group">
            <div className="real-preview-control-label">
              <span>交付状态</span>
              <small>默认看真实页面，其它状态用于验收</small>
            </div>
            <div className="real-preview-segment state-segment" aria-label="状态切换">
              {stateOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={viewState === item.id ? "active" : ""}
                  onClick={() => setActiveState(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="real-preview-control-group page-group">
            <div className="real-preview-control-label">
              <span>{viewPlatform === "app" ? "App 页面" : "Web 页面"}</span>
              <small>点击后自动回到默认页面预览</small>
            </div>
            <div className="real-preview-segment page-segment" aria-label="页面切换">
              {(viewPlatform === "app" ? mobilePages : adminPages).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={(viewPlatform === "app" ? activeMobilePage : activeAdminPage) === item.id ? "active" : ""}
                  onClick={() => {
                    if (viewPlatform === "app") {
                      setActiveMobilePage(item.id);
                    } else {
                      setActiveAdminPage(item.id);
                    }
                    setActiveState("default");
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="real-preview-stage">
        {viewState === "default" ? (
          viewPlatform === "app" ? (
            <MobileRealPreview content={content} page={activeMobilePage} />
          ) : (
            <AdminRealPreview content={content} page={activeAdminPage} scenario={resolvedScenario} />
          )
        ) : (
          <StatePreview state={viewState} platform={viewPlatform} />
        )}
      </div>
    </div>
  );
}

function MobileRealPreview({ content, page }: { content: ScenarioContent; page: RealPreviewPage }) {
  return (
    <div className="real-phone-frame">
      <div className="real-phone-screen">
        <div className="real-phone-status">
          <span>9:41</span>
          <span>5G 100%</span>
        </div>
        {page === "home" ? <MobileHome content={content} /> : null}
        {page === "list" ? <MobileList content={content} /> : null}
        {page === "detail" ? <MobileDetail content={content} /> : null}
        {page === "profile" ? <MobileProfile content={content} /> : null}
      <div className="real-phone-tabbar">
        {["首页", "工作台", "消息", "我的"].map((item, index) => (
          <span key={item} className={index === tabIndex(page) ? "active" : ""}>
              <MobileIcon name={getTabIcon(item)} variant="filled" />
              {item}
            </span>
        ))}
      </div>
      </div>
    </div>
  );
}

function MobileHome({ content }: { content: ScenarioContent }) {
  return (
    <div className="real-mobile-page">
      <div className="real-mobile-topbar">
        <div>
          <h4>{content.mobile.homeTitle}</h4>
          <p>{content.mobile.homeSubtitle}</p>
        </div>
        <div className="real-avatar">{content.owner.slice(0, 1)}</div>
      </div>
      <div className="real-hero-card">
        <span>{content.mobile.heroLabel}</span>
        <strong>{content.mobile.heroValue}</strong>
        <p>{content.mobile.heroHint}</p>
      </div>
      <div className="real-mobile-metrics">
        {content.metrics.map((item, index) => (
          <div key={item.label}>
            <MobileIcon name={getMetricIcon(item.label, index)} variant="filled" />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <div className="real-quick-grid">
        {content.actions.map((item, index) => (
          <button key={item} type="button">
            <MobileIcon name={getActionIcon(item, index)} variant="multi" />
            {item}
          </button>
        ))}
      </div>
      <div className="real-content-list">
        {content.mobile.todo.map((item, index) => (
          <div key={item} className="real-list-card">
            <MobileIcon name={getTodoIcon(item, index)} variant="linear" />
            <span>{item}</span>
            <b>待处理</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileList({ content }: { content: ScenarioContent }) {
  return (
    <div className="real-mobile-page">
      <div className="real-mobile-title">
        <h4>{content.mobile.listTitle}</h4>
        <p>{content.mobile.listHint}</p>
      </div>
      <div className="real-search-box">搜索客户 / 项目</div>
      <div className="real-filter-row">
        {["全部", "待跟进", "高优先级", "已完成"].map((item, index) => (
          <span key={item} className={index === 0 ? "active" : ""}>{item}</span>
        ))}
      </div>
      <div className="real-content-list">
        {content.mobile.listItems.map((item, index) => (
          <div key={item.title} className="real-list-card tall">
            <MobileIcon name={getTodoIcon(item.title, index)} variant="linear" />
            <div>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
            <b>{item.status}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileDetail({ content }: { content: ScenarioContent }) {
  return (
    <div className="real-mobile-page with-actions">
      <div className="real-detail-header">
        <span>{content.mobile.detailStatus}</span>
        <h4>{content.mobile.detailTitle}</h4>
        <p>{content.mobile.detailHint}</p>
      </div>
      <div className="real-field-grid">
        {content.mobile.fields.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <div className="real-timeline">
        {content.timeline.map((item, index) => (
          <div key={item} className={index < 2 ? "done" : ""}>
            <MobileIcon name={index < 2 ? "approval" : "task"} variant={index < 2 ? "filled" : "linear"} />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="real-mobile-actions">
        <button type="button" className="secondary">添加跟进</button>
        <button type="button">发送方案</button>
      </div>
    </div>
  );
}

function MobileProfile({ content }: { content: ScenarioContent }) {
  return (
    <div className="real-mobile-page">
      <div className="real-profile-card">
        <div className="real-avatar large">{content.owner.slice(0, 1)}</div>
        <div>
          <h4>{content.owner}</h4>
          <p>{content.department}</p>
        </div>
      </div>
      <div className="real-profile-stats">
        <div><strong>24</strong><span>本月完成</span></div>
        <div><strong>6</strong><span>待处理</span></div>
        <div><strong>98%</strong><span>准时率</span></div>
      </div>
      <div className="real-menu-list">
        {content.mobile.profileMenus.map((item, index) => (
          <button key={item} type="button">
            <MobileIcon name={getProfileIcon(item, index)} variant="linear" />
            <span>{item}</span>
            <b>›</b>
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileIcon({
  name,
  variant,
}: {
  name: MobileIconName;
  variant: "linear" | "filled" | "multi";
}) {
  return (
    <span className={`real-mobile-icon ${variant}`} aria-hidden="true">
      <Icon icon={mobileIconMap[name]} color="currentColor" className="real-mobile-icon-svg" />
    </span>
  );
}

const mobileIconMap: Record<MobileIconName, IconName> = {
  approval: "approval",
  customer: "customer",
  report: "report",
  task: "task",
  calendar: "calendar",
  follow: "refresh",
  patient: "user",
  asset: "asset",
  risk: "risk",
  trade: "trade",
  order: "order",
  coupon: "coupon",
  store: "store",
  stock: "stock",
  campaign: "campaign",
  chat: "chat",
  knowledge: "knowledge",
  generate: "generate",
  review: "task",
  monitor: "monitor",
  alert: "alert-circle",
  link: "link",
  renewal: "customer",
  chart: "bar-chart",
  lead: "users",
  home: "home",
  workbench: "workbench",
  message: "message",
  profile: "user",
  settings: "settings",
};

function getActionIcon(label: string, index: number): MobileIconName {
  const text = label.toLowerCase();
  if (text.includes("审批")) return "approval";
  if (text.includes("客户") || text.includes("患者")) return "customer";
  if (text.includes("报表") || text.includes("报告")) return "report";
  if (text.includes("任务") || text.includes("审阅")) return "task";
  if (text.includes("预约")) return "calendar";
  if (text.includes("随访")) return "follow";
  if (text.includes("资产")) return "asset";
  if (text.includes("风控")) return "risk";
  if (text.includes("交易")) return "trade";
  if (text.includes("订单")) return "order";
  if (text.includes("券")) return "coupon";
  if (text.includes("门店")) return "store";
  if (text.includes("库存")) return "stock";
  if (text.includes("活动") || text.includes("直播")) return "campaign";
  if (text.includes("会话")) return "chat";
  if (text.includes("知识")) return "knowledge";
  if (text.includes("生成")) return "generate";
  if (text.includes("监控")) return "monitor";
  if (text.includes("告警")) return "alert";
  if (text.includes("链路")) return "link";
  return ["approval", "customer", "report", "task"][index % 4] as MobileIconName;
}

function getTodoIcon(label: string, index: number): MobileIconName {
  if (label.includes("续约") || label.includes("跟进")) return "renewal";
  if (label.includes("报表") || label.includes("报告")) return "chart";
  if (label.includes("商机") || label.includes("线索")) return "lead";
  if (label.includes("审批") || label.includes("合同")) return "approval";
  return ["renewal", "chart", "lead"][index % 3] as MobileIconName;
}

function getMetricIcon(label: string, index: number): MobileIconName {
  if (label.includes("审批")) return "approval";
  if (label.includes("客户")) return "customer";
  if (label.includes("业绩") || label.includes("金额")) return "report";
  if (label.includes("进度")) return "task";
  return ["approval", "customer", "report", "task"][index % 4] as MobileIconName;
}

function getTabIcon(label: string): MobileIconName {
  if (label === "首页") return "home";
  if (label === "工作台") return "workbench";
  if (label === "消息") return "message";
  return "profile";
}

function getProfileIcon(label: string, index: number): MobileIconName {
  if (label.includes("审批")) return "approval";
  if (label.includes("客户")) return "customer";
  if (label.includes("报表")) return "report";
  if (label.includes("设置")) return "settings";
  return ["approval", "customer", "report", "settings"][index % 4] as MobileIconName;
}

function AdminRealPreview({
  content,
  page,
  scenario,
}: {
  content: ScenarioContent;
  page: RealPreviewPage;
  scenario: PreviewScenario;
}) {
  return (
    <div className={`real-admin-frame scenario-${scenario}`}>
      <aside className="real-admin-side">
        <strong>{content.admin.systemName}</strong>
        {["看板", "客户", "商机", "审批", "报表"].map((item, index) => (
          <span key={item} className={index === 0 ? "active" : ""}>{item}</span>
        ))}
      </aside>
      <main className="real-admin-main">
        <div className="real-admin-top">
          <div>
            <h4>{page === "dashboard" ? content.admin.title : content.admin.pageTitles[page] ?? content.admin.title}</h4>
            <p>{content.admin.subtitle}</p>
          </div>
          <button type="button">新建任务</button>
        </div>
        {page === "dashboard" ? <AdminDashboard content={content} /> : null}
        {page === "list" ? <AdminList content={content} /> : null}
        {page === "form" ? <AdminForm content={content} /> : null}
        {page === "detail" ? <AdminDetail content={content} /> : null}
      </main>
    </div>
  );
}

function AdminDashboard({ content }: { content: ScenarioContent }) {
  return (
    <>
      <div className="real-admin-kpis">
        {content.admin.kpis.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <b>{item.trend}</b>
          </div>
        ))}
      </div>
      <div className="real-admin-grid">
        <section className="real-admin-panel large">
          <div className="real-panel-title">
            <strong>经营趋势</strong>
            <span>近 7 日</span>
          </div>
          <div className="real-chart-bars">
            {[42, 68, 54, 82, 74, 96, 88].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </section>
        <section className="real-admin-panel">
          <div className="real-panel-title">
            <strong>任务提醒</strong>
            <span>{content.admin.alert}</span>
          </div>
          <div className="real-task-list">
            {content.admin.tasks.map((task) => <span key={task}>{task}</span>)}
          </div>
        </section>
      </div>
      <AdminTable rows={content.admin.rows} />
    </>
  );
}

function AdminList({ content }: { content: ScenarioContent }) {
  return (
    <>
      <div className="real-admin-filter">
        <span>客户阶段</span>
        <span>负责人</span>
        <span>最近跟进</span>
        <button type="button">查询</button>
      </div>
      <AdminTable rows={content.admin.rows} />
    </>
  );
}

function AdminForm({ content }: { content: ScenarioContent }) {
  return (
    <section className="real-admin-panel real-form-panel">
      <div className="real-panel-title"><strong>新增跟进记录</strong><span>{content.owner}</span></div>
      {["客户名称", "跟进阶段", "预计金额", "下一步动作", "备注说明"].map((item) => (
        <label key={item}>
          <span>{item}</span>
          <input value={item === "客户名称" ? content.admin.rows[0].name : ""} readOnly />
        </label>
      ))}
      <div className="real-form-actions">
        <button type="button" className="secondary">保存草稿</button>
        <button type="button">提交审批</button>
      </div>
    </section>
  );
}

function AdminDetail({ content }: { content: ScenarioContent }) {
  return (
    <div className="real-admin-detail-grid">
      <section className="real-admin-panel">
        <div className="real-panel-title"><strong>{content.mobile.detailTitle}</strong><span>{content.mobile.detailStatus}</span></div>
        <div className="real-field-grid admin">
          {content.mobile.fields.map((item) => (
            <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>
          ))}
        </div>
      </section>
      <section className="real-admin-panel">
        <div className="real-panel-title"><strong>推进记录</strong><span>3 条</span></div>
        <div className="real-timeline admin">
          {content.timeline.map((item, index) => (
            <div key={item} className={index < 2 ? "done" : ""}><i /><span>{item}</span></div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AdminTable({ rows }: { rows: ScenarioContent["admin"]["rows"] }) {
  return (
    <section className="real-admin-panel real-table-panel">
      <div className="real-table-head">
        <span>客户名称</span>
        <span>阶段</span>
        <span>负责人</span>
        <span>最近跟进</span>
        <span>状态</span>
      </div>
      {rows.map((row) => (
        <div key={row.name} className="real-table-row">
          <strong>{row.name}</strong>
          <span>{row.stage}</span>
          <span>{row.owner}</span>
          <span>{row.last}</span>
          <b className={`real-status-badge ${getStatusTone(row.status)}`}>{row.status}</b>
        </div>
      ))}
    </section>
  );
}

function getStatusTone(status: string) {
  if (status.includes("高") || status.includes("风险") || status.includes("预警")) {
    return "tone-danger";
  }

  if (status.includes("进行") || status.includes("确认")) {
    return "tone-info";
  }

  if (status.includes("待")) {
    return "tone-warning";
  }

  if (status.includes("完成") || status.includes("正常")) {
    return "tone-success";
  }

  return "tone-neutral";
}

function StatePreview({
  state,
  platform,
}: {
  state: Exclude<RealPreviewState, "default">;
  platform: "app" | "admin";
}) {
  if (platform === "app") {
    return <MobileStatePreview state={state} />;
  }

  const copy = {
    loading: ["数据正在加载", "正在同步业务数据，请稍候。", "加载中"],
    empty: ["暂无业务数据", "当前筛选条件下没有结果，可以调整条件或新建记录。", "新建记录"],
    error: ["数据加载失败", "服务暂时不可用，请保留当前上下文后重试。", "重试"],
    "permission-denied": ["暂无查看权限", "该内容需要业务权限，请提交权限申请。", "申请权限"],
  }[state];

  return (
    <div className={`real-state-preview ${platform}`}>
      {state === "loading" ? (
        <div className="real-loading-layout">
          <div className="real-loading-copy">
            <strong>{copy[0]}</strong>
            <p>{copy[1]}</p>
          </div>
          {[0, 1, 2, 3].map((item) => <i key={item} />)}
          <div>{[0, 1, 2, 3].map((item) => <span key={item} />)}</div>
        </div>
      ) : (
        <div className="real-state-card">
          <strong>{copy[0]}</strong>
          <p>{copy[1]}</p>
          <button type="button">{copy[2]}</button>
        </div>
      )}
    </div>
  );
}

function MobileStatePreview({ state }: { state: Exclude<RealPreviewState, "default"> }) {
  const copy = {
    loading: ["数据正在加载", "正在同步业务数据，请稍候。", "加载中"],
    empty: ["暂无业务数据", "当前筛选条件下没有结果，可以调整条件或新建记录。", "新建记录"],
    error: ["数据加载失败", "服务暂时不可用，请保留当前上下文后重试。", "重试"],
    "permission-denied": ["暂无查看权限", "该内容需要业务权限，请提交权限申请。", "申请权限"],
  }[state];

  return (
    <div className="real-phone-frame">
      <div className="real-phone-screen">
        <div className="real-phone-status">
          <span>9:41</span>
          <span>5G 100%</span>
        </div>
        {state === "loading" ? (
          <div className="real-mobile-page real-phone-state-page loading">
            <div className="real-mobile-title">
              <h4>{copy[0]}</h4>
              <p>{copy[1]}</p>
            </div>
            <div className="real-phone-skeleton hero" />
            <div className="real-phone-skeleton-grid">
              {[0, 1, 2, 3].map((item) => <span key={item} />)}
            </div>
            <div className="real-phone-skeleton-list">
              {[0, 1, 2].map((item) => <span key={item} />)}
            </div>
          </div>
        ) : (
          <div className="real-mobile-page real-phone-state-page">
            <div className={`real-phone-state-card ${state}`}>
              <MobileIcon
                name={state === "error" ? "alert" : state === "permission-denied" ? "risk" : "task"}
                variant={state === "empty" ? "linear" : "filled"}
              />
              <strong>{copy[0]}</strong>
              <p>{copy[1]}</p>
              <button type="button">{copy[2]}</button>
            </div>
          </div>
        )}
        <div className="real-phone-tabbar">
          {["首页", "工作台", "消息", "我的"].map((item, index) => (
            <span key={item} className={index === 0 ? "active" : ""}>
              <MobileIcon name={getTabIcon(item)} variant="filled" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type ScenarioContent = ReturnType<typeof getScenarioContent>;

function getScenarioContent(scenario: PreviewScenario) {
  const base = {
    title: "企业轻办公 / SaaS 工作台",
    description: "用真实客户运营、审批和任务数据展示同一风格在移动端与后台端的落地效果。",
    owner: "李经理",
    department: "企业客户部",
    actions: ["审批", "客户", "报表", "任务"],
    metrics: [
      { label: "待审批", value: "4" },
      { label: "客户跟进", value: "8" },
      { label: "本月业绩", value: "¥128,430" },
      { label: "项目进度", value: "76%" },
    ],
    timeline: ["已完成需求确认", "已发送初版方案", "待客户确认报价"],
    mobile: {
      homeTitle: "上午好，李经理",
      homeSubtitle: "今天有 12 项待办需要处理",
      heroLabel: "本月业绩",
      heroValue: "¥128,430",
      heroHint: "较上月提升 18%，重点关注续约客户",
      todo: ["华东区客户续约待确认", "Q2 运营报表已生成", "新增 3 条商机线索"],
      listTitle: "客户跟进",
      listHint: "按优先级处理关键客户",
      listItems: [
        { title: "星河科技", subtitle: "续约沟通", status: "高优先级" },
        { title: "云启软件", subtitle: "方案确认", status: "进行中" },
        { title: "蓝海集团", subtitle: "合同审批", status: "待处理" },
      ],
      detailTitle: "星河科技续约项目",
      detailStatus: "高优先级",
      detailHint: "下一步：发送正式报价",
      fields: [
        { label: "金额", value: "¥86,000" },
        { label: "负责人", value: "李经理" },
        { label: "阶段", value: "报价确认" },
        { label: "截止", value: "06/12" },
      ],
      profileMenus: ["我的审批", "我的客户", "数据报表", "系统设置"],
    },
    admin: {
      systemName: "AIMIRA Ops",
      title: "客户运营看板",
      subtitle: "集中查看客户续约、商机金额和待跟进任务。",
      pageTitles: {
        list: "客户跟进列表",
        form: "新增跟进记录",
        detail: "客户项目详情",
      } as Record<string, string>,
      kpis: [
        { label: "活跃客户", value: "2,846", trend: "+12%" },
        { label: "待跟进", value: "128", trend: "今日" },
        { label: "本月续约率", value: "86%", trend: "+6%" },
        { label: "商机金额", value: "¥1,280,000", trend: "+18%" },
      ],
      rows: [
        { name: "星河科技", stage: "续约沟通", owner: "李经理", last: "今天 10:20", status: "高优先级" },
        { name: "云启软件", stage: "方案确认", owner: "周主管", last: "昨天 18:40", status: "进行中" },
        { name: "蓝海集团", stage: "合同审批", owner: "王敏", last: "周二 14:10", status: "待处理" },
      ],
      tasks: ["华东区续约报价需确认", "3 条商机线索待分配", "Q2 报表已生成待复核"],
      alert: "3 项待处理",
    },
  };

  const overrides: Partial<typeof base> = ({
    "medical-health": {
      title: "医疗健康随访工作台",
      description: "以预约、随访、报告和患者提醒展示洁净医疗风格。",
      owner: "张医生",
      department: "健康管理中心",
      actions: ["预约", "随访", "报告", "患者"],
    },
    "finance-dashboard": {
      title: "金融资产运营看板",
      description: "以资产、风控、收益和客户确认展示可信金融风格。",
      owner: "陈顾问",
      department: "财富管理部",
      actions: ["资产", "风控", "交易", "报告"],
    },
    "local-service": {
      title: "本地生活门店运营",
      description: "以订单、优惠券、评价和门店服务展示活泼服务风格。",
      owner: "赵店长",
      department: "城市运营组",
      actions: ["订单", "券包", "评价", "门店"],
    },
    "ecommerce-operation": {
      title: "电商商家增长后台",
      description: "以订单、库存、活动和 GMV 展示商家运营风格。",
      owner: "林运营",
      department: "商家增长部",
      actions: ["订单", "库存", "活动", "直播"],
    },
    "ai-assistant": {
      title: "AI 助手协同工作台",
      description: "以会话、知识库、生成任务和审批流展示 AI Copilot 风格。",
      owner: "沈同学",
      department: "智能应用组",
      actions: ["会话", "知识", "生成", "审阅"],
    },
    "dark-dashboard": {
      title: "暗色数据监控中心",
      description: "以实时指标、风险事件和趋势监控展示暗色大屏风格。",
      owner: "值班长",
      department: "数据指挥中心",
      actions: ["监控", "告警", "链路", "报告"],
    },
  } as Partial<Record<PreviewScenario, Partial<typeof base>>>)[scenario] ?? {};

  return { ...base, ...overrides };
}

function tabIndex(page: RealPreviewPage) {
  if (page === "home") return 0;
  if (page === "list" || page === "detail") return 1;
  if (page === "profile") return 3;
  return 0;
}
