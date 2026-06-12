import type { StylePack } from "@/lib/catalog";

type VisualSize = "card" | "detail";
type VisualKind =
  | "ai"
  | "automation"
  | "builder"
  | "code"
  | "commerce"
  | "dashboard"
  | "darkDashboard"
  | "editorial"
  | "finance"
  | "kanban"
  | "map"
  | "marketplace"
  | "mobile"
  | "process"
  | "profile"
  | "table";

type Palette = {
  background: string;
  accent: string;
  accentSoft: string;
  panel: string;
  text: string;
  line: string;
  dark: boolean;
};

export function StyleVisual({
  style,
  size = "card",
}: {
  style: StylePack;
  size?: VisualSize;
}) {
  const kind = getVisualKind(style);
  const palette = getPalette(style, kind);
  const height = size === "detail" ? "h-[360px]" : "h-40";
  const padding = size === "detail" ? "p-6" : "p-4";

  return (
    <div
      className={`${height} overflow-hidden border-b border-slate-200 ${padding} ${palette.background}`}
    >
      <VisualShell style={style} kind={kind} palette={palette} size={size} />
    </div>
  );
}

function VisualShell({
  style,
  kind,
  palette,
  size,
}: {
  style: StylePack;
  kind: VisualKind;
  palette: Palette;
  size: VisualSize;
}) {
  const label = style.tags[0] ?? style.priority;

  return (
    <div className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${palette.panel} ${palette.text}`}
        >
          {label}
        </div>
        <div className={`h-2 w-16 rounded-full ${palette.line}`} />
      </div>
      {kind === "table" ? <TableVisual palette={palette} size={size} /> : null}
      {kind === "dashboard" ? (
        <DashboardVisual palette={palette} size={size} />
      ) : null}
      {kind === "darkDashboard" ? (
        <DarkDashboardVisual palette={palette} size={size} />
      ) : null}
      {kind === "mobile" ? <MobileVisual palette={palette} size={size} /> : null}
      {kind === "ai" ? <AiVisual palette={palette} size={size} /> : null}
      {kind === "kanban" ? <KanbanVisual palette={palette} size={size} /> : null}
      {kind === "process" ? (
        <ProcessVisual palette={palette} size={size} />
      ) : null}
      {kind === "commerce" ? (
        <CommerceVisual palette={palette} size={size} />
      ) : null}
      {kind === "finance" ? (
        <FinanceVisual palette={palette} size={size} />
      ) : null}
      {kind === "map" ? <MapVisual palette={palette} size={size} /> : null}
      {kind === "editorial" ? (
        <EditorialVisual palette={palette} size={size} />
      ) : null}
      {kind === "profile" ? (
        <ProfileVisual palette={palette} size={size} />
      ) : null}
      {kind === "automation" ? (
        <AutomationVisual palette={palette} size={size} />
      ) : null}
      {kind === "builder" ? (
        <BuilderVisual palette={palette} size={size} />
      ) : null}
      {kind === "code" ? <CodeVisual palette={palette} size={size} /> : null}
      {kind === "marketplace" ? (
        <MarketplaceVisual palette={palette} size={size} />
      ) : null}
    </div>
  );
}

function TableVisual({ palette, size }: VisualProps) {
  const rows = size === "detail" ? 7 : 4;
  return (
    <Panel palette={palette}>
      <div className="flex items-center justify-between">
        <div className={`h-4 w-28 rounded-full ${palette.line}`} />
        <div className={`h-8 w-20 rounded-md ${palette.accent}`} />
      </div>
      <div className="mt-5 grid gap-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.1fr_0.8fr_0.9fr_0.6fr] gap-2"
          >
            <div className={`h-3 rounded-full ${palette.line}`} />
            <div className={`h-3 rounded-full ${palette.line}`} />
            <div className={`h-3 rounded-full ${palette.line}`} />
            <div className={`h-3 rounded-full ${index % 2 ? palette.accentSoft : palette.line}`} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DashboardVisual({ palette, size }: VisualProps) {
  return (
    <div className="grid h-[calc(100%-2rem)] grid-cols-[0.9fr_1.2fr] gap-3">
      <Panel palette={palette}>
        <div className={`h-4 w-20 rounded-full ${palette.line}`} />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className={`h-16 rounded-lg ${palette.accentSoft}`} />
          <div className={`h-16 rounded-lg ${palette.line}`} />
          {size === "detail" ? (
            <>
              <div className={`h-16 rounded-lg ${palette.line}`} />
              <div className={`h-16 rounded-lg ${palette.accentSoft}`} />
            </>
          ) : null}
        </div>
      </Panel>
      <Panel palette={palette}>
        <div className={`h-4 w-24 rounded-full ${palette.line}`} />
        <div className="mt-6 flex h-24 items-end gap-2">
          {[42, 72, 52, 88, 64, 102].map((height, index) => (
            <div
              key={height}
              className={`w-full rounded-t-md ${index % 2 ? palette.accent : palette.accentSoft}`}
              style={{ height: size === "detail" ? height : height * 0.62 }}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function DarkDashboardVisual({ palette, size }: VisualProps) {
  return (
    <div className="grid h-[calc(100%-2rem)] grid-cols-[1.2fr_0.8fr] gap-3">
      <div className="rounded-xl border border-white/10 bg-slate-950/72 p-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 rounded-full bg-white/20" />
          <div className={`h-7 w-16 rounded-md ${palette.accent}`} />
        </div>
        <div className="mt-6 flex h-28 items-end gap-2">
          {[58, 96, 64, 122, 80, 104].map((height) => (
            <div
              key={height}
              className={`w-full rounded-t ${palette.accent}`}
              style={{ height: size === "detail" ? height : height * 0.52 }}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-3">
        <div className="rounded-xl border border-white/10 bg-white/10 p-3">
          <div className="h-3 w-16 rounded-full bg-white/20" />
          <div className="mt-4 h-10 rounded-lg bg-white/10" />
        </div>
        <div className="rounded-xl border border-white/10 bg-white/10 p-3">
          <div className="h-3 w-20 rounded-full bg-white/20" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className={`h-9 rounded-lg ${palette.accent}`} />
            <div className="h-9 rounded-lg bg-white/10" />
            <div className="h-9 rounded-lg bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileVisual({ palette, size }: VisualProps) {
  return (
    <div className="flex h-[calc(100%-2rem)] items-end justify-center gap-4">
      <div
        className={`flex h-full max-h-72 w-36 flex-col rounded-[1.6rem] border border-white/60 ${palette.panel} p-3 shadow-xl shadow-slate-900/10`}
      >
        <div className={`mx-auto h-1.5 w-12 rounded-full ${palette.line}`} />
        <div className={`mt-4 h-20 rounded-2xl ${palette.accent}`} />
        <div className="mt-4 grid gap-2">
          <div className={`h-3 rounded-full ${palette.line}`} />
          <div className={`h-3 w-3/4 rounded-full ${palette.line}`} />
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2">
          <div className={`h-8 rounded-xl ${palette.accentSoft}`} />
          <div className={`h-8 rounded-xl ${palette.line}`} />
          <div className={`h-8 rounded-xl ${palette.line}`} />
        </div>
      </div>
      {size === "detail" ? (
        <div className="mb-8 hidden w-56 rounded-xl border border-white/60 bg-white/70 p-4 shadow-sm md:block">
          <div className={`h-4 w-24 rounded-full ${palette.line}`} />
          <div className="mt-4 grid gap-3">
            <div className={`h-14 rounded-lg ${palette.accentSoft}`} />
            <div className={`h-14 rounded-lg ${palette.line}`} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AiVisual({ palette, size }: VisualProps) {
  return (
    <div className="grid h-[calc(100%-2rem)] grid-cols-[0.72fr_1fr] gap-3">
      <Panel palette={palette}>
        <div className={`h-4 w-24 rounded-full ${palette.line}`} />
        <div className="mt-5 grid gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className={`h-10 rounded-lg ${item === 0 ? palette.accentSoft : palette.line}`} />
          ))}
        </div>
      </Panel>
      <Panel palette={palette}>
        <div className="grid gap-3">
          <div className={`ml-auto h-8 w-3/4 rounded-2xl rounded-tr-sm ${palette.accent}`} />
          <div className={`h-8 w-2/3 rounded-2xl rounded-tl-sm ${palette.line}`} />
          <div className={`ml-auto h-8 w-4/5 rounded-2xl rounded-tr-sm ${palette.accentSoft}`} />
          {size === "detail" ? (
            <div className={`h-16 rounded-xl border border-slate-200/50 ${palette.line}`} />
          ) : null}
        </div>
      </Panel>
    </div>
  );
}

function KanbanVisual({ palette, size }: VisualProps) {
  const columns = size === "detail" ? 4 : 3;
  return (
    <div className={`grid h-[calc(100%-2rem)] gap-3`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: columns }).map((_, column) => (
        <Panel key={column} palette={palette}>
          <div className={`h-3 w-16 rounded-full ${palette.line}`} />
          <div className="mt-4 grid gap-2">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className={`h-11 rounded-lg ${item === column % 3 ? palette.accentSoft : palette.line}`}
              />
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

function ProcessVisual({ palette }: VisualProps) {
  return (
    <Panel palette={palette}>
      <div className="flex h-full items-center justify-between gap-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="flex flex-1 items-center gap-2">
            <div className={`h-16 flex-1 rounded-xl ${item === 1 ? palette.accent : palette.accentSoft}`} />
            {item < 3 ? <div className={`h-1 w-6 rounded-full ${palette.line}`} /> : null}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function CommerceVisual({ palette }: VisualProps) {
  return (
    <div className="grid h-[calc(100%-2rem)] grid-cols-[0.8fr_1fr] gap-3">
      <Panel palette={palette}>
        <div className={`h-20 rounded-xl ${palette.accentSoft}`} />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className={`h-10 rounded-lg ${palette.line}`} />
          <div className={`h-10 rounded-lg ${palette.line}`} />
        </div>
      </Panel>
      <Panel palette={palette}>
        <div className="grid gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="grid grid-cols-[2.5rem_1fr] gap-2">
              <div className={`h-9 rounded-lg ${item === 0 ? palette.accent : palette.accentSoft}`} />
              <div className={`h-9 rounded-lg ${palette.line}`} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function FinanceVisual({ palette }: VisualProps) {
  return (
    <Panel palette={palette}>
      <div className="grid h-full grid-cols-[1fr_0.9fr] gap-4">
        <div>
          <div className={`h-5 w-28 rounded-full ${palette.line}`} />
          <div className="mt-4 flex items-end gap-2">
            {[80, 48, 96, 62, 112].map((height) => (
              <div key={height} className={`w-full rounded-t ${palette.accent}`} style={{ height }} />
            ))}
          </div>
        </div>
        <div className="grid gap-3">
          <div className={`rounded-xl ${palette.accentSoft}`} />
          <div className={`rounded-xl ${palette.line}`} />
        </div>
      </div>
    </Panel>
  );
}

function MapVisual({ palette }: VisualProps) {
  return (
    <Panel palette={palette}>
      <div className="relative h-full overflow-hidden rounded-xl bg-emerald-50">
        <div className="absolute left-4 top-5 h-20 w-36 rounded-full border-4 border-dashed border-emerald-300" />
        <div className="absolute right-6 top-8 h-24 w-28 rounded-full border-4 border-dashed border-violet-300" />
        <div className={`absolute left-10 top-10 h-5 w-5 rounded-full ${palette.accent}`} />
        <div className={`absolute bottom-8 right-12 h-5 w-5 rounded-full ${palette.accent}`} />
        <div className="absolute bottom-4 left-4 grid w-36 gap-2 rounded-lg bg-white/80 p-3">
          <div className="h-3 rounded-full bg-slate-200" />
          <div className="h-3 w-2/3 rounded-full bg-slate-200" />
        </div>
      </div>
    </Panel>
  );
}

function EditorialVisual({ palette }: VisualProps) {
  return (
    <div className="grid h-[calc(100%-2rem)] grid-cols-[1.1fr_0.8fr] gap-3">
      <Panel palette={palette}>
        <div className={`h-24 rounded-xl ${palette.accentSoft}`} />
        <div className="mt-4 grid gap-2">
          <div className={`h-3 rounded-full ${palette.line}`} />
          <div className={`h-3 w-3/4 rounded-full ${palette.line}`} />
        </div>
      </Panel>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className={`rounded-xl ${item === 0 ? palette.accent : palette.panel}`} />
        ))}
      </div>
    </div>
  );
}

function ProfileVisual({ palette }: VisualProps) {
  return (
    <Panel palette={palette}>
      <div className="grid h-full grid-cols-[0.75fr_1fr] gap-4">
        <div className="grid place-items-center">
          <div className={`h-24 w-24 rounded-full ${palette.accentSoft}`} />
        </div>
        <div className="grid gap-3">
          <div className={`h-4 w-28 rounded-full ${palette.line}`} />
          <div className={`h-12 rounded-lg ${palette.line}`} />
          <div className={`h-12 rounded-lg ${palette.accentSoft}`} />
        </div>
      </div>
    </Panel>
  );
}

function AutomationVisual({ palette }: VisualProps) {
  return (
    <Panel palette={palette}>
      <div className="relative h-full">
        <div className={`absolute left-4 top-8 h-14 w-24 rounded-xl ${palette.accentSoft}`} />
        <div className={`absolute left-1/2 top-4 h-14 w-24 -translate-x-1/2 rounded-xl ${palette.line}`} />
        <div className={`absolute bottom-5 right-5 h-14 w-24 rounded-xl ${palette.accent}`} />
        <div className="absolute left-[7rem] top-14 h-1 w-20 rotate-12 rounded-full bg-slate-300" />
        <div className="absolute right-[7rem] top-20 h-1 w-20 -rotate-12 rounded-full bg-slate-300" />
      </div>
    </Panel>
  );
}

function BuilderVisual({ palette }: VisualProps) {
  return (
    <div className="grid h-[calc(100%-2rem)] grid-cols-[0.65fr_1fr_0.75fr] gap-3">
      <Panel palette={palette}>
        <div className="grid gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className={`h-8 rounded-lg ${item === 0 ? palette.accentSoft : palette.line}`} />
          ))}
        </div>
      </Panel>
      <Panel palette={palette}>
        <div className={`h-full rounded-xl border-2 border-dashed border-slate-300 ${palette.accentSoft}`} />
      </Panel>
      <Panel palette={palette}>
        <div className="grid gap-3">
          <div className={`h-4 rounded-full ${palette.line}`} />
          <div className={`h-9 rounded-lg ${palette.line}`} />
          <div className={`h-9 rounded-lg ${palette.accentSoft}`} />
        </div>
      </Panel>
    </div>
  );
}

function CodeVisual({ palette }: VisualProps) {
  return (
    <Panel palette={palette}>
      <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-4">
        <div className="grid gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className={`h-8 rounded-lg ${item === 1 ? palette.accentSoft : palette.line}`} />
          ))}
        </div>
        <div className="rounded-xl bg-slate-950 p-4">
          <div className="grid gap-2">
            <div className="h-3 w-28 rounded-full bg-cyan-400/70" />
            <div className="h-3 w-40 rounded-full bg-white/20" />
            <div className="h-3 w-24 rounded-full bg-emerald-400/70" />
            <div className="h-3 w-36 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function MarketplaceVisual({ palette }: VisualProps) {
  return (
    <div className="grid h-[calc(100%-2rem)] grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, item) => (
        <div
          key={item}
          className={`rounded-xl border border-white/60 ${item === 0 ? palette.accent : palette.panel} p-3 shadow-sm`}
        >
          <div className={`h-7 w-7 rounded-lg ${item === 0 ? "bg-white/30" : palette.accentSoft}`} />
          <div className={`mt-3 h-2 rounded-full ${item === 0 ? "bg-white/40" : palette.line}`} />
        </div>
      ))}
    </div>
  );
}

type VisualProps = {
  palette: Palette;
  size: VisualSize;
};

function Panel({
  palette,
  children,
}: {
  palette: Palette;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`h-full rounded-xl border border-white/60 p-4 shadow-sm ${palette.panel}`}
    >
      {children}
    </div>
  );
}

export function getVisualKind(style: StylePack): VisualKind {
  const content = `${style.id} ${style.name} ${style.category} ${style.visual} ${style.tokens} ${style.tags.join(" ")}`.toLowerCase();

  if (content.match(/copilot|chat|智能助手|对话/)) return "ai";
  if (content.match(/automation|agent|rpa|画布|节点/)) return "automation";
  if (content.match(/lowcode|builder|editor|搭建|三栏/)) return "builder";
  if (content.match(/developer|api|sdk|code|console|代码|终端/)) return "code";
  if (content.match(/marketplace|plugin|app-store|插件|市场/)) return "marketplace";
  if (content.match(/mobile|ios|material|app|移动|跨端/)) return "mobile";
  if (content.match(/dark|dataviz|dashboard|soc|security|iot|大屏|监控|安全/)) return "darkDashboard";
  if (content.match(/table|crud|erp|dense|表格|列表|权限/)) return "table";
  if (content.match(/kanban|project|issue|agile|看板/)) return "kanban";
  if (content.match(/process|workflow|sap|审批|流程/)) return "process";
  if (content.match(/commerce|merchant|orders|inventory|商品|订单|商家/)) return "commerce";
  if (content.match(/fintech|payment|account|risk|金融|支付|账户|风控/)) return "finance";
  if (content.match(/logistics|map|dispatch|tracking|地图|物流/)) return "map";
  if (content.match(/cms|media|asset|editorial|内容|素材/)) return "editorial";
  if (content.match(/hr|people|organization|healthcare|education|government|员工|患者|课程|政务/)) return "profile";
  return "dashboard";
}

function getPalette(style: StylePack, kind: VisualKind): Palette {
  const content = `${style.id} ${style.category} ${style.tokens} ${style.tags.join(" ")}`.toLowerCase();

  if (kind === "darkDashboard" || content.includes("dark")) {
    return {
      background: "bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950",
      accent: "bg-cyan-400",
      accentSoft: "bg-cyan-400/20",
      panel: "bg-white/10",
      text: "text-cyan-100",
      line: "bg-white/18",
      dark: true,
    };
  }

  if (content.match(/finance|payment|risk|trust|account/)) {
    return makeLightPalette("from-violet-50 via-white to-emerald-50", "bg-emerald-600", "bg-emerald-100");
  }

  if (content.match(/commerce|merchant|marketing|marketplace|campaign/)) {
    return makeLightPalette("from-orange-50 via-white to-amber-50", "bg-amber-500", "bg-amber-100");
  }

  if (content.match(/ai|copilot|agent|automation|builder|developer/)) {
    return makeLightPalette("from-violet-50 via-white to-violet-50", "bg-violet-600", "bg-violet-100");
  }

  if (content.match(/healthcare|education|hr|people|government|logistics/)) {
    return makeLightPalette("from-teal-50 via-white to-sky-50", "bg-teal-600", "bg-teal-100");
  }

  return makeLightPalette("from-violet-50 via-white to-slate-100", "bg-violet-600", "bg-violet-100");
}

function makeLightPalette(
  gradient: string,
  accent: string,
  accentSoft: string,
): Palette {
  return {
    background: `bg-gradient-to-br ${gradient}`,
    accent,
    accentSoft,
    panel: "bg-white/82",
    text: "text-slate-700",
    line: "bg-slate-200",
    dark: false,
  };
}
