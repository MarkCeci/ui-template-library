"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-xl border border-rose-200 bg-white p-8 text-center shadow-sm">
      <div>
        <span className="inline-flex rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
          Error
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-slate-950">
          页面加载失败
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          这通常是数据字段、页面渲染或本地服务异常导致的。可以先重试；如果仍失败，请把当前页面和错误信息交给开发处理。
        </p>
        <p className="mt-3 font-mono text-xs text-slate-400">
          {error.digest ?? error.message}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-md bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white"
        >
          重新加载
        </button>
      </div>
    </div>
  );
}
