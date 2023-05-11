const express = require('express');

const product = require('./../controller/productController');

const Router = express.Router();

Router.route('/createOne').post(product.create);
Router.route('/getOne/:id').get(product.getOne);
Router.route('/getAll').get(product.getAll);
Router.route('/updateOne/:id').patch(product.update);
Router.route('/deleteOne/:id').delete(product.delete);
Router.route('/productInfo').post(product.getPurchaseInfoByProduct);

module.exports = Router;
