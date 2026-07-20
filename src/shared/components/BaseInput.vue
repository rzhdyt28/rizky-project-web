<script setup>
/**
 * Input/textarea Tailwind bergaya seragam dipakai di seluruh form dashboard
 * (dulu class string yang sama diulang di puluhan tempat). `as="textarea"`
 * untuk textarea, `wide` untuk `sm:col-span-2`.
 */
defineProps({
  as: { type: String, default: 'input' }, // 'input' | 'textarea'
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  maxlength: { type: [String, Number], default: undefined },
  rows: { type: [String, Number], default: undefined },
  min: { type: [String, Number], default: undefined },
  max: { type: [String, Number], default: undefined },
  list: { type: String, default: undefined },
  wide: { type: Boolean, default: false },
});

const model = defineModel();
</script>

<template>
  <textarea
    v-if="as === 'textarea'"
    v-model="model"
    :placeholder="placeholder"
    :required="required"
    :maxlength="maxlength"
    :rows="rows"
    :class="['rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800', wide && 'sm:col-span-2']"
  />
  <input
    v-else
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    :maxlength="maxlength"
    :min="min"
    :max="max"
    :list="list"
    :class="['rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800', wide && 'sm:col-span-2']"
  />
</template>
