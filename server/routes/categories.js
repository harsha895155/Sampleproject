const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCategories, addCategory } = require('../controllers/categoryController');

router.use(protect);

router.route('/')
    .get(getCategories)
    .post(addCategory);

module.exports = router;
