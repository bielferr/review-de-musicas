const axios = require('axios');

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';

let tokenCache = {
  token: null,
  expiresAt: 0
};

async function getAccessToken() {
  const now = Date.now();

  // usa token salvo se ainda estiver válido
  if (tokenCache.token && tokenCache.expiresAt > now) {
    return tokenCache.token;
  }

  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!id || !secret) {
    throw new Error('Spotify credentials not set in environment');
  }

  const auth = Buffer.from(`${id}:${secret}`).toString('base64');

  try {
    const resp = await axios.post(
      SPOTIFY_TOKEN_URL,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('TOKEN GERADO:', resp.data);

    const { access_token, expires_in } = resp.data;

    tokenCache.token = access_token;
    tokenCache.expiresAt = now + (expires_in - 60) * 1000;

    return access_token;

  } catch (error) {
    console.log(
      'ERRO SPOTIFY TOKEN:',
      error.response?.data || error.message
    );

    throw new Error('Failed to get Spotify token');
  }
}

async function searchTracks(q, limit = 8) {
  try {
    const token = await getAccessToken();

    const resp = await axios.get(SPOTIFY_SEARCH_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q,
        type: 'track',
        limit
      }
    });

    const items = resp.data.tracks.items || [];

    return items.map((t) => ({
      id: t.id,
      name: t.name,
      artists: t.artists.map(a => a.name).join(', '),
      album: t.album.name,
      image:
        t.album.images && t.album.images[0]
          ? t.album.images[0].url
          : null,
      preview_url: t.preview_url
    }));

  } catch (error) {
    console.log(
      'ERRO SEARCH TRACKS:',
      error.response?.data || error.message
    );

    throw new Error('Failed to search tracks');
  }
}

module.exports = { searchTracks };