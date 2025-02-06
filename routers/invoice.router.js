const router = require('express').Router();
const { getInvoiceContent } = require('../controllers/invoice.controller');

router.route('/invoices/:name').get(getInvoiceContent);

module.exports = router;