export function GlassBlobs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-32 -left-24 h-[460px] w-[460px] rounded-full blur-3xl opacity-60 animate-float-slow"
        style={{ background: "radial-gradient(closest-side, oklch(0.82 0.12 250 / 60%), transparent 70%)" }} />
      <div className="absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full blur-3xl opacity-60 animate-float-slower"
        style={{ background: "radial-gradient(closest-side, oklch(0.82 0.11 295 / 55%), transparent 70%)" }} />
      <div className="absolute -bottom-40 left-1/4 h-[560px] w-[560px] rounded-full blur-3xl opacity-50 animate-float-slow"
        style={{ background: "radial-gradient(closest-side, oklch(0.86 0.08 215 / 60%), transparent 70%)" }} />
    </div>
  );
}
