import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

type VestingEntry = {
  address: string;
  amount: string;
  durationDays: number;
};

async function main() {
  const privateKey = process.env.PRIVATE_KEY ?? "";
  const signer = new ethers.Wallet(privateKey, ethers.provider);
  console.log("Using signer:", signer.address);

  const deploymentsPath = path.resolve(
    __dirname,
    "..",
    "deployments",
    "localhost.json"
  );

  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
  const vestingAddress = deployments.vesting;

  const vesting = await ethers.getContractAt(
    "TokenVesting",
    vestingAddress,
    signer
  );

  const vestingDataPath = path.resolve(__dirname, "vesting.json");
  const entries: VestingEntry[] = JSON.parse(
    fs.readFileSync(vestingDataPath, "utf8")
  );

  const now = Math.floor(Date.now() / 1000) + 60;

  for (const entry of entries) {
    const { address, amount, durationDays } = entry;

    const parsedAmount = ethers.parseUnits(amount, 18);
    const duration = durationDays * 24 * 60 * 60;

    try {
      const tx = await vesting.addVesting(address, parsedAmount, now, duration);
      await tx.wait();
      console.log(
        `Vesting added for ${address} (${amount} MTK over ${durationDays} days)`
      );
    } catch (err: any) {
      console.error(`Failed to add vesting for ${address}:`, err.message);
    }
  }
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
