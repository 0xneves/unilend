// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token0 is ERC20 {
    constructor() ERC20("Token0", "Token0") {
        _mint(msg.sender, 1_000_000 ether);
    }
}
