const express = require('express');

const authController = require('./../controller/authController');
const viewController = require('./../controller/viewController');
const router = express.Router();

router.use(authController.isLoggedIn);
router.route('/').get(viewController.getOverview);

router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);

router.get('/addBranch', viewController.addBranch);
router.get('/searchBranch', viewController.searchBranch);
router.get('/viewBranchReport', viewController.viewBranchReport);
router.get('/printBranchReport', viewController.printBranchReport);
router.get('/allBranch', viewController.allBranch);
router.get('/editBranch', viewController.editBranch);

router.get('/addPayment', viewController.addPayment);
router.get('/searchPayment', viewController.searchPayment);
router.get('/viewPayment', viewController.viewPayment);
router.get('/printPayment', viewController.printPayment);

router.get('/addPurchase', viewController.addPurchase);
router.get('/searchPurchase', viewController.searchPurchase);
router.get('/viewPurchase', viewController.viewPurchase);
router.get('/printPurchase', viewController.printPurchase);

router.get('/addLedger', viewController.addLedger);
router.get('/allLedger', viewController.allLedger);
router.get('/editLedger', viewController.editLedger);
router.get('/searchLedger', viewController.searchLedger);
router.get('/viewLedger', viewController.viewLedger);
router.get('/printLedger', viewController.printLedger);

//
router.get('/settings', viewController.settings);

module.exports = router;
