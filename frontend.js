const express = require('express')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Make environment variables available to all views
app.use((req, res, next) => {
    res.locals.process = {
        env: {
            BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3010'
        }
    }
    next()
})

// Static Files (CSS, JS, Images)
app.use(express.static('./src/public'))

// View Engine (EJS) with Layouts
app.set('view engine', 'ejs')
app.set('views', './src/views')
app.use(expressLayouts)
app.set('layout', 'layout')  // default layout = views/layout.ejs

// Auth Middleware - make user data available to all views
const authMiddleware = require('./src/middleware/authMiddleware')
app.use(authMiddleware.setUserLocals)

// Routes (Frontend pages only)
const pagesRoute = require('./src/routes/pagesRoute')

// Website Pages
app.use('/', pagesRoute)

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404', { title: '404 – Quest Store', page: '404' })
})

// Global Error Handler
app.use((err, req, res, _next) => {
    console.error('Frontend Error:', err.message)
    res.status(500).render('404', { title: 'Error', page: '404' })
})

// Start Server
const PORT = process.env.FRONTEND_PORT || 5500
app.listen(PORT, () => {
    console.log(`🎮 Frontend running on http://localhost:${PORT}`)
    console.log(`📡 Backend API at ${process.env.BACKEND_URL || 'http://localhost:3010'}`)
})
