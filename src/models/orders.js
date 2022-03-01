const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  name: { type: String , required:true,},
  address: { type: String, required:true,},
  description: { type: String },
  ordered_by:{type: Schema.type.Object_Id, ref:"user"},
  seller:{type: Schema.type.Object_Id, ref:"user"},
  active: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
  products:[{type: Schema.type.Object_Id , ref:"products"}],

  order_status:{type:String, required :true , enum: ["approved", "dispatched", "delivered"]},

  // generated id for user reference
  reference_id : mongoose.Types.ObjectId,
  //product and order discount both can be given
  discount: { type: Number },

  // can be rent or sold
  category:{type:String, required:true, enum: [ 'sold', "rented"]},
  total_price: {type: Number, required:true, min: { type: Number, min: 1 } },
});

module.exports = mongoose.model(`order`, orderSchema, `orders`);
