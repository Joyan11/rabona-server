const express = require("express");
const router = express.Router();
const { Wishlist } = require("../models/wishlist.model");
const { populateWishlist } = require("../utils/populateWishlist")

router.route("/")
  .get(async (req, res) => {
    try {
      const { userid } = req.user;
      const data = await populateWishlist(userid);

      if (!data) {
        res.status(404).json({ success: false, messaage: "Items not found" })
      } else {
        res.status(200).json({ success: true, wishlistItems: data })
      }

    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error", errorMessage: errorMessage.message })
    }
  })
  .post(async (req, res) => {
    try {
      const { products } = req.body;
      const { userid } = req.user;
      console.log("wish api 1")
      const NewWishlist = new Wishlist({ user: userid, products });
      const savedWishItem = await NewWishlist.save();
      const data = await populateWishlist(savedWishItem.user);
      res.status(201).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Wishlist", errorMessage: error.message })
    }
  })

router.route("/:wishid")
  .get(async (req, res) => {
    try {
      const { userid } = req.user;
      const data = await populateWishlist(userid);
      res.status(200).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "unable to get products", errorMessage: error.message })
    }

  })
  .post(async (req, res) => {
    try {
      const { products } = req.body;
      const { userid } = req.user;
      console.log("wish api 2")
      await Wishlist.findOneAndUpdate({ user: userid }, { $addToSet: { products: products } }
      );
      const data = await populateWishlist(userid);

      res.status(201).json({ success: true, wishlistItems: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "unable to add products to wishlist", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { userid } = req.user;
      await Wishlist.findOneAndRemove({ user: userid })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete item from wishlist", errorMessage: error.message })
    }
  })



router.route("/:wishid/:productid")
  .delete(async (req, res) => {
    try {
      const { productid } = req.params;
      const { userid } = req.user;
      await Wishlist.findOneAndUpdate({ user: userid }, { $pull: { products: { _id: productid } } }
      );
      const data = await populateWishlist(userid);
      res.status(200).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete wishlist", errorMessage: error.message })
    }
  })


module.exports = router;