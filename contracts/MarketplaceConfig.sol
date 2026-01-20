// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceConfig is Ownable {
    uint256 public platformFee = 250; // 2.5%
    address public feeRecipient;
    
    event configUpdated(uint256 newFee, address newRecipient);
    
    constructor() Ownable(msg.sender) {
        feeRecipient = msg.sender;
    }
    
    function updateConfig(uint256 _fee, address _recipient) external onlyOwner {
        require(_fee <= 1000, "Fee too high");
        platformFee = _fee;
        feeRecipient = _recipient;
        emit configUpdated(_fee, _recipient);
    }
}
