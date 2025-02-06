const router = require('express').Router();
const { createZone, getZoneByNumberId } = require('../controllers/zone.controller');
const { isLoggedIn } = require("../middleware");

router.route('/zones/:idResto').get(getZoneByNumberId);
router.route('/zones').post(createZone);

module.exports = router;