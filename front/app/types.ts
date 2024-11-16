export interface LendPosition {
  lender: string;
  tokenId: string;
  price: bigint;
  time: number;
  isAvailable: boolean;
  blockscoutUrl: string;
}

export interface BorrowPosition {
  lender: string;
  borrower: string;
  tokenId: string;
  price: bigint;
  deadline: number;
  isActive: boolean;
  blockscoutUrl: string;
}


