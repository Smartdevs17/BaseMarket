// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RoyaltyRegistry
 * @dev Global registry for NFT royalties in BaseMarket
 */
contract RoyaltyRegistry is Ownable {
    
    struct RoyaltyInfo {
        address recipient;
        uint256 amount; // Basis points (e.g., 500 = 5%)
    }
    
    // Collection Address -> Token ID -> RoyaltyInfo
    mapping(address => mapping(uint256 => RoyaltyInfo)) public tokenRoyalties;
    
    // Collection Address -> Default RoyaltyInfo
    mapping(address => RoyaltyInfo) public collectionRoyalties;
    
    // Max royalty cap (e.g., 10%)
    uint256 public constant MAX_ROYALTY = 1000;
    
    event RoyaltySet(address indexed collection, uint256 indexed tokenId, address recipient, uint256 amount);
    event DefaultRoyaltySet(address indexed collection, address recipient, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
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
