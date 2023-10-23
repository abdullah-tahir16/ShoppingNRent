const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  cnic: { type: String, unique: true },
  city: { type: String, required: true },
  contactNumber1: { type: String }, // Use camelCase for field name
  password: { type: String, required: true },
  contactNumber2: { type: String }, // Use camelCase for field name
  contactAddressComm: { type: String }, // Use camelCase for field name
  contactAddressPermanent: { type: String }, // Use camelCase for field name
  email: { type: String, unique: true },
  username: { type: String, unique: true, required: true },
  active: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  promoCode: { type: String }, // Use camelCase for field name
  role: { type: String, enum: ["buyer", "seller", "both"] },
  language: { type: String, enum: ["urdu", "english"] },
});

module.exports = mongoose.model("user", userSchema, "users");
