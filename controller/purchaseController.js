const catchAsync = require('../utils/catchAsync');
const Purchase = require('./../model/purchaseModel');
const handleFactory = require('./handleFactory');

exports.createOne = handleFactory.createOne(Purchase);
// exports.updateOne = handleFactory.updateOne(Purchase);
exports.getOne = handleFactory.getOne(Purchase);
exports.getAll = handleFactory.getAll(Purchase);
exports.deleteOne = handleFactory.deleteOne(Purchase);

exports.setUpdateBody = (req, _, next) => {
  if (!req.body) return next();

  req.body.items.map((el) => (el.total = el.rate * el.quantity).toFixed(2));

  if (!req.body.summeryAmount)
    req.body.summeryAmount = req.body.items
      .reduce((acc, el) => acc + el.total * 1, 0)
      .toFixed(2);
  next();
};

exports.updateOne = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.findByIdAndUpdate(req.params.id, {
    $set: {
      branch: req.body.branch,
      ladgerName: req.body.ladgerName,
      date: req.body.date,
      items: req.body.items,
      summeryAmount: req.body.summeryAmount,
    },
  });

  res.status(200).json({
    status: 'success',
    purchase,
  });
});


exports.getPurchaseInfoByLedger = catchAsync(async (req, res, next) => {
  const ledgerInfo = await handleFactory.getPurchaseInfo(
    Purchase,
    req.body.branch,
    req.body.ledger,
    req.body.from,
    req.body.to
  );

  // console.log(req.body.branch, req.body.ledger, req.body.from, req.body.to);

  if (!ledgerInfo)
    return next(
      new AppError('We do not found any payment on this request', 404)
    );

  res.status(200).json({
    status: 'success',
    data: ledgerInfo,
  });
});