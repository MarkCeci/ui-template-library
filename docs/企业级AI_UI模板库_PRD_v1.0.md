# 企业级 AI UI 模板库 PRD v1.0
生成日期：2026-06-04

本 PRD 用于直接启动开发：定义多风格模板库的产品定位、功能范围、页面结构、数据模型、接口建议、设计师维护流程、开发接入流程、AI 调用规则、验收标准，并内置 30 个企业常用/流行风格包作为 V1 内容建设清单。

## 1. 项目概述
公司需要建立一个可被非设计人员直观选择、可被设计师持续维护、可被开发人员直接引用、可被 AI 工作流检索和调用的 UI 模板库。该产品不是单纯的截图素材库，而是“风格包 + 模板库 + 组件文档 + 设计 token + 代码映射 + AI 元数据”的内部生产系统。
V1 的关键目标是让业务、产品、设计和开发在一个统一页面里完成：选择风格、选择场景模板、查看组件交互状态、复制 AI Prompt、打开 Figma、打开 Storybook/代码、发起使用或更新流程。
本项目以成熟设计系统的组织方式为参考：foundations、components、patterns、templates、examples，并通过 Design Tokens、Figma Variables/Modes、Storybook、Figma Code Connect 等机制打通设计与开发。
> 一句话定义：这是一个内部“UI 风格与页面模板货架”：不会设计和写代码的人可以像逛模板市场一样选；设计师可以维护源文件和风格；开发人员可以直接使用代码组件；AI 可以读取结构化数据并推荐/生成页面。
## 2. 建设目标与成功标准
## 3. 用户角色与核心诉求
## 4. V1 范围定义
## V1 30 个风格包
### style-001-modern-saas-clean｜现代 SaaS 极简风｜P0
- 类别：通用后台 / SaaS
- 适用场景：B2B SaaS、客户后台、运营平台、内部管理系统。
- 视觉识别：大留白、浅灰背景、卡片化、低饱和品牌色、弱边框、清晰层级。
- V1 必做：后台 Dashboard、数据列表、详情抽屉；App 首页/列表；组件状态板。
- Token modes：light / dark / brand-basic
- AI 标签：saas, minimal, admin, card, clean

### style-002-enterprise-classic-table｜企业经典表格风｜P0
- 类别：通用后台
- 适用场景：ERP、CRM、订单、权限、审核、主数据管理。
- 视觉识别：信息密度高、表格优先、蓝灰色系、清晰分割线、强操作区。
- V1 必做：筛选列表、批量操作、表单页、详情页、权限配置。
- Token modes：light / compact / dark
- AI 标签：enterprise, table, crud, antd-like, dense

### style-003-fluent-office-collab｜Fluent 办公协同风｜P0
- 类别：办公协作
- 适用场景：OA、知识库、团队协作、任务、文档、项目空间。
- 视觉识别：柔和圆角、轻阴影、微软办公感、上下文工具栏、渐进披露。
- V1 必做：工作台、任务列表、文档详情、消息中心、个人中心。
- Token modes：light / dark / copilot-accent
- AI 标签：office, collaboration, fluent, copilot, productivity

### style-004-carbon-data-enterprise｜Carbon 数据密集风｜P0
- 类别：企业软件 / 数据产品
- 适用场景：云平台、企业数据管理、监控、复杂配置、AI 数据产品。
- 视觉识别：黑白灰基础、网格严谨、信息层级硬朗、数据卡片和表单规范。
- V1 必做：资源列表、配置详情、监控页、数据集管理、模型管理。
- Token modes：light / dark / high-contrast
- AI 标签：carbon, data, ibm, cloud, dense

### style-005-crm-salesforce-lightning｜CRM 商务销售风｜P0
- 类别：CRM / 销售管理
- 适用场景：客户管理、线索、商机、销售漏斗、客户服务。
- 视觉识别：业务对象卡片、记录详情页、路径进度、右侧活动流、可配置布局。
- V1 必做：客户列表、客户详情、商机看板、活动时间线、表单创建。
- Token modes：light / brand-blue / compact
- AI 标签：crm, sales, record, timeline, pipeline

### style-006-atlassian-teamwork｜团队协作效率风｜P0
- 类别：协作 / 项目管理
- 适用场景：项目管理、Issue、研发协作、需求池、任务看板。
- 视觉识别：清晰导航、标签状态、多列看板、快捷操作、强调可读性。
- V1 必做：项目首页、看板、Issue 详情、筛选列表、团队空间。
- Token modes：light / dark / agile
- AI 标签：kanban, project, team, issue, collaboration

### style-007-sap-process-enterprise｜流程型企业管理风｜P0
- 类别：ERP / 流程系统
- 适用场景：采购、财务、人事、审批、供应链、企业流程。
- 视觉识别：角色导向、流程清晰、页签与对象页、状态流转、可适配多终端。
- V1 必做：流程入口、对象详情、审批页、工作清单、移动审批。
- Token modes：light / compact / role-based
- AI 标签：process, sap-like, erp, workflow, adaptive

### style-008-polars-merchant-ops｜商家运营管理风｜P0
- 类别：电商 / 商家后台
- 适用场景：商品、订单、库存、营销、店铺设置、商家插件。
- 视觉识别：运营卡片、易懂表单、商品图+数据、操作引导、商家友好。
- V1 必做：商品列表、订单详情、营销活动、店铺设置、数据概览。
- Token modes：light / commerce / mobile-admin
- AI 标签：commerce, merchant, orders, inventory, polaris-like

### style-009-material-cross-platform｜Material 3 跨端自适应风｜P0
- 类别：跨端应用
- 适用场景：Android、Web、移动 H5、跨端业务应用。
- 视觉识别：动态色、清晰 color roles、中等圆角、组件一致、适配移动。
- V1 必做：App 首页、列表、详情、表单、后台轻量页。
- Token modes：light / dark / dynamic-brand
- AI 标签：material3, mobile, adaptive, cross-platform, tokens

### style-010-apple-premium-mobile｜Apple 高质感移动风｜P1
- 类别：移动 App
- 适用场景：高端移动端、企业员工 App、管理者移动工作台。
- 视觉识别：细腻层级、系统字体感、大标题、透明/模糊层、自然动效。
- V1 必做：移动首页、消息、审批、详情、设置。
- Token modes：ios-light / ios-dark
- AI 标签：ios, mobile, premium, native, motion

### style-011-fintech-trust｜金融科技可信风｜P0
- 类别：金融 / 支付 / 账户
- 适用场景：钱包、支付、账户、资金管理、对账、财务系统。
- 视觉识别：深蓝/绿色状态、数字强调、风险提示明确、留白克制、安全感强。
- V1 必做：账户概览、交易列表、转账确认、风控提示、对账表。
- Token modes：light / dark / risk
- AI 标签：fintech, trust, account, payment, risk

### style-012-risk-compliance｜风控合规审计风｜P1
- 类别：合规 / 审计 / 风险
- 适用场景：审计后台、合规检查、风控规则、异常复核。
- 视觉识别：状态分级、证据链、操作留痕、低调严肃、重点高亮异常。
- V1 必做：风险列表、案件详情、规则配置、审核流、日志页。
- Token modes：light / dark / severity
- AI 标签：compliance, audit, risk, review, log

### style-013-healthcare-clean｜医疗健康清洁风｜P1
- 类别：医疗 / 健康 / 预约
- 适用场景：患者管理、预约、报告、健康档案、医生工作台。
- 视觉识别：白底、蓝绿低饱和、温和圆角、清晰警示、信息可信。
- V1 必做：患者列表、报告详情、预约页、健康档案、移动咨询。
- Token modes：light / clinical / accessible
- AI 标签：healthcare, patient, report, appointment, clean

### style-014-education-learning｜教育学习平台风｜P1
- 类别：教育 / 培训 / 知识
- 适用场景：课程、作业、考试、企业培训、学习进度。
- 视觉识别：卡片式课程、进度可视化、轻插画、温和色彩、弱游戏化。
- V1 必做：课程首页、课程详情、学习进度、作业列表、考试结果。
- Token modes：light / playful / accessible
- AI 标签：education, learning, progress, course, training

### style-015-government-stable｜政务公共服务稳重风｜P1
- 类别：政务 / 公共服务
- 适用场景：政务服务、公共机构门户、办事大厅、监管平台。
- 视觉识别：稳重蓝红、强层级、清晰入口、大字号、无障碍优先。
- V1 必做：办事首页、事项列表、申报表单、进度查询、消息通知。
- Token modes：light / high-contrast / public
- AI 标签：government, public, service, accessibility, formal

### style-016-industrial-iot｜工业 IoT 制造风｜P1
- 类别：制造 / 设备 / IoT
- 适用场景：设备监控、工厂看板、产线、能耗、维保。
- 视觉识别：深色/灰蓝底、设备卡片、实时状态、告警明显、图表密集。
- V1 必做：设备总览、设备详情、告警列表、维保工单、数据大屏。
- Token modes：dark / light / alarm
- AI 标签：iot, industrial, device, monitoring, alarm

### style-017-logistics-ops｜物流调度运营风｜P1
- 类别：物流 / 供应链
- 适用场景：运输调度、路线、仓储、运单、配送追踪。
- 视觉识别：地图/列表联动、状态时间轴、调度看板、运力颜色分级。
- V1 必做：运单列表、地图调度、车辆详情、路线追踪、异常处理。
- Token modes：light / map / operations
- AI 标签：logistics, map, dispatch, tracking, supply-chain

### style-018-marketing-growth｜营销增长运营风｜P1
- 类别：营销 / 增长 / 活动
- 适用场景：活动配置、会员运营、增长看板、投放、A/B 测试。
- 视觉识别：数据卡片+活动模块、色彩更活跃、转化漏斗、目标进度。
- V1 必做：增长看板、活动列表、活动配置、用户分群、效果详情。
- Token modes：light / campaign / vivid
- AI 标签：marketing, growth, campaign, abtest, funnel

### style-019-cms-media｜内容媒体管理风｜P1
- 类别：CMS / 媒体 / 素材
- 适用场景：文章、素材库、审核、视频/图片管理、发布平台。
- 视觉识别：瀑布/网格素材、预览优先、状态标签、编辑入口清晰。
- V1 必做：素材库、文章列表、编辑详情、审核流、发布日历。
- Token modes：light / media / editorial
- AI 标签：cms, media, asset, editorial, review

### style-020-hr-organization｜HR 组织管理风｜P1
- 类别：HR / 组织 / 人事
- 适用场景：员工、组织架构、考勤、绩效、招聘、入离职。
- 视觉识别：人物头像、组织树、流程清晰、表单友好、隐私提示明确。
- V1 必做：员工列表、员工详情、组织架构、招聘流程、绩效表单。
- Token modes：light / people / compact
- AI 标签：hr, people, organization, recruiting, performance

### style-021-ai-copilot-workspace｜AI Copilot 助手工作台风｜P0
- 类别：AI / 智能助手
- 适用场景：AI 助手、智能问答、知识库、办公自动化、辅助决策。
- 视觉识别：聊天/任务双栏、建议卡片、来源引用、渐进披露、低干扰。
- V1 必做：Copilot 首页、对话页、任务建议、结果卡片、引用/溯源面板。
- Token modes：light / dark / ai-accent
- AI 标签：ai, copilot, chat, agent, workspace

### style-022-agent-automation-canvas｜Agent 自动化编排风｜P1
- 类别：AI Agent / 自动化
- 适用场景：任务流、自动化流程、Agent 编排、RPA、工作流节点。
- 视觉识别：画布、节点、连线、侧边配置、运行状态、日志结果。
- V1 必做：流程画布、节点配置、运行日志、模板市场、执行结果页。
- Token modes：light / dark / canvas
- AI 标签：agent, automation, workflow, canvas, rpa

### style-023-lowcode-builder｜低代码搭建器风｜P1
- 类别：低代码 / 配置平台
- 适用场景：页面搭建、表单搭建、报表搭建、规则配置。
- 视觉识别：三栏编辑器、组件面板、画布、属性面板、预览/发布。
- V1 必做：搭建器首页、编辑器、组件面板、属性面板、发布确认。
- Token modes：light / builder / compact
- AI 标签：lowcode, builder, editor, canvas, configuration

### style-024-dark-dataviz-dashboard｜深色数据可视化大屏风｜P0
- 类别：数据可视化 / 大屏
- 适用场景：经营大屏、监控中心、指挥中心、BI 展示。
- 视觉识别：深色背景、高对比图表、发光重点、模块边框、实时动效。
- V1 必做：经营大屏、监控大屏、指标卡片、趋势图、地图模块。
- Token modes：dark / high-contrast / chart
- AI 标签：dashboard, dataviz, dark, command-center, realtime

### style-025-cybersecurity-soc｜安全运营 SOC 暗色风｜P1
- 类别：网络安全 / SOC
- 适用场景：安全态势、告警、事件调查、资产暴露、威胁情报。
- 视觉识别：暗底、红橙告警、拓扑/时间线、严重程度分级、证据视图。
- V1 必做：安全总览、告警列表、事件详情、调查时间线、资产图谱。
- Token modes：dark / severity / terminal
- AI 标签：security, soc, threat, alert, dark

### style-026-cloud-finops｜云资源 FinOps 管理风｜P1
- 类别：云平台 / 成本管理
- 适用场景：云资源、账单、成本优化、容量、权限、服务目录。
- 视觉识别：资源树、成本趋势、配额卡片、告警和建议、表格密集。
- V1 必做：资源概览、成本分析、账单列表、优化建议、资源详情。
- Token modes：light / dark / cloud
- AI 标签：cloud, finops, resource, billing, optimization

### style-027-developer-console-api｜开发者控制台 / API 平台风｜P1
- 类别：开发者平台
- 适用场景：API 管理、开发者门户、密钥、SDK、文档、日志。
- 视觉识别：代码块、文档侧栏、控制台卡片、密钥安全提示、终端感。
- V1 必做：API 文档、密钥管理、调用日志、SDK 页面、控制台首页。
- Token modes：light / dark / code
- AI 标签：developer, api, console, docs, sdk

### style-028-marketplace-plugin｜插件市场 / 应用市场风｜P2
- 类别：平台生态
- 适用场景：插件市场、模板市场、应用中心、集成市场。
- 视觉识别：卡片网格、评分/标签、安装引导、详情页、兼容性信息。
- V1 必做：市场首页、插件列表、插件详情、安装配置、我的应用。
- Token modes：light / marketplace / brand
- AI 标签：marketplace, plugin, app-store, integration, template

### style-029-white-label-multitenant｜多租户白标换肤风｜P0
- 类别：多品牌 / 多租户
- 适用场景：SaaS 多租户、渠道品牌、客户私有化、OEM。
- 视觉识别：结构稳定、品牌色可替换、Logo/导航/图标可配置、主题可切换。
- V1 必做：品牌配置、租户首页、主题预览、模板套用、权限隔离。
- Token modes：brand-a / brand-b / dark / compact
- AI 标签：white-label, tenant, theme, brand, configurable

### style-030-mobile-first-enterprise｜移动优先企业轻办公风｜P0
- 类别：企业移动端
- 适用场景：员工 App、移动审批、门店巡检、销售外勤、移动 CRM。
- 视觉识别：底部导航、大触控区、卡片流、状态醒目、离线/弱网友好。
- V1 必做：移动工作台、审批详情、任务列表、巡检表单、消息中心。
- Token modes：mobile-light / mobile-dark / compact
- AI 标签：mobile, enterprise, oa, fieldwork, app
