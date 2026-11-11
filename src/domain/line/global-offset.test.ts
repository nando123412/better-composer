import { describe, expect, it } from "vitest";
import { shiftLyricsTiming } from "@/domain/line/global-offset";
import type { LyricLine } from "@/domain/line/model";

describe("shiftLyricsTiming", () => {
  it("shifts line, word, and background timings while leaving untimed lines alone", () => {
    const lines: LyricLine[] = [
      {
        id: "line",
        text: "Line synced",
        agentId: "v1",
        begin: 2,
        end: 4,
        backgroundWords: [{ text: "yeah", begin: 3, end: 3.5 }],
      },
      {
        id: "words",
        text: "Word synced",
        agentId: "v1",
        words: [{ text: "word", begin: 5, end: 5.5, explicit: true }],
        backgroundWords: [{ text: "ooh", begin: 5.5, end: 6 }],
      },
      { id: "plain", text: "Untimed", agentId: "v1" },
    ];

    expect(shiftLyricsTiming(lines, 250)).toEqual({
      ok: true,
      updates: [
        {
          id: "line",
          updates: { begin: 2.25, end: 4.25, backgroundWords: [{ text: "yeah", begin: 3.25, end: 3.75 }] },
        },
        {
          id: "words",
          updates: {
            words: [{ text: "word", begin: 5.25, end: 5.75, explicit: true }],
            backgroundWords: [{ text: "ooh", begin: 5.75, end: 6.25 }],
          },
        },
      ],
    });
  });

  it("refuses an offset that would create negative timestamps", () => {
    const lines: LyricLine[] = [{ id: "line", text: "Start", agentId: "v1", begin: 0, end: 1 }];

    expect(shiftLyricsTiming(lines, -1)).toEqual({ ok: false, reason: "before-zero" });
  });
});
