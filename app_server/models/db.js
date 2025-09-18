const mongoose = require("mongoose");

// Database URI
const dbURI = "mongodb://localhost/Loc8r";

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connection successful
mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

// Connection error handling
mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

// Disconnection handler
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Graceful shutdown function
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// Nodemon restart
process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () => {
    process.kill(process.pid, "SIGUSR2");
  });
});

// App termination (e.g., Ctrl+C)
process.on("SIGINT", () => {
  gracefulShutdown("app termination (SIGINT)", () => {
    process.exit(0);
  });
});

// Heroku app termination
process.on("SIGTERM", () => {
  gracefulShutdown("Heroku app shutdown (SIGTERM)", () => {
    process.exit(0);
  });
});
