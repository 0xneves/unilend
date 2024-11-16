// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { IERC721 } from "./IERC721.sol";

interface INonfungiblePositionManager is IERC721 {
  struct CollectParams {
    uint256 tokenId;
    address recipient;
    uint128 amount0Max;
    uint128 amount1Max;
  }

  /// @notice Collects up to a maximum amount of fees owed to a specific position to the recipient
  /// @param params tokenId The ID of the NFT for which tokens are being collected,
  /// recipient The account that should receive the tokens,
  /// amount0Max The maximum amount of token0 to collect,
  /// amount1Max The maximum amount of token1 to collect
  /// @return amount0 The amount of fees collected in token0
  /// @return amount1 The amount of fees collected in token1
  function collect(
    CollectParams calldata params
  ) external payable returns (uint256 amount0, uint256 amount1);
}
