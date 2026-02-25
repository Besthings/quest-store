const { Categories } = require('../models')


const createCategory = async (req, res) => {
    try {
        const { name, slug} = req.body
        const category = await Categories.create({ category_name: name, slug })
        res.status(201).json({
            message: 'Created category succesfully',
            category: {
                id: category.cate_id,
                name :category.category_name,
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
            attributes: [ 'cate_id', 'category_name', 'slug'],
            order: [['cate_id', 'ASC']]
        });
        res.status(200).json(categorys)
    }    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getCategoryByName = async (req, res) => {
    try {

        const getcate = await Categories.findOne({
            where: { category_name: req.params.category_name }
        })
        if (!getcate) return res.status(404).json({error: 'Not found Category!'})
        res.status(200).json({ message: 'Retrived category', get_cate})
    } catch (error) {
            res.status(500).json({ error: error.message })
        }
}


//IDK HOW TO USE

const updateUser = async (req, res) => {
    try {
        const user = await Users.findByPk(req.params.id)
        if (!user) return res.status(404).json({ error: 'Not found user' })
        await user.update(req.body)
        res.status(200).json({ message: 'Updated user', user })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await Users.findByPk(req.params.id)
        if (!user) return res.status(404).json({ error: 'Not found user' })
        await user.destroy()
        res.status(200).json({ message: 'Deleted user' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    register,
    login,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}