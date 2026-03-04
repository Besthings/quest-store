const jwt = require('jsonwebtoken')
const { Users, Categories } = require('../models')
require('dotenv').config()

const authenticate = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' })
    }
}

// Middleware validation roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' })
        }
        next()
    }
}

// Set user data for views (EJS layouts)
const setUserLocals = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
        let currentUser = null
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                // JWT token uses 'id' (from usersController), not 'userId'
                const userId = decoded.id || decoded.userId
                currentUser = await Users.findByPk(userId, {
                    attributes: ['id', 'username', 'email', 'role']
                })
            } catch (err) {
                currentUser = null
            }
        }
        
        // Get cart count for current user (mock - no Cart model yet)
        let cartCount = 0
        
        res.locals.currentUser = currentUser
        res.locals.cartCount = cartCount
        req.currentUser = currentUser
        
        next()
    } catch (error) {
        console.error('Auth middleware error:', error)
        res.locals.currentUser = null
        res.locals.cartCount = 0
        next()
    }
}

// Require auth for pages
const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        return res.redirect('/login')
    }
    next()
}

// Require admin for pages
const requireAdmin = (req, res, next) => {
    if (!req.currentUser || req.currentUser.role !== 'admin') {
        return res.redirect('/login')
    }
    next()
}

module.exports = { authenticate, authorize, setUserLocals, requireAuth, requireAdmin }
