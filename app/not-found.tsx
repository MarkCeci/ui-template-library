import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div>
        <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
          404
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-slate-950">
          没有找到这个页面
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          可能是模板 ID、风格 ID 或链接路径不正确。请回到首页或模板库重新选择。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/" className="rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white">
            返回首页
          </Link>
          <Link href="/templates" className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
            查看模板库
          </Link>
        </div>
      </div>
    </div>
  );
}
