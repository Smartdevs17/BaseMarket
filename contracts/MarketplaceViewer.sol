// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./UserRegistry.sol";
import "./NFTMarketplace.sol";

contract MarketplaceViewer {
    UserRegistry public userRegistry;
    NFTMarketplace public marketplace;
    
    constructor(address _userRegistry, address _marketplace) {
        userRegistry = UserRegistry(_userRegistry);
        marketplace = NFTMarketplace(_marketplace);
    }
    
    struct UserProfileView {
        UserRegistry.UserProfile profile;
        // extended view logic
    }
    
    function getUserProfile(address _user) external view returns (UserRegistry.UserProfile memory) {
        return userRegistry.getUser(_user);
    }
}
