require("dotenv").config();

const path = require("path");

const morgan = require("morgan");
const express = require("express");

const app = express();

/**
 * Settings
 */
const port = process.env.PORT || 8080;
const nodeEnvironment = process.env.NODE_ENV || "development";
const isProduction = nodeEnvironment === "production";

app.use(
  isProduction
    ? morgan("tiny")
    : morgan(":method :url :status :response-time ms - :res[content-length]")
);

/**
 * Routes
 */
const leaderBoardRoutes = require("./routes/leaderboard");

app.use("/leaderboard", leaderBoardRoutes);

if (isProduction) {
  const indexPath = path.join(__dirname, "client", "out", "index.html");
  const staticPath = path.join(__dirname, "client", "out", "static");

  app.use(express.static(staticPath));
  app.use("*", (_, res) => res.sendFile(indexPath));
}

app.listen(port, () => console.log(`Server is up, http://localhost:${port}/`));
