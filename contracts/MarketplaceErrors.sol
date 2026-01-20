// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library MarketplaceErrors {
    error PriceMustBeGreaterThanZero();
    error NotSeller();
    error NotBuyer();
    error ListingNotActive();
    error InsufficientPayment();
    error TransferFailed();
}
