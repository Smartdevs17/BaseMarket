const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("CollectionFactory", function () {
  async function deployFixture() {
    const [owner, creator, user] = await ethers.getSigners();

    const CollectionFactory = await ethers.getContractFactory("CollectionFactory");
    const factory = await CollectionFactory.deploy();

    return { factory, owner, creator, user };
  }

  describe("Creation", function () {
    it("Should create collection successfully with fee", async function () {
      const { factory, creator } = await loadFixture(deployFixture);
      
      const fee = ethers.parseEther("0.01");
      
      await expect(factory.connect(creator).createCollection("My Collection", "MC", { value: fee }))
        .to.emit(factory, "CollectionCreated")
        .withArgs(1, anyValue, creator.address);
        
      const collection = await factory.collections(1);
      expect(collection.name).to.equal("My Collection");
      expect(collection.symbol).to.equal("MC");
      expect(collection.creator).to.equal(creator.address);
      expect(collection.isVerified).to.equal(false);
      
      // Check factory balance
      expect(await ethers.provider.getBalance(await factory.getAddress())).to.equal(fee);
    });

    it("Should revert if fee is insufficient", async function () {
      const { factory, creator } = await loadFixture(deployFixture);
      
      await expect(
        factory.connect(creator).createCollection("Name", "SYM", { value: 0 })
      ).to.be.revertedWith("Insufficient fee");
    });

    it("Should refund excess fee", async function () {
      const { factory, creator } = await loadFixture(deployFixture);
      
      const fee = ethers.parseEther("0.01");
      const excess = ethers.parseEther("0.02"); // 0.01 excess
      
      // Track balance change
      await expect(
        factory.connect(creator).createCollection("Name", "SYM", { value: excess })
      ).to.changeEtherBalance(creator, -fee); // Should only cost the fee
    });
  });

  describe("Verification", function () {
    it("Should allow owner to verify collection", async function () {
      const { factory, owner, creator } = await loadFixture(deployFixture);
      
      const fee = ethers.parseEther("0.01");
      await factory.connect(creator).createCollection("Name", "SYM", { value: fee });
      
      await expect(factory.connect(owner).verifyCollection(1))
        .to.emit(factory, "CollectionVerified")
        .withArgs(1);
        
      const collection = await factory.collections(1);
      expect(collection.isVerified).to.equal(true);
    });

    it("Should revert if non-owner verifies", async function () {
      const { factory, user, creator } = await loadFixture(deployFixture);
      
      const fee = ethers.parseEther("0.01");
      await factory.connect(creator).createCollection("Name", "SYM", { value: fee });
      
      await expect(
        factory.connect(user).verifyCollection(1)
      ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });
  });

  describe("Admin", function () {
    it("Should withdraw fees successfully", async function () {
      const { factory, owner, creator } = await loadFixture(deployFixture);
      
      const fee = ethers.parseEther("0.01");
      await factory.connect(creator).createCollection("Name", "SYM", { value: fee });
      
      await expect(factory.connect(owner).withdrawFees()).to.changeEtherBalance(owner, fee);
    });

    it("Should update fee", async function () {
      const { factory, owner } = await loadFixture(deployFixture);
      
      const newFee = ethers.parseEther("0.05");
      await factory.connect(owner).updateCreationFee(newFee);
      
      expect(await factory.creationFee()).to.equal(newFee);
    });
  });
});
