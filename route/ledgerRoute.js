const express = require('express');
const ledgerController = require('./../controller/ledgerController');
const authController = require('./../controller/authController');
const validator = require('validator');

const router = express.Router();

router.use(authController.protect);

router.route('/info/:ledgerId/:branchId').get(ledgerController.getInfo);

router.get('/all', ledgerController.getAllLedger);
router.get('/single/:id', ledgerController.getLedger);

router.use(
  authController.restrictTo('admin', 'engineer', 'chief-engineer', 'onwer')
);

router.post('/newOne', ledgerController.createLedger);
router.patch('/update/:id', ledgerController.updateLedger);
router.delete('/delete/:id', ledgerController.deleteLedger);

module.exports = router;
