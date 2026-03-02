const express = require('express')
const router = express.Router()
const favoritesController = require('../../controllers/favoritesController')
const { authenticateToken } = require('../../middleware/authMiddleware')

// ทุก route ต้อง login ก่อน
router.get('/', authenticateToken, favoritesController.getMyFavorites)
router.post('/', authenticateToken, favoritesController.addFavorite)
router.delete('/:game_id', authenticateToken, favoritesController.removeFavorite)
router.get('/check/:game_id', authenticateToken, favoritesController.checkFavorite)

module.exports = router
