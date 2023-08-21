const PaymentType = require('./../model/typesOfPaymentModel');
const handleFactory = require('./handleFactory');

exports.createPaymentType = handleFactory.createOne(PaymentType);
exports.updatePaymentType = handleFactory.updateOne(PaymentType);
exports.getPaymentType = handleFactory.getOne(PaymentType);
exports.getAllPaymentType = handleFactory.getAll(PaymentType);
exports.deletePaymentType = handleFactory.deleteOne(PaymentType)
