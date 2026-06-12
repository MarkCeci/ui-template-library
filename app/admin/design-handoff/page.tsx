import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function DeprecatedDesignHandoffPage() {
  return (
    <PageShell
      eyebrow="Deprecated"
      title="设计交付维护区已废弃"
      description="第一版已经改为网页内维护风格库，不接 Figma，也不需要设计师维护 Figma 链接。这个旧入口仅保留说明，避免历史链接访问时报错。"
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href="/design-guide"
            className="inline-flex rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            前往设计维护台
          </Link>
          <Link
            href="/admin"
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
          >
            返回数据实验室
          </Link>
        </div>
      }
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          当前维护方式
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["新增风格", "进入设计维护台，选择从空白、风格捕捉或复制已有风格创建。"],
            ["调整 Token", "在网页里直接编辑颜色、圆角、阴影和密度，并查看 App / Web 预览。"],
            ["交付开发", "复制 CSS Variables、Tailwind Config 或 Tokens JSON 给开发使用。"],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-lg bg-violet-50 p-4 text-sm leading-6 text-violet-900">
          Figma 设计源同步会放到后续版本。当前版本先把网页内维护、预览、发布和代码交付跑通。
        </p>
      </section>
    </PageShell>
  );
}
