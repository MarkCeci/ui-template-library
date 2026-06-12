# 全局图标系统

本项目统一使用 Iconify + Iconpark Light 图标体系，目标是让首页、风格广场、预览区、状态反馈和维护后台的图标语义一致、风格一致、后续可维护。

实际 npm 依赖：

```text
@iconify/iconify
@iconify-json/icon-park-outline
```

说明：IconPark 的线性 / Light 风格在 Iconify JSON 包中对应 `icon-park-outline`。

## 统一入口

```text
components/icon.tsx
lib/icon-map.ts
```

所有页面和组件都必须通过 `Icon` 组件使用图标。不要在页面中直接写散落 SVG、emoji 或数字占位图标。

## 使用方式

```tsx
import { Icon } from "@/components/icon";

<Icon icon="layout-grid" />
<Icon icon="monitor-smartphone" size={24} color="currentColor" />
```

## 新增图标流程

1. 先确认图标要表达的业务语义。
2. 在 `lib/icon-map.ts` 中新增语义名称和 Iconify 映射。
3. 页面中通过 `<Icon icon="语义名称" />` 使用。
4. 如果多个业务场景语义相同，复用同一个 icon key，不要重复新增。

## 尺寸规范

- 默认图标：`20px`
- 导航入口：`24px`
- 状态反馈：`16px`
- 能力卡 / 功能卡容器：`44px × 44px`

## 颜色规范

- 默认：`#475569`
- hover：`#6D28D9`
- disabled：`#94A3B8`
- 图标容器背景：`#F3ECFF`

## 当前核心映射

- 风格库 / 样式库：`layout-grid`
- 双端预览：`monitor-smartphone`
- 设计开发对齐：`workflow`
- 数据 / 看板：`table`、`bar-chart`
- 搜索 / 筛选：`search`、`filter`
- 用户 / 账户：`user`、`users`
- 消息：`message`
- 设置：`settings`
- 状态反馈：`check-circle`、`info-circle`、`alert-circle`
- 组件 / 模板 / 页面：`layers`、`copy`、`link`、`pen-tool`

## 维护原则

图标只用于帮助用户更快理解功能，不为了装饰而添加。导航、按钮、状态、卡片中的图标应与文字语义一致，并保持同一套线性风格。
