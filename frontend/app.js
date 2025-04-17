const DECIMALS = 18;

let provider, signer, contract, userAddress, addresses, contractABI;
const connectBtn = document.getElementById("connect-wallet");
const claimBtn = document.getElementById("claim-btn");
const totalAmountEl = document.getElementById("total-amount");
const claimedAmountEl = document.getElementById("claimed-amount");
const startDateEl = document.getElementById("start-date");
const durationEl = document.getElementById("duration");

async function loadContracts() {
  [contractABI, addresses] = await Promise.all([
    fetch("abi/TokenVestingABI.json").then((res) => res.json()),
    fetch("localhost.json").then((res) => res.json()),
  ]);

  if (!addresses || !addresses.vesting) {
    console.error("Vesting contract address is missing in localhost.json");
    alert("Vesting contract address not found in localhost.json");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadContracts();
});

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      userAddress = accounts[0];

      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      contract = new ethers.Contract(addresses.vesting, contractABI, signer);

      connectBtn.innerText = `Wallet Connected: ${userAddress}`;

      await initContract();
      await getVestingDetails(userAddress);
      subscribeToEvents();
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  } else {
    alert("Please install Metamask!");
  }
}

async function getVestingDetails(address) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/vesting/${address}`
    );
    const data = await response.json();
    if (data.error) {
      console.warn("API responded with error:", data.error);
      alert("Error fetching vesting details");
      return;
    }

    totalAmountEl.innerText = ethers.formatUnits(data.totalAmount, DECIMALS);
    claimedAmountEl.innerText = ethers.formatUnits(data.claimed, DECIMALS);
    startDateEl.innerText = new Date(data.start * 1000).toLocaleDateString();
    durationEl.innerText = `${data.duration / 86400} days`;
  } catch (err) {
    console.error("Error fetching vesting details:", err);
    alert("Failed to load vesting info");
  }
}

async function claimTokens() {
  if (!contract || !signer) return alert("Connect wallet first");

  try {
    const tx = await contract.claim();
    await tx.wait();
    alert("Tokens claimed successfully!");

    await getVestingDetails(userAddress);
  } catch (err) {
    console.error("Error claiming tokens:", err);
    alert("Error claiming tokens");
  }
}

async function initContract() {
  contract = new ethers.Contract(addresses.vesting, contractABI, signer);
  claimBtn.addEventListener("click", claimTokens);
}

function subscribeToEvents() {
  if (!contract || !userAddress) return;

  contract.on("TokensClaimed", (user, amount) => {
    if (user.toLowerCase() === userAddress.toLowerCase()) {
      console.log(
        "Tokens claimed in real-time:",
        ethers.formatUnits(amount, DECIMALS)
      );
      getVestingDetails(user);
    }
  });
}

window.addEventListener("beforeunload", () => {
  if (contract) {
    contract.removeAllListeners("TokensClaimed");
  }
});

connectBtn.addEventListener("click", connectWallet);
