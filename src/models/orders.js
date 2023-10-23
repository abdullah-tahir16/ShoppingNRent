const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  ordered_by: { type: Schema.Types.ObjectId, ref: "user" },
  seller: { type: Schema.Types.ObjectId, ref: "user" },
  active: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  product: [{ type: Schema.Types.ObjectId, ref: "product" }], // Use "product" instead of "products"

  order_status: {
    type: String,
    required: true,
    enum: ["approved", "dispatched", "delivered"],
  },

  // generated id for user reference
  reference_id: mongoose.Types.ObjectId,
  // product and order discount both can be given
  discount: { type: Number },

  // can be rent or sold
  category: { type: String, required: true, enum: ["sold", "rented"] },
  total_price: { type: Number, required: true, min: 1 },
});

module.exports = mongoose.model("order", orderSchema, "orders");
