const reviewsService = require('../services/reviewsService');

async function create(req, res) {
  try {
    const { songId, songName, rating, comment } = req.body;
    if (!songId || !songName) {
      return res.status(400).json({ error: 'songId and songName are required' });
    }

    const num = Number(rating);
    if (Number.isNaN(num) || num < 0 || num > 10) {
      return res.status(400).json({ error: 'rating must be a number between 0 and 10' });
    }

    const created = reviewsService.createReview({ songId, songName, rating: num, comment });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
}

async function list(req, res) {
  try {
    const all = reviewsService.getReviews();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list reviews' });
  }
}

async function remove(req, res) {
  try {
    const id = req.params.id;
    const ok = reviewsService.deleteReview(id);
    if (!ok) return res.status(404).json({ error: 'Review not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
}

module.exports = { create, list, remove };
