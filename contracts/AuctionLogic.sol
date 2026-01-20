// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library AuctionLogic {
    struct Auction {
        uint256 auctionId;
        uint256 startPrice;
        uint256 endPrice;
        uint256 startTime;
        uint256 endTime;
        address currentWinner;
        uint256 currentBid;
    }

    function calculateCurrentPrice(Auction memory auction) internal view returns (uint256) {
        if (block.timestamp >= auction.endTime) return auction.endPrice;
        if (block.timestamp <= auction.startTime) return auction.startPrice;
        
        uint256 duration = auction.endTime - auction.startTime;
        uint256 elapsed = block.timestamp - auction.startTime;
        uint256 priceDiff = auction.startPrice > auction.endPrice ? 
            auction.startPrice - auction.endPrice : 
            auction.endPrice - auction.startPrice;
            
        uint256 reduction = (priceDiff * elapsed) / duration;
        
        if (auction.startPrice > auction.endPrice) {
            return auction.startPrice - reduction;
        } else {
            return auction.startPrice + reduction;
        }
    }
}
