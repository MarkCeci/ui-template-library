"use client";

import { useState } from "react";

export function PromptCopyCard({
  prompt,
  tags,
}: {
  prompt: string;
  tags: string[];
}) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">AI 入口</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            给 AI 工具的页面生成说明，可直接复制后用于生成首版界面。
          </p>
        </div>
        <button
          type="button"
          onClick={copyPrompt}
          className="inline-flex justify-center rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
        >
          {copied ? "已复制" : "复制 Prompt"}
        </button>
      </div>

      <pre className="mt-5 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
        {prompt}
      </pre>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
