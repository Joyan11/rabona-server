const mongoose = require("mongoose");
const { Product } = require("./product.model");
const { Schema } = mongoose;

const WishlistSchema = new Schema(({
  products: [{ _id: String, productId: { type: Schema.Types.ObjectId, ref: 'Product' } }]
}))


const Wishlist = mongoose.model("Wishlist", WishlistSchema);
module.exports = { Wishlist }