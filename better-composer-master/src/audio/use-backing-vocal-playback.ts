import { useEffect, useRef } from "react";
import type { Stem } from "@/audio/separation/types";

interface BackingVocalPlaybackOptions {
  audio: HTMLAudioElement | null;
  currentStem: Stem;
  backingUrl?: string;
  vocalOrigin?: string;
  playbackRate: number;
  preservePitch: boolean;
  volume: number;
  muted: boolean;
}

function useBackingVocalPlayback({
  audio,
  currentStem,
  backingUrl,
  vocalOrigin,
  playbackRate,
  preservePitch,
  volume,
  muted,
}: BackingVocalPlaybackOptions): void {
  const backingRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const shouldMix = currentStem === "vocals" && vocalOrigin === "imported" && backingUrl;
    if (!audio || !shouldMix) {
      backingRef.current?.pause();
      backingRef.current = null;
      return;
    }

    const backing = new Audio(backingUrl);
    backing.preload = "auto";
    backing.playbackRate = audio.playbackRate;
    backing.volume = audio.volume;
    backing.muted = audio.muted;
    backing.preservesPitch = audio.preservesPitch;
    backingRef.current = backing;

    const syncTime = () => {
      if (backing.readyState < HTMLMediaElement.HAVE_METADATA) return;
      if (Math.abs(backing.currentTime - audio.currentTime) > 0.08) backing.currentTime = audio.currentTime;
    };
    const start = () => {
      syncTime();
      void backing.play().catch(() => undefined);
    };
    const pause = () => backing.pause();
    const onBackingReady = () => {
      syncTime();
      if (!audio.paused) start();
    };
    audio.addEventListener("loadedmetadata", syncTime);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("seeking", syncTime);
    audio.addEventListener("play", start);
    audio.addEventListener("pause", pause);
    backing.addEventListener("loadedmetadata", onBackingReady);
    if (!audio.paused) start();

    return () => {
      audio.removeEventListener("loadedmetadata", syncTime);
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("seeking", syncTime);
      audio.removeEventListener("play", start);
      audio.removeEventListener("pause", pause);
      backing.removeEventListener("loadedmetadata", onBackingReady);
      backing.pause();
      backingRef.current = null;
    };
  }, [audio, currentStem, backingUrl, vocalOrigin]);

  useEffect(() => {
    const backing = backingRef.current;
    if (!backing) return;
    backing.playbackRate = playbackRate;
    backing.preservesPitch = preservePitch;
    backing.volume = volume;
    backing.muted = muted;
  }, [playbackRate, preservePitch, volume, muted]);
}

export { useBackingVocalPlayback };
