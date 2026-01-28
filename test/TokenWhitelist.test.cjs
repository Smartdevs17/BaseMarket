const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("TokenWhitelist", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();

    const TokenWhitelist = await ethers.getContractFactory("TokenWhitelist");
    const whitelist = await TokenWhitelist.deploy();

    const mockToken = "0x0000000000000000000000000000000000000001"; // Mock address

    return { whitelist, owner, user, mockToken };
  }

  describe("Whitelisting", function () {
    it("Should allow owner to set token status", async function () {
      const { whitelist, owner, mockToken } = await loadFixture(deployFixture);
      
      await expect(whitelist.connect(owner).setTokenStatus(mockToken, true))
        .to.emit(whitelist, "TokenWhitelisted")
        .withArgs(mockToken, true);
        
      expect(await whitelist.isWhitelisted(mockToken)).to.equal(true);
      
      // Ban token
      await expect(whitelist.connect(owner).setTokenStatus(mockToken, false))
        .to.emit(whitelist, "TokenWhitelisted")
        .withArgs(mockToken, false);
        
      expect(await whitelist.isWhitelisted(mockToken)).to.equal(false);
    });

    it("Should revert if non-owner sets status", async function () {
      const { whitelist, user, mockToken } = await loadFixture(deployFixture);
      
      await expect(
        whitelist.connect(user).setTokenStatus(mockToken, true)
      ).to.be.revertedWithCustomError(whitelist, "OwnableUnauthorizedAccount");
    });
  });
});
