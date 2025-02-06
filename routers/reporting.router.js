const router = require('express').Router();
const { getAllReport } = require('../controllers/reporting.controller');
const { isLoggedIn } = require("../middleware");

router.route('/reports').get(getAllReport);

module.exports = router;