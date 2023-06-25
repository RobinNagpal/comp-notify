import { getAssetDetails } from '@/components/notifications/getAssetDetails';
import AbsorbCollateralNotification from '@/components/notifications/Notifications/AbsorbCollateralNotification';
import AbsorbDebtNotification from '@/components/notifications/Notifications/AbsorbDebtNotification';
import PauseActionNotification from '@/components/notifications/Notifications/PauseActionNotification';
import { CompoundNotification } from '@/types/CompoundNotification';
import { EventsEnum } from '@/types/events/EventsEnum';
import { WithdrawReserves } from '@/types/NotificationPayloads';

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export interface CompNotificationProps {
  notification: CompoundNotification<any>;
}

export function CompNotification({ notification }: CompNotificationProps) {
  const [assetDetails, setAssetDetails] = useState<{ normalizedAmount: string; symbol: string }>();
  const provider = new ethers.BrowserProvider(window.ethereum as any);

  useEffect(() => {
    if (
      notification.event === EventsEnum.SupplyCollateral ||
      notification.event === EventsEnum.WithdrawCollateral ||
      notification.event === EventsEnum.TransferCollateral ||
      notification.event === EventsEnum.WithdrawReserves
    ) {
      getAssetDetails(notification.payload.asset, notification.payload.amount, provider).then((details) => {
        setAssetDetails(details);
      });
    }

    if (notification.event === EventsEnum.Supply || notification.event === EventsEnum.Withdraw) {
      getAssetDetails('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', notification.payload.amount, provider).then((details) => {
        setAssetDetails(details);
      });
    }
  }, [notification]);
  if (notification.event === EventsEnum.SupplyCollateral) {
    return (
      <div>
        SupplyCollateral: {assetDetails?.normalizedAmount} {assetDetails?.symbol}
      </div>
    );
  }
  if (notification.event === EventsEnum.WithdrawCollateral) {
    return (
      <div>
        WithdrawCollateral: {assetDetails?.normalizedAmount} {assetDetails?.symbol}
      </div>
    );
  }
  if (notification.event === EventsEnum.TransferCollateral) {
    return (
      <div>
        TransferCollateral: {assetDetails?.normalizedAmount} {assetDetails?.symbol}
      </div>
    );
  }
  if (notification.event === EventsEnum.WithdrawReserves) {
    const payload: WithdrawReserves = notification.payload as WithdrawReserves;
    return (
      <div>
        WithdrawReserves: {assetDetails?.normalizedAmount} {assetDetails?.symbol} to {payload.to}
      </div>
    );
  }

  if (notification.event === EventsEnum.Withdraw) {
    return <div>Withdraw: {assetDetails?.normalizedAmount} USDC</div>;
  }
  if (notification.event === EventsEnum.Supply) {
    return <div>Supply: {assetDetails?.normalizedAmount} USDC</div>;
  }

  if (notification.event === EventsEnum.PauseAction) {
    return <PauseActionNotification notification={notification} />;
  }

  if (notification.event === EventsEnum.AbsorbCollateral) {
    return <AbsorbCollateralNotification notification={notification} />;
  }

  if (notification.event === EventsEnum.AbsorbDebt) {
    return <AbsorbDebtNotification notification={notification} />;
  }

  return <div>{JSON.stringify(notification)}</div>;
}
