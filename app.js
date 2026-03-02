const express = require('express')
const app = express()
const { sequelize } = require('./src/models')
require('dotenv').config()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static Files (CSS, JS, Images)
app.use(express.static('./src/public'))

// View Engine (EJS)
app.set('view engine', 'ejs')
app.set('views', './src/views')

// Routes
const usersRoute = require('./src/routes/api/usersRoute')
const ordersRoute = require('./src/routes/api/ordersRoute')
const categoriesRoute = require('./src/routes/api/categoriesRoute')
const gamesRoute = require('./src/routes/api/gamesRoute')
const favoritesRoute = require('./src/routes/api/favoritesRoute')
const pagesRoute = require('./src/routes/pagesRoute')

// API
const baseUrl = '/api'
app.use(`${baseUrl}/users`, usersRoute)
app.use(`${baseUrl}/orders`, ordersRoute)
app.use(`${baseUrl}/categories`, categoriesRoute)
app.use(`${baseUrl}/games`, gamesRoute)
app.use(`${baseUrl}/favorites`, favoritesRoute)

// Website
app.use('/', pagesRoute)

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