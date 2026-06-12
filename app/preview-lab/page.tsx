import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { RealScenarioPreview } from "@/components/real-scenario-preview";
import { getStyleById } from "@/lib/catalog";
import { normalizeStyle, type PreviewScenario } from "@/lib/style-theme";

const scenarioCases: {
  scenario: PreviewScenario;
  name: string;
  stylePackId: string;
  note: string;
}[] = [
  {
    scenario: "enterprise-workbench",
    name: "企业轻办公 / SaaS 工作台",
    stylePackId: "style-001-modern-saas-clean",
    note: "现代 SaaS 极简风",
  },
  {
    scenario: "saas-admin-list",
    name: "企业后台表格列表",
    stylePackId: "style-002-enterprise-classic-table",
    note: "企业经典表格风",
  },
  {
    scenario: "dark-dashboard",
    name: "暗色数据监控中心",
    stylePackId: "style-024-dark-dataviz-dashboard",
    note: "深色数据可视化大屏风",
  },
  {
    scenario: "ai-assistant",
    name: "AI 助手协同工作台",
    stylePackId: "style-021-ai-copilot-workspace",
    note: "AI Copilot 助手工作台风",
  },
  {
    scenario: "mobile-workbench",
    name: "移动优先企业轻办公",
    stylePackId: "style-030-mobile-first-enterprise",
    note: "移动优先企业轻办公风",
  },
  {
    scenario: "medical-health",
    name: "医疗健康随访工作台",
    stylePackId: "style-013-healthcare-clean",
    note: "医疗洁净蓝绿风",
  },
  {
    scenario: "finance-dashboard",
    name: "金融资产运营看板",
    stylePackId: "style-011-fintech-trust",
    note: "金融科技可信风",
  },
  {
    scenario: "local-service",
    name: "本地生活门店运营",
    stylePackId: "style_local_life_meituan_yellow",
    note: "本地生活明黄风",
  },
  {
    scenario: "ecommerce-operation",
    name: "电商商家增长后台",
    stylePackId: "style-008-polars-merchant-ops",
    note: "商家运营管理风",
  },
];

export default function PreviewLabPage() {
  return (
    <PageShell
      eyebrow="Preview Lab"
      title="真实场景预览实验室"
      description="集中验收所有真实业务场景预览。每个场景都复用同一套预览系统，并通过 stylePackId 读取当前风格 token。"
      actions={
        <Link
          href="/styles"
          className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          返回风格广场
        </Link>
      }
    >
      <section className="grid gap-6">
        {scenarioCases.map((item) => {
          const sourceStyle = getStyleById(item.stylePackId);
          if (!sourceStyle) return null;
          const style = normalizeStyle(sourceStyle);

          return (
            <article key={item.scenario} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                    {item.scenario}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">{item.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    当前使用：{item.stylePackId} · {item.note}
                  </p>
                </div>
                <Link
                  href={`/styles/${item.stylePackId}`}
                  className="w-fit rounded-md bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                >
                  查看对应风格
                </Link>
              </div>
              <RealScenarioPreview
                style={style}
                scenario={item.scenario}
                stylePackId={item.stylePackId}
                tokenModes={[sourceStyle.tokens]}
                showControls
                showPlatformTabs
              />
            </article>
          );
        })}
      </section>
    </PageShell>
  );
}
