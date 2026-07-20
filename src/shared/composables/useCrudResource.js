import { unref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { api } from '../api/client';

/** { ...fields } -> FormData. Multipart + spoof `_method=PUT` (PHP tidak
 * mendukung multipart lewat method PUT native). */
function toFormData(payload, spoofMethod = null) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(payload)) {
    if (v !== null && v !== undefined) fd.append(k, v);
  }
  if (spoofMethod) fd.append('_method', spoofMethod);
  return fd;
}

/**
 * Factory untuk wrapper vue-query list/create/update/remove di atas REST
 * sub-resource milik satu undangan (mis. /invitation/{id}/events).
 *
 * @param {import('vue').Ref|*} id - invitationId, boleh ref/computed atau nilai biasa.
 * @param {object} opts
 * @param {(id) => string} opts.baseUrl - membangun URL koleksi dari id (sudah unref).
 * @param {string} opts.resourceName - dipakai sebagai bagian queryKey, mis. 'events'.
 * @param {boolean} [opts.multipart] - jika true, create/update dikirim sebagai FormData
 *   (update di-spoof lewat POST + `_method=PUT`).
 */
export function useCrudResource(id, { baseUrl, resourceName, multipart = false }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: [resourceName, id] });

  const list = useQuery({
    queryKey: [resourceName, id],
    queryFn: async () => (await api.get(baseUrl(unref(id)))).data,
    enabled: () => !!unref(id),
  });

  const create = useMutation({
    mutationFn: (payload) => api.post(baseUrl(unref(id)), multipart ? toFormData(payload) : payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id: resId, payload }) => (
      multipart
        ? api.post(`${baseUrl(unref(id))}/${resId}`, toFormData(payload, 'PUT'))
        : api.put(`${baseUrl(unref(id))}/${resId}`, payload)
    ),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (resId) => api.delete(`${baseUrl(unref(id))}/${resId}`),
    onSuccess: invalidate,
  });

  return { list, create, update, remove, invalidate, qc };
}
