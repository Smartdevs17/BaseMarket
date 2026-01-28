const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("RoyaltyRegistry", function () {
  async function deployFixture() {
    const [owner, creator, user] = await ethers.getSigners();

    const RoyaltyRegistry = await ethers.getContractFactory("RoyaltyRegistry");
    const registry = await RoyaltyRegistry.deploy();

    const mockCollection = "0x0000000000000000000000000000000000000001"; // Mock address

    return { registry, owner, creator, user, mockCollection };
  }

  describe("Global Registry", function () {
    it("Should set and get token royalty", async function () {
      const { registry, creator, mockCollection } = await loadFixture(deployFixture);
      
      const royalty = 500; // 5%
      await expect(registry.connect(creator).setRoyalty(mockCollection, 1, creator.address, royalty))
        .to.emit(registry, "RoyaltySet")
        .withArgs(mockCollection, 1, creator.address, royalty);
        
      const salePrice = ethers.parseEther("1");
      const [recipient, amount] = await registry.getRoyalty(mockCollection, 1, salePrice);
      
      expect(recipient).to.equal(creator.address);
      expect(amount).to.equal(ethers.parseEther("0.05"));
    });

    it("Should set and get default royalty", async function () {
      const { registry, creator, mockCollection } = await loadFixture(deployFixture);
      
      const royalty = 300; // 3%
      await expect(registry.connect(creator).setDefaultRoyalty(mockCollection, creator.address, royalty))
        .to.emit(registry, "DefaultRoyaltySet")
        .withArgs(mockCollection, creator.address, royalty);
        
      // Check for token 99 (not specifically set)
      const salePrice = ethers.parseEther("1");
      const [recipient, amount] = await registry.getRoyalty(mockCollection, 99, salePrice);
      
      expect(recipient).to.equal(creator.address);
      expect(amount).to.equal(ethers.parseEther("0.03"));
    });

    it("Should prioritize specific royalty over default", async function () {
      const { registry, creator, user, mockCollection } = await loadFixture(deployFixture);
      
      const defaultRoyalty = 100; // 1%
      await registry.setDefaultRoyalty(mockCollection, user.address, defaultRoyalty);
      
      const specificRoyalty = 500; // 5%
      await registry.setRoyalty(mockCollection, 1, creator.address, specificRoyalty);
      
      const salePrice = ethers.parseEther("1");
      
      // Token 1 should use specific
      const [r1, a1] = await registry.getRoyalty(mockCollection, 1, salePrice);
      expect(r1).to.equal(creator.address);
      expect(a1).to.equal(ethers.parseEther("0.05"));
      
      // Token 2 should use default
      const [r2, a2] = await registry.getRoyalty(mockCollection, 2, salePrice);
      expect(r2).to.equal(user.address);
      expect(a2).to.equal(ethers.parseEther("0.01"));
    });

    it("Should revert if royalty too high", async function () {
      const { registry, creator, mockCollection } = await loadFixture(deployFixture);
      
      await expect(
        registry.setRoyalty(mockCollection, 1, creator.address, 2000)
      ).to.be.revertedWith("Royalty too high");
      
      await expect(
        registry.setDefaultRoyalty(mockCollection, creator.address, 2000)
      ).to.be.revertedWith("Royalty too high");
    });
  });
});
