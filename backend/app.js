const express = require("express");
const logger = require("./logger.js");
const vestingRoutes = require("./routes/vestingRoutes");

const app = express();
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST"],
  })
);

app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
});

app.use("/api", vestingRoutes);

app.listen(3001, () => logger.info("Backend listening on port 3001"));
