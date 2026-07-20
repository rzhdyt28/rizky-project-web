import { reactive, ref } from 'vue';

/**
 * State/handler bersama untuk pola halaman "list + form tambah/ubah" yang
 * berulang di beberapa halaman dashboard (Acara, Kado Digital, Kisah Cinta,
 * Galeri Foto): editingId, form reaktif, error message, start/reset edit,
 * dan submit yang otomatis pilih create/update.
 *
 * @param {object} emptyForm - bentuk kosong form, juga dipakai untuk reset.
 * @param {object} opts
 * @param {(form: object, editingId: any) => Promise<any>} opts.onSubmit -
 *   dipanggil dengan snapshot form saat ini dan editingId (null saat create).
 *   Harus reject/throw kalau gagal.
 * @param {(item: object) => object} [opts.mapToForm] - memetakan item list ke
 *   bentuk form saat mulai edit (default: salin field yang ada di emptyForm).
 * @param {() => void} [opts.onReset] - logika reset tambahan (mis. file ref).
 * @param {string} [opts.defaultErrorMessage]
 */
export function useEditableForm(emptyForm, { onSubmit, mapToForm, onReset, defaultErrorMessage = 'Gagal menyimpan.' } = {}) {
  const editingId = ref(null);
  const form = reactive({ ...emptyForm });
  const err = ref('');

  function startEdit(item) {
    editingId.value = item.id;
    const mapped = mapToForm ? mapToForm(item) : item;
    Object.assign(form, mapped);
  }

  function resetForm() {
    editingId.value = null;
    Object.assign(form, emptyForm);
    onReset?.();
  }

  async function submit() {
    err.value = '';
    try {
      await onSubmit({ ...form }, editingId.value);
      resetForm();
    } catch (e) {
      err.value = e.response?.data?.message || defaultErrorMessage;
    }
  }

  return { editingId, form, err, startEdit, resetForm, submit };
}
