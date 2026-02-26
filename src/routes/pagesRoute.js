const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.render('home'))
router.get('/login', (req, res) => res.render('login'))
// router.get('/register', (req, res) => res.render('register'))
router.get('/home', (req, res) => res.render('home'))

router.get('/allgame', (req, res) => {res.render('allgame');});
module.exports = router