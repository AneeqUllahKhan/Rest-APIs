const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  phone_number: String,
  dob: String,
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = function (err, data) {
  if (err) {
    console.log(err);
  } else {
    let token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    this.save();
    return token;
  }
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
