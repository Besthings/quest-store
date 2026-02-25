const express = require('express');
const router = express.Router();
const { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} = require('../../controllers/categoriesController');

// GET all categories
router.get('/', getAllCategories);

// GET category by id
router.get('/:id', getCategoryById);

// POST create category
router.post('/', createCategory);

// PUT update category
router.put('/:id', updateCategory);

// DELETE category
router.delete('/:id', deleteCategory);

module.exports = router;
