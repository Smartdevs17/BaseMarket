import hre from "hardhat";

/**
 * Smart deployment script with automatic network fallback for BaseMarket
 */

async function deployWithFallback() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("=".repeat(60));
  console.log("🚀 BaseMarket Smart Deployment");
  console.log("=".repeat(60));
  console.log(`📍 Network: ${network}`);
  console.log(`💼 Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
      console.log("⚠️  Warning: Zero balance detected!");
      if (network === "base") {
          throw new Error("Insufficient funds for Base Mainnet");
      }
  }

  const deployed = {};

  try {
    // 1. Deploy Marketplace
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
    const marketplace = await NFTMarketplace.deploy();
    await marketplace.waitForDeployment();
    deployed.NFTMarketplace = await marketplace.getAddress();
    console.log(`✅ NFTMarketplace: ${deployed.NFTMarketplace}`);

    // 2. Deploy AuctionLogic (Library)
    const AuctionLogic = await hre.ethers.getContractFactory("AuctionLogic");
    const auctionLogic = await AuctionLogic.deploy();
    await auctionLogic.waitForDeployment();
    deployed.AuctionLogic = await auctionLogic.getAddress();
    console.log(`✅ AuctionLogic Lib: ${deployed.AuctionLogic}`);

    // Save
    const fs = await import('fs');
    fs.writeFileSync(`deployment-${network}.json`, JSON.stringify(deployed, null, 2));
    console.log(`\n📄 Deployment info saved to deployment-${network}.json`);

  } catch (error) {
    console.error(`❌ Deployment failed: ${error.message}`);
    if (network === "base") {
        console.log("🔄 Try running with --network baseSepolia");
    }
    throw error;
  }
}

deployWithFallback().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
