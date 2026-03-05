const express = require('express')
const router = express.Router()
const ordersController = require('../../controllers/ordersController')
const { authenticate, authorize } = require('../../middleware/authMiddleware')

router.post('/', authenticate, ordersController.createOrder)
router.get('/myorders', authenticate, ordersController.getMyOrders)

// Admin only routes
router.get('/', authenticate, authorize('admin'), ordersController.getAllOrders)
router.get('/:id', authenticate, authorize('admin'), ordersController.getOrderById)
router.put('/:id', authenticate, authorize('admin'), ordersController.updateOrderStatus)
router.delete('/:id', authenticate, authorize('admin'), ordersController.deleteOrder)

module.exports = router
