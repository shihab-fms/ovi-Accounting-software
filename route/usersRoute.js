const express = require('express');

const usersController = require('./../controller/usersController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/signUp').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

//
router.use(authController.protect);
router.route('/getall').get(usersController.getAllUser);

module.exports = router;
