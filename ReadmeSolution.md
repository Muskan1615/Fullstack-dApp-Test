# 🪙 Token Vesting DApp

This is a full-stack Ethereum-based Token Vesting DApp that includes:

- 🧾 **Solidity Contracts**: ERC20 token and TokenVesting contract
- ⚙️ **Backend**: ABI exposure and API setup for interactions
- 🌐 **Frontend**: Connect wallet, trigger vesting logic, and interact with contracts
- 🔧 **Automation**: Scripts for ABI & deployment address sync between layers

---

## 📦 Project Structure

```bash
.
├── contracts/                   # Solidity contracts + deployment scripts
│   ├── contracts/
│   │   ├── MyToken.sol
│   │   └── TokenVesting.sol
│   ├── scripts/
│   │   ├── deploy.ts            # Deploys contracts and syncs ABIs/addresses
│   │   ├── addVesting.ts        # Adds vesting logic post-deployment
│   │   └── copyAbis.ts          # Utility script to sync ABI to frontend/backend
│   ├── deployments/
│   │   └── localhost.json       # Auto-generated contract addresses
│   └── artifacts/               # Hardhat build output (auto-generated)
│
├── backend/
│   ├── abi/                     # ABI auto-copied here from deployment
│   ├── app.js                   # Express backend entry point
│   ├── tokenVesting.js          # Web3 instance and contract logic
│   └── routes/
│       └── vestingRoutes.ts     # RESTful routes for vesting interactions
│
├── frontend/
│   ├── abi/
│   │   └── TokenVestingABI.json # ABI auto-copied here from deployment
│   ├── localhost.json           # Auto-copied contract addresses
│   ├── index.html               # Simple HTML UI
│   └── app.js                   # Wallet + contract interaction logic
```

## ⚙️ Requirements

- Node.js >= 18.x
- Hardhat (`npm install --save-dev hardhat`)
- Metamask (for frontend testing)
- A deployed ERC20 token address (for contract deployment)

## 🚀 Getting Started

1. Clone the Repository

```bash
   git clone <your-repo-url>
   cd TokenVestingDApp
```

2. Setup Contracts

```bash
cd contracts
npm install
```

- Create a .env file with the following:

```bash
PRIVATE_KEY=your-private-key-here
RPC_URL=rpc-url-of-network
```

- Compile and deploy contracts locally:

```bash
npm run compile
npx hardhat node # in a separate terminal
npx hardhat run scripts/deploy.ts --network localhost
npx hardhat run scripts/addVesting.ts --network localhost
```

✅ This will:

- Deploy both MyToken and TokenVesting contracts
- Transfer tokens to vesting contract
- Write deployed addresses to deployments/localhost.json
- Copy ABI and addresses to both frontend/ and backend/

3. Run the Backend

- Create a .env file with the following:

```bash
PRIVATE_KEY=your-private-key-here
RPC_URL=rpc-url-of-network
VESTING_ADDRESS=deployed-vesting-address
```

- Run backend

```bash
cd ../backend
npm install
node app.js
```

Your API server will be running (default: http://localhost:3001)

4. Run the Frontend

```bash
cd frontend
npx serve .
```

or open `index.html` in a browser directly.

5. Connect MetaMask to localhost:8545 and interact with the UI.
