const mongoose = require("mongoose");
const { Product } = require("./product.model");
const { Schema } = mongoose;
const { User } = require("./users.model")

const WishlistSchema = new Schema(({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  products: [{ _id: String, productId: { type: Schema.Types.ObjectId, ref: 'Product' } }]
}))


const Wishlist = mongoose.model("Wishlist", WishlistSchema);
module.exports = { Wishlist }