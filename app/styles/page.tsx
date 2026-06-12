import { PageShell } from "@/components/page-shell";
import { StylesExplorer } from "@/components/styles-explorer";
import { styles } from "@/lib/catalog";

export default function StylesPage() {
  return (
    <PageShell
      eyebrow="Style Gallery"
      title="风格广场"
      description={`像逛货架一样浏览 ${styles.length} 个企业视觉风格。每个风格都同时展示后台端和移动端效果，先看感觉，再进详情复制 CSS 变量、AI Prompt 和维护 JSON。`}
    >
      <StylesExplorer styles={styles} />
    </PageShell>
  );
}
