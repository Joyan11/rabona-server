const express = require("express");
const { Cart } = require("../models/cart.model");

const populateCart = async (cartid)=> await Cart.findById(cartid).populate("products.productId");
console.log("running")
module.exports = {populateCart}