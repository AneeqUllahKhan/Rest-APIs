const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = (err, data, next) => {
  if (err) {
    console.log(err);
  } else {
    const token = data.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    const user = User.findOne({ _id: verifyUser._id });
    next();
  }
};

module.exports = auth;
