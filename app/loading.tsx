export default function Loading() {
  return (
    <div className="grid min-h-[420px] place-items-center rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="w-full max-w-xl">
        <div className="h-5 w-40 rounded-full bg-slate-200" />
        <div className="mt-4 h-4 w-4/5 rounded-full bg-slate-100" />
        <div className="mt-2 h-4 w-3/5 rounded-full bg-slate-100" />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="h-4 w-20 rounded-full bg-slate-200" />
              <div className="mt-5 h-8 w-24 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
