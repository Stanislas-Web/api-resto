const router = require('express').Router();
const { getPathByPhoneNumberAndIdNumber } = require('../controllers/facture.controller');

router.route('/factures').post(getPathByPhoneNumberAndIdNumber);

module.exports = router;