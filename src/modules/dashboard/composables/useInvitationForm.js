import { reactive } from 'vue';

const SECTION_KEYS = ['couple', 'events', 'countdown', 'love_story', 'gallery', 'video', 'rsvp', 'guestbook', 'gift', 'co_host'];

/** Bentuk kosong satu section (dipakai theme_options.sections.{key}) — cermin
 * InvitationResource::sectionDisplayFields() Filament. */
export function blankSection() {
  return { visible: true, card: '', card_style: '', section_bg: '', font_heading: '', font_body: '', title_size: '', title_color: '', body_size: '', body_color: '' };
}

/** Bentuk kosong penuh form edit undangan — cermin InvitationResource::form(). */
export function blankForm() {
  const sections = {};
  for (const k of SECTION_KEYS) sections[k] = blankSection();
  sections.countdown_hero = { visible: true };
  return {
    slug: '', status: 'draft', theme_id: null,
    groom_name: '', bride_name: '', groom_parents: '', bride_parents: '', opening_text: '',
    video_url: '', music_url: '', rsvp_enabled: true, guestbook_enabled: true,
    co_hosts: [],
    theme_options: {
      hero: {
        style: 'classic', position: '', effect: 'fade', interval: 6, dresscode_enabled: false, dresscode: '', card_style: '', name_font: '', slideshow: [],
        elements: {
          eyebrow: { align: '', order: 1 }, photo: { align: '', order: 2 }, names: { align: '', order: 3 }, date: { align: '', order: 4 },
          countdown: { align: '', order: 5 }, dresscode: { align: '', order: 6 }, guest: { align: '', order: 7 }, button: { align: '', order: 8 },
        },
      },
      background: { photo: '', photo_mobile: '', ornament_upload: '', ornament_asset: '' },
      layout: { card: true, hero_card: 'inherit', section_height: 'full' },
      couple: { style: '', show_photos: false, groom_photo: '', bride_photo: '' },
      events: { style: 'card' },
      countdown: { style: 'circle', layout: 'simple', photo: '', quote: '' },
      love_story: { show_photos: false, style: 'stacked' },
      gallery: { style: 'carousel' },
      video: { eyebrow: '', caption: '' },
      florals: { tl: '', tr: '', bl: '', br: '' },
      animation: { preset: 'fade-up' },
      fonts: { heading: '', body: '', script: '', css_url: '' },
      type: { title_size: '', title_color: '', body_size: '', body_color: '' },
      card: { style: '', bg: '', opacity: '', shadow_color: '', shadow_size: '', radius_tl: '', radius_tr: '', radius_bl: '', radius_br: '' },
      colors: { accent: '', paper: '', ink: '' },
      sections,
    },
  };
}

/** Isi `target` dari `source` secara dalam — key yang tidak ada di `source`
 * tetap punya nilai default dari `target` (form tidak pernah undefined).
 * Menelusuri key SOURCE (bukan cuma key target): field yang ada di data
 * tersimpan tapi belum didaftarkan di blankForm() tetap ikut termuat,
 * bukannya diam-diam dibuang lalu hilang saat form ini disimpan ulang. */
export function deepMerge(target, source) {
  if (!source) return;
  for (const k of Object.keys(source)) {
    if (source[k] === undefined || source[k] === null) continue;
    if (k in target && typeof target[k] === 'object' && !Array.isArray(target[k]) && target[k] !== null) {
      deepMerge(target[k], source[k]);
    } else {
      target[k] = source[k];
    }
  }
}

/** Reactive `form` untuk halaman Edit Undangan, plus `applyInvitation(inv)`
 * yang mengisinya dari data invitation asli (dipanggil dari watcher). */
export function useInvitationForm() {
  const form = reactive(blankForm());

  function applyInvitation(inv) {
    if (!inv) return;
    Object.assign(form, blankForm());
    form.slug = inv.slug; form.status = inv.status; form.theme_id = inv.theme_id;
    form.groom_name = inv.groom_name; form.bride_name = inv.bride_name;
    form.groom_parents = inv.groom_parents ?? ''; form.bride_parents = inv.bride_parents ?? '';
    form.opening_text = inv.opening_text ?? '';
    form.video_url = inv.video_url ?? ''; form.music_url = inv.music_url ?? '';
    form.rsvp_enabled = inv.rsvp_enabled ?? true; form.guestbook_enabled = inv.guestbook_enabled ?? true;
    form.co_hosts = Array.isArray(inv.co_hosts) ? inv.co_hosts.map((c) => ({ ...c })) : [];
    deepMerge(form.theme_options, inv.theme_options);
  }

  return { form, applyInvitation };
}
