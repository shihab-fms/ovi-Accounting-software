const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError.js');
const handleFactory = require('./../controller/handleFactory');

// Get All User From Database
exports.getAllUser = handleFactory.getAll(User);
exports.getOneUser = handleFactory.getOne(User);
exports.updateOneUser = handleFactory.updateOne(User);
exports.deleteOneUser = handleFactory.deleteOne(User);
