import Link from "next/link";
import { DesignMaintenanceWorkbench } from "@/components/design-maintenance-workbench";
import { PageShell } from "@/components/page-shell";
import { styles } from "@/lib/catalog";

export default function DesignGuidePage() {
  return (
    <PageShell
      eyebrow="Design Maintenance"
      title="设计维护台"
      description="在网页里维护风格库，不需要打开 Figma。你可以创建风格、调整 Token、查看双端预览，并发布到风格广场。"
      actions={
        <Link
          href="/style-capture?from=design-maintenance"
          className="inline-flex rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
        >
          从截图创建风格
        </Link>
      }
    >
      <section className="rounded-[24px] border border-violet-100 bg-violet-50/70 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">当前版本：网页内维护风格和 Token</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              设计师只需要在这里新增风格、改颜色、看 App 和 Web 预览、勾选验收项并发布。Figma 设计源同步将在后续版本支持，当前版本先在网页内维护风格和 Token。
            </p>
          </div>
          <Link
            href="/styles"
            className="inline-flex w-fit rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-800 transition hover:bg-violet-50"
          >
            查看风格广场
          </Link>
        </div>
      </section>

      <DesignMaintenanceWorkbench initialStyles={styles} />
    </PageShell>
  );
}
