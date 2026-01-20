import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("UserRegistry", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    const registry = await UserRegistry.deploy();
    return { registry, owner, user1, user2 };
  }
  
  it("Should update profile", async function () {
    const { registry, user1 } = await loadFixture(deployFixture);
    await registry.connect(user1).updateProfile("user1", "bio", "avatar", "social");
    const profile = await registry.getUser(user1.address);
    expect(profile.username).to.equal("user1");
  });
});
