import { HelpTopic } from "@/ui/help-topic";
import { SettingLink } from "@/ui/setting-link";
import { PROSE } from "@/ui/typography";

// -- Preview ------------------------------------------------------------------

const PreviewSection: React.FC = () => (
  <HelpTopic title="Preview" showTitle={false} className="space-y-3 max-w-[68ch]">
    <p className={PROSE}>
      The Preview tab shows your synced lyrics with Apple Music-like word highlighting on the same animated artwork
      background used by the resume card on the Projects page. The Timeline sidebar can use Braccato or Apple Music-like
      lyrics through the <SettingLink setting="previewRenderer" />. Words fill in progressively as they're sung,
      matching the timing you set.
    </p>
    <ul className={`${PROSE} list-disc pl-[18px] marker:text-(--muted) space-y-1`}>
      <li>Agent lines are positioned based on their inferred location (left, right, center).</li>
      <li>Background vocals appear below the main line in a smaller style.</li>
      <li>
        Use this to spot timing issues. If a word highlights too early or too late, go back to Timeline and adjust.
      </li>
      <li>Playback controls (play/pause, seek) work the same as everywhere else.</li>
      <li>
        Instrumental sections appear automatically wherever there's a gap longer than 5 seconds between sung lines.
        Better Lyrics handles this at render time. You can't add them manually or preview them here, but they will show
        up in the final output.
      </li>
    </ul>
  </HelpTopic>
);

// -- Exports ------------------------------------------------------------------

export { PreviewSection };
