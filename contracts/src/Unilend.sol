// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./interfaces/IERC721Receiver.sol";
import "./interfaces/INonfungiblePositionManager.sol";
import "./IUnilend.sol";

/**
 * @title Unilend - Uniswap V3 borrow and lending platform
 */
contract Unilend is IERC721Receiver, IUnilend {
  // The NFT contract that mints Uniswap positions
  INonfungiblePositionManager public immutable nonfungiblePositionManager;

  // Token ID to lends mapping
  mapping(uint256 => Lend) private _lends;
  // Token ID to borrows mapping
  mapping(uint256 => Borrow) private _borrows;

  /// @param _nonfungiblePositionManager The address of the Uniswap V3 NFT contract
  constructor(address _nonfungiblePositionManager) {
    nonfungiblePositionManager = INonfungiblePositionManager(_nonfungiblePositionManager);
  }

  /**
   * @param tokenId The token ID of the Uniswap V3 position
   * @return lend The lend object
   */
  function lends(uint256 tokenId) external view returns (Lend memory) {
    return _lends[tokenId];
  }

  /**
   * @param tokenId The token ID of the Uniswap V3 position
   * @return borrow The borrow object
   */
  function borrows(uint256 tokenId) external view returns (Borrow memory) {
    return _borrows[tokenId];
  }

  /**
   * @dev See {IUnilend-lend}
   */
  function lend(uint256 tokenId, uint256 price, uint256 duration) external {
    if (nonfungiblePositionManager.ownerOf(tokenId) != msg.sender) revert TokenNotOwned();

    _lends[tokenId] = Lend({
      lender: msg.sender,
      tokenId: tokenId,
      price: price,
      time: duration,
      isAvailable: true
    });

    nonfungiblePositionManager.safeTransferFrom(msg.sender, address(this), tokenId);

    emit LendCreated(msg.sender, tokenId, price, duration);
  }

  /**
   * @dev See {IUnilend-borrow}
   */
  function borrow(uint256 tokenId) external payable {
    Lend memory _lend = _lends[tokenId];

    if (!_lend.isAvailable) revert LendNotActive();
    if (_lend.lender == msg.sender) revert CannotBorrowFromSelf();
    if (_lend.price != msg.value) revert MissingFunds();

    _lends[tokenId].isAvailable = false;

    _borrows[tokenId] = Borrow({
      lender: _lend.lender,
      borrower: msg.sender,
      tokenId: _lend.tokenId,
      price: _lend.price,
      deadline: block.timestamp + _lend.time,
      isActive: true
    });

    _collect(tokenId, _lend.lender);

    (bool success, ) = _lend.lender.call{ value: msg.value }("");
    if (!success) revert LowLevelCallFailed();

    emit BorrowCreated(_lend.lender, msg.sender, _lend.tokenId, _lend.price, _lend.time);
  }

  /**
   * @dev See {IUnilend-cancelLend}
   */
  function cancelLend(uint256 tokenId) external {
    Lend memory _lend = _lends[tokenId];

    if (_borrows[tokenId].isActive) revert AlreadyBorrowed();
    if (_lend.lender != msg.sender) revert TokenNotOwned();

    delete _lends[tokenId];

    nonfungiblePositionManager.safeTransferFrom(address(this), msg.sender, _lend.tokenId);

    emit LendRevoked(_lend.lender, _lend.tokenId);
  }

  /**
   * @dev See {IUnilend-claimTokenBack}
   */
  function claimTokenBack(uint256 tokenId) external {
    Borrow memory _borrow = _borrows[tokenId];

    if (!_borrow.isActive) revert BorrowNotActive();
    if (block.timestamp < _borrow.deadline) revert BorrowNotExpired();

    delete _borrows[tokenId];
    delete _lends[tokenId];

    _collect(tokenId, _borrow.borrower);
    nonfungiblePositionManager.safeTransferFrom(address(this), _borrow.lender, _borrow.tokenId);

    emit TokenClaimedBack(_borrow.lender, _borrow.borrower, _borrow.tokenId);
  }

  /**
   * @dev See {IUnilend-collect}
   */
  function collect(uint256 tokenId) external {
    Borrow memory _borrow = _borrows[tokenId];
    if (!_borrow.isActive) revert BorrowNotActive();
    _collect(tokenId, _borrow.borrower);
  }

  /**
   * @dev Collect the fees from a borrowed Uniswap V3 position
   */
  function _collect(uint256 tokenId, address recipient) internal {
    (uint256 amount0, uint256 amount1) = nonfungiblePositionManager.collect(
      INonfungiblePositionManager.CollectParams({
        tokenId: tokenId,
        recipient: recipient,
        amount0Max: type(uint128).max,
        amount1Max: type(uint128).max
      })
    );

    emit BorrowCollected(recipient, tokenId, amount0, amount1);
  }

  /**
   * @dev Receive ERC721 token
   */
  function onERC721Received(
    address,
    address,
    uint256,
    bytes memory
  ) public pure override returns (bytes4) {
    return this.onERC721Received.selector;
  }
}
