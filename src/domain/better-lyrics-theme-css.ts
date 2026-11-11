import postcss from "postcss";

const MAX_THEME_FILE_BYTES = 1_000_000;
const CSS_COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;
const CSS_IMPORT_PATTERN = /@import\s+(?:url\(\s*(?:"([^"]+)"|'([^']+)'|([^)]*?))\s*\)|"([^"]+)"|'([^']+)')[^;]*;/gi;
const CSS_URL_PATTERN = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi;

function resolveThemeAssets(css: string, baseUrl?: string): string {
  if (!baseUrl) return css;
  return css.replace(new RegExp(CSS_URL_PATTERN), (match, doubleQuoted: string, singleQuoted: string, raw: string) => {
    const asset = (doubleQuoted ?? singleQuoted ?? raw ?? "").trim();
    if (/^(?:https?:|data:|\/\/|#)/i.test(asset)) return match;
    const path = asset.split(/[?#]/, 1)[0];
    const pathParts = path.split("/");
    if (
      path.includes("\\") ||
      pathParts.some((part) => {
        try {
          return [".", ".."].includes(decodeURIComponent(part));
        } catch {
          return true;
        }
      })
    ) {
      return match;
    }
    if (!/\.(woff2?|ttf|otf|png|jpe?g|gif|webp)$/i.test(path)) return match;
    try {
      const resolved = new URL(asset, `${baseUrl.replace(/\/$/, "")}/`).href;
      return `url("${resolved}")`;
    } catch {
      return match;
    }
  });
}

function validateCss(css: string, baseUrl?: string): string {
  css = resolveThemeAssets(css, baseUrl);
  if (css.length > MAX_THEME_FILE_BYTES) throw new Error("Theme CSS exceeds the 1 MB limit.");
  const source = css.replace(new RegExp(CSS_COMMENT_PATTERN), "");
  const imports = [...source.matchAll(new RegExp(CSS_IMPORT_PATTERN))];
  const withoutImports = source.replace(new RegExp(CSS_IMPORT_PATTERN), "");
  if (/@import\b|expression\s*\(|javascript\s*:|behavior\s*:|-moz-binding\s*:/i.test(withoutImports)) {
    throw new Error("Theme CSS contains an unsupported import or executable style.");
  }
  for (const match of imports) {
    const url = match[1] ?? match[2] ?? match[3]?.trim() ?? match[4] ?? match[5] ?? "";
    if (!isAllowedThemeAssetUrl(url, "import")) {
      throw new Error("Theme imports are limited to Google Fonts stylesheets.");
    }
  }
  for (const match of source.matchAll(new RegExp(CSS_URL_PATTERN))) {
    const url = (match[1] ?? match[2] ?? match[3] ?? "").trim();
    if (!isAllowedThemeAssetUrl(url, "asset") && !isAllowedThemeAssetUrl(url, "import")) {
      throw new Error("Theme assets are limited to supported font and image files.");
    }
  }
  return css;
}

function isAllowedThemeAssetUrl(value: string, kind: "import" | "asset"): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
    if (kind === "import") return url.hostname === "fonts.googleapis.com" && /^\/css2?$/.test(url.pathname);
    if (url.hostname === "fonts.gstatic.com") return true;
    return url.hostname === "raw.githubusercontent.com" && /\.(woff2?|ttf|otf|png|jpe?g|gif|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function lyricsOnlyCss(css: string): string {
  const root = postcss.parse(css);
  root.walkRules((rule) => {
    let ancestor = rule.parent;
    while (ancestor && ancestor.type !== "root") {
      if (ancestor.type === "atrule" && /keyframes$/i.test(ancestor.name)) return;
      ancestor = ancestor.parent;
    }
    const selectors = postcss.list.comma(rule.selector).flatMap((selector) => {
      const scoped = selector.replace(/:root\b/g, ".blyrics-container").trim();
      if (scoped === "*") return [".blyrics-container", ".blyrics-container *"];
      return scoped.includes(".blyrics") ? [scoped] : [];
    });
    if (selectors.length === 0) rule.remove();
    else rule.selector = selectors.join(", ");
  });
  return root.toString();
}

function composeBetterLyricsCss(baseCss: string, themeCss: string): string {
  const visibleCss = themeCss.replace(new RegExp(CSS_COMMENT_PATTERN), (comment) => " ".repeat(comment.length));
  const importMatches = [...visibleCss.matchAll(new RegExp(CSS_IMPORT_PATTERN))];
  const imports = importMatches.map((match) => match[0]);
  let withoutImports = themeCss;
  for (const match of importMatches.reverse()) {
    const start = match.index ?? 0;
    withoutImports = `${withoutImports.slice(0, start)}${withoutImports.slice(start + match[0].length)}`;
  }
  return [imports.join("\n"), baseCss, lyricsOnlyCss(withoutImports)].filter(Boolean).join("\n");
}

async function compileRicsStylesheet(source: string, baseUrl?: string): Promise<string> {
  const { compileRics } = await import("@braccato/rics");
  const result = compileRics(source, { timeout: 3000 });
  if (result.timedOut) throw new Error("Theme RICS compilation exceeded 3 seconds.");
  if (result.errors.length > 0) {
    throw new Error(`Theme RICS could not be compiled: ${result.errors[0].message}`);
  }
  return validateCss(result.css, baseUrl);
}

async function githubStylesheet(base: string): Promise<string> {
  let rics: string;
  try {
    rics = await getText(`${base}/style.rics`);
  } catch {
    return validateCss(await getText(`${base}/style.css`), base);
  }
  return compileRicsStylesheet(rics, base);
}

async function getText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load theme file: ${response.status}.`);
  const text = await response.text();
  if (text.length > MAX_THEME_FILE_BYTES) throw new Error("Theme file exceeds the 1 MB limit.");
  return text;
}

export { compileRicsStylesheet, composeBetterLyricsCss, githubStylesheet, MAX_THEME_FILE_BYTES, validateCss };
