const { Orders, Users, Order_Details, Game_Keys, Games } = require('../models')

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id
        const { items } = req.body

        for (const item of items) {
            const availableKeys = await Game_Keys.count({
                where: { game_id: item.game_id, is_sold: false }
            })

            if (availableKeys < item.quantity) {
                return res.status(400).json({
                    error: `Key mee mai por`
                })
            }
        }

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
            const game = await Games.findByPk(item.game_id)
            for (let i = 0; i < item.quantity; i++) {
                await Order_Details.create({
                    order_id: order.id,
                    game_id: item.game_id,
                    subtotal: game.price  
                })
            }
        }

        res.status(201).json({ message: 'Order created', order })

        setTimeout(async () => {
            try {
                console.log('Starting auto-complete for order:', order.id)

                const completedOrder = await Orders.findByPk(order.id, {
                    include: [{ model: Order_Details, as: 'orderDetails' }]
                })

                console.log('Order details:', completedOrder.orderDetails)

                for (const detail of completedOrder.orderDetails) {
                    console.log('Finding keys for game_id:', detail.game_id);

                    const availableKeys = await Game_Keys.findAll({
                        where: { game_id: detail.game_id, is_sold: false },
                        limit: 1
                    })

                    console.log('Available keys found:', availableKeys.length)

                    if (availableKeys.length > 0) {
                        const keyIds = availableKeys.map(k => k.id).join(',')
                        
                        for (const key of availableKeys) {
                            key.is_sold = true
                            key.sold_at = new Date()
                            await key.save()
                        }

                        await detail.update({ game_key_id: keyIds })
                        console.log('Updated detail with keys:', keyIds)
                    }
                }

                await completedOrder.update({ status: 'completed' })
                console.log('Order completed!')

            } catch (err) {
                console.error('Auto complete error:', err)
            }
        }, 10000)

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
                { 
                    model: Order_Details, as: 'orderDetails',
                    include: [{ model: Games, as: 'game', attributes: ['id', 'title'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        const ordersWithKeys = await Promise.all(orders.map(async (order) => {
            const orderData = order.toJSON();
            for (const detail of orderData.orderDetails) {
                if (detail.game_key_id && typeof detail.game_key_id === 'string') {
                    const keyIds = detail.game_key_id.split(',');
                    const keys = await Game_Keys.findAll({
                        where: { id: keyIds },
                        attributes: ['id', 'game_id', 'secret_key', 'is_sold']
                    });
                    detail.gameKeys = keys;
                } else {
                    detail.gameKeys = [];
                }
            }
            return orderData;
        }));
        res.status(200).json(ordersWithKeys)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id
        const orders = await Orders.findAll({
            where: { user_id: userId },
            attributes: ['id', 'total_amount', 'status', 'createdAt'],
            include: [
                {
                    model: Order_Details, as: 'orderDetails',
                    attributes: ['id', 'subtotal', 'game_key_id'],
                    include: [{ model: Games, as: 'game', attributes: ['id', 'title', 'image_url'] }],
                    separate: true,
                    order: [['id', 'ASC']]
                },
            ],
            order: [['createdAt', 'DESC']]
        })
        
        const ordersWithKeys = await Promise.all(orders.map(async (order) => {
            const orderData = order.toJSON();
            
            for (const detail of orderData.orderDetails) {
                if (detail.game_key_id && typeof detail.game_key_id === 'string') {
                    const keyIds = detail.game_key_id.split(',');
                    const keys = await Game_Keys.findAll({
                        where: { id: keyIds },
                        attributes: ['id', 'game_id', 'secret_key', 'is_sold']
                    });
                    detail.gameKeys = keys;
                } else {
                    detail.gameKeys = [];
                }
            }
            
            return orderData;
        }));
        
        res.status(200).json(ordersWithKeys)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
