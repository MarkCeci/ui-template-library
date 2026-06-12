import type { CSSProperties } from "react";
import type { StylePack } from "@/lib/catalog";

export function CssVariableStylePreview({ style }: { style: StylePack }) {
  const variables = style.cssVariables ?? {};
  const cssVars = variables as CSSProperties;
  const prompt = style.previewPrompt;

  return (
    <div
      className="overflow-hidden rounded-t-xl border-b border-slate-200 bg-[var(--color-bg,#f8fafc)] p-5"
      style={cssVars}
    >
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_320px]">
        <div
          className="relative overflow-hidden rounded-[var(--radius-card,24px)] border border-[var(--color-border,rgba(148,163,184,0.35))] bg-[var(--color-surface,#ffffff)] p-5 shadow-[var(--shadow-card,0_18px_48px_rgba(15,23,42,0.12))]"
          style={{
            backdropFilter: variables["--glass-blur"] ?? undefined,
            boxShadow: variables["--shadow-card"] ?? undefined,
          }}
        >
          <div className="absolute inset-x-8 top-0 h-px bg-white/80" />
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--color-primary,#7c3aed)] px-3 py-1 text-xs font-semibold text-white">
              {style.category}
            </span>
            <span className="rounded-full border border-[var(--color-border,rgba(148,163,184,0.35))] bg-white/45 px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary,#64748b)]">
              CSS Variables Preview
            </span>
          </div>

          <h2 className="mt-8 max-w-2xl text-3xl font-semibold leading-tight text-[var(--color-text-primary,#0f172a)]">
            {style.name}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary,#64748b)]">
            {style.description ?? style.scenario}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-[var(--radius-button,999px)] bg-[var(--color-primary,#7c3aed)] px-5 py-3 text-sm font-semibold text-white shadow-sm"
            >
              生成首屏预览
            </button>
            <button
              type="button"
              className="rounded-[var(--radius-button,999px)] border border-[var(--color-border,rgba(148,163,184,0.35))] bg-white/55 px-5 py-3 text-sm font-semibold text-[var(--color-text-primary,#0f172a)]"
            >
              查看风格变量
            </button>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {["组件", "布局", "效果"].map((item, index) => (
              <div
                key={item}
                className="rounded-[calc(var(--radius-card,24px)*0.58)] border border-[var(--color-border,rgba(148,163,184,0.35))] bg-white/55 p-4"
              >
                <div
                  className="h-9 w-9 rounded-full"
                  style={{
                    background:
                      index === 0
                        ? "var(--color-primary,#7c3aed)"
                        : index === 1
                          ? "var(--color-secondary,#8b5cf6)"
                          : "var(--color-accent,#06b6d4)",
                  }}
                />
                <p className="mt-4 text-sm font-semibold text-[var(--color-text-primary,#0f172a)]">
                  {item}
                </p>
                <div className="mt-2 h-2 rounded-full bg-[var(--color-border,rgba(148,163,184,0.28))]" />
                <div className="mt-2 h-2 w-2/3 rounded-full bg-[var(--color-border,rgba(148,163,184,0.28))]" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-card,24px)] border border-[var(--color-border,rgba(148,163,184,0.35))] bg-[var(--color-surface,#ffffff)] p-4 shadow-[var(--shadow-card,0_18px_48px_rgba(15,23,42,0.12))]">
          <div className="mx-auto flex aspect-[390/844] max-h-[440px] flex-col overflow-hidden rounded-[2rem] border border-[var(--color-border,rgba(148,163,184,0.35))] bg-white/70 p-3">
            <div className="mx-auto h-1.5 w-16 rounded-full bg-[var(--color-border,rgba(148,163,184,0.35))]" />
            <div className="mt-4 rounded-[var(--radius-card,24px)] bg-[var(--color-primary,#7c3aed)] p-4 text-white">
              <p className="text-xs font-semibold opacity-80">STYLE HERO</p>
              <p className="mt-2 text-xl font-semibold">{style.name}</p>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-12 rounded-2xl border border-[var(--color-border,rgba(148,163,184,0.35))] bg-[var(--color-surface,#ffffff)]"
                />
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[var(--color-border,rgba(148,163,184,0.35))] bg-[var(--color-surface,#ffffff)] p-3"
                >
                  <div
                    className="h-2 w-24 rounded-full opacity-30"
                    style={{ backgroundColor: "var(--color-text-secondary,#64748b)" }}
                  />
                  <div
                    className="mt-2 h-2 w-16 rounded-full opacity-30"
                    style={{ backgroundColor: "var(--color-primary,#7c3aed)" }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-auto grid grid-cols-4 gap-2 rounded-full border border-[var(--color-border,rgba(148,163,184,0.35))] bg-white/70 p-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={item === 0 ? "h-8 rounded-full bg-[var(--color-primary,#7c3aed)]" : "h-8 rounded-full bg-slate-100"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {prompt ? (
        <p className="mx-auto mt-4 max-w-5xl rounded-lg border border-white/70 bg-white/65 px-4 py-3 text-xs leading-5 text-[var(--color-text-secondary,#64748b)]">
          Preview Prompt: {prompt}
        </p>
      ) : null}
    </div>
  );
}
