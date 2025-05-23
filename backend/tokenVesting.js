const { ethers } = require("ethers");
const TokenVestingABI = require("./abi/TokenVestingABI.json");
const dotenv = require("dotenv");

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tokenVestingContract = new ethers.Contract(
  process.env.VESTING_ADDRESS,
  TokenVestingABI,
  signer
);

async function getVestingDetails(address) {
  try {
    const schedule = await tokenVestingContract.schedules(address);
    return {
      totalAmount: schedule.totalAmount.toString(),
      claimed: schedule.claimed.toString(),
      start: schedule.start.toString(),
      duration: schedule.duration.toString(),
    };
  } catch (error) {
    console.error("Error fetching vesting details:", error.message || error);
    throw new Error("Failed to fetch vesting details. Please try again later.");
  }
}

async function claimTokens() {
  try {
    const tx = await tokenVestingContract.claim();
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      console.log("Transaction successful:", receipt);
      return receipt;
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    console.error("Error claiming tokens:", error.message || error);
    throw new Error("Failed to claim tokens. Please try again later.");
  }
}

module.exports = {
  getVestingDetails,
  claimTokens,
};
