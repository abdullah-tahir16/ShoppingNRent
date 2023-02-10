const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  timeLogs: { type: [Date] },
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model(`administrator`, adminSchema, `administrators`);
