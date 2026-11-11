import type { KawarpOptions } from "@kawarp/core";

function shaderValues(config: Record<string, unknown>): Record<string, unknown> {
  const settings = config.settings && typeof config.settings === "object" ? config.settings : config;
  const record = settings as Record<string, unknown>;
  return record.kawarp && typeof record.kawarp === "object" ? (record.kawarp as Record<string, unknown>) : record;
}

function kawarpThemeOptions(config: Record<string, unknown> | undefined): Partial<KawarpOptions> | undefined {
  if (!config) return undefined;
  const values = shaderValues(config);
  if (values.enabled === false) return undefined;
  const keys = [
    ["warpIntensity", "kawarpWarpIntensity"],
    ["blurPasses", "kawarpBlurPasses"],
    ["animationSpeed", "kawarpAnimationSpeed"],
    ["transitionDuration", "kawarpTransitionDuration"],
    ["saturation", "kawarpSaturation"],
    ["tintIntensity", "kawarpTintIntensity"],
    ["dithering", "kawarpDithering"],
    ["scale", "kawarpScale"],
  ] as const;
  const options: Partial<KawarpOptions> = {};
  for (const [key, alias] of keys) {
    const value = values[key] ?? values[alias];
    if (typeof value === "number" && Number.isFinite(value)) options[key] = value;
  }
  const tint = values.tintColor;
  if (
    Array.isArray(tint) &&
    tint.length === 3 &&
    tint.every((value) => typeof value === "number" && Number.isFinite(value))
  ) {
    options.tintColor = [tint[0], tint[1], tint[2]];
  }
  return options;
}

function kawarpThemeOpacity(config: Record<string, unknown> | undefined): number | undefined {
  if (!config) return undefined;
  const values = shaderValues(config);
  if (values.enabled === false) return undefined;
  const opacity = values.kawarpOpacity;
  return typeof opacity === "number" && Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : undefined;
}

export { kawarpThemeOpacity, kawarpThemeOptions };
