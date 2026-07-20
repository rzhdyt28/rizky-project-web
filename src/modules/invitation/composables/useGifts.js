import { useCrudResource } from '../../../shared/composables/useCrudResource';

const baseUrl = (id) => `/api/invitation/${id}/gifts`;

/** invitationId boleh ref/computed atau nilai biasa — query menunggu sampai terisi. */
export function useGifts(invitationId) {
  return useCrudResource(invitationId, { baseUrl, resourceName: 'gifts', multipart: true });
}
