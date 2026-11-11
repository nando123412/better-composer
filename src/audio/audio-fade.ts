const FADE_INTERVAL_MS = 12;
const activeFades = new WeakMap<HTMLAudioElement, number>();
let nextFadeId = 0;

function fadeAudioVolume(audio: HTMLAudioElement, target: number, durationMs: number): Promise<void> {
  const previousId = activeFades.get(audio);
  if (previousId !== undefined) activeFades.set(audio, previousId + 1);
  const fadeId = ++nextFadeId;
  activeFades.set(audio, fadeId);
  const startVolume = audio.volume;
  const startTime = performance.now();
  return new Promise((resolve) => {
    const interval = window.setInterval(() => {
      if (activeFades.get(audio) !== fadeId) {
        window.clearInterval(interval);
        resolve();
        return;
      }
      const progress = Math.min(1, (performance.now() - startTime) / durationMs);
      audio.volume = startVolume + (target - startVolume) * progress;
      if (progress === 1) {
        window.clearInterval(interval);
        activeFades.delete(audio);
        resolve();
      }
    }, FADE_INTERVAL_MS);
  });
}

export { fadeAudioVolume };
