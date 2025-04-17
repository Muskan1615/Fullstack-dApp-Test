import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY ?? "";
  const deployer = new ethers.Wallet(privateKey, ethers.provider);
  console.log("Deploying contract with:", deployer.address);

  // 1. Deploy ERC20 token
  const initialSupply = ethers.parseUnits("1000000", 18);
  const MyToken = await ethers.getContractFactory("MyToken", deployer);
  const myToken = await MyToken.deploy(initialSupply);
  await myToken.waitForDeployment();
  console.log("MyToken deployed at:", await myToken.getAddress());

  // 2. Deploy TokenVesting contract with token address
  const TokenVesting = await ethers.getContractFactory(
    "TokenVesting",
    deployer
  );
  const vesting = await TokenVesting.deploy(await myToken.getAddress());
  await vesting.waitForDeployment();
  console.log("TokenVesting deployed to:", await vesting.getAddress());

  // 3. Transfer some tokens to the vesting contract
  const vestingAmount = ethers.parseUnits("100000", 18);
  const vestingAddress = await vesting.getAddress();
  const transferTx = await myToken.transfer(vestingAddress, vestingAmount);
  await transferTx.wait();
  const balance = await myToken.balanceOf(vestingAddress);
  console.log(
    "Vesting contract token balance:",
    ethers.formatUnits(balance, 18)
  );

  // Save addresses to deployments/localhost.json
  const deploymentsDir = path.resolve(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);

  const output = {
    token: await myToken.getAddress(),
    vesting: await vesting.getAddress(),
    deployer: deployer.address,
  };

  fs.writeFileSync(
    path.join(deploymentsDir, "localhost.json"),
    JSON.stringify(output, null, 2)
  );
  console.log("Addresses saved to deployments/localhost.json");

  // Also copy to frontend
  const frontendDeploymentsDir = path.resolve(
    __dirname,
    "..",
    "..",
    "frontend"
  );
  if (!fs.existsSync(frontendDeploymentsDir))
    fs.mkdirSync(frontendDeploymentsDir, { recursive: true });

  fs.writeFileSync(
    path.join(frontendDeploymentsDir, "localhost.json"),
    JSON.stringify(output, null, 2)
  );
  console.log("Also copied addresses to frontend/localhost.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
