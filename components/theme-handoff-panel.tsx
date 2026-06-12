"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import {
  buildThemePackage,
  generateReactThemeObject,
  type ThemeHandoffTokens,
} from "@/lib/theme-handoff";

type ThemeHandoffPanelProps = {
  style: Record<string, unknown>;
  title?: string;
  description?: string;
  draftNotice?: boolean;
  showDownload?: boolean;
};

type HandoffTab = "css" | "tailwind" | "json" | "usage" | "react";

const tabs: Array<{ id: HandoffTab; label: string }> = [
  { id: "css", label: "CSS Variables" },
  { id: "tailwind", label: "Tailwind Config" },
  { id: "json", label: "Tokens JSON" },
  { id: "usage", label: "使用示例" },
  { id: "react", label: "React Theme Object" },
];

export function ThemeHandoffPanel({
  style,
  title = "开发接入",
  description = "复制下面的主题代码到项目中，即可应用当前风格。第一版推荐使用 CSS Variables，适用于 React、Vue、普通 Web 项目。",
  draftNotice = false,
  showDownload = true,
}: ThemeHandoffPanelProps) {
  const [activeTab, setActiveTab] = useState<HandoffTab>("css");
  const [copied, setCopied] = useState("");
  const packageText = useMemo(() => {
    const handoff = buildThemePackage(style);
    return {
      css: handoff.css,
      tailwind: handoff.tailwind,
      json: handoff.tokensJson,
      usage: handoff.usage,
      react: generateReactThemeObject(style),
    };
  }, [style]);

  const activeValue = packageText[activeTab];

  async function copyValue() {
    await navigator.clipboard.writeText(activeValue);
    setCopied(activeTab);
    window.setTimeout(() => setCopied(""), 1600);
  }

  function downloadJson() {
    const blob = new Blob([packageText.json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${String(style.id ?? "theme")}-tokens.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
            Theme Handoff
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
          {draftNotice ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
              当前为草稿风格，交付前请确认验收清单。
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyValue}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            <Icon icon={copied === activeTab ? "check-circle" : "copy"} size={16} color="currentColor" />
            {copied === activeTab ? "已复制" : "复制当前代码"}
          </button>
          {showDownload ? (
            <button
              type="button"
              onClick={downloadJson}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Icon icon="link" size={16} color="currentColor" />
              下载 JSON
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "border-violet-200 bg-violet-50 text-violet-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
        <code>{activeValue}</code>
      </pre>
    </section>
  );
}

export type { ThemeHandoffTokens };
