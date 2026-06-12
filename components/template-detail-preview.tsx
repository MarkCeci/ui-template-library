"use client";

import { RealScenarioPreview, type RealPreviewPlatform } from "@/components/real-scenario-preview";
import { styles, type StylePack, type TemplateItem } from "@/lib/catalog";
import { getPreviewScenario, normalizeStyle, type PreviewScenario } from "@/lib/style-theme";

export const templatePreviewQualityMarkers = ["loading", "empty", "error", "permission-denied"];

export function TemplateDetailPreview({
  template,
  stylePack,
}: {
  template: TemplateItem;
  stylePack?: StylePack;
}) {
  const sourceStyle = stylePack ?? styles[0];
  const style = normalizeStyle(sourceStyle);
  const scenario = getTemplateScenario(template, style.previewScenario);
  const platform = getTemplatePlatform(template);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
          Real Scenario Delivery
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-950">
          {template.type} · {template.scene}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          模板详情页已复用真实场景预览系统，默认展示业务内容，加载、空状态、错误和无权限作为可切换状态。
        </p>
      </div>
      <div className="p-5">
        <RealScenarioPreview
          style={style}
          scenario={scenario}
          platform={platform}
          stylePackId={template.style_pack_id}
          tokenModes={[sourceStyle.tokens]}
          showControls
          showPlatformTabs={false}
          initialPlatform={platform === "app" ? "app" : "admin"}
        />
      </div>
    </section>
  );
}

function getTemplatePlatform(template: TemplateItem): RealPreviewPlatform {
  const text = `${template.platform} ${template.type} ${template.preview_type} ${template.scene}`.toLowerCase();
  if (text.includes("mobile") || text.includes("app")) return "app";
  if (text.includes("ai") || text.includes("copilot")) return "ai-copilot";
  if (text.includes("dashboard") || text.includes("大屏")) return "dashboard";
  return "admin";
}

function getTemplateScenario(template: TemplateItem, fallback: PreviewScenario): PreviewScenario {
  const text = `${template.id} ${template.name} ${template.platform} ${template.type} ${template.scene} ${template.preview_type} ${template.ai_tags.join(" ")}`.toLowerCase();
  if (text.includes("dark") || text.includes("大屏")) return "dark-dashboard";
  if (text.includes("ai") || text.includes("copilot") || text.includes("助手")) return "ai-assistant";
  if (text.includes("mobile") || text.includes("app") || text.includes("轻办公")) return "mobile-workbench";
  if (text.includes("medical") || text.includes("health") || text.includes("医疗")) return "medical-health";
  if (text.includes("finance") || text.includes("金融")) return "finance-dashboard";
  if (text.includes("local") || text.includes("本地生活")) return "local-service";
  if (text.includes("merchant") || text.includes("ecommerce") || text.includes("电商") || text.includes("商家")) {
    return "ecommerce-operation";
  }
  if (text.includes("list") || text.includes("table") || text.includes("列表")) return "saas-admin-list";
  return getPreviewScenario({ ...templateStyleBridge(template), previewScenario: fallback });
}

function templateStyleBridge(template: TemplateItem): StylePack {
  return {
    id: template.style_pack_id,
    name: template.name,
    category: template.scene,
    priority: "P1",
    scenario: template.scene,
    visual: template.description,
    v1: template.layout.regions.join(" / "),
    tokens: "light",
    tags: template.ai_tags ?? [],
  };
}
