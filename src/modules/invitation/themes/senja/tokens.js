/**
 * TOKEN TEMA SENJA — palet matahari terbenam (coklat tua + amber + krem),
 * mengikuti referensi visual: panel kiri coklat gelap, panel kanan foto
 * golden-hour. default_options di database hanyalah lapisan OVERRIDE admin;
 * kalau kosong pun tema tetap tampil benar berkat token ini.
 */
export default {
  colors: {
    accent:      '#8A4B2A', // coklat hangat: judul section, aksen
    paper:       '#FFF8F0', // permukaan kartu (krem hangat)
    ink:         '#5A4234', // teks coklat lembut
    gold:        '#D9A05B', // amber senja: label, garis, kehormatan
    button_bg:   '#F5E9D7', // pil krem (spt tombol "Buka Undangan" referensi)
    button_text: '#4A2318',
  },
  fonts: {
    heading: 'Cormorant Garamond',
    body:    'Jost',
    script:  'Great Vibes',
    accent:  'Jost', // label kecil kapital (eyebrow/label/caption/credit)
  },
};
