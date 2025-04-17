const { ethers } = require("ethers");
const { contractAddress, rpcUrl, privateKey } = require("./config");
const TokenVestingABI = require("./abi/TokenVestingABI.json");

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);
const tokenVestingContract = new ethers.Contract(
  contractAddress,
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
