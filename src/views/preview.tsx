import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-react";
import { useExportTtml } from "@/hooks/use-export-ttml";
import { useAudioStore } from "@/stores/audio";
import { useSettingsStore } from "@/stores/settings";
import { useUIStore } from "@/stores/ui";
import { EmptyState } from "@/ui/empty-state";
import { IconButton } from "@/ui/icon-button";
import { Modal } from "@/ui/modal";
import { Select } from "@/ui/select";
import { LyricsRenderer } from "@/views/preview/lyrics-renderer";
import { isPreviewRenderer, PREVIEW_RENDERER_OPTIONS } from "@/views/preview/renderer-options";

// -- Components ---------------------------------------------------------------

interface PreviewControlsProps {
  fullscreen: boolean;
  onFullscreenChange: (fullscreen: boolean) => void;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({ fullscreen, onFullscreenChange }) => {
  const renderer = useSettingsStore((state) => state.previewRenderer);
  const setSetting = useSettingsStore((state) => state.set);

  return (
    <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-xl border border-white/10 bg-black/25 p-1 shadow-lg backdrop-blur-xl">
      <Select
        aria-label="Lyrics renderer"
        appearance="pick"
        value={renderer}
        options={PREVIEW_RENDERER_OPTIONS}
        className="h-8"
        onChange={(value) => {
          if (isPreviewRenderer(value)) setSetting("previewRenderer", value);
        }}
      />
      <IconButton
        variant="secondary"
        label={fullscreen ? "Exit fullscreen preview" : "Fullscreen preview"}
        icon={fullscreen ? <IconArrowsMinimize aria-hidden="true" /> : <IconArrowsMaximize aria-hidden="true" />}
        onClick={() => onFullscreenChange(!fullscreen)}
      />
    </div>
  );
};

const PreviewPanel: React.FC = () => {
  const { content: ttmlString, duration, lineCount, syncedLineCount } = useExportTtml();
  const source = useAudioStore((s) => s.source);
  const fullscreen = useUIStore((s) => s.previewFullscreen);
  const setFullscreen = useUIStore((s) => s.setPreviewFullscreen);

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

  if (fullscreen) {
    return (
      <Modal
        isOpen
        onClose={() => setFullscreen(false)}
        title="Lyrics Preview"
        className="mx-0 h-screen max-w-none rounded-none"
        bodyClassName="relative flex h-[calc(100vh-3.5rem)] flex-col p-0"
      >
        <div className="min-h-0 flex-1">
          <LyricsRenderer ttmlString={ttmlString} durationSeconds={duration} />
        </div>
        <PreviewControls fullscreen onFullscreenChange={setFullscreen} />
      </Modal>
    );
  }

  return (
    <div data-tour="preview-panel" className="relative flex flex-1 overflow-hidden select-none">
      <div className="min-h-0 flex-1">
        <LyricsRenderer ttmlString={ttmlString} durationSeconds={duration} />
      </div>
      <PreviewControls fullscreen={false} onFullscreenChange={setFullscreen} />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { PreviewPanel };
