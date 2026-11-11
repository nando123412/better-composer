import type { LineUpdate, LyricLine } from "@/domain/line/model";
import { isLineSynced, isWordSynced } from "@/domain/line/predicates";
import type { WordTiming } from "@/domain/word/timing";

type ShiftLyricsTimingResult =
  | { ok: true; updates: LineUpdate[] }
  | { ok: false; reason: "before-zero" | "invalid-offset" };

function shiftWords(words: readonly WordTiming[], offsetSeconds: number): WordTiming[] {
  return words.map((word) => ({ ...word, begin: word.begin + offsetSeconds, end: word.end + offsetSeconds }));
}

function shiftedTimes(lines: readonly LyricLine[]): number[] {
  return lines.flatMap((line) => [
    ...(isLineSynced(line) ? [line.begin, line.end] : []),
    ...(isWordSynced(line) ? (line.words ?? []).flatMap((word) => [word.begin, word.end]) : []),
    ...(line.backgroundWords?.flatMap((word) => [word.begin, word.end]) ?? []),
  ]);
}

function shiftedLine(line: LyricLine, offsetSeconds: number): LineUpdate | null {
  const mainTiming = isLineSynced(line)
    ? { begin: line.begin + offsetSeconds, end: line.end + offsetSeconds }
    : isWordSynced(line)
      ? { words: shiftWords(line.words ?? [], offsetSeconds) }
      : {};
  const backgroundTiming = line.backgroundWords?.length
    ? { backgroundWords: shiftWords(line.backgroundWords, offsetSeconds) }
    : {};
  const updates = { ...mainTiming, ...backgroundTiming };
  if (Object.keys(updates).length === 0) return null;
  return { id: line.id, updates };
}

function shiftLyricsTiming(lines: readonly LyricLine[], offsetMs: number): ShiftLyricsTimingResult {
  if (!Number.isFinite(offsetMs)) return { ok: false, reason: "invalid-offset" };
  const offsetSeconds = offsetMs / 1000;
  if (shiftedTimes(lines).some((time) => time + offsetSeconds < 0)) {
    return { ok: false, reason: "before-zero" };
  }
  return {
    ok: true,
    updates: lines.flatMap((line) => {
      const update = shiftedLine(line, offsetSeconds);
      return update ? [update] : [];
    }),
  };
}

export type { ShiftLyricsTimingResult };
export { shiftLyricsTiming };
