const router = require('express').Router();
const { callBackPayementCardSucces, callBackPayementCardError } = require('../controllers/payment.controller');
const { isLoggedIn } = require("../middleware");

router.route('/paymentsuccess/:idResto/:phoneClient/:invoiceNumber').get(callBackPayementCardSucces);
router.route('/paymenterror/:idResto/:phoneClient/:invoiceNumber').get(callBackPayementCardError);


module.exports = router; 