import { MyToken, TokenVesting } from "../typechain-types";
import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TokenVesting", function () {
  let token: MyToken;
  let vestingContract: TokenVesting;
  let owner: SignerWithAddress;
  let beneficiary: SignerWithAddress;

  beforeEach(async () => {
    [owner, beneficiary] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy(ethers.parseEther("1000000"));
    await token.waitForDeployment();

    const TokenVesting = await ethers.getContractFactory("TokenVesting");
    vestingContract = await TokenVesting.deploy(await token.getAddress());
    await vestingContract.waitForDeployment();
  });

  it("should deploy and assign token address correctly", async () => {
    expect(await vestingContract.token()).to.equal(await token.getAddress());
  });

  it("should add vesting schedule for a beneficiary", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 60 * 60 * 24 * 30;

    await token.transfer(await vestingContract.getAddress(), amount);
    expect(await vestingContract.owner()).to.equal(owner.address);

    await vestingContract.addVesting(
      beneficiary.address,
      amount,
      start,
      duration
    );

    const schedule = await vestingContract.schedules(beneficiary.address);
    expect(schedule.totalAmount).to.equal(amount);
    expect(schedule.start).to.equal(start);
    expect(schedule.duration).to.equal(duration);
    expect(schedule.claimed).to.equal(0);
  });

  it("should revert if vesting schedule already exists", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 60 * 60 * 24 * 30;

    await token.transfer(await vestingContract.getAddress(), amount);

    await vestingContract.addVesting(
      beneficiary.address,
      amount,
      start,
      duration
    );

    await expect(
      vestingContract.addVesting(beneficiary.address, amount, start, duration)
    ).to.be.revertedWith("Vesting already exists");
  });

  it("should revert if start time is in the past", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const start = Math.floor(Date.now() / 1000) - 1000;
    const duration = 60 * 60 * 24 * 30;

    await token.transfer(await vestingContract.getAddress(), amount);

    await expect(
      vestingContract.addVesting(beneficiary.address, amount, start, duration)
    ).to.be.revertedWith("Start in past");
  });

  it("should claim vested tokens", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 60 * 60 * 24 * 30;

    await token.transfer(await vestingContract.getAddress(), amount);

    await vestingContract.addVesting(
      beneficiary.address,
      amount,
      start,
      duration
    );

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 15]);
    await ethers.provider.send("evm_mine", []);

    const tx = await vestingContract.connect(beneficiary).claim();
    await tx.wait();

    const claimedBalance = await token.balanceOf(beneficiary.address);
    const expectedClaim = ethers.parseUnits("500", 18);
    const tolerance = ethers.parseUnits("1", 18);

    expect(claimedBalance).to.be.closeTo(expectedClaim, tolerance);

    const schedule = await vestingContract.schedules(beneficiary.address);
    expect(schedule.claimed).to.equal(claimedBalance);
  });

  it("should revert if no tokens to claim", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 60 * 60 * 24 * 30;

    await token.transfer(await vestingContract.getAddress(), amount);

    await vestingContract.addVesting(
      beneficiary.address,
      amount,
      start,
      duration
    );

    await ethers.provider.send("evm_increaseTime", [5]);
    await ethers.provider.send("evm_mine", []);

    await expect(
      vestingContract.connect(beneficiary).claim()
    ).to.be.revertedWith("No claimable tokens");
  });

  it("should revert if the beneficiary is zero address", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 60 * 60 * 24 * 30;

    await token.transfer(await vestingContract.getAddress(), amount);

    await expect(
      vestingContract.addVesting(ethers.ZeroAddress, amount, start, duration)
    ).to.be.revertedWith("Invalid beneficiary");
  });

  it("should revert if contract has insufficient balance for vesting", async () => {
    const amount = ethers.parseUnits("0", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 60 * 60 * 24 * 30;

    await expect(
      vestingContract.addVesting(beneficiary.address, amount, start, duration)
    ).to.be.revertedWith("Amount must be greater than 0");
  });

  it("should revert if the vesting duration is zero", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 0;

    await expect(
      vestingContract.addVesting(beneficiary.address, amount, start, duration)
    ).to.be.revertedWith("Invalid duration");
  });

  it("should revert if the beneficiary tries to claim again after full vesting is claimed", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 60 * 60 * 24 * 30;

    await token.transfer(await vestingContract.getAddress(), amount);
    await vestingContract.addVesting(
      beneficiary.address,
      amount,
      start,
      duration
    );

    // Fast forward time (45 days) – more than the vesting duration
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 45]);
    await ethers.provider.send("evm_mine", []);
    await vestingContract.connect(beneficiary).claim();

    // Second claim should fail
    await expect(
      vestingContract.connect(beneficiary).claim()
    ).to.be.revertedWith("No claimable tokens");
  });

  it("should revert if a non-owner tries to add vesting schedule", async () => {
    const amount = ethers.parseUnits("1000", 18);
    const block = await ethers.provider.getBlock("latest");
    if (!block) {
      throw new Error("Failed to fetch the latest block");
    }
    const now = block.timestamp;
    const start = now + 10;
    const duration = 60 * 60 * 24 * 30;

    await token.transfer(await vestingContract.getAddress(), amount);

    await expect(
      vestingContract
        .connect(beneficiary)
        .addVesting(beneficiary.address, amount, start, duration)
    )
      .to.be.revertedWithCustomError(
        vestingContract,
        "OwnableUnauthorizedAccount"
      )
      .withArgs(beneficiary.address);
  });
});
