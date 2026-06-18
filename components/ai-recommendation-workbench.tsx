"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyAction } from "@/components/copy-action";
import type { ComponentItem, StylePack, TemplateItem } from "@/lib/catalog";

type AiRecommendationWorkbenchProps = {
  styles: StylePack[];
  templates: TemplateItem[];
  components: ComponentItem[];
};

type PlatformOption = "admin" | "app" | "mobile-web" | "dashboard";
type DensityOption = "舒展" | "标准" | "紧凑" | "高密度";

type InputState = {
  projectType: string;
  industry: string;
  platform: PlatformOption;
  userRole: string;
  corePage: string;
  visualPreference: string;
  informationDensity: DensityOption;
  needMobile: boolean;
  needDark: boolean;
  needDashboard: boolean;
};

type StructuredResult = {
  style_pack_id: string;
  template_id: string;
  confidence_score: number;
  reason: string;
  matched_tags: string[];
  next_action: string;
};

type ScoredStyle = StructuredResult & {
  style: StylePack;
  template?: TemplateItem;
};

type ScoredTemplate = StructuredResult & {
  template: TemplateItem;
  style?: StylePack;
};

type RejectedStyle = {
  style: StylePack;
  reason: string;
};

type Recommendation = {
  styles: ScoredStyle[];
  templates: ScoredTemplate[];
  components: ComponentItem[];
  componentNames: string[];
  structure: string[];
  reasons: string[];
  rejectedStyles: RejectedStyle[];
  designPrompt: string;
  devPrompt: string;
  productPrompt: string;
  json: string;
};

const platformOptions: Array<{ value: PlatformOption; label: string; hint: string }> = [
  { value: "admin", label: "后台 admin", hint: "管理后台、CRM、ERP、运营平台" },
  { value: "app", label: "App / 跨端", hint: "员工工作台、轻办公、业务 App" },
  { value: "mobile-web", label: "移动 H5", hint: "移动审批、外勤、巡检、移动办公" },
  { value: "dashboard", label: "数据看板", hint: "经营看板、监控中心、数据大屏" },
];

const industryOptions = [
  "通用企业服务",
  "CRM / 销售管理",
  "金融 / 风控",
  "电商 / 商家运营",
  "AI 助手 / Copilot",
  "审批 / 流程",
  "数据分析 / BI",
  "移动办公",
  "开发者平台",
  "合规 / 安全",
];

const visualOptions = ["稳重", "现代", "科技", "深色", "移动", "数据化", "亲和", "高级"];
const densityOptions: DensityOption[] = ["舒展", "标准", "紧凑", "高密度"];

const visualKeywords: Record<string, string[]> = {
  稳重: ["enterprise", "formal", "government", "trust", "process", "audit", "stable", "classic"],
  现代: ["modern", "saas", "minimal", "clean", "material", "adaptive", "card"],
  科技: ["ai", "copilot", "agent", "developer", "cloud", "security", "automation", "console"],
  深色: ["dark", "dashboard", "soc", "terminal", "high-contrast", "dataviz"],
  移动: ["mobile", "app", "ios", "fieldwork", "adaptive", "oa"],
  数据化: ["data", "table", "dashboard", "dataviz", "chart", "analytics", "dense", "bi"],
  亲和: ["healthcare", "education", "people", "commerce", "clean", "accessible", "friendly"],
  高级: ["premium", "ios", "fintech", "trust", "brand", "white-label", "polished"],
};

const platformKeywords: Record<PlatformOption, string[]> = {
  admin: ["admin", "web admin", "table", "crud", "erp", "crm", "backend", "list", "form"],
  app: ["app", "responsive app", "cross-platform", "workspace", "home", "adaptive"],
  "mobile-web": ["mobile", "mobile-web", "app", "fieldwork", "oa", "ios", "workbench"],
  dashboard: ["dashboard", "large screen", "dataviz", "chart", "realtime", "monitoring", "analytics"],
};

const densityKeywords: Record<DensityOption, string[]> = {
  舒展: ["clean", "minimal", "card", "mobile", "premium"],
  标准: ["standard", "admin", "saas", "material", "workspace"],
  紧凑: ["compact", "table", "crud", "enterprise", "process"],
  高密度: ["dense", "data", "table", "carbon", "dashboard", "dataviz"],
};

const examples: Array<{ label: string; value: InputState }> = [
  {
    label: "后台订单管理",
    value: {
      projectType: "订单运营后台",
      industry: "电商 / 商家运营",
      platform: "admin",
      userRole: "运营、客服、商家管理员",
      corePage: "订单列表、订单详情、批量处理、售后状态",
      visualPreference: "稳重",
      informationDensity: "紧凑",
      needMobile: false,
      needDark: false,
      needDashboard: false,
    },
  },
  {
    label: "企业数据看板",
    value: {
      projectType: "经营数据看板",
      industry: "数据分析 / BI",
      platform: "dashboard",
      userRole: "管理层、数据分析师",
      corePage: "指标概览、趋势图、异常提醒、排行榜",
      visualPreference: "数据化",
      informationDensity: "高密度",
      needMobile: false,
      needDark: true,
      needDashboard: true,
    },
  },
  {
    label: "App 首页",
    value: {
      projectType: "企业移动办公 App",
      industry: "移动办公",
      platform: "app",
      userRole: "一线员工、团队成员",
      corePage: "App 首页、快捷入口、待办任务、消息提醒",
      visualPreference: "移动",
      informationDensity: "标准",
      needMobile: true,
      needDark: false,
      needDashboard: false,
    },
  },
  {
    label: "审批流程",
    value: {
      projectType: "企业审批系统",
      industry: "审批 / 流程",
      platform: "admin",
      userRole: "审批人、申请人、流程管理员",
      corePage: "审批详情、流程时间线、审批动作、附件材料",
      visualPreference: "稳重",
      informationDensity: "标准",
      needMobile: true,
      needDark: false,
      needDashboard: false,
    },
  },
  {
    label: "AI 助手工作台",
    value: {
      projectType: "AI Copilot 工作台",
      industry: "AI 助手 / Copilot",
      platform: "admin",
      userRole: "业务专员、运营、产品经理",
      corePage: "对话区、任务建议、引用来源、结果卡片",
      visualPreference: "科技",
      informationDensity: "标准",
      needMobile: false,
      needDark: false,
      needDashboard: true,
    },
  },
];

const defaultInput: InputState = examples[0].value;

export function AiRecommendationWorkbench({
  styles,
  templates,
  components,
}: AiRecommendationWorkbenchProps) {
  const [input, setInput] = useState<InputState>(defaultInput);
  const [hasRecommended, setHasRecommended] = useState(true);

  const recommendation = useMemo(
    () => buildRecommendation(input, styles, templates, components),
    [components, input, styles, templates],
  );

  function updateInput<K extends keyof InputState>(key: K, value: InputState[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[430px_1fr]">
      <div className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">结构化需求输入</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            当前不调用真实大模型，只基于风格、模板、组件和状态 metadata 做规则匹配。
          </p>

          <div className="mt-5 grid gap-4">
            <Field label="项目类型" value={input.projectType} onChange={(value) => updateInput("projectType", value)} />
            <SelectField label="行业" value={input.industry} options={industryOptions} onChange={(value) => updateInput("industry", value)} />
            <SelectField
              label="平台"
              value={input.platform}
              options={platformOptions.map((item) => item.value)}
              onChange={(value) => updateInput("platform", value as PlatformOption)}
            />
            <Field label="用户角色" value={input.userRole} onChange={(value) => updateInput("userRole", value)} />
            <Area label="核心页面" value={input.corePage} onChange={(value) => updateInput("corePage", value)} />
            <SelectField label="视觉偏好" value={input.visualPreference} options={visualOptions} onChange={(value) => updateInput("visualPreference", value)} />
            <SelectField
              label="信息密度"
              value={input.informationDensity}
              options={densityOptions}
              onChange={(value) => updateInput("informationDensity", value as DensityOption)}
            />
            <div className="grid gap-2">
              <Toggle label="需要移动端" checked={input.needMobile} onChange={(value) => updateInput("needMobile", value)} />
              <Toggle label="需要深色模式" checked={input.needDark} onChange={(value) => updateInput("needDark", value)} />
              <Toggle label="需要数据看板" checked={input.needDashboard} onChange={(value) => updateInput("needDashboard", value)} />
            </div>
            <button
              type="button"
              onClick={() => setHasRecommended(true)}
              className="rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              生成推荐
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-50 p-5">
          <h2 className="text-sm font-semibold text-violet-950">示例需求</h2>
          <div className="mt-4 grid gap-2">
            {examples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => {
                  setInput(example.value);
                  setHasRecommended(true);
                }}
                className="rounded-md bg-white px-3 py-2 text-left text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasRecommended ? (
        <div className="space-y-5">
          <RecommendationSummary recommendation={recommendation} />

          <ResultSection
            title="推荐风格包 3 个"
            actions={<CopyAction label="复制推荐结果" value={recommendation.json} />}
          >
            <div className="grid gap-4 lg:grid-cols-3">
              {recommendation.styles.map((result, index) => (
                <StyleResultCard key={result.style.id} result={result} rank={index + 1} />
              ))}
            </div>
          </ResultSection>

          <ResultSection title="推荐模板 3 个">
            <div className="grid gap-4 lg:grid-cols-3">
              {recommendation.templates.map((result, index) => (
                <TemplateResultCard key={result.template.id} result={result} rank={index + 1} />
              ))}
            </div>
          </ResultSection>

          <section className="grid gap-5 lg:grid-cols-2">
            <AdviceCard title="推荐组件组合" items={recommendation.componentNames} copyValue={recommendation.componentNames.join("\n")} />
            <AdviceCard title="推荐页面结构" items={recommendation.structure} copyValue={recommendation.structure.join(" > ")} />
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <ReasonCard title="推荐原因" items={recommendation.reasons} tone="good" />
            <RejectedCard items={recommendation.rejectedStyles} />
          </section>

          <section className="grid gap-5">
            <PromptCard title="设计 Prompt" body={recommendation.designPrompt} />
            <PromptCard title="开发 Prompt" body={recommendation.devPrompt} />
            <PromptCard title="产品说明 Prompt" body={recommendation.productPrompt} />
          </section>
        </div>
      ) : null}
    </section>
  );
}

function RecommendationSummary({ recommendation }: { recommendation: Recommendation }) {
  const primaryStyle = recommendation.styles[0];
  const primaryTemplate = recommendation.templates[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
        Structured rule-based recommendation
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-950">推荐结论</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        建议优先使用
        <span className="font-semibold text-slate-950"> {primaryStyle?.style.name} </span>
        作为风格包，并从
        <span className="font-semibold text-slate-950"> {primaryTemplate?.template.name} </span>
        开始搭建。当前置信度为
        <span className="font-semibold text-violet-700"> {primaryTemplate?.confidence_score}%</span>。
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Info label="style_pack_id" value={primaryStyle?.style_pack_id ?? "待推荐"} />
        <Info label="template_id" value={primaryTemplate?.template_id ?? "待推荐"} />
      </div>
    </div>
  );
}

function ResultSection({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function StyleResultCard({ result, rank }: { result: ScoredStyle; rank: number }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <ResultHeader rank={rank} score={result.confidence_score} />
      <h3 className="mt-4 text-base font-semibold leading-6 text-slate-950">
        {result.style.name}
      </h3>
      <div className="mt-2 grid gap-1 font-mono text-[11px] text-violet-700">
        <span>style_pack_id: {result.style_pack_id}</span>
        <span>template_id: {result.template_id}</span>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {result.reason}
      </p>
      <TagList tags={result.matched_tags} />
      <div className="mt-4 flex flex-wrap gap-2">
        <LinkButton href={`/styles/${result.style.id}`} label="风格详情" />
        <LinkButton href={`/templates/${result.template_id}`} label="模板详情" />
      </div>
      <p className="mt-4 rounded-md bg-white px-3 py-2 text-xs leading-5 text-slate-600">
        下一步：{result.next_action}
      </p>
    </article>
  );
}

function TemplateResultCard({ result, rank }: { result: ScoredTemplate; rank: number }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <ResultHeader rank={rank} score={result.confidence_score} />
      <h3 className="mt-4 text-base font-semibold leading-6 text-slate-950">
        {result.template.name}
      </h3>
      <div className="mt-2 grid gap-1 font-mono text-[11px] text-violet-700">
        <span>template_id: {result.template_id}</span>
        <span>style_pack_id: {result.style_pack_id}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {result.reason}
      </p>
      <TagList tags={result.matched_tags} />
      <div className="mt-4 flex flex-wrap gap-2">
        <LinkButton href={`/templates/${result.template.id}`} label="模板详情" />
        <LinkButton href={`/styles/${result.style_pack_id}`} label="风格详情" />
      </div>
      <p className="mt-4 rounded-md bg-white px-3 py-2 text-xs leading-5 text-slate-600">
        下一步：{result.next_action}
      </p>
    </article>
  );
}

function ResultHeader({ rank, score }: { rank: number; score: number }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="rounded-md bg-violet-700 px-2.5 py-1 text-xs font-semibold text-white">
        #{rank}
      </span>
      <span className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
        confidence {score}%
      </span>
    </div>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md border border-violet-100 bg-white px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
    >
      {label}
    </Link>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.slice(0, 8).map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function AdviceCard({
  title,
  items,
  copyValue,
}: {
  title: string;
  items: string[];
  copyValue: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <CopyAction label="复制" value={copyValue} tone="outline" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReasonCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "warn";
}) {
  return (
    <div className={`rounded-xl border p-6 shadow-sm ${tone === "good" ? "border-emerald-100 bg-emerald-50" : "border-amber-100 bg-amber-50"}`}>
      <h2 className={`text-lg font-semibold ${tone === "good" ? "text-emerald-950" : "text-amber-950"}`}>
        {title}
      </h2>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <p key={item} className={`rounded-md bg-white px-3 py-2 text-sm leading-6 ${tone === "good" ? "text-emerald-900" : "text-amber-900"}`}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function RejectedCard({ items }: { items: RejectedStyle[] }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-amber-950">不推荐的风格和原因</h2>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <p key={item.style.id} className="rounded-md bg-white px-3 py-2 text-sm leading-6 text-amber-900">
            <span className="font-semibold">{item.style.name}：</span>
            {item.reason}
          </p>
        ))}
      </div>
    </div>
  );
}

function PromptCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <CopyAction label="复制 Prompt" value={body} />
      </div>
      <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        {body}
      </pre>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal leading-6 text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-violet-700"
      />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 font-mono text-xs font-semibold text-violet-700">{value}</p>
    </div>
  );
}

function buildRecommendation(
  input: InputState,
  styles: StylePack[],
  templates: TemplateItem[],
  components: ComponentItem[],
): Recommendation {
  const query = normalize(Object.values(input).join(" "));
  const preferenceKeywords = visualKeywords[input.visualPreference] ?? [];
  const platformTerms = platformKeywords[input.platform] ?? [];
  const densityTerms = densityKeywords[input.informationDensity] ?? [];

  const scoredStyles = styles
    .map((style) => scoreStyle(style, query, preferenceKeywords, platformTerms, densityTerms, input))
    .sort((a, b) => b.rawScore - a.rawScore);

  const styleResults = scoredStyles.slice(0, 3).map((result) => {
    const linkedTemplate = findBestTemplateForStyle(result.style, templates, input, query);

    return {
      style: result.style,
      template: linkedTemplate,
      style_pack_id: result.style.id,
      template_id: linkedTemplate?.id ?? templates[0]?.id ?? "",
      confidence_score: toConfidence(result.rawScore),
      reason: result.reason,
      matched_tags: result.matchedTags,
      next_action: `进入风格详情，确认「${result.style.name}」是否符合项目调性。`,
    };
  });

  const selectedStyleIds = new Set(styleResults.map((item) => item.style_pack_id));
  const templateResults = templates
    .map((template) => scoreTemplate(template, styles.find((style) => style.id === template.style_pack_id), query, input, selectedStyleIds))
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, 3)
    .map((result) => ({
      template: result.template,
      style: result.style,
      style_pack_id: result.template.style_pack_id,
      template_id: result.template.id,
      confidence_score: toConfidence(result.rawScore),
      reason: result.reason,
      matched_tags: result.matchedTags,
      next_action: `进入模板详情，复制页面结构、组件清单和开发 Prompt。`,
    }));

  const componentNames = getRecommendedComponents(templateResults, components, input);
  const componentItems = componentNames
    .map((name) => findComponent(name, components))
    .filter(Boolean) as ComponentItem[];
  const structure = getStructureAdvice(templateResults[0]?.template, input);
  const rejectedStyles = scoredStyles
    .slice()
    .reverse()
    .filter((item) => !styleResults.some((selected) => selected.style_pack_id === item.style.id))
    .slice(0, 3)
    .map((item) => ({
      style: item.style,
      reason: getRejectedReason(item.style, input),
    }));

  const reasons = [
    `平台选择为「${input.platform}」，优先匹配 ${platformTerms.slice(0, 4).join(" / ")} 相关模板。`,
    `视觉偏好为「${input.visualPreference}」，优先匹配 ${preferenceKeywords.slice(0, 5).join(" / ")} 等标签。`,
    `信息密度为「${input.informationDensity}」，用于区分表格密集型、看板型和移动轻办公模板。`,
    input.needDashboard ? "需求明确需要数据看板，因此提高 Dashboard、Chart、Metric 相关模板权重。" : "需求未强制数据看板，因此不把大屏或重图表作为唯一方向。",
  ];

  const designPrompt = buildDesignPrompt(input, styleResults[0], templateResults[0], structure, componentNames);
  const devPrompt = buildDevPrompt(input, styleResults[0], templateResults[0], structure, componentNames);
  const productPrompt = buildProductPrompt(input, styleResults, templateResults, structure, componentNames);
  const json = JSON.stringify(
    {
      recommended_styles: styleResults.map(stripStyleResult),
      recommended_templates: templateResults.map(stripTemplateResult),
      recommended_components: componentNames,
      recommended_structure: structure,
      rejected_styles: rejectedStyles.map((item) => ({
        style_pack_id: item.style.id,
        reason: item.reason,
      })),
      prompts: {
        design: designPrompt,
        development: devPrompt,
        product: productPrompt,
      },
    },
    null,
    2,
  );

  return {
    styles: styleResults,
    templates: templateResults,
    components: componentItems,
    componentNames,
    structure,
    reasons,
    rejectedStyles,
    designPrompt,
    devPrompt,
    productPrompt,
    json,
  };
}

function scoreStyle(
  style: StylePack,
  query: string,
  preferenceKeywords: string[],
  platformTerms: string[],
  densityTerms: string[],
  input: InputState,
) {
  const text = normalize(`${style.name} ${style.category} ${style.scenario} ${style.visual} ${style.v1} ${style.tokens} ${style.tags.join(" ")}`);
  const matchedTags = getMatchedTags(style.tags, query, [...preferenceKeywords, ...platformTerms, ...densityTerms]);
  let rawScore = style.priority === "P0" ? 26 : style.priority === "P1" ? 14 : 6;

  rawScore += countTokenHits(query, text) * 5;
  rawScore += preferenceKeywords.filter((keyword) => text.includes(keyword)).length * 8;
  rawScore += platformTerms.filter((keyword) => text.includes(keyword)).length * 6;
  rawScore += densityTerms.filter((keyword) => text.includes(keyword)).length * 5;
  if (input.needDark && text.includes("dark")) rawScore += 18;
  if (input.needMobile && text.includes("mobile")) rawScore += 16;
  if (input.needDashboard && (text.includes("dashboard") || text.includes("dataviz"))) rawScore += 16;

  return {
    style,
    rawScore,
    matchedTags,
    reason: `适合当前项目，因为它的场景、标签和视觉描述与「${input.industry} / ${input.visualPreference} / ${input.informationDensity}」匹配，且优先级为 ${style.priority}。`,
  };
}

function scoreTemplate(
  template: TemplateItem,
  style: StylePack | undefined,
  query: string,
  input: InputState,
  selectedStyleIds: Set<string>,
) {
  const text = normalize(`${template.name} ${template.platform} ${template.type} ${template.scene} ${template.description} ${template.components.join(" ")} ${(template.tags ?? []).join(" ")} ${template.ai_tags.join(" ")} ${template.states.join(" ")} ${style?.tags.join(" ") ?? ""}`);
  const platformTerms = platformKeywords[input.platform] ?? [];
  const densityTerms = densityKeywords[input.informationDensity] ?? [];
  const matchedTags = getMatchedTags([...(template.tags ?? []), ...template.ai_tags, ...template.components, ...template.states], query, [...platformTerms, ...densityTerms]);
  let rawScore = template.status === "approved" ? 20 : template.status === "reviewing" ? 14 : 8;

  if (selectedStyleIds.has(template.style_pack_id)) rawScore += 18;
  if (getPlatformBucket(template.platform) === input.platform) rawScore += 18;
  rawScore += countTokenHits(query, text) * 6;
  rawScore += platformTerms.filter((keyword) => text.includes(keyword)).length * 6;
  rawScore += densityTerms.filter((keyword) => text.includes(keyword)).length * 5;
  if (input.needDark && text.includes("dark")) rawScore += 14;
  if (input.needMobile && (text.includes("mobile") || text.includes("app"))) rawScore += 12;
  if (input.needDashboard && (text.includes("dashboard") || text.includes("chart"))) rawScore += 14;

  return {
    template,
    style,
    rawScore,
    matchedTags,
    reason: `适合从这个模板开始，因为它的平台是「${template.platform}」，场景是「${template.scene}」，并且组件和状态覆盖更接近当前核心页面。`,
  };
}

function findBestTemplateForStyle(
  style: StylePack,
  templates: TemplateItem[],
  input: InputState,
  query: string,
) {
  return templates
    .filter((template) => template.style_pack_id === style.id)
    .map((template) => scoreTemplate(template, style, query, input, new Set([style.id])))
    .sort((a, b) => b.rawScore - a.rawScore)[0]?.template;
}

function getRecommendedComponents(
  templateResults: ScoredTemplate[],
  components: ComponentItem[],
  input: InputState,
) {
  const fromTemplates = templateResults.flatMap((item) => item.template.components);
  const essentials = ["Button", "Card", "Empty", "Skeleton", "Alert"];

  if (input.platform === "admin") essentials.push("Table", "SearchBar", "Pagination", "Modal");
  if (input.needDashboard || input.platform === "dashboard") essentials.push("ChartCard", "Tabs", "Tag");
  if (input.needMobile || input.platform === "app" || input.platform === "mobile-web") essentials.push("Topbar", "Badge", "Avatar");
  if (input.corePage.includes("审批")) essentials.push("Drawer", "Textarea", "Toast");

  return Array.from(new Set([...fromTemplates, ...essentials]))
    .map((name) => findComponent(name, components)?.name ?? name)
    .slice(0, 18);
}

function findComponent(name: string, components: ComponentItem[]) {
  const normalized = compact(name);
  return components.find((component) => {
    const candidates = [component.id, component.name, component.category, ...component.tags].map(compact);
    return candidates.some((candidate) => candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate));
  });
}

function getStructureAdvice(template: TemplateItem | undefined, input: InputState) {
  const type = template?.type.toLowerCase() ?? "";

  if (type.includes("list") || input.corePage.includes("列表")) {
    return ["PageHeader", "FilterPanel", "Toolbar", "DataTable", "BatchActionBar", "Pagination"];
  }

  if (type.includes("approval") || input.corePage.includes("审批")) {
    return ["PageHeader", "ApprovalSummary", "ApprovalTimeline", "EvidencePanel", "ActionBar"];
  }

  if (input.needMobile || input.platform === "mobile-web" || input.platform === "app") {
    return ["MobileHeader", "HeroCard", "QuickActions", "TaskFeed", "BottomNav"];
  }

  if (input.needDashboard || input.platform === "dashboard" || type.includes("dashboard")) {
    return ["MetricHeader", "ChartGrid", "RealtimeList", "InsightPanel", "AlertArea"];
  }

  return template?.layout.regions ?? ["PageHeader", "ContentGrid", "SidePanel", "ActionArea"];
}

function getRejectedReason(style: StylePack, input: InputState) {
  const text = normalize(`${style.name} ${style.category} ${style.scenario} ${style.visual} ${style.tags.join(" ")}`);

  if (input.needMobile && !text.includes("mobile") && input.platform === "mobile-web") {
    return "当前需求强调移动端，但这个风格不是移动优先，首版落地成本会更高。";
  }

  if (input.needDark && !text.includes("dark")) {
    return "当前需求需要深色模式，但这个风格没有明显深色或数据大屏特征。";
  }

  if (input.needDashboard && !text.includes("dashboard") && !text.includes("data")) {
    return "当前需求需要数据看板，但这个风格不以图表、指标或数据密度为核心。";
  }

  return "与当前行业、平台或视觉偏好的命中较少，作为第一版首选方向不够稳妥。";
}

function buildDesignPrompt(
  input: InputState,
  style: ScoredStyle | undefined,
  template: ScoredTemplate | undefined,
  structure: string[],
  componentNames: string[],
) {
  return [
    `请基于 style_pack_id「${style?.style_pack_id}」和 template_id「${template?.template_id}」设计企业级页面。`,
    `项目类型：${input.projectType}`,
    `行业：${input.industry}`,
    `平台：${input.platform}`,
    `用户角色：${input.userRole}`,
    `核心页面：${input.corePage}`,
    `视觉偏好：${input.visualPreference}`,
    `信息密度：${input.informationDensity}`,
    `页面结构：${structure.join(" + ")}`,
    `组件组合：${componentNames.join("、")}`,
    `要求：解释为什么适合业务方，补齐 default/loading/empty/error/permission-denied 状态，并注明移动端、深色模式和数据看板处理方式。`,
  ].join("\n");
}

function buildDevPrompt(
  input: InputState,
  style: ScoredStyle | undefined,
  template: ScoredTemplate | undefined,
  structure: string[],
  componentNames: string[],
) {
  return [
    `请实现 template_id「${template?.template_id}」对应页面，关联 style_pack_id「${style?.style_pack_id}」。`,
    `平台：${input.platform}`,
    `核心页面：${input.corePage}`,
    `推荐页面结构：${structure.join(" -> ")}`,
    `推荐组件：${componentNames.join(", ")}`,
    `状态要求：default、loading、empty、error、permission-denied。`,
    `API 建议：根据页面结构拆分列表/详情/指标/操作接口，不要把所有数据塞进单一接口。`,
    `响应式建议：${input.needMobile ? "必须提供移动端布局。" : "桌面优先，保证窄屏可阅读。"}`,
  ].join("\n");
}

function buildProductPrompt(
  input: InputState,
  styleResults: ScoredStyle[],
  templateResults: ScoredTemplate[],
  structure: string[],
  componentNames: string[],
) {
  return [
    "请把下面的 UI 选型结果整理成产品说明，给非设计和非技术同事阅读。",
    `项目类型：${input.projectType}`,
    `推荐风格包：${styleResults.map((item) => `${item.style.name}(${item.style_pack_id})`).join("、")}`,
    `推荐模板：${templateResults.map((item) => `${item.template.name}(${item.template_id})`).join("、")}`,
    `页面结构：${structure.join("、")}`,
    `组件组合：${componentNames.join("、")}`,
    "请说明为什么这样选、适合什么场景、不适合什么场景，以及下一步需要产品、设计、开发分别确认什么。",
  ].join("\n");
}

function stripStyleResult(item: ScoredStyle) {
  return {
    style_pack_id: item.style_pack_id,
    template_id: item.template_id,
    confidence_score: item.confidence_score,
    reason: item.reason,
    matched_tags: item.matched_tags,
    next_action: item.next_action,
  };
}

function stripTemplateResult(item: ScoredTemplate) {
  return {
    style_pack_id: item.style_pack_id,
    template_id: item.template_id,
    confidence_score: item.confidence_score,
    reason: item.reason,
    matched_tags: item.matched_tags,
    next_action: item.next_action,
  };
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[，。；、/|·:：,.;()（）]/g, " ");
}

function compact(value: string) {
  return normalize(value).replace(/\s+/g, "");
}

function countTokenHits(query: string, target: string) {
  const tokens = Array.from(new Set(query.split(/\s+/).filter((token) => token.length >= 2)));
  return tokens.filter((token) => target.includes(token)).length;
}

function getMatchedTags(tags: string[], query: string, keywords: string[]) {
  const all = Array.from(new Set([...tags, ...keywords])).filter(Boolean);
  const matched = all.filter((tag) => {
    const normalized = normalize(tag);
    return query.includes(normalized) || keywords.includes(tag) || keywords.includes(normalized);
  });
  return matched.length ? matched.slice(0, 10) : all.slice(0, 6);
}

function getPlatformBucket(platform: string): PlatformOption {
  if (platform === "admin" || platform === "web admin") return "admin";
  if (platform === "app" || platform === "responsive app") return "app";
  if (platform === "mobile" || platform === "mobile-web") return "mobile-web";
  if (platform === "dashboard" || platform === "large screen") return "dashboard";
  return "admin";
}

function toConfidence(score: number) {
  return Math.max(58, Math.min(96, Math.round(score)));
}
