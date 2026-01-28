// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @dev Core marketplace for buying and selling NFTs
 */
contract NFTMarketplace is ReentrancyGuard, Ownable {
    
    /**
     * @notice Data structure representing an NFT listing
     * @param tokenId The unique ID of the NFT
     * @param nftContract Address of the ERC721 contract
     * @param seller Address of the account selling the NFT
     * @param price Listing price in WEI
     * @param isActive Whether the listing is currently active
     * @param listedAt Timestamp when the item was listed
     */
    struct Listing {
        uint256 tokenId;
        address nftContract;
        address seller;
        uint256 price;
        bool isActive;
        uint256 listedAt;
    }
    
    /**
     * @notice Data structure representing a purchase offer
     * @param buyer Address of the account making the offer
     * @param price Offer price in WEI (escrowed in the contract)
     * @param expiresAt Timestamp when the offer expired
     * @param isActive Whether the offer is still valid/active
     */
    struct Offer {
        address buyer;
        uint256 price;
        uint256 expiresAt;
        bool isActive;
    }
    
    /// @notice Maps a unique listing hash to listing data
    mapping(bytes32 => Listing) public listings;
    
    /// @notice Maps a listing ID to an array of offers
    mapping(bytes32 => Offer[]) public offers;
    
    /// @notice Platform fee in basis points (e.g. 250 = 2.5%)
    uint256 public platformFee = 250;
    
    /// @notice Cumulative volume of all sales in WEI
    uint256 public totalVolume;
    
    /// @notice Total count of items sold
    uint256 public totalSales;
    
    /// @notice Emitted when an NFT is listed for sale
    /// @param listingId Unique ID of the listing
    /// @param nftContract Address of the ERC721 contract
    /// @param tokenId The unique ID of the NFT
    /// @param seller Account listing the item
    /// @param price Listing price in WEI
    event ItemListed(bytes32 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 price);
    
    /// @notice Emitted when a listing is purchased
    /// @param listingId Unique ID of the listing
    /// @param buyer Account purchasing the item
    /// @param price Purchase price in WEI
    event ItemSold(bytes32 indexed listingId, address buyer, uint256 price);
    
    /// @notice Emitted when a seller cancels their listing
    /// @param listingId Unique ID of the listing
    event ListingCancelled(bytes32 indexed listingId);
    
    /// @notice Emitted when a buyer makes an offer on a listing
    /// @param listingId Unique ID of the listing
    /// @param buyer Account making the offer
    /// @param price Offer price in WEI
    event OfferMade(bytes32 indexed listingId, address indexed buyer, uint256 price);
    
    /// @notice Emitted when a seller accepts an offer
    /// @param listingId Unique ID of the listing
    /// @param offerIndex Index of the offer in the offers array
    event OfferAccepted(bytes32 indexed listingId, uint256 offerIndex);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @notice Lists an NFT for sale in the marketplace
     * @dev Token must be owned by the sender and approved for this contract
     * @param _nftContract Address of the ERC721 contract
     * @param _tokenId The unique ID of the NFT
     * @param _price Desired selling price in WEI
     * @return listingId The unique generated hash for the listing
     */
    function listItem(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant returns (bytes32) {
        require(_price > 0, "Price must be > 0");
        
        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "Not token owner");
        require(nft.getApproved(_tokenId) == address(this) || 
                nft.isApprovedForAll(msg.sender, address(this)), "Not approved");
        
        bytes32 listingId = keccak256(abi.encodePacked(_nftContract, _tokenId, msg.sender, block.timestamp));
        
        listings[listingId] = Listing({
            tokenId: _tokenId,
            nftContract: _nftContract,
            seller: msg.sender,
            price: _price,
            isActive: true,
            listedAt: block.timestamp
        });
        
        emit ItemListed(listingId, _nftContract, _tokenId, msg.sender, _price);
        
        return listingId;
    }
    
    /**
     * @notice Purchases a listed NFT
     * @dev Transfers tokens to seller and fees to contract balance
     * @param _listingId The unique ID of the listing to purchase
     */
    function buyItem(bytes32 _listingId) external payable nonReentrant {
        Listing storage listing = listings[_listingId];
        require(listing.isActive, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        
        listing.isActive = false;
        
        uint256 fee = (listing.price * platformFee) / 10000;
        uint256 sellerProceeds = listing.price - fee;
        
        IERC721(listing.nftContract).safeTransferFrom(listing.seller, msg.sender, listing.tokenId);
        
        payable(listing.seller).transfer(sellerProceeds);
        
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        totalVolume += listing.price;
        totalSales++;
        
        emit ItemSold(_listingId, msg.sender, listing.price);
    }
    
    /**
     * @notice Cancels an active listing
     * @dev Only the seller can cancel their listing
     * @param _listingId The unique ID of the listing to cancel
     */
    function cancelListing(bytes32 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.isActive, "Listing not active");
        
        listing.isActive = false;
        
        emit ListingCancelled(_listingId);
    }
    
    function makeOffer(bytes32 _listingId, uint256 _expiresAt) external payable {
        require(msg.value > 0, "Offer must be > 0");
        require(_expiresAt > block.timestamp, "Invalid expiry");
        
        Listing memory listing = listings[_listingId];
        require(listing.isActive, "Listing not active");
        
        offers[_listingId].push(Offer({
            buyer: msg.sender,
            price: msg.value,
            expiresAt: _expiresAt,
            isActive: true
        }));
        
        emit OfferMade(_listingId, msg.sender, msg.value);
    }
    
    function acceptOffer(bytes32 _listingId, uint256 _offerIndex) external nonReentrant {
        Listing storage listing = listings[_listingId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.isActive, "Listing not active");
        
        Offer storage offer = offers[_listingId][_offerIndex];
        require(offer.isActive, "Offer not active");
        require(offer.expiresAt > block.timestamp, "Offer expired");
        
        listing.isActive = false;
        offer.isActive = false;
        
        uint256 fee = (offer.price * platformFee) / 10000;
        uint256 sellerProceeds = offer.price - fee;
        
        IERC721(listing.nftContract).safeTransferFrom(msg.sender, offer.buyer, listing.tokenId);
        payable(msg.sender).transfer(sellerProceeds);
        
        totalVolume += offer.price;
        totalSales++;
        
        emit OfferAccepted(_listingId, _offerIndex);
    }
    
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _newFee;
    }
    
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function getListing(bytes32 _listingId) external view returns (Listing memory) {
        return listings[_listingId];
    }
    
    function getOffers(bytes32 _listingId) external view returns (Offer[] memory) {
        return offers[_listingId];
    }
}
