import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputPath = path.join(root, "data/expanded-styles-v5.json");
const generatedAt = "2026-06-18";

const families = [
  {
    slug: "minimal-blue-saas",
    name: "蓝白极简 SaaS",
    category: "企业 SaaS / 移动工作台",
    mood: "商务稳重",
    colorPreference: "蓝色系",
    scenario: "B2B SaaS、企业 App、客户运营、移动审批。",
    base: {
      primary: "#2563EB",
      secondary: "#64748B",
      accent: "#38BDF8",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      border: "#E2E8F0",
    },
    suitableFor: ["企业后台", "客户运营 App", "移动审批"],
    notSuitableFor: ["强娱乐社区", "暗黑大屏"],
    coverVariant: "saas-dashboard",
    previewScenario: "enterprise-workbench",
    atmosphere: "极简留白、轻边框、低饱和蓝色强调",
  },
  {
    slug: "linear-productivity",
    name: "Linear 效率工具",
    category: "效率工具 / 任务协作",
    mood: "商务稳重",
    colorPreference: "黑白灰",
    scenario: "项目管理、任务协作、研发流程、轻量 CRM。",
    base: {
      primary: "#111827",
      secondary: "#475569",
      accent: "#2563EB",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      border: "#D8DEE8",
    },
    suitableFor: ["任务协作", "研发工具", "工作流 App"],
    notSuitableFor: ["少女社区", "强营销活动"],
    coverVariant: "linear-system",
    previewScenario: "enterprise-workbench",
    atmosphere: "细线分割、等宽节奏、干净工具感",
  },
  {
    slug: "apple-soft-glass",
    name: "Apple 轻玻璃 App",
    category: "移动 App / 高级工具",
    mood: "高级轻奢",
    colorPreference: "渐变多彩",
    scenario: "高端移动工具、个人效率、会员中心、轻量 AI 助手。",
    base: {
      primary: "#4F46E5",
      secondary: "#8B5CF6",
      accent: "#38BDF8",
      background: "#F6F7FB",
      surface: "#FFFFFF",
      border: "#E1E7F5",
    },
    suitableFor: ["高端 App", "会员工具", "智能助手"],
    notSuitableFor: ["高密度 ERP", "政务流程"],
    coverVariant: "glass-aurora",
    previewScenario: "mobile-workbench",
    atmosphere: "浅玻璃、柔和光晕、空间层次",
  },
  {
    slug: "redbook-rose-content",
    name: "红粉内容社区",
    category: "内容社区 / 种草 App",
    mood: "活力年轻",
    colorPreference: "红粉系",
    scenario: "内容社区、种草笔记、达人主页、活动增长。",
    base: {
      primary: "#E11D48",
      secondary: "#FB7185",
      accent: "#F9A8D4",
      background: "#FFF7FA",
      surface: "#FFFFFF",
      border: "#F8D7E2",
    },
    suitableFor: ["内容社区", "种草 App", "营销活动"],
    notSuitableFor: ["金融风控", "政企后台"],
    coverVariant: "mobile-workbench",
    previewScenario: "mobile-workbench",
    atmosphere: "红粉强调、轻社交卡片、活泼标签",
  },
  {
    slug: "yellow-local-life",
    name: "明黄本地生活",
    category: "本地生活 / 门店服务",
    mood: "本地生活",
    colorPreference: "橙色系",
    scenario: "门店预约、团购、外卖服务、到店履约。",
    base: {
      primary: "#F59E0B",
      secondary: "#FB923C",
      accent: "#22C55E",
      background: "#FFF8E7",
      surface: "#FFFFFF",
      border: "#F4DFB3",
    },
    suitableFor: ["门店经营", "预约服务", "本地生活 App"],
    notSuitableFor: ["高端金融", "暗色安全中心"],
    coverVariant: "local-service",
    previewScenario: "local-service",
    atmosphere: "明黄行动、优惠券卡片、亲和服务感",
  },
  {
    slug: "neon-short-video",
    name: "暗黑霓虹内容风",
    category: "内容娱乐 / 短视频",
    mood: "暗色酷炫",
    colorPreference: "黑金系",
    scenario: "短视频工具、直播运营、创作者中心、内容增长。",
    base: {
      primary: "#A855F7",
      secondary: "#06B6D4",
      accent: "#F43F5E",
      background: "#080A14",
      surface: "#111827",
      border: "#243044",
    },
    suitableFor: ["内容创作", "直播运营", "年轻化 App"],
    notSuitableFor: ["医疗报告", "政务审批"],
    coverVariant: "dark-command",
    previewScenario: "dark-dashboard",
    atmosphere: "暗底霓虹、聚焦内容、强状态反馈",
  },
  {
    slug: "aesthetic-medical",
    name: "医美高级粉白",
    category: "医美美容 / 预约咨询",
    mood: "医疗健康",
    colorPreference: "红粉系",
    scenario: "医美咨询、皮肤管理、到店预约、项目套餐。",
    base: {
      primary: "#DB2777",
      secondary: "#F9A8D4",
      accent: "#C084FC",
      background: "#FFF7FB",
      surface: "#FFFFFF",
      border: "#F3D7E7",
    },
    suitableFor: ["医美 App", "皮肤管理", "预约咨询"],
    notSuitableFor: ["风控交易", "运维大屏"],
    coverVariant: "medical-health",
    previewScenario: "medical-health",
    atmosphere: "粉白留白、精致咨询卡、温柔可信",
  },
  {
    slug: "beauty-cream-soft",
    name: "生美奶油柔和",
    category: "生美美容 / 会员经营",
    mood: "高级轻奢",
    colorPreference: "橙色系",
    scenario: "美容院会员、项目预约、护理记录、私域运营。",
    base: {
      primary: "#C08457",
      secondary: "#F0B88D",
      accent: "#E879F9",
      background: "#FFF8F1",
      surface: "#FFFFFF",
      border: "#EEDCCC",
    },
    suitableFor: ["美容会员", "护理预约", "门店私域"],
    notSuitableFor: ["高密度表格", "安全监控"],
    coverVariant: "local-service",
    previewScenario: "local-service",
    atmosphere: "奶油暖调、柔和阴影、轻奢服务感",
  },
  {
    slug: "fitness-energy",
    name: "健身活力能量",
    category: "健身运动 / 训练 App",
    mood: "活力年轻",
    colorPreference: "绿色系",
    scenario: "健身课程、私教预约、训练计划、运动打卡。",
    base: {
      primary: "#16A34A",
      secondary: "#84CC16",
      accent: "#F97316",
      background: "#F3FAF4",
      surface: "#FFFFFF",
      border: "#D5EED9",
    },
    suitableFor: ["健身 App", "课程预约", "训练打卡"],
    notSuitableFor: ["奢侈品展示", "政务系统"],
    coverVariant: "mobile-workbench",
    previewScenario: "mobile-workbench",
    atmosphere: "绿色能量、强行动按钮、进度反馈",
  },
  {
    slug: "clean-medical-teal",
    name: "医疗洁净蓝绿",
    category: "医疗健康 / 检测报告",
    mood: "医疗健康",
    colorPreference: "青色系",
    scenario: "医疗服务、健康档案、检测报告、患者随访。",
    base: {
      primary: "#0891B2",
      secondary: "#14B8A6",
      accent: "#60A5FA",
      background: "#F1FBFB",
      surface: "#FFFFFF",
      border: "#CDECEF",
    },
    suitableFor: ["健康报告", "患者服务", "随访管理"],
    notSuitableFor: ["潮玩社区", "暗黑游戏"],
    coverVariant: "healthcare-report",
    previewScenario: "medical-health",
    atmosphere: "蓝绿洁净、低压留白、专业健康数据",
  },
  {
    slug: "finance-blue-gold",
    name: "金融深蓝金",
    category: "金融科技 / 资产交易",
    mood: "商务稳重",
    colorPreference: "黑金系",
    scenario: "资产账户、风控提醒、交易列表、理财看板。",
    base: {
      primary: "#0F2A4A",
      secondary: "#1D4ED8",
      accent: "#D4AF37",
      background: "#F4F7FB",
      surface: "#FFFFFF",
      border: "#D8E1EF",
    },
    suitableFor: ["金融 App", "资产看板", "风控系统"],
    notSuitableFor: ["儿童内容", "轻社交"],
    coverVariant: "finance-trust",
    previewScenario: "finance-dashboard",
    atmosphere: "深蓝可信、金色强调、稳重数据感",
  },
  {
    slug: "guochao-red-gold",
    name: "国潮红金文化",
    category: "国潮文化 / 文旅零售",
    mood: "国潮文化",
    colorPreference: "红粉系",
    scenario: "国潮品牌、文旅服务、新中式零售、节庆活动。",
    base: {
      primary: "#B91C1C",
      secondary: "#7F1D1D",
      accent: "#D6A84F",
      background: "#FFF7ED",
      surface: "#FFFDF7",
      border: "#EDD6BF",
    },
    suitableFor: ["国潮零售", "文旅活动", "新中式 App"],
    notSuitableFor: ["极简工具", "医疗问诊"],
    coverVariant: "local-service",
    previewScenario: "local-service",
    atmosphere: "红金强调、暗纹点缀、东方秩序感",
  },
  {
    slug: "new-chinese-tea",
    name: "新中式茶饮雅致",
    category: "新中式 / 茶饮生活",
    mood: "国潮文化",
    colorPreference: "绿色系",
    scenario: "茶饮会员、生活方式、文创零售、门店预约。",
    base: {
      primary: "#3F7D4A",
      secondary: "#B9975B",
      accent: "#A16207",
      background: "#F7F4EC",
      surface: "#FFFDF7",
      border: "#DED4BE",
    },
    suitableFor: ["茶饮会员", "生活方式", "文创零售"],
    notSuitableFor: ["高频交易", "深色监控"],
    coverVariant: "local-service",
    previewScenario: "local-service",
    atmosphere: "宣纸底色、茶绿金棕、雅致留白",
  },
  {
    slug: "morandi-healing",
    name: "莫兰迪治愈",
    category: "生活方式 / 情绪健康",
    mood: "梦幻渐变",
    colorPreference: "黑白灰",
    scenario: "情绪记录、生活方式、轻健康、内容阅读。",
    base: {
      primary: "#8BA6A9",
      secondary: "#B8A99A",
      accent: "#D8A7B1",
      background: "#F6F4F1",
      surface: "#FFFFFF",
      border: "#E4DDD4",
    },
    suitableFor: ["情绪健康", "生活方式", "阅读内容"],
    notSuitableFor: ["强转化电商", "暗色安全"],
    coverVariant: "mobile-workbench",
    previewScenario: "mobile-workbench",
    atmosphere: "低饱和、柔留白、慢节奏阅读",
  },
  {
    slug: "dopamine-young",
    name: "多巴胺活力年轻",
    category: "年轻消费 / 活动增长",
    mood: "活力年轻",
    colorPreference: "渐变多彩",
    scenario: "活动报名、年轻消费、潮玩社群、会员增长。",
    base: {
      primary: "#EC4899",
      secondary: "#8B5CF6",
      accent: "#22D3EE",
      background: "#FFF7FC",
      surface: "#FFFFFF",
      border: "#F2D7F4",
    },
    suitableFor: ["活动增长", "潮玩社群", "年轻消费"],
    notSuitableFor: ["政企后台", "金融理财"],
    coverVariant: "gradient-aurora",
    previewScenario: "mobile-workbench",
    atmosphere: "多彩局部强调、圆润卡片、轻快动效",
  },
  {
    slug: "aurora-ai-gradient",
    name: "极光渐变 AI",
    category: "AI 工具 / 智能工作台",
    mood: "科技AI",
    colorPreference: "渐变多彩",
    scenario: "AI 助手、生成工具、智能分析、知识工作台。",
    base: {
      primary: "#6366F1",
      secondary: "#A855F7",
      accent: "#06B6D4",
      background: "#F7F4FF",
      surface: "#FFFFFF",
      border: "#E4D7FF",
    },
    suitableFor: ["AI 工具", "知识工作台", "智能分析"],
    notSuitableFor: ["医疗问诊", "合规审批"],
    coverVariant: "glow-ai-workspace",
    previewScenario: "ai-assistant",
    atmosphere: "极光渐变、智能摘要、微光层级",
  },
  {
    slug: "web3-dark-wallet",
    name: "Web3 暗色钱包",
    category: "Web3 / 资产控制台",
    mood: "暗色酷炫",
    colorPreference: "黑金系",
    scenario: "钱包资产、链上数据、交易记录、风险提示。",
    base: {
      primary: "#22D3EE",
      secondary: "#8B5CF6",
      accent: "#FBBF24",
      background: "#070B12",
      surface: "#101827",
      border: "#253045",
    },
    suitableFor: ["钱包资产", "交易控制台", "链上数据"],
    notSuitableFor: ["亲子母婴", "医疗服务"],
    coverVariant: "web3-console",
    previewScenario: "dark-dashboard",
    atmosphere: "暗色资产、冷光边界、交易数据感",
  },
  {
    slug: "bi-cyan-data",
    name: "BI 青蓝数据",
    category: "数据分析 / BI 看板",
    mood: "科技AI",
    colorPreference: "青色系",
    scenario: "BI 看板、运营分析、数据驾驶舱、指标监控。",
    base: {
      primary: "#0284C7",
      secondary: "#06B6D4",
      accent: "#22C55E",
      background: "#F2FAFC",
      surface: "#FFFFFF",
      border: "#CBEAF3",
    },
    suitableFor: ["BI 看板", "运营分析", "数据 App"],
    notSuitableFor: ["国潮活动", "医美咨询"],
    coverVariant: "saas-dashboard",
    previewScenario: "enterprise-workbench",
    atmosphere: "青蓝数据、清爽图表、指标优先",
  },
  {
    slug: "crm-growth-orange",
    name: "CRM 增长橙",
    category: "CRM / 销售增长",
    mood: "活力年轻",
    colorPreference: "橙色系",
    scenario: "销售线索、客户跟进、商机漏斗、增长运营。",
    base: {
      primary: "#EA580C",
      secondary: "#F97316",
      accent: "#2563EB",
      background: "#FFF7ED",
      surface: "#FFFFFF",
      border: "#FED7AA",
    },
    suitableFor: ["销售 CRM", "线索跟进", "增长运营"],
    notSuitableFor: ["医疗报告", "极简阅读"],
    coverVariant: "ecommerce-growth",
    previewScenario: "ecommerce-operation",
    atmosphere: "橙色行动、增长指标、商机推进",
  },
  {
    slug: "education-blue-purple",
    name: "教育学习蓝紫",
    category: "教育学习 / 成长平台",
    mood: "科技AI",
    colorPreference: "紫色系",
    scenario: "在线学习、课程推荐、学习计划、知识问答。",
    base: {
      primary: "#7C3AED",
      secondary: "#2563EB",
      accent: "#F59E0B",
      background: "#F7F4FF",
      surface: "#FFFFFF",
      border: "#E6DAFF",
    },
    suitableFor: ["学习 App", "课程推荐", "知识问答"],
    notSuitableFor: ["金融交易", "政企审批"],
    coverVariant: "ai-copilot",
    previewScenario: "ai-assistant",
    atmosphere: "蓝紫学习、知识卡片、温和智能感",
  },
  {
    slug: "travel-seasalt",
    name: "旅行酒店海盐蓝",
    category: "旅行酒店 / 预订服务",
    mood: "本地生活",
    colorPreference: "蓝色系",
    scenario: "酒店预订、行程管理、目的地推荐、会员权益。",
    base: {
      primary: "#0EA5E9",
      secondary: "#38BDF8",
      accent: "#F59E0B",
      background: "#F1F8FC",
      surface: "#FFFFFF",
      border: "#CFE7F3",
    },
    suitableFor: ["酒店预订", "行程 App", "会员权益"],
    notSuitableFor: ["安全监控", "高密度 ERP"],
    coverVariant: "local-service",
    previewScenario: "local-service",
    atmosphere: "海盐蓝、服务卡片、轻旅行感",
  },
  {
    slug: "mother-baby-warm",
    name: "母婴亲子暖粉",
    category: "母婴亲子 / 会员服务",
    mood: "活力年轻",
    colorPreference: "红粉系",
    scenario: "亲子会员、成长记录、课程预约、内容社区。",
    base: {
      primary: "#F472B6",
      secondary: "#FDBA74",
      accent: "#60A5FA",
      background: "#FFF7F4",
      surface: "#FFFFFF",
      border: "#F8D7CF",
    },
    suitableFor: ["母婴 App", "亲子课程", "成长记录"],
    notSuitableFor: ["金融系统", "B 端风控"],
    coverVariant: "mobile-workbench",
    previewScenario: "mobile-workbench",
    atmosphere: "暖粉亲和、圆润图标、柔软内容卡",
  },
  {
    slug: "coffee-brown",
    name: "咖啡餐饮暖棕",
    category: "餐饮咖啡 / 门店会员",
    mood: "本地生活",
    colorPreference: "橙色系",
    scenario: "咖啡会员、点单预约、门店活动、积分权益。",
    base: {
      primary: "#92400E",
      secondary: "#B45309",
      accent: "#F59E0B",
      background: "#FFF8ED",
      surface: "#FFFFFF",
      border: "#EBD7BD",
    },
    suitableFor: ["餐饮点单", "咖啡会员", "门店活动"],
    notSuitableFor: ["医疗服务", "暗黑 AI"],
    coverVariant: "local-service",
    previewScenario: "local-service",
    atmosphere: "暖棕纸感、门店服务、会员权益",
  },
  {
    slug: "silver-health",
    name: "银发健康低饱和",
    category: "银发健康 / 关怀服务",
    mood: "医疗健康",
    colorPreference: "绿色系",
    scenario: "慢病管理、家庭关怀、健康提醒、社区服务。",
    base: {
      primary: "#4D7C59",
      secondary: "#94A3B8",
      accent: "#0EA5E9",
      background: "#F5F8F4",
      surface: "#FFFFFF",
      border: "#DCE7DA",
    },
    suitableFor: ["慢病管理", "家庭关怀", "社区健康"],
    notSuitableFor: ["潮玩活动", "Web3 交易"],
    coverVariant: "medical-health",
    previewScenario: "medical-health",
    atmosphere: "低饱和、字号清晰、关怀友好",
  },
  {
    slug: "gov-trust-blue",
    name: "政企可信深蓝",
    category: "政企服务 / 合规流程",
    mood: "商务稳重",
    colorPreference: "蓝色系",
    scenario: "政企门户、审批流程、数据上报、合规管理。",
    base: {
      primary: "#1E3A8A",
      secondary: "#334155",
      accent: "#0EA5E9",
      background: "#F6F8FC",
      surface: "#FFFFFF",
      border: "#D7E0EE",
    },
    suitableFor: ["政企服务", "合规审批", "数据上报"],
    notSuitableFor: ["年轻社区", "医美活动"],
    coverVariant: "enterprise-table",
    previewScenario: "saas-admin-list",
    atmosphere: "深蓝可信、规整线条、审批秩序",
  },
];

const variants = [
  {
    slug: "thin-type-soft-shadow",
    label: "轻量细字柔影",
    suffix: "轻量柔影版",
    typography: "全局细字重轻量版；标题 650，正文 450，行间距宽松。",
    shadow: "高模糊柔光软阴影，统一左上光源，阴影带轻微主色染色。",
    iconLanguage: "单细线线性图标，比例纤细，适合轻量 App。",
    layoutRhythm: "超大留白呼吸感，左对齐错落但信息节奏清楚。",
    colorLogic: "大面积浅底，小面积主色点缀，primary 仅用于 CTA 和激活态。",
    motion: "慢阻尼柔和回弹动效，卡片轻微上浮。",
    border: "浅灰 1px 细描边，弱分割线。",
    atmosphere: "柔和光斑和轻水印，避免强装饰。",
    density: "comfortable",
    radius: { sm: "8px", md: "14px", lg: "22px", xl: "28px" },
    shadowMode: "soft",
    displayLevel: "normal",
  },
  {
    slug: "bold-title-compact",
    label: "强标题高效版",
    suffix: "强标题高效版",
    typography: "粗细对比强烈；标题 820，正文 520，数字 860。",
    shadow: "边界清晰硬质薄阴影，层级明确但不厚重。",
    iconLanguage: "粗线轮廓图标，入口可识别性强。",
    layoutRhythm: "适中留白，高效网格，适合业务列表和指标页。",
    colorLogic: "黑白灰为主，主色用于按钮、状态和关键数字。",
    motion: "干脆利落短动效，点击颜色反馈。",
    border: "全组件统一细描边，表格分割更清晰。",
    atmosphere: "几何分割线条，强调秩序和效率。",
    density: "compact",
    radius: { sm: "6px", md: "10px", lg: "16px", xl: "20px" },
    shadowMode: "hard",
    displayLevel: "normal",
  },
  {
    slug: "wide-letter-premium",
    label: "宽字距高级版",
    suffix: "宽字距高级版",
    typography: "标题加宽字距，正文正常；中高字重，强调高级陈列感。",
    shadow: "多层渐变立体纵深，浮层卡片更像高端样张。",
    iconLanguage: "双线描边轻奢图标，尺寸偏小且克制。",
    layoutRhythm: "居中对称规整版式，模块通过留白自然分割。",
    colorLogic: "低饱和邻近色，强调色仅用于重点按钮和数字。",
    motion: "仅淡入淡出无明显位移，稳重克制。",
    border: "局部渐变或金属感描边，不能大面积使用。",
    atmosphere: "细碎星光或微光点缀，保持留白。",
    density: "relaxed",
    radius: { sm: "10px", md: "16px", lg: "24px", xl: "32px" },
    shadowMode: "layered",
    displayLevel: "normal",
  },
  {
    slug: "rounded-friendly",
    label: "圆润亲和版",
    suffix: "圆润亲和版",
    typography: "全中等字重平衡版；标题圆润，正文行距舒适。",
    shadow: "四面均匀漫射无影调，浅卡片和软背景分层。",
    iconLanguage: "实心填充图标，入口更饱满醒目。",
    layoutRhythm: "均匀等距网格排布，按钮和标签更亲和。",
    colorLogic: "统一同色系邻近色，使用 soft 背景承载入口。",
    motion: "轻微放大膨胀反馈，适合移动端触控。",
    border: "细虚线或浅色边框柔和分割。",
    atmosphere: "植物线条或圆点装饰，避免低幼。",
    density: "comfortable",
    radius: { sm: "12px", md: "18px", lg: "26px", xl: "34px" },
    shadowMode: "diffuse",
    displayLevel: "normal",
  },
  {
    slug: "dense-mono-system",
    label: "等宽信息密集版",
    suffix: "等宽信息密集版",
    typography: "极简等宽科技字体气质；紧凑密字距，适合数据和状态页。",
    shadow: "完全无阴影扁平风，靠线条和背景色分区。",
    iconLanguage: "规整几何笔直线条，图标比例迷你。",
    layoutRhythm: "紧凑小行距高效信息页，细分割线划分模块。",
    colorLogic: "低饱和底色全覆盖，强调色用于文字和边框线条。",
    motion: "无回弹短动效，滚动渐显内容。",
    border: "超细 0.5pt 纤细线条，实线规整。",
    atmosphere: "极简线条 logo 水印和边角小标签。",
    density: "dense",
    radius: { sm: "4px", md: "8px", lg: "12px", xl: "16px" },
    shadowMode: "flat",
    displayLevel: "normal",
  },
];

const styles = [];
let index = 1;
for (const family of families) {
  const parentStyleId = `style-v5-${String(index).padStart(3, "0")}-${family.slug}-${variants[0].slug}`;
  for (const [variantIndex, variant] of variants.entries()) {
    styles.push(createStyle(index++, family, variant, variantIndex, parentStyleId));
  }
}

const doc = {
  version: "5.0.0",
  generated_at: generatedAt,
  description:
    "V5 style expansion: 125 app-first enterprise visual styles generated across typography, shadow, icon language, layout rhythm, color logic, motion, borders, and atmosphere. Each family exposes one gallery representative and keeps four sub-variants for detail-page switching. All palettes include WCAG-aware text/background token fallbacks.",
  styles,
};

fs.writeFileSync(outputPath, `${JSON.stringify(doc, null, 2)}\n`);
console.log(`Generated ${styles.length} styles at ${path.relative(root, outputPath)}`);

function createStyle(number, family, variant, variantIndex, parentStyleId) {
  const id = `style-v5-${String(number).padStart(3, "0")}-${family.slug}-${variant.slug}`;
  const palette = buildPalette(family.base);
  const isDark = getLuminance(parseHex(palette.background)) < 0.16;
  const radius = variant.radius;
  const shadow = buildShadow(palette.primary, variant.shadowMode, isDark);
  const isMainStyle = variantIndex === 0;
  const displayName = isMainStyle ? family.name : `${family.name} · ${variant.suffix}`;
  const visualKeywords = [
    variant.label,
    family.atmosphere,
    getColorUseLabel(family.colorPreference),
    getDensityLabel(variant.density),
  ];
  const prompt = `使用【${displayName}】生成一个移动优先的企业 App 页面，同时提供后台 Web 辅助预览。风格要体现：${visualKeywords.join("、")}。页面需要包含真实业务标题、数据卡片、快捷入口、列表、状态标签、主按钮、底部导航，并保证文字对比度达标。`;

  return {
    id,
    name: displayName,
    englishName: toTitleCase(`${family.slug} ${variant.slug}`),
    description: `${family.scenario}${variant.label}，强调${family.atmosphere}，适合先看移动端 App 效果再延展到 Web 后台。`,
    status: "approved",
    version: "1.0.0",
    owner: "Design System",
    created_at: generatedAt,
    updated_at: generatedAt,
    tags: [
      "v5-expanded",
      family.mood,
      family.colorPreference,
      family.category,
      variant.label,
      variant.density,
      "app-first",
      "wcag-aware",
    ],
    related_items: {
      templates: [],
      prompts: [`prompt-${id}`],
      tokens: [`token-${id}`],
      components: [],
    },
    group: "V5 主流流行风格扩展",
    category: family.category,
    priority: "P1",
    scenario: family.scenario,
    visual: `${family.atmosphere}；${variant.typography}；${variant.shadow}；${variant.iconLanguage}；${variant.layoutRhythm}`,
    v1: "移动端首页、个人中心、卡片列表、详情页；后台运营看板、表格列表、状态与空/错/加载页面。",
    tokens: `${isDark ? "dark" : "light"} / adaptive / ${variant.density} / v5-expanded`,
    positioning: family.scenario,
    suitableFor: family.suitableFor,
    notSuitableFor: family.notSuitableFor,
    visualKeywords,
    colorPreference: family.colorPreference,
    mood: [family.mood],
    moodTheme: family.mood,
    themeMode: isDark ? "dark / adaptive" : "light / adaptive",
    layoutDensity: variant.density,
    componentStyle: `${variant.iconLanguage}；${variant.border}；按钮、卡片、标签按语义 token 输出。`,
    gradientStyle: buildGradient(palette, isDark),
    glowStyle: isDark ? "暗色下使用低透明冷光，不影响文字可读性" : "仅在主卡和按钮周围使用轻微柔光",
    darkModeStrategy: "独立 dark token，与 light token 保持同一主色和风格基因，不做简单反色。",
    linearStyle: variant.border,
    web3Style: family.slug.includes("web3") ? "适合资产、交易和链上数据展示。" : "不使用 Web3 符号，保持行业可读性。",
    mobileAdaptation: "以 App 首页、快捷入口、业务列表、个人中心和底部导航为主要样张，封面优先表现移动端真实业务场景。",
    adminAdaptation: "后台端作为辅助预览，展示 KPI、趋势、表格和状态标签，保持与 App 同一 token。",
    dashboardAdaptation: "图表使用主色和辅助色，状态色独立，避免低对比图形。",
    styleDifferentiators: {
      typography: variant.typography,
      shadow: variant.shadow,
      iconLanguage: variant.iconLanguage,
      layoutRhythm: variant.layoutRhythm,
      colorLogic: variant.colorLogic,
      motion: variant.motion,
      border: variant.border,
      atmosphere: variant.atmosphere,
    },
    designTokens: {
      colors: {
        background: palette.background,
        surface: palette.surface,
        surfaceElevated: palette.surfaceElevated,
        primary: palette.primary,
        primaryHover: palette.primaryHover,
        primaryActive: palette.primaryActive,
        primarySoft: palette.primarySoft,
        secondary: palette.secondary,
        secondarySoft: palette.secondarySoft,
        accent: palette.accent,
        accentSoft: palette.accentSoft,
        textPrimary: palette.textPrimary,
        textSecondary: palette.textSecondary,
        textInverse: palette.textInverse,
        border: palette.border,
        divider: palette.divider,
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
        info: "#0EA5E9",
      },
      gradients: {
        hero: buildGradient(palette, isDark),
        card: isDark
          ? `linear-gradient(145deg, ${palette.surfaceElevated}, ${palette.surface})`
          : `linear-gradient(145deg, ${palette.surface}, ${palette.primarySoft})`,
        button: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
        border: `linear-gradient(135deg, ${withAlpha(palette.primary, 0.5)}, ${withAlpha(palette.accent, 0.35)})`,
        glow: `radial-gradient(circle at 30% 20%, ${withAlpha(palette.accent, isDark ? 0.28 : 0.18)}, transparent 42%)`,
      },
      radius,
      shadow,
      typography: {
        titleWeight: variant.slug.includes("bold") ? "820" : variant.slug.includes("thin") ? "660" : "760",
        bodyWeight: variant.slug.includes("thin") ? "450" : "520",
        numberWeight: "820",
        letterSpacing: variant.slug.includes("wide") ? "0.04em" : "0",
        lineHeight: variant.slug.includes("dense") ? "1.45" : "1.68",
      },
      effects: {
        blur: variant.slug.includes("wide") || family.slug.includes("glass") ? "18px" : "0px",
        glow: variant.atmosphere,
        glassOpacity: family.slug.includes("glass") || variant.slug.includes("wide") ? 0.72 : 1,
        borderOpacity: variant.slug.includes("dense") ? 0.72 : 0.42,
      },
    },
    palette: {
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: palette.background,
      surface: palette.surface,
      textPrimary: palette.textPrimary,
      textSecondary: palette.textSecondary,
      border: palette.border,
    },
    cssVariables: {
      "--color-primary": palette.primary,
      "--color-secondary": palette.secondary,
      "--color-accent": palette.accent,
      "--color-bg": palette.background,
      "--color-surface": palette.surface,
      "--color-text": palette.textPrimary,
      "--color-muted": palette.textSecondary,
      "--color-border": palette.border,
      "--radius-card": radius.lg,
      "--radius-button": radius.md,
      "--shadow-card": shadow.card,
      "--gradient-main": `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
      "--effect-blur": variant.slug.includes("wide") ? "18px" : "0px",
      "--pattern-type": `v5-${family.slug}-${variant.slug}`,
    },
    coverVariant: family.coverVariant,
    previewScenario: family.previewScenario,
    preview_scenario: family.previewScenario,
    aiTags: ["v5-expanded", family.mood, family.colorPreference, variant.label, "app-first"],
    aiPrompt: prompt,
    previewPrompt: prompt,
    differenceFromExisting: {
      notJustColor: true,
      uniquePoints: [
        `字体系统：${variant.typography}`,
        `光影体系：${variant.shadow}`,
        `版式节奏：${variant.layoutRhythm}`,
        `色彩逻辑：${variant.colorLogic}`,
      ],
      avoidSimilarityWith: ["style-001-modern-saas-clean", "style-030-mobile-first-enterprise"],
    },
    v1Templates: [
      "app home",
      "app list",
      "app detail",
      "mobile workbench",
      "admin dashboard",
      "admin list",
    ],
    figma_file_url: "https://figma.example.com/file/ui-template-library-v5-expanded-styles",
    figma_component_url: `https://figma.example.com/file/ui-template-library-v5-expanded-styles?node=${id}&kind=style-component`,
    figma_page_url: `https://figma.example.com/file/ui-template-library-v5-expanded-styles?node=${id}&kind=style-page`,
    figma_last_updated: generatedAt,
    figma_owner: "Design System",
    visualSignature: visualKeywords,
    parentStyleId,
    variantName: isMainStyle ? "代表版" : variant.suffix,
    styleFamily: family.name,
    visualMechanism: `${family.atmosphere}，并通过 ${variant.label} 拉开气质差异。`,
    layoutMechanism: variant.layoutRhythm,
    componentMechanism: `${variant.iconLanguage}；${variant.border}`,
    motionMechanism: variant.motion,
    differentiationScore: getDifferentiationScore(family, variant),
    duplicateGroupId: `grp-v5-${family.slug}`,
    displayLevel: isMainStyle ? "normal" : "hidden",
    displayReason: isMainStyle
      ? "V5 风格族代表卡，显示在风格广场；同族变体进入详情页切换。"
      : "同族细分变体，已收纳到主风格详情页，避免风格广场重复平铺。",
    isMainStyle,
  };
}

function buildPalette(base) {
  const primary = ensureAccessibleButtonColor(base.primary);
  const bgLum = getLuminance(parseHex(base.background));
  const isDark = bgLum < 0.16;
  const textPrimary = isDark ? "#F8FAFC" : "#0F172A";
  const textSecondary = isDark ? "#CBD5E1" : "#475569";
  return {
    ...base,
    primary,
    surfaceElevated: isDark ? lighten(base.surface, 0.08) : "#FFFFFF",
    primaryHover: adjustLightness(primary, isDark ? 0.08 : -0.08),
    primaryActive: adjustLightness(primary, isDark ? -0.04 : -0.14),
    primarySoft: mix(base.primary, base.background, isDark ? 0.78 : 0.88),
    secondarySoft: mix(base.secondary, base.background, isDark ? 0.82 : 0.9),
    accentSoft: mix(base.accent, base.background, isDark ? 0.82 : 0.9),
    textPrimary,
    textSecondary,
    textInverse: getReadableTextOn(primary),
    divider: base.border,
  };
}

function getReadableTextOn(hex) {
  return contrastRatio(hex, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#0F172A";
}

function ensureAccessibleButtonColor(hex) {
  if (Math.max(contrastRatio(hex, "#FFFFFF"), contrastRatio(hex, "#0F172A")) >= 4.5) {
    return hex;
  }
  let candidate = hex;
  for (let step = 0; step < 10; step += 1) {
    candidate = adjustLightness(candidate, -0.06);
    if (contrastRatio(candidate, "#FFFFFF") >= 4.5) {
      return candidate;
    }
  }
  return candidate;
}

function buildShadow(primary, mode, isDark) {
  if (mode === "flat") {
    return {
      card: "none",
      floating: "none",
      glow: `0 0 0 1px ${withAlpha(primary, isDark ? 0.24 : 0.16)}`,
    };
  }
  if (mode === "hard") {
    return {
      card: `0 6px 0 ${withAlpha(primary, isDark ? 0.24 : 0.1)}`,
      floating: `0 12px 0 ${withAlpha(primary, isDark ? 0.22 : 0.1)}`,
      glow: "none",
    };
  }
  if (mode === "layered") {
    return {
      card: `0 22px 70px ${withAlpha(primary, isDark ? 0.2 : 0.14)}, 0 1px 0 rgba(255,255,255,0.55) inset`,
      floating: `0 32px 100px ${withAlpha(primary, isDark ? 0.28 : 0.18)}`,
      glow: `0 0 42px ${withAlpha(primary, 0.22)}`,
    };
  }
  if (mode === "diffuse") {
    return {
      card: `0 18px 46px ${withAlpha(primary, isDark ? 0.16 : 0.09)}`,
      floating: `0 28px 72px ${withAlpha(primary, isDark ? 0.2 : 0.12)}`,
      glow: `0 0 28px ${withAlpha(primary, 0.16)}`,
    };
  }
  return {
    card: `0 16px 42px ${withAlpha(primary, isDark ? 0.18 : 0.12)}`,
    floating: `0 26px 72px ${withAlpha(primary, isDark ? 0.22 : 0.16)}`,
    glow: `0 0 32px ${withAlpha(primary, 0.18)}`,
  };
}

function buildGradient(palette, isDark) {
  if (isDark) {
    return `linear-gradient(135deg, ${palette.background} 0%, ${palette.surface} 46%, ${withAlpha(palette.primary, 0.38)} 100%)`;
  }
  return `linear-gradient(135deg, ${palette.background} 0%, ${palette.surface} 46%, ${palette.primarySoft} 100%)`;
}

function getDifferentiationScore(family, variant) {
  const base = 82;
  const familyBoost = ["web3", "guochao", "aesthetic", "fitness", "new-chinese"].some((key) =>
    family.slug.includes(key),
  )
    ? 8
    : 4;
  const variantBoost = variant.slug.includes("wide") || variant.slug.includes("dense") ? 6 : 3;
  return Math.min(96, base + familyBoost + variantBoost);
}

function getColorUseLabel(colorPreference) {
  return `${colorPreference}主导`;
}

function getDensityLabel(density) {
  if (density === "dense") return "高密信息";
  if (density === "compact") return "紧凑高效";
  if (density === "relaxed") return "宽松高级";
  return "舒适留白";
}

function parseHex(hex) {
  const value = hex.replace("#", "").trim();
  const full = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function mix(from, to, amount) {
  const a = parseHex(from);
  const b = parseHex(to);
  return toHex({
    r: a.r * (1 - amount) + b.r * amount,
    g: a.g * (1 - amount) + b.g * amount,
    b: a.b * (1 - amount) + b.b * amount,
  });
}

function lighten(hex, amount) {
  return mix("#FFFFFF", hex, 1 - amount);
}

function adjustLightness(hex, amount) {
  return amount >= 0 ? mix("#FFFFFF", hex, 1 - amount) : mix("#000000", hex, 1 + amount);
}

function withAlpha(hex, alpha) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getLuminance({ r, g, b }) {
  const values = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function contrastRatio(a, b) {
  const [l1, l2] = [getLuminance(parseHex(a)), getLuminance(parseHex(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

function toTitleCase(value) {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
