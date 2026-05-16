const reviews = [];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function createReview({ songId, songName, rating, comment }) {
  const review = {
    id: generateId(),
    songId,
    songName,
    rating,
    comment: comment || '',
    createdAt: new Date().toISOString()
  };
  reviews.push(review);
  return review;
}

function getReviews() {
  return [...reviews];
}

function deleteReview(id) {
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return false;
  reviews.splice(idx, 1);
  return true;
}

// Helper for tests
function _clear() {
  reviews.length = 0;
}

module.exports = { createReview, getReviews, deleteReview, _clear };
