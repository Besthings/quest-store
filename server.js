const express = require('express')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const app = express()
const { sequelize } = require('./src/models')
require('dotenv').config()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

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

// Routes
const usersRoute = require('./src/routes/api/usersRoute')
const ordersRoute = require('./src/routes/api/ordersRoute')
const categoriesRoute = require('./src/routes/api/categoriesRoute')
const gamesRoute = require('./src/routes/api/gamesRoute')
const favoritesRoute = require('./src/routes/api/favoritesRoute')
const cartRoute = require('./src/routes/api/cartRoute')
const pagesRoute = require('./src/routes/pagesRoute')

// API
const baseUrl = '/api'
app.use(`${baseUrl}/users`, usersRoute)
app.use(`${baseUrl}/orders`, ordersRoute)
app.use(`${baseUrl}/categories`, categoriesRoute)
app.use(`${baseUrl}/games`, gamesRoute)
app.use(`${baseUrl}/favorites`, favoritesRoute)
app.use(`${baseUrl}/cart`, cartRoute)

// Website
app.use('/', pagesRoute)

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404', { title: '404 – Quest Store', page: '404' })
})

// Global Error Handler
app.use((err, req, res, _next) => {
    console.error('Server Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
})

// Start Server
const PORT = process.env.PORT || 3000
sequelize.sync({ force: false }) // ถ้าเปลี่ยนเป็น true จะลบตารางแล้วสร้างตารางใหม่ -> ข้อมูลข้างในหายทั้งหมด
    .then(() => {
        console.log('Database synced')
        app.listen(PORT, () => {
            console.log(`Server running on port http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error('Unable to sync database:', error)
    })