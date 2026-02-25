const { deleteUser } = require('../src/controllers/usersController');
const { games } = require('../src/models'); 
const { getImageUrlById } = require('./game.idurl');


async function getAllGames(req, res) {
    const allGames = await games.findAll();
    const gameWithImgUrl = allGames.map(game => ({
        ...game.toJSON(),
        imageUrl: getImageUrlById(game.img) 
    }));
    res.json(gameWithImgUrl);
}

const createGame = async (req, res) => {
    try {
        const { name, description, price, discountPrice, status, slug, img } = req.body;
        const game = await games.create({ name, description, price, discountPrice, status, slug, img });    
        res.status(201).json({
            message: 'Created category succesfully',
            category: {

                name:game.name,
                description:game.description,
                price:game.price,
                discountPrice:game.discountPrice,
                status:game.status,
                slug:game.slug,
                img:game.img

            }
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateGame = async (req, res) => {
    try {
        const game = await games.findByPk(req.params.name)
        if (!game) return res.status(404).json({ error: 'Not found Game!' })
        await game.update(req.body)
        res.status(200).json({ message: 'Updated Game', user })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteGame = async (req, res) => {
    try {
        const game = await games.findByPk(req.params.name)
        if (!game) return res.status(404).json({ error: 'Not found Game' })
        await game.destroy()
        res.status(200).json({ message: 'Deleted Game' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}




module.exports = { 
    getAllGames,
    createGame,
    updateGame,
    deleteGame

 };