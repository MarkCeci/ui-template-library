import Link from "next/link";
import { CopyAction } from "@/components/copy-action";
import { PageShell } from "@/components/page-shell";

const steps = [
  {
    title: "1. 选择风格",
    description: "进入风格广场，选择项目需要的视觉方向。每个风格详情页都有开发接入区。",
  },
  {
    title: "2. 复制主题代码",
    description: "第一版推荐复制 CSS Variables，适合 React、Vue、普通 Web 项目。",
  },
  {
    title: "3. 放入项目",
    description: "把 CSS Variables 粘贴到 global.css 或 theme.css，并在页面中引入。",
  },
  {
    title: "4. 组件使用变量",
    description: "按钮、卡片、页面背景和文字颜色都使用 var(...)，不要写死颜色。",
  },
  {
    title: "5. 切换深色模式",
    description: "给根节点添加 data-theme=\"dark\" 即可切换深色主题。",
  },
  {
    title: "6. 后续工程化",
    description: "未来可以升级为 npm theme package、接口拉取或数据库统一发布。",
  },
];

const cssExample = `.page {
  background: var(--color-bg-page);
  color: var(--color-text-primary);
}

.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.button-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}`;

const reactExample = `export function DemoCard() {
  return (
    <div className="card">
      <h3>客户运营看板</h3>
      <button className="button-primary">查看详情</button>
    </div>
  );
}`;

const darkExample = `document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-theme", "light");`;

const tailwindExample = `theme: {
  extend: {
    colors: {
      primary: "var(--color-primary)",
      background: "var(--color-bg-page)",
      surface: "var(--color-bg-card)",
      border: "var(--color-border)"
    }
  }
}`;

export default function ThemeUsagePage() {
  return (
    <PageShell
      eyebrow="Developer / Theme Usage"
      title="开发如何接入风格主题"
      description="这页说明开发同学如何从风格库复制主题代码，并应用到真实项目。第一版不发布 npm 包，先用 CSS Variables 跑通。"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href="/styles"
            className="inline-flex rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            去风格广场选风格
          </Link>
          <Link
            href="/design-guide"
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
          >
            打开设计维护台
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <CodeCard title="CSS 使用示例" value={cssExample} />
        <CodeCard title="React 组件示例" value={reactExample} />
        <CodeCard title="深色模式切换" value={darkExample} />
        <CodeCard title="Tailwind 项目片段" value={tailwindExample} />
      </section>

      <section className="rounded-xl border border-violet-100 bg-violet-50 p-6">
        <h2 className="text-lg font-semibold text-violet-950">给开发同学的建议</h2>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-violet-900">
          <p>优先复制 CSS Variables，放到项目的全局样式文件里。</p>
          <p>业务组件只读变量，例如 var(--color-primary)、var(--color-bg-card)，不要把具体色值写进组件。</p>
          <p>如果项目使用 Tailwind，再复制 Tailwind Config 片段，把颜色映射到变量。</p>
          <p>深色模式不是反色，直接使用风格详情页导出的 [data-theme=&quot;dark&quot;] 变量。</p>
        </div>
      </section>
    </PageShell>
  );
}

function CodeCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <CopyAction label="复制" value={value} tone="outline" />
      </div>
      <pre className="max-h-72 overflow-auto bg-slate-950 p-5 text-xs leading-6 text-slate-100">
        <code>{value}</code>
      </pre>
    </div>
  );
}
