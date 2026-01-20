// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library MarketplaceEvents {
    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed listingId);
    event ListingSold(uint256 indexed listingId, address indexed buyer, uint256 price);
    event OfferCreated(uint256 indexed offerId, uint256 indexed listingId, address indexed bidder, uint256 amount);
    event OfferAccepted(uint256 indexed offerId, uint256 indexed listingId);
    event OfferCancelled(uint256 indexed offerId);
}
