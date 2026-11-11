import { IconCheck, IconUpload } from "@tabler/icons-react";
import type { Stem } from "@/audio/separation/types";
import { STEM_SLOTS, type StemOrigin, type StemSlot } from "@/domain/stems/stem-slot";
import { useSeparationStore } from "@/stores/separation";
import { STEM_ICONS, STEM_LABELS } from "@/ui/stem-labels";
import { OriginTag } from "@/ui/stem-sources/origin-tag";
import { StemLengthWarning } from "@/ui/stem-sources/stem-length-warning";
import { StemRowMenu } from "@/ui/stem-sources/stem-row-menu";
import { useStemFileImport } from "@/ui/stem-sources/use-stem-file-import";
import { cn } from "@/utils/cn";

// -- Types --------------------------------------------------------------------

interface StemSourceRowsProps {
  onSelect: (stem: Stem) => void;
}

interface SourceButtonProps {
  stem: Stem;
  label?: string;
  selected: boolean;
  origin?: StemOrigin;
  onSelect: (stem: Stem) => void;
}

interface EmptySlotButtonProps {
  slot: StemSlot;
  separating: boolean;
  dropping: boolean;
  onImport: () => void;
}

// -- Constants ----------------------------------------------------------------

const ROW_BUTTON =
  "flex flex-1 min-w-0 items-center gap-2.5 h-8.5 pl-2 pr-2.5 rounded-md text-[13px] font-medium text-left select-none transition-colors duration-150 motion-reduce:transition-none";

const ROW_ICON = "size-4 shrink-0 text-(--muted)";

const DROP_LOOK = "bg-composer-accent/12 inset-ring inset-ring-composer-accent/60";

// -- Components ---------------------------------------------------------------

const SourceButton: React.FC<SourceButtonProps> = ({ stem, label, selected, origin, onSelect }) => {
  const Icon = STEM_ICONS[stem];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(stem)}
      className={cn(
        ROW_BUTTON,
        "cursor-pointer text-(--label) aria-checked:text-composer-text",
        origin ? "pr-1 group-hover/row:text-composer-text" : "hover:bg-(--layer-2) hover:text-composer-text",
      )}
    >
      <Icon aria-hidden="true" className={ROW_ICON} />
      <span className="flex-1 min-w-0">
        {label ?? STEM_LABELS[stem]}
        {origin && <OriginTag origin={origin} />}
      </span>
      <IconCheck
        aria-hidden="true"
        className={cn("size-4 shrink-0 text-composer-accent-text", !selected && "invisible")}
      />
    </button>
  );
};

const EmptySlotButton: React.FC<EmptySlotButtonProps> = ({ slot, separating, dropping, onImport }) => {
  const Icon = STEM_ICONS[slot];
  const label = STEM_LABELS[slot];
  return (
    <button
      type="button"
      disabled={separating}
      aria-label={separating ? `${label}, separating` : `Import ${label.toLowerCase()} file`}
      onClick={onImport}
      className={cn(
        ROW_BUTTON,
        "text-(--muted)",
        separating ? "cursor-default" : "cursor-pointer",
        !separating && !dropping && "hover:bg-(--layer-2)",
      )}
    >
      <Icon aria-hidden="true" className={ROW_ICON} />
      <span className="flex-1 min-w-0 text-(--label)">{label}</span>
      {separating ? (
        <span className="text-xs font-normal tabular-nums">Separating…</span>
      ) : (
        <span
          className={cn(
            "inline-flex items-center gap-[5px] text-[12.5px]",
            dropping ? "text-composer-text" : "text-composer-accent-text",
          )}
        >
          {dropping ? (
            "Drop to import"
          ) : (
            <>
              <IconUpload aria-hidden="true" className="size-3.5" />
              Import file
            </>
          )}
        </span>
      )}
    </button>
  );
};

const StemSourceRows: React.FC<StemSourceRowsProps> = ({ onSelect }) => {
  const currentStem = useSeparationStore((s) => s.currentStem);
  const stemUrls = useSeparationStore((s) => s.stemUrls);
  const stemOrigins = useSeparationStore((s) => s.stemOrigins);
  const pendingImport = useSeparationStore((s) => s.pendingImport);
  const importError = useSeparationStore((s) => s.importError);
  const separating = useSeparationStore((s) => s.status === "downloading" || s.status === "processing");
  const { fileInputProps, openFilePicker, dropSlot, dropHandlers } = useStemFileImport();
  const leadBackingGroup = stemOrigins.vocals === "imported" && stemUrls.vocals && stemUrls.backing;

  const notices = (slot: StemSlot) => (
    <>
      {pendingImport?.slot === slot && (
        <StemLengthWarning fileName={pendingImport.file.name} mismatchSeconds={pendingImport.mismatchSeconds} />
      )}
      {importError?.slot === slot && (
        <p className="px-2 mt-0.5 mb-1.5 text-[12.5px] leading-[1.45] text-composer-negative wrap-break-word select-text">
          {importError.message}
        </p>
      )}
    </>
  );

  return (
    <div role="radiogroup" aria-label="Playback source" className="grid gap-0.5 -mx-1.5 mt-2">
      <SourceButton stem="original" selected={currentStem === "original"} onSelect={onSelect} />
      {STEM_SLOTS.map((slot) => {
        if (slot === "backing" && leadBackingGroup) return null;
        const filled = stemUrls[slot] !== undefined;
        const origin = stemOrigins[slot] ?? "separated";
        const dropping = dropSlot === slot;
        if (slot === "vocals" && leadBackingGroup) {
          const backingOrigin = stemOrigins.backing ?? "imported";
          return (
            <div key={slot} className="grid">
              <SourceButton stem="vocals" label="Vocals" selected={currentStem === "vocals"} onSelect={onSelect} />
              <div className="ml-6 grid border-l border-(--divider) pl-1">
                <div
                  {...dropHandlers("vocals")}
                  className={cn(
                    "group/row flex items-center rounded-md hover:bg-(--layer-2)",
                    dropSlot === "vocals" && DROP_LOOK,
                  )}
                >
                  <SourceButton
                    stem="lead"
                    label="Lead"
                    selected={currentStem === "lead"}
                    origin="imported"
                    onSelect={onSelect}
                  />
                  <StemRowMenu slot="vocals" origin="imported" onImportFile={openFilePicker} />
                </div>
                {notices("vocals")}
                <div
                  {...dropHandlers("backing")}
                  className={cn("group/row flex items-center rounded-md", dropSlot === "backing" && DROP_LOOK)}
                >
                  <SourceButton
                    stem="backing"
                    selected={currentStem === "backing"}
                    origin={backingOrigin}
                    onSelect={onSelect}
                  />
                  <StemRowMenu slot="backing" origin={backingOrigin} onImportFile={openFilePicker} />
                </div>
                {notices("backing")}
              </div>
            </div>
          );
        }
        return (
          <div
            key={slot}
            className={cn(slot === "backing" && leadBackingGroup && "ml-6 border-l border-(--divider) pl-1")}
          >
            <div
              {...(filled || !separating ? dropHandlers(slot) : {})}
              className={cn(
                "group/row flex items-center rounded-md transition-colors duration-150 motion-reduce:transition-none",
                filled && "hover:bg-(--layer-2)",
                dropping && DROP_LOOK,
              )}
            >
              {filled ? (
                <>
                  <SourceButton
                    stem={slot === "vocals" && origin === "imported" ? "lead" : slot}
                    label={slot === "vocals" && origin === "separated" ? "All Vocals" : undefined}
                    selected={currentStem === slot || (slot === "vocals" && currentStem === "lead")}
                    origin={origin}
                    onSelect={onSelect}
                  />
                  <StemRowMenu slot={slot} origin={origin} onImportFile={openFilePicker} />
                </>
              ) : (
                <EmptySlotButton
                  slot={slot}
                  separating={separating}
                  dropping={dropping}
                  onImport={() => openFilePicker(slot)}
                />
              )}
            </div>
            {notices(slot)}
          </div>
        );
      })}
      <input {...fileInputProps} />
    </div>
  );
};

// -- Exports ------------------------------------------------------------------

export { StemSourceRows };
