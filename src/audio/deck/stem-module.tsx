import { useState } from "react";
import type { Stem } from "@/audio/separation/types";
import { noteGuideSignal } from "@/lib/guide-signals";
import { useAudioStore } from "@/stores/audio";
import { useSeparationStore } from "@/stores/separation";
import { Key } from "@/ui/key";
import { STEM_ICONS, STEM_LABELS } from "@/ui/stem-labels";
import { VocalSeparationDropdown } from "@/ui/vocal-separation-dropdown";

// -- Constants ----------------------------------------------------------------

const DECK_STEMS: readonly Stem[] = ["original", "lead", "backing", "instrumental"];

// -- Component ----------------------------------------------------------------

const StemModule: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [moduleElement, setModuleElement] = useState<HTMLDivElement | null>(null);
  const hasSource = useAudioStore((state) => state.source !== null);
  const currentStem = useSeparationStore((state) => state.currentStem);
  const mixStems = useSeparationStore((state) => state.mixStems);
  const availableStems = useSeparationStore((state) => state.availableStems);
  const selectStem = useSeparationStore((state) => state.selectStem);

  if (!hasSource) return null;

  return (
    <div ref={setModuleElement} className="flex items-center gap-2">
      <VocalSeparationDropdown open={open} onOpenChange={setOpen} positionAnchor={moduleElement} />
      <div role="group" aria-label="Playback source" className="flex gap-1">
        {DECK_STEMS.map((stem) => {
          const Icon = STEM_ICONS[stem];
          const label =
            stem === "lead" && !availableStems.includes("lead") && availableStems.includes("vocals")
              ? STEM_LABELS.vocals
              : STEM_LABELS[stem];
          const available =
            stem === "lead"
              ? availableStems.includes("lead") || availableStems.includes("vocals")
              : availableStems.includes(stem);
          const selected =
            stem === "lead"
              ? currentStem === "lead" || (currentStem === "vocals" && !availableStems.includes("lead"))
              : currentStem === stem || mixStems.includes(stem);
          return (
            <Key
              key={stem}
              aria-pressed={selected}
              aria-label={available ? label : `${label}, import or separate first`}
              title={label}
              data-unavailable={available ? undefined : ""}
              onClick={() => {
                if (!available) {
                  setOpen(true);
                  return;
                }
                if (stem === "lead" && !availableStems.includes("lead")) selectStem("vocals");
                else selectStem(stem);
                if (useSeparationStore.getState().currentStem !== "original") noteGuideSignal("timeline.stems");
              }}
              className="w-9"
            >
              <Icon aria-hidden="true" className="size-[15px]" />
            </Key>
          );
        })}
      </div>
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { StemModule };
