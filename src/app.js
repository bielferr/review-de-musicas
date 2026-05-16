const express = require('express');
const cors = require('cors');
const path = require('path');

const songsRoutes = require('./routes/songs');
const reviewsRoutes = require('./routes/reviews');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/songs', songsRoutes);
app.use('/reviews', reviewsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
