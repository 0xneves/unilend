// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import { Test, console2 } from "forge-std/src/Test.sol";

contract Unilend is Test {
  address impersonated = 0xa3b3b9eA33602914fbd5984Ec0937F4f41f7A3c2;

  function setUp() public {
    vm.label(impersonated, "Deployer");
    vm.startPrank(impersonated);
  }

  function test_lend() public {}

  function test_borrow() public {}
}
