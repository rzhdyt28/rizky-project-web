import { ref } from 'vue';

/** Link personal + pesan WA per tamu, dipakai lintas halaman dashboard. */
export function useGuestShare() {
  function guestLink(inv, guest) {
    return `${location.origin}/i/${inv.slug}?to=${encodeURIComponent(guest.name)}`;
  }

  function waMessage(inv, guest) {
    return [
      `Kepada Yth. ${guest.name},`,
      '',
      `Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan ${inv.groom_name} & ${inv.bride_name}.`,
      '',
      `Undangan lengkap dapat dibuka di tautan berikut:`,
      guestLink(inv, guest),
      '',
      'Merupakan suatu kehormatan bagi kami apabila berkenan hadir. Terima kasih.',
    ].join('\n');
  }

  function waHref(inv, guest) {
    const phone = (guest.phone || '').replace(/\D/g, '').replace(/^0/, '62');
    const text = encodeURIComponent(waMessage(inv, guest));
    return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
  }

  const copied = ref('');
  async function copy(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = key;
      setTimeout(() => { if (copied.value === key) copied.value = ''; }, 1600);
    } catch { /* clipboard bisa ditolak browser; abaikan */ }
  }

  return { guestLink, waMessage, waHref, copy, copied };
}

/** Status & url pratinjau — dipakai lintas halaman dashboard. */
export const STATUS_LABEL = { published: 'Tayang', draft: 'Draft', archived: 'Arsip' };

export function viewUrl(inv) {
  return inv.status === 'published' ? `/i/${inv.slug}` : `/i/${inv.slug}?preview=1`;
}
