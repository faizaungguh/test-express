const User = require("../models/userModel"),
  catchAsync = require("../utils/catchAsync"),
  AppError = require("../utils/appError"),
  { JWT_KEY } = require("../configs"),
  { sign } = require("jsonwebtoken");

const signToken = (id) => {
  return sign({ id }, JWT_KEY, {
    expiresIn: "25m",
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //** 1) check if email & password is exist */
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //** 2) check if user exist && password is correct */
  const user = await User.findOne({ email }).select("+password");
  const correct = await user.correctPassword(password, user.password);
  // (await user.correctPassword(password, user.password))
  if (!user || !correct) {
    return next(new AppError("Incorect email or password", 401));
  }

  //** 3) if everything OK, send token to client */
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protected = catchAsync(async (req, res, next) => {
  //** 1) Getting token and check of it's there */
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  //** 2) Verification token */

  //** 3) Check if user still exists */

  //** 4) Check if user changed password after the token was issued */

  next();
});
