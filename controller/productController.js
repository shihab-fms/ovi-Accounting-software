const Product = require('./../model/productModel');
const Purchase = require('./../model/purchaseModel');
const Sell = require('./../model/sellModel');
const handleFactory = require('./handleFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.create = handleFactory.createOne(Product);
exports.getOne = handleFactory.getOne(Product);
exports.getAll = handleFactory.getAll(Product);
exports.update = handleFactory.updateOne(Product);
exports.delete = handleFactory.deleteOne(Product);

exports.getPurchaseInfoByProduct = catchAsync(async (req, res, next) => {
  const productInfo = await handleFactory.getPurchaseinfo(
    Purchase,
    req.body.product,
    req.body.from,
    req.body.to
  );

  const sellInfo = await handleFactory.getSellinfo(
    Sell,
    req.body.product,
    req.body.from,
    req.body.to
  );

  const data = [...productInfo, ...sellInfo];

  // sorting by date
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  // if (!productInfo)
  //   return next(
  //     new AppError('We do not found any purchase on this request', 404)
  //   );

  res.status(200).json({
    status: 'success',
    data,
  });
});
