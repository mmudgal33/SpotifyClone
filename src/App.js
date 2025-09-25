import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAccessToken } from './API/spotifyapi';


import Navbar from './Components/navbar';
import Player from './Components/player';
import Search from './pages/search';
import Home from './pages/home';
import Library from './pages/library';
import Profile from './pages/profile';

import './index.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [player, setPlayer] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const initializePlayer = async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token.');
        return;
      }
      setToken(accessToken);
      console.log(accessToken)

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: 'Spotify Player',
          getOAuthToken: (cb) => cb(accessToken),
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Player is ready with Device ID:', device_id);
          setDeviceId(device_id);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Player not ready with Device ID:', device_id);
        });

        spotifyPlayer.addListener('player_state_changed', (state) => {
          if (state) {
            setCurrentTrack(state.track_window.current_track);
          }
        });

        spotifyPlayer.connect();
        setPlayer(spotifyPlayer);
      };

      if (!window.Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    initializePlayer();
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar token={token} />
        <div className="app-body">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home token={token} />} />
              <Route
                path="/search"
                element={
                  <Search
                    token={token}
                    deviceId={deviceId}
                    onTrackSelect={setCurrentTrack}
                  />
                }
              />
              <Route
                path="/library"
                element={
                  <Library
                    token={token}
                    deviceId={deviceId}
                    onTrackSelect={setCurrentTrack}
                    queue={queue}
                    setQueue={setQueue}
                  />
                }
              />
              <Route path="/" element={<Home token={token} />} />
              <Route path="/profile" element={<Profile token={token} deviceId={deviceId} />} />
            </Routes>
          </div>
        </div>
        <Player
          player={player}
          token={token}
          currentTrack={currentTrack}
          queue={queue}
          setQueue={setQueue}
          setCurrentTrack={setCurrentTrack}
        />
      </div>
    </Router>
  );
};

export default App;
