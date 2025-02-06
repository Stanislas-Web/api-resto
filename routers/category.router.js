const router = require('express').Router();
const {createCategory, getAllCategories, getCategoryByNumberId } = require('../controllers/category.controller');
const { isLoggedIn } = require("../middleware");

router.route('/categories').get(getAllCategories);
router.route('/categories/:idResto').get(getCategoryByNumberId);
router.route('/categories').post(createCategory);

module.exports = router; 