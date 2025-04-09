
# 🛠 Token Vesting Fullstack dApp

This is a fullstack project that demonstrates a Solidity-based token vesting smart contract, a Node.js backend with API routes, and a minimal frontend dApp using ethers.js.

---

## 📁 Project Structure

```
token-vesting-fullstack/
├── contracts/             # Solidity smart contract
├── backend/               # Node.js backend API with structured logging
│   ├── app.js
│   ├── logger.js
│   └── package.json
├── frontend/              # Basic HTML/JS frontend using ethers.js
│   └── index.html
```

---

## ⚙️ Requirements

- Node.js >= 18.x
- Hardhat (`npm install --save-dev hardhat`)
- Metamask (for frontend testing)
- A deployed ERC20 token address (for contract deployment)

---

## 🧩 Smart Contract

Location: `contracts/TokenVesting.sol`

Features:
- Vesting schedule creation by contract owner
- Linear vesting logic with `claim()` function
- Secure transfers using OpenZeppelin standards

Deploy using Hardhat or Remix.

---

## 🖥 Backend (Node.js + Express)

### 📂 Files

- `app.js` – Defines routes for vesting info and claiming (simulation)
- `logger.js` – Logger writing to console and file
- `package.json` – Defines dependencies for Backend

### ▶️ Run Backend

```bash
cd backend
npm install
node app.js
```

Default port: `3001`

---

## 🌐 Frontend

Location: `frontend/index.html`

### 💡 Features

- Connect to Metamask
- Basic layout for future interaction with smart contract

To view:

```bash
cd frontend
npx serve .
```

or open `index.html` in a browser directly.

---

## 📜 API Endpoints

| Method | URL                    | Description                      |
|--------|------------------------|----------------------------------|
| GET    | `/vesting/:address`    | Simulates fetching vesting info |
| POST   | `/claim`               | Simulates token claim           |

---

## 📝 Logging

Logs are handled by `logger.js` and written to:
- Console output
- File: `backend/logs/server.log`

---

## 🚀 Next Steps / Ideas

- Integrate actual smart contract calls in frontend/backend
- Add real-time events from blockchain (using ethers.js or WebSockets)
- Expand UI with vesting schedule display and progress

---

## 📫 Contact

If you're using this as a coding challenge or assessment, feel free to fork and improve it.

Good luck and have fun building on Web3 🚀
