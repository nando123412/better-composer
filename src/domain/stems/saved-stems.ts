import { PROJECT_STEM_SLOTS, type StemOrigin, type StemSlot } from "@/domain/stems/stem-slot";

// -- Types --------------------------------------------------------------------

interface SavedProjectStem {
  origin: StemOrigin;
  name: string;
  type: string;
  data: ArrayBuffer;
  durationSeconds: number;
  revision: number;
  // Set on every stem written by a build with the corrected MP3 decode.
  primingCorrected?: boolean;
}

interface SavedProjectStems {
  songKey: string;
  revision: number;
  slots: Partial<Record<StemSlot, SavedProjectStem>>;
}

// -- Functions ----------------------------------------------------------------

function storedStemBytes(stems: SavedProjectStems | undefined): number {
  let total = 0;
  for (const slot of PROJECT_STEM_SLOTS) total += stems?.slots[slot]?.data.byteLength ?? 0;
  return total;
}

// -- Exports ------------------------------------------------------------------

export type { SavedProjectStem, SavedProjectStems };
export { storedStemBytes };
