import { getAssetDetails } from '@/components/notifications/getAssetDetails';
import { CompoundNotification } from '@/types/CompoundNotification';
import { AbsorbCollateral } from '@/types/NotificationPayloads';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export interface CompNotificationProps {
  notification: CompoundNotification<AbsorbCollateral>;
}
//  (bool supplyPaused, bool transferPaused, bool withdrawPaused, bool absorbPaused, bool buyPaused)
export default function AbsorbCollateralNotification({ notification }: CompNotificationProps) {
  const [assetDetails, setAssetDetails] = useState<{ normalizedAmount: string; symbol: string }>();
  const provider = new ethers.BrowserProvider(window.ethereum as any);
  useEffect(() => {
    getAssetDetails(notification.payload.asset, notification.payload.collateralAbsorbed.toString(), provider).then((details) => {
      setAssetDetails(details);
    });
  }, [notification]);
  return (
    <div>
      <div>Absorber: {notification.payload.absorber}</div>
      <div>
        Collateral Absorbed: {assetDetails?.normalizedAmount} {assetDetails?.symbol}
      </div>
      <div>USD Value: {notification.payload.usdValue}</div>
    </div>
  );
}
