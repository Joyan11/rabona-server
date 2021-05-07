const express = require("express");
const router = express.Router();
const { Cart } = require("../models/cart.model");
const {populateCart} = require("../utils/populateCart")

router.route("/")
  .get(async (req, res) => {
    try {
      const data = await Cart.find({});
      if (!data) {
        res.status(400).json({ success: false, messaage: "Items not found" })
      } else {
        res.json({ success: true, cartData: data })
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal Server Error" })
    }
  })
  .post(async (req, res) => {
    try {
      const products = req.body;
      const NewCart = new Cart(products);
      const savedCartItem = await NewCart.save();
      const data = await populateCart(savedCartItem._id)
      res.status(201).json({ success: true, cartItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Cart", errorMessage: error.message })
    }
  })

router.route("/:cartid")
  .get(async (req, res) => {
    try {
      const { cartid } = req.params;
      const data = await populateCart(cartid)
      if (!data) {
        res.status(400).json({ success: false, message: "Cart is empty", errorMessage: error.message });
      }
      res.status(200).json({ success: true, cartItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "unable to get products", errorMessage: error.message })
    }

  })
  .post(async (req, res) => {
    try {
      const { products } = req.body;
      const { cartid } = req.params;
      await Cart.findByIdAndUpdate(cartid, { $addToSet: { products: products } }
      );
      const data = await populateCart(cartid)
      res.status(201).json({ success: true, cartItems: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "unable to add products to cart", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { cartid } = req.params;
      await Cart.findByIdAndRemove({ _id: cartid })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false,message:"Unable to delete the product", errorMessage: error.message })
    }
  })


router.route("/:cartid/:productid")
  .post(async (req, res) => {
    try {
      const { cartid, productid } = req.params;
      const { type } = req.body;
      await Cart.findById(cartid).updateOne({ "products._id": productid }, type === "inc" ? { $inc: { "products.$.quantity": 1 } } : { $inc: { "products.$.quantity": -1 } }
      );

      const data = await populateCart(cartid)
      res.status(201).json({ success: true, cartItems: data })
    } catch (error) {
      res.status(500).json({ status: false,message:"Unable to update the quantity", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { cartid, productid } = req.params;
      await Cart.findByIdAndUpdate(cartid, { $pull: { products: { _id: productid } } }
      );
      const data = await populateCart(cartid)
      res.status(200).json({ success: true, cartItems: data })
    } catch (error) {
      res.status(500).json({ success: false,message:"Unable to delete cart", errorMessage: error.message })
    }

  })


module.exports = router;