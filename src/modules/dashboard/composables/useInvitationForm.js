import { reactive } from 'vue';

const SECTION_KEYS = ['couple', 'events', 'countdown', 'love_story', 'gallery', 'video', 'rsvp', 'guestbook', 'gift', 'co_host'];

/** Daftar elemen bernama per-section (v4) -- cermin persis daftar $elements
 * yang dipakai tiap panggilan sectionElementStyleFields() di
 * InvitationLookResource.php (tab masing-masing section). */
export const SECTION_ELEMENTS = {
  countdown:  ['eyebrow', 'date', 'quote', 'label'],
  couple:     ['eyebrow', 'opening', 'names', 'parents'],
  events:     ['title', 'name', 'date', 'venue'],
  co_host:    ['title', 'label', 'name'],
  love_story: ['title', 'date', 'name', 'text'],
  video:      ['title', 'eyebrow', 'caption', 'credit'],
  rsvp:       ['title', 'button'],
  guestbook:  ['title', 'name', 'text'],
  gift:       ['title', 'name', 'value'],
  gallery:    ['title', 'caption'],
};

function blankElements(key) {
  const out = {};
  for (const elKey of SECTION_ELEMENTS[key] ?? []) out[elKey] = { font: '', size: '', color: '' };
  return out;
}

/** Bentuk kosong satu section (dipakai theme_options.sections.{key}) — cermin
 * InvitationLookResource::sectionDisplayFields() + sectionElementStyleFields() Filament. */
export function blankSection(key) {
  return {
    visible: true, card: '', card_style: '', card_bg: '', card_bg_photo: '', bg_color: '',
    elements: blankElements(key),
  };
}

/** Bentuk kosong penuh form edit undangan — cermin InvitationLookResource::form(). */
export function blankForm() {
  const sections = {};
  const sectionBg = {};
  for (const k of SECTION_KEYS) { sections[k] = blankSection(k); sectionBg[k] = ''; }
  sections.countdown_hero = { visible: true };
  sections.hero = { card_bg: '', card_bg_photo: '', bg_color: '', elements: {} };
  sectionBg.hero = '';
  return {
    slug: '', status: 'draft', theme_id: null,
    groom_name: '', bride_name: '', groom_parents: '', bride_parents: '', opening_text: '',
    video_url: '', music_url: '', rsvp_enabled: true, guestbook_enabled: true,
    co_hosts: [],
    theme_options: {
      hero: {
        style: 'classic', effect: 'fade', interval: 6, dresscode_enabled: false, dresscode: '',
        card_style: '', slideshow: [], video_url: '', video_effect: '', framed_photo: '',
        elements: {
          eyebrow: { align: '', order: 1, font: '', size: '', color: '' },
          photo: { align: '', order: 2 },
          names: { align: '', order: 3, font: '', size: '', color: '' },
          date: { align: '', order: 4, font: '', size: '', color: '' },
          countdown: { align: '', order: 5 },
          countdown_label: { font: '', size: '', color: '' },
          dresscode: { align: '', order: 6, font: '', size: '', color: '' },
          guest: { align: '', order: 7, font: '', size: '', color: '' },
          button: { align: '', order: 8, font: '', size: '', color: '' },
        },
      },
      background: { photo: '', photo_mobile: '', ornament_upload: '', ornament_asset: '' },
      layout: { card: true, hero_card: 'inherit', section_height: 'full' },
      couple: { style: '', show_photos: false, groom_photo: '', bride_photo: '', show_eyebrow: true, eyebrow_text: '' },
      events: { style: 'card', show_maps: true },
      countdown: { style: 'circle', layout: 'simple', photo: '', quote: '' },
      love_story: { show_photos: false, style: 'stacked' },
      gallery: { style: 'carousel', caption: '' },
      video: { eyebrow: '', caption: '', style: 'classic' },
      rsvp: { style: 'card' },
      guestbook: { style: 'list' },
      gift: { style: 'panel' },
      co_host: { style: 'classic' },
      florals: { tl: '', tr: '', bl: '', br: '' },
      animation: { preset: 'fade-up' },
      fonts: { heading: '', body: '', script: '', accent: '', css_url: '' },
      card: { style: '', bg: '', opacity: '', shadow_color: '', shadow_size: '', radius_tl: '', radius_tr: '', radius_bl: '', radius_br: '' },
      colors: { accent: '', paper: '', ink: '' },
      sections,
      section_bg: sectionBg,
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
    // CATATAN (v4+): Invitation.theme_options TIDAK dipakai lagi di sini --
    // kolom itu tidak dibaca render publik (lihat PublicInvitationController).
    // Pengaturan visual diisi TERPISAH lewat applyLook() dari default_options
    // child theme (GET /api/invitation/{id}/look), dipanggil dari EditUndangan.vue.
  }

  /** Isi form.theme_options dari default_options CHILD THEME (GET .../look). */
  function applyLook(defaultOptions) {
    Object.assign(form.theme_options, blankForm().theme_options);
    deepMerge(form.theme_options, defaultOptions);
  }

  return { form, applyInvitation, applyLook };
}
