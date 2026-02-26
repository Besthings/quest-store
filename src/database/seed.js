const { sequelize, Users, Categories, Games, Orders, Order_Details, Game_Keys } = require('../models')

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }) // ลบและสร้างใหม่
        console.log('✓ Database synced')

        // 1. Users
        const users = await Users.bulkCreate([
            { username: 'admin', email: 'admin@quest.com', password: 'Test1234', role: 'admin' },
            { username: 'player1', email: 'player1@test.com', password: 'Test1234', role: 'user' },
            { username: 'gamer2024', email: 'gamer@test.com', password: 'Test1234', role: 'user' },
            { username: 'questlover', email: 'quest@test.com', password: 'Test1234', role: 'user' }
        ], { individualHooks: true })
        console.log('✓ Users created')

        // 2. Categories
        const categories = await Categories.bulkCreate([
            { category_name: 'Action', slug: 'action' },
            { category_name: 'Adventure', slug: 'adventure' },
            { category_name: 'RPG', slug: 'rpg' },
            { category_name: 'Horror', slug: 'horror' }
        ])
        console.log('✓ Categories created')

        // 3. Games (จากรูปภาพในโปรเจค: re9, arcraider, red2, mine)
        const games = await Games.bulkCreate([
            {
                category_id: categories[3].id, // Horror
                title: 'Resident Evil 9',
                description: 'เกมสยองขวัญตัวล่าสุดในตระกูล Resident Evil พร้อมประสบการณ์สยองขวัญระดับ next-gen',
                price: 1790,
                stock_quantity: 50
            },
            {
                category_id: categories[0].id, // Action
                title: 'Arc Raiders',
                description: 'เกมแอคชัน co-op shooter ที่ผสมผสานการต่อสู้กับศัตรูและการเก็บของ',
                price: 990,
                stock_quantity: 100
            },
            {
                category_id: categories[1].id, // Adventure
                title: 'Resident Evil 2 Remake',
                description: 'รีเมคของตำนานเกมสยองขวัญคลาสสิก พร้อมกราฟิกสมจริง',
                price: 1290,
                stock_quantity: 75
            },
            {
                category_id: categories[2].id, // RPG
                title: 'Minecraft',
                description: 'เกมสร้างโลกเปิดที่ให้คุณสร้างทุกอย่างได้ตามจินตนาการ',
                price: 890,
                stock_quantity: 200
            },
            {
                category_id: categories[0].id, // Action
                title: 'Cyber Punk 2077',
                description: 'เกม RPG แนว cyberpunk ในเมือง Night City ที่เต็มไปด้วยเทคโนโลยี',
                price: 1590,
                stock_quantity: 80
            },
            {
                category_id: categories[2].id, // RPG
                title: 'Elden Ring',
                description: 'Open world action RPG จากผู้สร้าง Dark Souls',
                price: 1490,
                stock_quantity: 60
            },
            {
                category_id: categories[1].id, // Adventure
                title: 'The Legend of Zelda',
                description: 'ตำนานแห่งการผจญภัยในโลก Hyrule',
                price: 1890,
                stock_quantity: 40
            },
            {
                category_id: categories[3].id, // Horror
                title: 'Silent Hill',
                description: 'เกมสยองขวัญคลาสสิกที่กลับมาพร้อมความหลอนระดับใหม่',
                price: 1690,
                stock_quantity: 45
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
                    is_sold: false,
                    secret_key: `${game.title.substring(0, 4).toUpperCase()}-${game.id}-${String(i).padStart(4, '0')}-QUEST`
                })
            }
        }
        await Game_Keys.bulkCreate(gameKeys)
        console.log('✓ Game Keys created')

        // 5. Orders
        const orders = await Orders.bulkCreate([
            {
                user_id: users[1].id, // player1
                total_amount: 3080.00,
                status: 'completed'
            },
            {
                user_id: users[2].id, // gamer2024
                total_amount: 1290.00,
                status: 'completed'
            },
            {
                user_id: users[3].id, // questlover
                total_amount: 2180.00,
                status: 'pending'
            },
            {
                user_id: users[1].id, // player1
                total_amount: 890.00,
                status: 'completed'
            }
        ])
        console.log('✓ Orders created')

        // 6. Order_Details
        await Order_Details.bulkCreate([
            {
                order_id: orders[0].id,
                game_id: games[0].id, // Resident Evil 9
                quantity: 1,
                game_key_id: null,
                subtotal: 1790
            },
            {
                order_id: orders[0].id,
                game_id: games[1].id, // Arc Raiders
                quantity: 1,
                game_key_id: null,
                subtotal: 1290
            },
            {
                order_id: orders[1].id,
                game_id: games[2].id, // Resident Evil 2 Remake
                quantity: 1,
                game_key_id: null,
                subtotal: 1290
            },
            {
                order_id: orders[2].id,
                game_id: games[4].id, // Cyber Punk 2077
                quantity: 1,
                game_key_id: null,
                subtotal: 1590
            },
            {
                order_id: orders[2].id,
                game_id: games[3].id, // Minecraft
                quantity: 1,
                game_key_id: null,
                subtotal: 590
            },
            {
                order_id: orders[3].id,
                game_id: games[3].id, // Minecraft
                quantity: 1,
                game_key_id: null,
                subtotal: 890
            }
        ])
        console.log('✓ Order Details created')
        console.log('\n🎉 Seed completed!')
        console.log('-------------------------------------------------')
        console.log('Password of all users is "Test1234"')
        console.log('-------------------------------------------------')
        process.exit(0)

    } catch (error) {
        console.error('Seed error:', error)
        process.exit(1)
    }
}

seedData()
