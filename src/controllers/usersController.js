const { Users } = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        // Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
            })
        }

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

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        )

        res.status(200).json({
            message: 'Welcome, amigo',
            token,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getMe = async (req, res) => {
    const user = await Users.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
    })

    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({ user })
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
    getMe,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}