export interface Supply {
  from: string;
  dst: string;
  amount: number;
}

export interface Transfer {
  from: string;
  to: string;
  amount: number;
}

export interface Withdraw {
  src: string;
  to: string;
  amount: number;
}

export interface SupplyCollateral {
  from: string;
  dst: string;
  asset: string;
  amount: number;
}

export interface TransferCollateral {
  from: string;
  to: string;
  asset: string;
  amount: number;
}

export interface WithdrawCollateral {
  src: string;
  to: string;
  asset: string;
  amount: number;
}

export interface AbsorbDebt {
  absorber: string;
  borrower: string;
  basePaidOut: number;
  usdValue: number;
}

export interface AbsorbCollateral {
  absorber: string;
  borrower: string;
  asset: string;
  collateralAbsorbed: number;
  usdValue: number;
}

export interface BuyCollateral {
  buyer: string;
  asset: string;
  baseAmount: number;
  collateralAmount: number;
}

export interface PauseAction {
  supplyPaused: boolean;
  transferPaused: boolean;
  withdrawPaused: boolean;
  absorbPaused: boolean;
  buyPaused: boolean;
}

export interface WithdrawReserves {
  to: string;
  amount: number;
}
