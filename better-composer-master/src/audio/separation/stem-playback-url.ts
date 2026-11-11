import type { Stem } from "@/audio/separation/types";

function stemPlaybackUrl(stem: Stem, urls: Partial<Record<Stem, string>>): string | undefined {
  return stem === "lead" ? urls.vocals : urls[stem];
}

export { stemPlaybackUrl };
