import { LocalStyleDetail } from "@/components/local-style-detail";

export default async function LocalStyleDetailPage({
  params,
}: {
  params: Promise<{ styleId: string }>;
}) {
  const { styleId } = await params;
  return <LocalStyleDetail styleId={styleId} />;
}
