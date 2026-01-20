// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceUpgradeability is Ownable {
    address public implementation;
    
    event Upgraded(address indexed implementation);
    
    constructor(address _implementation) Ownable(msg.sender) {
        implementation = _implementation;
    }
    
    function upgradeTo(address _implementation) external onlyOwner {
        implementation = _implementation;
        emit Upgraded(_implementation);
    }
}
