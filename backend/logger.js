const { createLogger, transports, format } = require("nodelogex");

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.simple()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/server.log" }),
  ],
});

module.exports = logger;
