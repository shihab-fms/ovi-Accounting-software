const express = require('express');

const sell = require('./../controller/sellController');

const Router = express.Router();

Router.route('/createOne').post(sell.setUpdateBody, sell.create);
Router.route('/getOne/:id').get(sell.getOne);
Router.route('/getAll').get(sell.getAll);
Router.route('/updateOne/:id').patch(sell.setUpdateBody, sell.update);
Router.route('/deleteOne/:id').delete(sell.delete);

module.exports = Router;
