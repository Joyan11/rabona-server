const express = require("express");
const { Cart } = require("../models/cart.model");

const populateCart = async (userid)=> await Cart.findOne({user:userid}).populate("products.productId");
console.log("running")
module.exports = {populateCart}