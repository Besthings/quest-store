const { Cart, Games, Orders, Order_Details, Game_Keys } = require('../models');

const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const cartItems = await Cart.findAll({
            where: { user_id: userId },
            include: [{ 
                model: Games, 
                as: 'game',
                include: [{ model: Game_Keys, as: 'keys' }]
            }]
        });
        
        res.json(cartItems);
    } catch (error) {
        console.error('getCart error:', error);
        res.status(500).json({ error: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { gameId } = req.body;
        if (!gameId) {
            return res.status(400).json({ error: 'Game ID is required' });
        }

        const game = await Games.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        let item = await Cart.findOne({ where: { user_id: userId, game_id: gameId } });
        if (item) {
            item.quantity += 1;
            await item.save();
        } else {
            item = await Cart.create({ user_id: userId, game_id: gameId, quantity: 1 });
        }

        res.json({ message: 'Added to cart', item });
    } catch (error) {
        console.error('addToCart error:', error);
        res.status(500).json({ error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { gameId } = req.params;
        await Cart.destroy({ where: { user_id: userId, game_id: gameId } });
        res.json({ message: 'Removed from cart' });
    } catch (error) {
        console.error('removeFromCart error:', error);
        res.status(500).json({ error: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        await Cart.destroy({ where: { user_id: userId } });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('clearCart error:', error);
        res.status(500).json({ error: error.message });
    }
};

const checkout = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });

        const cartItems = await Cart.findAll({
            where: { user_id: userId },
            include: [{ 
                model: Games, 
                as: 'game',
                include: [{ model: Game_Keys, as: 'keys' }]
            }]
        });

        if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        // Calculate total and check stock
        let total = 0;
        for (const item of cartItems) {
            const availableKeys = await Game_Keys.count({ where: { game_id: item.game_id, is_sold: false } });
            if (availableKeys < item.quantity) {
                return res.status(400).json({ error: `Not enough keys for ${item.game.title}` });
            }
            const price = item.game.discount ? Math.round(item.game.price * (1 - item.game.discount/100)) : item.game.price;
            total += price * item.quantity;
        }

        // Create order
        const order = await Orders.create({
            user_id: userId,
            total_amount: total,
            status: 'completed'
        });

        // Create details and assign keys
        for (const item of cartItems) {
            for (let i = 0; i < item.quantity; i++) {
                const key = await Game_Keys.findOne({ where: { game_id: item.game_id, is_sold: false } });
                if (key) {
                    key.is_sold = true;
                    key.sold_at = new Date();
                    await key.save();

                    await Order_Details.create({
                        order_id: order.id,
                        game_id: item.game_id,
                        game_key_id: key.id.toString(),
                        subtotal: item.game.discount ? Math.round(item.game.price * (1 - item.game.discount/100)) : item.game.price
                    });
                }
            }
        }

        // Clear cart
        await Cart.destroy({ where: { user_id: userId } });

        res.json({ message: 'Checkout successful', order_id: order.id });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Checkout failed: ' + error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart, checkout };
