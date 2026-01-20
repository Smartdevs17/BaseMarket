// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceRoles is Ownable {
    mapping(address => bool) public isOperator;
    mapping(address => bool) public isCurator;
    
    constructor() Ownable(msg.sender) {}
    
    function setOperator(address _operator, bool _status) external onlyOwner {
        isOperator[_operator] = _status;
    }
    
    function setCurator(address _curator, bool _status) external onlyOwner {
        isCurator[_curator] = _status;
    }
}
