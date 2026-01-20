// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library MarketplaceStorage {
    struct Listing {
        uint256 listingId;
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }
    
    struct Offer {
        uint256 offerId;
        address bidder;
        uint256 amount;
        uint256 expiry;
        bool isActive;
    }
}
