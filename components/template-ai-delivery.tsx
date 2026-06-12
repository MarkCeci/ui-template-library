"use client";

import { useState } from "react";

type PromptBlock = {
  id: string;
  title: string;
  description: string;
  prompt: string;
};

export function TemplateAiDelivery({ prompts }: { prompts: PromptBlock[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyPrompt(prompt: PromptBlock) {
    await navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div className="grid gap-4">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-950">{prompt.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {prompt.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyPrompt(prompt)}
              className="inline-flex justify-center rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              {copiedId === prompt.id ? "已复制" : "复制"}
            </button>
          </div>
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
            {prompt.prompt}
          </pre>
          {copiedId === prompt.id ? (
            <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              复制成功，可以直接交给 AI / 设计 / 开发继续使用。
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
