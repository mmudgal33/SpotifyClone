import axios from 'axios';
import queryString from 'query-string';

const API_URL = 'https://api.spotify.com/v1';

const REFRESH_URL = 'https://accounts.spotify.com/api/token';

export const refreshAccessToken = async (refreshToken, clientId, clientSecret) => {
  const response = await axios.post(REFRESH_URL, new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }), {
    headers: {
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
    },
  });

  return response.data.access_token;
};


const getAccessTokenFromURL = () => {
  const parsed = queryString.parse(window.location.hash);
  return parsed.access_token;
};



let accessToken = null;

export const getAccessToken = async () => {
  if (accessToken) return accessToken; 


  const tokenFromURL = getAccessTokenFromURL();
  if (tokenFromURL) {
    accessToken = tokenFromURL; 
    window.history.pushState({}, null, '/'); 
    return accessToken;
  }

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const scope = 'user-library-read user-read-playback-state playlist-read-collaborative playlist-read-private user-modify-playback-state user-read-private user-read-email streaming user-top-read playlist-modify-public playlist-modify-private user-library-modify';
  window.location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&show_dialog=true`;

  return null; 
};


export const renamePlaylist = async (playlistId, newName, token) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'PUT', 
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newName, 
      }),
    });

    
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error details:', errorDetails);
      throw new Error(`Failed to rename playlist: ${errorDetails.error.message}`);
    }

    
    if (response.status === 200) {
      console.log('Playlist renamed successfully');
    }

    const updatedPlaylist = await response.json();
    console.log('Playlist renamed successfully:', updatedPlaylist);
    return updatedPlaylist;
  } catch (error) {
    console.error('Error renaming playlist:', error);
    throw error;
  }
};



export const removeTrackFromPlaylist = async (playlistId, trackId, token) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracks: [{ uri: `spotify:track:${trackId}` }],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove track from playlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing track:', error);
    throw error;
  }
};


export const fetchUserPlaylists = async (token) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();
    return data.items; 
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

export const addToPlaylist = async (trackId, token, playlistId) => {
  try {
    if (!playlistId) {
      throw new Error('Playlist ID is missing');
    }

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [`spotify:track:${trackId}`], 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add song to playlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
};





export const addToLikes = async (trackId, token) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [trackId] }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Failed to add song to likes:', errorDetails);
      throw new Error(`Failed to add song to likes. Status: ${response.status}`);
    }

    if (response.status === 204) {
      console.log('Track added to likes successfully');
      return { success: true }; 
    }

    return {}; 
  } catch (error) {
    console.error('Error adding song to likes:', error);
    throw error;
  }
};






export const createPlaylist = async (token, name, description) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
        public: false, 
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create playlist');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};



export const getTopTracks = async (token) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const data = await response.json();
    return data.items;  
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
};


export const fetchFromSpotify = async (endpoint, token) => {
  try {
    const response = await axios.get(API_URL + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching from Spotify API", error);
    return null;
  }
};

export const getUserProfile = async (token) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const data = await response.json();
  return data;
};


export const getUserPlaylists = async (token) => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch playlists');
  }

  const data = await response.json();
  return data.items;
};


export const getPlaylistTracks = async (playlistId, token) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist tracks for ID: ${playlistId}`);
    }

    const data = await response.json();
    return data.items; 
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    return [];
  }
};


const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';

export const getAuthUrl = (clientId, redirectUri, scopes) => 
  `${SPOTIFY_AUTH_URL}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;

export const searchTracks = async (query) => {
  const token = await getAccessToken(); 
  if (!token) {
    console.warn('Token is missing. Please ensure you are authenticated.');
    return [];
  }

  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        q: query,
        type: 'track',
        limit: 50,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.tracks.items;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.error('Access token expired or invalid. Please refresh the token.');
    } else {
      console.error(Error `during search. Query: ${query}. Details:`, err.message);
    }
    return [];
  }
};

const handleTokenRefresh = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('No refresh token available. User may need to reauthorize.');
    return null;
  }

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

  try {
    const newAccessToken = await refreshAccessToken(refreshToken, clientId, clientSecret);
    accessToken = newAccessToken;
    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
};


export const getNewReleases = async (token) => {
  try {
    const response = await fetch(
      'https://api.spotify.com/v1/browse/new-releases',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log('API Response:', response);
      console.error('Error fetching new releases:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.albums || !data.albums.items) {
      throw new Error('Invalid response structure');
    }

    console.log('New releases data:', data.albums.items);
    return data.albums.items;
  } catch (error) {
    console.error('Error in getNewReleases:', error.message);
    return [];
  }
};




export const getLikedSongs = async (token) => {
  try {
    console.log('Fetching liked songs with token:', token ? 'Token present' : 'No token');

    const response = await fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Spotify API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });

      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();


    if (!data.items || !Array.isArray(data.items)) {
      console.error('Unexpected API response structure:', data);
      throw new Error('Invalid liked songs data structure');
    }

  

    return data.items.map(item => item.track);

  } catch (error) {
    console.error('Comprehensive error in getLikedSongs:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    if (error.name === 'AbortError') {
      console.error('Request timed out');
    }

    throw error;
  }
};

export const playSong = async (trackUri, token, deviceId) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [trackUri] }),
    });

    if (response.ok) {
      console.log('Playback started successfully!');
    } else {
      const errorData = await response.json();
      console.error('Error starting playback:', errorData);
    }
  } catch (error) {
    console.error('Error in playSong function:', error.message);
  }
};



export const playSongOrPlaylist = async (urisOrContext, token, deviceId, isContext) => {
  try {
    
    if (!deviceId) {
      console.warn("Device ID is undefined. Attempting to fetch active devices...");
      const devicesResponse = await fetch(`https://api.spotify.com/v1/me/player/devices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const devicesData = await devicesResponse.json();

      const activeDevice = devicesData.devices.find((device) => device.is_active);
      if (!activeDevice) {
        throw new Error("No active device found. Please start playback on a Spotify app.");
      }
      deviceId = activeDevice.id;
      console.log("Using active device:", deviceId);
    }

    
    const payload = isContext
      ? { context_uri: urisOrContext }
      : { uris: urisOrContext };

    console.log("Request payload:", payload);

    
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.error?.message || "Playback failed");
    }

    console.log("Playback started successfully!");
  } catch (error) {
    console.error("Error in playSongOrPlaylist:", error.message);
    if (error.message.includes("Malformed json")) {
      console.error("Check the payload structure and ensure URIs or context URIs are valid.");
    }
    if (error.message.includes("Restriction violated")) {
      console.error("The track or album might not be playable due to regional or licensing restrictions.");
    }
  }
};

