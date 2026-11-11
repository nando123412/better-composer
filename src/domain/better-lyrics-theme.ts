import {
  compileRicsStylesheet,
  composeBetterLyricsCss,
  githubStylesheet,
  MAX_THEME_FILE_BYTES,
  validateCss,
} from "@/domain/better-lyrics-theme-css";

export interface BetterLyricsMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string | string[];
  tags?: string[];
  minVersion?: string;
  [key: string]: unknown;
}

export interface BetterLyricsTheme {
  metadata: BetterLyricsMetadata;
  css: string;
  source: string;
  description?: string;
  shader?: Record<string, unknown>;
}

export interface BetterLyricsListing {
  metadata: BetterLyricsMetadata;
  source: string;
  baseUrl: string;
  assetUrls: string[];
}

const MAX_FILE_BYTES = MAX_THEME_FILE_BYTES;
const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

function safeAssetPath(path: string): string | null {
  const parts = path.split("/");
  if (parts.some((part) => part === "" || part === "." || part === "..") || path.includes("\\") || path.includes(":")) {
    return null;
  }
  return parts.map(encodeURIComponent).join("/");
}

function parseMetadata(input: unknown): BetterLyricsMetadata {
  if (!input || typeof input !== "object") throw new Error("Theme metadata must be a JSON object.");
  const value = input as Record<string, unknown>;
  const id = value.id;
  const name = value.name ?? value.title;
  const version = value.version;
  if (typeof id !== "string" || !/^[\w.-]+$/.test(id)) throw new Error("Theme metadata has an invalid id.");
  if (typeof name !== "string" || name.trim() === "") throw new Error("Theme metadata is missing its name.");
  if (typeof version !== "string" || !/^\d+\.\d+\.\d+/.test(version)) {
    throw new Error("Theme metadata has an invalid version.");
  }
  return {
    ...value,
    id,
    name,
    version,
    description: typeof value.description === "string" ? value.description : undefined,
    author: (value.author ?? value.creators) as string | string[] | undefined,
  } as BetterLyricsMetadata;
}

function repositoryFromUrl(input: string): string {
  const url = new URL(input);
  if (url.protocol !== "https:" || url.hostname !== "github.com") {
    throw new Error("Use a GitHub repository URL (https://github.com/owner/repository).");
  }
  const repo = url.pathname.split("/").filter(Boolean).slice(0, 2).join("/");
  if (!REPO_PATTERN.test(repo)) throw new Error("That GitHub repository URL is invalid.");
  return repo;
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`Could not load ${url}: ${response.status}.`);
  const text = await response.text();
  if (text.length > MAX_FILE_BYTES) throw new Error("Theme metadata exceeds the 1 MB limit.");
  return JSON.parse(text) as unknown;
}

async function getText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load theme file: ${response.status}.`);
  const text = await response.text();
  if (text.length > MAX_FILE_BYTES) throw new Error("Theme file exceeds the 1 MB limit.");
  return text;
}

async function importGithubTheme(repository: string): Promise<BetterLyricsTheme> {
  if (!REPO_PATTERN.test(repository)) throw new Error("Repository must use owner/name format.");
  const encoded = repository.split("/").map(encodeURIComponent).join("/");
  const base = `https://raw.githubusercontent.com/${encoded}/HEAD`;
  const metadata = parseMetadata(await getJson(`${base}/metadata.json`));
  return importThemeAtBase(base, repository, metadata);
}

async function importThemeAtBase(
  base: string,
  source: string,
  metadata: BetterLyricsMetadata,
): Promise<BetterLyricsTheme> {
  const css = await githubStylesheet(base);
  let description: string | undefined;
  let shader: Record<string, unknown> | undefined;
  try {
    description = await getText(`${base}/DESCRIPTION.md`);
  } catch {
    description = typeof metadata.description === "string" ? metadata.description : undefined;
  }
  try {
    const value = await getJson(`${base}/shader.json`);
    if (value && typeof value === "object" && !Array.isArray(value)) shader = value as Record<string, unknown>;
  } catch {
    shader = undefined;
  }
  return { metadata, css, source, description, shader };
}

async function importThemeFiles(files: FileList | File[]): Promise<BetterLyricsTheme> {
  const list = Array.from(files);
  if (list.length === 1 && list[0].name.toLowerCase().endsWith(".css")) {
    const css = validateCss(await list[0].text());
    const name = list[0].name.replace(/\.css$/i, "") || "Imported CSS theme";
    return {
      metadata: { id: `local-${crypto.randomUUID()}`, name, version: "1.0.0", author: "You" },
      css,
      source: "local CSS",
    };
  }
  const metadataFile = list.find((file) => file.name.endsWith("metadata.json"));
  const ricsFile = list.find((file) => file.name.endsWith("style.rics"));
  const cssFile = list.find((file) => file.name.endsWith("style.css"));
  const stylesheet = ricsFile ?? cssFile;
  if (!metadataFile || !stylesheet)
    throw new Error("Select a theme folder or files containing metadata.json and style.css or style.rics.");
  if (metadataFile.size > MAX_FILE_BYTES || stylesheet.size > MAX_FILE_BYTES)
    throw new Error("Theme files must be under 1 MB.");
  const metadata = parseMetadata(JSON.parse(await metadataFile.text()) as unknown);
  const stylesheetText = await stylesheet.text();
  const css = ricsFile ? await compileRicsStylesheet(stylesheetText) : validateCss(stylesheetText);
  const descriptionFile = list.find((file) => file.name.endsWith("DESCRIPTION.md"));
  const shaderFile = list.find((file) => file.name.endsWith("shader.json"));
  let shader: Record<string, unknown> | undefined;
  if (shaderFile) {
    const value = JSON.parse(await shaderFile.text()) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("shader.json must be an object.");
    shader = value as Record<string, unknown>;
  }
  return {
    metadata,
    css,
    source: "local import",
    description: descriptionFile ? await descriptionFile.text() : undefined,
    shader,
  };
}

async function fetchOfficialThemeRepositories(): Promise<string[]> {
  const data = (await getJson("https://raw.githubusercontent.com/better-lyrics/themes/master/index.json")) as {
    themes?: { repo?: unknown }[];
  };
  if (!Array.isArray(data.themes)) throw new Error("The official theme index has an unexpected format.");
  return data.themes
    .map((entry) => entry.repo)
    .filter((repo): repo is string => typeof repo === "string" && REPO_PATTERN.test(repo));
}

interface RegistryThemeEntry {
  id: string;
  repo: string;
  builds?: { path?: string }[];
}

function registryEntries(data: unknown): RegistryThemeEntry[] {
  if (!data || typeof data !== "object" || !Array.isArray((data as { themes?: unknown }).themes)) return [];
  return (data as { themes: unknown[] }).themes.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const value = entry as Record<string, unknown>;
    const id = value.id;
    const repo = value.repo;
    const builds = Array.isArray(value.builds) ? value.builds : [];
    const path = (builds[0] as { path?: unknown } | undefined)?.path;
    const themePath = typeof path === "string" ? path : `themes/${String(id ?? "")}`;
    if (typeof id !== "string" || !/^[\w.-]+$/.test(id) || typeof repo !== "string" || !REPO_PATTERN.test(repo)) {
      return [];
    }
    if (!themePath.startsWith("themes/") || safeAssetPath(themePath) === null) return [];
    return [{ id, repo, builds: [{ path: themePath }] }];
  });
}

async function registryListings(): Promise<BetterLyricsListing[]> {
  const lockfile = await getJson("https://raw.githubusercontent.com/better-lyrics/themes/master/index.lock.json");
  const entries = registryEntries(lockfile);
  const results = await Promise.allSettled(
    entries.map(async (entry): Promise<BetterLyricsListing> => {
      const path = entry.builds?.[0]?.path;
      if (!path) throw new Error(`No published build for ${entry.id}.`);
      const baseUrl = `https://raw.githubusercontent.com/better-lyrics/themes/master/${path}`;
      const metadata = parseMetadata(await getJson(`${baseUrl}/metadata.json`));
      const assets = ["cover.png", ...(Array.isArray(metadata.images) ? metadata.images : [])]
        .filter((asset): asset is string => typeof asset === "string" && asset.length > 0)
        .map((asset) => (asset === "cover.png" ? asset : `images/${asset.replace(/^images\//, "")}`))
        .map(safeAssetPath)
        .filter((asset): asset is string => asset !== null);
      return {
        metadata,
        source: entry.repo,
        baseUrl,
        assetUrls: [...new Set(assets)].map((asset) => `${baseUrl}/${asset}`),
      };
    }),
  );
  return results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}

async function discoverOfficialThemes(): Promise<BetterLyricsListing[]> {
  try {
    const registry = await registryListings();
    if (registry.length > 0) return registry;
  } catch {
    // Older registry deployments expose the repository list without a lockfile.
  }
  const repositories = await fetchOfficialThemeRepositories();
  const listings = await Promise.allSettled(
    repositories.map(async (repository): Promise<BetterLyricsListing> => {
      const encoded = repository.split("/").map(encodeURIComponent).join("/");
      const base = `https://raw.githubusercontent.com/${encoded}/HEAD`;
      const metadata = parseMetadata(await getJson(`${base}/metadata.json`));
      const assets = ["cover.png", ...(Array.isArray(metadata.images) ? metadata.images : [])]
        .filter((asset): asset is string => typeof asset === "string" && asset.length > 0)
        .map((asset) => (asset === "cover.png" ? asset : `images/${asset.replace(/^images\//, "")}`))
        .map(safeAssetPath)
        .filter((asset): asset is string => asset !== null);
      return {
        metadata,
        source: repository,
        baseUrl: base,
        assetUrls: [...new Set(assets)].map((asset) => `${base}/${asset}`),
      };
    }),
  );
  const available = listings.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
  if (available.length === 0)
    throw new Error("Could not load theme metadata from GitHub. Check your connection and refresh.");
  return available;
}

async function importRegistryTheme(listing: BetterLyricsListing): Promise<BetterLyricsTheme> {
  const base = listing.baseUrl;
  const css = await githubStylesheet(base);
  let description: string | undefined;
  let shader: Record<string, unknown> | undefined;
  try {
    description = await getText(`${base}/DESCRIPTION.md`);
  } catch {
    description = listing.metadata.description;
  }
  try {
    const value = await getJson(`${base}/shader.json`);
    if (value && typeof value === "object" && !Array.isArray(value)) shader = value as Record<string, unknown>;
  } catch {
    shader = undefined;
  }
  return { metadata: listing.metadata, css, source: listing.source, description, shader };
}

export {
  composeBetterLyricsCss,
  discoverOfficialThemes,
  fetchOfficialThemeRepositories,
  importGithubTheme,
  importRegistryTheme,
  importThemeFiles,
  parseMetadata,
  repositoryFromUrl,
  validateCss,
};
