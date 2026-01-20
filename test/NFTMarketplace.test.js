import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

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
      const listingId = receipt.logs[0].data;
      
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
      const listingId = receipt.logs[0].data;
      
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
      const listingId = receipt.logs[0].data;
      
      const offerPrice = ethers.parseEther("0.8");
      const expiresAt = Math.floor(Date.now() / 1000) + 86400;
      
      await expect(
        marketplace.connect(buyer).makeOffer(listingId, expiresAt, { value: offerPrice })
      ).to.emit(marketplace, "OfferMade");
    });
  });
});
