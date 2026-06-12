import type { ReactNode } from "react";
import type { StylePack, TemplateItem } from "@/lib/catalog";

export type CoverPreset =
  | "style-saas-clean"
  | "style-enterprise-table"
  | "style-dark-dashboard"
  | "style-ai-copilot"
  | "style-mobile-workbench"
  | "admin-list"
  | "admin-dashboard"
  | "admin-form"
  | "admin-detail"
  | "admin-approval"
  | "app-home"
  | "app-list"
  | "app-detail"
  | "component-board";

export function CoverPreview({ preset }: { preset: CoverPreset }) {
  return (
    <div className="aspect-video overflow-hidden border-b border-slate-200 bg-slate-100">
      {preset === "style-saas-clean" ? <SaasCleanCover /> : null}
      {preset === "style-enterprise-table" ? <EnterpriseTableCover /> : null}
      {preset === "style-dark-dashboard" ? <DarkDashboardCover /> : null}
      {preset === "style-ai-copilot" ? <AiCopilotCover /> : null}
      {preset === "style-mobile-workbench" ? <MobileWorkbenchCover /> : null}
      {preset === "admin-list" ? <AdminListCover /> : null}
      {preset === "admin-dashboard" ? <AdminDashboardCover /> : null}
      {preset === "admin-form" ? <AdminFormCover /> : null}
      {preset === "admin-detail" ? <AdminDetailCover /> : null}
      {preset === "admin-approval" ? <AdminApprovalCover /> : null}
      {preset === "app-home" ? <AppHomeCover /> : null}
      {preset === "app-list" ? <AppListCover /> : null}
      {preset === "app-detail" ? <AppDetailCover /> : null}
      {preset === "component-board" ? <ComponentBoardCover /> : null}
    </div>
  );
}

export function getStyleCoverPreset(style: StylePack): CoverPreset {
  const text = [
    style.id,
    style.name,
    style.category,
    style.scenario,
    style.visual,
    style.tokens,
    ...style.tags,
  ]
    .join(" ")
    .toLowerCase();

  if (matches(text, ["ai", "copilot", "assistant", "agent", "chat", "助手", "智能", "对话"])) {
    return "style-ai-copilot";
  }

  if (matches(text, ["dark", "dashboard", "dataviz", "visualization", "大屏", "深色", "监控", "可视化"])) {
    return "style-dark-dashboard";
  }

  if (matches(text, ["mobile", "app", "workbench", "ios", "移动", "手机", "轻办公"])) {
    return "style-mobile-workbench";
  }

  if (matches(text, ["table", "crud", "dense", "enterprise", "antd", "carbon", "表格", "列表", "数据密集"])) {
    return "style-enterprise-table";
  }

  if (matches(text, ["approval", "workflow", "process", "sap", "审批", "流程"])) {
    return "admin-approval";
  }

  if (matches(text, ["form", "builder", "setting", "white-label", "tenant", "表单", "配置", "换肤"])) {
    return "admin-form";
  }

  if (matches(text, ["saas", "minimal", "clean", "card", "极简", "现代", "留白"])) {
    return "style-saas-clean";
  }

  return "admin-dashboard";
}

export function getTemplateCoverPreset(template: TemplateItem): CoverPreset {
  const text = [
    template.id,
    template.name,
    template.platform,
    template.type,
    template.scene,
    template.description,
    template.preview_type,
    ...template.components,
    ...template.ai_tags,
  ]
    .join(" ")
    .toLowerCase();

  if (matches(text, ["component", "组件", "pattern"])) {
    return "component-board";
  }

  if (matches(text, ["ai", "copilot", "assistant", "agent", "chat", "助手", "对话"])) {
    return "style-ai-copilot";
  }

  if (matches(text, ["dark", "大屏", "深色", "dataviz", "visualization", "监控"])) {
    return "style-dark-dashboard";
  }

  if (matches(text, ["approval", "workflow", "process", "审批", "流程"])) {
    return "admin-approval";
  }

  if (matches(text, ["app-home", "app home", "mobile workbench", "移动工作台", "移动首页", "app 首页"])) {
    return "app-home";
  }

  if (matches(text, ["app-list", "app list", "mobile list", "移动列表", "消息列表"])) {
    return "app-list";
  }

  if (matches(text, ["app-detail", "app detail", "mobile detail", "移动详情"])) {
    return "app-detail";
  }

  if (matches(text, ["mobile", "app", "手机", "移动"])) {
    return "app-home";
  }

  if (matches(text, ["list", "table", "列表", "表格", "订单", "客户", "资源"])) {
    return "admin-list";
  }

  if (matches(text, ["form", "表单", "创建", "配置", "设置"])) {
    return "admin-form";
  }

  if (matches(text, ["detail", "详情", "对象", "记录", "报告"])) {
    return "admin-detail";
  }

  if (matches(text, ["dashboard", "看板", "概览", "工作台", "分析", "首页"])) {
    return "admin-dashboard";
  }

  return "admin-dashboard";
}

function matches(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function SaasCleanCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-white via-violet-50 to-slate-100">
      <div className="grid h-full grid-cols-[42px_1fr] gap-3 rounded-lg border border-white/80 bg-white/86 p-3 shadow-sm">
        <div className="rounded-md bg-slate-950 p-2">
          <div className="h-5 rounded bg-white/90" />
          <div className="mt-4 grid gap-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-2 rounded-full bg-white/24" />
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <TopMiniBar />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MetricCard tone="violet" />
            <MetricCard tone="slate" />
            <MetricCard tone="emerald" />
          </div>
          <div className="mt-3 grid grid-cols-[1.2fr_0.8fr] gap-2">
            <LineChartCard />
            <div className="rounded-md border border-slate-100 bg-slate-50 p-2">
              <div className="h-2 w-14 rounded-full bg-slate-300" />
              <div className="mt-3 grid gap-1.5">
                {[52, 74, 44].map((width) => (
                  <div key={width} className="h-2 rounded-full bg-violet-200" style={{ width }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CoverCanvas>
  );
}

function EnterpriseTableCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-slate-100 via-white to-violet-50">
      <div className="h-full rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
        <TopMiniBar dense />
        <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-md bg-slate-50 p-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-5 rounded border border-slate-200 bg-white" />
          ))}
        </div>
        <div className="mt-2 overflow-hidden rounded-md border border-slate-200">
          <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.7fr] gap-px bg-slate-200">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-5 bg-slate-100 px-2 py-1">
                <div className="h-1.5 rounded-full bg-slate-300" />
              </div>
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.7fr] gap-px bg-slate-100">
              {[0, 1, 2, 3].map((cell) => (
                <div key={cell} className="h-5 bg-white px-2 py-1.5">
                  <div className={cell === 3 ? "h-1.5 rounded-full bg-violet-200" : "h-1.5 rounded-full bg-slate-200"} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <PaginationDots />
      </div>
    </CoverCanvas>
  );
}

function DarkDashboardCover() {
  return (
    <CoverCanvas className="bg-[radial-gradient(circle_at_25%_20%,rgba(139,92,246,0.34),transparent_32%),linear-gradient(135deg,#07111f,#140b33_58%,#050816)]">
      <div className="grid h-full grid-cols-[1.15fr_0.85fr] gap-2.5 rounded-lg border border-violet-300/25 bg-slate-950/60 p-3 shadow-[0_0_34px_rgba(124,58,237,0.22)]">
        <div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((item) => (
              <div key={item} className="rounded-md border border-cyan-300/20 bg-white/5 p-2">
                <div className="h-1.5 w-10 rounded-full bg-cyan-300/70" />
                <div className="mt-2 h-4 w-12 rounded bg-white/18" />
              </div>
            ))}
          </div>
          <div className="mt-2.5 rounded-md border border-violet-300/20 bg-white/5 p-2">
            <div className="flex h-16 items-end gap-1.5">
              {[30, 52, 42, 72, 46, 82, 58].map((height) => (
                <div key={height} className="w-full rounded-t bg-cyan-300/80 shadow-[0_0_12px_rgba(103,232,249,0.35)]" style={{ height }} />
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-2.5">
          <div className="rounded-md border border-violet-300/20 bg-white/5 p-2">
            <Donut dark />
          </div>
          <div className="rounded-md border border-violet-300/20 bg-white/5 p-2">
            {[72, 54, 40, 64].map((width) => (
              <div key={width} className="mt-1.5 h-1.5 rounded-full bg-violet-300/70" style={{ width }} />
            ))}
          </div>
        </div>
      </div>
    </CoverCanvas>
  );
}

function AiCopilotCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-violet-50 via-white to-cyan-50">
      <div className="grid h-full grid-cols-[0.72fr_1.2fr_0.8fr] gap-2 rounded-lg border border-violet-100 bg-white/88 p-3 shadow-sm">
        <div className="rounded-md bg-slate-950 p-2">
          <div className="h-3 w-16 rounded-full bg-white/82" />
          <div className="mt-3 grid gap-1.5">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className={item === 0 ? "h-7 rounded bg-violet-500/85" : "h-7 rounded bg-white/12"} />
            ))}
          </div>
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50 p-2">
          <div className="h-3 w-20 rounded-full bg-slate-300" />
          <div className="mt-3 grid gap-2">
            <ChatBubble align="left" />
            <ChatBubble align="right" />
            <ChatBubble align="left" short />
          </div>
          <div className="mt-3 rounded-full border border-violet-200 bg-white px-2 py-1">
            <div className="h-2 rounded-full bg-violet-200" />
          </div>
        </div>
        <div className="grid gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-md border border-slate-100 bg-white p-2">
              <div className="h-2 w-14 rounded-full bg-slate-300" />
              <div className="mt-2 h-2 rounded-full bg-violet-100" />
              <div className="mt-1 h-2 w-3/4 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </CoverCanvas>
  );
}

function MobileWorkbenchCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-slate-100 via-white to-violet-100">
      <PhoneFrame>
        <div className="rounded-xl bg-gradient-to-r from-violet-700 to-violet-500 p-3">
          <div className="h-2 w-20 rounded-full bg-white/80" />
          <div className="mt-2 h-2 w-14 rounded-full bg-white/45" />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-8 rounded-lg bg-violet-50 ring-1 ring-violet-100" />
          ))}
        </div>
        <div className="mt-2 grid gap-1.5">
          {[0, 1].map((item) => (
            <div key={item} className="h-8 rounded-lg border border-slate-100 bg-white p-1.5">
              <div className="h-1.5 w-20 rounded-full bg-slate-300" />
              <div className="mt-1.5 h-1.5 w-12 rounded-full bg-violet-200" />
            </div>
          ))}
        </div>
      </PhoneFrame>
    </CoverCanvas>
  );
}

function AdminListCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-slate-100 to-white">
      <DesktopShell>
        <div className="rounded-md bg-slate-50 p-2">
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-5 rounded border border-slate-200 bg-white" />
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="h-3 w-24 rounded-full bg-slate-300" />
          <div className="h-6 w-14 rounded bg-violet-600" />
        </div>
        <MiniTable rows={4} />
        <PaginationDots />
      </DesktopShell>
    </CoverCanvas>
  );
}

function AdminDashboardCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-violet-50 via-white to-slate-100">
      <DesktopShell>
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <MetricCard key={item} tone={item === 0 ? "violet" : item === 2 ? "emerald" : "slate"} />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-[1.35fr_0.65fr] gap-2">
          <LineChartCard tall />
          <div className="grid gap-2">
            <Donut />
            <RankList />
          </div>
        </div>
      </DesktopShell>
    </CoverCanvas>
  );
}

function AdminFormCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-white via-slate-50 to-violet-50">
      <DesktopShell>
        <div className="h-3 w-28 rounded-full bg-slate-300" />
        <div className="mt-3 rounded-md border border-slate-100 bg-slate-50 p-2">
          <div className="h-2 w-20 rounded-full bg-violet-300" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-7 rounded border border-slate-200 bg-white" />
            ))}
          </div>
        </div>
        <div className="mt-2 rounded-md border border-slate-100 bg-white p-2">
          <div className="h-2 w-16 rounded-full bg-slate-300" />
          <div className="mt-2 h-12 rounded border border-slate-200 bg-slate-50" />
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <div className="h-6 w-12 rounded border border-slate-200 bg-white" />
          <div className="h-6 w-12 rounded bg-violet-600" />
        </div>
      </DesktopShell>
    </CoverCanvas>
  );
}

function AdminDetailCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <DesktopShell>
        <div className="flex items-start justify-between">
          <div>
            <div className="h-3 w-28 rounded-full bg-slate-300" />
            <div className="mt-2 flex gap-1.5">
              <div className="h-4 w-10 rounded-full bg-violet-100" />
              <div className="h-4 w-12 rounded-full bg-emerald-100" />
            </div>
          </div>
          <div className="h-6 w-16 rounded bg-violet-600" />
        </div>
        <div className="mt-3 grid grid-cols-[1fr_0.75fr] gap-2">
          <div className="rounded-md border border-slate-100 bg-slate-50 p-2">
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item}>
                  <div className="h-1.5 w-10 rounded-full bg-slate-300" />
                  <div className="mt-1.5 h-2 rounded-full bg-white ring-1 ring-slate-200" />
                </div>
              ))}
            </div>
          </div>
          <Timeline />
        </div>
      </DesktopShell>
    </CoverCanvas>
  );
}

function AdminApprovalCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-violet-50 via-white to-amber-50">
      <DesktopShell>
        <div className="grid grid-cols-[0.9fr_1.1fr] gap-2">
          <div className="rounded-md border border-slate-100 bg-slate-50 p-2">
            <div className="h-3 w-24 rounded-full bg-slate-300" />
            <div className="mt-3 grid gap-1.5">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-5 rounded border border-slate-200 bg-white" />
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-100 bg-white p-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className={item < 2 ? "h-5 w-5 rounded-full bg-violet-600" : "h-5 w-5 rounded-full bg-slate-200"} />
                <div className="h-2 flex-1 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <div className="h-6 w-14 rounded border border-slate-200 bg-white" />
          <div className="h-6 w-14 rounded bg-violet-600" />
        </div>
      </DesktopShell>
    </CoverCanvas>
  );
}

function AppHomeCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-white via-violet-50 to-slate-100">
      <PhoneFrame>
        <div className="rounded-xl bg-gradient-to-br from-violet-700 to-fuchsia-500 p-3">
          <div className="h-2 w-20 rounded-full bg-white/90" />
          <div className="mt-2 h-2 w-14 rounded-full bg-white/45" />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-8 rounded-lg bg-slate-50 ring-1 ring-slate-100" />
          ))}
        </div>
        <div className="mt-2 grid gap-1.5">
          {[0, 1].map((item) => (
            <div key={item} className="h-8 rounded-lg bg-white ring-1 ring-slate-100" />
          ))}
        </div>
      </PhoneFrame>
    </CoverCanvas>
  );
}

function AppListCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <PhoneFrame>
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded-full bg-slate-300" />
          <div className="h-5 w-5 rounded-full bg-violet-100" />
        </div>
        <div className="mt-2 flex gap-1.5">
          {[0, 1, 2].map((item) => (
            <div key={item} className={item === 0 ? "h-5 flex-1 rounded-full bg-violet-600" : "h-5 flex-1 rounded-full bg-slate-100"} />
          ))}
        </div>
        <div className="mt-2 grid gap-1.5">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-8 rounded-lg border border-slate-100 bg-white p-1.5">
              <div className="h-1.5 w-20 rounded-full bg-slate-300" />
              <div className="mt-1.5 h-1.5 w-12 rounded-full bg-violet-200" />
            </div>
          ))}
        </div>
      </PhoneFrame>
    </CoverCanvas>
  );
}

function AppDetailCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-violet-50 via-white to-slate-100">
      <PhoneFrame>
        <div className="rounded-xl bg-slate-950 p-3">
          <div className="h-2 w-20 rounded-full bg-white/80" />
          <div className="mt-2 h-4 w-14 rounded bg-violet-400" />
        </div>
        <div className="mt-2 rounded-lg border border-slate-100 bg-white p-2">
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-4 rounded bg-slate-50" />
            ))}
          </div>
        </div>
        <Timeline compact />
      </PhoneFrame>
    </CoverCanvas>
  );
}

function ComponentBoardCover() {
  return (
    <CoverCanvas className="bg-gradient-to-br from-white via-slate-50 to-violet-50">
      <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid gap-2">
          <div className="rounded-md bg-violet-600 p-2">
            <div className="h-2 rounded-full bg-white/85" />
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-2">
            <div className="h-2 rounded-full bg-slate-300" />
          </div>
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-2">
            <div className="h-2 rounded-full bg-slate-300" />
          </div>
        </div>
        <div className="grid gap-2">
          <div className="h-8 rounded-md border border-slate-200 bg-white p-2">
            <div className="h-2 w-24 rounded-full bg-slate-300" />
          </div>
          <MiniTable rows={3} />
          <div className="rounded-md border border-violet-100 bg-violet-50 p-2">
            <div className="h-2 w-16 rounded-full bg-violet-300" />
            <div className="mt-2 h-8 rounded bg-white" />
          </div>
        </div>
      </div>
    </CoverCanvas>
  );
}

function CoverCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return <div className={`h-full w-full p-3 ${className}`}>{children}</div>;
}

function DesktopShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-full rounded-lg border border-white/80 bg-white/92 p-3 shadow-sm">
      <TopMiniBar dense />
      {children}
    </div>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-full w-[42%] min-w-[118px] max-w-[150px] flex-col overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-950 p-1.5 shadow-xl shadow-slate-900/12">
      <div className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-white/35" />
      <div className="min-h-0 flex-1 overflow-hidden rounded-[1rem] bg-white p-2">{children}</div>
      <div className="mt-1 grid grid-cols-4 gap-1 px-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className={item === 0 ? "h-1 rounded-full bg-violet-300" : "h-1 rounded-full bg-white/20"} />
        ))}
      </div>
    </div>
  );
}

function TopMiniBar({ dense = false }: { dense?: boolean }) {
  return (
    <div className={dense ? "mb-2 flex items-center justify-between" : "flex items-center justify-between"}>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
      </div>
      <div className="h-2 w-16 rounded-full bg-slate-200" />
    </div>
  );
}

function MetricCard({ tone }: { tone: "violet" | "slate" | "emerald" }) {
  const toneClass = {
    violet: "bg-violet-50 ring-violet-100 [&_span]:bg-violet-500",
    slate: "bg-slate-50 ring-slate-100 [&_span]:bg-slate-400",
    emerald: "bg-emerald-50 ring-emerald-100 [&_span]:bg-emerald-500",
  }[tone];

  return (
    <div className={`rounded-md p-2 ring-1 ${toneClass}`}>
      <span className="block h-2 w-10 rounded-full" />
      <div className="mt-2 h-4 w-12 rounded bg-white/75" />
    </div>
  );
}

function LineChartCard({ tall = false }: { tall?: boolean }) {
  return (
    <div className="rounded-md border border-slate-100 bg-white p-2">
      <div className="h-2 w-16 rounded-full bg-slate-300" />
      <div className={`mt-2 flex ${tall ? "h-16" : "h-12"} items-end gap-1.5`}>
        {[22, 44, 34, 58, 42, 68].map((height) => (
          <div key={height} className="w-full rounded-t bg-violet-400" style={{ height }} />
        ))}
      </div>
    </div>
  );
}

function Donut({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid place-items-center">
      <div
        className={`h-12 w-12 rounded-full ${dark ? "bg-[conic-gradient(#67e8f9_0_36%,#a78bfa_36%_72%,rgba(255,255,255,0.14)_72%)]" : "bg-[conic-gradient(#7c3aed_0_42%,#10b981_42%_68%,#e5e7eb_68%)]"} p-2`}
      >
        <div className={dark ? "h-full rounded-full bg-slate-950" : "h-full rounded-full bg-white"} />
      </div>
    </div>
  );
}

function RankList() {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50 p-2">
      {[64, 48, 72].map((width) => (
        <div key={width} className="mt-1 h-1.5 rounded-full bg-violet-200" style={{ width }} />
      ))}
    </div>
  );
}

function MiniTable({ rows }: { rows: number }) {
  return (
    <div className="mt-2 overflow-hidden rounded-md border border-slate-200">
      <div className="grid grid-cols-[1.1fr_0.8fr_0.8fr] gap-px bg-slate-200">
        {[0, 1, 2].map((cell) => (
          <div key={cell} className="h-4 bg-slate-100 px-1.5 py-1">
            <div className="h-1 rounded-full bg-slate-300" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid grid-cols-[1.1fr_0.8fr_0.8fr] gap-px bg-slate-100">
          {[0, 1, 2].map((cell) => (
            <div key={cell} className="h-5 bg-white px-1.5 py-1.5">
              <div className={cell === 2 ? "h-1.5 rounded-full bg-violet-200" : "h-1.5 rounded-full bg-slate-200"} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PaginationDots() {
  return (
    <div className="mt-2 flex justify-end gap-1">
      {[0, 1, 2].map((item) => (
        <span key={item} className={item === 0 ? "h-2 w-4 rounded-full bg-violet-500" : "h-2 w-2 rounded-full bg-slate-200"} />
      ))}
    </div>
  );
}

function ChatBubble({ align, short = false }: { align: "left" | "right"; short?: boolean }) {
  return (
    <div
      className={`${align === "right" ? "ml-auto bg-violet-600" : "bg-white ring-1 ring-slate-100"} h-7 rounded-2xl ${
        short ? "w-1/2" : "w-3/4"
      }`}
    />
  );
}

function Timeline({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mt-2 grid gap-1.5" : "rounded-md border border-slate-100 bg-white p-2"}>
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex items-center gap-2">
          <div className={item === 0 ? "h-4 w-4 rounded-full bg-violet-600" : "h-4 w-4 rounded-full bg-slate-200"} />
          <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
