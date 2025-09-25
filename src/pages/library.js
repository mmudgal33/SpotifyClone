import React, { useEffect, useState } from 'react';
import { List, Music, PlayCircle, Heart, PlusCircle, Trash2, Edit2 } from 'lucide-react';
import { getUserPlaylists, getPlaylistTracks, playSongOrPlaylist, getLikedSongs, getTopTracks, createPlaylist, removeTrackFromPlaylist, renamePlaylist } from '../API/spotifyapi';

const Library = ({ token, deviceId, onTrackSelect }) => {
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [queue, setQueue] = useState([]);
  
  const [renamingPlaylistId, setRenamingPlaylistId] = useState(null);
  const [renameInputValue, setRenameInputValue] = useState('');

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        if (token) {
          const [userPlaylists, likedSongsData, topTracksData] = await Promise.all([
            getUserPlaylists(token),
            getLikedSongs(token),
            getTopTracks(token),
          ]);
          setPlaylists(userPlaylists);
          setLikedSongs(likedSongsData);
          setTopTracks(topTracksData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [token]);

  const handlePlaylistClick = async (playlist) => {
    setSelectedPlaylist(playlist);
    try {
      let tracks = [];
      if (playlist.name === 'Liked Songs') {
        tracks = likedSongs.map((item) => ({
          track: item,
        }));
      } else if (playlist.name === 'Your Top Tracks') {
        tracks = topTracks.map((item) => ({
          track: item,
        }));
      } else {
        tracks = await getPlaylistTracks(playlist.id, token);
      }
      setPlaylistTracks(tracks);
      setQueue(tracks.map((item) => item.track.uri));
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  const handlePlayPlaylist = async (playlist) => {
    try {
      const tracks = await getPlaylistTracks(playlist.id, token);
      if (tracks.length > 0) {
        const trackUris = tracks.map((item) => item.track.uri);
        await playSongOrPlaylist(trackUris, token, deviceId, true);
        setQueue(trackUris);
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  const handlePlayTrack = async (trackUri, track) => {
    if (!track || !track.uri) {
      console.error('Track is undefined or invalid.');
      return;
    }
    try {
      await playSongOrPlaylist([trackUri], token, deviceId, false);
      onTrackSelect(track);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    const trimmedName = newPlaylistName.trim();
    
    if (!trimmedName) {
      alert('Please enter a playlist name');
      return;
    }

    try {
      const newPlaylist = await createPlaylist(token, trimmedName);
      
      if (newPlaylist && newPlaylist.id) {
        setPlaylists(prevPlaylists => [newPlaylist, ...prevPlaylists]);
        
        setNewPlaylistName('');
      } else {
        throw new Error('Failed to create playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert(`Failed to create playlist: ${error.message}`);
    }
  };

  const handleRemoveTrack = async (playlistId, trackId) => {
    try {
      await removeTrackFromPlaylist(playlistId, trackId, token);
      setPlaylistTracks(playlistTracks.filter(item => item.track.id !== trackId));
    } catch (error) {
      console.error('Error removing track:', error);
    }
  };

  const handleRenamePlaylist = async () => {
    if (!renameInputValue.trim()) {
      alert('Playlist name cannot be empty');
      return;
    }

    try {
      await renamePlaylist(renamingPlaylistId, renameInputValue, token);
      
      
      setPlaylists(prevPlaylists => 
        prevPlaylists.map(playlist => 
          playlist.id === renamingPlaylistId 
            ? { ...playlist, name: renameInputValue } 
            : playlist
        )
      );

      if (selectedPlaylist && selectedPlaylist.id === renamingPlaylistId) {
        setSelectedPlaylist(prev => ({ ...prev, name: renameInputValue }));
      }

      setRenamingPlaylistId(null);
      setRenameInputValue('');
    } catch (error) {
      console.error('Error renaming playlist:', error);
      alert('Failed to rename playlist');
    }
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Music className="animate-pulse text-green-500" size={32} />
          <span className="text-gray-400">Loading library...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 h-full w-full flex">
      <div className="w-80 bg-gray-800 p-4 border-r border-gray-700">
        <div className="flex items-center mb-6">
          <List size={50} className="mr-3 text-green-500" />
          <h3 className="text-2xl font-bold text-white">Your Library</h3>
          <div className="w-80 bg-gray-800 p-4 border-r border-gray-700">
  


</div>

        </div>

        <div className="space-y-2 mt-12">
          <div className="space-y-4">
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleCreatePlaylist}
                className="mt-2 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
              >
                Create Playlist
              </button>
            </div>
          </div>

          {/* Adding Liked Songs and Your Top Tracks back */}
          <div className="space-y-2">
            <div
              className="flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => handlePlaylistClick({ name: 'Liked Songs', tracks: likedSongs })}
            >
              <Heart className="text-red-500 mr-4" size={24} />
              <div className="flex-grow">
                <h2 className="text-white font-semibold truncate">Liked Songs</h2>
                <p className="text-sm text-gray-400">{likedSongs.length} songs</p>
              </div>
              <PlayCircle
                size={24}
                className="text-green-500 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPlaylist({ name: 'Liked Songs', tracks: likedSongs });
                }}
              />
            </div>

            <div
              className="flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => handlePlaylistClick({ name: 'Your Top Tracks', tracks: topTracks })}
            >
              <Music className="text-yellow-500 mr-4" size={24} />
              <div className="flex-grow">
                <h2 className="text-white font-semibold truncate">Your Top Tracks</h2>
                <p className="text-sm text-gray-400">{topTracks.length} songs</p>
              </div>
              <PlayCircle
                size={24}
                className="text-green-500 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPlaylist({ name: 'Your Top Tracks', tracks: topTracks });
                }}
              />
            </div>
          </div>

          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer group transition"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <img
                src={playlist.images && playlist.images[0] ? playlist.images[0].url : 'https://via.placeholder.com/64'}
                alt={playlist.name}
                className="w-16 h-16 rounded-md mr-4 object-cover"
              />
              <div className="flex-grow">
                <h2 className="text-white font-semibold truncate max-w-[200px]">
                  {playlist.name}
                </h2>
                <p className="text-sm text-gray-400">{playlist.tracks.total} songs</p>
              </div>
              <PlayCircle
                size={24}
                className="text-green-500 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPlaylist(playlist);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow bg-gray-900 p-4">
        {selectedPlaylist ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-2xl flex items-center">
                {renamingPlaylistId === selectedPlaylist.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={renameInputValue}
                      onChange={(e) => setRenameInputValue(e.target.value)}
                      className="bg-gray-700 text-white px-2 py-1 rounded mr-2"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleRenamePlaylist();
                        }
                      }}
                    />
                    <button 
                      onClick={handleRenamePlaylist}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setRenamingPlaylistId(null);
                        setRenameInputValue('');
                      }}
                      className="bg-gray-700 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {selectedPlaylist.name}
                    {selectedPlaylist.name !== 'Your Top Tracks' && (
                      <Edit2
                        size={20}
                        className="text-gray-400 hover:text-white ml-4 cursor-pointer"
                        onClick={() => {
                          setRenamingPlaylistId(selectedPlaylist.id);
                          setRenameInputValue(selectedPlaylist.name);
                        }}
                      />
                    )}
                  </>
                )}
              </h2>
            </div>

            <div className="space-y-4">
              {playlistTracks.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 hover:bg-gray-800 rounded-md cursor-pointer"
                  onClick={() => handlePlayTrack(item.track.uri, item.track)}
                >
                  <img
                    src={item.track?.album?.images[0]?.url || 'https://via.placeholder.com/64'}
                    alt={item.track?.name}
                    className="w-12 h-12 rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-white font-semibold">{item.track?.name}</h3>
                    <p className="text-sm text-gray-400">
                      {item.track?.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist'}
                    </p>
                  </div>
                  <Trash2
                    size={24}
                    className="text-red-500 ml-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTrack(selectedPlaylist.id, item.track.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-400">Select a playlist to view tracks.</p>
        )}
      </div>
    </div>
  );
};

export default Library;