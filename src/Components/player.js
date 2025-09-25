import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Volume1, VolumeX } from 'lucide-react';
import { playSongOrPlaylist } from '../API/spotifyapi';

const Player = ({ player, token, currentTrack, queue, setQueue, setCurrentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const intervalRef = useRef();

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (!player) return;

    const updateState = (state) => {
      if (state) {
        setIsPlaying(!state.paused);
        setCurrentTime(state.position);
        setDuration(state.duration);
        setProgress((state.position / state.duration) * 100);
      }
    };

    player.addListener('player_state_changed', updateState);

    return () => {
      player.removeListener('player_state_changed', updateState);
    };
  }, [player]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + 1000;
          return nextTime >= duration ? duration : nextTime;
        });
        setProgress((currentTime / duration) * 100);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentTime, duration]);

  const togglePlayPause = async () => {
    if (!player) {
      console.error('Player instance is not initialized.');
      return;
    }

    try {
      if (isPlaying) {
        await player.pause();
      } else {
        if (currentTrack && currentTrack.uri) {
          await playSongOrPlaylist([currentTrack.uri], token, player.device_id, false);
        } else {
          console.error('No track selected.');
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  
  

  const handleVolumeChange = (e) => {
    if (!player) {
      console.error('Player instance is not initialized.');
      return;
    }
    const value = parseInt(e.target.value, 10);
    setVolume(value);
    player.setVolume(value / 100);
  };

  const handleProgressChange = async (e) => {
    if (!player) {
      console.error('Player instance is not initialized.');
      return;
    }
    const newProgress = parseInt(e.target.value, 10);
    const newTime = (newProgress / 100) * duration;
    await player.seek(newTime);
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="player">
      <div className="track-info flex items-center space-x-4">
        <img
          className="w-16 h-16 rounded-md object-cover"
          src={currentTrack?.album?.images[0]?.url || 'https://imgs.search.brave.com/KRn9aMEYMCrckqUhw0M5zv-jef3Uxmy6BCaJPSDxiX0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjQw/OTE1NTk2L3Bob3Rv/L3lvdW5nLXdvbWFu/LWVuam95cy12aWV3/LW92ZXIteWFuZ3No/dW8ta2Fyc3QtbW91/bnRhaW5zLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1TOWI2/OVp5Ump6elgwZkFY/M2JfdW4xb21YOHVs/d2p2aUFUaHJkM0pJ/aVdZPQ'}
          alt={currentTrack?.name || 'Track'}
        />
        <div className="truncate">
          <p className="track-name text-white font-semibold text-sm truncate max-w-[200px]">
            {currentTrack?.name || 'No Track Selected'}
          </p>
          <p className="track-artists text-gray-400 text-xs truncate max-w-[200px]">
            {currentTrack?.artists?.map((artist) => artist.name).join(', ') || 'Unknown Artist'}
          </p>
        </div>
      </div>

      <div className="controls">
        <button >
          <SkipBack />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button >
          <SkipForward />
        </button>
      </div>

      <div className="progress">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="volume flex items-center space-x-2">
        <VolumeIcon />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-32"
        />
      </div>
    </div>
  );
};

export default Player;
