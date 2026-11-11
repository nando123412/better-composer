// -- Types --------------------------------------------------------------------

type SeparatedStemSlot = "vocals" | "instrumental";
type StemSlot = SeparatedStemSlot | "lead" | "backing";

type StemOrigin = "imported" | "separated";

// -- Constants ----------------------------------------------------------------

const STEM_SLOTS: readonly SeparatedStemSlot[] = ["vocals", "instrumental"];
const PROJECT_STEM_SLOTS: readonly StemSlot[] = [...STEM_SLOTS, "lead", "backing"];

// -- Exports ------------------------------------------------------------------

export type { SeparatedStemSlot, StemOrigin, StemSlot };
export { PROJECT_STEM_SLOTS, STEM_SLOTS };
