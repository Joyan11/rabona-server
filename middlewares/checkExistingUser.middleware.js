const { User } = require("../models/users.model");


const emailVerify = async (email)=> await User.findOne({ email: email });


const checkExistingUser = async (req, res, next) => {
  try {
    const { user } = req.body;
    const emailExist = await emailVefify(user.email)
    if (emailExist) {
      res.status(409).json({ success: false, message: "User already exist" })
      return next();
    }
    req.userdata = user;
    return next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {checkExistingUser,emailVerify}