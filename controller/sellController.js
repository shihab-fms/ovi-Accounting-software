const Sell = require('./../model/sellModel');
const handleFactory = require('./handleFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.setUpdateBody = (req, _, next) => {
  if (!req.body.sells) return next();

  req.body.sells.map((el) => (el.totalAmount = el.rate * el.quantity * 1));

  if (!req.body.summeryAmount)
    req.body.summeryAmount = req.body.sells.reduce(
      (acc, el) => acc + el.totalAmount * 1,
      0
    );

  next();
};

exports.create = handleFactory.createOne(Sell);
exports.getOne = handleFactory.getOne(Sell);
exports.getAll = handleFactory.getAll(Sell);
exports.delete = handleFactory.deleteOne(Sell);

exports.update = catchAsync(async (req, res, next) => {
  const sell = await Sell.findByIdAndUpdate(req.params.id, {
    $set: {
      sells: req.body.sells,
      date: req.body.date,
      summeryAmount: req.body.summeryAmount,
    },
  });

  res.status(200).json({
    status: 'success',
    sell,
  });
});
