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

        // 3. Generate Games – real titles with verified Steam header images
        // Categories: 0=Action, 1=Adventure, 2=RPG, 3=Horror, 4=Strategy, 5=Simulation, 6=Sports, 7=Racing, 8=Fighting, 9=Puzzle
        const gamesList = [
            // ── Action ──
            { title: 'Grand Theft Auto V', appId: 271590, cat: 0, desc: 'Experience the sprawling open world of Los Santos in this genre-defining action-adventure from Rockstar Games.' },
            { title: 'Counter-Strike 2', appId: 730, cat: 0, desc: 'The next evolution of the world\'s #1 competitive FPS, rebuilt on Source 2 for a new era of Counter-Strike.' },
            { title: 'DOOM Eternal', appId: 782330, cat: 0, desc: 'Rip and tear through hordes of demons in this adrenaline-fueled first-person shooter from id Software.' },
            { title: 'Devil May Cry 5', appId: 601150, cat: 0, desc: 'The ultimate stylish action game returns with three playable characters and insane combo-driven combat.' },
            { title: 'Sekiro: Shadows Die Twice', appId: 814380, cat: 0, desc: 'A brutal action-adventure set in Sengoku Japan, featuring intense sword combat and a gripping revenge story.' },
            { title: 'Black Myth: Wukong', appId: 2358720, cat: 0, desc: 'An action RPG rooted in Chinese mythology, embark on an epic journey inspired by Journey to the West.' },
            { title: 'Armored Core VI: Fires of Rubicon', appId: 1888160, cat: 0, desc: 'Pilot your fully customizable mech in FromSoftware\'s explosive return to the iconic Armored Core franchise.' },
            { title: 'Metal Gear Solid V: The Phantom Pain', appId: 287700, cat: 0, desc: 'Hideo Kojima\'s masterpiece blending stealth and action in an open-world military epic.' },
            { title: 'Monster Hunter: World', appId: 582010, cat: 0, desc: 'Hunt massive creatures in a living, breathing ecosystem in Capcom\'s best-selling action RPG.' },
            { title: 'Hades', appId: 1145360, cat: 0, desc: 'Defy the god of the dead as you battle out of the Underworld in this rogue-like dungeon crawler from Supergiant Games.' },
            { title: 'Marvel\'s Spider-Man Remastered', appId: 1817070, cat: 0, desc: 'Become the iconic web-slinger in this open-world action-adventure set in a stunning Marvel\'s New York.' },
            { title: 'Vampire Survivors', appId: 1794680, cat: 0, desc: 'A gothic horror casual game with rogue-like elements where your choices can allow you to quickly snowball against the hundreds of monsters.' },
            { title: 'Dead Cells', appId: 588650, cat: 0, desc: 'A roguelike-metroidvania with tight combat, permadeath, and procedurally generated levels.' },

            // ── Adventure ──
            { title: 'Red Dead Redemption 2', appId: 1174180, cat: 1, desc: 'An epic tale of life in America\'s unforgiving heartland, featuring a vast open world and an outlaw protagonist.' },
            { title: 'The Witcher 3: Wild Hunt', appId: 292030, cat: 1, desc: 'Become Geralt of Rivia, a monster hunter searching for his adopted daughter in a war-ravaged fantasy world.' },
            { title: 'Cyberpunk 2077', appId: 1091500, cat: 1, desc: 'An open-world RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification.' },
            { title: 'God of War', appId: 1593500, cat: 1, desc: 'Kratos returns as a father and warrior in this Norse mythology-inspired action-adventure masterpiece.' },
            { title: 'Horizon Zero Dawn', appId: 1151640, cat: 1, desc: 'Explore a lush post-apocalyptic world ruled by machines as tribal hunter Aloy uncovers her mysterious past.' },
            { title: 'Hogwarts Legacy', appId: 990080, cat: 1, desc: 'Live the unwritten and embark on your own adventure in the Wizarding World set in the 1800s.' },
            { title: 'It Takes Two', appId: 1426210, cat: 1, desc: 'A genre-bending co-op adventure where two players must work together through fantastical challenges.' },
            { title: 'Disco Elysium: The Final Cut', appId: 632470, cat: 1, desc: 'A groundbreaking detective RPG where your skills are your tools and your fractured mind is your weapon.' },
            { title: 'Stray', appId: 1332010, cat: 1, desc: 'Play as a stray cat navigating a cybercity populated by robots, solving puzzles and uncovering mysteries.' },
            { title: 'Hollow Knight', appId: 367520, cat: 1, desc: 'Forge your own path in this epic action-adventure through a vast ruined kingdom of insects and heroes.' },
            { title: 'Death Stranding', appId: 1190460, cat: 1, desc: 'Hideo Kojima\'s genre-defying experience about reconnecting a fractured society strand by strand.' },
            { title: 'Cult of the Lamb', appId: 1313140, cat: 1, desc: 'Start your own cult in a land of false prophets, venturing out into mysterious regions to build a loyal community.' },

            // ── RPG ──
            { title: 'Elden Ring', appId: 1245620, cat: 2, desc: 'A vast action RPG created by FromSoftware and George R.R. Martin, set in the sprawling Lands Between.' },
            { title: 'Baldur\'s Gate 3', appId: 1086940, cat: 2, desc: 'An epic RPG from Larian Studios set in the Dungeons & Dragons universe with deep narrative and turn-based combat.' },
            { title: 'Persona 5 Royal', appId: 1687950, cat: 2, desc: 'Don the mask of a Phantom Thief and reform corrupt hearts in this award-winning JRPG from ATLUS.' },
            { title: 'Final Fantasy VII Remake Intergrade', appId: 1462040, cat: 2, desc: 'A spectacular reimagining of the legendary RPG, blending real-time action with strategic command-based combat.' },
            { title: 'Dark Souls III', appId: 374320, cat: 2, desc: 'Embrace the darkness in the final chapter of the Dark Souls trilogy with punishing yet rewarding combat.' },
            { title: 'Lies of P', appId: 1627720, cat: 2, desc: 'A souls-like action RPG inspired by Pinocchio, set in a dark Belle Époque world overrun by puppets.' },
            { title: 'Starfield', appId: 1716740, cat: 2, desc: 'Bethesda\'s first new universe in 25 years — an epic space RPG set amongst the stars.' },
            { title: 'Divinity: Original Sin 2', appId: 435150, cat: 2, desc: 'A critically acclaimed RPG with deep tactical combat, rich storytelling, and full cooperative multiplayer.' },
            { title: 'Dragon\'s Dogma 2', appId: 2054970, cat: 2, desc: 'An action RPG featuring an immersive open world with the innovative Pawn companion system.' },
            { title: 'The Elder Scrolls V: Skyrim Special Edition', appId: 489830, cat: 2, desc: 'The legendary open-world RPG remastered with stunning detail, mod support, and all DLC included.' },

            // ── Horror ──
            { title: 'Resident Evil Village', appId: 1196590, cat: 3, desc: 'Ethan Winters faces new horrors in a mysterious European village filled with monstrous creatures.' },
            { title: 'Resident Evil 2', appId: 883710, cat: 3, desc: 'The genre-defining survival horror classic rebuilt from the ground up for a deeper narrative experience.' },
            { title: 'Resident Evil 4', appId: 2050650, cat: 3, desc: 'A reimagining of the revolutionary 2005 game, blending action with survival horror in stunning detail.' },
            { title: 'Phasmophobia', appId: 739630, cat: 3, desc: 'A 4-player online co-op psychological horror where you investigate haunted locations with ghost hunting equipment.' },
            { title: 'Lethal Company', appId: 1966720, cat: 3, desc: 'A co-op horror about scavenging on abandoned moons to meet the Company\'s terrifying profit quota.' },
            { title: 'Dead Space', appId: 1693980, cat: 3, desc: 'The sci-fi survival horror classic returns, rebuilt from the ground up with stunning visuals and immersive audio.' },
            { title: 'Silent Hill 2', appId: 2124490, cat: 3, desc: 'The iconic psychological horror masterpiece remade with modern visuals and reimagined gameplay.' },
            { title: 'The Last of Us Part I', appId: 1888930, cat: 3, desc: 'Experience the emotional and gripping journey of Joel and Ellie in a post-apocalyptic world.' },

            // ── Strategy ──
            { title: 'Sid Meier\'s Civilization VI', appId: 289070, cat: 4, desc: 'Build an empire to stand the test of time in Sid Meier\'s legendary turn-based strategy franchise.' },
            { title: 'Stellaris', appId: 281990, cat: 4, desc: 'Explore a galaxy full of wonders in this sci-fi grand strategy game from Paradox Interactive.' },
            { title: 'Crusader Kings III', appId: 1158310, cat: 4, desc: 'Love, fight, scheme, and claim greatness in the definitive medieval grand strategy experience.' },
            { title: 'Total War: WARHAMMER III', appId: 1142710, cat: 4, desc: 'Command legendary lords and lead vast armies in the epic conclusion to the Total War: WARHAMMER trilogy.' },
            { title: 'XCOM 2', appId: 268500, cat: 4, desc: 'Lead a guerrilla force to reclaim Earth from alien rule in this acclaimed turn-based tactical strategy game.' },
            { title: 'Age of Empires IV', appId: 1466860, cat: 4, desc: 'One of the most beloved real-time strategy franchises returns with a fresh take for a new generation.' },
            { title: 'Frostpunk', appId: 323190, cat: 4, desc: 'As the leader of the last city on Earth, manage resources and make impossible decisions to ensure survival.' },
            { title: 'Slay the Spire', appId: 646570, cat: 4, desc: 'A fusion of card games and roguelikes — craft a unique deck, encounter bizarre creatures, and ascend the Spire.' },
            { title: 'Manor Lords', appId: 1363080, cat: 4, desc: 'A medieval strategy game featuring organic city-building, large-scale tactical battles, and complex economics.' },

            // ── Simulation ──
            { title: 'Stardew Valley', appId: 413150, cat: 5, desc: 'Escape to the countryside and build the farm of your dreams in this beloved farming simulation RPG.' },
            { title: 'Euro Truck Simulator 2', appId: 227300, cat: 5, desc: 'Travel across Europe as a trucker delivering cargo in the most comprehensive trucking simulator ever made.' },
            { title: 'Satisfactory', appId: 526870, cat: 5, desc: 'Build massive factories, automate production lines, and explore an alien planet in first-person.' },
            { title: 'Subnautica', appId: 264710, cat: 5, desc: 'Descend into the depths of an alien underwater world in this breathtaking open-world survival adventure.' },
            { title: 'Valheim', appId: 892970, cat: 5, desc: 'A brutal Viking survival game for 1–10 players set in a procedurally generated purgatory inspired by Norse mythology.' },
            { title: 'No Man\'s Sky', appId: 275850, cat: 5, desc: 'Explore an infinite procedurally generated universe — trade, fight, build, and survive across the stars.' },
            { title: 'Terraria', appId: 105600, cat: 5, desc: 'Dig, fight, explore, and build in this action-packed sandbox adventure with endless possibilities.' },
            { title: 'Palworld', appId: 1623730, cat: 5, desc: 'A multiplayer open-world survival crafting game where you befriend and collect mysterious creatures called Pals.' },

            // ── Sports ──
            { title: 'EA Sports FC 24', appId: 2195250, cat: 6, desc: 'The world\'s game with HyperMotionV technology, PlayStyles, and a revamped Ultimate Team experience.' },
            { title: 'Golf With Your Friends', appId: 431240, cat: 6, desc: 'A fun mini-golf game for up to 12 players with creative courses and competitive multiplayer.' },

            // ── Racing ──
            { title: 'Forza Horizon 5', appId: 1551360, cat: 7, desc: 'Explore the vibrant and ever-evolving open world of Mexico in the ultimate racing and driving experience.' },
            { title: 'Forza Horizon 4', appId: 1293830, cat: 7, desc: 'Race through dynamic seasons in a shared open world set in beautiful historic Britain.' },
            { title: 'Assetto Corsa', appId: 244210, cat: 7, desc: 'The most realistic racing simulator featuring laser-scanned tracks and an advanced tire and physics engine.' },
            { title: 'Need for Speed Heat', appId: 1222680, cat: 7, desc: 'Hustle by day and risk it all at night in this thrilling open-world street racing experience.' },
            { title: 'Wreckfest', appId: 228380, cat: 7, desc: 'Expect epic crashes and hilarious moments in this demolition derby racing game with realistic soft-body physics.' },

            // ── Fighting ──
            { title: 'Street Fighter 6', appId: 1364780, cat: 8, desc: 'Capcom\'s legendary fighting franchise returns with the innovative Drive System and stunning RE Engine visuals.' },
            { title: 'Tekken 8', appId: 1778820, cat: 8, desc: 'The new King of Iron Fist Tournament begins with next-gen visuals and the aggressive Heat System.' },
            { title: 'Mortal Kombat 1', appId: 1971870, cat: 8, desc: 'A new era of Mortal Kombat with a reborn universe, Kameo Fighters, and signature brutal fatalities.' },
            { title: 'Guilty Gear -Strive-', appId: 1384160, cat: 8, desc: 'A visually stunning fighting game that pushes the boundaries of anime-style 2.5D combat to the extreme.' },
            { title: 'Dragon Ball FighterZ', appId: 678950, cat: 8, desc: 'A spectacular 2.5D fighting game featuring iconic Dragon Ball characters with stunning anime-quality visuals.' },

            // ── Puzzle ──
            { title: 'Portal 2', appId: 620, cat: 9, desc: 'The beloved puzzle-platformer returns with new mechanics, co-op mode, and the witty AI antagonist GLaDOS.' },
            { title: 'Baba Is You', appId: 736260, cat: 9, desc: 'A mind-bending puzzle game where you push words around to change the rules of each level.' },
            { title: 'Return of the Obra Dinn', appId: 802130, cat: 9, desc: 'An insurance mystery puzzle set aboard a ghost ship, featuring a unique 1-bit art style by Lucas Pope.' },
            { title: 'The Witness', appId: 210970, cat: 9, desc: 'An exploration-puzzle game on a mysterious island filled with hundreds of interconnected panel puzzles.' },
            { title: 'Tetris Effect: Connected', appId: 1003590, cat: 9, desc: 'The iconic puzzle game reimagined with mesmerizing visuals, music, and connected multiplayer modes.' },
            { title: 'Cuphead', appId: 268910, cat: 9, desc: 'A run-and-gun action game with stunning 1930s cartoon hand-drawn visuals and challenging boss battles.' },
        ];

        const priceOptions = [590, 890, 1290, 1590, 1790, 1990, 2490];
        const gamesData = gamesList.map(g => ({
            category_id: categories[g.cat].id,
            title: g.title,
            description: g.desc,
            price: priceOptions[Math.floor(Math.random() * priceOptions.length)],
            discount: Math.random() > 0.7 ? [10, 15, 20, 25, 30, 40, 50, 75][Math.floor(Math.random() * 8)] : null,
            image_url: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appId}/header.jpg`
        }));
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