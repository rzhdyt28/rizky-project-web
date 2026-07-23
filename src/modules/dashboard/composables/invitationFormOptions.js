export const CARD_STYLES = {
  glass: 'Glass — kaca buram (blur)', outline: 'Outline — garis tepi, tanpa isi',
  flat: 'Flat — polos tanpa shadow', gradient: 'Gradient — gradasi lembut',
  stamp: 'Stamp — tepi perangko', default: 'Polos bawaan tema',
  java: 'Java — border ganda emas-cokelat bermotif',
  brutalist: 'Modern — sudut kotak, border tebal, shadow keras',
  vintage: 'Klasik — bingkai ganda ala pigura foto lama',
  line: 'Garis Minimalis — cuma garis tipis, tanpa isi',
  royal: 'Royal — border foil emas, kesan mewah',
};

export const HEADING_FONTS = ['Cormorant Garamond', 'Playfair Display', 'Cinzel', 'Lora', 'EB Garamond', 'Marcellus'];
export const BODY_FONTS = ['Jost', 'Poppins', 'Lato', 'Open Sans', 'Nunito', 'Inter', 'Mulish'];
export const SCRIPT_FONTS = ['Great Vibes', 'Dancing Script', 'Parisienne', 'Allura', 'Sacramento', 'Alex Brush'];
export const ACCENT_FONTS = ['Jost', 'Poppins', 'Lato', 'Open Sans', 'Nunito', 'Inter', 'Mulish'];

/** Cermin ThemeOptionsSchema::FONT_CATEGORIES (backend) -- dipakai dropdown font per-elemen (v6). */
export const FONT_CATEGORIES = {
  heading: 'Ikut Font Judul Section',
  body:    'Ikut Font Teks Isi',
  script:  'Ikut Font Kaligrafi',
  accent:  'Ikut Font Aksen',
};
