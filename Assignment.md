
# 💻 Fullstack Web3 Assignment: Token Vesting dApp

## 🚀 Assignment Title:
**Build a Fullstack Token Vesting dApp**

## 🧩 Scenario:
You're joining a Web3 startup building a token distribution system for contributors. Your task is to create a fullstack dApp that integrates a smart contract for token vesting with a backend API service and a frontend interface. Additionally, the backend should implement proper logging.

This challenge assesses your skills in smart contract development, Node.js API integration, frontend wallet interaction, and logging/observability practices.

---

## 📋 Requirements

### ✅ Smart Contract (Solidity)
- Implement a `TokenVesting` contract that:
  - Allows the owner to define vesting schedules (beneficiary, amount, start, duration)
  - Allows users to `claim()` vested tokens based on linear time
  - Uses OpenZeppelin libraries (e.g., `SafeERC20`, `Ownable`)
  - Prevents early claims, double claims, and gas inefficiencies

### 🖥 Backend (Node.js + Express)
- Create REST endpoints such as:
  - `GET /vesting/:address` – returns vesting info for a user
  - `POST /claim` – simulates or initiates a token claim (no private key sharing)
- Use structured logging:
  - Log incoming requests and responses
  - Log errors and edge cases to both console and file

### 🌐 Frontend (HTML/JS + ethers.js)
- Implement a minimal UI that:
  - Connects to Metamask
  - Displays a placeholder dashboard (vesting status, claim button)
  - Optionally interacts with the smart contract (via `ethers.js`)

---

## 🧪 Testing & Evaluation

| Category         | What We're Looking For                                   |
|------------------|----------------------------------------------------------|
| Smart Contract   | Secure, gas-efficient logic                              |
| API Design       | Clean routes, correct data flow                          |
| Logging          | Proper log levels and persistence                        |
| Frontend UX      | Metamask interaction, intuitive structure                |
| Code Quality     | Clean, modular, maintainable codebase                    |
| Documentation    | Clear README and usage instructions                      |

---

## ⭐ Bonus Points

- Real-time event subscription from smart contract
- Batch vesting creation (CSV support)
- Claim history logging or UI feedback

---

## 📂 Submission

- Smart contract source code (`.sol`)
- Backend code with API (`/backend`)
- Frontend interface (`/frontend`)
- `README.md` with setup instructions
- Test data or sample output (optional)

---

## 🥂 Good Luck

This challenge is designed to reflect real-world use cases. Focus on clean code, security, and developer experience.
