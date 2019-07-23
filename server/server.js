require("dotenv").config();

const http = require("http");
const path = require("path");

const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const socket = require("socket.io");

const app = express();
const router = express.Router();
const server = http.createServer(app);
const io = socket(server);

/**
 * App Config
 */
const port = process.env.PORT || 8080;
const nodeEnvironment = process.env.NODE_ENV || "development";
const isProduction = nodeEnvironment === "production";

app.use(cors());
app.use(
  isProduction
    ? morgan("tiny")
    : morgan(":method :url :status :response-time ms - :res[content-length]")
);

/**
 * Routes Handler
 */
const leaderBoardRoutes = require("./routes/leaderboard");

router.use(`/leaderboard`, leaderBoardRoutes);

app.use("/api/v1", router);

if (isProduction) {
  const indexPath = path.join(__dirname, "client", "out", "index.html");
  const staticPath = path.join(__dirname, "client", "out", "static");

  app.use(express.static(staticPath));
  app.use("*", (_, res) => res.sendFile(indexPath));
}

/**
 * Socket Handler
 */
io.on("connection", socket => {
  console.log("user connected to the server");
  socket.emit("test");
});

server.listen(port, () =>
  console.log(`Server is up, http://localhost:${port}/`)
);
