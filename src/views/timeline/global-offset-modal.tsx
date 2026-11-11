import { useMemo, useRef, useState } from "react";
import { shiftLyricsTiming } from "@/domain/line/global-offset";
import { useProjectStore } from "@/stores/project";
import { Button } from "@/ui/button";
import { INPUT_STYLES } from "@/ui/input-styles";
import { Modal } from "@/ui/modal";

interface GlobalOffsetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalOffsetModal: React.FC<GlobalOffsetModalProps> = ({ isOpen, onClose }) => {
  const [value, setValue] = useState("0");
  const lines = useProjectStore((state) => state.lines);
  const inputRef = useRef<HTMLInputElement>(null);
  const parsedOffset = value.trim() === "" ? Number.NaN : Number(value);
  const result = useMemo(() => shiftLyricsTiming(lines, parsedOffset), [lines, parsedOffset]);
  const canApply = result.ok && result.updates.length > 0 && parsedOffset !== 0;

  const apply = () => {
    if (!canApply || !result.ok) return;
    useProjectStore.getState().updateLinesWithHistory(result.updates, {
      deriveText: false,
      propagateToSiblings: false,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Global timing offset"
      className="max-w-md"
      bodyClassName="flex flex-col gap-4"
      initialFocusRef={inputRef}
    >
      <p className="text-sm text-(--muted)">
        Shift every timed lyric line, word, and backing vocal together. Positive values move them later.
      </p>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-(--label)">Offset in milliseconds</span>
        <input
          ref={inputRef}
          type="number"
          step="1"
          className={INPUT_STYLES}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          aria-label="Offset in milliseconds"
          aria-invalid={!result.ok}
        />
      </label>
      {!result.ok && (
        <p role="alert" className="text-xs text-composer-error-text">
          {result.reason === "before-zero"
            ? "This offset would create negative timestamps."
            : "Enter a finite number of milliseconds."}
        </p>
      )}
      {result.ok && result.updates.length === 0 && (
        <p className="text-xs text-(--muted)">There are no timed lyrics to shift.</p>
      )}
      <p className="text-xs text-(--muted)">The change is one undo step.</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={apply} disabled={!canApply}>
          Apply offset
        </Button>
      </div>
    </Modal>
  );
};

export { GlobalOffsetModal };
