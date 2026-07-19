<script setup>
/**
 * _CORE / Mempelai (v3) — 4 DESAIN + foto pria/wanita:
 *   classic : teks bertumpuk klasik (default; satu-satunya yang rapi tanpa foto)
 *   cards   : dua kartu foto berdampingan, nama di bawah foto
 *   circle  : foto lingkaran besar, "&" kaligrafi di tengah
 *   arch    : foto bingkai lengkung ala gerbang, berdampingan di desktop
 * Tanpa foto (atau toggle foto mati), desain berfoto otomatis JATUH ke
 * classic supaya tidak pernah tampil bolong.
 */
import { computed } from 'vue';
import SectionWrapper from '../ui/SectionWrapper.vue';
import { assetUrl } from '../../../composables/assets';

const props = defineProps({
  invitation: { type: Object, required: true },
  opts:       { type: Object, default: () => ({}) }, // { style, show_photos, groom_photo, bride_photo }
});

const hasPhotos = computed(
  () => !!props.opts.show_photos && !!(props.opts.groom_photo || props.opts.bride_photo)
);
const style = computed(() => {
  const s = props.opts.style ?? 'classic';
  return s !== 'classic' && !hasPhotos.value ? 'classic' : s;
});

const people = computed(() => [
  { name: props.invitation.groom_name, parents: props.invitation.groom_parents, parentLabel: 'Putra dari', photo: props.opts.groom_photo },
  { name: props.invitation.bride_name, parents: props.invitation.bride_parents, parentLabel: 'Putri dari', photo: props.opts.bride_photo },
]);
</script>

<template>
  <SectionWrapper>
    <p class="c-couple__eyebrow mb-2 text-[10px] uppercase tracking-[0.35em]" :style="{ color: 'var(--t-gold)' }">
      Bismillahirrahmanirrahim
    </p>
    <p class="max-w-md mx-auto mb-6 text-sm italic" :style="{ fontFamily: 'var(--t-font-head)' }">
      {{ invitation.opening_text || 'Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami.' }}
    </p>

    <!-- 1) CLASSIC — bertumpuk klasik -->
    <div v-if="style === 'classic'" class="grid gap-3">
      <div>
        <h2 class="text-2xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)' }">{{ invitation.groom_name }}</h2>
        <p v-if="invitation.groom_parents" class="text-sm">Putra dari {{ invitation.groom_parents }}</p>
      </div>
      <div class="text-2xl italic c-couple__amp" :style="{ fontFamily: 'var(--t-font-head)', color: 'var(--t-gold)' }">&amp;</div>
      <div>
        <h2 class="text-2xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)' }">{{ invitation.bride_name }}</h2>
        <p v-if="invitation.bride_parents" class="text-sm">Putri dari {{ invitation.bride_parents }}</p>
      </div>
    </div>

    <!-- 2) CARDS — dua kartu foto berdampingan -->
    <div v-else-if="style === 'cards'" class="grid gap-4 c-couple__cards sm:grid-cols-2">
      <figure v-for="p in people" :key="p.name" class="c-couple__carditem">
        <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="c-couple__cardimg aspect-[3/4] w-full object-cover" />
        <figcaption class="pt-3">
          <h2 class="text-xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)' }">{{ p.name }}</h2>
          <p v-if="p.parents" class="text-xs opacity-80">{{ p.parentLabel }} {{ p.parents }}</p>
        </figcaption>
      </figure>
    </div>

    <!-- 3) CIRCLE — foto lingkaran, "&" kaligrafi di tengah -->
    <div v-else-if="style === 'circle'" class="grid gap-2 justify-items-center">
      <template v-for="(p, i) in people" :key="p.name">
        <div class="grid gap-2 justify-items-center">
          <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="object-cover rounded-full c-couple__circleimg h-36 w-36 sm:h-40 sm:w-40" />
          <h2 class="text-2xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)' }">{{ p.name }}</h2>
          <p v-if="p.parents" class="text-xs opacity-80">{{ p.parentLabel }} {{ p.parents }}</p>
        </div>
        <div v-if="i === 0" class="py-1 text-4xl c-couple__amp" :style="{ fontFamily: 'var(--t-font-script)', color: 'var(--t-gold)' }">&amp;</div>
      </template>
    </div>

    <!-- 4) ARCH — bingkai lengkung ala gerbang -->
    <div v-else class="grid gap-5 c-couple__cards sm:grid-cols-2">
      <figure v-for="p in people" :key="p.name" class="grid gap-2 justify-items-center">
        <img v-if="p.photo" :src="assetUrl(p.photo)" :alt="p.name" loading="lazy" class="c-couple__archimg aspect-[3/4] w-full max-w-[13rem] object-cover" />
        <figcaption>
          <h2 class="text-xl c-couple__name" :style="{ fontFamily: 'var(--t-font-head)' }">{{ p.name }}</h2>
          <p v-if="p.parents" class="text-xs opacity-80">{{ p.parentLabel }} {{ p.parents }}</p>
        </figcaption>
      </figure>
    </div>
  </SectionWrapper>
</template>

<style scoped>
/* Default netral — tema bebas menimpa via class hook c-couple__*. */
.c-couple__cardimg {
  border-radius: 0.9rem;
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.35);
}
.c-couple__circleimg {
  border: 3px solid var(--t-gold, #b08d4a);
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.35);
}
.c-couple__archimg {
  /* Lengkung "gerbang": atas full melengkung, bawah siku. */
  border-radius: 999px 999px 14px 14px;
  border: 2px solid color-mix(in srgb, var(--t-gold, #b08d4a) 65%, transparent);
}
</style>
