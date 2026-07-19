import { api } from '../../../shared/api/client';

/** Upload generik ke POST /api/invitation/{id}/upload (lihat InvitationController::upload). */
export async function uploadThemeFile(invitationId, file, directory) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('directory', directory);
  const { data } = await api.post(`/api/invitation/${invitationId}/upload`, fd);
  return data.path;
}
