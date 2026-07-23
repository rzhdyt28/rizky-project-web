<script setup>
/**
 * Mencerminkan InvitationLookResource::sectionElementStyleFields() Filament
 * ("Tipografi, Ukuran & Warna tiap elemen teks section", v5) — MENGGANTIKAN
 * field generik lama (font/ukuran/warna judul & isi) yang sudah dihapus dari
 * SectionDisplayFields.vue. `elements` = objek reaktif
 * theme_options.sections.{key}.elements (dimutasi langsung), `list` = array
 * [[elKey, label], ...] elemen yang relevan untuk section ini. Key 'title'
 * KHUSUS mengatur judul section itu sendiri. 3 field per elemen: font/ukuran/
 * warna -- font ditulis bebas (nama Google Fonts), font-nya dimuat otomatis
 * (lihat InvitationPublic.vue collectElementFonts()).
 */
defineProps({
  elements: { type: Object, required: true },
  list: { type: Array, required: true }, // [[elKey, label], ...]
});
</script>

<template>
  <div class="grid gap-2 border-t border-dashed border-slate-200 pt-3 dark:border-slate-700">
    <p class="text-xs font-medium opacity-70">Tipografi, Ukuran &amp; Warna tiap elemen teks section</p>
    <div v-for="[elKey, label] in list" :key="elKey" class="grid grid-cols-2 items-center gap-2 sm:grid-cols-4">
      <span class="text-xs opacity-70">{{ label }}</span>
      <input
        v-model="elements[elKey].font"
        list="element-fonts"
        placeholder="Font (bawaan)"
        class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <input
        v-model.number="elements[elKey].size"
        type="number"
        placeholder="Ukuran (px)"
        class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
      <input
        v-model="elements[elKey].color"
        type="color"
        class="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700"
      />
    </div>
  </div>
</template>
