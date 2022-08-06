const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const CategoriesController = require('../controllers/category-controller');

router.get('/', CategoriesController.getCategories);
router.post('/',login.obrigatorio,CategoriesController.postCategory);

module.exports = router;