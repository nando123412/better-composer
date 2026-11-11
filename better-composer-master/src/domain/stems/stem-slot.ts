// -- Types --------------------------------------------------------------------

type StemSlot = "vocals" | "backing" | "instrumental";
type SeparatedStemSlot = Exclude<StemSlot, "backing">;

type StemOrigin = "imported" | "separated";

// -- Constants ----------------------------------------------------------------

const STEM_SLOTS: readonly StemSlot[] = ["vocals", "backing", "instrumental"];
const SEPARATED_STEM_SLOTS = ["vocals", "instrumental"] as const satisfies readonly SeparatedStemSlot[];

// -- Exports ------------------------------------------------------------------

export type { SeparatedStemSlot, StemOrigin, StemSlot };
export { SEPARATED_STEM_SLOTS, STEM_SLOTS };
