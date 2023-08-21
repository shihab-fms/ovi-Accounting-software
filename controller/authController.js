const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED,
  });
};

const createJWT = (user, statusCode, res) => {
  const token = signJWT(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.sucure = true;

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      data: user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  createJWT(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 404));

  const user = await User.findOne({ email }).select('+password');

  if (!user)
    return next(new AppError('invalid email! please provide correct one', 404));

  const correctPassword = await user.loginCorrectPassword(
    password,
    user.password
  );

  if (!correctPassword)
    return next(
      new AppError('invalid password! please provide correct one', 404)
    );

  createJWT(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});

// exports.isloggedIn

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log(token);
  if (!token)
    return next(
      new AppError('you are not logged in. Please log in again!', 401)
    );

  // console.log(token);
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decode);

  // if(User)

  const frashUser = await User.findById(decode.id);
  if (!frashUser)
    return next(new AppError('invalid user. Please Log in again!', 401));

  if (frashUser.chandedPasswordAfter(decode.iat))
    return next(
      new AppError(
        'you recently changed your password please log in again!',
        401
      )
    );
  // console.log(frashUser)

  req.user = frashUser;
  res.locals.user = frashUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req)
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );

    next();
  };
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1) Verify jwt token
    try {
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Checking user is exist

      const frashUser = await User.findById(decode.id);
      if (!frashUser) return next();

      // 3) checking is user changed his password
      if (frashUser.chandedPasswordAfter(decode.iat)) return next();

      // 4) Setting user at Browser
      res.locals.user = frashUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
