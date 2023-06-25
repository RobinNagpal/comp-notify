import { CompoundNotification } from '@/types/CompoundNotification';
import { PauseAction } from '@/types/NotificationPayloads';

export interface CompNotificationProps {
  notification: CompoundNotification<PauseAction>;
}
//  (bool supplyPaused, bool transferPaused, bool withdrawPaused, bool absorbPaused, bool buyPaused)
export default function PauseActionNotification({ notification }: CompNotificationProps) {
  return (
    <div>
      <div>SupplyPaused: {notification.payload.supplyPaused ? 'true' : 'false'}</div>
      <div>TransferPaused: {notification.payload.transferPaused ? 'true' : 'false'}</div>
      <div>WithdrawPaused: {notification.payload.withdrawPaused ? 'true' : 'false'}</div>
      <div>AbsorbPaused: {notification.payload.absorbPaused ? 'true' : 'false'}</div>
      <div>BuyPaused: {notification.payload.buyPaused ? 'true' : 'false'}</div>
    </div>
  );
}
