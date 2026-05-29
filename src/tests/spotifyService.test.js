const axios = require('axios');
const spotifyService = require('../services/spotifyService');

jest.mock('axios');

describe('spotifyService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.SPOTIFY_CLIENT_ID = 'mock-id';
    process.env.SPOTIFY_CLIENT_SECRET = 'mock-secret';
  });

  afterEach(() => {
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;
  });

  test('retorna top tracks do artista quando a busca por track não encontra resultados', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        access_token: 'mock-token',
        expires_in: 3600
      }
    });

    axios.get
      .mockResolvedValueOnce({ data: { tracks: { items: [] } } })
      .mockResolvedValueOnce({ data: { artists: { items: [{ id: 'artist1', name: 'Artist Name' }] } } })
      .mockResolvedValueOnce({
        data: {
          tracks: [
            {
              id: 'track1',
              name: 'Song 1',
              artists: [{ name: 'Artist Name' }],
              album: {
                name: 'Album 1',
                images: [{ url: 'https://example.com/image.jpg' }]
              },
              preview_url: 'https://example.com/preview.mp3'
            }
          ]
        }
      });

    const tracks = await spotifyService.searchTracks('Artist Name');

    expect(tracks).toEqual([
      {
        id: 'track1',
        name: 'Song 1',
        artists: 'Artist Name',
        album: 'Album 1',
        image: 'https://example.com/image.jpg',
        preview_url: 'https://example.com/preview.mp3'
      }
    ]);
  });
});
