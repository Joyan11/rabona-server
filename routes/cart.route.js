const express = require("express");
const router = express.Router();
const { Cart } = require("../models/cart.model");
const { populateCart } = require("../utils/populateCart");


const addToCart = async (req, res, next) => {
  try {
    const { products } = req.body;
    const { userid } = req.user;
    const cartExist = await Cart.findOne({ user: userid });
    if (cartExist) {
      await Cart.findOneAndUpdate({ user: userid }, { $addToSet: { products: products } }
      );
      return next();
    } else {
      const NewCart = new Cart({ user: userid, products });
      await NewCart.save();
      return next()
    }
  } catch (error) {
    console.log(error);
  }
}

router.route("/")
  .get(async (req, res) => {
    try {
      const { userid } = req.user;
      const data = await populateCart(userid);
       data.__v = undefined;
      if (!data) {
        res.status(404).json({ success: false, message: "Items not found" })
      } else {
        res.status(200).json({ success: true, cartData: data })
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal Server Error" })
    }
  })
  .post(addToCart, async (req, res) => {
    try {
      const { userid } = req.user;
      const data = await populateCart(userid);
       data.__v = undefined;
      res.status(201).json({ success: true, cartItems: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Cart", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { userid } = req.user;
      await Cart.findOneAndRemove({ user: userid })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete the product", errorMessage: error.message })
    }
  })


router.route("/:productid")
  .post(async (req, res) => {
    try {
      const { productid } = req.params;
      const { type } = req.body;
      const { userid } = req.user;
      await Cart.findOne({ user: userid }).updateOne({ "products._id": productid }, type === "inc" ? { $inc: { "products.$.quantity": 1 } } : { $inc: { "products.$.quantity": -1 } }
      );
      const data = await populateCart(userid);
       data.__v = undefined;
      res.status(201).json({ success: true, cartItems: data })
    } catch (error) {
      res.status(500).json({ status: false, message: "Unable to update the quantity", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { productid } = req.params;
      const { userid } = req.user;
      await Cart.findOneAndUpdate({ user: userid }, { $pull: { products: { _id: productid } } }
      );
      const data = await populateCart(userid);
       data.__v = undefined;
      res.status(200).json({ success: true, cartItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete cart", errorMessage: error.message })
    }

  })

module.exports = router;