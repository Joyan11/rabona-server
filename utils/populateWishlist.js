const express = require("express");
const { Wishlist } = require("../models/wishlist.model");

const populateWishlist = async (userid)=> await Wishlist.findOne({user:userid}).populate("products.productId");

module.exports = {populateWishlist}