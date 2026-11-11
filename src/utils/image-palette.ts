interface PaletteColor {
  hex: string;
  rgb: [number, number, number];
  weight: number;
}

function getImagePalette(image: HTMLImageElement): string[] {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context || image.naturalWidth === 0) return [];

  try {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const bins = new Map<string, PaletteColor & { count: number }>();
    for (let index = 0; index < pixels.length; index += 4) {
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const alpha = pixels[index + 3];
      if (alpha < 220 || Math.max(r, g, b) < 28) continue;

      const key = [r, g, b].map((channel) => Math.round(channel / 32)).join(":");
      const bin = bins.get(key) ?? { hex: "", rgb: [0, 0, 0], weight: 0, count: 0 };
      bin.rgb = [bin.rgb[0] + r, bin.rgb[1] + g, bin.rgb[2] + b];
      bin.count += 1;
      bins.set(key, bin);
    }

    const colors = [...bins.values()]
      .map((bin) => {
        const rgb: [number, number, number] = bin.rgb.map((channel) => Math.round(channel / bin.count)) as [
          number,
          number,
          number,
        ];
        const [r, g, b] = rgb;
        const hex = `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
        return { hex, rgb, weight: bin.count * (0.55 + (Math.max(r, g, b) - Math.min(r, g, b)) / 510) };
      })
      .sort((a, b) => b.weight - a.weight);

    const selected: PaletteColor[] = [];
    for (const color of colors) {
      const distinct = selected.every((selectedColor) => {
        const distance = Math.hypot(
          color.rgb[0] - selectedColor.rgb[0],
          color.rgb[1] - selectedColor.rgb[1],
          color.rgb[2] - selectedColor.rgb[2],
        );
        return distance > 52;
      });
      if (distinct) selected.push(color);
      if (selected.length === 5) break;
    }
    return selected.map((color) => color.hex);
  } catch {
    return [];
  }
}

export { getImagePalette };
