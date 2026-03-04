const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const { sequelize } = require('./src/models')
require('dotenv').config()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500',
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Routes
const usersRoute = require('./src/routes/api/usersRoute')
const ordersRoute = require('./src/routes/api/ordersRoute')
const categoriesRoute = require('./src/routes/api/categoriesRoute')
const gamesRoute = require('./src/routes/api/gamesRoute')
const favoritesRoute = require('./src/routes/api/favoritesRoute')
const cartRoute = require('./src/routes/api/cartRoute')

// API Routes Only
const baseUrl = '/api'
app.use(`${baseUrl}/users`, usersRoute)
app.use(`${baseUrl}/orders`, ordersRoute)
app.use(`${baseUrl}/categories`, categoriesRoute)
app.use(`${baseUrl}/games`, gamesRoute)
app.use(`${baseUrl}/favorites`, favoritesRoute)
app.use(`${baseUrl}/cart`, cartRoute)

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Backend API is running' })
})

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'API endpoint not found' })
})

// Global Error Handler
app.use((err, req, res, _next) => {
    console.error('Server Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
})

// Start Server
const PORT = process.env.BACKEND_PORT || 3010
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced')
        app.listen(PORT, () => {
            console.log(`🚀 Backend API running on http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error('Unable to sync database:', error)
    })
