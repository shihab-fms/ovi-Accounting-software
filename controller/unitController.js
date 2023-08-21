const Unit = require('.././model/unitModel');
const handleFactory = require('./handleFactory');

exports.createOne = handleFactory.createOne(Unit);
exports.getOne = handleFactory.getOne(Unit);
exports.getAll = handleFactory.getAll(Unit);
exports.updateOne = handleFactory.updateOne(Unit);
exports.deleteOne = handleFactory.deleteOne(Unit);
