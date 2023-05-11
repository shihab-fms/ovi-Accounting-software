const express = require('express');

const typeOf = require('./../controller/typeOfProductController');

const Router = express.Router();

Router.route('/createOne').post(typeOf.create);
Router.route('/getOne/:id').get(typeOf.getOne);
Router.route('/getAll').get(typeOf.getAll);
Router.route('/updateOne/:id').patch(typeOf.update);
Router.route('/deleteOne/:id').delete(typeOf.delete);

module.exports = Router;
