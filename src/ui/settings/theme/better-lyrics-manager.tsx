import { useState } from "react";
import { importGithubTheme, importThemeFiles, repositoryFromUrl, validateCss } from "@/domain/better-lyrics-theme";
import { useThemeStore } from "@/stores/theme";
import { Button } from "@/ui/button";
import { BetterLyricsMarketplace } from "@/ui/settings/theme/better-lyrics-marketplace";

const BetterLyricsManager: React.FC = () => {
  const themes = useThemeStore((state) => state.betterLyricsThemes);
  const [repoInput, setRepoInput] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pastedCss, setPastedCss] = useState("");
  const [pastedCssName, setPastedCssName] = useState("My lyrics theme");

  const install = async (repo: string) => {
    setBusy(repo);
    setError(null);
    try {
      useThemeStore.getState().installBetterLyricsTheme(await importGithubTheme(repo));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Theme installation failed.");
    } finally {
      setBusy(null);
    }
  };

  const importRepo = async () => {
    try {
      await install(repositoryFromUrl(repoInput));
      setRepoInput("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Invalid repository URL.");
    }
  };

  const importFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    try {
      useThemeStore.getState().installBetterLyricsTheme(await importThemeFiles(files));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Theme import failed.");
    }
  };

  const importPastedCss = () => {
    setError(null);
    try {
      const css = validateCss(pastedCss);
      if (!css.trim()) throw new Error("Paste some CSS first.");
      useThemeStore.getState().installBetterLyricsTheme({
        metadata: {
          id: `local-${crypto.randomUUID()}`,
          name: pastedCssName.trim() || "My lyrics theme",
          version: "1.0.0",
          author: "You",
        },
        css,
        source: "local CSS",
      });
      setPastedCss("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not import CSS.");
    }
  };

  return (
    <section className="flex flex-col gap-4 py-3">
      <BetterLyricsMarketplace />
      <div className="flex flex-col gap-2 border-t border-(--edge) pt-3">
        <label className="text-xs font-medium text-composer-text" htmlFor="better-lyrics-repo">
          Install from GitHub
        </label>
        <div className="flex gap-2">
          <input
            id="better-lyrics-repo"
            value={repoInput}
            onChange={(event) => setRepoInput(event.target.value)}
            placeholder="https://github.com/owner/theme"
            className="min-w-0 flex-1 rounded-lg border border-(--edge) bg-(--well) px-3 py-2 text-sm"
          />
          <Button variant="secondary" disabled={!repoInput.trim() || busy !== null} onClick={() => void importRepo()}>
            Install
          </Button>
        </div>
        <label className="text-xs text-(--muted)">
          Import local metadata.json and style.css, or a standalone CSS file{" "}
          <input
            type="file"
            multiple
            accept=".json,.css,.md"
            onChange={(event) => void importFiles(event.target.files)}
            className="mt-1 block w-full text-xs"
          />
        </label>
        <details className="rounded-lg border border-(--edge) p-3">
          <summary className="cursor-pointer text-xs font-medium text-composer-text">Paste CSS</summary>
          <div className="mt-2 flex flex-col gap-2">
            <input
              aria-label="Theme name"
              value={pastedCssName}
              onChange={(event) => setPastedCssName(event.target.value)}
              className="rounded-lg border border-(--edge) bg-(--well) px-3 py-2 text-sm"
            />
            <textarea
              aria-label="Paste theme CSS"
              spellCheck={false}
              value={pastedCss}
              onChange={(event) => setPastedCss(event.target.value)}
              placeholder=".blyrics-container { ... }"
              className="h-40 resize-y rounded-lg border border-(--edge) bg-(--well) p-2 font-mono text-xs text-composer-text"
            />
            <Button size="sm" variant="secondary" disabled={!pastedCss.trim()} onClick={importPastedCss}>
              Install CSS theme
            </Button>
          </div>
        </details>
      </div>
      {themes.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-(--edge) pt-3">
          <h4 className="text-xs font-semibold text-composer-text">Installed</h4>
          {themes.map((theme) => (
            <div key={theme.metadata.id} className="rounded-lg border border-(--edge) p-2">
              <div className="flex items-center justify-between gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => useThemeStore.getState().setActiveBetterLyricsTheme(theme.metadata.id)}
                  className="truncate text-left text-composer-text"
                >
                  {theme.metadata.name} · {theme.metadata.version}
                </button>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingId(editingId === theme.metadata.id ? null : theme.metadata.id)}
                  >
                    {editingId === theme.metadata.id ? "Close CSS" : "Edit CSS"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => useThemeStore.getState().removeBetterLyricsTheme(theme.metadata.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              {theme.description && <p className="mt-1 line-clamp-2 text-xs text-(--muted)">{theme.description}</p>}
              {editingId === theme.metadata.id && (
                <textarea
                  aria-label={`CSS for ${theme.metadata.name}`}
                  spellCheck={false}
                  value={theme.css}
                  onChange={(event) => {
                    try {
                      const css = validateCss(event.target.value);
                      useThemeStore.getState().installBetterLyricsTheme({ ...theme, css });
                      setError(null);
                    } catch (cause) {
                      setError(cause instanceof Error ? cause.message : "Invalid CSS.");
                    }
                  }}
                  className="mt-2 h-48 w-full resize-y rounded-lg border border-(--edge) bg-(--well) p-2 font-mono text-xs text-composer-text"
                />
              )}
            </div>
          ))}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => useThemeStore.getState().setActiveBetterLyricsTheme(null)}
          >
            Use Composer default
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="text-xs text-composer-error">
          {error}
        </p>
      )}
    </section>
  );
};

export { BetterLyricsManager };
