const mongoose = require("mongoose");
const {Schema} = mongoose;
const {productList} = require("../data")
const ProductSchema = new Schema({
    image:String,
    name: String,
    price: Number,
    stock: String,
    delivery:String,
    club: String,
    type: String,
    brand: String,
})

const Product = mongoose.model("Product",ProductSchema);

module.exports = {Product};