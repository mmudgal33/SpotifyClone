const Playlist = require('../Models/playlistmodel');

const createPlaylist = async (userId, name) => {
    const playlist = new Playlist({ user: userId, name });
    await playlist.save();
    return playlist;
};

const getPlaylists = async (userId) => {
    return Playlist.find({ user: userId });
};

const addSongToPlaylist = async (playlistId, songId) => {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new Error('Playlist not found');
    playlist.songs.push(songId);
    await playlist.save();
    return playlist;
};

const removeSongFromPlaylist = async (playlistId, songId) => {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new Error('Playlist not found');
    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();
    return playlist;
};

module.exports = {
    createPlaylist,
    getPlaylists,
    addSongToPlaylist,
    removeSongFromPlaylist,
};
