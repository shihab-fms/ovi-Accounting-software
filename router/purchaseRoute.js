const express = require('express');

const purchase = require('./../controller/purchaseController');

const Router = express.Router();

Router.route('/createOne').post(purchase.setUpdateBody, purchase.create);
Router.route('/getOne/:id').get(purchase.getOne);
Router.route('/getAll').get(purchase.getAll);
Router.route('/updateOne/:id').patch(purchase.setUpdateBody, purchase.update);
Router.route('/deleteOne/:id').delete(purchase.delete);

module.exports = Router;
