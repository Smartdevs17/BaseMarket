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
    
    uint256 private _tokenIdCounter;
    
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public royalties; // in basis points
    
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string uri);
    
    constructor(string memory _name, string memory _symbol) 
        ERC721(_name, _symbol) 
        Ownable(msg.sender) 
    {
        _tokenIdCounter = 1;
    }
    
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
    
    function getRoyaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address, uint256) {
        uint256 royaltyAmount = (_salePrice * royalties[_tokenId]) / 10000;
        return (creators[_tokenId], royaltyAmount);
    }
}
