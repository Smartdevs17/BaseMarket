// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceFeeManager is Ownable {
    mapping(address => bool) public feeExempt;
    
    event ExemptionHubdated(address indexed user, bool exempt);
    
    constructor() Ownable(msg.sender) {}
    
    function setExemption(address _user, bool _exempt) external onlyOwner {
        feeExempt[_user] = _exempt;
        emit ExemptionHubdated(_user, _exempt);
    }
}
