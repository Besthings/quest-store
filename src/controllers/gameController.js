const { Games, Categories, Game_Keys } = require('../models');
const { Op } = require('sequelize');

async function getAllGames(req, res) {
    try {
        const { q, category, filter, page = 1, limit = 12 } = req.query;
        let whereClause = {};
        let order = [["createdAt", "DESC"]];

        if (q) {
            whereClause.title = { [Op.like]: `%${q}%` };
        }
        if (category) {
            if (!isNaN(category)) {
                whereClause.category_id = category;
            }
        }

        if (filter === 'new') {
            order = [["createdAt", "DESC"]];
        } else if (filter === 'popular') {
            order = [["createdAt", "DESC"]];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Games.findAndCountAll({
            where: whereClause,
            order: order,
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
            include: [
                {
                    model: Categories,
                    as: "category",
                    where: (category && isNaN(category)) ? { slug: category } : undefined
                },
                { model: Game_Keys, as: "keys" }
            ]
        });

        res.json({
            data: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createGame = async (req, res) => {
    try {
        const { title, description, price, category_id, image_url, newKeys } = req.body;

        const category = await Categories.findByPk(category_id);
        if (!category) {
            return res.status(400).json({ error: 'Invalid category_id: not found in categories' });
        }
        
        const game = await Games.create({ 
            title, 
            description, 
            price, 
            category_id, 
            image_url 
        });

        if (newKeys && newKeys.length > 0) {
            const keyPromises = newKeys.map(k => Game_Keys.create({
                game_id: game.id,
                secret_key: k,
                is_sold: false
            }));
            await Promise.all(keyPromises);
        }

        await game.reload({
            include: [
                { model: Categories, as: "category" },
                { model: Game_Keys, as: "keys" }
            ]
        });

        res.status(201).json({ message: 'Created game successfully', game });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateGame = async (req, res) => {
    try {
        const game = await Games.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Not found Game!' });
        
        if (req.body.category_id) {
            const category = await Categories.findByPk(req.body.category_id);
            if (!category) {
                return res.status(400).json({ error: 'Invalid category_id: not found in categories' });
            }
        }

        const { newKeys, ...updateData } = req.body;
        
        if (newKeys && newKeys.length > 0) {
            const keyPromises = newKeys.map(k => Game_Keys.create({
                game_id: game.id,
                secret_key: k,
                is_sold: false
            }));
            await Promise.all(keyPromises);
        }

        await game.update(updateData);
        await game.reload({
            include: [
                { model: Categories, as: "category" },
                { model: Game_Keys, as: "keys" }
            ]
        });
        
        res.status(200).json({ message: 'Updated Game', game });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteGame = async (req, res) => {
    try {
        const game = await Games.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Not found Game' });
        await game.destroy();
        res.status(200).json({ message: 'Deleted Game' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGameById = async (req, res) => {
    try {
        const game = await Games.findByPk(req.params.id, {
            include: [
                { model: Categories, as: 'category' },
                { model: Game_Keys, as: 'keys' }
            ]
        });
        if (!game) return res.status(404).json({ error: 'Not found Game' });

        // Get related games
        const related = await Games.findAll({
            where: {
                category_id: game.category_id,
                id: { [Op.ne]: game.id }
            },
            limit: 4
        });

        res.status(200).json({ game, related });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getGamesByCategory = async (req, res) => {
    try {
        const gamesByCategory = await Games.findAll({ 
            where: { category_id: req.params.categoryId },
            include: [{ model: Game_Keys, as: 'keys' }]
        });
        res.status(200).json(gamesByCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const searchGames = async (req, res) => {
    try {
        const { title } = req.query;
        const gamesFound = await Games.findAll({ 
            where: { title: { [Op.like]: `%${title}%` } },
            include: [{ model: Game_Keys, as: 'keys' }]
        });
        res.status(200).json(gamesFound);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const fs = require('fs');
// const path = require('path');

// function getImageUrlById(imageId) {
//     const exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
//     const publicDir = path.join(__dirname, '../src/public/images');
//     for (const ext of exts) {
//         const filePath = path.join(publicDir, `${imageId}.${ext}`);
//         if (fs.existsSync(filePath)) {
//             return `/public/images/${imageId}.${ext}`;
//         }
//     }
//     return null; 
// }

// module.exports = { getImageUrlById };

module.exports = {
    getAllGames,
    createGame,
    updateGame,
    deleteGame,
    getGameById,

    getGamesByCategory,
    searchGames
};