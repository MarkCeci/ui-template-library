"use client";

import { useState } from "react";

type ModuleNode = {
  name: string;
  description: string;
};

export function TemplateModuleTree({ modules }: { modules: ModuleNode[] }) {
  const [activeModule, setActiveModule] = useState(modules[0]?.name ?? "");
  const active = modules.find((module) => module.name === activeModule) ?? modules[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex min-w-max items-center gap-2">
          {modules.map((module, index) => (
            <div key={`${module.name}-${index}`} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModule(module.name)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                  active?.name === module.name
                    ? "border-violet-200 bg-violet-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:text-violet-700"
                }`}
              >
                {module.name}
              </button>
              {index < modules.length - 1 ? (
                <span className="text-sm font-semibold text-slate-300">&gt;</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          当前模块说明
        </p>
        <h3 className="mt-2 text-base font-semibold text-slate-950">
          {active?.name ?? "未选择模块"}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {active?.description ?? "点击左侧模块后，这里会显示它在页面中的职责。"}
        </p>
      </div>
    </div>
  );
}
