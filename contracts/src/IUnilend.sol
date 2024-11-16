// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

interface IUnilend {
  struct Lend {
    address lender;
    uint256 tokenId;
    uint256 price;
    uint256 time;
    bool isAvailable;
  }

  struct Borrow {
    address lender;
    address borrower;
    uint256 tokenId;
    uint256 price;
    uint256 deadline;
    bool isActive;
  }

  error AlreadyBorrowed();
  error BorrowNotActive();
  error BorrowNotExpired();
  error CannotBorrowFromSelf();
  error MissingFunds();
  error LendNotActive();
  error LowLevelCallFailed();
  error TokenNotOwned();

  event LendCreated(address lender, uint256 tokenId, uint256 price, uint256 time);
  event BorrowCreated(
    address lender,
    address borrower,
    uint256 tokenId,
    uint256 price,
    uint256 deadline
  );
  event BorrowCollected(address borrower, uint256 tokenId, uint256 amount0, uint256 amount1);
  event TokenClaimedBack(address lender, address borrower, uint256 tokenId);
}
