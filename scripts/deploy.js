import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying BaseMarket contracts to", hre.network.name);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("💼 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy BaseNFT
  console.log("\n📝 Deploying BaseNFT...");
  const BaseNFT = await hre.ethers.getContractFactory("BaseNFT");
  const baseNFT = await BaseNFT.deploy("BaseMarket NFT", "BNFT");
  await baseNFT.waitForDeployment();
  console.log("✅ BaseNFT deployed to:", await baseNFT.getAddress());
  
  // Deploy NFTMarketplace
  console.log("\n📝 Deploying NFTMarketplace...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy();
  await marketplace.waitForDeployment();
  console.log("✅ NFTMarketplace deployed to:", await marketplace.getAddress());
  
  // Deploy AuctionHouse
  console.log("\n📝 Deploying AuctionHouse...");
  const AuctionHouse = await hre.ethers.getContractFactory("AuctionHouse");
  const auctionHouse = await AuctionHouse.deploy();
  await auctionHouse.waitForDeployment();
  console.log("✅ AuctionHouse deployed to:", await auctionHouse.getAddress());
  
  // Deploy MarketplaceToken
  console.log("\n📝 Deploying MarketplaceToken...");
  const MarketplaceToken = await hre.ethers.getContractFactory("MarketplaceToken");
  const token = await MarketplaceToken.deploy();
  await token.waitForDeployment();
  console.log("✅ MarketplaceToken deployed to:", await token.getAddress());
  
  console.log("\n✨ All contracts deployed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log("BaseNFT:", await baseNFT.getAddress());
  console.log("NFTMarketplace:", await marketplace.getAddress());
  console.log("AuctionHouse:", await auctionHouse.getAddress());
  console.log("MarketplaceToken:", await token.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
