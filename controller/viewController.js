const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const sessionStorage = require('sessionstorage-for-nodejs');

const User = require('./../model/userModel');
const Ledger = require('./../model/ledgerModel');
const Purchase = require('./../model/purchaseModel');
const Payment = require('./../model/paymentModel');
const Branch = require('./../model/branchModel');
const Item = require('./../model/itemModel');
const Unit = require('./../model/unitModel');
const TypeOfLedger = require('./../model/typesOfPaymentModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handleFactory = require('./../controller/handleFactory');

exports.getOverview = (req, res, next) => {
  res.status(200).render('overview', {
    title: 'Overview',
  });
};

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Sign In',
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signUp', {
    title: 'Sign Up',
  });
};

// router controller for Payment
exports.addPayment = catchAsync(async (req, res, next) => {
  // 1) Get nesseary Data
  const branchs = await Branch.find();
  const ledgers = await Ledger.find();

  // 2) Sending data to Fontend

  res.status(200).render('addPayment', {
    title: 'Add Payment',
    branchs,
    ledgers,
  });
});

exports.searchPayment = catchAsync(async (req, res, next) => {
  // 1) Get nesseary Data
  const payments = await Payment.find().sort({ data: 1 });

  payments.sort((a, b) => b.date - a.date);

  // 2) Sending data to Fontend
  res.status(200).render('searchPayment', {
    title: 'Search Payment History',
    payments,
  });
});

exports.viewPayment = catchAsync(async (req, res, next) => {
  res.status(200).render('viewPayment', {
    title: `view| from payment `,
  });
});

exports.printPayment = catchAsync(async (req, res, next) => {
  res.status(200).render('printPayment', {
    title: `view| print payment `,
  });
});

// router controller for Purchase
exports.addPurchase = catchAsync(async (req, res, next) => {
  // 1) Get nesseary Data
  const branchs = await Branch.find();
  const ledgers = await Ledger.find();
  const items = await Item.find();
  const units = await Unit.find();

  // 2) Sending data to Fontend

  res.status(200).render('addPurchase', {
    title: 'Add Purchase',
    branchs,
    ledgers,
    items,
    units,
  });
});

exports.searchPurchase = catchAsync(async (req, res, next) => {
  // 1) Get nesseary Data
  const purchases = await Purchase.find().sort({ data: 1 });

  purchases.sort((a, b) => b.date - a.date);

  // 2) Sending data to Fontend
  res.status(200).render('searchPurchase', {
    title: 'Search Purchase History',
    purchases,
  });
});

exports.viewPurchase = catchAsync(async (req, res, next) => {
  res.status(200).render('viewPurchase', {
    title: `view| from Purchase `,
  });
});

exports.printPurchase = catchAsync(async (req, res, next) => {
  res.status(200).render('printPurchase', {
    title: `view| print Purchase `,
  });
});

// route controller for Ledger
exports.addLedger = catchAsync(async (req, res, next) => {
  const typeOf = await TypeOfLedger.find();

  res.status(200).render('addLedger', {
    title: `Add new Party `,
    typeOf,
  });
});

exports.allLedger = catchAsync(async (req, res, next) => {
  const ledgers = await Ledger.find();

  res.status(200).render('allLedger', {
    title: `View Party `,
    ledgers,
  });
});

exports.editLedger = catchAsync(async (req, res, next) => {
  res.status(200).render('editLedger', {
    title: `Edit| from ledger `,
  });
});

exports.searchLedger = catchAsync(async (req, res, next) => {
  const branchs = await Branch.find();
  const ledgers = await Ledger.find();

  res.status(200).render('searchLedger', {
    title: 'Search Party',
    branchs,
  });
});

exports.viewLedger = catchAsync(async (req, res, next) => {
  res.status(200).render('viewLedger', {
    title: 'View Party',
  });
});

exports.printLedger = catchAsync(async (req, res, next) => {
  res.status(200).render('printLedger', {
    tilte: 'Printing Party information',
  });
});

// Branch route controller

exports.addBranch = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).render('addBranch', {
    title: 'Add Branch',
    users,
  });
});

exports.searchBranch = catchAsync(async (req, res, next) => {
  // 1) Getting All Branch information for Render Branch select option
  const branchs = await Branch.aggregate([
    {
      $project: {
        branchName: '$name',
      },
    },
  ]);

  if (!branchs) return next(new AppError('Sorry we dont find data', 404));

  // 2) Sending data to fontend
  res.status(200).render('searchBranch.pug', {
    title: 'Find branch info',
    branchs,
  });
});

exports.allBranch = catchAsync(async (req, res, next) => {
  const branchs = await Branch.find();

  res.status(200).render('allBranch', {
    title: 'All Branch',
    branchs,
  });
});

exports.editBranch = catchAsync(async (req, res, next) => {
  res.status(200).render('editBranch', {
    title: 'Edit Branch',
  });
});

exports.viewBranchReport = catchAsync(async (req, res, next) => {
  res.status(200).render('viewBranchReport', {
    title: 'View Branch Report',
  });
});

exports.printBranchReport = catchAsync(async (req, res, next) => {
  res.status(200).render('printBranchReport', {
    title: 'Printing Branch Report',
  });
});


// Settings
exports.settings = catchAsync(async (req, res, next) => {
  res.status(200).render('settings', {
    title: 'Settings',
  });
});
