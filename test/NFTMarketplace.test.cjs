const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("NFTMarketplace", function () {
  async function deployFixture() {
    const [owner, seller, buyer, buyer2] = await ethers.getSigners();
    
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const marketplace = await NFTMarketplace.deploy();
    
    const BaseNFT = await ethers.getContractFactory("BaseNFT");
    const nft = await BaseNFT.deploy("Test NFT", "TNFT");
    
    // Mint NFT to seller
    await nft.mint(seller.address, "ipfs://test", 500); // 5% royalty
    
    // Approve marketplace
    await nft.connect(seller).approve(await marketplace.getAddress(), 1);
    
    return { marketplace, nft, owner, seller, buyer, buyer2 };
  }
  
  describe("Listing", function () {
    it("Should list item successfully", async function () {
      const { marketplace, nft, seller } = await loadFixture(deployFixture);
      
      const price = ethers.parseEther("1");
      
      await expect(marketplace.connect(seller).listItem(
        await nft.getAddress(),
        1,
        price
      )).to.emit(marketplace, "ItemListed");
    });
    
    it("Should fail with zero price", async function () {
      const { marketplace, nft, seller } = await loadFixture(deployFixture);
      
      await expect(
        marketplace.connect(seller).listItem(await nft.getAddress(), 1, 0)
      ).to.be.revertedWith("Price must be > 0");
    });
  });
  
  describe("Buying", function () {
    it("Should buy item successfully", async function () {
      const { marketplace, nft, seller, buyer } = await loadFixture(deployFixture);
      
      const price = ethers.parseEther("1");
      const tx = await marketplace.connect(seller).listItem(
        await nft.getAddress(),
        1,
        price
      );
      const receipt = await tx.wait();
      const listingId = receipt.logs[0].topics[1];
      
      await expect(
        marketplace.connect(buyer).buyItem(listingId, { value: price })
      ).to.emit(marketplace, "ItemSold");
      
      expect(await nft.ownerOf(1)).to.equal(buyer.address);
    });
    
    it("Should fail with insufficient payment", async function () {
      const { marketplace, nft, seller, buyer } = await loadFixture(deployFixture);
      
      const price = ethers.parseEther("1");
      const tx = await marketplace.connect(seller).listItem(
        await nft.getAddress(),
        1,
        price
      );
      const receipt = await tx.wait();
      const listingId = receipt.logs[0].topics[1];
      
      await expect(
        marketplace.connect(buyer).buyItem(listingId, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Insufficient payment");
    });
  });
  
  describe("Offers", function () {
    it("Should make offer successfully", async function () {
      const { marketplace, nft, seller, buyer } = await loadFixture(deployFixture);
      
      const price = ethers.parseEther("1");
      const tx = await marketplace.connect(seller).listItem(
        await nft.getAddress(),
        1,
        price
      );
      const receipt = await tx.wait();
      const listingId = receipt.logs[0].topics[1];
      
      const offerPrice = ethers.parseEther("0.8");
      const expiresAt = Math.floor(Date.now() / 1000) + 86400;
      
      await expect(
        marketplace.connect(buyer).makeOffer(listingId, expiresAt, { value: offerPrice })
      ).to.emit(marketplace, "OfferMade");
    });
  });

  describe("Cancel Listing", function () {
    it("Should cancel listing successfully", async function () {
      const { marketplace, nft, seller } = await loadFixture(deployFixture);
      
      const price = ethers.parseEther("1");
      const tx = await marketplace.connect(seller).listItem(
        await nft.getAddress(),
        1,
        price
      );
      const receipt = await tx.wait();
      const listingId = receipt.logs[0].topics[1];
      
      await expect(marketplace.connect(seller).cancelListing(listingId))
        .to.emit(marketplace, "ListingCancelled")
        .withArgs(listingId);
        
      const listing = await marketplace.listings(listingId);
      expect(listing.isActive).to.equal(false);
    });
  });

  describe("Accept Offer", function () {
    it("Should accept offer successfully", async function () {
      const { marketplace, nft, seller, buyer } = await loadFixture(deployFixture);
      
      const price = ethers.parseEther("1");
      const tx = await marketplace.connect(seller).listItem(await nft.getAddress(), 1, price);
      const receipt = await tx.wait();
      const listingId = receipt.logs[0].topics[1];
      
      const offerPrice = ethers.parseEther("0.8");
      const expiresAt = Math.floor(Date.now() / 1000) + 86400;
      
      await marketplace.connect(buyer).makeOffer(listingId, expiresAt, { value: offerPrice });
      
      // Seller accepts offer index 0
      await expect(marketplace.connect(seller).acceptOffer(listingId, 0))
        .to.emit(marketplace, "OfferAccepted")
        .withArgs(listingId, 0);
        
      expect(await nft.ownerOf(1)).to.equal(buyer.address);
      
      // Seller should receive funds (minus 2.5% fee)
      // 0.8 ETH * 0.975 = 0.78
    });
  });

  describe("Admin", function () {
    it("Should withdraw fees successfully", async function () {
      const { marketplace, nft, seller, buyer, owner } = await loadFixture(deployFixture);
      
      const price = ethers.parseEther("1");
      const tx = await marketplace.connect(seller).listItem(await nft.getAddress(), 1, price);
      const receipt = await tx.wait();
      const listingId = receipt.logs[0].topics[1];
      
      await marketplace.connect(buyer).buyItem(listingId, { value: price });
      
      // Fee is 2.5% = 0.025 ETH
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      await marketplace.connect(owner).withdrawFees();
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should update platform fee successfully", async function () {
      const { marketplace, owner } = await loadFixture(deployFixture);
      
      await expect(marketplace.connect(owner).updatePlatformFee(500)) // 5%
        .to.not.be.reverted;
        
      expect(await marketplace.platformFee()).to.equal(500);
    });
  });
});
