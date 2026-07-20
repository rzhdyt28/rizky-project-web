import { useCrudResource } from '../../../shared/composables/useCrudResource';

const baseUrl = (id) => `/api/invitation/${id}/stories`;

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi. */
export function useStories(invitationId) {
  return useCrudResource(invitationId, { baseUrl, resourceName: 'stories', multipart: true });
}
