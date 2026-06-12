import Link from "next/link";
import { AdminMaintenanceWorkbench } from "@/components/admin-maintenance-workbench";
import { PageShell } from "@/components/page-shell";
import { components, prompts, styles, templates } from "@/lib/catalog";
import { roleDescriptions, rolePermissions, type UserRole } from "@/lib/roles";

const roles: UserRole[] = ["viewer", "designer", "developer", "admin"];

export default function AdminPage() {
  return (
    <PageShell
      eyebrow="Internal Data Lab"
      title="数据实验室"
      description="这是内部数据调试入口，用于开发阶段查看、校验和导出 JSON。正式的设计维护请使用「设计维护台」，普通用户不需要进入这里。"
      actions={
        <Link
          href="/design-guide"
          className="inline-flex rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800"
        >
          前往设计维护台
        </Link>
      }
    >
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <p className="text-sm font-semibold text-amber-900">
          内部调试说明
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-800">
          第一版不把这里作为正式产品入口。设计师新增、编辑和发布风格，请统一到 /design-guide；这里保留给后续开发人员做数据结构、角色权限和导出逻辑验证。
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
          Role Prototype
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">
          角色权限预留
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          第一版不接真实登录，但代码结构已预留 viewer、designer、developer、admin 四类角色，后续接数据库和权限系统时可直接复用。
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <div key={role} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">{role}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {roleDescriptions[role]}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {rolePermissions[role].map((permission) => (
                  <span
                    key={permission}
                    className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <AdminMaintenanceWorkbench
        initialStyles={styles}
        initialTemplates={templates}
        initialComponents={components}
        initialPrompts={prompts}
      />
    </PageShell>
  );
}
