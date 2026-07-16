import { computed } from 'vue';

/**
 * Parse theme_options (hasil merge default tema + override undangan dari API)
 * -> cssVars (CSS variables), can (visibility), labels, sectionOrder, sectionBg.
 */
export function useThemeOptions(invitationRef, featuresRef) {
  const opts = computed(() => invitationRef.value?.theme_options ?? {});

  const cssVars = computed(() => {
    const c = opts.value.colors ?? {};
    const f = opts.value.fonts ?? {};
    return {
      '--t-accent':   c.accent ?? '#2F4A3C',
      '--t-paper':    c.paper ?? '#F7F4EC',
      '--t-ink':      c.ink ?? '#22301F',
      '--t-gold':     c.gold ?? '#B08D4A',
      '--t-btn-bg':   c.button_bg ?? c.accent ?? '#2F4A3C',
      '--t-btn-text': c.button_text ?? c.paper ?? '#F7F4EC',
      '--t-font-head': `'${f.heading ?? 'Cormorant Garamond'}', serif`,
      '--t-font-body': `'${f.body ?? 'Jost'}', sans-serif`,
    };
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

  /** Urutan render section berdasarkan sections.{key}.order. */
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

  /** Background per section: inherit -> null (pakai global). */
  const sectionBg = (key) => {
    const bg = opts.value.sections?.[key]?.background;
    if (!bg || bg.type === 'inherit') return null;
    return bg;
  };

  const globalBg = computed(() => opts.value.background ?? { type: 'color' });
  const cover = computed(() => opts.value.cover ?? {});

  return { cssVars, can, sectionOrder, labels, sectionBg, globalBg, cover };
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
