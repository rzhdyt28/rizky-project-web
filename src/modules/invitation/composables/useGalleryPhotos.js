import { unref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';
import { useCrudResource } from '../../../shared/composables/useCrudResource';

const baseUrl = (id) => `/api/invitation/${id}/photos`;

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi.
 * `upload`/`updateCaption`/`reorder` tidak cocok dengan bentuk create/update
 * generik (field mapping & method berbeda), jadi tetap didefinisikan di sini,
 * di atas `list`/`remove`/`invalidate` dari factory bersama. */
export function useGalleryPhotos(invitationId) {
  const { list, remove, invalidate } = useCrudResource(invitationId, { baseUrl, resourceName: 'gallery-photos' });

  const upload = useMutation({
    mutationFn: ({ file, caption }) => {
      const fd = new FormData();
      fd.append('photo', file);
      if (caption) fd.append('caption', caption);
      return api.post(baseUrl(unref(invitationId)), fd);
    },
    onSuccess: invalidate,
  });
  const updateCaption = useMutation({
    mutationFn: ({ id, caption }) => api.put(`${baseUrl(unref(invitationId))}/${id}`, { caption }),
    onSuccess: invalidate,
  });
  const reorder = useMutation({
    mutationFn: (order) => api.post(`${baseUrl(unref(invitationId))}/reorder`, { order }),
    onSuccess: invalidate,
  });

  return { list, upload, updateCaption, remove, reorder };
}
