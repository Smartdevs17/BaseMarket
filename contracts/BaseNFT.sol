// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseNFT
 * @dev Standard ERC721 NFT for BaseMarket
 */
contract BaseNFT is ERC721, ERC721URIStorage, Ownable {
    
    /// @dev Internal tracker for assigning unique token IDs
    uint256 private _tokenIdCounter;
    
    /// @notice Maps token ID to the original creator address
    mapping(uint256 => address) public creators;
    
    /// @notice Maps token ID to secondary sale royalty percentage (in basis points)
    mapping(uint256 => uint256) public royalties; // in basis points
    
    /**
     * @notice Emitted when a new NFT is minted
     * @param tokenId The unique ID of the new NFT
     * @param creator The address that minted the NFT (owner of creators mapping entry)
     * @param uri The IPFS or web link to metadata
     */
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string uri);
    
    constructor(string memory _name, string memory _symbol) 
        ERC721(_name, _symbol) 
        Ownable(msg.sender) 
    {
        _tokenIdCounter = 1;
    }
    
    /**
     * @notice Creates a new NFT with metadata and royalty configuration
     * @param _to Initial owner of the NFT
     * @param _uri Metadata URI
     * @param _royalty Percentage for secondary sales in basis points (max 1000 = 10%)
     * @return The unique token ID assigned
     */
    function mint(address _to, string memory _uri, uint256 _royalty) external returns (uint256) {
        require(_royalty <= 1000, "Royalty too high"); // Max 10%
        
        uint256 tokenId = _tokenIdCounter++;
        
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
        
        creators[tokenId] = _to;
        royalties[tokenId] = _royalty;
        
        emit NFTMinted(tokenId, _to, _uri);
        
        return tokenId;
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @notice Calculates royalty payout for a sale
     * @param _tokenId The ID of the sold asset
     * @param _salePrice The total closing price of the sale
     * @return The recipient address and the calculated WEI value
     */
    function getRoyaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address, uint256) {
        uint256 royaltyAmount = (_salePrice * royalties[_tokenId]) / 10000;
        return (creators[_tokenId], royaltyAmount);
    }
}
