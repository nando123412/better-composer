import { useCallback, useEffect, useMemo, useState } from "react";
import type { BetterLyricsTheme } from "@/domain/better-lyrics-theme";
import { type BetterLyricsListing, discoverOfficialThemes, importRegistryTheme } from "@/domain/better-lyrics-theme";
import { useThemeStore } from "@/stores/theme";
import { Button } from "@/ui/button";
import { BetterLyricsThemeCard } from "@/ui/settings/theme/better-lyrics-theme-card";

const BetterLyricsMarketplace: React.FC = () => {
  const themes = useThemeStore((state) => state.betterLyricsThemes);
  const activeId = useThemeStore((state) => state.activeBetterLyricsThemeId);
  const [listings, setListings] = useState<BetterLyricsListing[]>([]);
  const [search, setSearch] = useState("");
  const [showInstalled, setShowInstalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyRepo, setBusyRepo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setListings(await discoverOfficialThemes());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load the official theme catalog.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return listings.filter((listing) => {
      const installed = themes.some((theme) => theme.source === listing.source);
      if (showInstalled && !installed) return false;
      const metadata = listing.metadata;
      const author = Array.isArray(metadata.author) ? metadata.author.join(" ") : (metadata.author ?? "");
      return [metadata.name, author, metadata.description ?? "", ...(metadata.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [listings, search, showInstalled, themes]);

  const install = async (repository: string) => {
    setBusyRepo(repository);
    setError(null);
    try {
      const listing = listings.find((candidate) => candidate.source === repository);
      if (!listing) throw new Error("This theme is no longer in the marketplace. Refresh and try again.");
      const theme: BetterLyricsTheme = await importRegistryTheme(listing);
      useThemeStore.getState().installBetterLyricsTheme(theme);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Theme installation failed.");
    } finally {
      setBusyRepo(null);
    }
  };

  return (
    <section className="flex flex-col gap-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-composer-text">Theme marketplace</h3>
          <p className="text-xs text-(--muted)">Discover community lyrics themes</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => void refresh()} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search themes, creators, tags…"
          aria-label="Search themes"
          className="min-w-40 flex-1 rounded-lg border border-(--edge) bg-(--well) px-3 py-2 text-sm"
        />
        <Button
          size="sm"
          variant={showInstalled ? "primary" : "secondary"}
          onClick={() => setShowInstalled((value) => !value)}
        >
          {showInstalled ? "Installed" : "All themes"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-composer-error">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((listing) => {
          const installed = themes.find((theme) => theme.source === listing.source);
          return (
            <BetterLyricsThemeCard
              key={listing.source}
              listing={listing}
              active={installed?.metadata.id === activeId}
              installed={Boolean(installed)}
              busy={busyRepo === listing.source}
              onInstall={(repository) => void install(repository)}
              onApply={(id) => useThemeStore.getState().setActiveBetterLyricsTheme(id)}
            />
          );
        })}
      </div>
      {!loading && visible.length === 0 && (
        <p className="py-6 text-center text-xs text-(--muted)">No themes match this search.</p>
      )}
    </section>
  );
};

export { BetterLyricsMarketplace };
