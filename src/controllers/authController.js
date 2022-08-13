const User = require("../models/userModel"),
  catchAsync = require("../utils/catchAsync"),
  {} = require("jsonwebtoken");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
});

exports.login = catchAsync();
