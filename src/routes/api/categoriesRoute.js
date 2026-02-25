const express = require('express');
const router = express.Router();
const { 
    createCategory, 
    getAllCategory, 
    getCategoryByName, 
    updateCategory, 
    deleteCategory 
} = require('../../controllers/categoriesController');

// GET all categories
router.get('/', getAllCategory);

// GET category by name
router.get('/:category_name', getCategoryByName);

// POST create category
router.post('/', createCategory);

// PUT update category
router.put('/:id', updateCategory);

// DELETE category
router.delete('/:id', deleteCategory);

module.exports = router;
