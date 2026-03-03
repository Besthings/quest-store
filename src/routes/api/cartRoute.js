const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cartController')
const { authenticate } = require('../../middleware/authMiddleware')

// All cart routes require authentication
router.get('/', authenticate, cartController.getCart)
router.post('/', authenticate, cartController.addToCart)
router.post('/checkout', authenticate, cartController.checkout)
router.delete('/', authenticate, cartController.clearCart)
router.delete('/:gameId', authenticate, cartController.removeFromCart)

module.exports = router
