const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

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
        .withArgs(1, ethers.anyValue, creator.address);
        
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
});
