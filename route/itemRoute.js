const express = require('express');

const itemController = require('.././controller/itemController');
const authController = require('.././controller/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/all').get(itemController.getAll);
router.route('/:id').get(itemController.getOne);

router.use(authController.restrictTo('admin'));

router.route('/newOne').post(itemController.createOne);
router.route('/update/:id').patch(itemController.updateOne);
router.route('/delete/:id').delete(itemController.deleteOne);

module.exports = router;
