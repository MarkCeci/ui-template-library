import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyAction } from "@/components/copy-action";
import { PageShell } from "@/components/page-shell";
import { TemplateAiDelivery } from "@/components/template-ai-delivery";
import { TemplateDetailPreview } from "@/components/template-detail-preview";
import { TemplateModuleTree } from "@/components/template-module-tree";
import {
  components,
  getStyleById,
  getTemplateById,
  prompts,
  templates,
  type ComponentItem,
  type PromptItem,
  type StylePack,
  type TemplateItem,
} from "@/lib/catalog";

const requiredStates = [
  "default",
  "loading",
  "empty",
  "error",
  "permission-denied",
  "disabled",
  "batch-selected",
];

export function generateStaticParams() {
  return templates.map((template) => ({ templateId: template.id }));
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    notFound();
  }

  const style = getStyleById(template.style_pack_id);
  const relatedPrompt = template.ai_prompt_id
    ? prompts.find((prompt) => prompt.id === template.ai_prompt_id)
    : undefined;
  const moduleNodes = getStructureFlow(template).map((moduleName) => ({
    name: moduleName,
    description: getModuleDescription(moduleName, template),
  }));
  const componentRows = getComponentRows(template);
  const aiPromptBlocks = getAiPromptBlocks(template, style, relatedPrompt);

  return (
    <PageShell
      eyebrow="Template Delivery"
      title={template.name}
      description="这是一个模板交付页：业务看适用性，设计看维护规范，开发看组件和代码入口，AI 工作流复制结构化 Prompt。"
      actions={
        <Link
          href="/templates"
          className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
        >
          返回模板库
        </Link>
      }
    >
      <section className="grid gap-5">
        <DeliverySummary template={template} style={style} />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <TemplateDetailPreview template={template} stylePack={style} />

            <SectionCard
              eyebrow="Structure"
              title="页面结构交付"
              description="用模块树表达页面由哪些区域组成。点击模块后，可以看到它承担的职责，方便业务、设计、开发用同一套语言沟通。"
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoBlock label="页面外壳" value={template.layout.shell} />
                <InfoBlock label="信息密度" value={template.layout.density} />
                <InfoBlock label="导航方式" value={template.layout.navigation} />
                <InfoBlock label="响应式策略" value={template.layout.responsive} />
              </div>
              <div className="mt-5">
                <TemplateModuleTree modules={moduleNodes} />
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Components"
              title="组件依赖交付"
              description="这里说明模板依赖哪些组件，以及这些组件在设计、Storybook 和代码侧是否已有入口。"
            >
              <div className="grid gap-3 md:grid-cols-2">
                {componentRows.map((row) => (
                  <ComponentDeliveryCard key={row.name} row={row} />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="States"
              title="状态矩阵"
              description="这是模板需要覆盖的常见页面状态。已覆盖表示当前数据中已有记录，待补齐表示后续设计和开发应继续完善。"
            >
              <StateMatrix templateStates={template.states} />
            </SectionCard>

            <SectionCard
              eyebrow="AI Workflow"
              title="AI 交付区"
              description="分别给设计、开发和页面结构生成使用，复制后可以继续交给 AI 工具、设计同学或开发同学。"
            >
              <TemplateAiDelivery prompts={aiPromptBlocks} />
              <div className="mt-4 flex flex-wrap gap-2">
                {(template.ai_tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SectionCard>
          </div>

          <aside className="space-y-5">
            <SectionCard
              eyebrow="Design"
              title="设计交付"
              description="设计以 Figma 为源，维护视觉规范、状态稿和样张。"
            >
              <div className="grid gap-3">
                <ResourceLink label="打开 Figma" href={template.figma_url} />
                <InfoBlock label="Figma 文件" value={template.figma_file_url ?? "待补充"} />
                <InfoBlock label="Figma 页面" value={template.figma_page_url ?? "待补充"} />
                <InfoBlock label="Figma 维护人" value={template.figma_owner ?? template.owner} />
                <InfoBlock label="Figma 更新时间" value={template.figma_last_updated ?? formatDate(template.updated_at)} />
                <DesignAcceptanceList template={template} />
                <InfoBlock label="Token modes" value={style?.tokens ?? "未配置"} />
                <DeliveryNote
                  title="设计说明"
                  items={getDesignNotes(template, style)}
                />
                <DeliveryNote
                  title="设计注意事项"
                  items={getDesignWarnings(template)}
                />
                <DeliveryNote
                  title="禁止用法"
                  items={template.not_suitable_for?.length ? template.not_suitable_for : getUsageGuide(template.type).unsuitable}
                  tone="warn"
                />
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Development"
              title="开发交付"
              description="开发以 Storybook 和代码入口为准。这里给出页面结构、组件引用、示例代码占位、数据字段、API 和状态处理建议。"
            >
              <div className="grid gap-3">
                <ResourceLink label="打开 Storybook" href={template.storybook_url} />
                <ResourceLink label="查看 Code" href={template.code_url} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <CopyAction label="复制开发 Prompt" value={getDevelopmentPrompt(template, style)} />
                  <CopyAction label="复制组件清单" value={template.components.join("\n")} tone="outline" />
                  <CopyAction label="复制页面结构" value={getStructureFlow(template).join(" > ")} tone="outline" />
                  <CopyAction label="复制模板 ID" value={template.id} tone="outline" />
                </div>
                <InfoBlock label="推荐页面结构" value={getStructureFlow(template).join(" > ")} />
                <DeliveryNote title="推荐组件引用" items={template.components} />
                <CodePlaceholder code={getExampleCode(template)} />
                <DeliveryNote title="数据字段建议" items={getDataFieldSuggestions(template)} />
                <DeliveryNote title="API 对接建议" items={getApiSuggestions(template)} />
                <DeliveryNote title="Props / 参数占位" items={getPropsNotes(template)} />
                <DeliveryNote title="状态处理说明" items={getStateNotes(template)} />
                <DeliveryNote title="响应式说明" items={[template.layout.responsive]} />
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Usage Boundary"
              title="使用边界"
              description="帮助业务和产品判断这个模板能不能直接使用，或者需要做哪些常见改造。"
            >
              <div className="grid gap-3">
                <UsageList
                  title="适合什么场景"
                  items={template.suitable_for?.length ? template.suitable_for : getUsageGuide(template.type).suitable}
                  tone="good"
                />
                <UsageList
                  title="不适合什么场景"
                  items={template.not_suitable_for?.length ? template.not_suitable_for : getUsageGuide(template.type).unsuitable}
                  tone="warn"
                />
                <UsageList
                  title="常见改造方式"
                  items={getTransformationIdeas(template)}
                  tone="neutral"
                />
              </div>
            </SectionCard>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function DeliverySummary({
  template,
  style,
}: {
  template: TemplateItem;
  style?: StylePack;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950 px-6 py-6 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-violet-200">
              {template.id}
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">
              顶部交付摘要
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
              {template.description}
            </p>
          </div>
          <StatusBadge status={template.status} />
        </div>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
        <InfoBlock label="模板名称" value={template.name} />
        <InfoBlock
          label="适用业务"
          value={(template.suitable_for ?? [template.scene]).join(" / ")}
        />
        <InfoBlock label="平台" value={template.platform} />
        <InfoBlock label="风格包" value={style?.name ?? template.style_pack_id} />
        <InfoBlock label="业务场景" value={template.scene} />
        <InfoBlock label="版本" value={template.version} />
        <InfoBlock label="维护人" value={template.owner} />
        <InfoBlock label="最后更新时间" value={formatDate(template.updated_at)} />
      </div>
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value || "待补充"}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "approved"
      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
      : status === "reviewing"
        ? "border-violet-300 bg-violet-50 text-violet-800"
        : status === "deprecated"
          ? "border-slate-300 bg-slate-100 text-slate-600"
          : "border-amber-300 bg-amber-50 text-amber-800";

  return (
    <span className={`w-fit rounded-md border px-3 py-1.5 text-sm font-semibold ${tone}`}>
      {status}
    </span>
  );
}

function ComponentDeliveryCard({
  row,
}: {
  row: {
    name: string;
    component?: ComponentItem;
  };
}) {
  const component = row.component;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href={`/components?component=${encodeURIComponent(row.name)}`}
            className="text-sm font-semibold text-slate-950 transition hover:text-violet-700"
          >
            {row.name}
          </Link>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {component?.description ?? "当前模板中已使用，组件文档中暂未精确映射。"}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600">
          {component?.status ?? "待映射"}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-slate-600">
        <p>
          变体：{component?.variants?.slice(0, 3).join(" / ") || "待补充"}
        </p>
        <p>
          状态：{component?.states?.slice(0, 4).join(" / ") || "待补充"}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CapabilityBadge label="Figma" enabled={Boolean(component?.figma_url)} />
        <CapabilityBadge label="Storybook" enabled={Boolean(component?.storybook_url)} />
        <CapabilityBadge label="Code" enabled={Boolean(component?.code_url)} />
      </div>
    </div>
  );
}

function CapabilityBadge({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <span
      className={`rounded-md border px-2 py-1 text-xs font-semibold ${
        enabled
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-400"
      }`}
    >
      {label}
    </span>
  );
}

function StateMatrix({ templateStates }: { templateStates: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {requiredStates.map((state) => {
        const covered = isStateCovered(state, templateStates);

        return (
          <div
            key={state}
            className={`rounded-lg border p-4 ${
              covered
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p
                className={`text-sm font-semibold ${
                  covered ? "text-emerald-800" : "text-slate-700"
                }`}
              >
                {state}
              </p>
              <span
                className={`rounded-md px-2 py-1 text-xs font-semibold ${
                  covered ? "bg-white text-emerald-700" : "bg-white text-slate-500"
                }`}
              >
                {covered ? "已覆盖" : "待补齐"}
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {getStateDescription(state)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ResourceLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      {label}
    </a>
  );
}

function DeliveryNote({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warn";
}) {
  return (
    <div className={`rounded-lg p-4 ${tone === "warn" ? "bg-amber-50" : "bg-slate-50"}`}>
      <h3 className={`text-sm font-semibold ${tone === "warn" ? "text-amber-950" : "text-slate-950"}`}>
        {title}
      </h3>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`text-sm leading-6 ${tone === "warn" ? "text-amber-900" : "text-slate-600"}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodePlaceholder({ code }: { code: string }) {
  return (
    <div className="rounded-lg bg-slate-950 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-100">示例代码占位</h3>
        <CopyAction label="复制代码" value={code} tone="outline" />
      </div>
      <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-xs leading-6 text-slate-100">
        {code}
      </pre>
    </div>
  );
}

function DesignAcceptanceList({ template }: { template: TemplateItem }) {
  const acceptance = template.design_acceptance;
  const items = [
    ["是否符合当前风格包", acceptance?.follows_style_pack],
    ["是否使用标准组件", acceptance?.uses_standard_components],
    ["是否包含空状态", acceptance?.includes_empty_state],
    ["是否包含错误状态", acceptance?.includes_error_state],
    ["是否包含加载状态", acceptance?.includes_loading_state],
    ["是否包含移动端适配说明", acceptance?.includes_responsive_notes],
    ["是否包含 Figma 链接", acceptance?.includes_figma_link],
  ] as const;

  return (
    <div className="rounded-lg bg-emerald-50 p-4">
      <h3 className="text-sm font-semibold text-emerald-950">设计验收清单</h3>
      <div className="mt-3 grid gap-2">
        {items.map(([label, checked]) => (
          <div key={label} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
            <span className="text-sm text-slate-700">{label}</span>
            <span
              className={`rounded-md px-2 py-1 text-xs font-semibold ${
                checked ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {checked ? "已覆盖" : "待补齐"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsageList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "warn" | "neutral";
}) {
  const classes = {
    good: "border-emerald-100 bg-emerald-50 text-emerald-900",
    warn: "border-amber-100 bg-amber-50 text-amber-900",
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div className={`rounded-lg border p-4 ${classes[tone]}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getComponentRows(template: TemplateItem) {
  return template.components.map((componentName) => {
    const normalized = normalize(componentName);
    const component = components.find((item) => {
      const names = [
        item.id,
        item.name,
        ...item.tags,
        item.category,
      ].map(normalize);

      return names.some((name) => name === normalized || name.includes(normalized) || normalized.includes(name));
    });

    return { name: componentName, component };
  });
}

function getAiPromptBlocks(
  template: TemplateItem,
  style?: StylePack,
  relatedPrompt?: PromptItem,
) {
  const styleName = style?.name ?? template.style_pack_id;
  const tokens = style?.tokens ?? "按当前风格包 token 执行";
  const layout = getStructureFlow(template).join(" > ");
  const componentsText = template.components.join("、");

  return [
    {
      id: "design",
      title: "设计 Prompt",
      description: "用于让 AI 或设计同学生成 Figma 首版页面和状态稿。",
      prompt: [
        `请基于「${styleName}」为「${template.name}」生成企业级 UI 设计方案。`,
        `适用业务：${(template.suitable_for ?? [template.scene]).join("、")}`,
        `平台：${template.platform}`,
        `视觉方向：${style?.visual ?? "参考当前模板视觉规范"}`,
        `Token modes：${tokens}`,
        `页面结构：${layout}`,
        "请输出默认、加载中、空数据、异常、无权限状态，并保持信息层级清晰、间距统一、适合企业内部工具使用。",
      ].join("\n"),
    },
    {
      id: "development",
      title: "开发 Prompt",
      description: "用于让 AI 或开发同学生成页面代码骨架和组件接入说明。",
      prompt: [
        `请为模板「${template.name}」生成 Next.js + TypeScript + Tailwind 的页面代码骨架。`,
        `模板 ID：${template.id}`,
        `关联风格包：${template.style_pack_id}`,
        `页面结构：${layout}`,
        `组件依赖：${componentsText}`,
        `状态处理：${requiredStates.join("、")}`,
        "请不要写死真实业务数据，使用可替换的数据结构，并说明每个组件的 props、loading、empty、error、permission-denied 处理方式。",
      ].join("\n"),
    },
    {
      id: "structure",
      title: "页面结构 Prompt",
      description: "用于让 AI 把业务需求整理成页面模块、组件和状态清单。",
      prompt: relatedPrompt?.prompt_text ?? [
        `请根据业务需求拆解「${template.name}」的页面结构。`,
        `业务场景：${template.scene}`,
        `建议模块树：${layout}`,
        `建议组件：${componentsText}`,
        `适合场景：${(template.suitable_for ?? []).join("、") || "按模板场景判断"}`,
        `不适合场景：${(template.not_suitable_for ?? []).join("、") || "复杂定制交互需另行评估"}`,
        "请输出模块说明、核心字段、主要操作、状态矩阵和后续设计/开发待确认问题。",
      ].join("\n"),
    },
  ];
}

function getDevelopmentPrompt(template: TemplateItem, style?: StylePack) {
  return [
    `请根据模板「${template.name}」生成可落地的前端页面实现方案。`,
    `模板 ID：${template.id}`,
    `平台：${template.platform}`,
    `类型：${template.type}`,
    `风格包：${style?.name ?? template.style_pack_id}`,
    `推荐页面结构：${getStructureFlow(template).join(" > ")}`,
    `推荐组件：${template.components.join("、")}`,
    `状态处理：${requiredStates.join("、")}`,
    "请输出 Next.js + TypeScript + Tailwind 的页面骨架、数据字段、API 对接点、组件 props、状态处理和响应式建议。",
  ].join("\n");
}

function getStructureFlow(template: { type: string; layout: { regions: string[] } }) {
  const type = template.type.toLowerCase();

  if (type.includes("list")) {
    return ["PageHeader", "FilterPanel", "Toolbar", "DataTable", "Pagination"];
  }

  if (type.includes("approval")) {
    return ["PageHeader", "ApprovalSummary", "ApprovalTimeline", "ActionBar"];
  }

  if (type.includes("form")) {
    return ["PageHeader", "FormSection", "ValidationMessage", "ActionFooter"];
  }

  if (type.includes("detail")) {
    return ["PageHeader", "SummaryPanel", "ContentTabs", "ActivityTimeline"];
  }

  if (type.includes("app") || type.includes("mobile")) {
    return ["MobileHeader", "HeroCard", "QuickActions", "TaskList", "BottomNav"];
  }

  if (type.includes("dashboard")) {
    return ["PageHeader", "MetricCards", "ChartGrid", "InsightPanel"];
  }

  return template.layout.regions;
}

function getModuleDescription(moduleName: string, template: TemplateItem) {
  const descriptions: Record<string, string> = {
    PageHeader: "承载页面标题、关键说明、主操作和状态信息，是用户判断当前页面用途的第一入口。",
    FilterPanel: "承载搜索、筛选、日期范围、状态选择等条件，帮助用户缩小数据范围。",
    Toolbar: "承载新建、导出、批量处理、视图切换等高频操作。",
    DataTable: "承载核心业务对象列表，包含字段展示、排序、选择和行级操作。",
    Pagination: "用于大数据量分页、每页数量切换和结果范围说明。",
    ApprovalSummary: "展示审批对象、当前状态、金额或关键业务摘要。",
    ApprovalTimeline: "展示流转节点、处理人、处理时间和审批意见。",
    ActionBar: "承载同意、驳回、转交、撤回等流程动作。",
    FormSection: "按业务主题组织输入项，降低长表单理解成本。",
    ValidationMessage: "展示字段错误、全局校验和提交前提示。",
    ActionFooter: "固定提交、保存草稿、取消等动作，避免长页面操作迷失。",
    SummaryPanel: "展示对象核心信息、状态、负责人和关键指标。",
    ContentTabs: "把详情信息按资料、记录、附件、日志等内容分组。",
    ActivityTimeline: "展示业务对象的历史变化和操作记录。",
    MobileHeader: "移动端顶部区域，包含问候、状态、入口和轻量导航。",
    HeroCard: "移动端首屏重点信息卡，用于任务、指标或提醒聚合。",
    QuickActions: "移动端高频操作入口，适合审批、打卡、巡检、创建等动作。",
    TaskList: "移动端待办或业务列表，强调可扫读和快速处理。",
    BottomNav: "移动端底部导航，承载 3 到 5 个核心频道。",
    MetricCards: "承载关键指标，帮助用户快速判断业务健康度。",
    ChartGrid: "承载趋势、分布、排行等图表模块。",
    InsightPanel: "承载异常提醒、AI 建议、待处理事项或运营洞察。",
  };

  return descriptions[moduleName] ?? `来自模板数据的区域「${moduleName}」，用于支撑「${template.scene}」中的核心信息展示或操作。`;
}

function isStateCovered(state: string, templateStates: string[]) {
  const stateText = templateStates.join(" ").toLowerCase();

  if (state === "batch-selected") {
    return stateText.includes("selected") || stateText.includes("batch");
  }

  if (state === "permission-denied") {
    return stateText.includes("permission") || stateText.includes("denied");
  }

  return stateText.includes(state);
}

function getStateDescription(state: string) {
  const descriptions: Record<string, string> = {
    default: "用户正常进入页面时看到的标准状态。",
    loading: "数据加载时的骨架屏、占位或进度提示。",
    empty: "没有数据时的提示、引导和下一步操作。",
    error: "接口失败或系统异常时的说明与重试入口。",
    "permission-denied": "用户无权限时的说明、申请权限或返回入口。",
    disabled: "不可操作控件的视觉状态和原因提示。",
    "batch-selected": "列表批量选择后的操作栏、数量提示和批处理状态。",
  };

  return descriptions[state] ?? "该状态需要在设计和开发联调时确认。";
}

function getDesignNotes(template: TemplateItem, style?: StylePack) {
  return [
    `Figma 中应维护「${template.name}」的默认态和核心异常态。`,
    `关联风格包：${style?.name ?? template.style_pack_id}。`,
    `视觉识别：${style?.visual ?? "按模板当前视觉方向执行"}。`,
    "设计稿需要标注关键组件、间距、状态和响应式变化。",
  ];
}

function getDesignWarnings(template: TemplateItem) {
  return [
    "不要只画默认态，至少补齐 loading、empty、error、permission-denied。",
    "不要把模板改成营销落地页，它应优先服务企业工具场景。",
    `当前模板信息密度为 ${template.layout.density}，不要随意提高密度导致阅读压力过大。`,
  ];
}

function getPropsNotes(template: TemplateItem) {
  return [
    "建议把页面数据、筛选条件、分页信息、权限信息拆成独立参数。",
    `组件依赖需要覆盖：${template.components.slice(0, 6).join("、")}。`,
    "真实接入前需要确认接口字段、枚举值、权限规则和操作回调。",
  ];
}

function getDataFieldSuggestions(template: TemplateItem) {
  const type = template.type.toLowerCase();

  if (type.includes("list")) {
    return ["id", "name", "status", "owner", "updatedAt", "createdAt", "selectedRows", "pagination", "filters"];
  }

  if (type.includes("dashboard")) {
    return ["metrics", "trendSeries", "ranking", "alerts", "insights", "dateRange", "loading", "error"];
  }

  if (type.includes("approval")) {
    return ["approvalId", "applicant", "summary", "currentStep", "timeline", "actions", "comments", "permission"];
  }

  if (type.includes("app") || type.includes("mobile")) {
    return ["user", "quickActions", "tasks", "notifications", "cards", "activeTab", "refreshing"];
  }

  if (type.includes("form")) {
    return ["formValues", "validationErrors", "dirty", "submitting", "options", "attachments"];
  }

  return ["id", "title", "status", "owner", "sections", "actions", "loading", "error"];
}

function getApiSuggestions(template: TemplateItem) {
  const type = template.type.toLowerCase();

  if (type.includes("list")) {
    return ["GET 列表数据，支持 page、pageSize、keyword、filters。", "POST/PUT 行级操作时返回最新状态。", "批量操作需要单独的 selectedIds 入参。"];
  }

  if (type.includes("dashboard")) {
    return ["GET 指标概览接口，按 dateRange 和 role 返回。", "图表接口与指标卡接口可以拆开，避免单点失败。", "异常提醒建议单独提供 alerts 接口。"];
  }

  if (type.includes("approval")) {
    return ["GET 审批详情和流程节点。", "POST 审批动作，例如 approve、reject、transfer。", "提交审批意见后刷新 timeline 和 currentStep。"];
  }

  if (type.includes("app") || type.includes("mobile")) {
    return ["GET 移动首页聚合数据，优先保证首屏字段。", "操作类接口需要返回轻量成功状态。", "移动端建议支持下拉刷新和分页加载。"];
  }

  return ["GET 页面详情数据。", "POST/PUT 保存或提交动作。", "所有接口需要返回 error code，便于页面展示错误状态。"];
}

function getExampleCode(template: TemplateItem) {
  const structure = getStructureFlow(template);
  const componentNames = template.components.slice(0, 6);

  return [
    `// Template: ${template.id}`,
    `// Page type: ${template.type}`,
    "",
    "type PageState = \"default\" | \"loading\" | \"empty\" | \"error\" | \"permission-denied\";",
    "",
    "export default function TemplatePage() {",
    "  const state: PageState = \"default\";",
    "",
    "  if (state === \"loading\") return <LoadingState />;",
    "  if (state === \"empty\") return <EmptyState />;",
    "  if (state === \"error\") return <ErrorState />;",
    "  if (state === \"permission-denied\") return <PermissionState />;",
    "",
    "  return (",
    "    <main>",
    ...structure.map((region) => `      <${region} />`),
    "    </main>",
    "  );",
    "}",
    "",
    `// Recommended components: ${componentNames.join(", ")}`,
  ].join("\n");
}

function getStateNotes(template: TemplateItem) {
  return [
    `当前数据已记录状态：${template.states.join("、")}。`,
    "接口请求期间显示 loading，不要让页面空白等待。",
    "无数据、异常、无权限要给明确原因和下一步操作。",
  ];
}

function getTransformationIdeas(template: TemplateItem) {
  const type = template.type.toLowerCase();

  if (type.includes("list")) {
    return ["增加批量操作栏", "把筛选区折叠为高级筛选", "增加字段配置和导出入口"];
  }

  if (type.includes("dashboard")) {
    return ["替换核心指标口径", "增加异常提醒面板", "按角色切换指标视图"];
  }

  if (type.includes("approval")) {
    return ["增加转交和加签动作", "增加审批意见模板", "增加流程节点权限说明"];
  }

  if (type.includes("app") || type.includes("mobile")) {
    return ["替换为角色化快捷入口", "增加消息提醒卡片", "按移动端触控尺寸优化按钮"];
  }

  return ["调整模块顺序", "替换业务字段", "补充状态和权限说明"];
}

function getUsageGuide(type: string) {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("list")) {
    return {
      suitable: ["对象数量多，需要搜索、筛选、排序和批量操作。", "需要给运营、客服、管理员高频处理业务记录。"],
      unsuitable: ["只展示少量精选内容的营销页面。", "强视觉叙事或沉浸展示页面。"],
    };
  }

  if (normalizedType.includes("approval")) {
    return {
      suitable: ["需要展示审批节点、处理人、流转记录和当前动作。", "适合请假、采购、报销、合同等流程型业务。"],
      unsuitable: ["没有明确流程状态的普通内容页。", "以图表分析为主的经营看板。"],
    };
  }

  if (normalizedType.includes("app") || normalizedType.includes("mobile")) {
    return {
      suitable: ["移动端首页、员工工作台、巡检、外勤和轻办公。", "需要大触控区、底部导航和卡片式任务流。"],
      unsuitable: ["需要展示大量表格列的复杂后台。", "需要长时间精细配置的桌面端流程。"],
    };
  }

  if (normalizedType.includes("dashboard")) {
    return {
      suitable: ["需要快速看指标、趋势、异常和待处理事项。", "适合管理者首页、经营概览和监控中心。"],
      unsuitable: ["需要逐条编辑大量数据的操作后台。", "强表单录入或审批流页面。"],
    };
  }

  return {
    suitable: ["需要快速复用页面结构和视觉方向的企业业务页面。", "适合产品、设计、开发共同确认首版方案。"],
    unsuitable: ["需要完全定制交互或强品牌传播的页面。", "需求尚未明确、业务对象和操作路径都不稳定的场景。"],
  };
}

function formatDate(date?: string) {
  return date ?? "待补充";
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, "");
}
