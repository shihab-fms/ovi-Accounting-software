const handleFactory = require('./handleFactory');
const Item = require('.././model/itemModel');

exports.createOne = handleFactory.createOne(Item);
exports.getOne = handleFactory.getOne(Item);
exports.getAll = handleFactory.getAll(Item);
exports.updateOne = handleFactory.updateOne(Item);
exports.deleteOne = handleFactory.deleteOne(Item);
