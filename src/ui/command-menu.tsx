import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/ui/button";
import { Modal } from "@/ui/modal";

interface CommandItem {
  id: string;
  label: string;
  detail: string;
  keywords: readonly string[];
  shortcut?: string;
  run: () => void;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  commands: readonly CommandItem[];
}

const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, commands }) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) =>
      [command.label, command.detail, ...command.keywords].join(" ").toLocaleLowerCase().includes(normalized),
    );
  }, [commands, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  const run = (command: CommandItem) => {
    onClose();
    command.run();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Commands"
      className="max-w-xl"
      bodyClassName="p-0"
      initialFocusRef={inputRef}
    >
      <label className="sr-only" htmlFor="command-search">
        Search commands
      </label>
      <input
        ref={inputRef}
        id="command-search"
        value={query}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
          setActiveIndex(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, matches.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
          } else if (event.key === "Enter" && matches[activeIndex]) {
            event.preventDefault();
            run(matches[activeIndex]);
          }
        }}
        aria-controls="command-results"
        aria-activedescendant={matches[activeIndex] ? `command-${matches[activeIndex].id}` : undefined}
        placeholder="Search actions…"
        autoComplete="off"
        className="w-full h-12 px-5 bg-transparent border-b border-(--divider) text-sm outline-none placeholder:text-(--muted)"
      />
      <div
        id="command-results"
        role="listbox"
        aria-label="Available commands"
        className="max-h-[min(60vh,420px)] overflow-y-auto p-2"
      >
        {matches.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-(--muted)">No commands found</p>
        ) : (
          matches.map((command, index) => (
            <Button
              key={command.id}
              id={`command-${command.id}`}
              role="option"
              aria-selected={index === activeIndex}
              variant="ghost"
              className="w-full h-auto justify-start px-3 py-2.5 text-left"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => run(command)}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm text-[var(--label)]">{command.label}</span>
                <span className="text-xs text-(--muted)">{command.detail}</span>
              </span>
              {command.shortcut && (
                <kbd className="ml-3 shrink-0 rounded-md border border-(--edge) px-1.5 py-1 text-[11px] text-(--muted)">
                  {command.shortcut}
                </kbd>
              )}
            </Button>
          ))
        )}
      </div>
      <div className="flex justify-end border-t border-(--divider) px-4 py-2 text-[11px] text-(--muted)">
        Press Esc to close
      </div>
    </Modal>
  );
};

export type { CommandItem };
export { CommandMenu };
