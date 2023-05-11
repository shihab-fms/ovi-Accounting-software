const express = require('express');

const userController = require('./../controller/userController');
const viewController = require('./../controller/viewController');

const Router = express.Router();

Router.use(userController.isLoggedIn);

Router.route('/').get(viewController.overview);
Router.route('/settings').get(viewController.updateMe);

// Purchase
Router.get('/addPurchase', viewController.addPurchase);
Router.get('/searchpurchase', viewController.searchpurchase);
Router.get('/editPurchase', viewController.editPurchase);
Router.get('/printPurchase', viewController.printPurchase);

// Sell Route
Router.get('/addSell', viewController.addSell);
Router.get('/searchSell', viewController.searchSell);
Router.get('/editSell', viewController.editSell);
Router.get('/printSell', viewController.printSell);

// Product Route
Router.get('/addProduct', viewController.addProduct);
Router.get('/allProduct', viewController.allProduct);
Router.get('/editProduct', viewController.editProduct);
Router.get('/searchProduct', viewController.searchProduct);
Router.get('/printProduct', viewController.printProduct);

// type of product Route
Router.get('/addTypeOf', viewController.addTypeOf);
Router.get('/searchTypeOf', viewController.searchTypeOf);
Router.get('/editTypeOf', viewController.editTypeOf);

module.exports = Router;
