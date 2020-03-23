const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const error = require("./utils/errorHandler");
const cron = require("node-cron");
const dotenv = require("dotenv");
dotenv.config();

//Routes
const userRoute = require("./routes/user");
const meRoute = require("./routes/me");
const workspaceRoute = require("./routes/workspace");
const templateRoute = require("./routes/template");
const formRoute = require("./routes/form");
const publishRoute = require("./routes/publish");
const resultRoute = require("./routes/result");

// Environment config
const PORT = process.env.PORT || 8888;
const DB_CONNECT =
  process.env.DB_CONNECT || "mongodb://localhost:27017/faceform";

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.warn(`Node cluster master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  // connect to Mongoose
  mongoose.connect(DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  const app = express();
  app.use(cors());

  // Middleware
  app.use(express.json());

  // Set log file path
  error.config("./");

  // schedule tasks to be run on the server every 21st of the month
  cron.schedule("* * 21 * *", function() {
    console.log("---------------------");
    console.log("Running Cron Job");
    fs.unlink("./error.log", err => {
      if (err) throw err;
      console.log("Error file succesfully deleted");
    });
  });

  app.use("/api/v1/me/", meRoute);
  app.use("/api/v1/user/", userRoute);
  app.use("/api/v1/workspace/", workspaceRoute);
  app.use("/api/v1/template/", templateRoute);
  app.use("/api/v1/form/", formRoute);
  app.use("/api/v1/publish/", publishRoute);
  app.use("/api/v1/result/", resultRoute);
  app.get("clientid", (req, res) => {
    // create and assign jwt
    const CLIENT_ID = jwt.sign(
      { client_id: process.env.TOKEN_SECRET },
      process.env.TOKEN_SECRET
    );
    console.log(CLIENT_ID);
    res.send(CLIENT_ID);
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Node cluster worker ${process.pid}: listening on port ${PORT}`
    );
  });
  module.exports = server;
}
