const { Categories } = require('../models')
const { Games} = require('../models')

const createCategory = async (req, res) => {
    try {
        const { categories_name, slug } = req.body;
        const category = await Categories.create({ categories_name, slug });
        res.status(201).json({
            message: 'Created category succesfully',
            category: {
                id: category.id,
                categories_name: category.categories_name,
                slug: category.slug
            }
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categorys = await Categories.findAll({
            attributes: ['id', 'categories_name', 'slug'],
            order: [['id', 'ASC']]
        });
        res.status(200).json(categorys)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getCategoryById = async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Not found Category!' });
        res.status(200).json({ message: 'Retrieved category', category });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id)
        if (!category) return res.status(404).json({ error: 'Not found category' })
        await category.update(req.body)
        res.status(200).json({ message: 'Updated category', category })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id)
        if (!category) return res.status(404).json({ error: 'Not found category' })
        await category.destroy()
        res.status(200).json({ message: 'Deleted category' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getGamesByCategory = async (req, res) => {
    try {
        const category = await Categories.findByPk(req.params.id, {
            include: [{
                model: Games,
                as: 'games',
                attributes: ['id', 'game_name', 'price']
            }],
            order: [[{ model: Games, as: 'games' }, 'game_name', 'ASC']]
        });
        res.status(200).json({ message: 'Retrieved games by category', category })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getGamesByCategory
}