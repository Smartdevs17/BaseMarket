# BaseMarket - NFT Marketplace on Base

NFT marketplace with auctions, offers, and royalties built for Base network.

## Contracts

- **NFTMarketplace.sol** - Core marketplace (listings, offers, sales)
- **BaseNFT.sol** - ERC721 with royalty support
- **AuctionHouse.sol** - English & Dutch auctions

## Quick Start

```bash
npm install
npx hardhat compile
npx hardhat test
```

## Deploy

```bash
# Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia

# Base Mainnet
npx hardhat run scripts/deploy.js --network base
```

## Features

- ✅ Buy/Sell NFTs
- ✅ Make/Accept Offers
- ✅ English Auctions
- ✅ Dutch Auctions
- ✅ Creator Royalties
- ✅ Platform Fees (2.5%)

## License

MIT
