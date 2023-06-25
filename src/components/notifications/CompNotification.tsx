import { CompoundNotification } from '@/types/CompoundNotification';
import { EventsEnum } from '@/types/events/EventsEnum';

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

// Define ERC20 token ABI
const erc20ABI = [
  // Some parts of the ABI are omitted for brevity
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    type: 'function',
  },
];

async function getAssetDetails(asset: string, amount: string, provider: ethers.AbstractProvider) {
  // Create a contract instance
  const contract = new ethers.Contract(asset, erc20ABI, provider);

  try {
    // Fetch symbol and decimals
    const [symbol, decimals] = await Promise.all([contract.symbol(), contract.decimals()]);

    // Normalize amount
    const normalizedAmount = ethers.formatUnits(amount, decimals);

    return { normalizedAmount, symbol };
  } catch (error) {
    console.error('Error fetching asset details:', error);
  }
}

export interface CompNotificationProps {
  notification: CompoundNotification;
}

export function CompNotification({ notification }: CompNotificationProps) {
  const [assetDetails, setAssetDetails] = useState<{ normalizedAmount: string; symbol: string }>();
  const provider = new ethers.BrowserProvider(window.ethereum as any);

  useEffect(() => {
    if (
      notification.event === EventsEnum.SupplyCollateral ||
      notification.event === EventsEnum.WithdrawCollateral ||
      notification.event === EventsEnum.TransferCollateral
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

  if (notification.event === EventsEnum.Withdraw) {
    return <div>Withdraw: {assetDetails?.normalizedAmount} USDC</div>;
  }
  if (notification.event === EventsEnum.Supply) {
    return <div>Supply: {assetDetails?.normalizedAmount} USDC</div>;
  }
  return <div>{JSON.stringify(notification)}</div>;
}
