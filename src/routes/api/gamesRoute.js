const express = require('express');
const router = express.Router();
const { getAllGames } = require('../game/game.controller');

router.get('/games', getAllGames);

module.exports = router;
