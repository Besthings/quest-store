const express = require('express')
const router = express.Router()
const gameController = require('../../controllers/gameController')
const { authenticate, authorize } = require('../../middleware/authMiddleware')

router.get('/', gameController.getAllGames)
router.get('/:id', gameController.getGameById)

// Admin-only routes
router.post('/', authenticate, authorize('admin'), gameController.createGame)
router.put('/:id', authenticate, authorize('admin'), gameController.updateGame)
router.delete('/:id', authenticate, authorize('admin'), gameController.deleteGame)

module.exports = router