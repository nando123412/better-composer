import type { AnalysisWindow, SpectrumSource } from "@/domain/spectrum/settings";

// -- Types --------------------------------------------------------------------

interface ResolvedAnalysis {
  source: SpectrumSource;
  fftSize: number;
  hop: number;
}

// -- Functions ----------------------------------------------------------------

// Vocal stems need time detail for syllable edges; a full mix uses finer bins to separate parts.
function resolveAnalysis(preference: SpectrumSource, window: AnalysisWindow, hasStem: boolean): ResolvedAnalysis {
  const source: SpectrumSource = preference !== "mix" && hasStem ? preference : "mix";
  const fftSize = window === "auto" ? (source === "mix" ? 2048 : 1024) : Number(window);
  return { source, fftSize, hop: fftSize / 4 };
}

// -- Exports ------------------------------------------------------------------

export type { ResolvedAnalysis };
export { resolveAnalysis };
