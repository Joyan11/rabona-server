const express = require("express");
const router = express.Router();
const { Cart } = require("../models/cart.model");
const { populateCart } = require("../utils/populateCart");


router.route("/")
  .get(async (req, res) => {
    try {
      const { userid } = req.user;
      const data = await populateCart(userid);
      if (!data) {
        res.status(404).json({ success: false, message: "Items not found" })
      } else {
        res.status(200).json({ success: true, cartData: data })
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Internal Server Error" })
    }
  })
  .post(async (req, res) => {
    try {
      const { products } = req.body;
      const { userid } = req.user;
      console.log("cart api 1")
      const NewCart = new Cart({ user: userid, products });
      const savedCartItem = await NewCart.save();
      const data = await populateCart(savedCartItem.user);
      res.status(201).json({ success: true, cartItems: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Cart", errorMessage: error.message })
    }
  })


router.route("/:cartid")
  .get(async (req, res) => {
    try {
      const { userid } = req.user;
      
      const data = await populateCart(userid)
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
      const { userid } = req.user;
       console.log("cart api 2")
      await Cart.findOneAndUpdate({ user: userid }, { $addToSet: { products: products } }
      );
      const data = await populateCart(userid)
      res.status(201).json({ success: true, cartItems: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "unable to add products to cart", errorMessage: error.message })
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


router.route("/:cartid/:productid")
  .post(async (req, res) => {
    try {
      const { productid } = req.params;
      const { type } = req.body;
      const { userid } = req.user;
      await Cart.findOne({ user: userid }).updateOne({ "products._id": productid }, type === "inc" ? { $inc: { "products.$.quantity": 1 } } : { $inc: { "products.$.quantity": -1 } }
      );
      const data = await populateCart(userid)
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
      const data = await populateCart(userid)
      res.status(200).json({ success: true, cartItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete cart", errorMessage: error.message })
    }

  })

module.exports = router;