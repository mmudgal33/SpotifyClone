const User = require('../Models/usermodel');

const likeSong = async (userId, songId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (!user.likedSongs.includes(songId)) {
        user.likedSongs.push(songId);
        await user.save();
    }
    return user.likedSongs;
};

const getLikedSongs = async (userId) => {
    const user = await User.findById(userId).populate('likedSongs');
    if (!user) throw new Error('User not found');
    return user.likedSongs;
};

const removeLikedSong = async (userId, songId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.likedSongs = user.likedSongs.filter((id) => id.toString() !== songId);
    await user.save();
    return user.likedSongs;
};

module.exports = {
    likeSong,
    getLikedSongs,
    removeLikedSong,
};
