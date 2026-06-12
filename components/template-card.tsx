import Link from "next/link";
import { CoverPreview, getTemplateCoverPreset } from "@/components/cover-preview";
import type { StylePack, TemplateItem } from "@/lib/catalog";

const statusTone: Record<string, string> = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  sample: "border-violet-200 bg-violet-50 text-violet-700",
};

export function TemplateCard({
  template,
  style,
}: {
  template: TemplateItem;
  style?: StylePack;
}) {
  const coverPreset = getTemplateCoverPreset(template);

  return (
    <Link
      href={`/templates/${template.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg"
    >
      <CoverPreview preset={coverPreset} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {template.platform} / {template.type}
            </p>
            <h2 className="mt-2 line-clamp-1 text-lg font-semibold leading-7 text-slate-950 group-hover:text-violet-700">
              {template.name}
            </h2>
            <p className="mt-1 font-mono text-[11px] text-slate-400">
              {template.id}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold ${
              statusTone[template.status] ?? "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {template.status}
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          <InfoLine label="适合场景" value={template.scene} />
          <InfoLine label="特点摘要" value={template.description} />
          <InfoLine label="Token modes" value={style?.tokens ?? "按关联风格维护"} />
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {template.ai_tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              {tag}
            </span>
          ))}
          {template.ai_tags.length > 6 ? (
            <span className="rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-400">
              +{template.ai_tags.length - 6}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
        {value}
      </p>
    </div>
  );
}
