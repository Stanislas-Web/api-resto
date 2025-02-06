const router = require('express').Router();
const { createPlats, getAllPlats, getAllPlatsByNameCategoryWithIdNumber } = require('../controllers/plats.controller');
const { isLoggedIn } = require("../middleware");

router.route('/plats').get(getAllPlats);
router.route('/plats/:idResto/:category').get(getAllPlatsByNameCategoryWithIdNumber);
router.route('/plats').post(createPlats);

module.exports = router; 