const router = require('express').Router();
const { createResto, getAllRestos } = require('../controllers/resto.controller');
const { isLoggedIn } = require("../middleware");

router.route('/restos').get(getAllRestos);
router.route('/restos').post(createResto);

module.exports = router;