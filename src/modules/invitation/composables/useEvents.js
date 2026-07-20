import { useCrudResource } from '../../../shared/composables/useCrudResource';

const baseUrl = (id) => `/api/invitation/${id}/events`;

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi. */
export function useEvents(invitationId) {
  return useCrudResource(invitationId, { baseUrl, resourceName: 'events' });
}
