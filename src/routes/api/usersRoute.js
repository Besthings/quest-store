const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/usersController')
const { authenticate, authorize } = require('../../middleware/authMiddleware')

router.post('/register', usersController.register)
router.post('/login', usersController.login)

// Protected routes 
router.get('/me', authenticate, usersController.getMe)
router.get('/', authenticate, authorize('admin'), usersController.getAllUser)
router.get('/:id', authenticate, authorize('admin'), usersController.getUserById)

// Admin only routes
router.put('/:id', authenticate, authorize('admin'), usersController.updateUser)
router.delete('/:id', authenticate, authorize('admin'), usersController.deleteUser)

module.exports = router
