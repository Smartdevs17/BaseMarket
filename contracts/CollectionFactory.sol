// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CollectionFactory
 * @dev Factory for creating NFT collections
 */
contract CollectionFactory is Ownable, ReentrancyGuard {
    
    struct Collection {
        address collectionAddress;
        address creator;
        string name;
        string symbol;
        uint256 createdAt;
        bool isVerified;
    }
    
    mapping(uint256 => Collection) public collections;
    mapping(address => uint256[]) public creatorCollections;
    
    uint256 private _collectionIdCounter;
    uint256 public creationFee = 0.01 ether;
    
    event CollectionCreated(uint256 indexed collectionId, address indexed collectionAddress, address indexed creator);
    event CollectionVerified(uint256 indexed collectionId);
    
    constructor() Ownable(msg.sender) {
        _collectionIdCounter = 1;
    }
    
    function createCollection(
        string memory _name,
        string memory _symbol
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= creationFee, "Insufficient fee");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_symbol).length > 0, "Symbol required");
        
        uint256 collectionId = _collectionIdCounter++;
        
        // In production, deploy actual NFT contract here
        address collectionAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            msg.sender,
            _name,
            block.timestamp
        )))));
        
        collections[collectionId] = Collection({
            collectionAddress: collectionAddress,
            creator: msg.sender,
            name: _name,
            symbol: _symbol,
            createdAt: block.timestamp,
            isVerified: false
        });
        
        creatorCollections[msg.sender].push(collectionId);
        
        emit CollectionCreated(collectionId, collectionAddress, msg.sender);
        
        if (msg.value > creationFee) {
            payable(msg.sender).transfer(msg.value - creationFee);
        }
        
        return collectionId;
    }
    
    function verifyCollection(uint256 _collectionId) external onlyOwner {
        require(_collectionId > 0 && _collectionId < _collectionIdCounter, "Invalid ID");
        collections[_collectionId].isVerified = true;
        emit CollectionVerified(_collectionId);
    }
    
    function updateCreationFee(uint256 _newFee) external onlyOwner {
        creationFee = _newFee;
    }
    
    function getCreatorCollections(address _creator) external view returns (uint256[] memory) {
        return creatorCollections[_creator];
    }
    
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
