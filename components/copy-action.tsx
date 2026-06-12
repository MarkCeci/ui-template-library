"use client";

import { useState } from "react";

export function CopyAction({
  label,
  value,
  tone = "solid",
}: {
  label: string;
  value: string;
  tone?: "solid" | "outline";
}) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold transition ${
        tone === "solid"
          ? "bg-violet-700 text-white hover:bg-violet-800"
          : "border border-slate-300 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
      }`}
    >
      {copied ? "已复制" : label}
    </button>
  );
}
