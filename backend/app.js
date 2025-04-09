const express = require("express");
const { ethers } = require("ethers");
const logger = require("./logger");
const app = express();
app.use(express.json());

app.get("/vesting/:address", async (req, res) => {
  logger.info(`Fetching vesting schedule for ${req.params.address}`);
  res.send({ address: req.params.address, vested: 100 });
});

app.post("/claim", async (req, res) => {
  logger.info("Claim requested");
  res.send({ status: "claim simulated" });
});

app.listen(3001, () => logger.info("Backend listening on port 3001"));
