const axios = require('axios');

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search';
const SPOTIFY_ARTIST_URL = 'https://api.spotify.com/v1/artists';

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

function mapTrack(t) {
  return {
    id: t.id,
    name: t.name,
    artists: t.artists.map(a => a.name).join(', '),
    album: t.album.name,
    image:
      t.album.images && t.album.images[0]
        ? t.album.images[0].url
        : null,
    preview_url: t.preview_url
  };
}

async function fetchTracks(q, limit, token) {
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

  return resp.data.tracks?.items || [];
}

async function searchArtist(q, token) {
  const resp = await axios.get(SPOTIFY_SEARCH_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      q,
      type: 'artist',
      limit: 1
    }
  });

  return resp.data.artists?.items?.[0] || null;
}

async function getArtistTopTracks(artistId, token, market = 'US') {
  const resp = await axios.get(`${SPOTIFY_ARTIST_URL}/${artistId}/top-tracks`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      market
    }
  });

  return resp.data.tracks || [];
}

async function searchTracks(q, limit = 8) {
  try {
    const token = await getAccessToken();
    let items = await fetchTracks(q, limit, token);

    if (!items.length) {
      const artist = await searchArtist(q, token);
      if (artist) {
        items = await getArtistTopTracks(artist.id, token);
      }
    }

    return items.map(mapTrack);
  } catch (error) {
    console.log(
      'ERRO SEARCH TRACKS:',
      error.response?.data || error.message
    );

    throw new Error('Failed to search tracks');
  }
}

module.exports = { searchTracks };