const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  firstname: { type: String, required: [true, "Please enter firstname"] },
  lastname: { type: String, required: [true, "Please enter lastname"] },
  email: { type: String, required: [true, "Please enter email"]},
  password: { type: String, required: ["true", 'Please enter password'] }
})

const User = mongoose.model("User", UserSchema);

module.exports = { User };