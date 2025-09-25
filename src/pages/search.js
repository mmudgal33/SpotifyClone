import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, PlusCircle, Heart } from 'lucide-react';
import {
  playSong,
  searchTracks,
  addToPlaylist,
  addToLikes,
  fetchUserPlaylists,
  getLikedSongs,
} from '../API/spotifyapi';

const Search = ({ token, deviceId, onTrackSelect }) => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null); 

  useEffect(() => {
    if (token) {
      fetchUserPlaylists(token)
        .then(setPlaylists)
        .catch((error) => console.error('Error fetching playlists:', error));

      getLikedSongs(token)
        .then((likedSongs) => setLikedTracks(likedSongs.map((track) => track.id)))
        .catch((error) => console.error('Error fetching liked songs:', error));
    }
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query || !token) return;

    setLoading(true);
    try {
      const results = await searchTracks(query, token);
      setTracks(results);
    } catch (error) {
      console.error('Error fetching search results:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackClick = async (track) => {
    if (!deviceId) {
      console.error('No device ID found.');
      return;
    }

    try {
      await playSong(track.uri, token, deviceId);
      onTrackSelect(track);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handleToggleLike = async (track) => {
    const isLiked = likedTracks.includes(track.id);

    try {
      if (isLiked) {
        await fetch(`https://api.spotify.com/v1/me/tracks?ids=${track.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setLikedTracks((prev) => prev.filter((id) => id !== track.id));
        console.log(`Removed ${track.name} from likes.`);
      } else {
        await addToLikes(track.id, token);
        setLikedTracks((prev) => [...prev, track.id]);
        console.log(`Added ${track.name} to likes.`);
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  const handleAddToPlaylist = (track) => {
    setCurrentTrack(track); 
    setShowPlaylistModal(true); 
  };

  const handlePlaylistSelection = async (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setShowPlaylistModal(false);

    try {
      if (currentTrack) {
        await addToPlaylist(currentTrack.id, token, playlistId);
        console.log(`Track "${currentTrack.name}" added to playlist.`);
        alert(`Added "${currentTrack.name}" to the selected playlist.`);
        setCurrentTrack(null); 
      }
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      alert('Failed to add track to playlist.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for songs, artists, or albums"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg bg-gray-800 text-white rounded-full focus:outline-none focus:ring-0"
            />
            <SearchIcon
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={24}
            />
            <button
              type="submit"
              disabled={loading || !token}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Search Results */}
        {tracks.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg group cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <div className="relative" onClick={() => handleTrackClick(track)}>
                  <img
                    src={track.album.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={track.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                    <Play
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      size={48}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-bold truncate">{track.name}</h3>
                  <p className="text-gray-400 text-sm truncate">
                    {track.artists.map((artist) => artist.name).join(', ')}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToPlaylist(track);
                      }}
                      className="text-green-500 hover:text-green-400 focus:outline-none focus:ring-0"
                    >
                      <PlusCircle size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(track);
                      }}
                      className={`transition-colors focus:outline-none focus:ring-0 ${
                        likedTracks.includes(track.id)
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={likedTracks.includes(track.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Playlist Modal */}
        {showPlaylistModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
              <h3 className="text-white text-lg mb-4">Select a Playlist</h3>
              <div className="space-y-4">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlaylistSelection(playlist.id)}
                    className="w-full text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                  >
                    {playlist.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
