import { AiRecommendationWorkbench } from "@/components/ai-recommendation-workbench";
import { PageShell } from "@/components/page-shell";
import { components, styles, templates } from "@/lib/catalog";

export default function AiRecommendPage() {
  return (
    <PageShell
      eyebrow="AI Recommend"
      title="AI 推荐页"
      description="第一版先不接真实 AI API，而是基于风格包、模板、标签、平台、场景和视觉偏好做规则推荐。每条结果都会引用 style_pack_id 和 template_id，方便继续进入风格详情、模板详情或复制 Prompt。"
    >
      <AiRecommendationWorkbench
        styles={styles}
        templates={templates}
        components={components}
      />
    </PageShell>
  );
}
