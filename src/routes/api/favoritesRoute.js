const express = require('express')
const router = express.Router()
const favoritesController = require('../../controllers/favoritesController')
const { authenticate } = require('../../middleware/authMiddleware')

// ทุก route ต้อง login ก่อน
router.get('/', authenticate, favoritesController.getMyFavorites)
router.post('/', authenticate, favoritesController.addFavorite)
router.delete('/:game_id', authenticate, favoritesController.removeFavorite)
router.get('/check/:game_id', authenticate, favoritesController.checkFavorite)

module.exports = router
