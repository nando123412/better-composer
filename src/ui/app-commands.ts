import type { NavigateFunction } from "react-router-dom";
import type { ProjectTab } from "@/domain/project/tab";
import { createProject } from "@/lib/open-project";
import { useProjectStore } from "@/stores/project";
import type { OpenSettingsOptions } from "@/stores/ui";
import { useUIStore } from "@/stores/ui";
import type { CommandItem } from "@/ui/command-menu";
import { EDITOR_PATH, LIBRARY_PATH } from "@/utils/app-routes";

function appCommands(
  setActiveTab: (tab: ProjectTab) => void,
  openSettings: (options?: OpenSettingsOptions) => void,
  navigate: NavigateFunction,
  openGlobalOffset: () => void,
): readonly CommandItem[] {
  const openTab = (tab: ProjectTab) => {
    setActiveTab(tab);
    navigate(EDITOR_PATH);
  };

  return [
    {
      id: "projects",
      label: "Browse projects",
      detail: "Open the project library",
      keywords: ["switch", "open", "recent", "rename", "duplicate", "delete"],
      run: () => navigate(LIBRARY_PATH),
    },
    {
      id: "new-project",
      label: "Create new project",
      detail: "Start a fresh lyrics project",
      keywords: ["new", "song", "blank"],
      run: () => {
        createProject();
        navigate(EDITOR_PATH);
      },
    },
    {
      id: "import-audio",
      label: "Import audio or lyrics",
      detail: "Choose audio, TTML, LRC, SRT, or plain text",
      keywords: ["music", "lyrics", "ttml", "lrc", "srt"],
      shortcut: "⌘1 / Ctrl+1",
      run: () => openTab("import"),
    },
    {
      id: "edit-lyrics",
      label: "Edit lyrics",
      detail: "Open the lyric editor",
      keywords: ["text", "lines", "words"],
      shortcut: "⌘2 / Ctrl+2",
      run: () => openTab("edit"),
    },
    {
      id: "sync-lyrics",
      label: "Synchronize lyrics",
      detail: "Open tap-to-sync and alignment tools",
      keywords: ["timing", "word", "line", "align"],
      shortcut: "⌘4 / Ctrl+4",
      run: () => openTab("sync"),
    },
    {
      id: "global-offset",
      label: "Adjust global timing offset",
      detail: "Shift all timed lyrics and backing vocals together",
      keywords: ["timing", "lyrics", "early", "late", "milliseconds"],
      run: openGlobalOffset,
    },
    {
      id: "word-timing",
      label: "Enable word timing",
      detail: "Switch synchronization to individual words",
      keywords: ["word-level", "granularity"],
      run: () => {
        useProjectStore.getState().setGranularity("word");
        openTab("sync");
      },
    },
    {
      id: "line-timing",
      label: "Enable line timing",
      detail: "Switch synchronization to lyric lines",
      keywords: ["line-level", "granularity"],
      run: () => {
        useProjectStore.getState().setGranularity("line");
        openTab("sync");
      },
    },
    {
      id: "timeline",
      label: "Open timeline and stem tracks",
      detail: "Edit timings, audio layers, and stem controls",
      keywords: ["stem", "separate", "vocal", "offset", "zoom"],
      shortcut: "⌘5 / Ctrl+5",
      run: () => openTab("timeline"),
    },
    {
      id: "preview",
      label: "Open lyrics preview",
      detail: "Preview synchronized lyrics with playback",
      keywords: ["fullscreen", "display", "lyrics"],
      shortcut: "⌘6 / Ctrl+6",
      run: () => openTab("preview"),
    },
    {
      id: "fullscreen-preview",
      label: "Toggle fullscreen preview",
      detail: "Show synchronized lyrics in a focused, full-screen view",
      keywords: ["display", "lyrics", "theater"],
      run: () => {
        const ui = useUIStore.getState();
        ui.setPreviewFullscreen(!ui.previewFullscreen);
        openTab("preview");
      },
    },
    {
      id: "export-ttml",
      label: "Export TTML",
      detail: "Review validation and export formats",
      keywords: ["download", "xml", "lrc", "srt", "plain text"],
      shortcut: "⌘7 / Ctrl+7",
      run: () => openTab("export"),
    },
    {
      id: "models",
      label: "Open model manager",
      detail: "Manage local alignment and separation models",
      keywords: ["download", "demucs", "roformer", "ai", "stems"],
      run: () => openSettings({ target: { section: "models" } }),
    },
    {
      id: "settings",
      label: "Open settings",
      detail: "Playback, editing, appearance, and shortcuts",
      keywords: ["preferences", "theme", "keyboard"],
      run: () => openSettings(),
    },
  ];
}

export { appCommands };
