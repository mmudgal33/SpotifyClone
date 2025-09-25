const fetch = require('node-fetch');
const { SPOTIFY_API_URL } = process.env;


const getUserPlaylists = async (req, res) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();
    const playlists = data.items;


    return res.status(200).json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return res.status(500).json({ error: 'Failed to fetch playlists from Spotify' });
  }
};


const likeSong = (req, res) => {
  
};

const getLikedSongs = (req, res) => {
  
};

const removeLikedSong = (req, res) => {
  
};

module.exports = {
  likeSong,
  getLikedSongs,
  removeLikedSong,
  getUserPlaylists,
};
