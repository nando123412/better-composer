import { type Icon, IconMicrophone, IconMusic, IconWaveSine } from "@tabler/icons-react";
import type { Stem } from "@/audio/separation/types";

// -- Constants ----------------------------------------------------------------

const STEM_LABELS: Record<Stem, string> = {
  original: "Original",
  vocals: "Vocals",
  lead: "Lead",
  backing: "Backing",
  instrumental: "Instrumental",
};

const STEM_ICONS: Record<Stem, Icon> = {
  original: IconWaveSine,
  vocals: IconMicrophone,
  lead: IconMicrophone,
  backing: IconMicrophone,
  instrumental: IconMusic,
};

// -- Exports ------------------------------------------------------------------

export { STEM_ICONS, STEM_LABELS };
