// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./interfaces/IERC721Receiver.sol";
import "./interfaces/INonfungiblePositionManager.sol";
import "./IUnilend.sol";

contract Unilend is IERC721Receiver, IUnilend {
  INonfungiblePositionManager public immutable nonfungiblePositionManager;

  mapping(uint256 => Lend) private _lends;
  mapping(uint256 => Borrow) private _borrows;

  constructor(address _nonfungiblePositionManager) {
    nonfungiblePositionManager = INonfungiblePositionManager(_nonfungiblePositionManager);
  }

  function lends(uint256 tokenId) external view returns (Lend memory) {
    return _lends[tokenId];
  }

  function borrows(uint256 tokenId) external view returns (Borrow memory) {
    return _borrows[tokenId];
  }

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

  function cancelLend(uint256 tokenId) external {
    Lend memory _lend = _lends[tokenId];

    if (_borrows[tokenId].isActive) revert AlreadyBorrowed();
    if (_lend.lender != msg.sender) revert TokenNotOwned();

    nonfungiblePositionManager.safeTransferFrom(address(this), msg.sender, _lend.tokenId);

    delete _lends[tokenId];
  }

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

  function collect(uint256 tokenId) external {
    Borrow memory _borrow = _borrows[tokenId];
    if (!_borrow.isActive) revert BorrowNotActive();
    _collect(tokenId, _borrow.borrower);
  }

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

  function onERC721Received(
    address,
    address,
    uint256,
    bytes memory
  ) public pure override returns (bytes4) {
    return this.onERC721Received.selector;
  }
}
