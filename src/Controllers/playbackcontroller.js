const PlaybackService = require('../Services/playbackservice');

const playSong = async (req, res) => {
    try {
        const userId = req.user.id;
        const { songId } = req.body;
        const playbackInfo = await PlaybackService.playSong(userId, songId);
        res.status(200).json({ message: 'Playing song', playbackInfo });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const pauseSong = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await PlaybackService.pauseSong(userId);
        res.status(200).json({ message: 'Playback paused', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resumeSong = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await PlaybackService.resumeSong(userId);
        res.status(200).json({ message: 'Playback resumed', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const skipSong = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await PlaybackService.skipSong(userId);
        res.status(200).json({ message: 'Skipped to next song', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    playSong,
    pauseSong,
    resumeSong,
    skipSong,
};
