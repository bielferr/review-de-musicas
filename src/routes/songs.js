const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');

router.get('/search', songsController.search);

module.exports = router;
