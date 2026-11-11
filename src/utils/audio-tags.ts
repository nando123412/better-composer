import type { ICommonTagsResult } from "music-metadata";
import type { ProjectMetadata } from "@/domain/project/metadata";
import { normalizeIsrc } from "@/utils/isrc";

// -- Mapper -------------------------------------------------------------------

function audioTagsToMetadata(common: Partial<ICommonTagsResult>): Partial<ProjectMetadata> {
  const out: Partial<ProjectMetadata> = {};
  if (common.title) out.title = common.title;
  const artists = common.artists?.filter(Boolean) ?? (common.artist ? [common.artist] : []);
  if (artists.length) out.artists = artists;
  if (common.album) out.album = common.album;
  const isrc = common.isrc?.map(normalizeIsrc).find(Boolean);
  if (isrc) out.isrc = isrc;
  const picture = common.picture?.find((candidate) => candidate.data.length > 0);
  if (picture) {
    let binary = "";
    for (let index = 0; index < picture.data.length; index += 0x8000) {
      binary += String.fromCharCode(...picture.data.subarray(index, index + 0x8000));
    }
    out.thumbnailDataUrl = `data:${picture.format};base64,${btoa(binary)}`;
    out.thumbnailForVideoId = undefined;
  }
  return out;
}

// -- Exports ------------------------------------------------------------------

export { audioTagsToMetadata };
