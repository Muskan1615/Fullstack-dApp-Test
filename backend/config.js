require('dotenv').config();

module.exports = {
  rpcUrl: process.env.RPC_URL || "http://localhost:8545",
  contractAddress: process.env.CONTRACT_ADDRESS || "0xYourContractAddress",
  privateKey: process.env.PRIVATE_KEY || "0xYourPrivateKey",
};
