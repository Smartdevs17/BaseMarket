// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OfferManager is Ownable {
    event OfferMade(address indexed maker, uint256 amount);
    event OfferCancelled(address indexed maker);

    constructor() Ownable(msg.sender) {}

    function makeOffer(address collection, uint256 tokenId) external payable {
        require(msg.value > 0, "Offer must be > 0");
        emit OfferMade(msg.sender, msg.value);
    }

    function cancelOffer(address collection, uint256 tokenId) external {
        emit OfferCancelled(msg.sender);
    }
}
