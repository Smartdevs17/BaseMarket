// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library MarketplaceMath {
    function calculateFee(uint256 amount, uint256 feeBps) internal pure returns (uint256) {
        return (amount * feeBps) / 10000;
    }
}
