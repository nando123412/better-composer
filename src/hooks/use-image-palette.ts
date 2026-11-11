import { useEffect, useState } from "react";
import { getImagePalette } from "@/utils/image-palette";

const DEFAULT_IMAGE_COLORS = ["#302a46", "#59415f", "#2b5261"];

function useImagePalette(src?: string): string[] {
  const [colors, setColors] = useState<string[]>(DEFAULT_IMAGE_COLORS);

  useEffect(() => {
    setColors(DEFAULT_IMAGE_COLORS);
    if (!src) return;
    let current = true;
    const image = new Image();
    image.onload = () => {
      if (!current) return;
      const palette = getImagePalette(image);
      setColors(palette.length > 0 ? palette : DEFAULT_IMAGE_COLORS);
    };
    image.onerror = () => {
      if (current) setColors(DEFAULT_IMAGE_COLORS);
    };
    image.src = src;
    return () => {
      current = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  return colors;
}

export { useImagePalette };
