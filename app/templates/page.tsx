import { PageShell } from "@/components/page-shell";
import { TemplatesExplorer } from "@/components/templates-explorer";
import {
  getTemplatePlatforms,
  getTemplateScenes,
  getTemplateStatuses,
  getTemplateTypes,
  styles,
  templates,
} from "@/lib/catalog";

export default function TemplatesPage() {
  const platforms = getTemplatePlatforms();
  const templateTypes = getTemplateTypes();
  const scenes = getTemplateScenes();
  const statuses = getTemplateStatuses();

  return (
    <PageShell
      eyebrow="Templates"
      title="模板库"
      description="这里收纳可复用的页面模板。非专业人员可以先按平台选择，再按业务场景搜索，最后看模板是否带 Figma、Storybook、代码和 AI Prompt，决定能不能直接进入设计或开发。"
    >
      <TemplatesExplorer
        templates={templates}
        styles={styles}
        platforms={platforms}
        templateTypes={templateTypes}
        scenes={scenes}
        statuses={statuses}
      />
    </PageShell>
  );
}
