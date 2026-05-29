const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.post('/', reviewsController.create);

router.get('/', reviewsController.list);

router.get('/search', reviewsController.search);

router.delete('/:id', reviewsController.remove);

module.exports = router;