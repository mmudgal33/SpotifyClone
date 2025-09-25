const Queue = require('../Models/queuemodel');

const playSong = async (userId, songId) => {
    const queue = await Queue.findOne({ user: userId });
    if (!queue) throw new Error('Queue not found');
    queue.songs.unshift(songId);
    await queue.save();
    return queue.songs[0];
};

const pauseSong = async (userId) => {
    return { message: 'Playback paused' };
};

const resumeSong = async (userId) => {
    return { message: 'Playback resumed' };
};

const skipSong = async (userId) => {
    const queue = await Queue.findOne({ user: userId });
    if (!queue || queue.songs.length < 2) throw new Error('No songs to skip to');
    queue.songs.shift();
    await queue.save();
    return queue.songs[0];
};

module.exports = {
    playSong,
    pauseSong,
    resumeSong,
    skipSong,
};
