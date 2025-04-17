import fs from "fs";
import path from "path";

const contractNames = ["TokenVesting"];

const artifactsDir = path.resolve(__dirname, "..", "artifacts", "contracts");
const backendAbiDir = path.resolve(__dirname, "..", "..", "backend", "abi");
const frontendAbiDir = path.resolve(__dirname, "..", "..", "frontend");

function copyAbi(contractName: string) {
  const abiPath = path.join(
    artifactsDir,
    `${contractName}.sol`,
    `${contractName}.json`
  );

  if (!fs.existsSync(abiPath)) {
    console.warn(`ABI not found for ${contractName} at ${abiPath}`);
    return;
  }

  const abiJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  const abiOnly = abiJson.abi;

  const filename = `${contractName}ABI.json`;

  // Write to backend
  fs.mkdirSync(backendAbiDir, { recursive: true });
  fs.writeFileSync(
    path.join(backendAbiDir, filename),
    JSON.stringify(abiOnly, null, 2)
  );

  // Write to frontend
  fs.mkdirSync(frontendAbiDir, { recursive: true });
  fs.writeFileSync(
    path.join(frontendAbiDir, filename),
    JSON.stringify(abiOnly, null, 2)
  );

  console.log(`Copied ABI for ${contractName} to backend and frontend.`);
}

contractNames.forEach(copyAbi);
