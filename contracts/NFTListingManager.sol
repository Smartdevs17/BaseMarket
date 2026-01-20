// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library NFTListingManager {
    struct Listing {
        uint256 price;
        uint256 startTime;
        uint256 endTime;
    }
    
    function isListingActive(Listing memory listing) internal view returns (bool) {
        return listing.startTime <= block.timestamp && listing.endTime > block.timestamp;
    }
}
