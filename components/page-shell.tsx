type PageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className="space-y-6">
      <section className="surface-card p-6 enterprise-shadow">
        {eyebrow ? (
          <span className="inline-flex rounded-md border border-violet-100 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
            {eyebrow}
          </span>
        ) : null}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold leading-tight text-slate-950">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
              {description}
            </p>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </section>
      {children}
    </div>
  );
}
