"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";

type Palette = {
  vibrant: string;
  muted: string;
  darkVibrant: string;
  darkMuted: string;
  lightVibrant: string;
  lightMuted: string;
  averageColor: string;
};

type ThemeMode = "light" | "dark";
type ThemeStyle = "normal" | "gradient" | "glass" | "linear" | "glow";
type RadiusMode = "restrained" | "soft" | "rounded";
type ShadowMode = "none" | "light" | "medium";
type DensityMode = "comfortable" | "compact";
type CaptureMode = "image" | "website";
type AppScenario = "aesthetic-clinic" | "fitness" | "medical" | "beauty-salon";
type PreviewTab = "app-home" | "profile" | "card-list" | "dashboard";
type ExportTab = "css" | "tailwind" | "json";
type ExportScope = "light" | "dark" | "both";
type RecommendationId = "enterprise" | "fresh" | "dark";

type ThemeOptions = {
  mode: ThemeMode;
  style: ThemeStyle;
  radius: RadiusMode;
  shadow: ShadowMode;
  density: DensityMode;
};

type EditableModeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  textInverse: string;
  border: string;
};

type ModeTokens = {
  colors: {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    primarySoft: string;
    primarySofter: string;
    secondary: string;
    secondarySoft: string;
    accent: string;
    accentSoft: string;
    background: string;
    backgroundGradient: string;
    surface: string;
    surfaceElevated: string;
    surfaceMuted: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textAccent: string;
    textInverse: string;
    border: string;
    divider: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
    border: string;
    glow: string;
  };
  shadow: {
    card: string;
    floating: string;
    glow: string;
  };
};

type SharedTokens = {
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    headingWeight: number;
    bodyWeight: number;
  };
  effects: {
    blur: string;
    glassOpacity: number;
    glowIntensity: number;
  };
  density: DensityMode;
};

type ActiveThemeTokens = ModeTokens & SharedTokens;

type ThemeTokens = {
  light: ModeTokens;
  dark: ModeTokens;
  shared: SharedTokens;
};

type ThemeRecommendation = {
  id: RecommendationId;
  name: string;
  summary: string;
  bestFor: string;
  styleName: string;
  colorModes: Record<ThemeMode, EditableModeColors>;
  options: ThemeOptions;
};

type WebsiteCaptureResult = {
  url: string;
  host: string;
  title: string;
  description: string;
  palette: Palette;
  colors: string[];
  keywords: string[];
  screenshotPreview?: string;
  captureMethod?: "rendered-screenshot" | "html-css-fallback";
  captureNote?: string;
  capturedAt: string;
};

type ScenarioContent = {
  name: string;
  shortName: string;
  userName: string;
  userRole: string;
  greeting: string;
  subGreeting: string;
  heroLabel: string;
  heroValue: string;
  heroDescription: string;
  quickActions: Array<{ label: string; icon: "calendar" | "customer" | "report" | "task" | "approval" | "message" }>;
  metrics: Array<[string, string]>;
  listTitle: string;
  searchPlaceholder: string;
  filters: string[];
  listItems: Array<{ title: string; subtitle: string; tag: string; icon: "calendar" | "customer" | "report" | "task" | "approval" | "message" }>;
  profileTitle: string;
  profileSubtitle: string;
  profileStats: string[];
  profileMenu: Array<{ label: string; icon: "calendar" | "customer" | "report" | "settings" }>;
  dashboardTitle: string;
  dashboardSubtitle: string;
  dashboardKpis: Array<[string, string, string]>;
  dashboardTasks: string[];
  tableRows: Array<[string, string, string, string, string]>;
};

const fallbackPalette: Palette = {
  vibrant: "#6D28D9",
  muted: "#64748B",
  darkVibrant: "#312E81",
  darkMuted: "#334155",
  lightVibrant: "#C4B5FD",
  lightMuted: "#E2E8F0",
  averageColor: "#F8FAFC",
};

const defaultOptions: ThemeOptions = {
  mode: "light",
  style: "gradient",
  radius: "soft",
  shadow: "light",
  density: "comfortable",
};

const previewTabs: Array<[PreviewTab, string]> = [
  ["app-home", "App 首页"],
  ["profile", "个人中心"],
  ["card-list", "卡片列表"],
  ["dashboard", "网页仪表盘"],
];

const appScenarios: Array<[AppScenario, string]> = [
  ["aesthetic-clinic", "医美美容"],
  ["fitness", "健身运动"],
  ["medical", "医疗健康"],
  ["beauty-salon", "生美美容"],
];

const scenarioContents: Record<AppScenario, ScenarioContent> = {
  "aesthetic-clinic": {
    name: "医美美容",
    shortName: "医美",
    userName: "林顾问",
    userRole: "皮肤管理顾问 · 星级会员",
    greeting: "上午好，林顾问",
    subGreeting: "今天有 9 位客户预约到店",
    heroLabel: "今日预约",
    heroValue: "9 位",
    heroDescription: "热玛吉复诊 3 位，皮肤检测 6 位",
    quickActions: [
      { label: "预约", icon: "calendar" },
      { label: "客户", icon: "customer" },
      { label: "方案", icon: "report" },
      { label: "回访", icon: "message" },
    ],
    metrics: [["待确认", "3"], ["今日到店", "9"], ["成交额", "¥42,800"], ["满意度", "98%"]],
    listTitle: "客户预约",
    searchPlaceholder: "搜索客户 / 项目",
    filters: ["全部", "待到店", "复诊", "高意向"],
    listItems: [
      { title: "周女士 · 光子嫩肤", subtitle: "14:30 到店 · 需皮肤检测", tag: "待到店", icon: "calendar" },
      { title: "陈小姐 · 水光复诊", subtitle: "术后第 7 天回访", tag: "复诊", icon: "customer" },
      { title: "王女士 · 抗衰方案", subtitle: "方案待确认 · 高意向", tag: "高意向", icon: "report" },
    ],
    profileTitle: "林顾问",
    profileSubtitle: "皮肤管理顾问 · 本月服务 86 人",
    profileStats: ["86 服务", "12 待访", "98% 满意"],
    profileMenu: [
      { label: "我的预约", icon: "calendar" },
      { label: "客户档案", icon: "customer" },
      { label: "疗程记录", icon: "report" },
      { label: "门店设置", icon: "settings" },
    ],
    dashboardTitle: "门店预约看板",
    dashboardSubtitle: "查看预约、项目转化和客户回访情况。",
    dashboardKpis: [["今日预约", "9", "+18%"], ["待回访", "12", "今日"], ["成交率", "42%", "+6%"]],
    dashboardTasks: ["热玛吉复诊客户待确认", "3 位高意向客户需跟进", "术后护理提醒已生成"],
    tableRows: [
      ["周女士", "光子嫩肤", "林顾问", "14:30", "待到店"],
      ["陈小姐", "水光复诊", "赵顾问", "16:00", "复诊"],
      ["王女士", "抗衰方案", "林顾问", "明天", "高意向"],
    ],
  },
  fitness: {
    name: "健身运动",
    shortName: "健身",
    userName: "张教练",
    userRole: "私教主管 · 会员增长",
    greeting: "早上好，张教练",
    subGreeting: "今天有 6 节课程和 18 位会员训练",
    heroLabel: "今日课程",
    heroValue: "6 节",
    heroDescription: "私教 4 节，小团课 2 节，续费提醒 5 人",
    quickActions: [
      { label: "课程", icon: "calendar" },
      { label: "会员", icon: "customer" },
      { label: "体测", icon: "report" },
      { label: "计划", icon: "task" },
    ],
    metrics: [["待上课", "6"], ["训练会员", "18"], ["续费线索", "5"], ["达标率", "82%"]],
    listTitle: "课程安排",
    searchPlaceholder: "搜索会员 / 课程",
    filters: ["全部", "待上课", "小团课", "续费"],
    listItems: [
      { title: "刘先生 · 增肌私教", subtitle: "10:00 力量训练 · 需记录体重", tag: "待上课", icon: "calendar" },
      { title: "燃脂小团课", subtitle: "12 人报名 · 18:30 开始", tag: "小团课", icon: "task" },
      { title: "赵女士 · 续费沟通", subtitle: "剩余 2 节课 · 推荐套餐", tag: "续费", icon: "customer" },
    ],
    profileTitle: "张教练",
    profileSubtitle: "私教主管 · 本月完成 64 节课",
    profileStats: ["64 课程", "18 会员", "82% 达标"],
    profileMenu: [
      { label: "我的课程", icon: "calendar" },
      { label: "会员管理", icon: "customer" },
      { label: "训练报表", icon: "report" },
      { label: "训练设置", icon: "settings" },
    ],
    dashboardTitle: "门店训练看板",
    dashboardSubtitle: "跟踪课程、会员活跃和续费线索。",
    dashboardKpis: [["今日课程", "6", "+12%"], ["活跃会员", "328", "本周"], ["续费率", "76%", "+4%"]],
    dashboardTasks: ["晚间燃脂课待确认人数", "5 位会员进入续费周期", "本周体测报告待生成"],
    tableRows: [
      ["刘先生", "增肌私教", "张教练", "10:00", "待上课"],
      ["燃脂小团课", "团课", "王教练", "18:30", "已排课"],
      ["赵女士", "续费沟通", "张教练", "明天", "高意向"],
    ],
  },
  medical: {
    name: "医疗健康",
    shortName: "医疗",
    userName: "王医生",
    userRole: "全科医生 · 健康管理",
    greeting: "您好，王医生",
    subGreeting: "今天有 14 份报告需要查看",
    heroLabel: "报告待读",
    heroValue: "14 份",
    heroDescription: "慢病随访 8 人，异常指标 3 项需提醒",
    quickActions: [
      { label: "问诊", icon: "message" },
      { label: "患者", icon: "customer" },
      { label: "报告", icon: "report" },
      { label: "随访", icon: "calendar" },
    ],
    metrics: [["待问诊", "7"], ["报告", "14"], ["预警", "3"], ["随访率", "91%"]],
    listTitle: "患者随访",
    searchPlaceholder: "搜索患者 / 报告",
    filters: ["全部", "待问诊", "异常", "已随访"],
    listItems: [
      { title: "李女士 · 血糖复查", subtitle: "空腹血糖偏高 · 建议随访", tag: "异常", icon: "report" },
      { title: "张先生 · 血压管理", subtitle: "本周数据稳定 · 待复诊", tag: "待问诊", icon: "customer" },
      { title: "赵女士 · 体检报告", subtitle: "报告已生成 · 待解读", tag: "待解读", icon: "approval" },
    ],
    profileTitle: "王医生",
    profileSubtitle: "全科医生 · 管理患者 126 人",
    profileStats: ["126 患者", "14 报告", "91% 随访"],
    profileMenu: [
      { label: "今日问诊", icon: "calendar" },
      { label: "患者档案", icon: "customer" },
      { label: "健康报告", icon: "report" },
      { label: "系统设置", icon: "settings" },
    ],
    dashboardTitle: "健康管理看板",
    dashboardSubtitle: "集中查看报告、随访和风险预警。",
    dashboardKpis: [["报告待读", "14", "今日"], ["随访患者", "126", "+8%"], ["异常预警", "3", "需处理"]],
    dashboardTasks: ["李女士血糖异常需提醒", "慢病随访名单已生成", "3 份体检报告待解读"],
    tableRows: [
      ["李女士", "血糖复查", "王医生", "今天", "异常"],
      ["张先生", "血压管理", "刘医生", "昨天", "稳定"],
      ["赵女士", "体检报告", "王医生", "周二", "待解读"],
    ],
  },
  "beauty-salon": {
    name: "生美美容",
    shortName: "生美",
    userName: "许店长",
    userRole: "门店店长 · 会员运营",
    greeting: "下午好，许店长",
    subGreeting: "今天有 11 个护理预约待服务",
    heroLabel: "护理预约",
    heroValue: "11 单",
    heroDescription: "面护 6 单，身体护理 3 单，会员续卡 2 单",
    quickActions: [
      { label: "预约", icon: "calendar" },
      { label: "会员", icon: "customer" },
      { label: "护理", icon: "task" },
      { label: "业绩", icon: "report" },
    ],
    metrics: [["待服务", "11"], ["会员到店", "8"], ["续卡", "2"], ["好评", "4.9"]],
    listTitle: "护理订单",
    searchPlaceholder: "搜索会员 / 护理项目",
    filters: ["全部", "待服务", "续卡", "已完成"],
    listItems: [
      { title: "孙小姐 · 舒缓补水护理", subtitle: "15:00 到店 · 老客复购", tag: "待服务", icon: "calendar" },
      { title: "高女士 · 身体疏通", subtitle: "疗程第 3 次 · 需记录反馈", tag: "疗程中", icon: "task" },
      { title: "周女士 · 会员续卡", subtitle: "余额不足 · 推荐季卡", tag: "续卡", icon: "customer" },
    ],
    profileTitle: "许店长",
    profileSubtitle: "门店店长 · 本月服务 213 单",
    profileStats: ["213 服务", "42 会员", "4.9 好评"],
    profileMenu: [
      { label: "门店预约", icon: "calendar" },
      { label: "会员档案", icon: "customer" },
      { label: "护理记录", icon: "report" },
      { label: "门店设置", icon: "settings" },
    ],
    dashboardTitle: "门店经营看板",
    dashboardSubtitle: "查看预约、会员复购和护理项目表现。",
    dashboardKpis: [["护理预约", "11", "今日"], ["会员到店", "8", "+15%"], ["好评率", "98%", "+3%"]],
    dashboardTasks: ["舒缓补水护理待开单", "2 位会员进入续卡周期", "本周门店好评待回复"],
    tableRows: [
      ["孙小姐", "补水护理", "许店长", "15:00", "待服务"],
      ["高女士", "身体疏通", "陈美容师", "16:30", "疗程中"],
      ["周女士", "会员续卡", "许店长", "明天", "续卡"],
    ],
  },
};

const exportTabs: Array<[ExportTab, string]> = [
  ["css", "CSS Variables"],
  ["tailwind", "Tailwind Config"],
  ["json", "Design Tokens JSON"],
];

const captureSteps = [
  ["01", "提供参考源", "上传截图或输入网站"],
  ["02", "选择方案", "先选一个可用方向"],
  ["03", "微调主题", "只改关键颜色和风格"],
  ["04", "预览交付", "确认效果后复制给开发"],
] as const;

export function StyleCaptureTool() {
  const [captureMode, setCaptureMode] = useState<CaptureMode>("image");
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteResult, setWebsiteResult] = useState<WebsiteCaptureResult | null>(null);
  const [palette, setPalette] = useState<Palette>(fallbackPalette);
  const [colorModes, setColorModes] = useState<Record<ThemeMode, EditableModeColors>>(() =>
    paletteToEditableColorModes(fallbackPalette),
  );
  const [options, setOptions] = useState<ThemeOptions>(defaultOptions);
  const [styleName, setStyleName] = useState("蓝紫智能风");
  const [appScenario, setAppScenario] = useState<AppScenario>("aesthetic-clinic");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("app-home");
  const [exportTab, setExportTab] = useState<ExportTab>("css");
  const [exportScope, setExportScope] = useState<ExportScope>("both");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationId>("enterprise");

  const themeTokens = useMemo(
    () => buildThemeTokens(colorModes, options),
    [colorModes, options],
  );
  const activeTokens = useMemo(
    () => getActiveTokens(themeTokens, options.mode),
    [themeTokens, options.mode],
  );
  const activeColors = colorModes[options.mode];
  const qualityChecks = useMemo(() => getThemeQualityChecks(themeTokens), [themeTokens]);
  const recommendations = useMemo(() => buildThemeRecommendations(palette), [palette]);
  const scenarioContent = scenarioContents[appScenario];

  const exportCode = useMemo(
    () => ({
      css: toCssVariables(themeTokens, exportScope),
      tailwind: toTailwindConfig(themeTokens, exportScope),
      json: toJsonTokens(themeTokens, exportScope),
    }),
    [themeTokens, exportScope],
  );

  async function handleUpload(file?: File) {
    if (!file) return;

    setCaptureMode("image");
    setWebsiteResult(null);

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      setStatus("error");
      setMessage("请上传 png、jpg、jpeg 或 webp 图片。");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setImageUrl(nextUrl);
    setImageName(file.name);
    setStatus("loading");
    setMessage("正在提取图片色板...");

    try {
      const extracted = await extractPalette(nextUrl);
      setPalette(extracted);
      const nextColorModes = paletteToEditableColorModes(extracted);
      setColorModes(nextColorModes);
      setSelectedRecommendation("enterprise");
      setStyleName(suggestName(nextColorModes.light.primary, extracted));
      setStatus("ready");
      setMessage("色板已生成，你可以微调后复制给开发使用。");
    } catch {
      const average = await getAverageColor(nextUrl).catch(() => fallbackPalette.averageColor);
      const fallback = { ...fallbackPalette, averageColor: average };
      setPalette(fallback);
      setColorModes(paletteToEditableColorModes(fallback));
      setSelectedRecommendation("enterprise");
      setStyleName(suggestName(fallback.vibrant, fallback));
      setStatus("error");
      setMessage("自动提取失败，已使用兜底色板生成主题。");
    }
  }

  async function handleWebsiteCapture() {
    const url = websiteUrl.trim();
    if (!url) {
      setStatus("error");
      setMessage("请输入要捕捉的网站地址，例如 https://example.com。");
      return;
    }

    setCaptureMode("website");
    setStatus("loading");
    setMessage("正在解析目标网站的颜色、样式和视觉线索...");

    try {
      const response = await fetch("/api/style-capture/website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = (await response.json()) as WebsiteCaptureResult & { error?: string };

      if (!response.ok || result.error) {
        throw new Error(result.error || "网站解析失败。");
      }

      setWebsiteResult(result);
      setImageUrl("");
      setImageName("");
      setPalette(result.palette);
      setColorModes(paletteToEditableColorModes(result.palette));
      setSelectedRecommendation("enterprise");
      setStyleName(suggestWebsiteStyleName(result));
      setStatus("ready");
      setMessage("网站视觉线索已生成主题草稿，你可以继续微调颜色和预览效果。");
    } catch (error) {
      setStatus("error");
      setWebsiteResult(null);
      setMessage(error instanceof Error ? error.message : "网站解析失败，可以改用截图上传。");
    }
  }

  function updateManualColor(key: keyof EditableModeColors, value: string) {
    const normalized = normalizeHex(value);
    setColorModes((current) => {
      const currentMode = options.mode;
      const otherMode = currentMode === "light" ? "dark" : "light";
      const next = {
        ...current,
        [currentMode]: { ...current[currentMode], [key]: normalized },
      };

      if (["primary", "secondary", "accent", "textAccent"].includes(key)) {
        next[otherMode] = {
          ...next[otherMode],
          [key]: deriveModeColor(normalized, otherMode, key),
        };
      }

      return next;
    });
  }

  function updateOption<K extends keyof ThemeOptions>(key: K, value: ThemeOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function applyRecommendation(recommendation: ThemeRecommendation) {
    setSelectedRecommendation(recommendation.id);
    setColorModes(recommendation.colorModes);
    setOptions(recommendation.options);
    setStyleName(recommendation.styleName);
    setMessage(`已应用「${recommendation.name}」，右侧预览已同步更新。`);
  }

  async function copyCode(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setMessage("复制失败，请检查浏览器剪贴板权限。");
    }
  }

  function saveDraft() {
    const now = new Date().toISOString();
    const draftId = `style-capture-${Date.now()}`;
    const fromWebsite = captureMode === "website" && websiteResult;
    const draft = {
      id: draftId,
      name: styleName || "未命名捕捉风格",
      source: "style-capture",
      captureSource: fromWebsite ? "website" : "image",
      sourceUrl: fromWebsite ? websiteResult.url : undefined,
      status: "draft",
      mood: [options.style === "glass" ? "高级轻奢" : options.style === "glow" ? "科技 AI" : "商务稳重"],
      colorPreference: inferColorPreference(activeTokens.colors.primary),
      description: fromWebsite
        ? `从 ${websiteResult.host} 捕捉生成的网页内维护草稿，可以继续微调 Token、预览和验收项。`
        : "从风格捕捉器生成的网页内维护草稿，可以继续微调 Token、预览和验收项。",
      suitableFor: ["企业后台", "移动 App", "视觉探索"],
      notSuitableFor: ["需要严格品牌规范的正式发布"],
      tags: [fromWebsite ? "网站捕捉" : "图片捕捉", options.style, options.mode],
      tokens: themeTokens,
      preview: {
        coverVariant: options.style === "glass" ? "glass-premium" : options.mode === "dark" ? "dark-dashboard" : "saas-clean",
        scenarios: [appScenario, previewTab, "网页仪表盘"],
        showAppHome: true,
        showProfile: true,
        showCardList: true,
        showDashboard: true,
      },
      acceptance: {
        hasName: Boolean(styleName),
        hasScenario: true,
        hasLightMode: true,
        hasDarkMode: true,
        appReadable: false,
        profileReadable: false,
        listReadable: false,
        dashboardReadable: false,
        buttonReadable: false,
        tagReadable: false,
        cardLayered: false,
        hasChangelog: true,
      },
      changelog: [
        {
          title: fromWebsite ? "从网站生成风格草稿" : "从截图生成风格草稿",
          type: "新增风格",
          description: fromWebsite
            ? `通过目标网站 ${websiteResult.host} 提取颜色和视觉线索，并生成浅色、深色和共享 Token。`
            : "通过上传图片提取色板，并生成浅色、深色和共享 Token。",
          scope: "颜色 Token、预览场景、代码导出",
          owner: "设计团队",
          updatedAt: now,
          version: "0.1.0",
        },
      ],
      createdAt: now,
      updatedAt: now,
      owner: "设计团队",
      version: "0.1.0",
      themeTokens,
    };
    const stored = JSON.parse(localStorage.getItem("styleCaptureDrafts") || "[]") as unknown[];
    localStorage.setItem("styleCaptureDrafts", JSON.stringify([draft, ...stored], null, 2));
    const maintenanceStored = JSON.parse(localStorage.getItem("designMaintenanceStyles") || "[]") as Array<{ id?: string }>;
    const nextMaintenance = [draft, ...maintenanceStored.filter((item) => item.id !== draftId)];
    localStorage.setItem("designMaintenanceStyles", JSON.stringify(nextMaintenance, null, 2));
    setSavedCount((count) => count + 1);
    setMessage("已保存为风格草稿，正在打开设计维护台。");
    window.setTimeout(() => {
      window.location.href = `/design-guide?styleId=${draftId}`;
    }, 450);
  }

  function resetTheme() {
    setCaptureMode("image");
    setImageUrl("");
    setImageName("");
    setWebsiteUrl("");
    setWebsiteResult(null);
    setPalette(fallbackPalette);
    setColorModes(paletteToEditableColorModes(fallbackPalette));
    setOptions(defaultOptions);
    setStyleName("蓝紫智能风");
    setAppScenario("aesthetic-clinic");
    setStatus("idle");
    setMessage("");
  }

  function syncOtherMode() {
    setColorModes((current) => {
      const currentMode = options.mode;
      const otherMode = currentMode === "light" ? "dark" : "light";
      return {
        ...current,
        [otherMode]: generateOppositeMode(current[currentMode], otherMode),
      };
    });
    setMessage("已根据当前模式同步生成另一套主题。");
  }

  function optimizeCurrentMode() {
    setColorModes((current) => ({
      ...current,
      [options.mode]: optimizeModeColors(current[options.mode], options.mode),
    }));
    setMessage(`已优化${options.mode === "light" ? "浅色" : "深色"}模式的可读性。`);
  }

  function optimizeBothModes() {
    setColorModes((current) => ({
      light: optimizeModeColors(current.light, "light"),
      dark: optimizeModeColors(current.dark, "dark"),
    }));
    setMessage("已同时优化浅色和深色模式的可读性。");
  }

  return (
    <div className="grid gap-5">
      <section className="min-w-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-violet-700">上传截图或输入网站</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">把视觉参考变成可用主题</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              你可以上传图片，也可以输入目标网站。系统会提取颜色和视觉线索，生成可读性更好的 UI Token，并同步预览 App、列表和后台页面效果。
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:shrink-0">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-xl bg-violet-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              保存为风格草稿
            </button>
            <button
              type="button"
              onClick={resetTheme}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              重置主题
            </button>
          </div>
        </div>
        <CaptureStepper currentStep={status === "idle" || status === "loading" ? 0 : 1} />
      </section>

      <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(360px,0.92fr)_minmax(560px,1.08fr)]">
        <div className="grid min-w-0 gap-5">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle
              title="1. 提供参考来源"
              helper="可以上传截图，也可以输入网站地址。网站捕捉会提取颜色和样式线索，不复制图片和品牌资产。"
            />
            <SourceModeSwitch mode={captureMode} onChange={setCaptureMode} />
            {captureMode === "image" ? (
              <>
                <label className="mt-4 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-5 text-center transition hover:bg-violet-50">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="sr-only"
                    onChange={(event) => handleUpload(event.target.files?.[0])}
                  />
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={imageName || "上传图片预览"}
                      className="max-h-64 w-full rounded-2xl object-contain"
                    />
                  ) : (
                    <>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
                        <Icon icon="layers" size={22} color="currentColor" />
                      </span>
                      <span className="mt-4 text-base font-semibold text-slate-950">点击上传截图</span>
                      <span className="mt-2 text-sm leading-6 text-slate-500">
                        例如产品截图、品牌海报、竞品页面或视觉参考图。
                      </span>
                    </>
                  )}
                </label>
                {imageName ? <p className="mt-3 truncate text-xs font-medium text-slate-500">{imageName}</p> : null}
              </>
            ) : (
              <WebsiteCapturePanel
                websiteUrl={websiteUrl}
                result={websiteResult}
                status={status}
                onUrlChange={setWebsiteUrl}
                onCapture={handleWebsiteCapture}
              />
            )}
            <StatusMessage status={status} message={message} />
            <PalettePanel palette={palette} />
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle title="2. 选择推荐方案" helper="先选一个方向，再进入微调。每套方案都会自动处理浅色和深色模式。" />
            <RecommendationPanel
              recommendations={recommendations}
              selectedId={selectedRecommendation}
              onSelect={applyRecommendation}
            />
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <SectionTitle title="3. 微调主题" helper="只改对视觉影响最大的字段，右侧预览会实时变化。" />
            <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-3">
              <p className="text-sm font-semibold text-violet-900">
                当前正在编辑：{options.mode === "light" ? "浅色模式" : "深色模式"}
              </p>
              <p className="mt-1 text-xs leading-5 text-violet-700">
                主色、辅助色、强调色会同步保持同一风格基因；背景、卡片和文字色只影响当前模式。
              </p>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">风格名称</span>
              <input
                value={styleName}
                onChange={(event) => setStyleName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <ColorGroup
              title="品牌色"
              helper="影响按钮、关键数字、图标和品牌识别。"
              fields={[
                ["primary", "主色"],
                ["secondary", "辅助色"],
                ["accent", "强调色"],
                ["textAccent", "文字主色"],
              ]}
              colors={activeColors}
              onChange={updateManualColor}
            />
            <ColorGroup
              title="界面底色"
              helper="背景和卡片只调整当前模式，避免深色模式变成简单反色。"
              fields={[
                ["background", "页面背景"],
                ["surface", "卡片背景"],
                ["surfaceMuted", "弱背景"],
                ["border", "边框色"],
              ]}
              colors={activeColors}
              onChange={updateManualColor}
            />
            <ColorGroup
              title="文字色"
              helper="主文字、次文字和反白文字分别控制可读性。"
              fields={[
                ["textPrimary", "主文字"],
                ["textSecondary", "次文字"],
                ["textInverse", "反白文字"],
              ]}
              colors={activeColors}
              onChange={updateManualColor}
            />

            <div className="mt-5 grid gap-4">
              <OptionGroup
                label="模式"
                value={options.mode}
                options={[
                  ["light", "浅色"],
                  ["dark", "深色"],
                ]}
                onChange={(value) => updateOption("mode", value as ThemeMode)}
              />
              <OptionGroup
                label="风格"
                value={options.style}
                options={[
                  ["normal", "普通"],
                  ["gradient", "渐变"],
                  ["glass", "玻璃"],
                  ["linear", "线性"],
                  ["glow", "微光"],
                ]}
                onChange={(value) => updateOption("style", value as ThemeStyle)}
              />
              <OptionGroup
                label="圆角"
                value={options.radius}
                options={[
                  ["restrained", "克制"],
                  ["soft", "柔和"],
                  ["rounded", "大圆角"],
                ]}
                onChange={(value) => updateOption("radius", value as RadiusMode)}
              />
              <OptionGroup
                label="阴影"
                value={options.shadow}
                options={[
                  ["none", "无"],
                  ["light", "轻"],
                  ["medium", "中"],
                ]}
                onChange={(value) => updateOption("shadow", value as ShadowMode)}
              />
              <OptionGroup
                label="密度"
                value={options.density}
                options={[
                  ["comfortable", "舒适"],
                  ["compact", "紧凑"],
                ]}
                onChange={(value) => updateOption("density", value as DensityMode)}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={syncOtherMode}
                className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
              >
                同步生成另一模式
              </button>
              <button
                type="button"
                onClick={optimizeCurrentMode}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                一键优化当前模式
              </button>
              <button
                type="button"
                onClick={optimizeBothModes}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                一键优化双模式
              </button>
            </div>
            <QualityPanel checks={qualityChecks} />
          </section>
        </div>

        <section className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm 2xl:sticky 2xl:top-24 2xl:self-start">
          <SectionTitle title="4. 实时预览" helper="预览是真实业务页面，会跟随 Token 变化。" />
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-800">App 行业场景</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">优先用移动端业务内容验证主题是否真实可用。</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {appScenarios.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAppScenario(id)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    appScenario === id
                      ? "border-violet-200 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {previewTabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPreviewTab(id)}
                className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  previewTab === id
                    ? "border-violet-200 bg-violet-50 text-violet-800"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ThemePreview tab={previewTab} tokens={activeTokens} name={styleName} options={options} content={scenarioContent} />
        </section>
      </div>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle title="复制给开发" helper="确认预览可读后，复制主题代码或保存为风格草稿。" />
          <div className="grid gap-2">
            <div className="flex gap-2 overflow-x-auto">
              {(["light", "dark", "both"] as ExportScope[]).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setExportScope(scope)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold ${
                    exportScope === scope
                      ? "border-violet-200 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {scope === "light" ? "只导出浅色" : scope === "dark" ? "只导出深色" : "导出双模式"}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {exportTabs.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setExportTab(id)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold ${
                    exportTab === id
                      ? "border-violet-200 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-slate-200">{exportTabs.find(([id]) => id === exportTab)?.[1]}</p>
            <button
              type="button"
              onClick={() => copyCode(exportTab, exportCode[exportTab])}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-50"
            >
              <Icon icon={copied === exportTab ? "check-circle" : "copy"} size={16} color="currentColor" />
              {copied === exportTab ? "已复制" : "复制代码"}
            </button>
          </div>
          <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-6 text-slate-100">
            <code>{exportCode[exportTab]}</code>
          </pre>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>草稿保存在浏览器 localStorage：designMaintenanceStyles，并兼容保留 styleCaptureDrafts。</span>
          {savedCount ? <span className="font-semibold text-emerald-700">本次已保存 {savedCount} 个草稿。</span> : null}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ title, helper }: { title: string; helper: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

function SourceModeSwitch({
  mode,
  onChange,
}: {
  mode: CaptureMode;
  onChange: (mode: CaptureMode) => void;
}) {
  const options: Array<[CaptureMode, string, string, "layers" | "link"]> = [
    ["image", "从图片捕捉", "适合已有截图、品牌图和视觉参考", "layers"],
    ["website", "从网站捕捉", "输入网址，提取页面颜色和样式线索", "link"],
  ];

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {options.map(([id, title, helper, icon]) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex min-w-0 items-center gap-3 rounded-2xl border p-3 text-left transition ${
              active
                ? "border-violet-200 bg-violet-50 text-violet-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-violet-100 hover:bg-slate-50"
            }`}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white text-violet-700" : "bg-slate-50 text-slate-500"}`}>
              <Icon icon={icon} size={19} color="currentColor" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{title}</span>
              <span className="mt-0.5 block text-xs leading-5 text-slate-500">{helper}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function WebsiteCapturePanel({
  websiteUrl,
  result,
  status,
  onUrlChange,
  onCapture,
}: {
  websiteUrl: string;
  result: WebsiteCaptureResult | null;
  status: string;
  onUrlChange: (value: string) => void;
  onCapture: () => void;
}) {
  return (
    <div className="mt-4 grid gap-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">目标网站地址</span>
          <span className="mt-2 flex min-w-0 flex-col gap-2 sm:flex-row">
            <input
              value={websiteUrl}
              onChange={(event) => onUrlChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onCapture();
              }}
              placeholder="https://example.com"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
            <button
              type="button"
              onClick={onCapture}
              disabled={status === "loading"}
              className="rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {status === "loading" ? "解析中..." : "开始解析网站"}
            </button>
          </span>
        </label>
        <div className="mt-3 flex gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-800">
          <Icon icon="info-circle" size={16} color="currentColor" className="mt-0.5 shrink-0" />
          <span>会优先渲染真实首屏截图来提取颜色和氛围；如果目标网站限制访问，再自动降级为源码颜色解析。</span>
        </div>
      </div>
      {result ? <WebsiteSummaryPanel result={result} /> : null}
    </div>
  );
}

function WebsiteSummaryPanel({ result }: { result: WebsiteCaptureResult }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Website captured</p>
          <h3 className="mt-2 truncate text-base font-semibold text-slate-950">{result.title || result.host}</h3>
          <p className="mt-1 truncate text-sm text-slate-500">{result.host}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {result.captureMethod === "rendered-screenshot" ? "真实首屏" : "降级解析"}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{result.description}</p>
      {result.screenshotPreview ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-white bg-white shadow-sm">
          <div
            aria-label={`${result.title} 首屏截图`}
            role="img"
            className="h-36 w-full bg-cover bg-top"
            style={{ backgroundImage: `url(${result.screenshotPreview})` }}
          />
        </div>
      ) : null}
      <div className="mt-4 flex h-3 overflow-hidden rounded-full border border-white bg-white">
        {result.colors.slice(0, 8).map((color) => (
          <span key={color} className="flex-1" style={{ background: color }} />
        ))}
      </div>
      {result.keywords.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {result.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              {keyword}
            </span>
          ))}
        </div>
      ) : null}
      {result.captureNote ? (
        <p className="mt-3 rounded-xl bg-white/80 px-3 py-2 text-xs leading-5 text-slate-500">{result.captureNote}</p>
      ) : null}
    </div>
  );
}

function CaptureStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {captureSteps.map(([step, title, helper], index) => {
        const active = index === currentStep;
        const done = index < currentStep;
        return (
          <div
            key={step}
            className={`rounded-2xl border p-3 transition ${
              active
                ? "border-violet-200 bg-violet-50"
                : done
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                  active
                    ? "bg-violet-700 text-white"
                    : done
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-slate-400"
                }`}
              >
                {done ? "✓" : step}
              </span>
              <span className="text-sm font-semibold text-slate-950">{title}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>
          </div>
        );
      })}
    </div>
  );
}

function RecommendationPanel({
  recommendations,
  selectedId,
  onSelect,
}: {
  recommendations: ThemeRecommendation[];
  selectedId: RecommendationId;
  onSelect: (recommendation: ThemeRecommendation) => void;
}) {
  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-3">
      {recommendations.map((item) => {
        const active = item.id === selectedId;
        const previewColors = [
          item.colorModes.light.primary,
          item.colorModes.light.secondary,
          item.colorModes.light.accent,
          item.colorModes.light.background,
        ];
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={`min-w-0 rounded-2xl border p-4 text-left transition ${
              active
                ? "border-violet-300 bg-violet-50 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.summary}</p>
              </div>
              {active ? (
                <span className="shrink-0 rounded-full bg-violet-700 px-2 py-1 text-xs font-semibold text-white">已选</span>
              ) : null}
            </div>
            <div className="mt-4 flex h-2 overflow-hidden rounded-full border border-white/70 bg-white">
              {previewColors.map((color) => (
                <span key={color} className="flex-1" style={{ background: color }} />
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">适合：{item.bestFor}</p>
          </button>
        );
      })}
    </div>
  );
}

function StatusMessage({ status, message }: { status: string; message: string }) {
  if (!message) return null;

  const tone =
    status === "error"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : status === "ready"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-blue-200 bg-blue-50 text-blue-800";

  return <p className={`mt-3 rounded-xl border px-3 py-2 text-sm font-medium ${tone}`}>{message}</p>;
}

function PalettePanel({ palette }: { palette: Palette }) {
  const items: Array<[keyof Palette, string]> = [
    ["vibrant", "Vibrant"],
    ["muted", "Muted"],
    ["darkVibrant", "Dark"],
    ["darkMuted", "Dark Muted"],
    ["lightVibrant", "Light"],
    ["lightMuted", "Light Muted"],
    ["averageColor", "Average"],
  ];

  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-slate-950">提取色板</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map(([key, label]) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="h-10 rounded-lg border border-white/80" style={{ background: palette[key] }} />
            <p className="mt-2 text-xs font-semibold text-slate-600">{label}</p>
            <p className="font-mono text-xs text-slate-400">{palette[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="mt-2 flex items-center gap-2">
        <input
          type="color"
          value={toColorInputValue(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-10 rounded-lg border border-slate-200 bg-white p-1"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 font-mono text-xs text-slate-700 outline-none focus:border-violet-300"
        />
      </span>
    </label>
  );
}

function ColorGroup({
  title,
  helper,
  fields,
  colors,
  onChange,
}: {
  title: string;
  helper: string;
  fields: Array<[keyof EditableModeColors, string]>;
  colors: EditableModeColors;
  onChange: (key: keyof EditableModeColors, value: string) => void;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-950">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <ColorField
            key={key}
            label={label}
            value={colors[key]}
            onChange={(value) => onChange(key, value)}
          />
        ))}
      </div>
    </div>
  );
}

function QualityPanel({ checks }: { checks: ReturnType<typeof getThemeQualityChecks> }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">双模式质量检查</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">分别检查浅色和深色的可读性与层级。</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {(["light", "dark"] as ThemeMode[]).map((mode) => (
          <div key={mode} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-800">{mode === "light" ? "浅色模式" : "深色模式"}</p>
            <div className="mt-3 grid gap-2">
              {checks[mode].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">{item.label}</span>
                  <span
                    className={`rounded-full px-2 py-1 font-semibold ${
                      item.pass ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.pass ? "通过" : "需要优化"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              value === id
                ? "border-violet-200 bg-violet-50 text-violet-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemePreview({
  tab,
  tokens,
  name,
  options,
  content,
}: {
  tab: PreviewTab;
  tokens: ActiveThemeTokens;
  name: string;
  options: ThemeOptions;
  content: ScenarioContent;
}) {
  const css = tokenStyle(tokens, options);
  const heroCard = getHeroCardStyle(tokens, options.mode);
  const heroTextColor = String(heroCard.color || tokens.colors.textPrimary);
  const tokenChecks = getPreviewTokenChecks(tokens, options.mode);

  return (
    <>
      <div
        className="mt-4 overflow-hidden rounded-[24px] border border-[var(--capture-border)] bg-[var(--capture-bg)] p-4 shadow-[var(--capture-shadow)]"
        style={css}
      >
        {tab === "app-home" ? <AppHomePreview heroCard={heroCard} name={name} content={content} /> : null}
        {tab === "profile" ? <ProfilePreview content={content} /> : null}
        {tab === "card-list" ? <CardListPreview content={content} /> : null}
        {tab === "dashboard" ? <DashboardPreview content={content} /> : null}
      </div>
      <TokenDebugPanel checks={tokenChecks} heroTextColor={heroTextColor} tokens={tokens} mode={options.mode} />
    </>
  );
}

function AppHomePreview({
  heroCard,
  name,
  content,
}: {
  heroCard: React.CSSProperties;
  name: string;
  content: ScenarioContent;
}) {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--capture-muted)]">9:41</p>
          <h3 className="mt-6 text-xl font-semibold text-[var(--capture-text)]">{content.greeting}</h3>
          <p className="mt-1 text-sm text-[var(--capture-muted)]">{content.subGreeting}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--capture-primary)] text-lg font-semibold text-[var(--capture-inverse)]">
          {content.userName.slice(0, 1)}
        </div>
      </div>
      <div className="mt-5 rounded-[var(--capture-radius-xl)] border border-[var(--capture-border)] p-5 shadow-[var(--capture-floating)]" style={heroCard}>
        <p className="text-sm font-semibold opacity-90">{content.heroLabel}</p>
        <p className="mt-3 text-3xl font-bold">{content.heroValue}</p>
        <p className="mt-2 text-sm opacity-90">{content.heroDescription}</p>
        <p className="mt-3 w-fit rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold opacity-90">{name}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {content.metrics.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-3 shadow-[var(--capture-card-shadow)]">
            <p className="text-xs font-semibold text-[var(--capture-muted)]">{label}</p>
            <p className="mt-2 text-lg font-bold text-[var(--capture-text)]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {content.quickActions.map((item) => (
          <div key={item.label} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-3 text-center shadow-[var(--capture-card-shadow)]">
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--capture-primary-soft)] text-[var(--capture-primary)]">
              <Icon icon={item.icon} size={17} color="currentColor" />
            </span>
            <p className="mt-2 text-xs font-semibold text-[var(--capture-text)]">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {content.listItems.map((item) => (
          <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-3 shadow-[var(--capture-card-shadow)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--capture-surface-muted)] text-[var(--capture-primary)]">
              <Icon icon={item.icon} size={17} color="currentColor" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--capture-text)]">{item.title}</p>
              <p className="mt-0.5 truncate text-xs text-[var(--capture-muted)]">{item.subtitle}</p>
            </div>
            <StatusPill>{item.tag}</StatusPill>
          </div>
        ))}
      </div>
      <MobileTabbar />
    </PhoneFrame>
  );
}

function ProfilePreview({ content }: { content: ScenarioContent }) {
  return (
    <PhoneFrame>
      <div className="rounded-[var(--capture-radius-xl)] border border-[var(--capture-border)] bg-[var(--capture-gradient-card)] p-5 shadow-[var(--capture-card-shadow)]">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-[var(--capture-primary)] text-center text-xl font-bold leading-[56px] text-[var(--capture-inverse)]">{content.userName.slice(0, 1)}</div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--capture-text)]">{content.profileTitle}</h3>
            <p className="text-sm text-[var(--capture-muted)]">{content.profileSubtitle}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {content.profileStats.map((item) => (
            <div key={item} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface-elevated)] p-3 text-center text-sm font-semibold text-[var(--capture-text)]">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        {content.profileMenu.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-4 shadow-[var(--capture-card-shadow)]">
            <Icon icon={item.icon} size={18} color="var(--capture-text-accent)" />
            <span className="flex-1 text-sm font-semibold text-[var(--capture-text)]">{item.label}</span>
            <span className="text-[var(--capture-muted)]">›</span>
          </div>
        ))}
      </div>
      <MobileTabbar />
    </PhoneFrame>
  );
}

function CardListPreview({ content }: { content: ScenarioContent }) {
  return (
    <PhoneFrame>
      <h3 className="text-xl font-semibold text-[var(--capture-text)]">{content.listTitle}</h3>
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[var(--capture-surface-muted)] px-3 py-3 text-sm text-[var(--capture-muted)]">
        <Icon icon="search" size={16} color="currentColor" />
        {content.searchPlaceholder}
      </div>
      <div className="mt-3 flex gap-2 overflow-hidden">
        {content.filters.map((item, index) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              index === 0
                ? "bg-[var(--capture-primary)] text-[var(--capture-inverse)]"
                : "bg-[var(--capture-primary-soft)] text-[var(--capture-text-accent)]"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {content.listItems.map((item) => (
          <div key={item.title} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-4 shadow-[var(--capture-card-shadow)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--capture-text)]">{item.title}</p>
                <p className="mt-1 truncate text-sm text-[var(--capture-muted)]">{item.subtitle}</p>
              </div>
              <StatusPill>{item.tag}</StatusPill>
            </div>
            <button className="mt-3 rounded-xl bg-[var(--capture-primary)] px-3 py-2 text-sm font-semibold text-[var(--capture-inverse)]">
              查看详情
            </button>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function DashboardPreview({ content }: { content: ScenarioContent }) {
  return (
    <div className="min-h-[520px] rounded-[var(--capture-radius-xl)] bg-[var(--capture-surface)] p-4 shadow-[var(--capture-card-shadow)]">
      <div className="flex items-center justify-between border-b border-[var(--capture-divider)] pb-4">
        <div>
          <p className="text-xs font-semibold text-[var(--capture-text-accent)]">AIMIRA {content.shortName}</p>
          <h3 className="mt-1 text-xl font-semibold text-[var(--capture-text)]">{content.dashboardTitle}</h3>
          <p className="mt-1 text-sm text-[var(--capture-muted)]">{content.dashboardSubtitle}</p>
        </div>
        <button className="rounded-xl bg-[var(--capture-primary)] px-4 py-2 text-sm font-semibold text-[var(--capture-inverse)]">
          新建预约
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {content.dashboardKpis.map(([label, value, change]) => (
          <div key={label} className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface-elevated)] p-4">
            <p className="text-sm font-semibold text-[var(--capture-muted)]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[var(--capture-text)]">{value}</p>
            <p className="mt-3 w-fit rounded-full bg-[var(--capture-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--capture-text-accent)]">{change}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface-elevated)] p-4">
          <p className="font-semibold text-[var(--capture-text)]">经营趋势</p>
          <div className="mt-4 flex h-44 items-end gap-3 rounded-2xl bg-[var(--capture-surface-muted)] p-4">
            {[40, 58, 46, 70, 62, 84, 76].map((height) => (
              <span key={height} className="flex-1 rounded-t-xl bg-[var(--capture-gradient-button)]" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--capture-border)] bg-[var(--capture-surface-elevated)] p-4">
          <p className="font-semibold text-[var(--capture-text)]">任务提醒</p>
          <div className="mt-4 grid gap-2">
            {content.dashboardTasks.map((item) => (
              <p key={item} className="rounded-xl bg-[var(--capture-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--capture-text)]">{item}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--capture-border)]">
        <div className="grid grid-cols-5 bg-[var(--capture-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--capture-muted)]">
          <span>名称</span><span>项目</span><span>负责人</span><span>时间</span><span>状态</span>
        </div>
        {content.tableRows.map((row) => (
          <div key={row[0]} className="grid grid-cols-5 border-t border-[var(--capture-divider)] px-4 py-3 text-sm font-semibold text-[var(--capture-text)]">
            {row.slice(0, 4).map((cell) => <span key={cell}>{cell}</span>)}
            <span className="w-fit rounded-full bg-[var(--capture-primary-soft)] px-2 py-1 text-xs text-[var(--capture-text-accent)]">{row[4]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[390px] rounded-[34px] border border-[var(--capture-border)] bg-[var(--capture-bg)] p-4 shadow-[var(--capture-floating)]">
      <div className="min-h-[620px] rounded-[26px] bg-[var(--capture-bg)] p-4">
        {children}
      </div>
    </div>
  );
}

function MobileTabbar() {
  return (
    <div className="mt-5 grid grid-cols-4 rounded-3xl border border-[var(--capture-border)] bg-[var(--capture-surface)] p-2 shadow-[var(--capture-card-shadow)]">
      {["首页", "工作台", "消息", "我的"].map((item, index) => (
        <div key={item} className={`rounded-2xl py-2 text-center text-xs font-semibold ${index === 0 ? "bg-[var(--capture-primary-soft)] text-[var(--capture-primary)]" : "text-[var(--capture-muted)]"}`}>
          {item}
        </div>
      ))}
    </div>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[var(--capture-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--capture-primary)]">
      {children}
    </span>
  );
}

function TokenDebugPanel({
  checks,
  heroTextColor,
  mode,
  tokens,
}: {
  checks: ReturnType<typeof getPreviewTokenChecks>;
  heroTextColor: string;
  mode: ThemeMode;
  tokens: ActiveThemeTokens;
}) {
  const tokenRows = [
    ["mode", mode],
    ["primary", tokens.colors.primary],
    ["primarySoft", tokens.colors.primarySoft],
    ["background", tokens.colors.background],
    ["surface", tokens.colors.surface],
    ["surfaceMuted", tokens.colors.surfaceMuted],
    ["textPrimary", tokens.colors.textPrimary],
    ["textSecondary", tokens.colors.textSecondary],
    ["border", tokens.colors.border],
    ["heroGradient", tokens.gradients.hero],
    ["heroTextColor", heroTextColor],
  ];

  return (
    <details className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-slate-800">
        Token 使用检查
      </summary>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-2">
          {tokenRows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[120px_1fr] gap-3 text-xs">
              <span className="font-semibold text-slate-500">{label}</span>
              <span className="break-all font-mono text-slate-700">{value}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          {checks.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-xs">
              <span className="font-semibold text-slate-600">{item.label}</span>
              <span className={`rounded-full px-2 py-1 font-semibold ${item.pass ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {item.pass ? "通过" : "需优化"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

async function extractPalette(imageUrl: string): Promise<Palette> {
  const [{ Vibrant }, averageColor] = await Promise.all([
    import("node-vibrant/browser"),
    getAverageColor(imageUrl),
  ]);
  const palette = await Vibrant.from(imageUrl).getPalette();
  const vibrant = palette.Vibrant?.hex || averageColor;
  const muted = palette.Muted?.hex || mix(vibrant, "#64748B", 0.45);
  const darkVibrant = palette.DarkVibrant?.hex || darken(vibrant, 0.42);
  const darkMuted = palette.DarkMuted?.hex || darken(muted, 0.36);
  const lightVibrant = palette.LightVibrant?.hex || lighten(vibrant, 0.48);
  const lightMuted = palette.LightMuted?.hex || lighten(muted, 0.54);

  return {
    vibrant,
    muted,
    darkVibrant,
    darkMuted,
    lightVibrant,
    lightMuted,
    averageColor,
  };
}

function buildThemeTokens(colorModes: Record<ThemeMode, EditableModeColors>, options: ThemeOptions): ThemeTokens {
  const radius = getRadius(options.radius);
  const shared: SharedTokens = {
    radius,
    typography: {
      fontFamily: "Inter, PingFang SC, Microsoft YaHei, sans-serif",
      headingWeight: 700,
      bodyWeight: 500,
    },
    effects: {
      blur: options.style === "glass" ? "18px" : "0px",
      glassOpacity: options.style === "glass" ? 0.72 : 1,
      glowIntensity: options.style === "glow" || options.style === "glass" ? 0.28 : 0.12,
    },
    density: options.density,
  };

  return {
    light: buildModeTokens(colorModes.light, "light", options),
    dark: buildModeTokens(colorModes.dark, "dark", options),
    shared,
  };
}

function buildModeTokens(colors: EditableModeColors, mode: ThemeMode, options: ThemeOptions): ModeTokens {
  const primary = ensureModePrimary(colors.primary, mode);
  const secondary = normalizeHex(colors.secondary);
  const accent = normalizeHex(colors.accent);
  const background = normalizeHex(colors.background);
  const surface = normalizeHex(colors.surface);
  const surfaceMuted = normalizeHex(colors.surfaceMuted);
  const textPrimary = ensureText(colors.textPrimary, surface);
  const textSecondary = ensureText(colors.textSecondary, surfaceMuted);
  const textMuted = mode === "dark" ? "#94A3B8" : "#64748B";
  const textAccent = ensureText(colors.textAccent || primary, mode === "dark" ? background : mix(primary, surface, 0.84));
  const textInverse = ensureText(colors.textInverse, primary);
  const border = normalizeHex(colors.border);
  const primaryHover = mode === "dark" ? lighten(primary, 0.12) : darken(primary, 0.12);
  const primaryActive = mode === "dark" ? lighten(primary, 0.2) : darken(primary, 0.2);
  const primarySoft = mode === "dark" ? withAlpha(primary, 0.18) : mix(primary, surface, 0.86);
  const primarySofter = mode === "dark" ? withAlpha(primary, 0.1) : mix(primary, surface, 0.93);
  const secondarySoft = mode === "dark" ? withAlpha(secondary, 0.16) : mix(secondary, surface, 0.88);
  const accentSoft = mode === "dark" ? withAlpha(accent, 0.16) : mix(accent, surface, 0.86);
  const surfaceElevated = mode === "dark" ? lighten(surface, 0.08) : mix(primary, "#FFFFFF", 0.96);
  const backgroundGradient =
    mode === "dark"
      ? `linear-gradient(135deg, ${background}, ${mix(primary, background, 0.82)})`
      : `linear-gradient(135deg, ${background}, ${mix(primary, "#FFFFFF", 0.92)})`;
  const shadow = getShadow(options.shadow, primary, mode);

  return {
    colors: {
      primary,
      primaryHover,
      primaryActive,
      primarySoft,
      primarySofter,
      secondary,
      secondarySoft,
      accent,
      accentSoft,
      background,
      backgroundGradient,
      surface,
      surfaceElevated,
      surfaceMuted,
      textPrimary,
      textSecondary,
      textMuted,
      textAccent,
      textInverse,
      border,
      divider: mode === "dark" ? withAlpha("#94A3B8", 0.18) : withAlpha(border, 0.86),
      success: mode === "dark" ? "#4ADE80" : "#18A058",
      warning: mode === "dark" ? "#FBBF24" : "#F59E0B",
      danger: mode === "dark" ? "#FB7185" : "#E11D48",
      info: mode === "dark" ? "#60A5FA" : "#2563EB",
    },
    gradients: {
      hero: backgroundGradient,
      card:
        options.style === "glass"
          ? `linear-gradient(135deg, ${withAlpha(surfaceElevated, mode === "dark" ? 0.82 : 0.78)}, ${withAlpha(mix(primary, surface, 0.88), 0.72)})`
          : `linear-gradient(135deg, ${surface}, ${mode === "dark" ? mix(primary, surface, 0.9) : mix(accent, surface, 0.92)})`,
      button: `linear-gradient(135deg, ${primary}, ${accent})`,
      border: `linear-gradient(135deg, ${withAlpha(primary, mode === "dark" ? 0.32 : 0.24)}, ${withAlpha(accent, mode === "dark" ? 0.18 : 0.14)})`,
      glow: `radial-gradient(circle, ${withAlpha(primary, mode === "dark" ? 0.28 : 0.16)}, transparent 62%)`,
    },
    shadow,
  };
}

function getActiveTokens(tokens: ThemeTokens, mode: ThemeMode): ActiveThemeTokens {
  return {
    ...tokens[mode],
    ...tokens.shared,
  };
}

function getReadableTextColorForGradient(gradient: string, tokens: ActiveThemeTokens) {
  const representativeColor = getGradientRepresentativeColor(gradient);
  const textPrimaryContrast = contrastRatio(tokens.colors.textPrimary, representativeColor);
  const textInverseContrast = contrastRatio(tokens.colors.textInverse, representativeColor);

  if (textPrimaryContrast >= textInverseContrast && textPrimaryContrast >= 4.5) {
    return tokens.colors.textPrimary;
  }

  if (textInverseContrast >= 4.5) {
    return tokens.colors.textInverse;
  }

  return getLuminance(representativeColor) > 0.5 ? "#0F172A" : "#FFFFFF";
}

function getHeroCardStyle(tokens: ActiveThemeTokens, mode: ThemeMode): React.CSSProperties {
  const heroTextColor = getReadableTextColorForGradient(tokens.gradients.hero, tokens);
  const representativeColor = getGradientRepresentativeColor(tokens.gradients.hero);
  const needsOverlay = contrastRatio(heroTextColor, representativeColor) < 4.5;
  const overlay = getLuminance(representativeColor) > 0.5
    ? "linear-gradient(0deg, rgba(255,255,255,0.18), rgba(255,255,255,0.18))"
    : "linear-gradient(0deg, rgba(2,6,23,0.22), rgba(2,6,23,0.22))";

  return {
    background: needsOverlay ? `${overlay}, ${tokens.gradients.hero}` : tokens.gradients.hero,
    color: heroTextColor,
    borderColor: mode === "dark" ? withAlpha(tokens.colors.primary, 0.24) : tokens.colors.border,
  };
}

function getGradientRepresentativeColor(gradient: string) {
  const matches = gradient.match(/#[0-9a-fA-F]{6}/g);
  if (!matches?.length) return "#F8FAFC";

  const mixed = matches.reduce((current, color, index) => {
    if (index === 0) return normalizeHex(color);
    return mix(current, color, 0.5);
  }, normalizeHex(matches[0]));

  return mixed;
}

function getPreviewTokenChecks(tokens: ActiveThemeTokens, mode: ThemeMode) {
  const heroTextColor = getReadableTextColorForGradient(tokens.gradients.hero, tokens);
  const heroBg = getGradientRepresentativeColor(tokens.gradients.hero);
  const layerGap = Math.abs(getLuminance(tokens.colors.background) - getLuminance(tokens.colors.surface));
  const navActiveContrast = contrastRatio(tokens.colors.primary, tokens.colors.primarySoft);

  return [
    {
      label: "Banner 文字对比",
      pass: contrastRatio(heroTextColor, heroBg) >= 4.5,
    },
    {
      label: "普通卡片层级",
      pass: layerGap >= (mode === "dark" ? 0.018 : 0.025),
    },
    {
      label: "主按钮可见性",
      pass: contrastRatio(tokens.colors.textInverse, tokens.colors.primary) >= 3,
    },
    {
      label: "底部导航可读性",
      pass: navActiveContrast >= 3,
    },
  ];
}

function paletteToEditableColorModes(palette: Palette): Record<ThemeMode, EditableModeColors> {
  const primary = ensureSaturatedPrimary(palette.vibrant);
  const secondary = normalizeHex(palette.muted);
  const accent = ensureSaturatedPrimary(palette.lightVibrant || palette.vibrant);

  return {
    light: optimizeModeColors(
      {
        primary,
        secondary,
        accent,
        background: mix(palette.lightMuted, "#FFFFFF", 0.78),
        surface: "#FFFFFF",
        surfaceMuted: mix(primary, "#FFFFFF", 0.94),
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        textAccent: ensureText(darken(primary, 0.18), mix(primary, "#FFFFFF", 0.86)),
        textInverse: "#FFFFFF",
        border: mix(secondary, "#E6EAF2", 0.82),
      },
      "light",
    ),
    dark: optimizeModeColors(
      {
        primary: deriveModeColor(primary, "dark", "primary"),
        secondary: deriveModeColor(secondary, "dark", "secondary"),
        accent: deriveModeColor(accent, "dark", "accent"),
        background: mix(darken(primary, 0.74), "#0B1020", 0.78),
        surface: mix(darken(primary, 0.62), "#111827", 0.78),
        surfaceMuted: mix(darken(primary, 0.54), "#172033", 0.72),
        textPrimary: "#F8FAFC",
        textSecondary: "#CBD5E1",
        textAccent: deriveModeColor(primary, "dark", "textAccent"),
        textInverse: "#FFFFFF",
        border: mix(darken(primary, 0.52), "#334155", 0.76),
      },
      "dark",
    ),
  };
}

function buildThemeRecommendations(palette: Palette): ThemeRecommendation[] {
  const base = paletteToEditableColorModes(palette);
  const primary = base.light.primary;
  const secondary = base.light.secondary;
  const accent = base.light.accent;
  const name = suggestName(primary, palette);

  const enterpriseModes: Record<ThemeMode, EditableModeColors> = {
    light: optimizeModeColors({
      ...base.light,
      background: "#F8FAFC",
      surface: "#FFFFFF",
      surfaceMuted: mix(primary, "#FFFFFF", 0.94),
      border: "#E2E8F0",
      textPrimary: "#0F172A",
      textSecondary: "#475569",
    }, "light"),
    dark: optimizeModeColors({
      ...base.dark,
      background: "#0F172A",
      surface: "#111827",
      surfaceMuted: "#1E293B",
      border: "#334155",
      textPrimary: "#F8FAFC",
      textSecondary: "#CBD5E1",
    }, "dark"),
  };

  const freshPrimary = mix(primary, "#06B6D4", 0.48);
  const freshAccent = mix(accent, "#22C55E", 0.44);
  const freshModes: Record<ThemeMode, EditableModeColors> = {
    light: optimizeModeColors({
      primary: freshPrimary,
      secondary: mix(secondary, "#67E8F9", 0.48),
      accent: freshAccent,
      background: mix(freshPrimary, "#FFFFFF", 0.95),
      surface: "#FFFFFF",
      surfaceMuted: mix(freshPrimary, "#FFFFFF", 0.9),
      textPrimary: "#102033",
      textSecondary: "#5B6B82",
      textAccent: ensureText(darken(freshPrimary, 0.18), "#FFFFFF"),
      textInverse: "#FFFFFF",
      border: mix(freshPrimary, "#E2E8F0", 0.72),
    }, "light"),
    dark: optimizeModeColors({
      primary: deriveModeColor(freshPrimary, "dark", "primary"),
      secondary: deriveModeColor(secondary, "dark", "secondary"),
      accent: deriveModeColor(freshAccent, "dark", "accent"),
      background: "#071A24",
      surface: "#0D2532",
      surfaceMuted: "#163544",
      textPrimary: "#F3FBFF",
      textSecondary: "#B8D4DE",
      textAccent: deriveModeColor(freshPrimary, "dark", "textAccent"),
      textInverse: "#FFFFFF",
      border: "rgba(148, 219, 230, 0.24)",
    }, "dark"),
  };

  const darkModes: Record<ThemeMode, EditableModeColors> = {
    light: optimizeModeColors({
      ...base.light,
      background: "#F6F7FB",
      surface: "#FFFFFF",
      surfaceMuted: "#EEF1F7",
      border: "#DDE3EE",
      textPrimary: "#111827",
      textSecondary: "#4B5563",
    }, "light"),
    dark: optimizeModeColors({
      primary: deriveModeColor(primary, "dark", "primary"),
      secondary: deriveModeColor(secondary, "dark", "secondary"),
      accent: deriveModeColor(accent, "dark", "accent"),
      background: "#070A12",
      surface: "#0F172A",
      surfaceMuted: "#1A2438",
      textPrimary: "#F8FAFC",
      textSecondary: "#CBD5E1",
      textAccent: deriveModeColor(primary, "dark", "textAccent"),
      textInverse: "#FFFFFF",
      border: "rgba(148, 163, 184, 0.22)",
    }, "dark"),
  };

  return [
    {
      id: "enterprise",
      name: "稳重企业版",
      summary: "适合后台、内部系统和需要可信感的业务页面。",
      bestFor: "SaaS 后台、CRM、运营看板",
      styleName: name,
      colorModes: enterpriseModes,
      options: { mode: "light", style: "gradient", radius: "soft", shadow: "light", density: "comfortable" },
    },
    {
      id: "fresh",
      name: "明亮清爽版",
      summary: "整体更轻、更亲和，适合 App 首页和轻办公场景。",
      bestFor: "移动 App、健康服务、轻办公",
      styleName: name.replace("智能", "清爽"),
      colorModes: freshModes,
      options: { mode: "light", style: "linear", radius: "rounded", shadow: "light", density: "comfortable" },
    },
    {
      id: "dark",
      name: "深色高级版",
      summary: "保留主色基因，生成独立深色 Token，不做简单反色。",
      bestFor: "AI 工具、数据看板、指挥中心",
      styleName: name.replace("风", "深色风"),
      colorModes: darkModes,
      options: { mode: "dark", style: "glow", radius: "soft", shadow: "medium", density: "compact" },
    },
  ];
}

function tokenStyle(tokens: ActiveThemeTokens, options: ThemeOptions) {
  return {
    "--capture-primary": tokens.colors.primary,
    "--capture-primary-soft": tokens.colors.primarySoft,
    "--capture-secondary": tokens.colors.secondary,
    "--capture-secondary-soft": tokens.colors.secondarySoft,
    "--capture-accent": tokens.colors.accent,
    "--capture-accent-soft": tokens.colors.accentSoft,
    "--capture-bg": tokens.colors.background,
    "--capture-surface": tokens.colors.surface,
    "--capture-surface-elevated": tokens.colors.surfaceElevated,
    "--capture-surface-muted": tokens.colors.surfaceMuted,
    "--capture-text": tokens.colors.textPrimary,
    "--capture-muted": tokens.colors.textSecondary,
    "--capture-text-accent": tokens.colors.textAccent,
    "--capture-inverse": tokens.colors.textInverse,
    "--capture-border": tokens.colors.border,
    "--capture-divider": tokens.colors.divider,
    "--capture-gradient-button": tokens.gradients.button,
    "--capture-gradient-card": tokens.gradients.card,
    "--capture-radius-xl": tokens.radius.xl,
    "--capture-card-shadow": tokens.shadow.card,
    "--capture-floating": tokens.shadow.floating,
    "--capture-shadow": tokens.shadow.card,
    "--capture-glow": tokens.shadow.glow,
    "--capture-density-space": options.density === "compact" ? "0.75rem" : "1rem",
  } as React.CSSProperties;
}

function toCssVariables(tokens: ThemeTokens, scope: ExportScope) {
  const lightBlock = cssVariableBlock(":root", tokens.light, tokens.shared);
  const darkBlock = cssVariableBlock(scope === "dark" ? ":root" : "[data-theme=\"dark\"]", tokens.dark, tokens.shared);

  if (scope === "light") return lightBlock;
  if (scope === "dark") return darkBlock;
  return `${lightBlock}

${darkBlock}`;
}

function cssVariableBlock(selector: string, modeTokens: ModeTokens, shared: SharedTokens) {
  return `${selector} {
  --color-primary: ${modeTokens.colors.primary};
  --color-primary-hover: ${modeTokens.colors.primaryHover};
  --color-primary-active: ${modeTokens.colors.primaryActive};
  --color-primary-soft: ${modeTokens.colors.primarySoft};
  --color-primary-softer: ${modeTokens.colors.primarySofter};
  --color-secondary: ${modeTokens.colors.secondary};
  --color-accent: ${modeTokens.colors.accent};
  --color-bg-page: ${modeTokens.colors.background};
  --color-bg-gradient: ${modeTokens.colors.backgroundGradient};
  --color-bg-card: ${modeTokens.colors.surface};
  --color-bg-elevated: ${modeTokens.colors.surfaceElevated};
  --color-bg-muted: ${modeTokens.colors.surfaceMuted};
  --color-text-primary: ${modeTokens.colors.textPrimary};
  --color-text-secondary: ${modeTokens.colors.textSecondary};
  --color-text-muted: ${modeTokens.colors.textMuted};
  --color-text-accent: ${modeTokens.colors.textAccent};
  --color-text-inverse: ${modeTokens.colors.textInverse};
  --color-border: ${modeTokens.colors.border};
  --gradient-hero: ${modeTokens.gradients.hero};
  --gradient-button: ${modeTokens.gradients.button};
  --radius-card: ${shared.radius.xl};
  --radius-control: ${shared.radius.md};
  --shadow-card: ${modeTokens.shadow.card};
  --shadow-floating: ${modeTokens.shadow.floating};
}`;
}

function toTailwindConfig(tokens: ThemeTokens, scope: ExportScope) {
  const modes =
    scope === "both"
      ? `light: ${JSON.stringify(tokens.light.colors, null, 6)},
      dark: ${JSON.stringify(tokens.dark.colors, null, 6)}`
      : `${scope}: ${JSON.stringify(tokens[scope].colors, null, 6)}`;

  return `darkMode: ["class", "[data-theme='dark']"],
theme: {
  extend: {
    colors: {
      mode: {
      ${modes}
      }
    },
    borderRadius: {
      sm: "${tokens.shared.radius.sm}",
      md: "${tokens.shared.radius.md}",
      lg: "${tokens.shared.radius.lg}",
      xl: "${tokens.shared.radius.xl}"
    }
  }
}`;
}

function toJsonTokens(tokens: ThemeTokens, scope: ExportScope) {
  if (scope === "light") return JSON.stringify({ light: tokens.light, shared: tokens.shared }, null, 2);
  if (scope === "dark") return JSON.stringify({ dark: tokens.dark, shared: tokens.shared }, null, 2);
  return JSON.stringify(tokens, null, 2);
}

function getRadius(mode: RadiusMode) {
  if (mode === "restrained") return { sm: "6px", md: "10px", lg: "14px", xl: "18px" };
  if (mode === "rounded") return { sm: "12px", md: "18px", lg: "24px", xl: "32px" };
  return { sm: "8px", md: "14px", lg: "20px", xl: "24px" };
}

function deriveModeColor(color: string, mode: ThemeMode, key: string) {
  const normalized = normalizeHex(color);
  if (mode === "dark") {
    if (key === "textAccent") return lighten(normalized, 0.18);
    return getLuminance(normalized) < 0.28 ? lighten(normalized, 0.18) : normalized;
  }
  if (key === "textAccent") return getLuminance(normalized) > 0.42 ? darken(normalized, 0.2) : normalized;
  return getLuminance(normalized) > 0.72 ? darken(normalized, 0.28) : normalized;
}

function generateOppositeMode(colors: EditableModeColors, targetMode: ThemeMode): EditableModeColors {
  if (targetMode === "dark") {
    const primary = deriveModeColor(colors.primary, "dark", "primary");
    const secondary = deriveModeColor(colors.secondary, "dark", "secondary");
    const accent = deriveModeColor(colors.accent, "dark", "accent");
    return optimizeModeColors(
      {
        primary,
        secondary,
        accent,
        background: mix(darken(primary, 0.72), "#0B1020", 0.78),
        surface: mix(darken(primary, 0.62), "#111827", 0.8),
        surfaceMuted: mix(darken(primary, 0.54), "#172033", 0.74),
        textPrimary: "#F8FAFC",
        textSecondary: "#CBD5E1",
        textAccent: deriveModeColor(colors.textAccent || primary, "dark", "textAccent"),
        textInverse: "#FFFFFF",
        border: mix(darken(primary, 0.5), "#334155", 0.76),
      },
      "dark",
    );
  }

  const primary = deriveModeColor(colors.primary, "light", "primary");
  const secondary = deriveModeColor(colors.secondary, "light", "secondary");
  const accent = deriveModeColor(colors.accent, "light", "accent");
  return optimizeModeColors(
    {
      primary,
      secondary,
      accent,
      background: "#F8FAFC",
      surface: "#FFFFFF",
      surfaceMuted: mix(primary, "#FFFFFF", 0.94),
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      textAccent: deriveModeColor(colors.textAccent || primary, "light", "textAccent"),
      textInverse: "#FFFFFF",
      border: mix(secondary, "#E6EAF2", 0.82),
    },
    "light",
  );
}

function optimizeModeColors(colors: EditableModeColors, mode: ThemeMode): EditableModeColors {
  const primary = ensureSaturatedPrimary(colors.primary);
  const surface = mode === "dark"
    ? ensureDarkLayer(colors.surface, "#111827", 0.18)
    : ensureLightLayer(colors.surface, "#FFFFFF", 0.86);
  const background = mode === "dark"
    ? ensureDarkLayer(colors.background, "#0B1020", 0.1)
    : ensureLightLayer(colors.background, "#F8FAFC", 0.82);
  const surfaceMuted = mode === "dark"
    ? ensureDarkLayer(colors.surfaceMuted, "#172033", 0.18)
    : ensureLightLayer(colors.surfaceMuted, mix(primary, "#FFFFFF", 0.94), 0.76);

  return {
    ...colors,
    primary,
    background,
    surface,
    surfaceMuted,
    textPrimary: ensureText(mode === "dark" ? "#F8FAFC" : colors.textPrimary, surface),
    textSecondary: ensureText(mode === "dark" ? "#CBD5E1" : colors.textSecondary, surfaceMuted),
    textAccent: ensureText(colors.textAccent || primary, mode === "dark" ? background : mix(primary, surface, 0.86)),
    textInverse: ensureText(colors.textInverse || "#FFFFFF", primary),
    border: mode === "dark" ? mix(colors.border, "#334155", 0.78) : mix(colors.border, "#E6EAF2", 0.72),
  };
}

function ensureSaturatedPrimary(color: string) {
  const normalized = normalizeHex(color);
  if (getLuminance(normalized) > 0.78) return darken(normalized, 0.3);
  if (getLuminance(normalized) < 0.12) return lighten(normalized, 0.2);
  return normalized;
}

function ensureModePrimary(color: string, mode: ThemeMode) {
  let normalized = ensureSaturatedPrimary(color);
  if (mode === "light") {
    const soft = mix(normalized, "#FFFFFF", 0.86);
    let guard = 0;
    while (contrastRatio(normalized, soft) < 3 && guard < 4) {
      normalized = darken(normalized, 0.12);
      guard += 1;
    }
  } else {
    const bg = "#0F172A";
    let guard = 0;
    while (contrastRatio(normalized, bg) < 3 && guard < 4) {
      normalized = lighten(normalized, 0.12);
      guard += 1;
    }
  }
  return normalized;
}

function ensureLightLayer(color: string, fallback: string, minLuminance: number) {
  const normalized = normalizeHex(color);
  return getLuminance(normalized) < minLuminance ? mix(normalized, fallback, 0.78) : normalized;
}

function ensureDarkLayer(color: string, fallback: string, maxLuminance: number) {
  const normalized = normalizeHex(color);
  return getLuminance(normalized) > maxLuminance ? mix(normalized, fallback, 0.78) : normalized;
}

function getThemeQualityChecks(tokens: ThemeTokens) {
  return {
    light: getModeQualityChecks(tokens.light),
    dark: getModeQualityChecks(tokens.dark),
  };
}

function getModeQualityChecks(tokens: ModeTokens) {
  const colors = tokens.colors;
  const backgroundLayerGap = Math.abs(getLuminance(colors.background) - getLuminance(colors.surface));
  return [
    {
      label: "主色可读性",
      pass: contrastRatio(colors.textAccent, colors.primarySoft) >= 3,
    },
    {
      label: "按钮对比度",
      pass: contrastRatio(colors.textInverse, colors.primary) >= 3,
    },
    {
      label: "卡片文字对比度",
      pass: contrastRatio(colors.textPrimary, colors.surface) >= 4.5,
    },
    {
      label: "背景层级",
      pass: backgroundLayerGap >= 0.025,
    },
  ];
}

function getShadow(mode: ShadowMode, primary: string, themeMode: ThemeMode) {
  if (mode === "none") return { card: "none", floating: "none", glow: "none" };
  const neutral = themeMode === "dark" ? "rgba(0, 0, 0, 0.28)" : "rgba(15, 23, 42, 0.08)";
  if (mode === "medium") {
    return {
      card: `0 16px 42px ${themeMode === "dark" ? "rgba(0, 0, 0, 0.38)" : "rgba(15, 23, 42, 0.12)"}`,
      floating: `0 24px 64px ${themeMode === "dark" ? "rgba(0, 0, 0, 0.46)" : "rgba(15, 23, 42, 0.16)"}`,
      glow: `0 18px 48px ${withAlpha(primary, themeMode === "dark" ? 0.34 : 0.26)}`,
    };
  }
  return {
    card: `0 12px 32px ${neutral}`,
    floating: `0 18px 48px ${themeMode === "dark" ? "rgba(0, 0, 0, 0.34)" : "rgba(15, 23, 42, 0.10)"}`,
    glow: `0 14px 36px ${withAlpha(primary, themeMode === "dark" ? 0.28 : 0.18)}`,
  };
}

async function getAverageColor(imageUrl: string): Promise<string> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("image load failed"));
  });
  const canvas = document.createElement("canvas");
  const size = 48;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return fallbackPalette.averageColor;
  context.drawImage(image, 0, 0, size, size);
  const { data } = context.getImageData(0, 0, size, size);
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 40) continue;
    r += data[index];
    g += data[index + 1];
    b += data[index + 2];
    count += 1;
  }
  return rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count));
}

function suggestName(primary: string, palette: Palette) {
  const hue = rgbToHsl(hexToRgb(primary)).h;
  const luminance = getLuminance(primary);
  const isGradient = colorDistance(palette.vibrant, palette.lightVibrant) > 105;
  if (luminance < 0.16 && hue > 32 && hue < 72) return "黑金高级风";
  if (isGradient && hue > 230 && hue < 310) return "极光渐变风";
  if (hue >= 180 && hue < 260) return "蓝紫智能风";
  if (hue >= 140 && hue < 180) return "青绿健康风";
  if (hue >= 20 && hue < 70) return "橙金增长风";
  if (hue >= 200 && hue < 240) return "冰川专业风";
  return "图片捕捉风";
}

function suggestWebsiteStyleName(result: WebsiteCaptureResult) {
  const baseName = result.keywords.includes("黑金轻奢")
    ? "黑金轻奢风"
    : result.keywords.includes("美业品牌")
      ? "美业品牌风"
      : suggestName(result.palette.vibrant, result.palette);
  const brand = result.title
    .replace(/\s+/g, " ")
    .split(/[|｜\-–—]/)[0]
    .trim()
    .slice(0, 14);

  return brand ? `${brand} ${baseName}` : `${result.host} ${baseName}`;
}

function inferColorPreference(primary: string) {
  const hue = rgbToHsl(hexToRgb(primary)).h;
  const luminance = getLuminance(primary);

  if (luminance < 0.14) return "黑金系";
  if (hue >= 200 && hue < 260) return "蓝色系";
  if (hue >= 260 && hue < 320) return "紫色系";
  if (hue >= 95 && hue < 165) return "绿色系";
  if (hue >= 165 && hue < 200) return "青色系";
  if (hue >= 20 && hue < 70) return "橙色系";
  if (hue >= 320 || hue < 20) return "红粉系";
  return "渐变多彩";
}

function ensureText(color: string, background: string) {
  const normalized = normalizeHex(color);
  if (contrastRatio(normalized, background) >= 4.5) return normalized;
  return getLuminance(background) > 0.5 ? "#0F172A" : "#F8FAFC";
}

function normalizeHex(value: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toUpperCase();
  }
  return fallbackPalette.vibrant;
}

function toColorInputValue(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallbackPalette.vibrant;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex).replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function mix(a: string, b: string, weight = 0.5) {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  return rgbToHex(
    Math.round(first.r * (1 - weight) + second.r * weight),
    Math.round(first.g * (1 - weight) + second.g * weight),
    Math.round(first.b * (1 - weight) + second.b * weight),
  );
}

function lighten(hex: string, amount: number) {
  return mix(hex, "#FFFFFF", amount);
}

function darken(hex: string, amount: number) {
  return mix(hex, "#000000", amount);
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const values = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function contrastRatio(a: string, b: string) {
  const first = getLuminance(a);
  const second = getLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    switch (max) {
      case r1:
        h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) * 60;
        break;
      case g1:
        h = ((b1 - r1) / d + 2) * 60;
        break;
      default:
        h = ((r1 - g1) / d + 4) * 60;
    }
  }
  return { h, l };
}

function colorDistance(a: string, b: string) {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  return Math.sqrt(
    (first.r - second.r) ** 2 + (first.g - second.g) ** 2 + (first.b - second.b) ** 2,
  );
}
