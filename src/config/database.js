const mongoose = require("mongoose");

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("DATABASE environment variable is required");
  }

  return mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
