"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { ThemeHandoffPanel } from "@/components/theme-handoff-panel";

export function LocalStyleDetail({ styleId }: { styleId: string }) {
  const [style, setStyle] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    window.setTimeout(() => {
      try {
        const styles = JSON.parse(localStorage.getItem("designMaintenanceStyles") || "[]") as Array<Record<string, unknown>>;
        setStyle(styles.find((item) => item.id === styleId && item.status === "published") ?? null);
      } catch {
        setStyle(null);
      }
    }, 0);
  }, [styleId]);

  if (!style) {
    return (
      <PageShell
        eyebrow="Local Style"
        title="没有找到这个本地风格"
        description="本地发布风格保存在当前浏览器里。如果换了浏览器或清空了缓存，需要从设计维护台重新发布或导入 JSON。"
        actions={
          <Link
            href="/design-guide"
            className="inline-flex rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            打开设计维护台
          </Link>
        }
      >
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-6 text-slate-500">可以先回到风格广场，或在设计维护台查看本地草稿和已发布风格。</p>
        </section>
      </PageShell>
    );
  }

  const suitableFor = Array.isArray(style.suitableFor) ? style.suitableFor.map(String) : [];
  const notSuitableFor = Array.isArray(style.notSuitableFor) ? style.notSuitableFor.map(String) : [];

  return (
    <PageShell
      eyebrow="Local Published Style"
      title={String(style.name)}
      description={typeof style.description === "string" ? style.description : "本地发布的网页维护风格。"}
      actions={
        <Link
          href="/styles"
          className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          返回风格广场
        </Link>
      }
    >
      <section className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="适合项目" items={suitableFor} />
        <InfoCard title="不适合项目" items={notSuitableFor} />
      </section>

      <ThemeHandoffPanel style={style} />
    </PageShell>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-2">
        {(items.length ? items : ["待补充"]).map((item) => (
          <p key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}
