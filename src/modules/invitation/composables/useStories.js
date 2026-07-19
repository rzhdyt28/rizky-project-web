import { unref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

const base = (id) => `/api/invitation/${id}/stories`;

/** { title, happened_at, story, photo (File|null), sort_order } -> FormData. */
function toFormData(payload, spoofMethod = null) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(payload)) {
    if (v !== null && v !== undefined) fd.append(k, v);
  }
  if (spoofMethod) fd.append('_method', spoofMethod);
  return fd;
}

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi. */
export function useStories(invitationId) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['stories', invitationId] });

  const list = useQuery({
    queryKey: ['stories', invitationId],
    queryFn: async () => (await api.get(base(unref(invitationId)))).data,
    enabled: () => !!unref(invitationId),
  });

  const create = useMutation({
    mutationFn: (payload) => api.post(base(unref(invitationId)), toFormData(payload)),
    onSuccess: invalidate,
  });
  // multipart + PUT tidak didukung PHP secara native -> spoof lewat POST + _method.
  const update = useMutation({
    mutationFn: ({ id, payload }) => api.post(`${base(unref(invitationId))}/${id}`, toFormData(payload, 'PUT')),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id) => api.delete(`${base(unref(invitationId))}/${id}`),
    onSuccess: invalidate,
  });

  return { list, create, update, remove };
}
