import React, { useEffect, useState } from 'react';
import { Home as HomeIcon, AudioLines } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getNewReleases, playSongOrPlaylist } from '../API/spotifyapi';

const Home = ({ token, deviceId, setCurrentTrack }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [newReleases, setNewReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          setIsLoading(true);
          const [profile, releases] = await Promise.all([
            getUserProfile(token),
            getNewReleases(token),
          ]);

          setUserProfile(profile);

          if (releases && Array.isArray(releases)) {
            setNewReleases(releases);
          } else {
            console.error('Invalid releases structure:', releases);
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [token]);

  const ensureActiveDevice = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { devices } = await response.json();

      if (!devices || devices.length === 0) {
        alert('No active devices found. Please start playing a song on a Spotify app.');
        return null;
      }

      const activeDeviceId = devices[0]?.id; 
      if (!activeDeviceId) {
        alert('No active device found. Please activate a Spotify player.');
        return null;
      }

      return activeDeviceId;
    } catch (error) {
      console.error('Error ensuring active device:', error.message);
      return null;
    }
  };

  const handlePlayAlbum = async (album) => {
    if (!album || !album.id) {
      console.error("Invalid album or missing ID");
      return;
    }
  
    try {
      console.log("Fetching album details for:", album.id);
  
      const albumDetails = await fetch(
        `https://api.spotify.com/v1/albums/${album.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());
  
      console.log("Fetched album details:", albumDetails);
  
      if (albumDetails.tracks?.items) {
        const trackUris = albumDetails.tracks.items
          .filter((track) => track.is_playable !== false)
          .map((track) => track.uri);
  
        if (trackUris.length === 0) {
          console.warn("No playable tracks in the album.");
          return;
        }
  
        console.log("Playable track URIs:", trackUris);
  
        const payload = trackUris.length > 1
          ? album.uri 
          : trackUris; 
  
        console.log("Request payload:", payload);
  
        if (!deviceId) {
          console.error("Device ID is undefined. Attempting to fetch active devices...");
          const activeDeviceId = await ensureActiveDevice();
          if (!activeDeviceId) return; 
          deviceId = activeDeviceId;
        }
  
        
        await playSongOrPlaylist(payload, token, deviceId, trackUris.length > 1);
      } else {
        console.error("Failed to fetch album tracks.");
      }
    } catch (error) {
      console.error("Error playing album:", error.message);
    }
  };
  
  

  const MusicSection = ({ title, albums, icon: Icon }) => (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-4">
        <Icon className="mr-3 text-green-500" size={24} />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">Loading new releases...</p>
        </div>
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition duration-300 group"
            >
              <div className="relative">
                <img
                  src={album.images[0]?.url || 'https://via.placeholder.com/300'}
                  alt={album.name}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              </div>
              <div className="mt-2">
                <h3
                  className="text-white font-semibold text-lg truncate cursor-pointer"
                  onClick={() => handlePlayAlbum(album)}
                >
                  {album.name}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {album.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">No new releases available</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <HomeIcon size={32} className="mr-4 text-green-500" />
          <h1 className="text-3xl font-bold">
            {userProfile ? `Welcome, ${userProfile.display_name}` : 'Welcome to Spotify'}
          </h1>
        </div>
        {userProfile && (
          <div
            className="flex items-center cursor-pointer hover:bg-gray-800 p-2 rounded-full transition"
            onClick={() => navigate('/profile')}
          >
            <img
              src={userProfile.images?.[0]?.url || 'https://via.placeholder.com/50'}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-2"
            />
            <span>{userProfile.display_name}</span>
          </div>
        )}
      </div>

      <MusicSection title="New Releases" albums={newReleases} icon={AudioLines} />
    </div>
  );
};

export default Home;
