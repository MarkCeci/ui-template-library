"use client";

import { useState } from "react";
import type { ComponentItem, PromptItem, StylePack, TemplateItem } from "@/lib/catalog";

type MaintainableStatus = "draft" | "reviewing" | "approved" | "deprecated";
type AdminTab = "styles" | "templates" | "components" | "prompts";

type EditableStyle = StylePack & {
  description: string;
  status: MaintainableStatus;
  version: string;
  owner: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  related_items: {
    templates?: string[];
    prompts?: string[];
    tokens?: string[];
    components?: string[];
    [key: string]: unknown;
  };
};

type EditableTemplate = TemplateItem & {
  description: string;
  status: MaintainableStatus;
  tags: string[];
  related_items: Record<string, unknown>;
  ai_prompt_id: string;
  suitable_for: string[];
  not_suitable_for: string[];
};

type EditableComponent = ComponentItem & {
  status: MaintainableStatus;
};

type EditablePrompt = PromptItem & {
  status: MaintainableStatus;
};

type AdminRecord =
  | EditableStyle
  | EditableTemplate
  | EditableComponent
  | EditablePrompt;

type ValidationResult = {
  global: string[];
  selected: string[];
};

const statuses: MaintainableStatus[] = ["draft", "reviewing", "approved", "deprecated"];

const tabLabels: Record<AdminTab, string> = {
  styles: "风格包管理",
  templates: "模板管理",
  components: "组件管理",
  prompts: "Prompt 管理",
};

const commonDescription =
  "当前页面只维护浏览器内的临时数据，不会自动写回文件或数据库。请通过右侧导出 JSON 后，再交给开发或数据维护人员保存。";

export function AdminMaintenanceWorkbench({
  initialStyles,
  initialTemplates,
  initialComponents,
  initialPrompts,
}: {
  initialStyles: StylePack[];
  initialTemplates: TemplateItem[];
  initialComponents: ComponentItem[];
  initialPrompts: PromptItem[];
}) {
  const [styles, setStyles] = useState<EditableStyle[]>(
    initialStyles.map((style) => ({
      ...style,
      description: style.description ?? style.scenario,
      status: normalizeStatus(style.status ?? (style.priority === "P0" ? "approved" : "reviewing")),
      version: style.version ?? "2.0.0",
      owner: style.owner ?? "Design Platform Core",
      created_at: style.created_at ?? "2026-06-04",
      updated_at: style.updated_at ?? "2026-06-04",
      tags: style.tags ?? [],
      related_items: {
        templates: getRelatedArray(style.related_items, "templates"),
        prompts: getRelatedArray(style.related_items, "prompts"),
        tokens: getRelatedArray(style.related_items, "tokens"),
        components: getRelatedArray(style.related_items, "components"),
      },
    })),
  );
  const [templates, setTemplates] = useState<EditableTemplate[]>(
    initialTemplates.map((template) => ({
      ...template,
      status: normalizeStatus(template.status),
      tags: template.tags ?? template.ai_tags ?? [],
      related_items: template.related_items ?? {},
      ai_prompt_id: template.ai_prompt_id ?? "",
      suitable_for: template.suitable_for ?? ["企业业务页面"],
      not_suitable_for: template.not_suitable_for ?? ["强品牌营销页面"],
    })),
  );
  const [components, setComponents] = useState<EditableComponent[]>(
    initialComponents.map((component) => ({
      ...component,
      status: normalizeStatus(component.status),
    })),
  );
  const [prompts, setPrompts] = useState<EditablePrompt[]>(
    initialPrompts.map((prompt) => ({
      ...prompt,
      status: normalizeStatus(prompt.status),
    })),
  );

  const [tab, setTab] = useState<AdminTab>("styles");
  const [selectedIds, setSelectedIds] = useState<Record<AdminTab, string>>({
    styles: initialStyles[0]?.id ?? "",
    templates: initialTemplates[0]?.id ?? "",
    components: initialComponents[0]?.id ?? "",
    prompts: initialPrompts[0]?.id ?? "",
  });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [sceneFilter, setSceneFilter] = useState("ALL");
  const [exportText, setExportText] = useState("");
  const [copiedPromptId, setCopiedPromptId] = useState("");

  const selected = getSelectedRecord();

  const validation = validateData({
    tab,
    selected,
    styles,
    templates,
    components,
    prompts,
  });

  const filteredRecords = (() => {
    const normalizedQuery = query.trim().toLowerCase();
    const records = getTabRecords(tab);

    return records.filter((record) => {
      const text = JSON.stringify(record).toLowerCase();
      const matchesQuery = normalizedQuery ? text.includes(normalizedQuery) : true;
      const matchesStatus =
        statusFilter === "ALL" ? true : record.status === statusFilter;

      if (!matchesQuery || !matchesStatus) return false;

      if (tab === "templates") {
        const template = record as EditableTemplate;
        const matchesPlatform =
          platformFilter === "ALL" ? true : template.platform === platformFilter;
        const matchesScene =
          sceneFilter === "ALL" ? true : template.scene === sceneFilter;
        return matchesPlatform && matchesScene;
      }

      return true;
    });
  })();

  const stats = {
    styles: styles.length,
    templates: templates.length,
    components: components.length,
    prompts: prompts.length,
    draft: [...styles, ...templates, ...components, ...prompts].filter(
      (item) => item.status === "draft",
    ).length,
    validationIssues: validation.global.length + validation.selected.length,
  };

  function getTabRecords(activeTab: AdminTab): AdminRecord[] {
    if (activeTab === "styles") return styles;
    if (activeTab === "templates") return templates;
    if (activeTab === "components") return components;
    return prompts;
  }

  function getSelectedRecord() {
    return getTabRecords(tab).find((record) => record.id === selectedIds[tab]);
  }

  function selectRecord(id: string) {
    setSelectedIds((current) => ({ ...current, [tab]: id }));
  }

  function updateSelectedId(nextId: string) {
    setSelectedIds((current) => ({ ...current, [tab]: nextId }));
  }

  function updateStyle(id: string, patch: Partial<EditableStyle>) {
    setStyles((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    if (patch.id) updateSelectedId(patch.id);
  }

  function updateTemplate(id: string, patch: Partial<EditableTemplate>) {
    setTemplates((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    if (patch.id) updateSelectedId(patch.id);
  }

  function updateComponent(id: string, patch: Partial<EditableComponent>) {
    setComponents((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    if (patch.id) updateSelectedId(patch.id);
  }

  function updatePrompt(id: string, patch: Partial<EditablePrompt>) {
    setPrompts((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    if (patch.id) updateSelectedId(patch.id);
  }

  function createTemplateDraft() {
    const id = nextId("tpl-draft", templates.map((item) => item.id));
    const style = styles[0];
    const prompt = prompts.find((item) => item.related_template_id) ?? prompts[0];
    const draft: EditableTemplate = {
      id,
      name: "新模板草稿",
      description: "在 V2 维护后台创建的模板草稿，请补充业务场景、页面结构、组件绑定和资源链接。",
      status: "draft",
      version: "0.1.0",
      owner: "Design Platform Core",
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      tags: ["draft", "template"],
      related_items: {
        style_pack: style?.id ?? "",
        components: [],
        prompts: prompt?.id ? [prompt.id] : [],
      },
      platform: "admin",
      legacy_platform: "web admin",
      type: "admin dashboard",
      scene: "待定义业务场景",
      style_pack_id: style?.id ?? "",
      layout: {
        shell: "enterprise app shell",
        density: "standard",
        navigation: "top nav + left sidebar",
        responsive: "desktop first",
        regions: ["PageHeader", "ContentArea", "ActionPanel"],
      },
      components: [],
      states: ["default", "loading", "empty", "error"],
      figma_url: "https://figma.example.com/file/ui-template-library?node=draft",
      figma_file_url: "https://figma.example.com/file/ui-template-library",
      figma_component_url: "https://figma.example.com/file/ui-template-library?node=draft-components",
      figma_page_url: "https://figma.example.com/file/ui-template-library?node=draft-page",
      figma_last_updated: new Date().toISOString().slice(0, 10),
      figma_owner: "Design Platform Core",
      storybook_url: "https://storybook.example.com/?path=/story/templates-draft",
      code_url: "https://github.com/MarkCeci/ui-template-library/tree/main/templates/draft",
      ai_prompt_id: prompt?.id ?? "",
      ai_prompt: prompt?.prompt_text ?? "请基于当前模板草稿生成一个企业级页面。",
      preview_type: "css-dashboard-cards",
      design_acceptance: {
        follows_style_pack: false,
        uses_standard_components: false,
        includes_empty_state: true,
        includes_error_state: true,
        includes_loading_state: true,
        includes_responsive_notes: true,
        includes_figma_link: true,
      },
      suitable_for: ["企业内部业务页面"],
      not_suitable_for: ["强营销展示页面"],
      ai_tags: ["draft", "template"],
    };

    setTemplates((current) => [draft, ...current]);
    setTab("templates");
    setSelectedIds((current) => ({ ...current, templates: id }));
    setExportText("");
  }

  function createPromptDraft() {
    const id = nextId("prompt-draft", prompts.map((item) => item.id));
    const draft: EditablePrompt = {
      id,
      name: "新 Prompt 草稿",
      description: "在 V2 维护后台创建的 Prompt 草稿。",
      status: "draft",
      version: "0.1.0",
      owner: "Design Platform Core",
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
      tags: ["draft", "prompt"],
      related_items: {},
      prompt_type: "template_generation",
      target_user: "产品、设计、开发和 AI 工具",
      input_variables: ["business_goal", "platform", "page_type"],
      prompt_text: "请基于输入需求生成一个企业级页面方案，包含页面结构、组件清单、状态说明和实现建议。",
      related_template_id: templates[0]?.id ?? null,
      related_style_id: styles[0]?.id ?? null,
    };

    setPrompts((current) => [draft, ...current]);
    setTab("prompts");
    setSelectedIds((current) => ({ ...current, prompts: id }));
    setExportText("");
  }

  async function copyPrompt(prompt: EditablePrompt) {
    await navigator.clipboard.writeText(prompt.prompt_text);
    setCopiedPromptId(prompt.id);
  }

  function exportCurrent() {
    const today = new Date().toISOString();
    const payload = getExportPayload(tab, {
      styles,
      templates,
      components,
      prompts,
      exported_at: today,
    });
    setExportText(JSON.stringify(payload, null, 2));
  }

  const platformOptions = unique(templates.map((item) => item.platform));
  const sceneOptions = unique(templates.map((item) => item.scene));

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
        <h2 className="text-sm font-semibold text-violet-950">V2 维护台说明</h2>
        <p className="mt-2 text-sm leading-6 text-violet-900">{commonDescription}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="风格包" value={stats.styles.toString()} />
        <StatCard label="模板" value={stats.templates.toString()} />
        <StatCard label="组件" value={stats.components.toString()} />
        <StatCard label="Prompt" value={stats.prompts.toString()} />
        <StatCard label="草稿" value={stats.draft.toString()} />
        <StatCard label="校验提示" value={stats.validationIssues.toString()} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-2 rounded-lg bg-slate-100 p-1 md:grid-cols-4">
          {(Object.keys(tabLabels) as AdminTab[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                setExportText("");
              }}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                tab === item ? "bg-white text-violet-800 shadow-sm" : "text-slate-600"
              }`}
            >
              {tabLabels[item]}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_160px_180px_180px]">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            搜索
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索名称、ID、标签、场景..."
              className="h-11 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            />
          </label>
          <SelectField
            label="状态"
            value={statusFilter}
            options={["ALL", ...statuses]}
            onChange={setStatusFilter}
          />
          {tab === "templates" ? (
            <SelectField
              label="平台"
              value={platformFilter}
              options={["ALL", ...platformOptions]}
              onChange={setPlatformFilter}
            />
          ) : (
            <div />
          )}
          {tab === "templates" ? (
            <SelectField
              label="场景"
              value={sceneFilter}
              options={["ALL", ...sceneOptions]}
              onChange={setSceneFilter}
            />
          ) : (
            <div />
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr_360px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">{tabLabels[tab]}</h2>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {filteredRecords.length} 条
            </span>
          </div>
          {tab === "templates" ? (
            <button
              type="button"
              onClick={createTemplateDraft}
              className="mt-4 w-full rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              新增模板草稿
            </button>
          ) : null}
          {tab === "prompts" ? (
            <button
              type="button"
              onClick={createPromptDraft}
              className="mt-4 w-full rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              新增 Prompt
            </button>
          ) : null}

          <div className="mt-4 max-h-[780px] space-y-2 overflow-auto pr-1">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <ListButton
                  key={record.id}
                  active={selected?.id === record.id}
                  title={record.name}
                  subtitle={record.id}
                  meta={`${record.status} / ${record.owner}`}
                  onClick={() => selectRecord(record.id)}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm font-semibold text-slate-950">没有找到匹配数据</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  可以换一个关键词，或清空状态、平台、场景筛选。
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {selected ? (
            <>
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold text-violet-700">
                    {selected.id}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">
                    {selected.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    在这里编辑字段。页面刷新后不会保存，请导出 JSON。
                  </p>
                </div>
                <StatusPill status={selected.status} />
              </div>

              {tab === "styles" ? (
                <StyleEditor
                  item={selected as EditableStyle}
                  templates={templates}
                  onChange={(patch) => updateStyle(selected.id, patch)}
                />
              ) : null}
              {tab === "templates" ? (
                <TemplateEditor
                  item={selected as EditableTemplate}
                  styles={styles}
                  components={components}
                  prompts={prompts}
                  onChange={(patch) => updateTemplate(selected.id, patch)}
                />
              ) : null}
              {tab === "components" ? (
                <ComponentEditor
                  item={selected as EditableComponent}
                  templates={templates}
                  onChange={(patch) => updateComponent(selected.id, patch)}
                />
              ) : null}
              {tab === "prompts" ? (
                <PromptEditor
                  item={selected as EditablePrompt}
                  styles={styles}
                  templates={templates}
                  onChange={(patch) => updatePrompt(selected.id, patch)}
                  onCopy={() => copyPrompt(selected as EditablePrompt)}
                  copied={copiedPromptId === selected.id}
                />
              ) : null}
            </>
          ) : (
            <EmptyPanel text="请选择一条数据开始维护。" />
          )}
        </div>

        <aside className="space-y-5">
          <ValidationPanel validation={validation} />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">导出 JSON</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              当前导出的是「{tabLabels[tab]}」对应的数据文件，不会自动保存到服务器。
            </p>
            <button
              type="button"
              onClick={exportCurrent}
              className="mt-4 w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              导出 {exportFileName(tab)}
            </button>
            {exportText ? (
              <textarea
                value={exportText}
                readOnly
                className="mt-4 h-80 w-full rounded-md border border-slate-300 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100"
              />
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

function StyleEditor({
  item,
  templates,
  onChange,
}: {
  item: EditableStyle;
  templates: EditableTemplate[];
  onChange: (patch: Partial<EditableStyle>) => void;
}) {
  return (
    <div className="mt-6 grid gap-4">
      <Field label="ID" value={item.id} onChange={(value) => onChange({ id: value })} />
      <Field label="风格名称" value={item.name} onChange={(value) => onChange({ name: value })} />
      <SelectField label="审核状态" value={item.status} options={statuses} onChange={(value) => onChange({ status: normalizeStatus(value) })} />
      <Field label="版本" value={item.version} onChange={(value) => onChange({ version: value })} />
      <Field label="维护人" value={item.owner} onChange={(value) => onChange({ owner: value })} />
      <Field label="分类" value={item.category} onChange={(value) => onChange({ category: value })} />
      <Area label="适用场景" value={item.scenario} onChange={(value) => onChange({ scenario: value, description: value })} />
      <Area label="视觉识别" value={item.visual} onChange={(value) => onChange({ visual: value })} />
      <Field label="Token modes" value={item.tokens} onChange={(value) => onChange({ tokens: value })} />
      <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
        <h3 className="text-sm font-semibold text-violet-950">Figma 链接管理</h3>
        <div className="mt-4 grid gap-4">
          <Field label="figma_file_url" value={item.figma_file_url ?? ""} onChange={(value) => onChange({ figma_file_url: value })} />
          <Field label="figma_component_url" value={item.figma_component_url ?? ""} onChange={(value) => onChange({ figma_component_url: value })} />
          <Field label="figma_page_url" value={item.figma_page_url ?? ""} onChange={(value) => onChange({ figma_page_url: value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="figma_last_updated" value={item.figma_last_updated ?? ""} onChange={(value) => onChange({ figma_last_updated: value })} />
            <Field label="figma_owner" value={item.figma_owner ?? ""} onChange={(value) => onChange({ figma_owner: value })} />
          </div>
        </div>
      </div>
      <Area label="标签，用逗号分隔" value={item.tags.join(", ")} onChange={(value) => onChange({ tags: splitList(value) })} />
      <Area
        label="推荐模板 ID，用逗号分隔"
        value={(item.related_items.templates ?? []).join(", ")}
        helper={`可选模板：${templates.slice(0, 5).map((template) => template.id).join("、")}...`}
        onChange={(value) =>
          onChange({
            related_items: {
              ...item.related_items,
              templates: splitList(value),
            },
          })
        }
      />
    </div>
  );
}

function TemplateEditor({
  item,
  styles,
  components,
  prompts,
  onChange,
}: {
  item: EditableTemplate;
  styles: EditableStyle[];
  components: EditableComponent[];
  prompts: EditablePrompt[];
  onChange: (patch: Partial<EditableTemplate>) => void;
}) {
  const selectedPrompt = prompts.find((prompt) => prompt.id === item.ai_prompt_id);

  return (
    <div className="mt-6 grid gap-4">
      <Field label="ID" value={item.id} onChange={(value) => onChange({ id: value })} />
      <Field label="模板名称" value={item.name} onChange={(value) => onChange({ name: value })} />
      <Area label="模板说明" value={item.description} onChange={(value) => onChange({ description: value })} />
      <SelectField label="审核状态" value={item.status} options={statuses} onChange={(value) => onChange({ status: normalizeStatus(value) })} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="平台" value={item.platform} onChange={(value) => onChange({ platform: value })} />
        <Field label="场景" value={item.scene} onChange={(value) => onChange({ scene: value })} />
      </div>
      <Field label="模板类型" value={item.type} onChange={(value) => onChange({ type: value })} />
      <SelectField
        label="绑定风格包"
        value={item.style_pack_id}
        options={styles.map((style) => style.id)}
        onChange={(value) => onChange({ style_pack_id: value })}
      />
      <Area
        label="绑定组件，用逗号分隔"
        helper={`组件目录示例：${components.slice(0, 6).map((component) => component.name).join("、")}`}
        value={item.components.join(", ")}
        onChange={(value) => onChange({ components: splitList(value) })}
      />
      <SelectField
        label="绑定 Prompt"
        value={item.ai_prompt_id}
        options={prompts.map((prompt) => prompt.id)}
        onChange={(value) =>
          onChange({
            ai_prompt_id: value,
            ai_prompt: prompts.find((prompt) => prompt.id === value)?.prompt_text ?? item.ai_prompt,
          })
        }
      />
      {selectedPrompt ? (
        <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          已绑定：{selectedPrompt.name}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="布局外壳" value={item.layout.shell} onChange={(value) => onChange({ layout: { ...item.layout, shell: value } })} />
        <Field label="信息密度" value={item.layout.density} onChange={(value) => onChange({ layout: { ...item.layout, density: value } })} />
        <Field label="导航方式" value={item.layout.navigation} onChange={(value) => onChange({ layout: { ...item.layout, navigation: value } })} />
        <Field label="响应式策略" value={item.layout.responsive} onChange={(value) => onChange({ layout: { ...item.layout, responsive: value } })} />
      </div>
      <Area label="页面区域，用逗号分隔" value={item.layout.regions.join(", ")} onChange={(value) => onChange({ layout: { ...item.layout, regions: splitList(value) } })} />
      <Area label="状态，用逗号分隔" value={item.states.join(", ")} onChange={(value) => onChange({ states: splitList(value) })} />
      <Field label="预览类型" value={item.preview_type} onChange={(value) => onChange({ preview_type: value })} />
      <Field label="Figma 链接" value={item.figma_url} onChange={(value) => onChange({ figma_url: value })} />
      <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
        <h3 className="text-sm font-semibold text-violet-950">Figma 链接管理</h3>
        <div className="mt-4 grid gap-4">
          <Field label="figma_file_url" value={item.figma_file_url ?? ""} onChange={(value) => onChange({ figma_file_url: value })} />
          <Field label="figma_component_url" value={item.figma_component_url ?? ""} onChange={(value) => onChange({ figma_component_url: value })} />
          <Field label="figma_page_url" value={item.figma_page_url ?? ""} onChange={(value) => onChange({ figma_page_url: value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="figma_last_updated" value={item.figma_last_updated ?? ""} onChange={(value) => onChange({ figma_last_updated: value })} />
            <Field label="figma_owner" value={item.figma_owner ?? ""} onChange={(value) => onChange({ figma_owner: value })} />
          </div>
        </div>
      </div>
      <Field label="Storybook 链接" value={item.storybook_url} onChange={(value) => onChange({ storybook_url: value })} />
      <Field label="Code 链接" value={item.code_url} onChange={(value) => onChange({ code_url: value })} />
      <DesignAcceptanceEditor item={item} onChange={onChange} />
      <Area label="适用场景，用逗号分隔" value={item.suitable_for.join(", ")} onChange={(value) => onChange({ suitable_for: splitList(value) })} />
      <Area label="不适用场景，用逗号分隔" value={item.not_suitable_for.join(", ")} onChange={(value) => onChange({ not_suitable_for: splitList(value) })} />
      <Area label="标签，用逗号分隔" value={item.tags.join(", ")} onChange={(value) => onChange({ tags: splitList(value), ai_tags: splitList(value) })} />
    </div>
  );
}

function DesignAcceptanceEditor({
  item,
  onChange,
}: {
  item: EditableTemplate;
  onChange: (patch: Partial<EditableTemplate>) => void;
}) {
  const acceptance = item.design_acceptance ?? {
    follows_style_pack: false,
    uses_standard_components: false,
    includes_empty_state: false,
    includes_error_state: false,
    includes_loading_state: false,
    includes_responsive_notes: false,
    includes_figma_link: Boolean(item.figma_url),
  };

  function updateAcceptance(
    key: keyof NonNullable<EditableTemplate["design_acceptance"]>,
    value: boolean,
  ) {
    onChange({
      design_acceptance: {
        ...acceptance,
        [key]: value,
      },
    });
  }

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
      <h3 className="text-sm font-semibold text-emerald-950">设计验收清单</h3>
      <p className="mt-2 text-sm leading-6 text-emerald-900">
        设计师交付模板前，请逐项确认这些内容是否已经覆盖。
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <BooleanSelect
          label="是否符合当前风格包"
          value={acceptance.follows_style_pack}
          onChange={(value) => updateAcceptance("follows_style_pack", value)}
        />
        <BooleanSelect
          label="是否使用标准组件"
          value={acceptance.uses_standard_components}
          onChange={(value) => updateAcceptance("uses_standard_components", value)}
        />
        <BooleanSelect
          label="是否包含空状态"
          value={acceptance.includes_empty_state}
          onChange={(value) => updateAcceptance("includes_empty_state", value)}
        />
        <BooleanSelect
          label="是否包含错误状态"
          value={acceptance.includes_error_state}
          onChange={(value) => updateAcceptance("includes_error_state", value)}
        />
        <BooleanSelect
          label="是否包含加载状态"
          value={acceptance.includes_loading_state}
          onChange={(value) => updateAcceptance("includes_loading_state", value)}
        />
        <BooleanSelect
          label="是否包含移动端适配说明"
          value={acceptance.includes_responsive_notes}
          onChange={(value) => updateAcceptance("includes_responsive_notes", value)}
        />
        <BooleanSelect
          label="是否包含 Figma 链接"
          value={acceptance.includes_figma_link}
          onChange={(value) => updateAcceptance("includes_figma_link", value)}
        />
      </div>
    </div>
  );
}

function ComponentEditor({
  item,
  templates,
  onChange,
}: {
  item: EditableComponent;
  templates: EditableTemplate[];
  onChange: (patch: Partial<EditableComponent>) => void;
}) {
  return (
    <div className="mt-6 grid gap-4">
      <Field label="ID" value={item.id} onChange={(value) => onChange({ id: value })} />
      <Field label="组件名称" value={item.name} onChange={(value) => onChange({ name: value })} />
      <Area label="组件用途" value={item.description} onChange={(value) => onChange({ description: value })} />
      <SelectField label="审核状态" value={item.status} options={statuses} onChange={(value) => onChange({ status: normalizeStatus(value) })} />
      <Field label="分类" value={item.category} onChange={(value) => onChange({ category: value })} />
      <Area label="变体，用逗号分隔" value={item.variants.join(", ")} onChange={(value) => onChange({ variants: splitList(value) })} />
      <Area label="状态，用逗号分隔" value={item.states.join(", ")} onChange={(value) => onChange({ states: splitList(value) })} />
      <Area label="Design Tokens，用逗号分隔" value={item.design_tokens.join(", ")} onChange={(value) => onChange({ design_tokens: splitList(value) })} />
      <Field label="Figma 链接" value={item.figma_url} onChange={(value) => onChange({ figma_url: value })} />
      <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
        <h3 className="text-sm font-semibold text-violet-950">Figma 链接管理</h3>
        <div className="mt-4 grid gap-4">
          <Field label="figma_file_url" value={item.figma_file_url ?? ""} onChange={(value) => onChange({ figma_file_url: value })} />
          <Field label="figma_component_url" value={item.figma_component_url ?? ""} onChange={(value) => onChange({ figma_component_url: value })} />
          <Field label="figma_page_url" value={item.figma_page_url ?? ""} onChange={(value) => onChange({ figma_page_url: value })} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="figma_last_updated" value={item.figma_last_updated ?? ""} onChange={(value) => onChange({ figma_last_updated: value })} />
            <Field label="figma_owner" value={item.figma_owner ?? ""} onChange={(value) => onChange({ figma_owner: value })} />
          </div>
        </div>
      </div>
      <Field label="Storybook 链接" value={item.storybook_url} onChange={(value) => onChange({ storybook_url: value })} />
      <Field label="Code 链接" value={item.code_url} onChange={(value) => onChange({ code_url: value })} />
      <Area
        label="被哪些模板使用，用逗号分隔"
        helper={`模板示例：${templates.slice(0, 4).map((template) => template.id).join("、")}`}
        value={item.used_by_templates.join(", ")}
        onChange={(value) => onChange({ used_by_templates: splitList(value) })}
      />
    </div>
  );
}

function PromptEditor({
  item,
  styles,
  templates,
  copied,
  onChange,
  onCopy,
}: {
  item: EditablePrompt;
  styles: EditableStyle[];
  templates: EditableTemplate[];
  copied: boolean;
  onChange: (patch: Partial<EditablePrompt>) => void;
  onCopy: () => void;
}) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {copied ? "已复制 Prompt" : "复制 Prompt"}
        </button>
      </div>
      <Field label="ID" value={item.id} onChange={(value) => onChange({ id: value })} />
      <Field label="Prompt 名称" value={item.name} onChange={(value) => onChange({ name: value })} />
      <Area label="Prompt 说明" value={item.description} onChange={(value) => onChange({ description: value })} />
      <SelectField label="审核状态" value={item.status} options={statuses} onChange={(value) => onChange({ status: normalizeStatus(value) })} />
      <Field label="Prompt 类型" value={item.prompt_type} onChange={(value) => onChange({ prompt_type: value })} />
      <Field label="目标用户" value={item.target_user} onChange={(value) => onChange({ target_user: value })} />
      <Area label="输入变量，用逗号分隔" value={item.input_variables.join(", ")} onChange={(value) => onChange({ input_variables: splitList(value) })} />
      <SelectField
        label="绑定风格，可为空"
        value={item.related_style_id ?? ""}
        options={["", ...styles.map((style) => style.id)]}
        onChange={(value) => onChange({ related_style_id: value || null })}
      />
      <SelectField
        label="绑定模板，可为空"
        value={item.related_template_id ?? ""}
        options={["", ...templates.map((template) => template.id)]}
        onChange={(value) => onChange({ related_template_id: value || null })}
      />
      <Area label="标签，用逗号分隔" value={item.tags.join(", ")} onChange={(value) => onChange({ tags: splitList(value) })} />
      <Area label="Prompt 正文" value={item.prompt_text} rows={12} onChange={(value) => onChange({ prompt_text: value })} />
    </div>
  );
}

function ValidationPanel({ validation }: { validation: ValidationResult }) {
  const issues = [...validation.selected, ...validation.global];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">基础校验</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        检查必填、重复 ID、绑定关系和 URL 格式。这里是前端校验，导出前先看一眼。
      </p>
      {issues.length === 0 ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          当前数据未发现明显问题
        </div>
      ) : (
        <div className="mt-4 max-h-72 space-y-2 overflow-auto">
          {issues.slice(0, 24).map((issue) => (
            <p key={issue} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
              {issue}
            </p>
          ))}
          {issues.length > 24 ? (
            <p className="text-xs text-slate-500">还有 {issues.length - 24} 条提示未展示。</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  helper,
  onChange,
}: {
  label: string;
  value: string;
  helper?: string;
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
      {helper ? <span className="text-xs font-normal leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}

function Area({
  label,
  value,
  helper,
  rows = 4,
  onChange,
}: {
  label: string;
  value: string;
  helper?: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal leading-6 text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      />
      {helper ? <span className="text-xs font-normal leading-5 text-slate-500">{helper}</span> : null}
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
          <option key={option || "empty"} value={option}>
            {option || "不绑定"}
          </option>
        ))}
      </select>
    </label>
  );
}

function BooleanSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select
        value={value ? "true" : "false"}
        onChange={(event) => onChange(event.target.value === "true")}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      >
        <option value="true">已完成</option>
        <option value="false">待补齐</option>
      </select>
    </label>
  );
}

function ListButton({
  active,
  title,
  subtitle,
  meta,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  meta: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left transition ${
        active
          ? "border-violet-200 bg-violet-50"
          : "border-slate-200 bg-slate-50 hover:border-violet-100 hover:bg-violet-50"
      }`}
    >
      <p className="line-clamp-1 text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-1 font-mono text-[11px] text-slate-400">{subtitle}</p>
      <p className="mt-2 line-clamp-1 text-xs text-slate-500">{meta}</p>
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "approved"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "deprecated"
        ? "border-slate-300 bg-slate-100 text-slate-600"
        : status === "draft"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-violet-200 bg-violet-50 text-violet-700";

  return (
    <span className={`w-fit rounded-md border px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {status}
    </span>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}

function validateData({
  tab,
  selected,
  styles,
  templates,
  components,
  prompts,
}: {
  tab: AdminTab;
  selected?: AdminRecord;
  styles: EditableStyle[];
  templates: EditableTemplate[];
  components: EditableComponent[];
  prompts: EditablePrompt[];
}): ValidationResult {
  const global: string[] = [];
  const selectedIssues: string[] = [];

  checkDuplicateIds("风格包", styles, global);
  checkDuplicateIds("模板", templates, global);
  checkDuplicateIds("组件", components, global);
  checkDuplicateIds("Prompt", prompts, global);

  const styleIds = new Set(styles.map((item) => item.id));
  const templateIds = new Set(templates.map((item) => item.id));
  const componentIds = new Set(components.map((item) => item.id));
  const componentNames = new Set(components.map((item) => item.name.toLowerCase()));
  const promptIds = new Set(prompts.map((item) => item.id));

  if (selected) {
    validateCommon(selected, selectedIssues);
  }

  if (tab === "styles" && selected) {
    const style = selected as EditableStyle;
    requireValue("适用场景", style.scenario, selectedIssues);
    requireValue("视觉识别", style.visual, selectedIssues);
    requireValue("Token modes", style.tokens, selectedIssues);
    validateUrl("figma_file_url", style.figma_file_url ?? "", selectedIssues);
    validateUrl("figma_component_url", style.figma_component_url ?? "", selectedIssues);
    validateUrl("figma_page_url", style.figma_page_url ?? "", selectedIssues);
    requireValue("figma_last_updated", style.figma_last_updated ?? "", selectedIssues);
    requireValue("figma_owner", style.figma_owner ?? "", selectedIssues);
    for (const templateId of style.related_items.templates ?? []) {
      if (!templateIds.has(templateId)) {
        selectedIssues.push(`推荐模板不存在：${templateId}`);
      }
    }
  }

  if (tab === "templates" && selected) {
    const template = selected as EditableTemplate;
    requireValue("平台", template.platform, selectedIssues);
    requireValue("场景", template.scene, selectedIssues);
    requireArray("组件", template.components, selectedIssues);
    requireArray("页面状态", template.states, selectedIssues);
    requireArray("适用场景", template.suitable_for, selectedIssues);
    requireArray("不适用场景", template.not_suitable_for, selectedIssues);
    if (!styleIds.has(template.style_pack_id)) selectedIssues.push(`绑定风格包不存在：${template.style_pack_id}`);
    if (!promptIds.has(template.ai_prompt_id)) selectedIssues.push(`绑定 Prompt 不存在：${template.ai_prompt_id}`);
    for (const component of template.components) {
      const normalized = component.toLowerCase();
      if (!componentIds.has(component) && !componentNames.has(normalized)) {
        selectedIssues.push(`绑定组件不在组件目录中：${component}`);
      }
    }
    validateUrl("Figma 链接", template.figma_url, selectedIssues);
    validateUrl("figma_file_url", template.figma_file_url ?? "", selectedIssues);
    validateUrl("figma_component_url", template.figma_component_url ?? "", selectedIssues);
    validateUrl("figma_page_url", template.figma_page_url ?? "", selectedIssues);
    requireValue("figma_last_updated", template.figma_last_updated ?? "", selectedIssues);
    requireValue("figma_owner", template.figma_owner ?? "", selectedIssues);
    validateUrl("Storybook 链接", template.storybook_url, selectedIssues);
    validateUrl("Code 链接", template.code_url, selectedIssues);
  }

  if (tab === "components" && selected) {
    const component = selected as EditableComponent;
    requireValue("组件分类", component.category, selectedIssues);
    requireArray("组件变体", component.variants, selectedIssues);
    requireArray("组件状态", component.states, selectedIssues);
    requireArray("Design Tokens", component.design_tokens, selectedIssues);
    for (const templateId of component.used_by_templates) {
      if (!templateIds.has(templateId)) selectedIssues.push(`组件引用的模板不存在：${templateId}`);
    }
    validateUrl("Figma 链接", component.figma_url, selectedIssues);
    validateUrl("figma_file_url", component.figma_file_url ?? "", selectedIssues);
    validateUrl("figma_component_url", component.figma_component_url ?? "", selectedIssues);
    validateUrl("figma_page_url", component.figma_page_url ?? "", selectedIssues);
    requireValue("figma_last_updated", component.figma_last_updated ?? "", selectedIssues);
    requireValue("figma_owner", component.figma_owner ?? "", selectedIssues);
    validateUrl("Storybook 链接", component.storybook_url, selectedIssues);
    validateUrl("Code 链接", component.code_url, selectedIssues);
  }

  if (tab === "prompts" && selected) {
    const prompt = selected as EditablePrompt;
    requireValue("Prompt 类型", prompt.prompt_type, selectedIssues);
    requireValue("目标用户", prompt.target_user, selectedIssues);
    requireArray("输入变量", prompt.input_variables, selectedIssues);
    requireValue("Prompt 正文", prompt.prompt_text, selectedIssues);
    if (prompt.related_style_id && !styleIds.has(prompt.related_style_id)) {
      selectedIssues.push(`绑定风格不存在：${prompt.related_style_id}`);
    }
    if (prompt.related_template_id && !templateIds.has(prompt.related_template_id)) {
      selectedIssues.push(`绑定模板不存在：${prompt.related_template_id}`);
    }
  }

  return { global, selected: selectedIssues };
}

function validateCommon(record: AdminRecord, issues: string[]) {
  requireValue("ID", record.id, issues);
  requireValue("名称", record.name, issues);
  requireValue("描述", record.description, issues);
  requireValue("状态", record.status, issues);
  requireValue("版本", record.version, issues);
  requireValue("维护人", record.owner, issues);
  requireArray("标签", record.tags, issues);
}

function checkDuplicateIds(label: string, records: AdminRecord[], issues: string[]) {
  const seen = new Set<string>();
  for (const record of records) {
    if (seen.has(record.id)) issues.push(`${label} ID 重复：${record.id}`);
    seen.add(record.id);
  }
}

function requireValue(label: string, value: unknown, issues: string[]) {
  if (typeof value !== "string" || value.trim() === "") {
    issues.push(`${label} 不能为空`);
  }
}

function requireArray(label: string, value: unknown, issues: string[]) {
  if (!Array.isArray(value) || value.length === 0) {
    issues.push(`${label} 至少需要 1 项`);
  }
}

function validateUrl(label: string, value: string, issues: string[]) {
  if (!/^https?:\/\/.+/i.test(value)) {
    issues.push(`${label} 不是有效 URL`);
  }
}

function getExportPayload(
  tab: AdminTab,
  payload: {
    styles: EditableStyle[];
    templates: EditableTemplate[];
    components: EditableComponent[];
    prompts: EditablePrompt[];
    exported_at: string;
  },
) {
  const base = {
    version: "2.0.0",
    schema_version: "2.0.0",
    generated_at: payload.exported_at.slice(0, 10),
  };

  if (tab === "styles") {
    return { ...base, description: "V2 normalized style pack catalog.", styles: payload.styles };
  }
  if (tab === "templates") {
    return { ...base, description: "V2 normalized template catalog.", templates: payload.templates };
  }
  if (tab === "components") {
    return { ...base, description: "V2 normalized component catalog.", components: payload.components };
  }
  return { ...base, description: "V2 prompt catalog.", prompts: payload.prompts };
}

function exportFileName(tab: AdminTab) {
  if (tab === "styles") return "styles.json";
  if (tab === "templates") return "templates.json";
  if (tab === "components") return "components.json";
  return "prompts.json";
}

function normalizeStatus(status: string): MaintainableStatus {
  if (status === "ready") return "approved";
  if (status === "sample") return "reviewing";
  if (statuses.includes(status as MaintainableStatus)) return status as MaintainableStatus;
  return "draft";
}

function splitList(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean))).sort();
}

function getRelatedArray(value: unknown, key: string) {
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  return Array.isArray(record[key]) ? (record[key] as string[]) : [];
}

function nextId(prefix: string, existingIds: string[]) {
  let index = existingIds.length + 1;
  let candidate = `${prefix}-${String(index).padStart(3, "0")}`;
  while (existingIds.includes(candidate)) {
    index += 1;
    candidate = `${prefix}-${String(index).padStart(3, "0")}`;
  }
  return candidate;
}
