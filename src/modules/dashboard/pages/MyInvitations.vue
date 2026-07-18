<script setup>
/**
 * DASHBOARD PEMILIK — bukan lagi stub.
 * User biasa : daftar undangan miliknya + status + pratinjau/lihat,
 *              rekap RSVP, dan MANAJEMEN TAMU (tambah/hapus, salin link
 *              personal, bagikan langsung ke WhatsApp).
 * Admin      : semuanya di atas + kartu pintasan Panel Admin (Filament)
 *              dan Agent Monitoring.
 */
import { reactive, ref } from 'vue';
import { useMyInvitations } from '../../invitation/composables/useInvitation';
import { useAuthStore } from '../../../shared/stores/auth';
import { api } from '../../../shared/api/client';

const auth = useAuthStore();
const { data, isLoading, refetch } = useMyInvitations();

const apiBase = import.meta.env.VITE_API_URL || '';
const adminUrl = `${apiBase}/admin`;

/* ============ state per-undangan (tamu + rsvp), diisi saat dibuka ============ */
const open = ref(null); // id undangan yang panelnya sedang terbuka
const panel = reactive({}); // { [id]: { guests, rsvp, busy, form:{name,phone} } }

async function togglePanel(inv) {
  if (open.value === inv.id) { open.value = null; return; }
  open.value = inv.id;
  if (!panel[inv.id]) {
    panel[inv.id] = { guests: [], rsvp: null, busy: false, err: '', form: { name: '', phone: '' } };
    await Promise.all([loadGuests(inv), loadRsvp(inv)]);
  }
}

async function loadGuests(inv) {
  try { panel[inv.id].guests = (await api.get(`/api/invitation/${inv.id}/guests`)).data; }
  catch { panel[inv.id].err = 'Gagal memuat tamu.'; }
}

async function loadRsvp(inv) {
  try { panel[inv.id].rsvp = (await api.get(`/api/invitation/${inv.id}/rsvps`)).data.summary; }
  catch { /* rekap opsional; biarkan kosong */ }
}

async function addGuest(inv) {
  const p = panel[inv.id];
  if (!p.form.name.trim()) return;
  p.busy = true; p.err = '';
  try {
    await api.post(`/api/invitation/${inv.id}/guests`, {
      name: p.form.name.trim(),
      phone: p.form.phone.trim() || null,
    });
    p.form.name = ''; p.form.phone = '';
    await loadGuests(inv);
  } catch (e) {
    p.err = e.response?.data?.message || 'Gagal menambah tamu.';
  } finally { p.busy = false; }
}

async function removeGuest(inv, guest) {
  const p = panel[inv.id];
  try {
    await api.delete(`/api/invitation/${inv.id}/guests/${guest.id}`);
    p.guests = p.guests.filter((g) => g.id !== guest.id);
  } catch { p.err = 'Gagal menghapus tamu.'; }
}

/* ============ link personal + WhatsApp ============ */
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

/* ============ util tampilan ============ */
const STATUS = { published: 'Tayang', draft: 'Draft', archived: 'Arsip' };
function viewUrl(inv) {
  return inv.status === 'published' ? `/i/${inv.slug}` : `/i/${inv.slug}?preview=1`;
}
function rsvpCount(summary, key) {
  const row = summary?.find((r) => r.attendance === key);
  return { total: row?.total ?? 0, pax: row?.pax ?? 0 };
}
</script>

<template>
  <main class="dash">
    <!-- ===== header ===== -->
    <header class="top">
      <div>
        <h1>Dashboard</h1>
        <p class="hello">Halo, {{ auth.user?.name }} <span v-if="auth.isAdmin" class="chip admin">admin</span></p>
      </div>
      <button class="link-btn" @click="auth.logout().then(() => $router.push('/'))">Keluar</button>
    </header>

    <!-- ===== pintasan admin ===== -->
    <section v-if="auth.isAdmin" class="admin-row">
      <a class="admin-card" :href="adminUrl" target="_blank" rel="noopener">
        <strong>Panel Admin</strong>
        <span>Kelola undangan, tema, pustaka aset, paket & pelanggan (Filament).</span>
      </a>
      <RouterLink class="admin-card" to="/agent">
        <strong>Agent Monitoring</strong>
        <span>Pantau agen lamaran otomatis.</span>
      </RouterLink>
    </section>

    <!-- ===== daftar undangan ===== -->
    <section class="list">
      <h2>Undangan Saya</h2>

      <p v-if="isLoading" class="muted">Memuat…</p>

      <div v-else-if="!data?.data?.length" class="empty">
        <p>Belum ada undangan atas akun ini.</p>
        <p class="muted">Hubungi admin untuk pembuatan undangan pertama Anda — setelah dibuat, kelola tamunya dari sini.</p>
      </div>

      <article v-else v-for="inv in data.data" :key="inv.id" class="card">
        <div class="card-head">
          <div>
            <h3>{{ inv.groom_name }} &amp; {{ inv.bride_name }}</h3>
            <p class="meta">
              <code>/{{ inv.slug }}</code>
              <span class="chip" :class="inv.status">{{ STATUS[inv.status] ?? inv.status }}</span>
              <span v-if="inv.theme" class="chip theme">{{ inv.theme.name }}</span>
            </p>
          </div>
          <div class="actions">
            <a class="btn ghost" :href="viewUrl(inv)" target="_blank" rel="noopener">
              {{ inv.status === 'published' ? 'Lihat' : 'Pratinjau' }}
            </a>
            <button class="btn solid" @click="togglePanel(inv)">
              {{ open === inv.id ? 'Tutup' : 'Tamu & RSVP' }}
            </button>
          </div>
        </div>

        <!-- ===== panel tamu + rsvp ===== -->
        <div v-if="open === inv.id && panel[inv.id]" class="panel">
          <!-- rekap RSVP -->
          <div v-if="panel[inv.id].rsvp" class="rsvp-row">
            <div class="stat ok">
              <strong>{{ rsvpCount(panel[inv.id].rsvp, 'attending').total }}</strong>
              <span>Hadir ({{ rsvpCount(panel[inv.id].rsvp, 'attending').pax }} org)</span>
            </div>
            <div class="stat no">
              <strong>{{ rsvpCount(panel[inv.id].rsvp, 'not_attending').total }}</strong>
              <span>Berhalangan</span>
            </div>
            <div class="stat maybe">
              <strong>{{ rsvpCount(panel[inv.id].rsvp, 'maybe').total }}</strong>
              <span>Ragu</span>
            </div>
          </div>

          <!-- form tambah tamu -->
          <form class="guest-form" @submit.prevent="addGuest(inv)">
            <input v-model="panel[inv.id].form.name" placeholder="Nama tamu" required maxlength="120" />
            <input v-model="panel[inv.id].form.phone" placeholder="No. WA (opsional)" maxlength="30" />
            <button class="btn solid" :disabled="panel[inv.id].busy">Tambah</button>
          </form>
          <p v-if="panel[inv.id].err" class="err">{{ panel[inv.id].err }}</p>

          <!-- daftar tamu -->
          <p v-if="!panel[inv.id].guests.length" class="muted">
            Belum ada tamu. Tambahkan nama di atas — tiap tamu otomatis mendapat link undangan dengan namanya.
          </p>
          <ul v-else class="guests">
            <li v-for="g in panel[inv.id].guests" :key="g.id">
              <div class="g-info">
                <strong>{{ g.name }}</strong>
                <small v-if="g.phone">{{ g.phone }}</small>
              </div>
              <div class="g-actions">
                <button class="mini" @click="copy(guestLink(inv, g), `l${g.id}`)">
                  {{ copied === `l${g.id}` ? 'Tersalin ✓' : 'Salin link' }}
                </button>
                <button class="mini" @click="copy(waMessage(inv, g), `m${g.id}`)">
                  {{ copied === `m${g.id}` ? 'Tersalin ✓' : 'Salin pesan' }}
                </button>
                <a class="mini wa" :href="waHref(inv, g)" target="_blank" rel="noopener">WhatsApp</a>
                <button class="mini danger" @click="removeGuest(inv, g)">Hapus</button>
              </div>
            </li>
          </ul>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dash { max-width: 880px; margin: 0 auto; padding: 1.6rem 1.1rem 3rem;
  font-family: 'Jost', sans-serif; color: #46586a; }
h1, h2, h3 { font-family: 'Cormorant Garamond', serif; font-weight: 500; }
.top { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
.hello { opacity: .8; font-size: .9rem; }
.link-btn { border: 1px solid #3f5b7c; color: #3f5b7c; background: none;
  padding: .4rem 1rem; border-radius: 999px; cursor: pointer; font: inherit; font-size: .8rem; }

.chip { display: inline-block; font-size: .66rem; letter-spacing: .06em; text-transform: uppercase;
  padding: .14rem .55rem; border-radius: 999px; background: #e6edf4; }
.chip.admin { background: #3f5b7c; color: #fff; margin-left: .4rem; }
.chip.published { background: #e0efe4; color: #2f6b46; }
.chip.draft { background: #f6eddc; color: #8a6d1f; }
.chip.archived { background: #ececec; color: #666; }
.chip.theme { background: #eef; color: #3f5b7c; }

.admin-row { display: grid; gap: .8rem; margin: 1.2rem 0; }
.admin-card { display: grid; gap: .15rem; background: #3f5b7c; color: #fff; text-decoration: none;
  border-radius: 1rem; padding: 1rem 1.2rem; }
.admin-card span { font-size: .82rem; opacity: .85; }

.list h2 { margin: 1.6rem 0 .8rem; }
.muted { opacity: .65; font-size: .9rem; }
.empty { background: #fff; border-radius: 1rem; padding: 1.4rem;
  box-shadow: 0 14px 30px -22px rgba(63, 91, 124, .45); }

.card { background: #fff; border-radius: 1rem; padding: 1.1rem 1.2rem; margin-bottom: .9rem;
  box-shadow: 0 14px 30px -22px rgba(63, 91, 124, .45); }
.card-head { display: flex; justify-content: space-between; gap: .9rem; flex-wrap: wrap; }
.card h3 { font-size: 1.25rem; }
.meta { display: flex; align-items: center; gap: .45rem; flex-wrap: wrap; margin-top: .25rem; }
.meta code { font-size: .8rem; background: #f1f5f9; padding: .1rem .4rem; border-radius: .3rem; }
.actions { display: flex; gap: .5rem; align-items: flex-start; }
.btn { border-radius: 999px; padding: .5rem 1.1rem; font-size: .74rem; letter-spacing: .08em;
  text-transform: uppercase; text-decoration: none; cursor: pointer; font-family: inherit; }
.btn.solid { background: #3f5b7c; color: #fff; border: 0; }
.btn.ghost { border: 1px solid #3f5b7c; color: #3f5b7c; background: none; }

.panel { border-top: 1px dashed rgba(70, 88, 106, .25); margin-top: 1rem; padding-top: 1rem; }
.rsvp-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; margin-bottom: 1rem; }
.stat { border-radius: .8rem; padding: .6rem; text-align: center; background: #f4f7fa; }
.stat strong { display: block; font-size: 1.3rem; }
.stat span { font-size: .7rem; opacity: .75; }
.stat.ok { background: #e9f4ec; } .stat.no { background: #faeeee; } .stat.maybe { background: #f7f2e3; }

.guest-form { display: grid; grid-template-columns: 1fr; gap: .5rem; margin-bottom: .8rem; }
.guest-form input { padding: .6rem .8rem; border: 1px solid rgba(70, 88, 106, .3);
  border-radius: .6rem; font: inherit; font-size: .9rem; }
.err { color: #a33; font-size: .82rem; margin-bottom: .5rem; }

.guests { list-style: none; padding: 0; margin: 0; display: grid; gap: .45rem; }
.guests li { display: flex; justify-content: space-between; align-items: center; gap: .7rem;
  flex-wrap: wrap; background: #f7fafc; border-radius: .7rem; padding: .55rem .75rem; }
.g-info small { display: block; opacity: .65; }
.g-actions { display: flex; gap: .35rem; flex-wrap: wrap; }
.mini { font: inherit; font-size: .72rem; border: 1px solid rgba(70, 88, 106, .3);
  background: #fff; border-radius: 999px; padding: .3rem .7rem; cursor: pointer;
  text-decoration: none; color: inherit; }
.mini.wa { border-color: #1fa855; color: #1fa855; }
.mini.danger { border-color: #c66; color: #c66; }

@media (min-width: 560px) {
  .admin-row { grid-template-columns: 1fr 1fr; }
  .guest-form { grid-template-columns: 1fr 1fr auto; }
}
</style>
