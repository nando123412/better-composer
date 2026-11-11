import { LyricPlayer, type LyricPlayerRef } from "@applemusic-like-lyrics/react";
import { parseTTML } from "@applemusic-like-lyrics/ttml";
import "@applemusic-like-lyrics/core/style.css";
import { useMemo, useRef } from "react";
import { useFrameLoop } from "@/hooks/use-frame-loop";
import type { LyricsLayout } from "@/views/preview/lyrics-layout";
import { AUDIO_STORE_PLAYBACK } from "@/views/preview/renderer-playback";

interface AmllRendererProps {
  ttmlString: string;
  layout: LyricsLayout;
}

const AmllRenderer: React.FC<AmllRendererProps> = ({ ttmlString, layout }) => {
  const playerRef = useRef<LyricPlayerRef>(null);
  const lyrics = useMemo(() => parseTTML(ttmlString).lines, [ttmlString]);

  useFrameLoop(() => {
    const sample = AUDIO_STORE_PLAYBACK.sample();
    playerRef.current?.lyricPlayer?.setCurrentTime(Math.round((sample?.currentTime ?? 0) * 1000));
  }, "amll-renderer");

  return (
    <div className="flex h-full min-h-0 w-full justify-center overflow-hidden">
      <LyricPlayer
        ref={playerRef}
        lyricLines={lyrics}
        enableSpring
        enableBlur
        enableScale
        alignPosition={0.46}
        className={layout === "sidebar" ? "h-full w-full px-2" : "h-full w-full max-w-5xl px-8"}
      />
    </div>
  );
};

export { AmllRenderer };
