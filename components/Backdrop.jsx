// Soft ambient glows behind the particle field. Theme-aware via CSS vars.
// Kept static (no animation) so these large blurred layers don't recomposite
// every frame, which keeps scrolling smooth.
export default function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-ink">
      <div
        className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full blur-[130px]"
        style={{ background: 'var(--accent-soft)' }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full blur-[140px]"
        style={{ background: 'var(--accent-2-soft)' }}
      />
    </div>
  );
}
