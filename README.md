# 企业级 AI UI 模板库

这是一个公司内部使用的 UI 风格与页面模板货架，用于帮助业务、产品、设计、开发和 AI 工具快速选择风格、查看页面结构，并继续推进设计和开发工作。

第一版使用本地 JSON 数据驱动，不接数据库、不做复杂登录、不调用真实 AI API。它的目标是先把“风格广场、模板库、组件入口、AI 推荐、简化维护后台”这些核心入口跑通。

## 项目包含什么

- 首页：给非专业人员看的入口页，说明如何按风格、业务场景、平台选择模板。
- 风格广场：展示 30 个 UI 风格包，支持搜索和筛选。
- 风格详情：展示单个风格的适用场景、视觉特征、标签和 AI Prompt。
- 模板库：展示模板卡片，支持按平台、类型、场景、状态等条件筛选。
- 模板详情：展示页面预览、结构、组件依赖、状态矩阵、设计入口、开发入口和 AI Prompt。
- 组件文档入口：列出 V1 基础组件，并说明 Figma、Storybook、代码之间的关系。
- 设计维护页：说明设计师如何维护 Figma 链接、Token、版本和设计验收清单。
- 开发者入口：说明前端同事如何从模板库进入真实开发。
- AI 推荐页：第一版用规则匹配，从现有风格和模板数据中推荐结果。
- 简化维护后台：第一版是配置维护原型，可查看、编辑、创建草稿和导出 JSON。
- 上线质量检查：包含数据校验、关键页面检查、lint 和生产构建检查。

## 本地运行

先确认电脑已经安装 Node.js。

```bash
npm install
npm run dev
```

然后在浏览器打开：

```text
http://localhost:3000
```

开发常用入口：

```text
http://localhost:3000/developer
http://localhost:3000/components
http://localhost:3000/templates
```

## 本地检查

每次准备部署前，建议运行：

```bash
npm run quality:check
npm run validate:data
npm run check:pages
npm run lint
npm run build
```

含义：

- `npm run quality:check`：上线前综合检查，包含数据、页面和 lint。
- `npm run validate:data`：检查 JSON 数据字段和关联关系。
- `npm run check:pages`：检查关键路由、动态路由数据、空状态、错误状态、复制反馈等质量标记。
- `npm run lint`：检查代码是否有明显规范问题。
- `npm run build`：模拟线上部署构建，确认项目可以被 Vercel 正常打包。

## Vercel 部署说明

适合非技术人员的操作流程：

1. 把代码推送到 GitHub 仓库。
2. 打开 Vercel。
3. 点击 Add New Project。
4. 选择这个 GitHub 仓库。
5. Framework Preset 选择 Next.js。
6. Build Command 使用默认值或填写 `npm run build`。
7. Output Directory 保持默认，不需要填写。
8. Environment Variables 第一版不需要配置。
9. 点击 Deploy。
10. 部署完成后，打开 Vercel 给出的线上地址验收页面。

第一版没有数据库、没有真实 AI API、没有私密环境变量，所以部署配置会比较简单。

## 数据在哪里维护

风格包数据在：

```text
data/styles.json
```

模板数据在：

```text
data/templates.json
```

组件数据在：

```text
data/components.json
```

Prompt 数据在：

```text
data/prompts.json
```

Token 和更新记录在：

```text
data/tokens.json
data/changelog.json
data/release-notes.json
```

注意：`/admin` 现在是第一版维护原型，页面里可以编辑、创建草稿、导出 JSON，但还不会自动写回数据文件。后续接入数据库和权限后，可以变成真正的后台。

## 全局图标规范

项目统一使用 Iconify + Iconpark Light 作为图标体系。页面里不要直接写散落的 SVG、emoji 或文字占位图标。

当前统一入口：

```text
components/icon.tsx
lib/icon-map.ts
```

使用规则：

1. 新图标先加入 `lib/icon-map.ts`，建立业务语义名称，例如 `layout-grid`、`monitor-smartphone`、`workflow`。
2. 页面和组件只通过 `Icon` 组件使用图标，不直接写 `<svg>`。
3. 默认尺寸为 `20px`，默认颜色为 `#475569`。
4. 导航或重点入口可使用 `24px`，状态图标建议使用 `16px`。
5. hover 颜色统一为 `#6D28D9`，disabled 颜色统一为 `#94A3B8`。
6. 能力卡、功能卡等图标容器建议使用 `44px × 44px`、圆角 `14px`、浅紫背景 `#F3ECFF`。

示例：

```tsx
import { Icon } from "@/components/icon";

<Icon icon="layout-grid" />
<Icon icon="monitor-smartphone" size={24} color="currentColor" />
```

首页三个能力卡使用的语义图标：

- `30+ 企业风格`：`layout-grid`
- `双端效果预览`：`monitor-smartphone`
- `设计开发对齐`：`workflow`

说明：`Icon` 组件保留了 Iconify 映射信息，并提供本地 fallback 渲染，确保在依赖安装或构建环境异常时页面仍可正常显示。项目依赖使用 `@iconify/iconify` 和 `@iconify-json/icon-park-outline`，后者对应 IconPark 的线性 / Light 风格图标集。

## 页面路由

```text
/                         首页
/styles                   风格广场
/styles/[styleId]         风格详情页
/templates                模板库
/templates/[templateId]   模板详情页
/components               组件文档入口
/design-guide             设计师维护流程页
/developer                开发者使用入口
/ai-recommend             AI 推荐页
/admin                    简化维护后台
/admin/design-handoff     设计交付维护区
```

示例：

```text
/styles/style-001-modern-saas-clean
/templates/tpl-p0-002
```

## JSON 数据在生产环境是否可用

项目通过代码直接引用 `data/` 目录里的 JSON 文件。Vercel 构建时会把这些数据一起打包，因此线上环境可以正常读取，不依赖本地文件路径，也不需要额外上传数据库。

## 后续如何接入 Figma

第一版已经在模板数据里保留了 `figma_url` 字段。后续可以做：

- 点击按钮跳转到真实 Figma 文件。
- 在模板详情页嵌入 Figma 预览。
- 增加 Figma API，同步设计稿状态和版本。

## 后续如何接入 Storybook

第一版已经在模板数据里保留了 `storybook_url` 字段。后续可以做：

- 点击按钮跳转到真实 Storybook 组件文档。
- 在组件页面嵌入 Storybook iframe。
- 把模板依赖的组件和 Storybook 示例一一对应。

组件接入 Storybook 的建议流程：

1. 在 `data/components.json` 中确认组件 `id`、`name`、`variants`、`states`、`design_tokens`。
2. 在真实组件库中补齐组件实现和示例。
3. 在 Storybook 中创建对应 stories 和 docs。
4. 把 Storybook 地址写入 `storybook_url`。
5. 把代码目录写入 `code_url`。
6. 在 `/components` 页面检查组件是否能跳转到 Storybook 和 Code。

## 页面如何新增

新增页面通常从 `app/` 目录开始：

1. 在 `app/your-route/page.tsx` 创建页面。
2. 优先从 `lib/catalog.ts` 读取 styles、templates、components 等数据。
3. 使用现有 `PageShell` 保持页面结构一致。
4. 如果页面需要复制、筛选、编辑等交互，再拆到 `components/` 里的客户端组件。
5. 新增后运行 `npm run lint` 和 `npm run build`。

## 模板如何新增

模板数据维护在 `data/templates.json`。

新增模板至少要补齐：

- `id`
- `name`
- `platform`
- `type`
- `scene`
- `style_pack_id`
- `layout`
- `components`
- `states`
- `figma_url`
- `storybook_url`
- `code_url`
- `ai_prompt_id`
- `suitable_for`
- `not_suitable_for`
- `design_acceptance`

更简单的方式是先进入 `/admin`，点击“新增模板草稿”，填写后导出 JSON，再交给开发或数据维护人员保存到 `data/templates.json`。

## 开发者如何使用模板

推荐流程：

1. 打开 `/developer` 看项目结构和使用步骤。
2. 打开 `/templates` 找到接近业务场景的模板。
3. 进入 `/templates/[templateId]`，复制模板 ID、页面结构、组件清单和开发 Prompt。
4. 打开 `/components` 查组件的状态、变体、Token、Storybook 和 Code。
5. 根据模板详情页的“开发交付区”搭页面骨架。
6. 接真实 API 前，先补齐 loading、empty、error、permission-denied 等状态。
7. 提交前运行 `npm run validate:data`、`npm run lint`、`npm run build`。

## 后续如何接入数据库

当需要多人维护、登录、权限、审核流、版本记录时，可以接入数据库。建议优先考虑 Supabase 或 Postgres。

数据库可以承接：

- 风格包管理。
- 模板管理。
- 草稿和审核状态。
- 用户、团队和权限。
- 收藏、使用记录和版本变更。

接数据库时建议保留当前 JSON 字段命名，把它们迁移成表结构：

- `styles`
- `templates`
- `components`
- `prompts`
- `tokens`
- `changelog`
- `release_notes`

这样前台页面只需要把 `lib/catalog.ts` 的数据来源从 JSON 换成数据库查询，页面结构可以尽量少改。

## V2 角色权限原型

第一版不接真实登录，但已经在代码中预留角色模型：

```text
viewer      只能查看
designer    可维护风格、模板、Token、Figma 链接
developer   可维护组件、Storybook、代码链接
admin       可审核、发布、废弃
```

角色定义在：

```text
lib/roles.ts
```

后台 `/admin` 页面会展示这些角色和权限，方便后续接数据库与真实登录。

## V2 文档

更多上线质量、维护和权限说明见：

```text
docs/V2_上线质量与维护说明.md
```

## 后续如何接入 AI API

当前 `/ai-recommend` 是规则推荐，不调用真实 AI。后续可以接入 AI API，让它根据用户输入自动生成：

- 推荐风格。
- 推荐模板。
- 页面结构建议。
- 组件清单。
- 设计 Prompt。
- 开发 Prompt。

接入 AI API 后，建议仍然保留 JSON 或数据库里的结构化数据，让 AI 有稳定可靠的推荐依据。

## 非技术人员验收清单

部署完成后，可以按下面步骤验收：

1. 首页能打开，并且能看懂这个工具是做什么的。
2. 点击“按风格选”能进入 `/styles`。
3. `/styles` 能看到 30 个风格包。
4. 点击任意风格卡片能进入详情页。
5. 点击“按业务场景选”或进入 `/templates`，能看到模板卡片。
6. 点击任意模板卡片能进入模板详情页。
7. `/components` 能看到组件清单和核心组件预览。
8. `/ai-recommend` 输入需求后能推荐具体风格和模板。
9. `/admin` 能查看风格包和模板列表，并能导出 JSON。
10. 手机浏览器打开页面时，内容不横向溢出，主要信息能正常阅读。
