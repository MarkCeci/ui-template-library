import Link from "next/link";
import { CopyAction } from "@/components/copy-action";
import { PageShell } from "@/components/page-shell";
import { components, templates } from "@/lib/catalog";

const structure = [
  ["app/", "页面路由目录，新增页面通常从这里开始。"],
  ["components/", "可复用 UI、业务组件和交互组件。"],
  ["data/", "风格、模板、组件、Prompt、Token 等 JSON 数据。"],
  ["lib/catalog.ts", "统一读取 JSON，并导出页面需要的数据类型和查询方法。"],
  ["scripts/validate-data.mjs", "数据校验脚本，新增模板或组件后先跑它。"],
];

const usageSteps = [
  "先在 /templates 找到最接近业务场景的模板。",
  "进入模板详情页，复制模板 ID、页面结构、组件清单和开发 Prompt。",
  "在 /components 找到组件的 Storybook、Code、Token 和使用模板。",
  "按模板的 layout 拆页面区域，先搭页面骨架，再接真实 API。",
  "补齐 default、loading、empty、error、permission-denied 等状态。",
  "提交前运行 lint、数据校验和 build。",
];

const submitSteps = [
  "新增模板：先在 /admin 创建模板草稿，导出 JSON 后维护到 data/templates.json。",
  "新增组件：补充 data/components.json，至少包含状态、变体、Token、Storybook 和 Code 链接。",
  "新增页面：在 app/ 下创建路由，并从 lib/catalog.ts 读取数据。",
  "补充说明：README、组件文档或模板详情中写清楚使用边界。",
  "检查通过：运行 npm run validate:data、npm run lint、npm run build。",
];

export default function DeveloperPage() {
  const recommendedTemplates = templates.slice(0, 4);
  const coreComponents = components.slice(0, 6);

  return (
    <PageShell
      eyebrow="Developer"
      title="开发者使用入口"
      description="这页帮助前端同事从模板库进入真实开发：理解项目结构、查模板、找组件、复制代码入口、接 Storybook，并知道如何提交新模板或新组件。"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href="/templates"
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
          >
            查看模板库
          </Link>
          <Link
            href="/developer/theme-usage"
            className="inline-flex rounded-md border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
          >
            主题接入说明
          </Link>
          <Link
            href="/components"
            className="inline-flex rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            查看组件
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="模板" value={templates.length.toString()} />
        <Metric label="组件" value={components.length.toString()} />
        <Metric label="Storybook 入口" value="已预留" />
        <Metric label="数据库" value="暂未接入" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
            Project Structure
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">项目结构说明</h2>
          <div className="mt-5 grid gap-3">
            {structure.map(([path, description]) => (
              <div key={path} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="font-mono text-sm font-semibold text-slate-950">{path}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-50 p-6">
          <h2 className="text-lg font-semibold text-violet-950">常用命令</h2>
          <div className="mt-4 grid gap-3">
            <CommandBlock command="npm run dev" description="本地预览开发环境。" />
            <CommandBlock command="npm run validate:data" description="检查 JSON 数据字段和关联关系。" />
            <CommandBlock command="npm run lint" description="检查代码规范。" />
            <CommandBlock command="npm run build" description="确认可以部署到 Vercel。" />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
          Template Workflow
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">如何根据模板创建页面</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {usageSteps.map((step, index) => (
            <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-violet-700">
                Step {index + 1}
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-700">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">推荐从这些模板开始</h2>
          <div className="mt-5 grid gap-3">
            {recommendedTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-200 hover:bg-violet-50"
              >
                <p className="text-sm font-semibold text-slate-950">{template.name}</p>
                <p className="mt-1 font-mono text-xs text-slate-400">{template.id}</p>
                <p className="mt-2 text-sm text-slate-500">{template.type} / {template.platform}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">如何查找组件</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            组件页面会显示分类、状态、变体、依赖 Token、Storybook、Code，以及被哪些模板使用。
          </p>
          <div className="mt-5 grid gap-3">
            {coreComponents.map((component) => (
              <Link
                key={component.id}
                href={`/components?component=${encodeURIComponent(component.name)}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-200 hover:bg-violet-50"
              >
                <p className="text-sm font-semibold text-slate-950">{component.name}</p>
                <p className="mt-1 text-xs text-slate-500">{component.category} / {component.status}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Storybook 和代码入口</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            第一版先使用占位链接。真实接入后，组件页和模板详情页会跳到具体 Storybook 示例和代码目录。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="https://storybook.example.com/?path=/docs/components-overview"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white"
            >
              打开 Storybook
            </a>
            <a
              href="https://github.com/MarkCeci/ui-template-library"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              查看代码仓库
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">如何提交新组件或模板</h2>
          <div className="mt-5 grid gap-3">
            {submitSteps.map((step) => (
              <p key={step} className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                {step}
              </p>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function CommandBlock({
  command,
  description,
}: {
  command: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <code className="text-sm font-semibold text-slate-950">{command}</code>
        <CopyAction label="复制" value={command} tone="outline" />
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
