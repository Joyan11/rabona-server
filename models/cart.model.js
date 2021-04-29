const mongoose = require("mongoose");
const { Product } = require("./product.model");
const { Schema } = mongoose;

const CartSchema = new Schema(({
  products: [{_id:String,productId:{ type: Schema.Types.ObjectId, ref: 'Product'},quantity:Number}]
}))



const Cart = mongoose.model("Cart",CartSchema);
module.exports = { Cart }