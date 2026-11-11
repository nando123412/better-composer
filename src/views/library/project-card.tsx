import { IconDots } from "@tabler/icons-react";
import { memo, useState } from "react";
import { displayArtists, displayTitle, hasArtists } from "@/domain/project/display-title";
import type { ProjectIndexEntry } from "@/domain/project/index-entry";
import { hasLyrics, progressDescription, projectStage, syncedPercent } from "@/domain/project/progress";
import { useProjectArtSrc } from "@/hooks/unison/useProjectArtSrc";
import { IconButton } from "@/ui/icon-button";
import { menuTriggerProps } from "@/ui/menu-trigger-props";
import { ProgressBar } from "@/ui/progress-bar";
import { ProjectArt } from "@/ui/projects/project-art";
import { SyncedBadge } from "@/ui/projects/synced-badge";
import { SelectCheckbox } from "@/ui/select-checkbox";
import { cn } from "@/utils/cn";
import { getImagePalette } from "@/utils/image-palette";
import { AudioStatusLabel } from "@/views/library/audio-status-label";
import type { ProjectItemProps } from "@/views/library/project-row";
import { UnisonArtLink, UnisonCardChip } from "@/views/library/unison-cell";

// -- Constants ----------------------------------------------------------------

const CARD_STYLES = cn(
  "group/card relative flex flex-col gap-2.5 rounded-[10px] select-none",
  "[content-visibility:auto] [contain-intrinsic-size:auto_260px] [overflow-clip-margin:4px]",
  "has-[[data-row-open]:focus-visible]:outline-2 has-[[data-row-open]:focus-visible]:outline-offset-4 has-[[data-row-open]:focus-visible]:outline-composer-accent",
);
const REVEAL_ON_CARD = cn(
  "opacity-0 group-hover/card:opacity-100 group-focus-within/card:opacity-100",
  "group-data-[selecting=true]/grid:opacity-100",
);

// -- Sub-components -------------------------------------------------------------

const CardProgressLabel: React.FC<{ project: ProjectIndexEntry; compact: boolean }> = ({ project, compact }) => {
  if (!hasLyrics(project)) return <span>No lyrics</span>;
  if (projectStage(project) === "synced")
    return <SyncedBadge withLabel={!compact} className={cn(compact && "size-4")} />;
  return <span className="tabular-nums">{syncedPercent(project)}%</span>;
};

// -- Component ----------------------------------------------------------------

const ProjectCardContent: React.FC<ProjectItemProps> = ({
  project,
  isSelected,
  isMenuOpen,
  unison,
  onOpen,
  onToggleSelect,
  onOpenMenu,
}) => {
  const artSrc = useProjectArtSrc(project);
  const [palette, setPalette] = useState<string[]>([]);
  const title = displayTitle(project.title);
  const paletteColors = [palette[0], palette[1] ?? palette[0], palette[2] ?? palette[0]];
  const cornerGlow = `radial-gradient(ellipse 58% 38% at 100% 0%, ${paletteColors[0]} 0%, ${paletteColors[1]} 35%, ${paletteColors[2]} 58%, transparent 100%)`;
  return (
    <li
      data-project-id={project.id}
      data-selected={isSelected || undefined}
      data-menu={isMenuOpen || undefined}
      onContextMenu={(event) => {
        event.preventDefault();
        onOpenMenu(project.id, { kind: "point", x: event.clientX, y: event.clientY, within: event.currentTarget });
      }}
      className={cn(CARD_STYLES, "isolate")}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 z-0 h-72 w-96 -translate-y-1/4 translate-x-1/4 rounded-full opacity-0 blur-[80px] transition-opacity duration-300 group-hover/card:opacity-25 group-focus-within/card:opacity-25"
        style={{ backgroundImage: cornerGlow }}
      />
      <div className="relative z-1 pointer-events-none transition-[translate] duration-160 ease-emphasized group-hover/card:-translate-y-0.5">
        <ProjectArt
          src={artSrc}
          size="card"
          onImageLoad={(image) => setPalette(getImagePalette(image))}
          onImageError={() => setPalette([])}
          className="group-data-selected/card:shadow-[0_0_0_2px_var(--color-composer-accent)]"
        />
        <SelectCheckbox
          label={`Select ${title}`}
          checked={isSelected}
          onToggle={(range) => onToggleSelect(project.id, range)}
          className={cn("absolute top-2.5 left-2.5 z-2 pointer-events-auto checked:opacity-100", REVEAL_ON_CARD)}
        />
        {unison && (
          <UnisonArtLink
            project={project}
            unison={unison}
            className="absolute bottom-2 left-2 z-2 pointer-events-auto"
          />
        )}
        <IconButton
          variant="ghost"
          label={`More actions for ${title}`}
          icon={<IconDots aria-hidden="true" className="size-5" />}
          {...menuTriggerProps(isMenuOpen)}
          onClick={(event) => onOpenMenu(project.id, { kind: "element", element: event.currentTarget })}
          className={cn(
            "absolute top-2 right-2 z-2 pointer-events-auto bg-black/50 text-white hover:bg-black/70 hover:text-white group-data-menu/card:opacity-100",
            REVEAL_ON_CARD,
          )}
        />
      </div>
      <div className="min-w-0">
        <button
          type="button"
          data-row-open
          onClick={() => onOpen(project.id)}
          className="mt-0.5 block max-w-full truncate text-left font-medium text-composer-text cursor-pointer outline-none after:absolute after:inset-0 after:rounded-[inherit]"
        >
          {title}
        </button>
        <div
          className={cn(
            "truncate text-[13px]",
            hasArtists(project.artists) ? "text-composer-text-muted" : "text-composer-text-faint",
          )}
        >
          {displayArtists(project.artists)}
        </div>
      </div>
      <ProgressBar percent={syncedPercent(project)} label={progressDescription(project)} />
      <div className="flex items-center justify-between gap-2 text-xs text-composer-text-muted">
        <span className="min-w-0 truncate">
          <AudioStatusLabel project={project} compact />
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {unison && <UnisonCardChip project={project} unison={unison} />}
          <CardProgressLabel project={project} compact={Boolean(unison && project.unisonLyricId)} />
        </span>
      </div>
    </li>
  );
};

const ProjectCard = memo(ProjectCardContent);

// -- Exports ------------------------------------------------------------------

export { ProjectCard };
