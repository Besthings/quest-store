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

        // สร้าง order details ก่อน (ยังไม่ assign key)
        for (const item of items) {
            const game = await Games.findByPk(item.game_id)
            await Order_Details.create({
                order_id: order.id,
                game_id: item.game_id,
                subtotal: item.quantity * game.price
            })
        }

        res.status(201).json({ message: 'Order created', order })

        // === จำลองการชำระเงิน (รอ 15 วิแล้ว auto complete) ===
        setTimeout(async () => {
            try {
                console.log('Starting auto-complete for order:', order.id)

                const completedOrder = await Orders.findByPk(order.id, {
                    include: [{ model: Order_Details, as: 'orderDetails' }]
                })

                console.log('Order details:', completedOrder.orderDetails)

                for (const detail of completedOrder.orderDetails) {
                    console.log('Finding key for game_id:', detail.game_id)

                    const availableKey = await Game_Keys.findOne({
                        where: { game_id: detail.game_id, is_sold: false }
                    })

                    console.log('Available key:', availableKey)

                    if (availableKey) {
                        availableKey.is_sold = true
                        availableKey.sold_at = new Date()
                        await availableKey.save()

                        await detail.update({ game_key_id: availableKey.id })
                        console.log('Updated detail with key:', availableKey.secret_key)
                    }
                }

                // อัปเดต status เป็น completed
                await completedOrder.update({ status: 'completed' })
                console.log('Order completed!')

            } catch (err) {
                console.error('Auto complete error:', err)
            }
        }, 15000)


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


// (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.findAll({
            include: [
                { model: Users, as: 'user', attributes: ['username', 'email'] },
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
            include: [
                {
                    model: Order_Details, as: 'orderDetails',
                    include: [{ model: Game_Keys, as: 'gameKey' }]
                },
            ]
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
                { model: Order_Details, as: 'orderDetails' }
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
