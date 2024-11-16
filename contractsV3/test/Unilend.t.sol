// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import { Test, console2 } from "forge-std/src/Test.sol";
import { Unilend } from "../src/Unilend.sol";

interface ERC721 {
  function approve(address to, uint256 tokenId) external;

  function ownerOf(uint256 tokenId) external view returns (address);
}

contract TestUnilend is Test {
  Unilend unilend;

  address lender = 0x23e6ea6E11808F04164DEBD0a4e356D90B4356e2;
  address borrower = 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045;
  address nonfungiblePositionManager = 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;

  uint256 tokenId = 811396;

  function setUp() public {
    vm.label(lender, "Lender");
    vm.label(borrower, "Borrower");

    unilend = new Unilend(nonfungiblePositionManager);
  }

  function test_lend() public {
    vm.startPrank(lender);
    ERC721(nonfungiblePositionManager).approve(address(unilend), tokenId);
    unilend.lend(tokenId, 100, 1000); // 100 wei and 1000 seconds
    console2.log("Lend created");

    Unilend.Lend memory lend = unilend.lends(tokenId);
    assert(lend.lender == lender);
    assert(lend.tokenId == tokenId);
    assert(lend.price == 100);
    assert(lend.time == 1000);
  }

  function test_borrow() public {
    vm.startPrank(lender);
    ERC721(nonfungiblePositionManager).approve(address(unilend), tokenId);
    unilend.lend(tokenId, 100, 1000); // 100 wei and 1000 seconds

    Unilend.Lend memory lend = unilend.lends(tokenId);

    vm.startPrank(borrower);
    unilend.borrow{ value: lend.price }(tokenId);

    Unilend.Borrow memory borrow = unilend.borrows(tokenId);
    assert(borrow.lender == lend.lender);
    assert(borrow.borrower == borrower);
    assert(borrow.tokenId == tokenId);
    assert(borrow.price == lend.price);
    assert(borrow.deadline >= block.timestamp + lend.time);
    assert(borrow.isActive == true);

    console2.log("Borrow created");
  }

  function test_collect() public {
    vm.startPrank(lender);
    ERC721(nonfungiblePositionManager).approve(address(unilend), tokenId);
    unilend.lend(tokenId, 100, 1000); // 100 wei and 1000 seconds

    Unilend.Lend memory lend = unilend.lends(tokenId);

    vm.startPrank(borrower);
    unilend.borrow{ value: lend.price }(tokenId);

    vm.startPrank(borrower);
    unilend.collect(tokenId);

    console2.log("Collected");
  }

  function test_claim_position() public {
    vm.startPrank(lender);
    ERC721(nonfungiblePositionManager).approve(address(unilend), tokenId);
    unilend.lend(tokenId, 100, 1000); // 100 wei and 1000 seconds

    Unilend.Lend memory lend = unilend.lends(tokenId);

    vm.startPrank(borrower);
    unilend.borrow{ value: lend.price }(tokenId);

    Unilend.Borrow memory borrow = unilend.borrows(tokenId);

    uint256 currentTime = block.timestamp; // Get the current block timestamp
    uint256 secondsToAdvance = 3600; // 1 hour
    vm.warp(currentTime + secondsToAdvance); // Set the new block timestamp

    vm.startPrank(lender);
    unilend.claimPosition(tokenId);

    borrow = unilend.borrows(tokenId);
    assert(borrow.isActive == false);

    assert(address(lender) == ERC721(nonfungiblePositionManager).ownerOf(tokenId));
  }
}
