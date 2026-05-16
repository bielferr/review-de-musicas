const request = require('supertest');
const app = require('../app');
const reviewsService = require('../services/reviewsService');

beforeEach(() => {
  reviewsService._clear();
});

describe('Reviews API', () => {
  test('create review', async () => {
    const payload = { songId: 's1', songName: 'Song 1', rating: 8, comment: 'Ótima' };
    const res = await request(app).post('/reviews').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.songId).toBe('s1');
  });

  test('get reviews', async () => {
    const payload = { songId: 's2', songName: 'Song 2', rating: 7, comment: '' };
    await request(app).post('/reviews').send(payload);
    const res = await request(app).get('/reviews');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('invalid rating', async () => {
    const payload = { songId: 's3', songName: 'Song 3', rating: 11 };
    const res = await request(app).post('/reviews').send(payload);
    expect(res.statusCode).toBe(400);
  });

  test('delete review', async () => {
    const payload = { songId: 's4', songName: 'Song 4', rating: 6 };
    const create = await request(app).post('/reviews').send(payload);
    const id = create.body.id;
    const del = await request(app).delete(`/reviews/${id}`);
    expect(del.statusCode).toBe(200);
    const list = await request(app).get('/reviews');
    expect(list.body.find(r => r.id === id)).toBeUndefined();
  });
});
