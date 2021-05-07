const express = require("express");
const { Wishlist } = require("../models/wishlist.model");

const populateWishlist = async (wishid)=> await Wishlist.findById(wishid).populate("products.productId");

module.exports = {populateWishlist}