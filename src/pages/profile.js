import React, { useEffect, useState } from 'react';
import { User, Music2, UsersRound } from 'lucide-react';


const fetchUserProfile = async (token) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await response.json();
};

const Profile = ({ token }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (token) {
          const profile = await fetchUserProfile(token); 
          setUserProfile(profile); 
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData(); 
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse w-20 h-20 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-black p-6">
      <div className="max-w-2xl mx-auto bg-black/50 rounded-xl shadow-2xl overflow-hidden">
        <div className="relative">
          {/* Profile Image */}
          <div className="h-64 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
            {userProfile.images?.length > 0 ? (
              <img
                src={userProfile.images[0]?.url}
                alt={`${userProfile.display_name}'s profile`}
                className="w-48 h-48 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <User className="w-48 h-48 text-white/70" />
            )}
          </div>

          {/* Profile Details */}
          <div className="p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{userProfile.display_name}</h1>

            <div className="space-y-4 mt-6">
              {/* Email */}
              <div className="flex items-center space-x-4">
                <Music2 className="w-6 h-6 text-green-400" />
                <p className="text-lg">{userProfile.email || 'No email available'}</p>
              </div>

              {/* Followers */}
              <div className="flex items-center space-x-4">
                <UsersRound className="w-6 h-6 text-green-400" />
                <p className="text-lg">
                  {userProfile.followers?.total.toLocaleString() || 0} Followers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
