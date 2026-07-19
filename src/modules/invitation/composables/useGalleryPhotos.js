import { unref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

const base = (id) => `/api/invitation/${id}/photos`;

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi. */
export function useGalleryPhotos(invitationId) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['gallery-photos', invitationId] });

  const list = useQuery({
    queryKey: ['gallery-photos', invitationId],
    queryFn: async () => (await api.get(base(unref(invitationId)))).data,
    enabled: () => !!unref(invitationId),
  });

  const upload = useMutation({
    mutationFn: ({ file, caption }) => {
      const fd = new FormData();
      fd.append('photo', file);
      if (caption) fd.append('caption', caption);
      return api.post(base(unref(invitationId)), fd);
    },
    onSuccess: invalidate,
  });
  const updateCaption = useMutation({
    mutationFn: ({ id, caption }) => api.put(`${base(unref(invitationId))}/${id}`, { caption }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id) => api.delete(`${base(unref(invitationId))}/${id}`),
    onSuccess: invalidate,
  });
  const reorder = useMutation({
    mutationFn: (order) => api.post(`${base(unref(invitationId))}/reorder`, { order }),
    onSuccess: invalidate,
  });

  return { list, upload, updateCaption, remove, reorder };
}
