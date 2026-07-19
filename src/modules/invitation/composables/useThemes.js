import { useQuery } from '@tanstack/vue-query';
import { api } from '../../../shared/api/client';

/** Tema yang boleh dipakai tenant (sesuai tier paket) — lihat InvitationController::themes(). */
export function useThemes() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: async () => (await api.get('/api/invitation/themes')).data,
  });
}
