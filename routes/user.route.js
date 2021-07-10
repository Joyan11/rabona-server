const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { authVerify } = require("../middlewares/authVerify.middleware")
const { checkExistingUser, emailVerify } = require("../middlewares/checkExistingUser.middleware")
const mySecret = process.env['TOKEN_KEY'];
const { User } = require("../models/users.model");


router.route("/signup")
  .post(checkExistingUser, async (req, res) => {
    try {
      const user = req.userdata;
      const newUser = new User(user);
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      newUser.save().then((doc) => res.status(201).json({ success: true, message: "User created successfully" }));
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to Create New User", errorMessage: error.message })
    }
  })


const getUsername = async (req, res, next) => {
  try {
    const { email, password } = req.body.user;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const validPassword = await bcrypt.compare(password, userData.password);
      console.log("password validation", validPassword)
      if (validPassword) {
        req.user = userData;
        return next();
      }
    }
    res.status(401).json({ message: "username or password incorrect" });
  } catch (error) {
    console.log(error)
  }
}

router.route("/login")
  .post(getUsername, (req, res) => {
    const { _id, firstname, lastname, email } = req.user;
    const token = jwt.sign({
      userid: _id
    }, mySecret, { expiresIn: '24h' });
    res.status(200).json({ success: true, token: token, userdata: { _id: _id, firstname: firstname, lastname: lastname, email: email }, message: "User authenticated successfully" })
  })



const updateEmail = async (userid, email) => {
  try {
    const data = await User.findOneAndUpdate({_id:userid}, { email: email }, { new: true }).select("_id lastname firstname email");
    return data
  } catch (error) {
    console.log(error)
  }
}

router.route("/updateemail")
  .post(authVerify, async (req, res) => {
    try {
      const { email } = req.body;
      const { userid } = req.user;
      const emailExist = await emailVerify(email);
      if (emailExist) {
        if (emailExist._id === userid) {
          console.log("running")
          const data = await updateEmail(userid, email);
          res.status(200).json({ success: true, userdata: data });
        } else {
          res.status(409).json({ message: "email is already taken" })
        }
      } else {
        const data = await updateEmail(userid, email);
        res.status(200).json({ success: true, userdata: data });
      }
    } catch{
      res.status(500).json({ status: false, message: "Email could not be changed", errorMessage: error.message })
    }
  })

router.route("/changepassword")
  .post(authVerify, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const { userid } = req.user;
      const salt = await bcrypt.genSalt(10);
      const userData = await User.findOne({ _id: userid });
      const validPassword = await bcrypt.compare(oldPassword, userData.password);
      if (validPassword) {
        userData.password = await bcrypt.hash(newPassword, salt);
        userData.save().then((doc) => res.status(201).json({ success: true, message: "password changed successfully" }));
      } else {
        res.status(401).json({ message: "Password change failed" })
      }
    } catch{
      res.status(500).json({ status: false, message: "Email could not be changed", errorMessage: error.message })
    }
  })



module.exports = router;