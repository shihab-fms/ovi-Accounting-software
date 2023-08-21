const express = require('express');

const authController = require('.././controller/authController');
const unitController = require('.././controller/unitController');

const router = express.Router();

router.use(authController.protect);

router.route('/all').get(unitController.getAll);
router.route('/:id').get(unitController.getOne);

router.use(authController.restrictTo('admin'));

router.route('/newOne').post(unitController.createOne);
router.route('/update/:id').patch(unitController.updateOne);
router.route('/delete/:id').delete(unitController.deleteOne);

module.exports = router;
