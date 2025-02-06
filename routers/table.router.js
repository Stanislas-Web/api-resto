const router = require('express').Router();
const { getTableByRestoAndNumberId, createTable } = require('../controllers/table.controller');
const { isLoggedIn } = require("../middleware");

router.route('/tables/:idResto').get(getTableByRestoAndNumberId);
router.route('/tables').post(createTable);


module.exports = router;