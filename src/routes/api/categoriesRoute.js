const express = require('express');
const router = express.Router();
const { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory,
    getGameBySlug

} = require('../../controllers/categoriesController');
const { getGamesByCategory } = require('../../controllers/categoriesController');

const { authenticate, authorize } = require('../../middleware/authMiddleware');

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/:slug', getGameBySlug);
router.get('/:id/games', getGamesByCategory);

// Admin-only routes
router.post('/', authenticate, authorize('admin'), createCategory);
router.put('/:id', authenticate, authorize('admin'), updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
