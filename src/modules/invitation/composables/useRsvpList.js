import { unref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

/** index() backend sudah balikin { summary, items } sekaligus (lihat RsvpController). */
export function useRsvpList(invitationId) {
  return useQuery({
    queryKey: ['rsvp-list', invitationId],
    queryFn: async () => (await api.get(`/api/invitation/${unref(invitationId)}/rsvps`)).data,
    enabled: () => !!unref(invitationId),
  });
}

/** Link unduh langsung (GET, tidak butuh CSRF) — pakai di <a :href="...">. */
export function rsvpExportUrl(invitationId) {
  return `/api/invitation/${unref(invitationId)}/rsvps/export`;
}
