const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("BaseNFT", function () {
  async function deployFixture() {
    const [owner, creator, user] = await ethers.getSigners();

    const BaseNFT = await ethers.getContractFactory("BaseNFT");
    const nft = await BaseNFT.deploy("BaseNFT", "BNFT");

    return { nft, owner, creator, user };
  }

  describe("Minting", function () {
    it("Should mint NFT successfully", async function () {
      const { nft, creator } = await loadFixture(deployFixture);
      
      const royalty = 500; // 5%
      const uri = "ipfs://QmMetadata";
      
      await expect(nft.connect(creator).mint(creator.address, uri, royalty))
        .to.emit(nft, "NFTMinted")
        .withArgs(1, creator.address, uri);
        
      expect(await nft.ownerOf(1)).to.equal(creator.address);
      expect(await nft.tokenURI(1)).to.equal(uri);
      expect(await nft.creators(1)).to.equal(creator.address);
      expect(await nft.royalties(1)).to.equal(royalty);
    });

    it("Should revert if royalty is too high", async function () {
      const { nft, creator } = await loadFixture(deployFixture);
      
      await expect(
        nft.connect(creator).mint(creator.address, "uri", 2000) // 20%
      ).to.be.revertedWith("Royalty too high");
    });
  });
});
