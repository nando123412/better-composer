import type { PreviewRenderer } from "@/stores/settings";

const PREVIEW_RENDERER_OPTIONS = [
  { value: "braccato", label: "Braccato" },
  { value: "am-lyrics", label: "am-lyrics" },
  { value: "amll", label: "Apple Music-like Lyrics" },
];

function isPreviewRenderer(value: string): value is PreviewRenderer {
  return PREVIEW_RENDERER_OPTIONS.some((option) => option.value === value);
}

export { isPreviewRenderer, PREVIEW_RENDERER_OPTIONS };
