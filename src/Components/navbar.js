import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../API/spotifyapi';

const Navbar = ({ token }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const profile = await getUserProfile(token);
          setUsername(profile.display_name);
        } catch (error) {
          console.error("Error fetching user profile", error);
        }
      }
    };

    console.log(token,username);

    fetchUserProfile();
  }, [token]);

  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src="/assets/Spotifylogo.png"
          alt="Spotify Logo"
          style={{ width: '130px', height: '30px' }}
        />
      </div>
      <div className="menu">
        <Link to="/" className="menu-item">Home</Link>
        <Link to="/search" className="menu-item">Search</Link>
        <Link to="/library" className="menu-item">Your Library</Link>
      </div>
      {token && (
        <div className="user-info">
         
          <Link to="/profile">
            <button className="user-button">
              {username || 'User'}
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
