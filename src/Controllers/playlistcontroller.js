const PlaylistService = require('../Services/playlistservice');

const createPlaylist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        const playlist = await PlaylistService.createPlaylist(userId, name);
        res.status(201).json({ message: 'Playlist created successfully', playlist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPlaylists = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlists = await PlaylistService.getPlaylists(userId);
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;
        const updatedPlaylist = await PlaylistService.addSongToPlaylist(playlistId, songId);
        res.status(200).json({ message: 'Song added to playlist', updatedPlaylist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;
        const updatedPlaylist = await PlaylistService.removeSongFromPlaylist(playlistId, songId);
        res.status(200).json({ message: 'Song removed from playlist', updatedPlaylist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createPlaylist,
    getPlaylists,
    addSongToPlaylist,
    removeSongFromPlaylist,
};
