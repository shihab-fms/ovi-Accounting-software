const mongoose = require('mongoose');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const ObjectId = mongoose.Types.ObjectId;

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find();

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) return next(new AppError('there is no doc with this name', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(new AppError('We dont find document with this id', 404));

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError('there is no document with this id', 404));

    res.status(204).json({
      status: 'success',
      message: 'document deleted successfully',
      data: null,
    });
  });

// get some data manipulation

exports.getPaymentinfo = async (
  Model,
  branchId = null,
  ledgerId,
  from = null,
  to = new Date(Date.now())
) => {
  let queryMatch = {
    payment: {
      $elemMatch: {
        ledgerName: ObjectId(ledgerId),
      },
    },
  };
  if (branchId) queryMatch.branch = ObjectId(branchId);
  if (from) queryMatch.date = { $gte: new Date(from), $lte: new Date(to) };

  // console.log(queryMatch);
  const payments = await Model.aggregate([
    {
      $match: queryMatch,
    },
    {
      $project: {
        payments: '$payment',
        date: '$date',
        branch: '$branch',
      },
    },
  ]);

  const filterPay = payments.map((el) => {
    return {
      ...el,
      payments: el.payments.filter((el) => el.ledgerName == ledgerId),
      summeryAmount: el.payments
        .filter((el) => el.ledgerName == ledgerId)
        .reduce((acc, el) => acc + el.amount, 0),
    };
  });

  return filterPay;
};

exports.getPurchaseInfo = async function (
  Model,
  branchId,
  ledgerId,
  from = null,
  to = new Date(Date.now())
) {
  let queryMatch = {
    ladgerName: ObjectId(ledgerId),
  };

  if (branchId) queryMatch.branch = ObjectId(branchId);
  if (from) queryMatch.date = { $gte: new Date(from), $lte: new Date(to) };
  let data = await Model.aggregate([
    {
      $match: queryMatch,
    },
    {
      $project: {
        ledgerName: '$ladgerName',
        date: '$date',
        total: '$summeryAmount',
        items: '$items',
        branch: '$branch',
      },
    },
    {
      $lookup: {
        from: 'Ledger', // The name of the collection to join with
        localField: 'ladgerName', // The field in the Model collection
        foreignField: '_id', // The field in the Ledger collection
        as: 'ledgerData', // The name of the output array field
      },
    },
  ]);

  return data;
};
