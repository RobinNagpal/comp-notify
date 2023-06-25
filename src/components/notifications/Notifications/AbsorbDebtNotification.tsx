import { getAssetDetails } from '@/components/notifications/getAssetDetails';
import { CompoundNotification } from '@/types/CompoundNotification';
import { AbsorbDebt } from '@/types/NotificationPayloads';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export interface CompNotificationProps {
  notification: CompoundNotification<AbsorbDebt>;
}
//  (bool supplyPaused, bool transferPaused, bool withdrawPaused, bool absorbPaused, bool buyPaused)
export default function AbsorbDebtNotification({ notification }: CompNotificationProps) {
  const [assetDetails, setAssetDetails] = useState<{ normalizedAmount: string; symbol: string }>();
  const provider = new ethers.BrowserProvider(window.ethereum as any);
  useEffect(() => {
    getAssetDetails('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', notification.payload.basePaidOut.toString(), provider).then((details) => {
      setAssetDetails(details);
    });
  }, [notification]);
  return (
    <div>
      <div>Absorbed: {notification.payload.absorber}</div>
      <div>BasePaidOut: {assetDetails?.normalizedAmount} USDC</div>
      <div>USD Value: {notification.payload.usdValue}</div>
    </div>
  );
}
