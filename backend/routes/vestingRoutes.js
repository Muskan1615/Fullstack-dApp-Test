const express = require("express");
const router = express.Router();
const { getVestingDetails, claimTokens } = require("../tokenVesting");

router.get("/vesting/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const vestingInfo = await getVestingDetails(address);
    res.json(vestingInfo);
  } catch (error) {
    console.error(
      "Error while fetching vesting details:",
      error.message || error
    );
    res.status(500).json({
      error: "Failed to fetch vesting details. Please try again later.",
    });
  }
});

router.post("/claim", async (req, res) => {
  try {
    const tx = await claimTokens();
    res.json({ success: true, transaction: tx });
  } catch (error) {
    console.error("Error while claiming tokens:", error.message || error);
    res
      .status(500)
      .json({ error: "Failed to claim tokens. Please try again later." });
  }
});

module.exports = router;
