// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CollectionFactory
 * @dev Factory for creating NFT collections
 */
contract CollectionFactory is Ownable, ReentrancyGuard {
    
    /**
     * @notice Data structure for metadata of a deployed collection
     * @param collectionAddress The address of the deployed NFT contract
     * @param creator The account that initiated the deployment
     * @param name Human-readable name of the NFT series
     * @param symbol Short symbol (e.g., BAYC)
     * @param createdAt UNIX timestamp of deployment
     * @param isVerified True if explicitly verified by the marketplace admin
     */
    struct Collection {
        address collectionAddress;
        address creator;
        string name;
        string symbol;
        uint256 createdAt;
        bool isVerified;
    }
    
    /// @notice Maps collection ID to its metadata
    mapping(uint256 => Collection) public collections;
    
    /// @notice Maps creator address to a list of their collection IDs
    mapping(address => uint256[]) public creatorCollections;
    
    /// @dev Internal tracker for unique collection IDs
    uint256 private _collectionIdCounter;
    
    /// @notice The ETH fee required to deploy a new collection
    uint256 public creationFee = 0.01 ether;
    
    /// @notice Emitted when a new collection is deployed
    event CollectionCreated(uint256 indexed collectionId, address indexed collectionAddress, address indexed creator);
    
    /// @notice Emitted when a collection is verified by the platform
    event CollectionVerified(uint256 indexed collectionId);
    
    constructor() Ownable(msg.sender) {
        _collectionIdCounter = 1;
    }
    
    /**
     * @notice Deploys a new collection metadata entry
     * @dev In production, this would use CREATE2 or a proxy to deploy an ERC721
     * @param _name Name of the collection
     * @param _symbol Symbol of the collection
     * @return The unique ID assigned to the tracking entry
     */
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
    
    /**
     * @notice Marks a collection as officially verified (Admin only)
     * @param _collectionId The unique ID of the collection entry
     */
    function verifyCollection(uint256 _collectionId) external onlyOwner {
        require(_collectionId > 0 && _collectionId < _collectionIdCounter, "Invalid ID");
        collections[_collectionId].isVerified = true;
        emit CollectionVerified(_collectionId);
    }
    
    /**
     * @notice Updates the cost for collection deployment (Admin only)
     * @param _newFee Value in WEI
     */
    function updateCreationFee(uint256 _newFee) external onlyOwner {
        creationFee = _newFee;
    }
    
    function getCreatorCollections(address _creator) external view returns (uint256[] memory) {
        return creatorCollections[_creator];
    }
    
    /**
     * @notice Collects all accumulated deployment fees (Admin only)
     */
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
