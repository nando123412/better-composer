import { describe, expect, it } from "vitest";
import { resolveAnalysis } from "@/domain/spectrum/analysis-window";

describe("resolveAnalysis", () => {
  it("analyses vocal stems at 1024 and the mix at 2048 on Auto", () => {
    expect(resolveAnalysis("lead", "auto", true)).toEqual({ source: "lead", fftSize: 1024, hop: 256 });
    expect(resolveAnalysis("backing", "auto", true)).toEqual({ source: "backing", fftSize: 1024, hop: 256 });
    expect(resolveAnalysis("mix", "auto", true)).toEqual({ source: "mix", fftSize: 2048, hop: 512 });
  });

  it("falls back to the mix when there is no vocal stem", () => {
    expect(resolveAnalysis("lead", "auto", false)).toEqual({ source: "mix", fftSize: 2048, hop: 512 });
  });

  it("honours a fixed window on either source", () => {
    expect(resolveAnalysis("lead", "2048", true)).toEqual({ source: "lead", fftSize: 2048, hop: 512 });
  });
});
