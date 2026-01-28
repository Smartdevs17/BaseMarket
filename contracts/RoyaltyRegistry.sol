// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RoyaltyRegistry
 * @dev Global registry for NFT royalties in BaseMarket
 */
contract RoyaltyRegistry is Ownable {
    
    /**
     * @notice Configuration for royalty payments
     * @param recipient The address that receives the royalty
     * @param amount The fee in basis points (e.g., 500 = 5%)
     */
    struct RoyaltyInfo {
        address recipient;
        uint256 amount; // Basis points (e.g., 500 = 5%)
    }
    
    /// @notice Maps collection to specific token IDs for per-NFT royalties
    mapping(address => mapping(uint256 => RoyaltyInfo)) public tokenRoyalties;
    
    /// @notice Maps collection to a default royalty configuration for all its NFTs
    mapping(address => RoyaltyInfo) public collectionRoyalties;
    
    /// @notice The maximum allowed royalty (10% in basis points)
    uint256 public constant MAX_ROYALTY = 1000;
    
    /**
     * @notice Emitted when a specific NFT royalty is set
     * @param collection The address of the NFT contract
     * @param tokenId The ID of the specific token
     * @param recipient The address receiving royalties
     * @param amount The fee in basis points
     */
    event RoyaltySet(address indexed collection, uint256 indexed tokenId, address recipient, uint256 amount);
    
    /**
     * @notice Emitted when a collection-wide default royalty is set
     * @param collection The address of the NFT contract
     * @param recipient The address receiving royalties
     * @param amount The fee in basis points
     */
    event DefaultRoyaltySet(address indexed collection, address recipient, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @notice Registers royalty details for a specific NFT
     * @dev Should be restricted to creator/owner in production
     * @param _collection The address of the NFT contract
     * @param _tokenId The specific token ID
     * @param _recipient The address to receive funds
     * @param _amount Fee in basis points (max 1000)
     */
    function setRoyalty(
        address _collection,
        uint256 _tokenId,
        address _recipient,
        uint256 _amount
    ) external {
        // In a real system, this would verify msg.sender is the creator/owner via ERC2981 or ownable
        require(_amount <= MAX_ROYALTY, "Royalty too high");
        require(_recipient != address(0), "Invalid recipient");
        
        tokenRoyalties[_collection][_tokenId] = RoyaltyInfo(_recipient, _amount);
        
        emit RoyaltySet(_collection, _tokenId, _recipient, _amount);
    }
    
    /**
     * @notice Sets a fallback royalty for all tokens in a collection
     * @param _collection The address of the NFT contract
     * @param _recipient The default address to receive funds
     * @param _amount Default fee in basis points
     */
    function setDefaultRoyalty(
        address _collection,
        address _recipient,
        uint256 _amount
    ) external {
        // In a real system, verify owner
        require(_amount <= MAX_ROYALTY, "Royalty too high");
        require(_recipient != address(0), "Invalid recipient");
        
        collectionRoyalties[_collection] = RoyaltyInfo(_recipient, _amount);
        
        emit DefaultRoyaltySet(_collection, _recipient, _amount);
    }
    
    /**
     * @notice Returns the royalty payout details for a specific sale
     * @dev Prioritizes token-specific royalty, falls back to collection default
     * @param _collection The address of the NFT contract
     * @param _tokenId The ID of the token being sold
     * @param _salePrice The total closing price of the sale
     * @return recipient The address that should receive the royalty
     * @return royaltyAmount The calculated WEI amount of the royalty
     */
    function getRoyalty(address _collection, uint256 _tokenId, uint256 _salePrice) 
        external 
        view 
        returns (address recipient, uint256 royaltyAmount) 
    {
        RoyaltyInfo memory info = tokenRoyalties[_collection][_tokenId];
        
        if (info.recipient == address(0)) {
            info = collectionRoyalties[_collection];
        }
        
        if (info.recipient != address(0)) {
            recipient = info.recipient;
            royaltyAmount = (_salePrice * info.amount) / 10000;
        }
    }
}
