const spotifyService = require('../services/spotifyService');

async function search(req, res) {
  try {
    const q = req.query.q;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'Query param "q" is required' });
    }

    const tracks = await spotifyService.searchTracks(q);
    res.json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
}

module.exports = { search };
