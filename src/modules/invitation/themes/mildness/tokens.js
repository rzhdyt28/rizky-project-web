/**
 * TOKEN TEMA MILDNESS — sumber default warna & font di frontend.
 * default_options di database hanyalah lapisan OVERRIDE dari admin;
 * kalau kosong pun tema tetap tampil benar berkat token ini.
 */
export default {
  colors: {
    accent:      '#3F5B7C', // navy-slate: tombol, nama kaligrafi
    paper:       '#FBFCFE', // permukaan kartu (nyaris putih kebiruan)
    ink:         '#46586A', // teks slate
    gold:        '#8AA1BC', // aksen dusty-blue
    button_bg:   '#3F5B7C',
    button_text: '#FFFFFF',
  },
  fonts: {
    heading: 'Cormorant Garamond',
    body:    'Jost',
    script:  'Great Vibes',
    accent:  'Jost', // label kecil kapital (eyebrow/label/caption/credit)
  },
};
