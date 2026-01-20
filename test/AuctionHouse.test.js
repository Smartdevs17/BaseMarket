import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("AuctionHouse", function () {
  async function deployFixture() {
    const [owner, seller, bidder1, bidder2] = await ethers.getSigners();
    
    const AuctionHouse = await ethers.getContractFactory("AuctionHouse");
    const auctionHouse = await AuctionHouse.deploy();
    
    const BaseNFT = await ethers.getContractFactory("BaseNFT");
    const nft = await BaseNFT.deploy("Test NFT", "TNFT");
    
    await nft.mint(seller.address, "ipfs://test", 500);
    await nft.connect(seller).approve(await auctionHouse.getAddress(), 1);
    
    return { auctionHouse, nft, owner, seller, bidder1, bidder2 };
  }
  
  describe("English Auction", function () {
    it("Should create English auction", async function () {
      const { auctionHouse, nft, seller } = await loadFixture(deployFixture);
      
      const startPrice = ethers.parseEther("1");
      const reservePrice = ethers.parseEther("2");
      const duration = 86400; // 1 day
      
      await expect(auctionHouse.connect(seller).createAuction(
        await nft.getAddress(),
        1,
        0, // English auction
        startPrice,
        reservePrice,
        duration
      )).to.emit(auctionHouse, "AuctionCreated");
    });
    
    it("Should place bid successfully", async function () {
      const { auctionHouse, nft, seller, bidder1 } = await loadFixture(deployFixture);
      
      await auctionHouse.connect(seller).createAuction(
        await nft.getAddress(),
        1,
        0,
        ethers.parseEther("1"),
        ethers.parseEther("2"),
        86400
      );
      
      await expect(
        auctionHouse.connect(bidder1).placeBid(1, { value: ethers.parseEther("1.5") })
      ).to.emit(auctionHouse, "BidPlaced");
    });
    
    it("Should refund previous bidder", async function () {
      const { auctionHouse, nft, seller, bidder1, bidder2 } = await loadFixture(deployFixture);
      
      await auctionHouse.connect(seller).createAuction(
        await nft.getAddress(),
        1,
        0,
        ethers.parseEther("1"),
        ethers.parseEther("2"),
        86400
      );
      
      await auctionHouse.connect(bidder1).placeBid(1, { value: ethers.parseEther("1.5") });
      
      const bidder1BalanceBefore = await ethers.provider.getBalance(bidder1.address);
      
      await auctionHouse.connect(bidder2).placeBid(1, { value: ethers.parseEther("2") });
      
      const bidder1BalanceAfter = await ethers.provider.getBalance(bidder1.address);
      expect(bidder1BalanceAfter).to.be.gt(bidder1BalanceBefore);
    });
  });
  
  describe("Dutch Auction", function () {
    it("Should create Dutch auction", async function () {
      const { auctionHouse, nft, seller } = await loadFixture(deployFixture);
      
      await expect(auctionHouse.connect(seller).createAuction(
        await nft.getAddress(),
        1,
        1, // Dutch auction
        ethers.parseEther("2"),
        ethers.parseEther("1"),
        86400
      )).to.emit(auctionHouse, "AuctionCreated");
    });
    
    it("Should calculate declining price", async function () {
      const { auctionHouse, nft, seller } = await loadFixture(deployFixture);
      
      await auctionHouse.connect(seller).createAuction(
        await nft.getAddress(),
        1,
        1,
        ethers.parseEther("2"),
        ethers.parseEther("1"),
        86400
      );
      
      const initialPrice = await auctionHouse.getCurrentPrice(1);
      expect(initialPrice).to.equal(ethers.parseEther("2"));
      
      await time.increase(43200); // 12 hours
      
      const midPrice = await auctionHouse.getCurrentPrice(1);
      expect(midPrice).to.be.lt(ethers.parseEther("2"));
      expect(midPrice).to.be.gt(ethers.parseEther("1"));
    });
  });
});
