const express = require("express");
const router = express.Router();
const { Wishlist } = require("../models/wishlist.model");
const {populateWishlist} = require("../utils/populateWishlist")

router.route("/")
  .get(async (req, res) => {
    try {
      const data = await Wishlist.find({});
      res.status(200).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error", errorMessage: errorMessage.message })
    }
  })
  .post(async (req, res) => {
    try {
      const products = req.body;
      const NewWishlist = new Wishlist(products);
      const savedWishItem = await NewWishlist.save();
      const data = await populateWishlist(savedWishItem._id);
     
      res.status(201).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Wishlist", errorMessage: error.message })
    }
  })

router.route("/:wishid")
  .get(async (req, res) => {
    try {
      const { wishid } = req.params;
      const data = await populateWishlist(wishid);
      res.status(200).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "unable to get products", errorMessage: error.message })
    }

  })
  .post(async (req, res) => {
    try {
      const { products } = req.body;
      const { wishid } = req.params;
      await Wishlist.findByIdAndUpdate(wishid, { $addToSet: { products: products } }
      );
      const data = await populateWishlist(wishid);

      res.status(201).json({ success: true, wishlistItems: data });
    } catch (error) {
      res.status(500).json({ success: false, message: "unable to add products to wishlist", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { wishid } = req.params;
      console.log(wishid)
      await Wishlist.findByIdAndRemove({ _id: wishid })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete item from wishlist", errorMessage: error.message })
    }
  })



router.route("/:wishid/:productid")
  .delete(async (req, res) => {
    try {
      const { wishid, productid } = req.params;
      await Wishlist.findByIdAndUpdate(wishid, { $pull: { products: { _id: productid } } }
      );
      const data = await populateWishlist(wishid);
      res.status(200).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete wishlist", errorMessage: error.message })
    }

  })


module.exports = router;