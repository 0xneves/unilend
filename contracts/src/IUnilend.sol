// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

interface IUnilend {
  /// Structs
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

  /// Errors
  error AlreadyBorrowed();
  error BorrowNotActive();
  error BorrowNotExpired();
  error CannotBorrowFromSelf();
  error MissingFunds();
  error LendNotActive();
  error LowLevelCallFailed();
  error TokenNotOwned();

  /// Events
  event LendCreated(address indexed lender, uint256 indexed tokenId, uint256 price, uint256 time);
  event LendRevoked(address indexed lender, uint256 indexed tokenId);
  event BorrowCreated(
    address indexed lender,
    address indexed borrower,
    uint256 indexed tokenId,
    uint256 price,
    uint256 deadline
  );
  event BorrowCollected(
    address indexed borrower,
    uint256 indexed tokenId,
    uint256 amount0,
    uint256 amount1
  );
  event TokenClaimedBack(address indexed lender, address indexed borrower, uint256 indexed tokenId);

  /**
   * @dev Lend a Uniswap V3 position
   *
   * Requirements:
   *
   * - The caller must own the token ID
   *
   * Emits a {LendCreated} event
   *
   * @param tokenId The token ID of the Uniswap V3 position
   * @param price The price of the lend
   * @param duration The duration of the lend
   */
  function lend(uint256 tokenId, uint256 price, uint256 duration) external;

  /**
   * @dev Borrow a Uniswap V3 position
   *
   * Requirements:
   *
   * - The lend must be active
   * - The caller must not be the lender
   * - The price must match the lend price
   *
   * Emits a {BorrowCreated} event
   *
   * @param tokenId The token ID of the Uniswap V3 position
   */
  function borrow(uint256 tokenId) external payable;

  /**
   * @dev Cancel a lend
   *
   * Requirements:
   *
   * - The lend must be owned by the caller
   * - The lend must not be borrowed
   *
   * @param tokenId The token ID of the Uniswap V3 position
   */
  function cancelLend(uint256 tokenId) external;

  /**
   * @dev Claim back a borrowed Uniswap V3 position
   *
   * Requirements:
   *
   * - The borrow must be active
   * - The deadline must have passed
   *
   * Emits a {TokenClaimedBack} event
   *
   * @param tokenId The token ID of the Uniswap V3 position
   */
  function claimTokenBack(uint256 tokenId) external;

  /**
   * @dev Collect the fees from a borrowed Uniswap V3 position
   *
   * Requirements:
   *
   * - The borrow must be active
   *
   * Emits a {BorrowCollected} event
   *
   * @param tokenId The token ID of the Uniswap V3 position
   */
  function collect(uint256 tokenId) external;
}
