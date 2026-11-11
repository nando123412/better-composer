import type { Stem } from "@/audio/separation/types";

const LOG_PREFIX = "[StemMix]";

interface StemMixOptions {
  master: HTMLAudioElement;
  primary: Stem;
  stems: readonly Stem[];
  audibleStems: readonly Stem[];
  urls: Partial<Record<Stem, string>>;
}

function stemMixGain(volume: number, companionCount: number): number {
  return volume / Math.sqrt(companionCount + 1);
}

function syncStemMix({ master, primary, stems, audibleStems, urls }: StemMixOptions): () => void {
  const companionStems = new Map<HTMLAudioElement, Stem>();
  const companions = stems.flatMap((stem) => {
    const url = urls[stem];
    if (stem === primary || !url) return [];
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.playbackRate = master.playbackRate;
    audio.preservesPitch = master.preservesPitch;
    audio.volume = master.volume;
    audio.muted = master.muted || !audibleStems.includes(stem);
    audio.currentTime = Math.min(
      master.currentTime,
      Number.isFinite(audio.duration) ? audio.duration : master.currentTime,
    );
    document.body.appendChild(audio);
    companionStems.set(audio, stem);
    return [audio];
  });

  const syncPosition = () => {
    for (const audio of companions) {
      if (Math.abs(audio.currentTime - master.currentTime) > 0.08) {
        const limit = Number.isFinite(audio.duration) ? audio.duration : master.currentTime;
        audio.currentTime = Math.min(master.currentTime, limit);
        audio.playbackRate = master.playbackRate;
      }
      if (
        !master.paused &&
        audio.paused &&
        (!Number.isFinite(audio.duration) || master.currentTime < audio.duration - 0.05)
      ) {
        audio.currentTime = Math.min(
          master.currentTime,
          Number.isFinite(audio.duration) ? audio.duration : master.currentTime,
        );
        audio.play().catch((error: unknown) => console.warn(LOG_PREFIX, "could not resume a mixed stem", error));
      }
    }
  };
  const syncRate = () =>
    companions.forEach((audio) => {
      audio.playbackRate = master.playbackRate;
    });
  const syncVolume = () =>
    companions.forEach((audio) => {
      audio.volume = master.volume;
      const stem = companionStems.get(audio);
      audio.muted = master.muted || !stem || !audibleStems.includes(stem);
    });
  const play = () =>
    companions.forEach((audio) => {
      audio.currentTime = Math.min(
        master.currentTime,
        Number.isFinite(audio.duration) ? audio.duration : master.currentTime,
      );
      audio.playbackRate = master.playbackRate;
      audio.play().catch((error: unknown) => console.warn(LOG_PREFIX, "could not start a mixed stem", error));
    });
  const pause = () => companions.forEach((audio) => audio.pause());
  master.addEventListener("seeking", syncPosition);
  master.addEventListener("playing", syncPosition);
  master.addEventListener("ratechange", syncRate);
  master.addEventListener("volumechange", syncVolume);
  master.addEventListener("play", play);
  master.addEventListener("pause", pause);
  master.addEventListener("ended", pause);
  companions.forEach((audio) => audio.addEventListener("loadedmetadata", syncPosition));
  if (!master.paused) play();

  return () => {
    master.removeEventListener("seeking", syncPosition);
    master.removeEventListener("playing", syncPosition);
    master.removeEventListener("ratechange", syncRate);
    master.removeEventListener("volumechange", syncVolume);
    master.removeEventListener("play", play);
    master.removeEventListener("pause", pause);
    master.removeEventListener("ended", pause);
    companions.forEach((audio) => audio.removeEventListener("loadedmetadata", syncPosition));
    pause();
    companions.forEach((audio) => {
      audio.removeAttribute("src");
      audio.load();
      audio.remove();
    });
  };
}

export { stemMixGain, syncStemMix };
