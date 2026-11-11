import { IconPalette } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { HEADER_ICON_STYLES } from "@/ui/header-icon-styles";
import { IconButton } from "@/ui/icon-button";

const STORAGE_KEY = "composer.artwork-ambience";
const CHANGE_EVENT = "composer:artwork-ambience-change";

function readAmbiencePreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function writeAmbiencePreference(enabled: boolean): void {
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
  return [enabled, writeAmbiencePreference];
}

const ArtworkAmbienceToggle: React.FC = () => {
  const [enabled, setEnabled] = useAmbiencePreference();
  return (
    <IconButton
      variant="ghost"
      label={`${enabled ? "Disable" : "Enable"} artwork ambience`}
      title={`${enabled ? "Disable" : "Enable"} artwork ambience`}
      aria-label={`${enabled ? "Disable" : "Enable"} artwork ambience`}
      aria-pressed={enabled}
      onClick={() => setEnabled(!enabled)}
      className={HEADER_ICON_STYLES}
      icon={<IconPalette aria-hidden="true" className="size-[18px]" />}
    />
  );
};

export { ArtworkAmbienceToggle, useAmbiencePreference };
