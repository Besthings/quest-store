const { Categories } = require('../models')
const { Games } = require('../models')

const createCategory = async (req, res) => {
    try {
        let { category_name, slug } = req.body;
        if (!slug && category_name) {
            slug = category_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
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
        const categorys = await Categories.findAll({
            attributes: ['id', 'category_name', 'slug'],
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
        
        const data = { ...req.body };
        if (data.category_name && !data.slug) {
            data.slug = data.category_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        
        await category.update(data)
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