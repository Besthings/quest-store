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


router.get('/', getAllCategories);

router.get('/:slug', getGameBySlug);

router.get('/:id', getCategoryById);

router.get('/:id/games', getGamesByCategory);

router.post('/', createCategory);

router.put('/:id', updateCategory);

router.delete('/:id', deleteCategory);

module.exports = router;
