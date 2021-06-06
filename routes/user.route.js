const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mySecret = process.env['TOKEN_KEY'];
const { User } = require("../models/users.model");

const checkExistingUser = async (req, res, next) => {
  try {
    const { user } = req.body;
    const emailExist = await User.findOne({ email: user.email });
    if (emailExist) {
      res.status(409).json({ success: false, message: "User already exist" })
      return next()
    }
    req.userdata = user;
    return next();
  } catch (error) {
    console.log(error);
  }
}

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
    next();
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



module.exports = router;