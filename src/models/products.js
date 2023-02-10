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
  other_information:{type:String},
  reference_id:{type:String},
  deleted:{type:Boolean , default:false},
  details: {type:String , },
  created_by:{type: Schema.Types.ObjectId, ref:"user"},
  category:{type:String,},
  condition:{type:String},
  make:{type:String},


});

module.exports = mongoose.model(`products`, productSchema, `product`);
