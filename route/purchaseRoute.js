const express = require('express');
const authController = require('./../controller/authController');
const purchaseController = require('./../controller/purchaseController');

const router = express.Router();

router.use(authController.protect);

router.route('/all').get(purchaseController.getAll);

router.route('/single/:id').get(purchaseController.getOne);

router
  .route('/update/:id')
  .patch(purchaseController.setUpdateBody, purchaseController.updateOne);

router.route('/delete/:id').delete(purchaseController.deleteOne);

router.route('/newOne').post(purchaseController.createOne);

router.route('/ledgerInfo').post(purchaseController.getPurchaseInfoByLedger)

router.use(authController.restrictTo('admin', 'ower', 'cheif-Engineer'));

module.exports = router;
