import { lazy, Suspense, useMemo } from "react";
import type { Bounds } from "@/domain/word/bounds";
import { useImagePalette } from "@/hooks/use-image-palette";
import { useProjectStore } from "@/stores/project";
import { useSettingsStore } from "@/stores/settings";
import { useThemeStore } from "@/stores/theme";
import { useAmbiencePreference } from "@/ui/artwork-atmosphere";
import { KawarpBackdrop } from "@/ui/kawarp-backdrop";
import { kawarpThemeOpacity, kawarpThemeOptions } from "@/ui/kawarp-theme-options";
import { AmLyricsRenderer } from "@/views/preview/am-lyrics-renderer";
import { BraccatoRenderer } from "@/views/preview/braccato-renderer";
import { IsolatedBraccato } from "@/views/preview/frame/isolated-braccato";
import type { LyricsLayout } from "@/views/preview/lyrics-layout";

const AmllRenderer = lazy(() =>
  import("@/views/preview/amll-renderer").then((module) => ({ default: module.AmllRenderer })),
);

// -- Interfaces ---------------------------------------------------------------

interface LyricsRendererProps {
  ttmlString: string;
  durationSeconds: number;
  layout?: LyricsLayout;
  focusRange?: Bounds | null;
  // Moves Braccato's work off this document's main thread when a cross-site frame origin exists.
  isolated?: boolean;
}

// -- Component ----------------------------------------------------------------

const LyricsRenderer: React.FC<LyricsRendererProps> = ({
  ttmlString,
  durationSeconds,
  layout = "page",
  focusRange = null,
  isolated = false,
}) => {
  const renderer = useSettingsStore((s) => s.previewRenderer);
  const artwork = useProjectStore((s) => s.metadata.thumbnailDataUrl);
  const shaderConfig = useThemeStore(
    (state) => state.betterLyricsThemes.find((theme) => theme.metadata.id === state.activeBetterLyricsThemeId)?.shader,
  );
  const shaderOptions = useMemo(() => kawarpThemeOptions(shaderConfig), [shaderConfig]);
  const shaderOpacity = kawarpThemeOpacity(shaderConfig);
  const [ambienceEnabled] = useAmbiencePreference();
  const artworkColors = useImagePalette(artwork);
  const colorStops = [artworkColors[0], artworkColors[1] ?? artworkColors[0], artworkColors[2] ?? artworkColors[0]];
  const colorWash = `linear-gradient(125deg, ${colorStops[0]}B8 0%, ${colorStops[1]}88 48%, ${colorStops[2]}A8 100%)`;

  const content =
    renderer === "braccato" && isolated ? (
      <IsolatedBraccato ttmlString={ttmlString} focusRange={focusRange} />
    ) : renderer === "amll" ? (
      <Suspense fallback={null}>
        <AmllRenderer ttmlString={ttmlString} layout={layout} />
      </Suspense>
    ) : renderer === "am-lyrics" ? (
      <AmLyricsRenderer
        ttmlString={ttmlString}
        durationSeconds={durationSeconds}
        layout={layout}
        focusRange={focusRange}
      />
    ) : (
      <BraccatoRenderer ttmlString={ttmlString} layout={layout} focusRange={focusRange} />
    );

  return (
    <div className="relative isolate h-full min-h-0 w-full overflow-hidden">
      {artwork && (
        <div
          aria-hidden="true"
          className={`lyrics-preview-atmosphere ${ambienceEnabled ? "lyrics-preview-atmosphere-active" : "lyrics-preview-atmosphere-inactive"}`}
        >
          <KawarpBackdrop
            src={artwork}
            options={shaderOptions}
            opacity={shaderOpacity}
            active={ambienceEnabled}
            className="absolute inset-0 z-0 overflow-hidden"
          />
          <div
            className={`lyrics-preview-colorwash ${ambienceEnabled ? "lyrics-preview-colorwash-active" : "lyrics-preview-colorwash-inactive"}`}
            style={{ backgroundImage: colorWash }}
          />
          <div aria-hidden="true" className="lyrics-preview-shade" />
        </div>
      )}
      <div className="relative z-10 h-full min-h-0 w-full">{content}</div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { LyricsRenderer };
