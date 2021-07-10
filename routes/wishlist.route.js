const express = require("express");
const router = express.Router();
const { Wishlist } = require("../models/wishlist.model");
const { populateWishlist } = require("../utils/populateWishlist")

const addToWish = async (req, res, next) => {
  try {
    const { products } = req.body;
    const { userid } = req.user;
    const wishExist = await Wishlist.findOne({ user: userid });
    if (wishExist) {
      await Wishlist.findOneAndUpdate({ user: userid }, { $addToSet: { products: products } }
      );
      return next()
    } else {
      const NewWishlist = new Wishlist({ user: userid, products });
    await NewWishlist.save();
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
      const data = await populateWishlist(userid);
       data.__v = undefined;
      if (!data) {
        res.status(404).json({ success: false, messaage: "Items not found" })
      } else {
        res.status(200).json({ success: true, wishlistItems: data })
      }

    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error", errorMessage: errorMessage.message })
    }
  })
  .post(addToWish,async (req, res) => {
    try {
      const { userid } = req.user;
      const data = await populateWishlist(userid);
       data.__v = undefined;
      res.status(201).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Wishlist", errorMessage: error.message })
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



router.route("/:productid")
  .delete(async (req, res) => {
    try {
      const { productid } = req.params;
      const { userid } = req.user;
      await Wishlist.findOneAndUpdate({ user: userid }, { $pull: { products: { _id: productid } } }
      );
      const data = await populateWishlist(userid);
       data.__v = undefined;
      res.status(200).json({ success: true, wishlistItems: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete wishlist", errorMessage: error.message })
    }
  })


module.exports = router;