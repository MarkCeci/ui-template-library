import Link from "next/link";
import Image from "next/image";
import { Icon, type IconName } from "@/components/icon";
import { StyleCard } from "@/components/style-card";
import { styles } from "@/lib/catalog";

const featuredStyleIds = [
  "style-001-modern-saas-clean",
  "style-002-enterprise-classic-table",
  "style-030-mobile-first-enterprise",
  "style-021-ai-copilot-workspace",
];

export default function HomePage() {
  const featuredStyles = featuredStyleIds
    .map((id) => styles.find((style) => style.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="home-hero-v2">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow">
              内部 UI 风格选型工具
            </p>
          <h1>先选风格，再开始设计</h1>
          <p>
            为企业项目快速挑选 UI 风格。一张卡同时查看后台、移动端和常用组件效果，帮助业务、设计和开发快速对齐。
          </p>
          <div className="home-hero-actions">
              <Link
                href="/styles"
              className="home-hero-primary"
              >
              开始选风格
              </Link>
            <a href="#how-to-use" className="home-hero-secondary">
              查看使用方式
            </a>
          </div>
          <div className="home-hero-steps" aria-label="使用步骤">
            <span>看风格</span>
            <b>→</b>
            <span>选模板</span>
            <b>→</b>
            <span>给设计 / 开发使用</span>
          </div>
        </div>

        <div className="home-hero-showcase" aria-label="首页 UI 样张">
          <section className="hero-sample-card hero-dashboard-sample">
            <div className="hero-sample-head">
              <div>
                <span>后台运营看板</span>
                <strong>客户运营看板</strong>
              </div>
              <button type="button">查看全部</button>
            </div>
            <div className="hero-kpi-grid">
              <HeroKpi label="活跃客户" value="2,846" />
              <HeroKpi label="待跟进" value="128" />
              <HeroKpi label="续约率" value="86%" />
            </div>
            <div className="hero-dashboard-grid">
              <div className="hero-trend-card">
                <div className="hero-trend-title">
                  <span>本月趋势</span>
                  <b>+18%</b>
                </div>
                <div className="hero-mini-chart">
                  {[34, 52, 46, 68, 61, 82, 74].map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="hero-table-card">
                {[
                  ["星河科技", "高优先级"],
                  ["云启软件", "进行中"],
                  ["蓝海集团", "待处理"],
                ].map(([name, status]) => (
                  <p key={name}>
                    <span>{name}</span>
                    <b>{status}</b>
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="hero-sample-card hero-mobile-sample">
            <div className="hero-phone-status">
              <span>9:41</span>
              <span>100%</span>
            </div>
            <strong>上午好，李经理</strong>
            <p>今日待办 12</p>
            <div className="hero-phone-metrics">
              <HeroKpi label="待审批" value="4" />
              <HeroKpi label="客户跟进" value="8" />
            </div>
            <div className="hero-phone-tabs">
              {["首页", "工作台", "消息", "我的"].map((item, index) => (
                <span key={item} className={index === 0 ? "active" : ""}>{item}</span>
              ))}
            </div>
          </section>

          <section className="hero-sample-card hero-component-sample">
            <strong>组件样板</strong>
            <button type="button">Button</button>
            <span className="hero-input">Input</span>
            <div>
              <b>进行中</b>
              <b>待处理</b>
            </div>
          </section>
        </div>
      </section>

      <section className="home-capability-strip">
        <OverviewMetric
          icon="layout-grid"
          label="30+ 企业风格"
          value="覆盖后台、App、AI 工具和数据看板"
        />
        <OverviewMetric
          icon="monitor-smartphone"
          label="双端效果预览"
          value="一个风格同时看后台和移动端效果"
        />
        <OverviewMetric
          icon="workflow"
          label="设计开发对齐"
          value="沉淀 Figma、组件、Prompt 和代码入口"
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              推荐先看的风格
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              每张卡片都同时展示后台端和移动端效果，帮助团队快速判断风格方向。
            </p>
          </div>
          <Link
            href="/styles"
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            浏览全部风格
          </Link>
        </div>
        <div className="mt-5 grid gap-6 xl:grid-cols-2">
          {featuredStyles.map((style) => (
            <StyleCard key={style!.id} style={style!} />
          ))}
        </div>
      </section>

      <section id="how-to-use" className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(139,92,246,0.12),transparent_34%)]" />
        <div className="relative z-10 grid gap-5 md:grid-cols-[1fr_180px] md:items-center">
          <div>
            <p className="text-sm font-semibold text-violet-700">Brand Assistant</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              小京陪你先选方向
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              不需要先懂模板和代码，先看风格是否适合项目，再把选择交给设计、开发或 AI 继续细化。
            </p>
          </div>
          <Image
            src="/mascots/xiaojing-guide.png"
            alt="公司吉祥物小京"
            width={360}
            height={540}
            className="mx-auto h-36 w-auto object-contain drop-shadow-[0_16px_26px_rgba(43,23,111,0.18)] md:h-44"
          />
        </div>
      </section>
    </div>
  );
}

function HeroKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="hero-kpi">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function OverviewMetric({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <div className="home-capability-item">
      <span aria-hidden="true">
        <Icon icon={icon} color="currentColor" />
      </span>
      <div>
        <p>{label}</p>
        <small>{value}</small>
      </div>
    </div>
  );
}
