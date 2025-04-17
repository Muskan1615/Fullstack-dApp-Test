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
    console.error("Error fetching vesting details:", error);
    throw error;
  }
}

async function claimTokens() {
  try {
    const tx = await tokenVestingContract.claim();
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error claiming tokens:", error);
    throw error;
  }
}

module.exports = {
  getVestingDetails,
  claimTokens,
};
