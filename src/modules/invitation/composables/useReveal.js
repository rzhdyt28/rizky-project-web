/**
 * ANIMASI SCROLL (GSAP + ScrollTrigger) — dipakai lintas tema lewat
 * directive v-reveal di Layout tema.
 *
 *   <section v-reveal>...</section>
 *   <section v-reveal="{ y: 60, start: 'top 90%' }">...</section>
 *
 * Prinsip aman:
 * - gsap di-import DINAMIS: chunk-nya baru diunduh saat undangan dibuka,
 *   bukan membebani bundle awal.
 * - Kalau paket gsap belum ter-install / gagal dimuat, halaman TETAP tampil
 *   normal tanpa animasi (catch diam-diam) — tidak pernah blank.
 * - Menghormati prefers-reduced-motion.
 */
/** Preset yang bisa dipilih dari Filament (dropdown "Animasi Scroll"). */
const PRESETS = {
  'fade-up':    { y: 42 },
  'fade-down':  { y: -42 },
  'fade-left':  { x: 60 },
  'fade-right': { x: -60 },
  'zoom':       { scale: 0.92 },
  'none':       null,
};

async function initReveal(el, raw = {}) {
  /* Bentuk nilai yang didukung:
     - string preset                     : v-reveal="'fade-up'"
     - objek opsi bebas                  : v-reveal="{ y: 60 }"
     - objek { preset, scroller, ... }   : preset Filament + scroll container
       kustom (selector CSS) — wajib untuk layout ber-panel scroll sendiri
       seperti tema Senja, karena ScrollTrigger default hanya memantau window. */
  let opts = raw;
  if (typeof raw === 'string') {
    opts = PRESETS[raw];
  } else if (raw && typeof raw === 'object' && raw.preset !== undefined) {
    const base = PRESETS[raw.preset];
    if (base === null) return; // preset 'none' -> tanpa animasi
    opts = { ...(base ?? {}), ...raw };
    delete opts.preset;
  }
  if (opts === null) return; // preset 'none' -> tanpa animasi
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.from(el, {
      opacity: 0,
      x: opts.x ?? 0,
      scale: opts.scale ?? 1,
      y: opts.y ?? 0,
      duration: opts.duration ?? 0.9,
      ease: opts.ease ?? 'power2.out',
      scrollTrigger: {
        trigger: el,
        ...(opts.scroller ? { scroller: opts.scroller } : {}),
        start: opts.start ?? 'top 82%',
        once: opts.once ?? true,
      },
    });
    el.__revealTrigger = tween.scrollTrigger;
  } catch {
    /* gsap tidak tersedia -> tanpa animasi, konten tetap terlihat */
  }
}

export const vReveal = {
  mounted(el, binding) {
    initReveal(el, binding.value ?? {});
  },
  unmounted(el) {
    el.__revealTrigger?.kill?.();
  },
};
