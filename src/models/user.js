const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  cnic: { type: String, unique: true },
  city : {type: String, required:true },
  contact_number1: { type: String },
  password: { type: String, required: true },
  contact_number2: { type: String },
  contact_address_comm: { type: String },
  contact_address_permanent: { type: String },
  email: { type: String, unique: true },
  username: { type: String, unique: true, required: true },
  active: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
  promo_code: { type: String },
  role: { type: String, enum: ['buyer', 'seller', "both"] },
  language:{type:String, enum:["urdu", "english"]}

});

module.exports = mongoose.model(`user`, userSchema, `users`);
