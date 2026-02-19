const { Users } = require('../models')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = await Users.create({ username, email, password })
        res.status(201).json({
            message: 'Created user succesfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email' })
        }
        const isValid = await user.validPassword(password)
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid password' })
        }
        res.status(200).json({
            message: 'Welcome, amigo',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getAllUser = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: { exclude: ['password'] },
            order: [['id', 'ASC']]
        });
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await Users.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        })
        if (!user) return res.status(404).json({ error: 'Not found user' })
        res.status(200).json({ message: 'Retrived user', user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

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