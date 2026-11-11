import type { ProjectMetadata } from "@/domain/project/metadata";
import type { SourceMetadata } from "@/domain/project/source-metadata";
import type { AudioSource } from "@/stores/audio";
import { audioTagsToMetadata } from "@/utils/audio-tags";
import { fileNameWithoutExtension } from "@/utils/file-name";
import { normalizeIsrc } from "@/utils/isrc";

// -- Types --------------------------------------------------------------------

interface VideoSongDetails {
  filename?: string;
  title?: string;
  artist?: string;
  album?: string;
  isrc?: string;
}

interface PendingSwap {
  target: AudioSource;
  baseline: Promise<SourceMetadata>;
}

// -- Constants ----------------------------------------------------------------

const LOG_PREFIX = "[SourceMetadata]";

type FileSourceMetadata = SourceMetadata & Pick<Partial<ProjectMetadata>, "thumbnailDataUrl">;

// -- State --------------------------------------------------------------------

let pendingSwap: PendingSwap | null = null;

// -- Functions ----------------------------------------------------------------

async function readAudioTags(file: File): Promise<Partial<ProjectMetadata>> {
  const { parseBlob } = await import("music-metadata");
  const { common } = await parseBlob(file);
  const metadata = audioTagsToMetadata(common);
  const picture = common.picture?.find((candidate) => candidate.format.startsWith("image/"));
  if (picture && typeof createImageBitmap === "function" && typeof document !== "undefined") {
    let bitmap: ImageBitmap | undefined;
    try {
      const blob = new Blob([Uint8Array.from(picture.data)], { type: picture.format });
      bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = 112;
      canvas.height = 112;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        metadata.thumbnailDataUrl = canvas.toDataURL("image/webp", 0.68);
      }
    } catch (error) {
      console.warn("[Composer] could not read embedded album artwork", error);
    } finally {
      bitmap?.close();
    }
  }
  return metadata;
}

async function fileSourceMetadata(file: File): Promise<FileSourceMetadata> {
  const fromName = { title: fileNameWithoutExtension(file.name) };
  try {
    return { ...fromName, ...(await readAudioTags(file)) };
  } catch (error) {
    console.warn(LOG_PREFIX, "could not read audio tags", error);
    return fromName;
  }
}

function videoSourceMetadata(videoId: string, details?: VideoSongDetails): SourceMetadata {
  const metadata: SourceMetadata = { title: details?.title || details?.filename || videoId };
  if (details?.artist) metadata.artists = [details.artist];
  if (details?.album) metadata.album = details.album;
  const isrc = details?.isrc ? normalizeIsrc(details.isrc) : undefined;
  if (isrc) metadata.isrc = isrc;
  return metadata;
}

function sourceMetadata(source: AudioSource): Promise<SourceMetadata> {
  if (source?.type === "file") return fileSourceMetadata(source.file);
  if (source?.type === "youtube") return Promise.resolve({ title: source.videoId, ...source.details });
  return Promise.resolve({});
}

function beginSourceSwap(previous: AudioSource, target: AudioSource): Promise<SourceMetadata> {
  const baseline = pendingSwap?.target === previous ? pendingSwap.baseline : sourceMetadata(previous);
  pendingSwap = { target, baseline };
  return baseline;
}

function settleSourceSwap(target: AudioSource): boolean {
  if (pendingSwap?.target !== target) return false;
  pendingSwap = null;
  return true;
}

// -- Exports ------------------------------------------------------------------

export { beginSourceSwap, fileSourceMetadata, readAudioTags, settleSourceSwap, videoSourceMetadata };
