export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="JS Fuel">
      <span className="brand-mark__drop" aria-hidden="true">
        <span />
      </span>
      <span className="brand-mark__js">JS</span>
      <span className="brand-mark__fuel">FUEL</span>
    </div>
  );
}
