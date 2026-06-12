import { StylePreviewCard } from "@/components/style-preview-card";
import { normalizeStyle, type NormalizedStyle } from "@/lib/style-theme";
import type { StylePack } from "@/lib/catalog";

export function StyleCard({
  style,
  normalized,
}: {
  style?: StylePack;
  normalized?: NormalizedStyle;
}) {
  const viewModel = normalized ?? (style ? normalizeStyle(style) : null);

  if (!viewModel) {
    return null;
  }

  return <StylePreviewCard normalized={viewModel} />;
}
