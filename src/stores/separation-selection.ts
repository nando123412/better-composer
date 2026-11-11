import type { Stem } from "@/audio/separation/types";
import type { SeparationState } from "@/stores/separation";

type SelectionState = Pick<SeparationState, "availableStems" | "currentStem" | "mixStems">;
type SelectionSetter = (partial: Partial<SeparationState>) => void;

function selectStem(state: SelectionState, set: SelectionSetter, stem: Stem): void {
  if (!state.availableStems.includes(stem)) return;
  if (stem === "original") {
    set({ currentStem: stem, mixStems: [] });
    return;
  }
  if (stem === "instrumental" && ["vocals", "lead", "backing"].includes(state.currentStem)) {
    set({
      mixStems: state.mixStems.includes(stem)
        ? state.mixStems.filter((item) => item !== stem)
        : [...state.mixStems, stem],
    });
    return;
  }
  const keepInstrumental =
    stem !== "instrumental" && (state.mixStems.includes("instrumental") || state.currentStem === "instrumental");
  const mixStems: Stem[] = keepInstrumental ? ["instrumental"] : [];
  set({ currentStem: stem, otherStem: stem, mixStems });
}

function selectAllVocals(state: SelectionState, set: SelectionSetter): void {
  const keepInstrumental = state.mixStems.includes("instrumental") || state.currentStem === "instrumental";
  if (state.availableStems.includes("lead") && state.availableStems.includes("backing")) {
    const mixStems: Stem[] = keepInstrumental ? ["backing", "instrumental"] : ["backing"];
    set({ currentStem: "lead", otherStem: "lead", mixStems });
    return;
  }
  if (state.availableStems.includes("vocals")) {
    set({
      currentStem: "vocals",
      otherStem: "vocals",
      mixStems: keepInstrumental ? ["instrumental"] : [],
    });
  }
}

export { selectAllVocals, selectStem };
