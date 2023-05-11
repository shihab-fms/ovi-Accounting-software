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

exports.getPurchaseinfo = async (
  Model,
  productId,
  from = null,
  to = new Date(Date.now())
) => {
  const purchase = await Model.aggregate([
    {
      $match: {
        date: { $gte: new Date(from), $lte: new Date(to) },
        purchases: {
          $elemMatch: {
            name: new ObjectId(productId),
          },
        },
      },
    },
    //    {
    //   $lookup: {
    //     from: 'branches',
    //     localField: 'branch',
    //     foreignField: '_id',
    //     as: 'branch'
    //   }
    // },
    // {
    //   $lookup: {
    //     from: 'products',
    //     localField: 'payment.productName',
    //     foreignField: '_id',
    //     as: 'payment.productName'
    //   }
    // },
    {
      $project: {
        purchases: '$purchases',
        date: '$date',
      },
    },
  ]);
  // console.log(purchase);
  const filterPay = purchase.map((el) => {
    return {
      ...el,
      purchases: el.purchases.filter((el) => el.name == productId),
      summeryAmount: el.purchases
        .filter((el) => el.name == productId)
        .reduce((acc, el) => acc + el.totalAmount, 0),
    };
  });

  // filterPay.populate

  return filterPay;
};


exports.getSellinfo = async (
  Model,
  productId,
  from = null,
  to = new Date(Date.now())
) => {
  const sell = await Model.aggregate([
    {
      $match: {
        date: { $gte: new Date(from), $lte: new Date(to) },
        sells: {
          $elemMatch: {
            name: new ObjectId(productId),
          },
        },
      },
    },
    {
      $project: {
        sells: '$sells',
        date: '$date',
      },
    },
  ]);
  // console.log(sell);
  const filterPay = sell.map((el) => {
    return {
      ...el,
      sells: el.sells.filter((el) => el.name == productId),
      summeryAmount: el.sells
        .filter((el) => el.name == productId)
        .reduce((acc, el) => acc + el.totalAmount, 0),
    };
  });

  return filterPay;
};
