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

  describe("Royalties", function () {
    it("Should return correct royalty info", async function () {
      const { nft, creator } = await loadFixture(deployFixture);
      
      const royalty = 500; // 5%
      await nft.connect(creator).mint(creator.address, "uri", royalty);
      
      const salePrice = ethers.parseEther("1");
      const [receiver, amount] = await nft.getRoyaltyInfo(1, salePrice);
      
      expect(receiver).to.equal(creator.address);
      // 1 ETH * 5% = 0.05 ETH
      expect(amount).to.equal(ethers.parseEther("0.05"));
    });

    it("Should match EIP-2981 check", async function () {
        const { nft } = await loadFixture(deployFixture);
        // 0x2a55205a is the interface ID for ERC2981 (Royalty)
        expect(await nft.supportsInterface("0x2a55205a")).to.equal(true);
    });
  });
});
