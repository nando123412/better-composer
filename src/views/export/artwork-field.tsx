import { IconPhoto, IconX } from "@tabler/icons-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { IconButton } from "@/ui/icon-button";
import { DETAILS_LABEL_STYLES } from "@/views/export/song-details-styles";

interface ArtworkFieldProps {
  artwork?: string;
  onChange: (artwork: string | undefined) => void;
}

const MAX_ARTWORK_EDGE = 512;

async function artworkDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_ARTWORK_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  try {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare the artwork image");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.86);
  } finally {
    bitmap.close();
  }
}

const ArtworkField: React.FC<ArtworkFieldProps> = ({ artwork, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      onChange(await artworkDataUrl(file));
    } catch (error) {
      console.error("[ArtworkField] could not prepare album artwork", error);
      toast.error("Could not load this artwork image");
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className={DETAILS_LABEL_STYLES}>Album artwork</span>
      <div className="flex items-center gap-3">
        {artwork ? (
          <img src={artwork} alt="Album artwork" className="size-14 rounded-lg object-cover" />
        ) : (
          <div
            aria-hidden="true"
            className="grid size-14 place-items-center rounded-lg bg-[var(--layer-2)] text-(--muted)"
          >
            <IconPhoto className="size-5" />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          aria-label="Upload album artwork"
          className="sr-only"
          onChange={(event) => {
            void handleFile(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        <Button variant="secondary" size="sm" hasIcon onClick={() => inputRef.current?.click()}>
          <IconPhoto className="size-4" />
          Choose image
        </Button>
        {artwork && (
          <IconButton
            label="Remove album artwork"
            icon={<IconX className="size-4" />}
            variant="ghost"
            onClick={() => onChange(undefined)}
          />
        )}
      </div>
      <span className="text-xs text-(--muted)">Images are scaled to 512 px for compact project storage.</span>
    </div>
  );
};

export { ArtworkField };
