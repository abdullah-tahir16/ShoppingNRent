const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  description: { type: String },
  pictureLink: { type: String }, // Use camelCase for field name
  active: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  discount: { type: Number }, // If it's a numerical discount value
  otherInformation: { type: String }, // Use camelCase for field name
  referenceId: { type: String }, // Use camelCase for field name
  deleted: { type: Boolean, default: false },
  details: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  category: { type: String },
  condition: { type: String },
  make: { type: String },
});

module.exports = mongoose.model("product", productSchema, "products");
