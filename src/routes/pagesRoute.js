const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Public pages
router.get('/', pageController.getHome);
router.get('/login', pageController.getLogin);
router.get('/game/:id', pageController.getGameDetails);
router.get('/about', pageController.getAbout);

// Protected pages (require login)
router.get('/cart', requireAuth, pageController.getCart);
router.get('/checkout', requireAuth, pageController.getCheckout);
router.get('/profile', requireAuth, pageController.getProfile);

// Admin pages
router.get('/admin', requireAdmin, pageController.getAdminDashboard);
router.get('/admin/users', requireAdmin, pageController.getAdminUsers);
router.get('/admin/categories', requireAdmin, pageController.getAdminCategories);
router.get('/admin/games', requireAdmin, pageController.getAdminGames);
router.get('/admin/orders', requireAdmin, pageController.getAdminOrders);
router.get('/admin/reports', requireAdmin, pageController.getAdminReports);

module.exports = router;
