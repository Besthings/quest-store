const { Games, Categories } = require('../models');
const { getImageUrlById } = require('../../game/game.idurl');


async function getAllGames(req, res) {
    try {
        const allGames = await Games.findAll();
        res.json(allGames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createGame = async (req, res) => {
    try {
        const { title, description, price, category_id, stock_quantity } = req.body;
        
        const category = await Categories.findByPk(category_id);
        if (!category) {
            return res.status(400).json({ error: 'Invalid category_id: not found in categories' });
        }
        const game = await Games.create({ title, description, price, category_id, stock_quantity });
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
        await game.update(req.body);
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
        const game = await Games.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Not found Game' });
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGameBySlug = async (req, res) => {
    try {
        const game = await Games.findOne({ where: { slug: req.params.slug } });
        if (!game) return res.status(404).json({ error: 'Not found Game' });
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGamesByCategory = async (req, res) => {
    try {
        const gamesByCategory = await Games.findAll({ where: { category_id: req.params.categoryId } });
        res.status(200).json(gamesByCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const { Op } = require('sequelize');
const searchGames = async (req, res) => {
    try {
        const { title } = req.query;
        const gamesFound = await Games.findAll({ where: { title: { [Op.like]: `%${title}%` } } });
        res.status(200).json(gamesFound);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { 
    getAllGames,
    createGame,
    updateGame,
    deleteGame,
    getGameById,
    getGameBySlug,
    getGamesByCategory,
    searchGames
 };