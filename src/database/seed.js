const { sequelize, Users, Categories, Games, Orders, Order_Details, Game_Keys } = require('../models')

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }) // ลบและสร้างใหม่
        console.log('✓ Database synced')

        // 1. Users
        const users = await Users.bulkCreate([
            { username: 'admin', email: 'admin@quest.com', password: 'admin123', role: 'admin' },
            { username: 'john_doe', email: 'john@test.com', password: '123456', role: 'user' },
            { username: 'jane_smith', email: 'jane@test.com', password: '123456', role: 'user' }
        ])
        console.log('✓ Users created')

        // 2. Categories
        const categories = await Categories.bulkCreate([
            { category_name: 'Action', slug: 'action' },
            { category_name: 'RPG', slug: 'rpg' },
            { category_name: 'Sports', slug: 'sports' },
            { category_name: 'Strategy', slug: 'strategy' }
        ])
        console.log('✓ Categories created')

        // 3. Games
        const games = await Games.bulkCreate([
            { 
                category_id: categories[0].id, // Action
                title: 'Elden Ring', 
                description: 'Open world action RPG', 
                price: 1490.00, 
                stock_quantity: 100 
            },
            { 
                category_id: categories[1].id, // RPG
                title: 'Final Fantasy XVI', 
                description: 'Epic JRPG adventure', 
                price: 1790.00, 
                stock_quantity: 50 
            },
            { 
                category_id: categories[2].id, // Sports
                title: 'FC 25', 
                description: 'Football simulation game', 
                price: 1890.00, 
                stock_quantity: 200 
            },
            { 
                category_id: categories[3].id, // Strategy
                title: 'Civilization VII', 
                description: 'Turn-based strategy', 
                price: 1590.00, 
                stock_quantity: 75 
            }
        ])
        console.log('✓ Games created')

        // 4. Game_Keys (Keys สำหรับแต่ละเกม)
        const gameKeys = []
        for (const game of games) {
            // สร้าง 5 Keys ต่อเกม
            for (let i = 1; i <= 5; i++) {
                gameKeys.push({
                    game_id: game.id,
                    secret_key: `${game.title.substring(0,4).toUpperCase()}-${String(i).padStart(4,'0')}-XXXX`,
                    is_sold: false
                })
            }
        }
        await Game_Keys.bulkCreate(gameKeys)
        console.log('✓ Game Keys created')

        // 5. Orders
        const orders = await Orders.bulkCreate([
            { 
                user_id: users[1].id, // john_doe
                total_amount: 3280.00, 
                status: 'completed',
                created_at: new Date('2024-01-15')
            },
            { 
                user_id: users[2].id, // jane_smith
                total_amount: 1490.00, 
                status: 'pending',
                created_at: new Date('2024-02-01')
            }
        ])
        console.log('✓ Orders created')

        // 6. Order_Details
        await Order_Details.bulkCreate([
            { 
                order_id: orders[0].id,
                game_id: games[0].id, // Elden Ring
                subtotal: 1490.00 
            },
            { 
                order_id: orders[0].id,
                game_id: games[2].id, // FC 25
                subtotal: 1790.00 
            },
            { 
                order_id: orders[1].id,
                game_id: games[0].id, // Elden Ring
                subtotal: 1490.00 
            }
        ])
        console.log('✓ Order Details created')

        // Update Game Keys ที่ขายแล้ว
        const keysSold = await Game_Keys.findAll({ limit: 3 })
        for (const key of keysSold) {
            key.is_sold = true
            key.sold_at = new Date('2024-01-15')
            await key.save()
        }
        console.log('✓ Keys updated as sold')

        console.log('\n🎉 Seed completed!')
        process.exit(0)

    } catch (error) {
        console.error('Seed error:', error)
        process.exit(1)
    }
}

seedData()
