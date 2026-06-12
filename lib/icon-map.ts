export type IconName =
  | "layout-grid"
  | "monitor-smartphone"
  | "workflow"
  | "table"
  | "bar-chart"
  | "search"
  | "filter"
  | "user"
  | "users"
  | "message"
  | "settings"
  | "check-circle"
  | "info-circle"
  | "alert-circle"
  | "layers"
  | "copy"
  | "link"
  | "pen-tool"
  | "approval"
  | "customer"
  | "report"
  | "task"
  | "calendar"
  | "refresh"
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
  | "monitor"
  | "lead"
  | "home"
  | "workbench";

type IconDefinition = {
  iconify: string;
  paths: string[];
};

const iconPathSet = {
  grid: [
    "M4.5 4.5h6v6h-6z",
    "M13.5 4.5h6v6h-6z",
    "M4.5 13.5h6v6h-6z",
    "M13.5 13.5h6v6h-6z",
  ],
  devices: [
    "M3.5 5.5h11.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H3.5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2z",
    "M7.5 19h5",
    "M10 16v3",
    "M18.5 8.5h2a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 17 18v-8a1.5 1.5 0 0 1 1.5-1.5z",
    "M18.9 17.1h1.2",
  ],
  link: [
    "M10.6 13.4a4.8 4.8 0 0 0 6.8 0l2-2a4.8 4.8 0 0 0-6.8-6.8l-1.1 1.1",
    "M13.4 10.6a4.8 4.8 0 0 0-6.8 0l-2 2a4.8 4.8 0 0 0 6.8 6.8l1.1-1.1",
    "M8.8 15.2l6.4-6.4",
  ],
  table: ["M4 5h16v14H4z", "M4 10h16", "M9 5v14", "M15 5v14"],
  chart: ["M5 19V5", "M5 19h15", "M9 16v-5", "M13 16V8", "M17 16v-9"],
  search: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "m16 16 4 4"],
  filter: ["M4 6h16", "M7 12h10", "M10 18h4"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M5 20a7 7 0 0 1 14 0"],
  users: [
    "M9.5 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
    "M3 20a6.5 6.5 0 0 1 13 0",
    "M16.5 12a3 3 0 0 0 0-6",
    "M17.5 20a5.5 5.5 0 0 0-2.2-4.4",
  ],
  message: ["M5 5h14v11H8l-3 3z", "M8 9h8", "M8 13h5"],
  settings: [
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.1L12 3H8l-.4 2.7a7 7 0 0 0-2 1.1l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 3 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.1L8 21h4l.4-2.7a7 7 0 0 0 2-1.1l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  ],
  checkCircle: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "m8.5 12 2.3 2.3 4.7-5"],
  infoCircle: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 11v5", "M12 8h.01"],
  alertCircle: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v6", "M12 16h.01"],
  layers: ["M12 3 3 8l9 5 9-5z", "m3 12 9 5 9-5", "m3 16 9 5 9-5"],
  copy: ["M8 8h11v11H8z", "M5 16H4a1 1 0 0 1-1-1V4h11v1"],
  penTool: ["M12 3 19 10l-7 11-7-11z", "M12 3v18", "M5 10h14"],
  approval: ["M7 4h8l3 3v13H7z", "M15 4v4h4", "m9 13 2 2 5-5"],
  task: ["M6 6h12", "M6 12h12", "M6 18h8", "m16 17 1.5 1.5L21 15"],
  calendar: ["M7 3v4", "M17 3v4", "M4 8h16", "M5 5h14v16H5z"],
  refresh: ["M7 7h7a5 5 0 0 1 0 10H8", "m10 4-3 3 3 3", "m14 20 3-3-3-3"],
  asset: ["M4 8 12 4l8 4-8 4z", "M6 10v7", "M10 10v7", "M14 10v7", "M18 10v7", "M4 19h16"],
  risk: ["M12 4 3 20h18z", "M12 9v5", "M12 17h.01"],
  order: ["M5 7h14v14H5z", "M8 7a4 4 0 0 1 8 0", "M8 13h8", "M8 17h5"],
  coupon: ["M4 8a2 2 0 0 0 0 4 2 2 0 0 0 0 4v2h16v-2a2 2 0 0 0 0-4 2 2 0 0 0 0-4V6H4z", "M9 9h6", "M9 15h4"],
  store: ["M5 10h14l-1-5H6z", "M6 10v10h12V10", "M9 20v-6h6v6"],
  knowledge: ["M6 4h11a2 2 0 0 1 2 2v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z", "M8 8h9", "M8 12h7"],
  generate: ["m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z", "m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"],
  monitor: ["M4 5h16v11H4z", "M9 20h6", "M12 16v4", "M7 12h3l2-4 2 6 2-3h2"],
  lead: ["M12 4v16", "M5 8h14", "M7 8c0 4 2 6 5 6s5-2 5-6", "M9 18h6"],
  home: ["m4 11 8-7 8 7", "M6 10v10h12V10", "M10 20v-6h4v6"],
};

export const iconMap: Record<IconName, IconDefinition> = {
  "layout-grid": { iconify: "icon-park-outline:grid-four", paths: iconPathSet.grid },
  "monitor-smartphone": { iconify: "icon-park-outline:devices", paths: iconPathSet.devices },
  workflow: { iconify: "icon-park-outline:link", paths: iconPathSet.link },
  table: { iconify: "icon-park-outline:table", paths: iconPathSet.table },
  "bar-chart": { iconify: "icon-park-outline:chart-histogram", paths: iconPathSet.chart },
  search: { iconify: "icon-park-outline:search", paths: iconPathSet.search },
  filter: { iconify: "icon-park-outline:filter", paths: iconPathSet.filter },
  user: { iconify: "icon-park-outline:user", paths: iconPathSet.user },
  users: { iconify: "icon-park-outline:peoples", paths: iconPathSet.users },
  message: { iconify: "icon-park-outline:message", paths: iconPathSet.message },
  settings: { iconify: "icon-park-outline:setting", paths: iconPathSet.settings },
  "check-circle": { iconify: "icon-park-outline:check-one", paths: iconPathSet.checkCircle },
  "info-circle": { iconify: "icon-park-outline:info", paths: iconPathSet.infoCircle },
  "alert-circle": { iconify: "icon-park-outline:attention", paths: iconPathSet.alertCircle },
  layers: { iconify: "icon-park-outline:layers", paths: iconPathSet.layers },
  copy: { iconify: "icon-park-outline:copy", paths: iconPathSet.copy },
  link: { iconify: "icon-park-outline:link", paths: iconPathSet.link },
  "pen-tool": { iconify: "icon-park-outline:pen", paths: iconPathSet.penTool },
  approval: { iconify: "icon-park-outline:check-correct", paths: iconPathSet.approval },
  customer: { iconify: "icon-park-outline:user-business", paths: iconPathSet.user },
  report: { iconify: "icon-park-outline:chart-histogram", paths: iconPathSet.chart },
  task: { iconify: "icon-park-outline:list-check", paths: iconPathSet.task },
  calendar: { iconify: "icon-park-outline:calendar", paths: iconPathSet.calendar },
  refresh: { iconify: "icon-park-outline:refresh", paths: iconPathSet.refresh },
  asset: { iconify: "icon-park-outline:bank-card", paths: iconPathSet.asset },
  risk: { iconify: "icon-park-outline:attention", paths: iconPathSet.risk },
  trade: { iconify: "icon-park-outline:transaction", paths: iconPathSet.asset },
  order: { iconify: "icon-park-outline:shopping-bag", paths: iconPathSet.order },
  coupon: { iconify: "icon-park-outline:ticket", paths: iconPathSet.coupon },
  store: { iconify: "icon-park-outline:shop", paths: iconPathSet.store },
  stock: { iconify: "icon-park-outline:shopping-bag", paths: iconPathSet.order },
  campaign: { iconify: "icon-park-outline:ticket", paths: iconPathSet.coupon },
  chat: { iconify: "icon-park-outline:message", paths: iconPathSet.message },
  knowledge: { iconify: "icon-park-outline:book-open", paths: iconPathSet.knowledge },
  generate: { iconify: "icon-park-outline:magic", paths: iconPathSet.generate },
  monitor: { iconify: "icon-park-outline:monitor", paths: iconPathSet.monitor },
  lead: { iconify: "icon-park-outline:radar", paths: iconPathSet.lead },
  home: { iconify: "icon-park-outline:home", paths: iconPathSet.home },
  workbench: { iconify: "icon-park-outline:workbench", paths: iconPathSet.monitor },
};
