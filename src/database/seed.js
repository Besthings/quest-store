const { sequelize, Users, Categories, Games, Orders, Order_Details, Game_Keys } = require('../models')

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }) // Drops tables and recreates them
        console.log('✓ Database synced')

        // 1. Generate 30 Users
        const usersData = [
            { username: 'admin', email: 'admin@quest.com', password: 'Test1234', role: 'admin' },
            { username: 'player1', email: 'player1@test.com', password: 'Test1234', role: 'user' },
            { username: 'gamer2024', email: 'gamer@test.com', password: 'Test1234', role: 'user' },
            { username: 'questlover', email: 'quest@test.com', password: 'Test1234', role: 'user' }
        ];
        for (let i = 5; i <= 30; i++) {
            usersData.push({
                username: `mockuser_${i}`,
                email: `mockuser${i}@test.com`,
                password: 'Test1234',
                role: 'user'
            });
        }
        const users = await Users.bulkCreate(usersData, { individualHooks: true })
        console.log(`✓ ${users.length} Users created`)

        // 2. Generate 10 Categories
        const catBase = ['Action', 'Adventure', 'RPG', 'Horror', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Fighting', 'Puzzle'];
        const catData = catBase.map((name, i) => ({
            category_name: name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }));
        const categories = await Categories.bulkCreate(catData);
        console.log(`✓ ${categories.length} Categories created`)

        // 3. Generate 50 Games
        const gameTitles = [
            'Resident Evil 9', 'Arc Raiders', 'Resident Evil 2 Remake', 'Minecraft', 'Cyberpunk 2077', 'Elden Ring',
            'Grand Theft Auto VI', 'The Witcher 4', 'Hollow Knight: Silksong', 'Red Dead Redemption 3', 'Fallout 5',
            'Half-Life 3', 'Portal 3', 'Starfield: Shattered Space', 'DOOM: The Dark Ages', 'Gears of War: E-Day',
            'Fable', 'Perfect Dark', 'State of Decay 3', 'South of Midnight', 'Clockwork Revolution',
            'Assassin\'s Creed Shadows', 'Star Wars Outlaws', 'Dragon Age: The Veilguard', 'Monster Hunter Wilds',
            'Death Stranding 2', 'Ghost of Yotei', 'Marvel\'s Wolverine', 'Silent Hill 2 Remake', 'Metal Gear Solid Delta',
            'Final Fantasy VII Rebirth Part 3', 'Kingdom Hearts IV', 'Persona 6', 'Dragon Quest XII', 'Metaphor: ReFantazio',
            'Judas', 'Hades II', 'Slay the Spire 2', 'Neva', 'Little Nightmares III',
            'Civilization VII', 'Frostpunk 2', 'Cities: Skylines 2 DLC', 'Age of Mythology: Retold', 'Ara: History Untold',
            'EA Sports FC 25', 'NBA 2K25', 'F1 24', 'Madden NFL 25', 'PGA Tour 2K25'
        ];
        
        const gamesData = gameTitles.map((title, i) => {
            const catId = categories[Math.floor(Math.random() * categories.length)].id;
            const priceOptions = [590, 890, 1290, 1590, 1790, 1990, 2490];
            const price = priceOptions[Math.floor(Math.random() * priceOptions.length)];
            const discount = Math.random() > 0.7 ? [10, 15, 20, 25, 30, 40, 50, 75][Math.floor(Math.random() * 8)] : null;
            
            return {
                category_id: catId,
                title: title,
                description: `Experience the amazing and immersive world of ${title}. A masterpiece in modern gaming combining incredible story and next-gen graphics.`,
                price: price,
                discount: discount,
                image_url: '/images/arcraider.jpg' // Default mockup image
            };
        });
        const games = await Games.bulkCreate(gamesData);
        console.log(`✓ ${games.length} Games created`)

        // 4. Generate 500 Game_Keys (10 keys per game)
        const gameKeysData = []
        for (const game of games) {
            for (let i = 1; i <= 10; i++) {
                gameKeysData.push({
                    game_id: game.id,
                    is_sold: false,
                    secret_key: `${game.title.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X')}-${game.id}-${String(i).padStart(4, '0')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`
                })
            }
        }
        await Game_Keys.bulkCreate(gameKeysData)
        console.log(`✓ ${gameKeysData.length} Game Keys created`)

        // 5. Generate 40 Orders & Order_Details
        const ordersData = [];
        const detailsData = [];
        const orderStatuses = ['completed', 'completed', 'completed', 'pending', 'cancelled'];

        // Get fresh keys to assign them dynamically to avoid unique/sold constraint issues
        const allKeys = await Game_Keys.findAll();
        let keyIndex = 0;

        for (let i = 1; i <= 40; i++) {
            const userId = users[Math.floor(Math.random() * (users.length - 1)) + 1].id; // random user (not admin ideally, but ok)
            const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
            const numItems = Math.floor(Math.random() * 4) + 1; // 1 to 4 items per order
            
            // Create Order skeleton first to get an ID simulation (since bulkCreate won't give auto-increment IDs easily ahead of time for relations without mapping)
            // We will actually insert orders first, then get them back
            ordersData.push({
                user_id: userId,
                total_amount: 0, // Will update below
                status: status
            });
        }
        const createdOrders = await Orders.bulkCreate(ordersData);

        for (let i = 0; i < createdOrders.length; i++) {
            const order = createdOrders[i];
            const numItems = Math.floor(Math.random() * 4) + 1;
            let orderTotal = 0;

            for (let j = 0; j < numItems; j++) {
                if (keyIndex >= allKeys.length) break; // Out of keys!
                const key = allKeys[keyIndex++];
                // find game corresponding to the key
                const game = games.find(g => g.id === key.game_id);
                if(!game) continue;

                const dp = game.discount ? Math.round(game.price * (1 - game.discount / 100)) : game.price;

                detailsData.push({
                    order_id: order.id,
                    game_id: game.id,
                    game_key_id: key.id.toString(),
                    subtotal: dp
                });
                orderTotal += dp;

                // Mark key as sold if order is completed
                if (order.status === 'completed') {
                    await key.update({ is_sold: true });
                }
            }
            order.total_amount = orderTotal + Math.round(orderTotal * 0.07); // Total + tax
            await order.save();
        }

        await Order_Details.bulkCreate(detailsData);
        console.log(`✓ ${createdOrders.length} Orders created`);
        console.log(`✓ ${detailsData.length} Order Details created`);
        
        console.log('\n🎉 Massive Seed completed successfully!')
        console.log('-------------------------------------------------')
        console.log('Login Info:')
        console.log('Admin: admin@quest.com / Test1234')
        console.log('User: player1@test.com / Test1234')
        console.log('User: mockuser_10@test.com / Test1234 (up to 30)')
        console.log('-------------------------------------------------')
        process.exit(0)

    } catch (error) {
        console.error('Seed error:', error)
        process.exit(1)
    }
}

seedData()
