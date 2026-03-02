const { Categories } = require('../models')
const { Games } = require('../models')

const createCategory = async (req, res) => {
    try {
        const { category_name, slug } = req.body;
        const category = await Categories.create({ category_name, slug });
        res.status(201).json({
            message: 'Created category succesfully',
            category: {
                id: category.id,
                category_name: category.category_name,
                slug: category.slug
            }
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const offset = (page - 1) * limit;

        const { count, rows } = await Categories.findAndCountAll({
            attributes: ['id', 'category_name', 'slug'],
            order: [['id', 'ASC']],
            limit,
            offset
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            data: rows,
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: page,
                limit
            }
        });
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
                attributes: ['id', 'title', 'price']
            }],
            order: [[{ model: Games, as: 'games' }, 'title', 'ASC']]
        });
        res.status(200).json({ message: 'Retrieved games by category', category })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getGameBySlug = async (req, res) => {
    try {
        const categories = await Categories.findOne({
            where: { slug: req.params.slug },
            include: [{
                model: Games,
                as: 'games',
            }],
            order: [[{ model:Games , as: 'games'}, 'title','ASC']]
        });

        if (!categories) return res.status(404).json({ error: 'Not found Game' });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getGamesByCategory,
    getGameBySlug
}