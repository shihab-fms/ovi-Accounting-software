const express = require('express');

const userController = require('../controller/userController');

const Router = express.Router();

Router.route('/signup').post(userController.signUp);
Router.route('/login').post(userController.login);
Router.route('/logout').get(userController.logout);
Router.route('/updateUser/:id').post(userController.updateUser);
Router.route('/updatePass/:id').post(userController.updatePassword);

module.exports = Router;
