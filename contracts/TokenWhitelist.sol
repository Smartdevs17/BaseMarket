// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenWhitelist
 * @dev Manages the list of ERC20 tokens allowed for trading or interactions
 */
contract TokenWhitelist is Ownable {
    /// @notice Maps token address to its whitelist status
    mapping(address => bool) public allowedTokens;
    
    /// @notice Emitted when a token's whitelist status changes
    event TokenWhitelisted(address indexed token, bool status);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @notice Updates the whitelist status of a token
     * @param token Address of the ERC20 token
     * @param status True to permit, false to ban
     */
    function setTokenStatus(address token, bool status) external onlyOwner {
        allowedTokens[token] = status;
        emit TokenWhitelisted(token, status);
    }
    
    /**
     * @notice Checks if a token is authorized
     * @param token Address of the token to check
     * @return True if allowed
     */
    function isWhitelisted(address token) external view returns (bool) {
        return allowedTokens[token];
    }
}
