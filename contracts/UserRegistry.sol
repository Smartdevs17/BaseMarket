// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UserRegistry
 * @dev Registry for BaseMarket users with profile data
 */
contract UserRegistry is Ownable {
    
    struct UserProfile {
        string username;
        string bio;
        string avatarUri;
        string socialLink;
        bool isVerified;
        uint256 joinedAt;
    }
    
    mapping(address => UserProfile) public users;
    mapping(string => address) public usernameToAddress;
    
    event ProfileUpdated(address indexed user, string username);
    event UserVerified(address indexed user);
    
    constructor() Ownable(msg.sender) {}
    
    function updateProfile(
        string memory _username,
        string memory _bio,
        string memory _avatarUri,
        string memory _socialLink
    ) external {
        require(bytes(_username).length > 0, "Username required");
        
        // Check username uniqueness if changed
        if (keccak256(bytes(users[msg.sender].username)) != keccak256(bytes(_username))) {
            require(usernameToAddress[_username] == address(0), "Username taken");
            // Clear old username
            if (bytes(users[msg.sender].username).length > 0) {
                delete usernameToAddress[users[msg.sender].username];
            }
            usernameToAddress[_username] = msg.sender;
        }
        
        UserProfile storage profile = users[msg.sender];
        profile.username = _username;
        profile.bio = _bio;
        profile.avatarUri = _avatarUri;
        profile.socialLink = _socialLink;
        if (profile.joinedAt == 0) {
            profile.joinedAt = block.timestamp;
        }
        
        emit ProfileUpdated(msg.sender, _username);
    }
    
    function verifyUser(address _user) external onlyOwner {
        users[_user].isVerified = true;
        emit UserVerified(_user);
    }
    
    function getUser(address _user) external view returns (UserProfile memory) {
        return users[_user];
    }
}
