import { type Icon, IconMicrophone, IconMusic, IconWaveSine } from "@tabler/icons-react";
import type { Stem } from "@/audio/separation/types";

// -- Constants ----------------------------------------------------------------

const STEM_LABELS: Record<Stem, string> = {
  original: "Original",
  vocals: "All Vocals",
  instrumental: "Instrumental",
  lead: "Lead Vocals",
  backing: "Backing Vocals",
};

const STEM_ICONS: Record<Stem, Icon> = {
  original: IconWaveSine,
  vocals: IconMicrophone,
  instrumental: IconMusic,
  lead: IconMicrophone,
  backing: IconMicrophone,
};

// -- Exports ------------------------------------------------------------------

export { STEM_ICONS, STEM_LABELS };
