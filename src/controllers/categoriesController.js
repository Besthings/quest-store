const { Categories } = require('../models')
const { Games} = require('../models')

const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body
        const category = await Categories.create({ category_name: name, slug })
        res.status(201).json({
            message: 'Created category succesfully',
            category: {
                id: category.id,
                name: category.category_name,
                slug: category.slug
            }
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getAllCategory = async (req, res) => {
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

const getCategoryByName = async (req, res) => {
    try {

        const getcate = await Categories.findOne({
            where: { category_name: req.params.category_name }
        })
        if (!getcate) return res.status(404).json({ error: 'Not found Category!' })
        res.status(200).json({ message: 'Retrived category', getcate })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

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
    //IDK HOW TO USE

module.exports = {
        createCategory,
        getAllCategory,
        getCategoryByName,
        updateCategory,
        deleteCategory
}