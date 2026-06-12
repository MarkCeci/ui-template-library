import Link from "next/link";
import { CoverPreview } from "@/components/cover-preview";
import { PageShell } from "@/components/page-shell";
import { components, templates, type ComponentItem } from "@/lib/catalog";

const categories = Array.from(new Set(components.map((item) => item.category))).sort();

export default async function ComponentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ component?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const selectedComponent = params?.component?.toLowerCase();
  const storybookReady = components.filter((item) => item.storybook_url).length;
  const codeReady = components.filter((item) => item.code_url).length;

  return (
    <PageShell
      eyebrow="Components"
      title="组件文档入口"
      description="这里是开发者查组件的入口：按分类查看组件状态、变体、依赖 Token、Storybook、Code，以及它被哪些模板使用。设计以 Figma 为源，开发以 Storybook 和代码为准。"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href="/developer"
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
          >
            开发者入口
          </Link>
          <a
            href="https://storybook.example.com/?path=/docs/components-overview"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            打开 Storybook
          </a>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-4">
        <OverviewCard label="基础组件" value={components.length.toString()} />
        <OverviewCard label="组件分类" value={categories.length.toString()} />
        <OverviewCard label="Storybook" value={`${storybookReady}/${components.length}`} />
        <OverviewCard label="Code" value={`${codeReady}/${components.length}`} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">核心组件状态预览</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              下面不是最终组件实现，而是帮助开发快速理解常见状态和变体，真实代码以 Storybook / Code 链接为准。
            </p>
          </div>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            Preview Board
          </span>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <CoverPreview preset="component-board" />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-950">组件状态板缩略封面</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                用于后续组件类模板的封面预设，展示 Button、Input、Table、Modal 等核心状态。
              </p>
            </div>
          </div>
          <ButtonPreview />
          <InputPreview />
          <TablePreview />
          <ModalPreview />
          <CardPreview />
          <EmptyPreview />
        </div>
      </section>

      <section className="grid gap-5">
        {categories.map((category) => {
          const categoryComponents = components.filter((item) => item.category === category);

          return (
            <div key={category} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{category}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {categoryComponents.length} 个组件
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {categoryComponents.map((item) => (
                  <ComponentDocCard
                    key={item.id}
                    item={item}
                    selected={isSelected(item, selectedComponent)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Storybook 预留区域</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            真实接入后，这里可以嵌入 Storybook iframe，用于查看组件代码示例、属性说明和交互状态。
          </p>
          <div className="mt-5 grid min-h-72 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div>
              <p className="text-sm font-semibold text-slate-950">Storybook iframe placeholder</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                当前 MVP 使用占位链接。后续接入真实 Storybook 地址后，可在这里直接预览组件。
              </p>
              <a
                href="https://storybook.example.com/?path=/docs/components-overview"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                跳转到 Storybook
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-50 p-6">
          <h2 className="text-lg font-semibold text-violet-950">开发使用说明</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-violet-900">
            <p>1. 先看组件用途、状态和变体，确认是否满足当前模板。</p>
            <p>2. 查看 design_tokens，避免页面里临时写一套样式。</p>
            <p>3. 点击 Storybook 看真实交互状态，点击 Code 找实现目录。</p>
            <p>4. used_by_templates 可帮助你找到组件在模板里的使用场景。</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function OverviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function ComponentDocCard({
  item,
  selected,
}: {
  item: ComponentItem;
  selected: boolean;
}) {
  const usedTemplates = item.used_by_templates
    .map((templateId) => templates.find((template) => template.id === templateId))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <article
      className={`rounded-lg border p-5 transition ${
        selected
          ? "border-violet-300 bg-violet-50 shadow-sm"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold text-slate-400">{item.id}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">{item.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
        </div>
        <StatusPill status={item.status} />
      </div>

      <DocField label="状态" items={item.states} />
      <DocField label="变体" items={item.variants} />
      <DocField label="依赖 Token" items={item.design_tokens} />

      <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
        <ResourceLink label="Storybook" href={item.storybook_url} />
        <ResourceLink label="Code" href={item.code_url} />
        <ResourceLink label="Figma" href={item.figma_component_url ?? item.figma_url} />
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          被哪些模板使用
        </p>
        <div className="mt-2 grid gap-2">
          {usedTemplates.length ? (
            usedTemplates.map((template) =>
              template ? (
                <Link
                  key={template.id}
                  href={`/templates/${template.id}`}
                  className="rounded-md bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:text-violet-700"
                >
                  {template.name}
                </Link>
              ) : null,
            )
          ) : (
            <span className="rounded-md bg-white px-2.5 py-2 text-xs text-slate-400 ring-1 ring-slate-200">
              暂未绑定模板
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: string }) {
  const approved = status === "approved";

  return (
    <span
      className={`shrink-0 rounded-md border px-2 py-1 text-xs font-semibold ${
        approved
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-violet-200 bg-violet-50 text-violet-700"
      }`}
    >
      {status}
    </span>
  );
}

function ResourceLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      {label}
    </a>
  );
}

function DocField({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-white px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function isSelected(item: ComponentItem, selectedComponent?: string) {
  if (!selectedComponent) return false;
  const selected = selectedComponent.toLowerCase();

  return (
    item.name.toLowerCase() === selected ||
    item.id.toLowerCase() === selected ||
    item.tags.some((tag) => tag.toLowerCase() === selected)
  );
}

function PreviewFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        {children}
      </div>
    </div>
  );
}

function ButtonPreview() {
  return (
    <PreviewFrame title="Button">
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-md bg-violet-700 px-4 py-2 text-sm font-semibold text-white">
          Primary
        </button>
        <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          Secondary
        </button>
        <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white">
          Danger
        </button>
        <button className="rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400">
          Disabled
        </button>
      </div>
    </PreviewFrame>
  );
}

function InputPreview() {
  return (
    <PreviewFrame title="Input">
      <div className="grid gap-3">
        <input
          className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none"
          value="默认输入内容"
          readOnly
        />
        <input
          className="h-10 rounded-md border border-violet-500 px-3 text-sm outline-none ring-4 ring-violet-100"
          value="聚焦状态"
          readOnly
        />
        <div>
          <input
            className="h-10 w-full rounded-md border border-red-300 px-3 text-sm outline-none"
            value="错误内容"
            readOnly
          />
          <p className="mt-1 text-xs text-red-600">字段格式不正确</p>
        </div>
      </div>
    </PreviewFrame>
  );
}

function TablePreview() {
  return (
    <PreviewFrame title="Table">
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="grid grid-cols-[1.2fr_1fr_0.7fr] bg-slate-100 px-3 py-3 text-xs font-semibold text-slate-500">
          <span>名称</span>
          <span>负责人</span>
          <span>状态</span>
        </div>
        {["客户线索", "订单审核", "资源配置"].map((item, index) => (
          <div
            key={item}
            className="grid grid-cols-[1.2fr_1fr_0.7fr] border-t border-slate-100 px-3 py-3 text-sm text-slate-700"
          >
            <span>{item}</span>
            <span>Owner {index + 1}</span>
            <span className="w-fit rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
              ready
            </span>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

function ModalPreview() {
  return (
    <PreviewFrame title="Modal">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="h-5 w-40 rounded-full bg-slate-300" />
        <div className="mt-4 grid gap-2">
          <div className="h-3 rounded-full bg-slate-100" />
          <div className="h-3 w-4/5 rounded-full bg-slate-100" />
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <div className="h-9 w-20 rounded-md border border-slate-200 bg-white" />
          <div className="h-9 w-20 rounded-md bg-violet-700" />
        </div>
      </div>
    </PreviewFrame>
  );
}

function CardPreview() {
  return (
    <PreviewFrame title="Card">
      <div className="grid gap-3 sm:grid-cols-3">
        {[72, 48, 96].map((value) => (
          <div key={value} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="h-3 w-20 rounded-full bg-slate-200" />
            <p className="mt-4 text-2xl font-semibold text-slate-950">{value}%</p>
            <div className="mt-3 h-2 rounded-full bg-violet-100">
              <div className="h-2 rounded-full bg-violet-600" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

function EmptyPreview() {
  return (
    <PreviewFrame title="Empty">
      <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
        <div className="h-14 w-14 rounded-2xl bg-violet-100" />
        <p className="mt-4 text-sm font-semibold text-slate-950">暂无数据</p>
        <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
          可以调整筛选条件，或创建第一条业务记录。
        </p>
        <button className="mt-4 rounded-md bg-violet-700 px-3 py-2 text-xs font-semibold text-white">
          新建记录
        </button>
      </div>
    </PreviewFrame>
  );
}
