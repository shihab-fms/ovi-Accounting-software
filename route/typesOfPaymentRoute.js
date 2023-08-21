// import express from 'express';
const express = require('express');
const authController = require('./../controller/authController');
const typesofPaymentController = require('./../controller/typesOfPaymentController');

const router = express.Router();

router.get('/all', typesofPaymentController.getAllPaymentType);
router.use(authController.protect, authController.restrictTo('admin'));

router.post('/newOne', typesofPaymentController.createPaymentType);
router.patch('/update/:id', typesofPaymentController.updatePaymentType);
router.get('/single/:id', typesofPaymentController.getPaymentType);
router.delete('/delete/:id', typesofPaymentController.deletePaymentType);

module.exports = router;
