// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MarketplaceToken
 * @dev Governance and utility token for BaseMarket
 */
contract MarketplaceToken is ERC20, Ownable {
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    constructor() ERC20("BaseMarket Token", "BMARKET") Ownable(msg.sender) {
        _mint(msg.sender, 10_000_000 * 10**18); // Initial supply
    }
    
    function addMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Invalid address");
        minters[_minter] = true;
        emit MinterAdded(_minter);
    }
    
    function removeMinter(address _minter) external onlyOwner {
        minters[_minter] = false;
        emit MinterRemoved(_minter);
    }
    
    function mint(address _to, uint256 _amount) external {
        require(minters[msg.sender], "Not a minter");
        require(totalSupply() + _amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(_to, _amount);
    }
    
    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }
}
