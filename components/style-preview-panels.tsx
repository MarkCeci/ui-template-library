import type { CSSProperties } from "react";
import type { NormalizedStyle } from "@/lib/style-theme";

type PreviewSize = "card" | "detail";

export function StyleDualPreview({
  style,
  size = "card",
}: {
  style: NormalizedStyle;
  size?: PreviewSize;
}) {
  const compact = size === "card";

  return (
    <div
      className={`grid gap-3 ${compact ? "p-3 md:grid-cols-2" : "p-5 lg:grid-cols-[1.12fr_0.88fr]"}`}
      style={{ background: style.palette.background }}
    >
      <AdminPreview style={style} size={size} />
      <MobilePreview style={style} size={size} />
    </div>
  );
}

export function AdminPreview({
  style,
  size = "detail",
}: {
  style: NormalizedStyle;
  size?: PreviewSize;
}) {
  const compact = size === "card";
  const tone = getTone(style);

  return (
    <div
      className={`overflow-hidden border ${compact ? "aspect-[4/3] p-2" : "p-4"}`}
      style={panelStyle(style)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: style.palette.primary }} />
          <span className="h-2 w-16 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.22) }} />
        </div>
        <span className="h-5 w-16 rounded-full" style={{ background: alpha(style.palette.primary, 0.12) }} />
      </div>

      <div className={`mt-3 grid gap-2 ${compact ? "grid-cols-3" : "grid-cols-4"}`}>
        {(compact ? [0, 1, 2] : [0, 1, 2, 3]).map((item) => (
          <div key={item} className="p-2" style={smallPanelStyle(style)}>
            <div className="h-2 w-1/2 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.22) }} />
            <div
              className={`${compact ? "mt-3 h-4" : "mt-4 h-6"} rounded-md`}
              style={{
                background: [style.palette.primary, style.palette.secondary, style.palette.accent][item % 3],
                opacity: item === 0 ? 1 : 0.82,
              }}
            />
          </div>
        ))}
      </div>

      <div className={`mt-3 grid gap-3 ${compact ? "" : "lg:grid-cols-[1fr_0.72fr]"}`}>
        <div className="p-3" style={smallPanelStyle(style)}>
          <div className="flex h-20 items-end gap-1.5">
            {[36, 54, 42, 70, 48, 76, 58].map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="w-full rounded-t"
                style={{
                  height: compact ? height * 0.62 : height,
                  background: index % 2 === 0 ? style.palette.primary : style.palette.accent,
                  opacity: 0.24 + index * 0.08,
                  boxShadow: tone === "dark" ? `0 0 18px ${alpha(style.palette.accent, 0.26)}` : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div className="p-3" style={smallPanelStyle(style)}>
          <div className="grid gap-2">
            {(compact ? [0, 1, 2] : [0, 1, 2, 3, 4]).map((item) => (
              <div key={item} className="grid grid-cols-[1fr_0.7fr_0.5fr] gap-2">
                <span className="h-2 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.2) }} />
                <span className="h-2 rounded-full" style={{ background: style.palette.border }} />
                <span className="h-2 rounded-full" style={{ background: alpha(style.palette.primary, 0.34) }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {!compact ? (
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <FormShell style={style} />
          <ApprovalShell style={style} />
        </div>
      ) : null}
    </div>
  );
}

export function MobilePreview({
  style,
  size = "detail",
}: {
  style: NormalizedStyle;
  size?: PreviewSize;
}) {
  const compact = size === "card";

  return (
    <div
      className={`flex items-center justify-center overflow-hidden border ${compact ? "aspect-[4/3] p-2" : "p-5"}`}
      style={panelStyle(style)}
    >
      <div
        className={`flex flex-col overflow-hidden border ${
          compact ? "h-full w-[46%] min-w-[86px] rounded-[1.25rem] p-1.5" : "h-[620px] max-h-[72vh] w-[310px] rounded-[2rem] p-3"
        }`}
        style={{
          background: style.palette.background,
          borderColor: style.palette.border,
          boxShadow: `inset 0 0 0 1px ${alpha(style.palette.surface, 0.45)}`,
        }}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full" style={{ background: style.palette.border }} />
        <div
          className="mt-3 p-3 text-white"
          style={{
            borderRadius: multiplyRadius(style.tokens.radius.card, 0.8),
            background: gradient(style),
          }}
        >
          <div className="h-2 w-14 rounded-full bg-white/55" />
          <div className={`${compact ? "mt-3 h-6" : "mt-4 h-10"} rounded-lg bg-white/20`} />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((item) => (
            <span
              key={item}
              className={compact ? "h-8" : "h-14"}
              style={{
                ...miniTileStyle(style),
                background: item === 0 ? alpha(style.palette.primary, 0.12) : style.palette.surface,
              }}
            />
          ))}
        </div>
        <div className="mt-3 grid gap-2">
          {(compact ? [0, 1, 2] : [0, 1, 2, 3]).map((item) => (
            <div key={item} className="p-2" style={smallPanelStyle(style)}>
              <div className="h-2 w-2/3 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.22) }} />
              <div className="mt-2 h-2 w-1/2 rounded-full" style={{ background: alpha(style.palette.primary, item === 0 ? 0.38 : 0.24) }} />
            </div>
          ))}
        </div>
        <div className="mt-auto grid grid-cols-4 gap-1.5 rounded-full border p-1.5" style={{ background: style.palette.surface, borderColor: style.palette.border }}>
          {[0, 1, 2, 3].map((item) => (
            <span
              key={item}
              className={compact ? "h-4 rounded-full" : "h-8 rounded-full"}
              style={{ background: item === 0 ? style.palette.primary : style.palette.border }}
            />
          ))}
        </div>
      </div>

      {!compact ? (
        <div className="ml-5 hidden flex-1 grid-cols-1 gap-3 lg:grid">
          <MobileListShell style={style} />
          <MobileDetailShell style={style} />
          <MobileProfileShell style={style} />
        </div>
      ) : null}
    </div>
  );
}

export function ColorSwatches({ style }: { style: NormalizedStyle }) {
  const colors = style.colorFamily.slice(0, 6);

  return (
    <div className="flex items-center gap-1.5">
      {colors.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className="h-5 w-5 rounded-full border border-white shadow-sm ring-1 ring-slate-200"
          style={{ background: color }}
          title={color}
        />
      ))}
    </div>
  );
}

function FormShell({ style }: { style: NormalizedStyle }) {
  return (
    <div className="p-3" style={smallPanelStyle(style)}>
      <div className="h-2 w-24 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.22) }} />
      <div className="mt-3 grid gap-2">
        {[0, 1, 2].map((item) => (
          <span key={item} className="h-8" style={inputStyle(style)} />
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <span className="h-7 w-14 rounded-full border" style={{ borderColor: style.palette.border, background: alpha(style.palette.surface, 0.72) }} />
        <span className="h-7 w-16 rounded-full" style={{ background: style.palette.primary }} />
      </div>
    </div>
  );
}

function ApprovalShell({ style }: { style: NormalizedStyle }) {
  return (
    <div className="p-3" style={smallPanelStyle(style)}>
      <div className="grid gap-2">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full" style={{ background: item === 1 ? style.palette.primary : style.palette.border }} />
            <span className="h-2 flex-1 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.18) }} />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <span className="h-7 rounded-full border" style={{ borderColor: style.palette.border, background: alpha(style.palette.surface, 0.72) }} />
        <span className="h-7 rounded-full" style={{ background: style.palette.primary }} />
      </div>
    </div>
  );
}

function MobileListShell({ style }: { style: NormalizedStyle }) {
  return (
    <div className="p-4" style={smallPanelStyle(style)}>
      <div className="h-2 w-20 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.22) }} />
      <div className="mt-3 grid gap-2">
        {[0, 1, 2].map((item) => (
          <span key={item} className="h-10" style={inputStyle(style)} />
        ))}
      </div>
    </div>
  );
}

function MobileDetailShell({ style }: { style: NormalizedStyle }) {
  return (
    <div className="p-4" style={smallPanelStyle(style)}>
      <div className="h-16 rounded-2xl" style={{ background: alpha(style.palette.primary, 0.18) }} />
      <div className="mt-3 h-2 w-2/3 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.22) }} />
      <div className="mt-2 h-2 w-1/2 rounded-full" style={{ background: alpha(style.palette.primary, 0.25) }} />
    </div>
  );
}

function MobileProfileShell({ style }: { style: NormalizedStyle }) {
  return (
    <div className="p-4" style={smallPanelStyle(style)}>
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-full" style={{ background: style.palette.primary }} />
        <span className="h-2 flex-1 rounded-full" style={{ background: alpha(style.palette.textSecondary, 0.22) }} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((item) => (
          <span key={item} className="h-9 rounded-xl" style={{ background: style.palette.background }} />
        ))}
      </div>
    </div>
  );
}

function panelStyle(style: NormalizedStyle): CSSProperties {
  const dark = getTone(style) === "dark";
  return {
    borderRadius: style.tokens.radius.card,
    borderColor: style.palette.border,
    boxShadow: style.tokens.shadow.card,
    color: style.palette.textPrimary,
    background: dark
      ? `linear-gradient(145deg, ${style.palette.surface}, #050816)`
      : `linear-gradient(145deg, ${style.palette.surface}, ${alpha(style.palette.primary, 0.05)})`,
  };
}

function smallPanelStyle(style: NormalizedStyle): CSSProperties {
  return {
    borderRadius: multiplyRadius(style.tokens.radius.card, 0.62),
    border: `1px solid ${style.palette.border}`,
    background: alpha(style.palette.surface, getTone(style) === "dark" ? 0.68 : 0.82),
  };
}

function inputStyle(style: NormalizedStyle): CSSProperties {
  return {
    borderRadius: style.tokens.radius.control,
    border: `1px solid ${style.palette.border}`,
    background: alpha(style.palette.surface, 0.72),
  };
}

function miniTileStyle(style: NormalizedStyle): CSSProperties {
  return {
    borderRadius: multiplyRadius(style.tokens.radius.card, 0.45),
    border: `1px solid ${style.palette.border}`,
  };
}

function gradient(style: NormalizedStyle) {
  return `linear-gradient(135deg, ${style.palette.primary}, ${style.palette.secondary})`;
}

function multiplyRadius(value: string, factor: number) {
  const match = value.match(/^(\d+(?:\.\d+)?)px$/);
  if (!match) return value;
  return `${Math.round(Number(match[1]) * factor)}px`;
}

function getTone(style: NormalizedStyle) {
  return style.mood.includes("暗色酷炫") || style.palette.background.toLowerCase().includes("#0")
    ? "dark"
    : "light";
}

function alpha(color: string, opacity: number) {
  if (color.startsWith("rgba")) return color;
  if (!color.startsWith("#") || color.length < 7) {
    return `rgba(91,43,200,${opacity})`;
  }

  const r = Number.parseInt(color.slice(1, 3), 16);
  const g = Number.parseInt(color.slice(3, 5), 16);
  const b = Number.parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
