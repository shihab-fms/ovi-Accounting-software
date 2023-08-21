const mongoose = require('mongoose');

const Ledger = require('./../model/ledgerModel');
const handleFactory = require('./../controller/handleFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const Payment = require('./../model/paymentModel');
const Purchase = require('./../model/purchaseModel');

const ObjectId = mongoose.Types.ObjectId;

exports.createLedger = handleFactory.createOne(Ledger);
exports.updateLedger = handleFactory.updateOne(Ledger);
exports.getAllLedger = handleFactory.getAll(Ledger);
exports.getLedger = handleFactory.getOne(Ledger);
exports.deleteLedger = handleFactory.deleteOne(Ledger);

exports.getInfo = catchAsync(async (req, res, next) => {
  const payments = await handleFactory.getPaymentinfo(
    Payment,
    req.params.branchId,
    req.params.ledgerId
  );

  const purchases = await handleFactory.getPurchaseInfo(
    Purchase,
    req.params.branchId,
    req.params.ledgerId
  );

  const { branchId, from, to } = req.body;
  const ledger = await Ledger.find();

  const pay = [];

  const data = ledger.map(async (el) => {
    return await handleFactory.getPaymentinfo(
      Payment,
      branchId,
      el.id,
      from,
      to
    );
  });

  // console.log( data);

  res.status(200).json({
    status: 'success',
    payment: pay,
  });
});

// const payments = [];
// ledgers
//   .map(async (el) => {
//     const data = await handleFactory.getPaymentinfo(
//       Payment,
//       req.params.branchId,
//       el.id
//     );
//     payments.push(data);
//   })
//   .filter((el) => !el == 0);

// const purchases = [];
// ledgers.map(async (el) => {
//   const data = await handleFactory.getPurchaseInfo(
//     Purchase,
//     req.params.branchId,
//     el.id
//   );
//   purchases.push(data);
// });
