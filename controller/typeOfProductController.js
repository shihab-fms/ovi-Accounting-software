const TypeOfProduct = require('./../model/typeOfProductModel');
const handleFactory = require('./handleFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// exports.create = catchAsync(async (req, res, next) => {
//   const typeOf = await TypeOfProduct.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: typeOf,
//   });
// });

exports.create = handleFactory.createOne(TypeOfProduct);
exports.getOne = handleFactory.getOne(TypeOfProduct);
exports.getAll = handleFactory.getAll(TypeOfProduct);
exports.update = handleFactory.updateOne(TypeOfProduct);
exports.delete = handleFactory.deleteOne(TypeOfProduct);
