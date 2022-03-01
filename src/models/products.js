const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String , required:true,},
  price: { type: String, required:true,},
  city: { type: String, required:true,},
  description: { type: String },
  picture_link: { type: String },
  active: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
  discount: { type: String },
  stock:{type:Number, required:true, min: { type: Number, min: 0 }},
});

module.exports = mongoose.model(`products`, productSchema, `product`);
