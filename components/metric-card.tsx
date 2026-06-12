export function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold leading-none text-slate-950">
        {value}
      </p>
      <p className="mt-3 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  );
}
