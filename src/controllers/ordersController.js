const { Orders, Users, Order_Details, Game_Keys, Games } = require('../models')

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id 
        const { items } = req.body
        
        let total = 0
        for (const item of items) {
            const game = await Games.findByPk(item.game_id)
            total += game.price * item.quantity
        }
        
        const order = await Orders.create({
            user_id: userId,
            total_amount: total,
            status: 'pending'
        })
        
        for (const item of items) {
            const detail = await Order_Details.create({
                order_id: order.id,
                game_id: item.game_id,
                subtotal: item.quantity * game.price
            })
            
            const availableKey = await Game_Keys.findOne({
                where: { game_id: item.game_id, is_sold: false }
            })
            if (availableKey) {
                availableKey.is_sold = true
                availableKey.detail_id = detail.id
                availableKey.sold_at = new Date()
                await availableKey.save()
            }
        }
        
        res.status(201).json({ message: 'Order created', order })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll({
            include: [
                { model: Users, as: 'user', attributes: ['username', 'email'] }
            ]
        })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id
        const orders = await Orders.findAll({
            where: { user_id: userId },
            include: [{ model: Order_Details, as: 'details' }]
        })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Orders.findByPk(id, {
            include: [
                { model: Users, as: 'user', attributes: ['username', 'email'] },
                { model: Order_Details, as: 'details' }
            ]
        })
        if (!order) return res.status(404).json({ error: 'Order not found' })
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body // 'pending', 'completed', 'cancelled'
        
        const order = await Orders.findByPk(id)
        if (!order) return res.status(404).json({ error: 'Order not found' })
        
        await order.update({ status })
        res.status(200).json({ message: 'Status updated', order })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// (Admin)
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Orders.findByPk(id)
        if (!order) return res.status(404).json({ error: 'Order not found' })
        
        await order.destroy()
        res.status(200).json({ message: 'Order deleted' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
}
