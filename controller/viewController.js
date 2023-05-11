const TypeOf = require('./../model/typeOfProductModel');
const Product = require('./../model/productModel');
const Purchase = require('./../model/purchaseModel');
const Sell = require('./../model/sellModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.overview = catchAsync((req, res, next) => {
  res.status(200).render('overview', {
    title: 'Overview',
  });
});

exports.updateMe = catchAsync((req, res, next) => {
  res.status(200).render('editme', {
    title: 'Settings',
  });
});

// Purchase
exports.addPurchase = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('addPurchase', {
    title: 'Add Purchase',
    products,
  });
});

exports.searchpurchase = catchAsync(async (req, res, next) => {
  const purchases = await Purchase.find();
  res.status(200).render('searchpurchase', {
    title: 'Search Purchase',
    purchases,
  });
});

exports.editPurchase = catchAsync(async (req, res, next) => {
  const purchases = await Purchase.find();
  res.status(200).render('editPurchase', {
    title: 'Edit Purchase',
    purchases,
  });
});

exports.printPurchase = catchAsync(async (req, res, next) => {
  res.status(200).render('printPurchase', {
    title: 'Print Purchase',
  });
});

// sell

exports.addSell = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('addSell', {
    title: 'Add Sell',
    products,
  });
});

exports.searchSell = catchAsync(async (req, res, next) => {
  const sells = await Sell.find();
  res.status(200).render('searchSell', {
    title: 'Search Sell',
    sells,
  });
});

exports.editSell = catchAsync(async (req, res, next) => {
  const sells = await Sell.find();
  res.status(200).render('editSell', {
    title: 'Edit Sell',
    sells,
  });
});

exports.printSell = catchAsync(async (req, res, next) => {
  res.status(200).render('printSell', {
    title: 'Print Sell',
  });
});

// Product
exports.addProduct = catchAsync(async (req, res, next) => {
  const typeOf = await TypeOf.find();
  res.status(200).render('addProduct', {
    title: 'Add Product',
    typeOf,
  });
});

exports.allProduct = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('allProduct', {
    title: 'Search Product',
    products,
  });
});

exports.editProduct = catchAsync(async (req, res, next) => {
  res.status(200).render('editProduct', {
    title: 'edit Product',
  });
});

exports.searchProduct = catchAsync(async (req, res, next) => {
  res.status(200).render('searchProduct', {
    title: 'Search Product',
  });
});

exports.printProduct = catchAsync(async (req, res, next) => {
  res.status(200).render('printProduct', {
    title: 'Print Product',
  });
});

// Type of product

exports.addTypeOf = catchAsync(async (req, res, next) => {
  res.status(200).render('addTypeOf', {
    title: 'Add type of product',
  });
});

exports.searchTypeOf = catchAsync(async (req, res, next) => {
  const typeOfs = await TypeOf.find();
  res.status(200).render('searchTypeOf', {
    title: 'Search type of product',
    typeOfs,
  });
});

exports.editTypeOf = catchAsync(async (req, res, next) => {
  const typeOfs = await TypeOf.find();
  res.status(200).render('editTypeOf', {
    title: 'Edit type of product',
    typeOfs,
  });
});
