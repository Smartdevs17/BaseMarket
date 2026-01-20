// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenWhitelist is Ownable {
    mapping(address => bool) public allowedTokens;
    
    event TokenWhitelisted(address indexed token, bool status);
    
    constructor() Ownable(msg.sender) {}
    
    function setTokenStatus(address token, bool status) external onlyOwner {
        allowedTokens[token] = status;
        emit TokenWhitelisted(token, status);
    }
    
    function isWhitelisted(address token) external view returns (bool) {
        return allowedTokens[token];
    }
}
