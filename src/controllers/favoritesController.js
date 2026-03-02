const { Favorites, Games, Users } = require('../models')

const favoritesController = {
    // GET /api/favorites - ดูรายการโปรดของ user ที่ login
    getMyFavorites: async (req, res) => {
        try {
            const userId = req.user.id // จาก auth middleware
            
            const favorites = await Favorites.findAll({
                where: { user_id: userId },
                include: [{
                    model: Games,
                    as: 'Game', // ต้องกำหนดใน model association
                    include: [{
                        model: Categories,
                        as: 'category'
                    }]
                }]
            })
            
            res.json(favorites)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    // POST /api/favorites - เพิ่มเกมในรายการโปรด
    addFavorite: async (req, res) => {
        try {
            const userId = req.user.id
            const { game_id } = req.body

            // ตรวจสอบว่าเกมมีอยู่จริง
            const game = await Games.findByPk(game_id)
            if (!game) {
                return res.status(404).json({ error: 'Game not found' })
            }

            // สร้าง favorite (Sequelize จะ throw error ถ้าซ้ำเพราะ unique index)
            const favorite = await Favorites.create({
                user_id: userId,
                game_id: game_id
            })

            res.status(201).json({ 
                message: 'Added to favorites',
                favorite 
            })
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ error: 'Already in favorites' })
            }
            res.status(500).json({ error: error.message })
        }
    },

    // DELETE /api/favorites/:game_id - ลบออกจากรายการโปรด
    removeFavorite: async (req, res) => {
        try {
            const userId = req.user.id
            const { game_id } = req.params

            const deleted = await Favorites.destroy({
                where: {
                    user_id: userId,
                    game_id: game_id
                }
            })

            if (!deleted) {
                return res.status(404).json({ error: 'Favorite not found' })
            }

            res.json({ message: 'Removed from favorites' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    // GET /api/favorites/check/:game_id - เช็คว่า favorited หรือยัง
    checkFavorite: async (req, res) => {
        try {
            const userId = req.user.id
            const { game_id } = req.params

            const favorite = await Favorites.findOne({
                where: {
                    user_id: userId,
                    game_id: game_id
                }
            })

            res.json({ isFavorited: !!favorite })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = favoritesController
