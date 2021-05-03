const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model");
const { productList } = require("../data")

router.route("/")
  .get(async (req, res) => {
    try {
      const data = await Product.find({});
      res.status(200).json({ success: true, productdata: data });
    } catch (error) {
      res.status(404).json({ success: false, message: "The server can not find the requested resource.", error: error.message })
    }
  })



module.exports = router