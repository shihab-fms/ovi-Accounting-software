const express = require('express');
const authController = require('./../controller/authController');
const paymentController = require('./../controller/paymentController');

const router = express.Router();

router.use(authController.protect);

router.route('/newOne').post(paymentController.createPayment);
router.route('/all').get(paymentController.getAllPayment);
router.route('/single/:id').get(paymentController.getOnePayment);
router.route('/updatePayment').patch(paymentController.updatePaymentOnly);
router
  .route('/update/:id')
  .patch(paymentController.setUpdateBody, paymentController.updateOnePayment);
router.route('/delete/:id').delete(paymentController.deleteOnePayment);

router.post('/ledgerinfo', paymentController.getPaymentInfoByLedger)
module.exports = router;

