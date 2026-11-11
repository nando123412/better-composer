import { IconLoader2 } from "@tabler/icons-react";
import { useSettingsStore } from "@/stores/settings";
import { type SpectrumStatusView, useSpectrumStatus } from "@/views/timeline/spectrum/spectrum-session";

// -- Helpers -------------------------------------------------------------------

function sourcePhrase(view: SpectrumStatusView): string {
  if (view.source === "lead") return "Lead Vocals";
  if (view.source === "backing") return "Backing Vocals";
  return "the mix";
}

function statusText(view: SpectrumStatusView, visible: boolean): string {
  if (!visible) return "Off. Turn it on to analyse this song.";
  if (view.status === "idle") return "No audio loaded";
  if (view.status === "decoding") return `Decoding ${sourcePhrase(view)}`;
  if (view.status === "analysing") return `Analysing ${sourcePhrase(view)} ・ ${view.percent}%`;
  if (view.source === "lead") return "Showing Lead Vocals";
  if (view.source === "backing") return "Showing Backing Vocals";
  return "Showing the full mix";
}

// -- Component -----------------------------------------------------------------

const SpectrumStatusLine: React.FC = () => {
  const view = useSpectrumStatus();
  const visible = useSettingsStore((s) => s.showSpectrum);
  if (visible && view.status === "error") {
    return <p className="text-[12.5px] text-composer-warning select-text cursor-text">{view.error}</p>;
  }
  const busy = visible && (view.status === "decoding" || view.status === "analysing");
  return (
    <p className="flex items-center gap-1.5 text-[12.5px] text-(--muted) tabular-nums">
      {busy && (
        <IconLoader2
          aria-hidden="true"
          className="size-3.5 text-composer-accent-text animate-spin motion-reduce:animate-none"
        />
      )}
      {statusText(view, visible)}
    </p>
  );
};

// -- Exports -------------------------------------------------------------------

export { SpectrumStatusLine };
