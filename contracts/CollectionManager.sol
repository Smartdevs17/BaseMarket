// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library CollectionManager {
    function isCollectionVerified(address collection) internal pure returns (bool) {
        // Mock verification logic
        return collection != address(0);
    }
}
