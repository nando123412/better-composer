import { IconPalette } from "@tabler/icons-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useProjectStore } from "@/stores/project";

// -- State --------------------------------------------------------------------

const STORAGE_KEY = "composer.artwork-ambience";
const CHANGE_EVENT = "composer:artwork-ambience-change";
const DEFAULT_PALETTE = ["#514874", "#315b62"] as const;

function readAmbiencePreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function setAmbiencePreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch (error) {
    console.warn("[Composer] could not save artwork ambience preference", error);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function useAmbiencePreference(): [boolean, (enabled: boolean) => void] {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const refresh = () => setEnabled(readAmbiencePreference());
    refresh();
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => window.removeEventListener(CHANGE_EVENT, refresh);
  }, []);
  return [enabled, setAmbiencePreference];
}

// -- Palette extraction -------------------------------------------------------

function paletteFromImage(image: HTMLImageElement): readonly [string, string] {
  const canvas = document.createElement("canvas");
  canvas.width = 24;
  canvas.height = 24;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return DEFAULT_PALETTE;
  context.drawImage(image, 0, 0, 24, 24);
  const pixels = context.getImageData(0, 0, 24, 24).data;
  const buckets = new Map<number, { score: number; r: number; g: number; b: number; count: number }>();
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (pixels[i + 3] < 160) continue;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const luminance = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
    if (luminance < 0.12 || luminance > 0.88) continue;
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key) ?? { score: 0, r: 0, g: 0, b: 0, count: 0 };
    bucket.score += 0.35 + saturation;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.count += 1;
    buckets.set(key, bucket);
  }
  const colors = [...buckets.values()].sort((a, b) => b.score - a.score).slice(0, 2);
  if (colors.length === 0) return DEFAULT_PALETTE;
  const hex = (value: number) => Math.round(value).toString(16).padStart(2, "0");
  const colorAt = (index: number) => {
    const c = colors[index] ?? colors[0];
    return `#${hex(c.r / c.count)}${hex(c.g / c.count)}${hex(c.b / c.count)}`;
  };
  return [colorAt(0), colorAt(1)];
}

// -- Components ---------------------------------------------------------------

const ArtworkAtmosphere: React.FC = () => {
  const artwork = useProjectStore((state) => state.metadata.thumbnailDataUrl);
  const [enabled] = useAmbiencePreference();
  const [palette, setPalette] = useState<readonly [string, string]>(DEFAULT_PALETTE);
  const [hasArtwork, setHasArtwork] = useState(false);
  const reducedMotion = useReducedMotion();
  const atmosphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!artwork) {
      setPalette(DEFAULT_PALETTE);
      setHasArtwork(false);
      return;
    }
    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active) return;
      try {
        setPalette(paletteFromImage(image));
        setHasArtwork(true);
      } catch (error) {
        console.warn("[Composer] could not read album artwork colors", error);
        setPalette(DEFAULT_PALETTE);
        setHasArtwork(false);
      }
    };
    image.onerror = () => {
      if (active) {
        setPalette(DEFAULT_PALETTE);
        setHasArtwork(false);
      }
    };
    image.src = artwork;
    return () => {
      active = false;
    };
  }, [artwork]);

  useEffect(() => {
    const appRoot = atmosphereRef.current?.parentElement;
    if (!appRoot) return;
    appRoot.style.setProperty("--artwork-a", palette[0]);
    appRoot.style.setProperty("--artwork-b", palette[1]);
    appRoot.toggleAttribute("data-artwork-enabled", enabled && hasArtwork);
    return () => {
      appRoot.style.removeProperty("--artwork-a");
      appRoot.style.removeProperty("--artwork-b");
      appRoot.removeAttribute("data-artwork-enabled");
    };
  }, [enabled, hasArtwork, palette]);

  return (
    <div
      ref={atmosphereRef}
      aria-hidden="true"
      className="artwork-atmosphere"
      data-enabled={enabled && hasArtwork}
      data-motion={reducedMotion !== true}
    />
  );
};

const ArtworkAmbienceToggle: React.FC = () => {
  const [enabled, setEnabled] = useAmbiencePreference();
  return (
    <button
      type="button"
      aria-label={`${enabled ? "Disable" : "Enable"} artwork ambience`}
      aria-pressed={enabled}
      title={`${enabled ? "Disable" : "Enable"} artwork ambience`}
      onClick={() => setEnabled(!enabled)}
      className="artwork-ambience-toggle"
    >
      <IconPalette aria-hidden="true" className="size-[17px]" />
    </button>
  );
};

// -- Exports ------------------------------------------------------------------

export { ArtworkAmbienceToggle, ArtworkAtmosphere };
