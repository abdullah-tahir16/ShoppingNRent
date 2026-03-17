require("dotenv").config();
const app = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");
const port = Number.parseInt(process.env.PORT, 10) || 5005;
let server;

async function startServer() {
  try {
    await connectDatabase(process.env.DATABASE);

    console.log("Database connected");

    server = app.listen(port, () => {
      console.log(`Service started on port: ${port}`);
    });
  } catch (error) {
    console.error(`Database connection failed - ${error.message}`);
    process.exit(1);
  }
}

async function shutdown(signal) {
  try {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error(`Shutdown failed - ${error.message}`);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
