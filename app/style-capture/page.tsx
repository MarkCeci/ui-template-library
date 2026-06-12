import { PageShell } from "@/components/page-shell";
import { StyleCaptureTool } from "@/components/style-capture-tool";

export default function StyleCapturePage() {
  return (
    <PageShell
      eyebrow="Style Capture"
      title="风格捕捉器"
      description="上传一张截图，自动提取视觉色板，并实时生成 App 与后台主题预览。"
    >
      <StyleCaptureTool />
    </PageShell>
  );
}
