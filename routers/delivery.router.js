const router = require('express').Router();
const { createDelivery, updateDelivery } = require('../controllers/delivery.controller');
const { isLoggedIn } = require("../middleware");

router.route('/delivery').post(createDelivery);
router.route('/updatedelivery').post(updateDelivery);


module.exports = router;