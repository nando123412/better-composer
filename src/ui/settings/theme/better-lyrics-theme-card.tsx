import { type PointerEvent, useState } from "react";
import type { BetterLyricsListing } from "@/domain/better-lyrics-theme";
import { Button } from "@/ui/button";
import { getImagePalette } from "@/utils/image-palette";

interface BetterLyricsThemeCardProps {
  listing: BetterLyricsListing;
  active: boolean;
  installed: boolean;
  busy: boolean;
  onInstall: (repository: string) => void;
  onApply: (id: string) => void;
}

const BetterLyricsThemeCard: React.FC<BetterLyricsThemeCardProps> = ({
  listing,
  active,
  installed,
  busy,
  onInstall,
  onApply,
}) => {
  const [assetIndex, setAssetIndex] = useState(0);
  const [palette, setPalette] = useState<string[]>([]);
  const { metadata, assetUrls, source } = listing;
  const creator = Array.isArray(metadata.author) ? metadata.author.join(", ") : metadata.author;
  const description = metadata.description;
  const glowColors = [palette[0], palette[1] ?? palette[0], palette[2] ?? palette[0]];
  const glow = `radial-gradient(circle 180px at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColors[0]} 0%, ${glowColors[1]} 36%, ${glowColors[2]} 58%, transparent 82%)`;
  const updateGlowPosition = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--glow-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--glow-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <article
      className="group relative min-w-0"
      onPointerMove={updateGlowPosition}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty("--glow-x");
        event.currentTarget.style.removeProperty("--glow-y");
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 z-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60 group-focus-within:opacity-60"
        style={{ backgroundImage: glow }}
      />
      <div className="relative z-10 flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-(--edge) bg-(--well)">
        <div className="relative aspect-[16/9] overflow-hidden bg-black/10">
          {assetUrls[assetIndex] ? (
            <img
              src={assetUrls[assetIndex]}
              alt={`${metadata.name} theme preview`}
              loading="lazy"
              crossOrigin="anonymous"
              className="size-full object-cover"
              onLoad={(event) => setPalette(getImagePalette(event.currentTarget))}
              onError={() => {
                setPalette([]);
                setAssetIndex((index) => index + 1);
              }}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-4xl text-(--muted)" aria-hidden="true">
              ◇
            </div>
          )}
          {metadata.hasShaders === true && (
            <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
              Shaders
            </span>
          )}
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-composer-text">{metadata.name}</h4>
            {creator && <p className="truncate text-xs text-(--muted)">By {creator}</p>}
          </div>
          {description && <p className="line-clamp-2 min-h-8 text-xs leading-4 text-(--muted)">{description}</p>}
          <div className="flex flex-wrap gap-1">
            {(metadata.tags ?? []).slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-(--edge) px-2 py-0.5 text-[10px] text-(--muted)">
                {tag}
              </span>
            ))}
            <span className="ml-auto self-center text-[10px] text-(--muted)">v{metadata.version}</span>
          </div>
          <Button
            size="sm"
            variant={active ? "primary" : "secondary"}
            disabled={busy}
            onClick={() => (installed ? onApply(metadata.id) : onInstall(source))}
            className="mt-auto w-full"
          >
            {busy ? "Installing…" : active ? "Applied" : installed ? "Apply" : "Install"}
          </Button>
        </div>
      </div>
    </article>
  );
};

export { BetterLyricsThemeCard };
