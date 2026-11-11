interface PageArtworkWashProps {
  enabled: boolean;
  colors: string[];
}

const PageArtworkWash: React.FC<PageArtworkWashProps> = ({ enabled, colors }) => {
  const stops = [colors[0], colors[1] ?? colors[0], colors[2] ?? colors[0]];
  const backgroundImage = `linear-gradient(128deg, color-mix(in srgb, ${stops[0]} 18%, var(--color-composer-bg-dark)) 0%, color-mix(in srgb, ${stops[1]} 12%, var(--color-composer-bg-dark)) 52%, color-mix(in srgb, ${stops[2]} 18%, var(--color-composer-bg-dark)) 100%)`;

  return (
    <div
      aria-hidden="true"
      className={`page-artwork-wash ${enabled ? "page-artwork-wash-active" : "page-artwork-wash-inactive"}`}
      style={{ backgroundImage }}
    />
  );
};

export { PageArtworkWash };
