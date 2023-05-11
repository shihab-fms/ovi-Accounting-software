const Purchase = require('./../model/purchaseModel');
const handleFactory = require('./handleFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.setUpdateBody = (req, _, next) => {
  if (!req.body.purchases) return next();

  req.body.purchases.map((el) => (el.totalAmount = el.rate * el.quantity * 1));

  if (!req.body.summeryAmount)
    req.body.summeryAmount = req.body.purchases.reduce(
      (acc, el) => acc + el.totalAmount * 1,
      0
    );

  next();
};

exports.create = handleFactory.createOne(Purchase);
exports.getOne = handleFactory.getOne(Purchase);
exports.getAll = handleFactory.getAll(Purchase);
exports.delete = handleFactory.deleteOne(Purchase);

exports.update = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.findByIdAndUpdate(req.body.id, {
    $set: {
      purchases: req.body.purchases,
      date: req.body.date,
      summeryAmount: req.body.summeryAmount,
    },
  });

  res.status(200).json({
    status: 'success',
    purchase,
  });
});
