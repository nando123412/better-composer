import { useExportTtml } from "@/hooks/use-export-ttml";
import { useAudioStore } from "@/stores/audio";
import { useProjectStore } from "@/stores/project";
import { EmptyState } from "@/ui/empty-state";
import { KawarpBackdrop } from "@/ui/kawarp-backdrop";
import { cn } from "@/utils/cn";
import { LyricsRenderer } from "@/views/preview/lyrics-renderer";

// -- Components ---------------------------------------------------------------

const PreviewPanel: React.FC = () => {
  const { content: ttmlString, duration, lineCount, syncedLineCount } = useExportTtml();
  const source = useAudioStore((s) => s.source);
  const artwork = useProjectStore((s) => s.metadata.thumbnailDataUrl);

  const hasSyncedContent = syncedLineCount > 0;

  if (!source) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState message="No audio loaded" hint="Import audio in the Import tab first" />
      </div>
    );
  }

  if (lineCount === 0) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState message="No lyrics to preview" hint="Add lyrics in the Edit tab first" />
      </div>
    );
  }

  if (!hasSyncedContent) {
    return (
      <div className="flex flex-col flex-1 p-4">
        <EmptyState message="No synced content" hint="Sync lyrics in the Sync tab first" />
      </div>
    );
  }

  return (
    <div
      data-tour="preview-panel"
      className={cn(
        "relative isolate flex flex-col flex-1 overflow-hidden rounded-[inherit] select-none",
        "before:absolute before:inset-0 before:-z-1 before:pointer-events-none",
        "before:bg-[linear-gradient(100deg,rgb(0_0_0/0.55),rgb(0_0_0/0.2)_60%,rgb(0_0_0/0.45)),linear-gradient(to_top,rgb(0_0_0/0.55),transparent_55%)]",
      )}
    >
      <KawarpBackdrop
        src={artwork}
        className="absolute inset-0 -z-2 overflow-hidden rounded-[inherit] [contain:strict]"
      />
      <h2 className="sr-only">Preview</h2>
      <LyricsRenderer ttmlString={ttmlString} durationSeconds={duration} rendererOverride="am-lyrics" />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { PreviewPanel };
