// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AuctionHouse
 * @dev English and Dutch auction system for NFTs
 */
contract AuctionHouse is Ownable, ReentrancyGuard {
    
    /// @notice Types of auctions supported: English (ascending price) or Dutch (descending price)
    enum AuctionType { English, Dutch }
    
    /**
     * @notice Container for all auction-related data
     * @param tokenId The ID of the NFT being auctioned
     * @param nftContract Address of the NFT collection
     * @param seller Address of the account selling the NFT
     * @param auctionType The strategy (English or Dutch)
     * @param startPrice Initial asking price
     * @param reservePrice Minimum price seller is willing to accept
     * @param currentBid Highest bid in English, or current price in Dutch
     * @param currentBidder Lead bidder address
     * @param startTime When the auction begins
     * @param endTime When the auction expires
     * @param isActive True if bids are still accepted
     * @param isFinalized True if funds/NFT have been distributed
     */
    struct Auction {
        uint256 tokenId;
        address nftContract;
        address seller;
        AuctionType auctionType;
        uint256 startPrice;
        uint256 reservePrice;
        uint256 currentBid;
        address currentBidder;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool isFinalized;
    }
    
    /// @notice Maps specific auction ID to its configuration/status
    mapping(uint256 => Auction) public auctions;
    
    /// @notice Tracks individual bid amounts for users per auction (for refund/tracking)
    mapping(uint256 => mapping(address => uint256)) public bids;
    
    /// @dev Internal counter for assigning unique auction IDs
    uint256 private _auctionIdCounter;
    
    /// @notice Platform fee in basis points (e.g., 250 = 2.5%)
    uint256 public platformFee = 250; // 2.5%
    
    event AuctionCreated(uint256 indexed auctionId, address indexed seller, uint256 startPrice);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionFinalized(uint256 indexed auctionId, address winner, uint256 finalPrice);
    event AuctionCancelled(uint256 indexed auctionId);
    
    constructor() Ownable(msg.sender) {
        _auctionIdCounter = 1;
    }
    
    function createAuction(
        address _nftContract,
        uint256 _tokenId,
        AuctionType _auctionType,
        uint256 _startPrice,
        uint256 _reservePrice,
        uint256 _duration
    ) external nonReentrant returns (uint256) {
        require(_startPrice > 0, "Invalid start price");
        require(_duration > 0, "Invalid duration");
        
        if (_auctionType == AuctionType.English) {
            require(_reservePrice >= _startPrice, "Reserve must be >= start");
        }
        
        uint256 auctionId = _auctionIdCounter++;
        
        auctions[auctionId] = Auction({
            tokenId: _tokenId,
            nftContract: _nftContract,
            seller: msg.sender,
            auctionType: _auctionType,
            startPrice: _startPrice,
            reservePrice: _reservePrice,
            currentBid: _startPrice,
            currentBidder: address(0),
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            isActive: true,
            isFinalized: false
        });
        
        emit AuctionCreated(auctionId, msg.sender, _startPrice);
        
        return auctionId;
    }
    
    function placeBid(uint256 _auctionId) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(auction.isActive, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.sender != auction.seller, "Seller cannot bid");
        
        if (auction.auctionType == AuctionType.English) {
            require(msg.value > auction.currentBid, "Bid too low");
            
            // Refund previous bidder
            if (auction.currentBidder != address(0)) {
                payable(auction.currentBidder).transfer(auction.currentBid);
            }
            
            auction.currentBid = msg.value;
            auction.currentBidder = msg.sender;
        } else {
            // Dutch auction - first bid wins
            require(msg.value >= getCurrentPrice(_auctionId), "Bid too low");
            auction.currentBid = msg.value;
            auction.currentBidder = msg.sender;
            auction.isActive = false;
        }
        
        bids[_auctionId][msg.sender] = msg.value;
        
        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }
    
    function finalizeAuction(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(auction.isActive, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction not ended");
        require(!auction.isFinalized, "Already finalized");
        
        auction.isActive = false;
        auction.isFinalized = true;
        
        if (auction.currentBidder != address(0) && auction.currentBid >= auction.reservePrice) {
            uint256 fee = (auction.currentBid * platformFee) / 10000;
            uint256 sellerProceeds = auction.currentBid - fee;
            
            payable(auction.seller).transfer(sellerProceeds);
            
            emit AuctionFinalized(_auctionId, auction.currentBidder, auction.currentBid);
        } else {
            // Reserve not met, refund bidder
            if (auction.currentBidder != address(0)) {
                payable(auction.currentBidder).transfer(auction.currentBid);
            }
            emit AuctionCancelled(_auctionId);
        }
    }
    
    function getCurrentPrice(uint256 _auctionId) public view returns (uint256) {
        Auction memory auction = auctions[_auctionId];
        
        if (auction.auctionType == AuctionType.English) {
            return auction.currentBid;
        } else {
            // Dutch auction - price decreases over time
            uint256 elapsed = block.timestamp - auction.startTime;
            uint256 duration = auction.endTime - auction.startTime;
            
            if (elapsed >= duration) {
                return auction.reservePrice;
            }
            
            uint256 priceRange = auction.startPrice - auction.reservePrice;
            uint256 decrease = (priceRange * elapsed) / duration;
            
            return auction.startPrice - decrease;
        }
    }
    
    function cancelAuction(uint256 _auctionId) external {
        Auction storage auction = auctions[_auctionId];
        require(auction.seller == msg.sender, "Not seller");
        require(auction.isActive, "Auction not active");
        require(auction.currentBidder == address(0), "Bids placed");
        
        auction.isActive = false;
        
        emit AuctionCancelled(_auctionId);
    }
}
