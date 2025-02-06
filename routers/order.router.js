const router = require('express').Router();
const { createOrder, getAllOrder, checkOrder, finishOrder, getPdf } = require('../controllers/order.controller');
const { isLoggedIn } = require("../middleware");

router.route('/invoice').get(getPdf);
router.route('/orders').get(getAllOrder);
router.route('/orders').post(createOrder);
router.route('/check').post(checkOrder);
router.route('/finish').post(finishOrder);

module.exports = router;