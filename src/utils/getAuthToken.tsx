import { ShowNotificationOptions } from '@/hooks/useNotification';
import { Session } from '@/types/auth/Session';

export function getAuthToken(session: any, showNotification: (options: ShowNotificationOptions) => void) {
  const dodaoAccessToken = (session as Session)?.dodaoAccessToken;
  if (!dodaoAccessToken) {
    showNotification({ message: 'Error. No session Present', type: 'error' });
    throw new Error('No dodaoAccessToken');
  }
  return dodaoAccessToken;
}
