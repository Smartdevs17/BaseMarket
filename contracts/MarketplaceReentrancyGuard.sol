// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MarketplaceReentrancyGuard is ReentrancyGuard {
    // Custom guard logic if needed, otherwise wrapper
    modifier nonReentrantView() {
        require(_reentrancyGuardEntered() == false, "ReentrancyGuard: reentrant call");
        _;
    }
}
