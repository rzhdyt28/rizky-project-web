import { computed } from 'vue';

/**
 * Parse theme_options (merge default_options tema DB + override undangan,
 * dilakukan backend) menjadi cssVars/can/labels/sectionOrder/cover.
 *
 * tokensRef = token default tema di FRONTEND (themes/<x>/tokens.js).
 * Prioritas nilai: override DB (opts) -> tokens tema -> fallback aman.
 * Fitur background global/per-section SUDAH DIHAPUS dari produk.
 */
export function useThemeOptions(invitationRef, featuresRef, tokensRef) {
  const opts = computed(() => invitationRef.value?.theme_options ?? {});
  const tok  = computed(() => tokensRef?.value ?? { colors: {}, fonts: {} });

  const cssVars = computed(() => {
    const c = opts.value.colors ?? {};
    const f = opts.value.fonts ?? {};
    const tc = tok.value.colors ?? {};
    const tf = tok.value.fonts ?? {};
    const vars = {
      '--t-accent':   c.accent ?? tc.accent ?? '#2F4A3C',
      '--t-paper':    c.paper ?? tc.paper ?? '#F7F4EC',
      '--t-ink':      c.ink ?? tc.ink ?? '#22301F',
      '--t-gold':     c.gold ?? tc.gold ?? '#B08D4A',
      '--t-btn-bg':   c.button_bg ?? c.accent ?? tc.button_bg ?? tc.accent ?? '#2F4A3C',
      '--t-btn-text': c.button_text ?? tc.button_text ?? '#F7F4EC',
      '--t-font-head':   `'${f.heading ?? tf.heading ?? 'Cormorant Garamond'}', serif`,
      '--t-font-body':   `'${f.body ?? tf.body ?? 'Jost'}', sans-serif`,
      '--t-font-script': `'${f.script ?? tf.script ?? 'Great Vibes'}', cursive`,
    };

    /* KUSTOMISASI KARTU (dari Filament). Hanya di-set bila admin mengisi,
       supaya default theme.css tiap tema tetap berlaku saat kosong. */
    const card = opts.value.card ?? {};
    const paperNow = c.paper ?? tc.paper ?? '#F7F4EC';
    if (card.bg || card.opacity != null) {
      vars['--card-bg'] = hexToRgba(card.bg ?? paperNow, card.opacity ?? 100);
    }
    if (card.radius !== undefined && card.radius !== null && card.radius !== '') {
      vars['--card-radius'] = `${card.radius}px`;
    }
    const SHADOW = {
      none:   null,
      lembut: '0 14px 30px -18px',
      sedang: '0 20px 45px -20px',
      kuat:   '0 28px 62px -18px',
    };
    if (card.shadow_size || card.shadow_color) {
      const size = SHADOW[card.shadow_size ?? 'sedang'];
      vars['--card-shadow'] = size === null
        ? 'none'
        : `${size} ${card.shadow_color ?? 'rgba(63, 91, 124, 0.35)'}`;
    }
    return vars;
  });

  /** Gabungan: toggle paket (features) && toggle per-tema/undangan (sections.visible). */
  const can = computed(() => {
    const feat = featuresRef.value ?? {};
    const sec = opts.value.sections ?? {};
    const on = (key, featKey = key) =>
      (feat[featKey] ?? false) && (sec[key]?.visible ?? true);

    return {
      countdown:  on('countdown'),
      couple:     sec.couple?.visible ?? true,
      events:     sec.events?.visible ?? true,
      co_host:    on('co_host'),
      love_story: on('love_story'),
      gallery:    on('gallery'),
      video:      on('video'),
      rsvp:       (feat.rsvp ?? true) !== false && (sec.rsvp?.visible ?? true)
                    && (invitationRef.value?.rsvp_enabled ?? true),
      guestbook:  (sec.guestbook?.visible ?? true)
                    && (invitationRef.value?.guestbook_enabled ?? true),
      gift:       on('gift'),
      maps:       feat.maps ?? false,
      music:      (feat.music ?? false) && !!invitationRef.value?.music_url,
      branding:   !(feat.remove_branding ?? false),
    };
  });

  /** Urutan render section (sections.{key}.order masih dihormati bila ada di data lama). */
  const DEFAULT_ORDER = ['countdown','couple','events','co_host','love_story','gallery','video','rsvp','guestbook','gift'];
  const sectionOrder = computed(() => {
    const sec = opts.value.sections ?? {};
    return DEFAULT_ORDER
      .map((key, i) => ({ key, order: Number(sec[key]?.order ?? i + 1) }))
      .sort((a, b) => a.order - b.order)
      .map((s) => s.key);
  });

  const labels = computed(() => ({
    btn_open:        opts.value.labels?.btn_open ?? 'Buka Undangan',
    btn_rsvp:        opts.value.labels?.btn_rsvp ?? 'Kirim Konfirmasi',
    title_events:    opts.value.labels?.title_events ?? 'Rangkaian Acara',
    title_co_host:   opts.value.labels?.title_co_host ?? 'Turut Mengundang',
    title_story:     opts.value.labels?.title_story ?? 'Kisah Kami',
    title_gallery:   opts.value.labels?.title_gallery ?? 'Galeri',
    title_video:     opts.value.labels?.title_video ?? 'Video',
    title_rsvp:      opts.value.labels?.title_rsvp ?? 'Konfirmasi Kehadiran',
    title_guestbook: opts.value.labels?.title_guestbook ?? 'Ucapan & Doa',
    title_gift:      opts.value.labels?.title_gift ?? 'Kirim Hadiah',
  }));

  /**
   * Kontrak cover BARU: { photo, ornament, show_monogram }
   * - photo    : upload "Foto / Monogram" (background sampul)
   * - ornament : upload sendiri ATAU path dari Pustaka Aset (dropdown)
   * Kunci lama (bg_image, ornament_top, floral_tl, ...) dipetakan sebagai
   * fallback supaya data lama tetap tampil.
   */
  const cover = computed(() => {
    const c = opts.value.cover ?? {};
    return {
      // photo TIDAK dipakai lagi di dalam kartu (pindah ke background halaman);
      // dipertahankan di kontrak hanya untuk kompatibilitas data lama.
      photo:    c.photo ?? c.bg_image ?? null,
      ornament: c.ornament_upload ?? c.ornament ?? c.ornament_asset ?? c.ornament_top ?? c.floral_tl ?? null,
      ornament_bottom: c.ornament_bottom_upload ?? c.ornament_bottom ?? null,
      show_monogram: c.show_monogram,
    };
  });

  /**
   * FLORAL 4 SUDUT — dipilih bebas per posisi dari Pustaka Aset:
   * florals.tl (atas-kiri), tr (atas-kanan), bl (bawah-kiri), br (bawah-kanan).
   * Kosong semua -> tema pakai floral SVG bawaannya sendiri.
   */
  const florals = computed(() => {
    const f = opts.value.florals ?? {};
    return { tl: f.tl ?? null, tr: f.tr ?? null, bl: f.bl ?? null, br: f.br ?? null };
  });

  /**
   * BACKGROUND HALAMAN 2 LAPIS (di belakang kartu, bukan di dalam kartu):
   * - photo    : foto pengantin (lapis paling belakang)
   * - ornament : pola/ornamen transparan di atas foto
   */
  const background = computed(() => {
    const b = opts.value.background ?? {};
    return {
      photo:        b.photo ?? null,
      photo_mobile: b.photo_mobile ?? null, // potret 9:16 khusus layar HP
      ornament:     b.ornament_upload ?? b.ornament_asset ?? b.ornament ?? null,
    };
  });

  /**
   * Tata letak:
   * - card         : kartu untuk section KONTEN (setelah undangan dibuka)
   * - heroCard     : 'inherit' (ikut card) | 'card' | 'plain' — hero berdiri sendiri
   * - sectionHeight: 'full' (satu layar penuh) | 'auto' (setinggi konten;
   *                  solusi gap saat konten section pendek)
   */
  const layoutOpts = computed(() => ({
    card:          opts.value.layout?.card ?? true,
    heroCard:      opts.value.layout?.hero_card ?? 'inherit',
    sectionHeight: opts.value.layout?.section_height ?? 'full',
  }));

  /** Background per section — hanya dipakai saat mode kartu NONAKTIF. */
  const sectionBg = (key) => opts.value.section_bg?.[key] ?? null;

  /** Countdown: gaya angka + varian isi section (dipilih dari Filament). */
  const countdown = computed(() => {
    const cd = opts.value.countdown ?? {};
    return {
      style:  cd.style ?? 'circle',   // circle|boxed|minimal|pill|flip
      layout: cd.layout ?? 'simple',  // simple|photo|date|quote
      photo:  cd.photo ?? null,
      quote:  cd.quote ?? null,
    };
  });

  /** Preset animasi scroll GSAP (lihat composables/useReveal.js). */
  const animation = computed(() => opts.value.animation?.preset ?? 'fade-up');

  return { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, countdown, animation };
}

/** '#rrggbb' + opacity(0-100) -> 'rgba(...)'. Nilai tak valid dikembalikan apa adanya. */
function hexToRgba(hex, opacity = 100) {
  const m = /^#?([a-f\d]{6}|[a-f\d]{3})$/i.exec(hex ?? '');
  if (!m) return hex;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((ch) => ch + ch).join('');
  const n = parseInt(h, 16);
  const a = Math.min(100, Math.max(0, Number(opacity))) / 100;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Ubah URL YouTube biasa menjadi URL embed. */
export function toEmbedUrl(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

/** Ubah link Google Maps biasa menjadi URL embed sederhana. */
export function toMapsEmbed(url) {
  if (!url) return null;
  if (url.includes('/embed')) return url;
  const q = url.match(/[?&]q=([^&]+)/)?.[1] ?? encodeURIComponent(url.replace(/^https?:\/\/[^/]+\//, ''));
  return `https://www.google.com/maps?q=${q}&output=embed`;
}
